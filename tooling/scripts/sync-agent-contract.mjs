#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const tempRoot = join(workspaceRoot, '.temp');
const DEFAULT_SOURCE = 'https://github.com/knuckleswolf/dumbcoding-template-app.git';
const SELF_UPDATE_PATH = 'tooling/scripts/sync-agent-contract.mjs';
const SELF_UPDATE_ENV = 'SYNC_AGENT_CONTRACT_RESTARTED';

const BASE_PATHS = [
  '.agents',
  '.codex',
  '.claude',
  '.mcp.json',
  'AGENTS.md',
  'API_CONVENTION.md',
  'CONVENTION.md',
  'docs/brief.md',
  'docs/features/README.md',
  'tooling',
];

const OPTIONAL_PATHS = {
  packageJson: 'package.json',
};

const IGNORED_NAMES = new Set(['.DS_Store', '.git']);
const PACKAGE_DEPENDENCY_SECTIONS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

const options = {
  allowDirty: false,
  apply: false,
  includePackageJson: false,
  listPaths: false,
  paths: [],
  prune: false,
  ref: '',
  source: DEFAULT_SOURCE,
};

function printHelp() {
  console.log(`Usage: pnpm sync:agent-contract [options]

Fetch agent instructions/settings from the template upstream allowlist.

Options:
  --apply                 Write files. Default is dry-run.
  --allow-dirty           Allow applying with local uncommitted changes.
  --include-package-json  Merge scripts and dependency versions, then run pnpm install.
  --list-paths            Print the allowlist and exit.
  --path <path>           Sync one allowlisted path. Repeatable.
  --prune                 Remove local files missing from the upstream allowlisted paths.
  --ref <ref>             Fetch a specific branch, tag, or commit.
  --source <url>          Git source. Default: ${DEFAULT_SOURCE}
  --help                  Show this help.
`);
}

function parseArgs(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--') continue;
    if (arg === '--apply') options.apply = true;
    else if (arg === '--allow-dirty') options.allowDirty = true;
    else if (arg === '--include-package-json') options.includePackageJson = true;
    else if (arg === '--list-paths') options.listPaths = true;
    else if (arg === '--prune') options.prune = true;
    else if (arg === '--help') {
      printHelp();
      process.exit(0);
    } else if (arg === '--path') {
      const value = argv[index + 1];
      if (!value) throw new Error('--path requires a value');
      options.paths.push(normalizePath(value));
      index += 1;
    } else if (arg === '--ref') {
      const value = argv[index + 1];
      if (!value) throw new Error('--ref requires a value');
      options.ref = value;
      index += 1;
    } else if (arg === '--source') {
      const value = argv[index + 1];
      if (!value) throw new Error('--source requires a value');
      options.source = value;
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
}

function normalizePath(path) {
  return path.replace(/^\.\/+/u, '').replace(/\/+$/u, '');
}

function getAllowedPaths() {
  const paths = [...BASE_PATHS];
  if (options.includePackageJson) paths.push(OPTIONAL_PATHS.packageJson);

  if (options.paths.length === 0) return paths;

  for (const path of options.paths) {
    if (!isAllowlistedPath(path, paths)) {
      throw new Error(`Path is not in the sync allowlist: ${path}`);
    }
  }

  return options.paths;
}

function isAllowlistedPath(path, allowedRoots) {
  return allowedRoots.some((root) => path === root || path.startsWith(`${root}/`));
}

function run(command, args, cwd = workspaceRoot) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function ensureCleanWorktree() {
  if (!options.apply || options.allowDirty || process.env[SELF_UPDATE_ENV] === '1') return;

  const status = run('git', ['status', '--porcelain']).trim();
  if (status) {
    throw new Error('Working tree is dirty. Commit/stash changes or pass --allow-dirty.');
  }
}

function createWorkspaceTempDir(prefix) {
  mkdirSync(tempRoot, { recursive: true });
  return mkdtempSync(join(tempRoot, `${prefix}-`));
}

function cloneSource(paths) {
  const checkoutPath = createWorkspaceTempDir('agent-contract-sync');
  try {
    run('git', [
      'clone',
      '--filter=blob:none',
      '--sparse',
      '--depth',
      '1',
      options.source,
      checkoutPath,
    ]);
    run('git', ['sparse-checkout', 'set', '--no-cone', ...paths], checkoutPath);

    if (options.ref) {
      run('git', ['fetch', '--depth', '1', 'origin', options.ref], checkoutPath);
      run('git', ['checkout', 'FETCH_HEAD'], checkoutPath);
    }

    return checkoutPath;
  } catch (error) {
    rmSync(checkoutPath, { force: true, recursive: true });
    throw error;
  }
}

async function listFiles(root, relativeRoot = '') {
  const absoluteRoot = join(root, relativeRoot);
  if (!existsSync(absoluteRoot)) return [];
  if (!statSync(absoluteRoot).isDirectory()) return [relativeRoot];

  const entries = await readdir(absoluteRoot, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (IGNORED_NAMES.has(entry.name)) continue;

    const child = join(relativeRoot, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(root, child)));
    } else {
      files.push(child);
    }
  }

  return files;
}

function readIfExists(path) {
  if (!existsSync(path) || statSync(path).isDirectory()) return null;
  return readFileSync(path);
}

function classifyFile(stagedRoot, relativePath) {
  const sourceFile = join(stagedRoot, relativePath);
  const targetFile = join(workspaceRoot, relativePath);
  const sourceContent = readIfExists(sourceFile);
  const targetContent = readIfExists(targetFile);

  if (!sourceContent && targetContent) return 'remove';
  if (!sourceContent) return 'missing-source';
  if (!targetContent) return 'add';
  return sourceContent.equals(targetContent) ? 'unchanged' : 'modify';
}

function restartWithUpdatedScript(stagedRoot, changes) {
  if (!options.apply || !(changes.get('modify') ?? []).includes(SELF_UPDATE_PATH)) return false;

  const stagedScriptPath = join(stagedRoot, SELF_UPDATE_PATH);
  const workspaceScriptPath = join(workspaceRoot, SELF_UPDATE_PATH);
  cpSync(stagedScriptPath, workspaceScriptPath, {
    dereference: false,
    errorOnExist: false,
    force: true,
  });

  console.log(`self-update: copied ${SELF_UPDATE_PATH}; restarting sync`);
  execFileSync(process.execPath, [workspaceScriptPath, ...process.argv.slice(2)], {
    cwd: workspaceRoot,
    env: { ...process.env, [SELF_UPDATE_ENV]: '1' },
    stdio: 'inherit',
  });

  return true;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function createMergedPackageJson(sourceRoot) {
  const sourcePath = join(sourceRoot, OPTIONAL_PATHS.packageJson);
  const targetPath = join(workspaceRoot, OPTIONAL_PATHS.packageJson);
  if (!existsSync(sourcePath)) return null;

  const sourcePackage = readJson(sourcePath);
  const targetPackage = existsSync(targetPath) ? readJson(targetPath) : {};
  const mergedPackage = { ...targetPackage };

  if (sourcePackage.scripts && typeof sourcePackage.scripts === 'object') {
    mergedPackage.scripts = { ...(targetPackage.scripts ?? {}) };
    for (const [scriptName, scriptCommand] of Object.entries(sourcePackage.scripts)) {
      if (mergedPackage.scripts[scriptName] !== scriptCommand) {
        mergedPackage.scripts[scriptName] = scriptCommand;
      }
    }
  }

  for (const sectionName of PACKAGE_DEPENDENCY_SECTIONS) {
    const sourceSection = sourcePackage[sectionName];
    if (!sourceSection || typeof sourceSection !== 'object') continue;

    mergedPackage[sectionName] = { ...(targetPackage[sectionName] ?? {}) };
    for (const [dependencyName, dependencyVersion] of Object.entries(sourceSection)) {
      if (mergedPackage[sectionName][dependencyName] !== dependencyVersion) {
        mergedPackage[sectionName][dependencyName] = dependencyVersion;
      }
    }
  }

  if (targetPackage.name !== undefined) {
    mergedPackage.name = targetPackage.name;
  }

  return {
    content: `${JSON.stringify(mergedPackage, null, 2)}\n`,
  };
}

function stagePath(sourceRoot, stagedRoot, path) {
  if (path === OPTIONAL_PATHS.packageJson && options.includePackageJson) {
    const mergeResult = createMergedPackageJson(sourceRoot);
    if (mergeResult) {
      const targetPath = join(stagedRoot, OPTIONAL_PATHS.packageJson);
      mkdirSync(dirname(targetPath), { recursive: true });
      writeFileSync(targetPath, mergeResult.content);
    }
    return;
  }

  const sourcePath = join(sourceRoot, path);
  const targetPath = join(stagedRoot, path);
  if (!existsSync(sourcePath)) return;

  mkdirSync(dirname(targetPath), { recursive: true });
  cpSync(sourcePath, targetPath, {
    dereference: false,
    errorOnExist: false,
    filter: (source) => !IGNORED_NAMES.has(source.split('/').at(-1) ?? ''),
    force: true,
    recursive: true,
  });
}

function copyStagedPath(stagedRoot, path) {
  const sourcePath = join(stagedRoot, path);
  const targetPath = join(workspaceRoot, path);

  if (options.prune && existsSync(targetPath)) {
    rmSync(targetPath, { force: true, recursive: true });
  }

  if (!existsSync(sourcePath)) return;

  cpSync(sourcePath, targetPath, {
    dereference: false,
    errorOnExist: false,
    filter: (source) => !IGNORED_NAMES.has(source.split('/').at(-1) ?? ''),
    force: true,
    recursive: true,
  });
}

function printList(title, values) {
  console.log(title);
  for (const value of values) {
    console.log(`- ${value}`);
  }
}

parseArgs(process.argv.slice(2));
const allowedPaths = getAllowedPaths();

if (options.listPaths) {
  printList('sync allowlist:', allowedPaths);
  process.exit(0);
}

ensureCleanWorktree();

const sourceRoot = cloneSource(allowedPaths);
const stagedRoot = createWorkspaceTempDir('agent-contract-stage');
const copiedPaths = [];
const missingPaths = [];
const scannedFiles = new Set();

try {
  for (const path of allowedPaths) {
    const sourcePath = join(sourceRoot, path);
    if (!existsSync(sourcePath)) {
      missingPaths.push(path);
      continue;
    }

    stagePath(sourceRoot, stagedRoot, path);
    for (const relativePath of await listFiles(stagedRoot, path)) {
      scannedFiles.add(relativePath);
    }
  }

  for (const path of allowedPaths) {
    for (const relativePath of await listFiles(workspaceRoot, path)) {
      scannedFiles.add(relativePath);
    }
  }

  const changes = new Map();
  for (const relativePath of scannedFiles) {
    const status = classifyFile(stagedRoot, relativePath);
    if (!changes.has(status)) changes.set(status, []);
    changes.get(status).push(relativePath);
  }

  for (const files of changes.values()) {
    files.sort();
  }

  const restarted = restartWithUpdatedScript(stagedRoot, changes);

  if (!restarted) {
    if (options.apply) {
      for (const path of allowedPaths) {
        copyStagedPath(stagedRoot, path);
        copiedPaths.push(path);
      }
    }

    console.log(options.apply ? 'agent contract sync applied' : 'agent contract sync dry-run');
    console.log(`source: ${options.source}${options.ref ? `#${options.ref}` : ''}`);

    for (const status of ['add', 'modify', 'remove', 'unchanged']) {
      const files = changes.get(status) ?? [];
      if (files.length > 0) printList(`${status}:`, files);
    }

    if (missingPaths.length > 0) printList('missing upstream paths:', missingPaths);
    if (copiedPaths.length > 0) printList('copied allowlist roots:', copiedPaths);
    if ((changes.get('remove') ?? []).length > 0 && !options.prune) {
      console.log('upstream removals were preserved; pass --prune with --apply to remove them');
    }
    if (options.apply && options.includePackageJson) {
      console.log('package.json was included; run `pnpm install` to reconcile pnpm-lock.yaml.');
    }
    if (!options.apply) console.log('pass --apply to write these allowlisted paths');
  }
} finally {
  rmSync(stagedRoot, { force: true, recursive: true });
  rmSync(sourceRoot, { force: true, recursive: true });
}
