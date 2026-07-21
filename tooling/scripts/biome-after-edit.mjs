#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// The js workspace root (this script lives in <js root>/tooling/scripts).
// Hooks run from the repo root, so both the package-manager detection and
// the biome invocation must anchor here, not on the caller's cwd.
const JS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

function detectPackageManager() {
  if (existsSync(resolve(JS_ROOT, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(resolve(JS_ROOT, 'yarn.lock')) && existsSync(resolve(JS_ROOT, '.yarnrc.yml')))
    return 'yarn';
  return 'pnpm';
}

function firstNonEmptyString(values) {
  for (const v of values) {
    if (typeof v === 'string' && v.trim().length > 0) return v.trim();
  }
  return '';
}

function extractPathFromJson(obj) {
  if (!obj || typeof obj !== 'object') return '';
  const direct = firstNonEmptyString([obj.file_path, obj.filePath, obj.path]);
  if (direct) return direct;

  const toolInput = obj.tool_input && typeof obj.tool_input === 'object' ? obj.tool_input : null;
  if (toolInput) {
    const fromTool = firstNonEmptyString([toolInput.path, toolInput.file_path, toolInput.filePath]);
    if (fromTool) return fromTool;
  }

  const event = obj.event && typeof obj.event === 'object' ? obj.event : null;
  if (event) {
    const fromEvent = firstNonEmptyString([event.file_path, event.filePath, event.path]);
    if (fromEvent) return fromEvent;
  }

  return '';
}

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function isBiomeRelevant(filePath) {
  const ext = extname(filePath).toLowerCase();
  return new Set([
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.mjs',
    '.cjs',
    '.json',
    '.jsonc',
    '.css',
    '.scss',
  ]).has(ext);
}

function runBiomeWrite(filePath) {
  const pm = detectPackageManager();
  const args = ['biome', 'check', '--write', filePath];
  const result = spawnSync(pm, args, { stdio: 'inherit', shell: false });
  if (result.status && result.status !== 0) process.exit(result.status);
}

const argvPath = process.argv[2];
if (typeof argvPath === 'string' && argvPath.trim().length > 0) {
  if (isBiomeRelevant(argvPath)) runBiomeWrite(argvPath.trim());
  process.exit(0);
}

const stdin = readStdin();
if (!stdin.trim()) process.exit(0);

let filePath = '';
try {
  const parsed = JSON.parse(stdin);
  filePath = extractPathFromJson(parsed);
} catch {
  filePath = stdin.trim().split(/\r?\n/)[0] ?? '';
}

if (!filePath || !isBiomeRelevant(filePath)) process.exit(0);
runBiomeWrite(filePath);
