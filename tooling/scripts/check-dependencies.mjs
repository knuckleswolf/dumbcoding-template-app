import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    if (!/\.tsx?$/u.test(entry.name)) return [];
    return [relative(workspaceRoot, path).replaceAll('\\', '/')];
  });
}

const result = spawnSync(
  'dependency-cruiser',
  ['-c', 'tooling/dependency-cruiser.config.mjs', '-T', 'json', 'src', 'tooling'],
  { cwd: workspaceRoot, encoding: 'utf8' },
);

if (result.error) throw result.error;
if (!result.stdout) throw new Error(result.stderr || 'dependency-cruiser produced no report');

const report = JSON.parse(result.stdout);
const scanned = new Set(report.modules.map((module) => module.source));
const missing = sourceFiles(join(workspaceRoot, 'src')).filter((path) => !scanned.has(path));

if (missing.length > 0) {
  throw new Error(`dependency-cruiser skipped TypeScript source files:\n${missing.join('\n')}`);
}

for (const violation of report.summary.violations) {
  console.error(`${violation.rule.name}: ${violation.from} -> ${violation.to}`);
}

if (result.status !== 0 || report.summary.error > 0) {
  process.exitCode = result.status || 1;
} else {
  console.log(
    `dependency graph checked: ${sourceFiles(join(workspaceRoot, 'src')).length} TypeScript source files, ${report.summary.totalDependenciesCruised} dependencies`,
  );
}
