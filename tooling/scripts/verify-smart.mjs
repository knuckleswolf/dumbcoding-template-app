#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { basename } from 'node:path';

const argvFiles = process.argv.slice(2).filter((value) => value && value !== '--');

const verifyExtensions = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.mts',
  '.cts',
  '.css',
  '.scss',
]);

const alwaysVerifyBasenames = new Set([
  'package.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'biome.json',
  'biome.jsonc',
  'turbo.json',
]);

function parseChangedFilesFromEnv() {
  const raw = process.env.CODEX_CHANGED_FILES ?? '';
  if (!raw.trim()) return [];

  return raw
    .split(/\r?\n|,/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function parseChangedFilesFromGit() {
  try {
    const output = execFileSync('git', ['diff', '--name-only', '--relative', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    return output
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function getExtension(filePath) {
  const lastDot = filePath.lastIndexOf('.');
  if (lastDot <= 0) return '';
  return filePath.slice(lastDot).toLowerCase();
}

function isVerifyRelevant(filePath) {
  const normalized = filePath.trim();
  if (!normalized) return false;

  if (alwaysVerifyBasenames.has(basename(normalized))) {
    return true;
  }

  if (normalized.includes('/tsconfig') && normalized.endsWith('.json')) {
    return true;
  }

  if (normalized.startsWith('tooling/')) {
    return true;
  }

  return verifyExtensions.has(getExtension(normalized));
}

function unique(values) {
  return [...new Set(values)];
}

const changedFiles = unique([
  ...argvFiles,
  ...parseChangedFilesFromEnv(),
  ...parseChangedFilesFromGit(),
]);

if (changedFiles.length === 0) {
  console.log('verify-smart: no changed files detected, skipping full verification.');
  console.log(
    'verify-smart: pass files via `pnpm verify -- <files...>` or use `pnpm verify:all`.',
  );
  process.exit(0);
}

const relevantFiles = changedFiles.filter(isVerifyRelevant);

if (relevantFiles.length === 0) {
  console.log(
    'verify-smart: changed files do not affect the verification whitelist, skipping full verification.',
  );
  for (const filePath of changedFiles) {
    console.log(`- ${filePath}`);
  }
  process.exit(0);
}

console.log('verify-smart: verification required due to these changed files:');
for (const filePath of relevantFiles) {
  console.log(`- ${filePath}`);
}

execFileSync('pnpm', ['run', 'verify:all'], { stdio: 'inherit' });
