import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const testRoot = dirname(fileURLToPath(import.meta.url));
const sourceScriptPath = join(testRoot, '..', 'sync-agent-contract.mjs');
const temporaryDirectories = [];

function createTemporaryDirectory(prefix) {
  const path = mkdtempSync(join(tmpdir(), prefix));
  temporaryDirectories.push(path);
  return path;
}

function writeFixture(root, relativePath, content) {
  const path = join(root, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function createUpstream(files) {
  const root = createTemporaryDirectory('agent-contract-upstream-');
  for (const [path, content] of Object.entries(files)) {
    writeFixture(root, path, content);
  }

  execFileSync('git', ['init', '--initial-branch=main'], { cwd: root });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: root });
  execFileSync('git', ['config', 'user.name', 'Sync Test'], { cwd: root });
  execFileSync('git', ['add', '.'], { cwd: root });
  execFileSync('git', ['commit', '-m', 'fixture'], { cwd: root });
  return root;
}

function createWorkspace(files) {
  const root = createTemporaryDirectory('agent-contract-workspace-');
  const scriptPath = join(root, 'tooling/scripts/sync-agent-contract.mjs');
  mkdirSync(dirname(scriptPath), { recursive: true });
  cpSync(sourceScriptPath, scriptPath);

  for (const [path, content] of Object.entries(files)) {
    writeFixture(root, path, content);
  }

  return { root, scriptPath };
}

function runSync(scriptPath, args) {
  return execFileSync(process.execPath, [scriptPath, ...args], {
    cwd: dirname(dirname(dirname(scriptPath))),
    encoding: 'utf8',
  });
}

afterEach(() => {
  for (const path of temporaryDirectories.splice(0)) {
    rmSync(path, { force: true, recursive: true });
  }
});

describe('sync-agent-contract', () => {
  it('reports and copies a file added to an existing allowlisted directory', () => {
    const upstream = createUpstream({
      '.agents/added.md': 'upstream only\n',
      '.agents/kept.md': 'same\n',
    });
    const { root, scriptPath } = createWorkspace({ '.agents/kept.md': 'same\n' });

    const dryRunOutput = runSync(scriptPath, [
      '--source',
      upstream,
      '--path',
      '.agents',
    ]);

    expect(dryRunOutput).toContain('add:\n- .agents/added.md');
    expect(existsSync(join(root, '.agents/added.md'))).toBe(false);

    runSync(scriptPath, [
      '--source',
      upstream,
      '--path',
      '.agents',
      '--apply',
      '--allow-dirty',
    ]);

    expect(readFileSync(join(root, '.agents/added.md'), 'utf8')).toBe('upstream only\n');
    expect(existsSync(join(root, '.agents/.agents/added.md'))).toBe(false);
  });

  it('reports and prunes files removed from an allowlisted upstream directory', () => {
    const upstream = createUpstream({ '.agents/kept.md': 'same\n' });
    const { root, scriptPath } = createWorkspace({
      '.agents/kept.md': 'same\n',
      '.agents/removed.md': 'local only\n',
    });

    const dryRunOutput = runSync(scriptPath, [
      '--source',
      upstream,
      '--path',
      '.agents',
    ]);

    expect(dryRunOutput).toContain('remove:\n- .agents/removed.md');
    expect(existsSync(join(root, '.agents/removed.md'))).toBe(true);

    runSync(scriptPath, [
      '--source',
      upstream,
      '--path',
      '.agents',
      '--apply',
      '--allow-dirty',
      '--prune',
    ]);

    expect(existsSync(join(root, '.agents/removed.md'))).toBe(false);
    expect(readFileSync(join(root, '.agents/kept.md'), 'utf8')).toBe('same\n');
  });

  it('copies only an updated sync script before restarting with the same arguments', () => {
    const currentScript = readFileSync(sourceScriptPath, 'utf8');
    const restartEnvironmentDeclaration =
      "const SELF_UPDATE_ENV = 'SYNC_AGENT_CONTRACT_RESTARTED';";
    const replacementScript = currentScript.replace(
      restartEnvironmentDeclaration,
      `${restartEnvironmentDeclaration}
console.log(\`restarted args: \${process.argv.slice(2).join(' ')}\`);
console.log(
  \`other content before resumed apply: \${readFileSync(join(workspaceRoot, 'tooling/other.txt'), 'utf8').trim()}\`,
);`,
    );
    const upstream = createUpstream({
      'tooling/other.txt': 'upstream\n',
      'tooling/scripts/sync-agent-contract.mjs': replacementScript,
    });
    const { root, scriptPath } = createWorkspace({ 'tooling/other.txt': 'local\n' });

    const output = runSync(scriptPath, [
      '--source',
      upstream,
      '--path',
      'tooling',
      '--apply',
      '--allow-dirty',
    ]);

    expect(output).toContain(
      'self-update: copied tooling/scripts/sync-agent-contract.mjs; restarting sync',
    );
    expect(output).toContain(`restarted args: --source ${upstream} --path tooling --apply --allow-dirty`);
    expect(output).toContain('other content before resumed apply: local');
    expect(readFileSync(scriptPath, 'utf8')).toBe(replacementScript);
    expect(readFileSync(join(root, 'tooling/other.txt'), 'utf8')).toBe('upstream\n');
  });
});
