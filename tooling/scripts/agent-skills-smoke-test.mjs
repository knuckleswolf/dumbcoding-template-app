import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const errors = [];

const requiredPaths = [
  '.agents/skills/create-component/templates/[component-name]/[component-name].tsx.template',
  '.agents/skills/create-component/templates/[component-name]/[component-name].types.ts.template',
  '.agents/skills/create-component/templates/[component-name]/index.ts.template',
  '.agents/skills/create-component/templates/[component-name]/__tests__/[component-name].test.tsx.template',
  '.agents/skills/create-component/examples/repository-card/__tests__/repository-card.test.tsx',
  '.agents/skills/create-ui-primitive/templates/[component-name]/[component-name].tsx.template',
  '.agents/skills/create-ui-primitive/templates/[component-name]/[component-name].types.ts.template',
  '.agents/skills/create-ui-primitive/templates/[component-name]/index.ts.template',
  '.agents/skills/create-ui-primitive/templates/[component-name]/__tests__/[component-name].test.tsx.template',
  '.agents/skills/create-ui-primitive/examples/badge/__tests__/badge.test.tsx',
  '.agents/skills/create-api-layer/templates/[domain]/[domain].api-client.ts.template',
  '.agents/skills/create-api-layer/templates/[domain]/[domain].query.ts.template',
  '.agents/skills/create-api-layer/templates/[domain]/methods/[method-name].ts.template',
  '.agents/skills/create-api-layer/templates/[domain]/methods/index.ts.template',
  '.agents/skills/create-api-layer/templates/[domain]/methods/__tests__/[method-name].test.ts.template',
  '.agents/skills/create-api-layer/templates/[domain]/hooks/use-[method-name]-query.ts.template',
  '.agents/skills/create-api-layer/templates/[domain]/hooks/use-[method-name]-mutation.ts.template',
  '.agents/skills/create-api-layer/examples/github-api/github-api.api-client.ts',
  '.agents/skills/create-api-layer/examples/github-api/github-api.query.ts',
  '.agents/skills/create-api-layer/examples/github-api/methods/fetch-repos.ts',
  '.agents/skills/create-api-layer/examples/github-api/methods/fetch-repo-detail.ts',
  '.agents/skills/create-api-layer/examples/github-api/methods/star-repo.ts',
  '.agents/skills/create-api-layer/examples/github-api/methods/unstar-repo.ts',
  '.agents/skills/create-api-layer/examples/github-api/hooks/use-repos-query.ts',
  '.agents/skills/create-api-layer/examples/github-api/hooks/use-repo-detail-query.ts',
  '.agents/skills/create-api-layer/examples/github-api/hooks/use-star-repo-mutation.ts',
  '.agents/skills/create-api-layer/examples/github-api/hooks/use-unstar-repo-mutation.ts',
  '.agents/skills/create-api-layer/examples/github-api/methods/__tests__/fetch-repo-detail.test.ts',
  '.agents/skills/create-api-layer/examples/github-api/methods/__tests__/fetch-repos.test.ts',
  '.agents/skills/create-api-layer/examples/github-api/methods/__tests__/star-repo.test.ts',
  '.agents/skills/create-api-layer/examples/github-api/methods/__tests__/unstar-repo.test.ts',
];

const forbiddenPaths = [
  '.agents/skills/create-component/templates/create-component',
  '.agents/skills/create-ui-primitive/templates/create-ui-primitive',
  '.agents/skills/create-component/examples/repository-card/repository-card.test.tsx',
  '.agents/skills/create-api-layer/templates/[domain]/[domain].client.ts.template',
  '.agents/skills/create-api-layer/templates/[domain]/methods/[module].ts.template',
  '.agents/skills/create-api-layer/templates/[domain]/methods/__tests__/[module].test.ts.template',
  '.agents/skills/create-api-layer/templates/[domain]/hooks/query-client.ts.template',
  '.agents/skills/create-api-layer/templates/[domain]/hooks/use-[module]-query.ts.template',
  '.agents/skills/create-api-layer/templates/[domain]/hooks/use-[module]-mutation.ts.template',
  '.agents/skills/create-api-layer/examples/github-api/github-api.client.ts',
  '.agents/skills/create-api-layer/examples/github-api/hooks/query-client.ts',
  '.agents/skills/create-api-layer/examples/github-api/methods/repos.ts',
  '.agents/skills/create-api-layer/examples/github-api/hooks/use-repos-mutation.ts',
  '.agents/skills/create-api-layer/examples/github-api/methods/__tests__/repos.test.ts',
];

const docFiles = [
  '.agents/skills/create-component/SKILL.md',
  '.agents/skills/create-component/templates/README.md',
  '.agents/skills/create-ui-primitive/SKILL.md',
  '.agents/skills/create-ui-primitive/templates/README.md',
];

const skillResourceRoots = [
  '.agents/skills/create-api-layer/templates',
  '.agents/skills/create-api-layer/examples',
  '.agents/skills/create-component/templates',
  '.agents/skills/create-component/examples',
  '.agents/skills/create-ui-primitive/templates',
  '.agents/skills/create-ui-primitive/examples',
];

const resolvePath = (path) => join(workspaceRoot, path);

const readText = (path) => readFileSync(resolvePath(path), 'utf8');

const listFiles = (path) => {
  const absolutePath = resolvePath(path);
  const entries = readdirSync(absolutePath);
  const files = [];

  for (const entry of entries) {
    const entryPath = join(absolutePath, entry);
    const stat = statSync(entryPath);
    if (stat.isDirectory()) {
      files.push(...listFiles(relative(workspaceRoot, entryPath)));
    } else {
      files.push(relative(workspaceRoot, entryPath));
    }
  }

  return files;
};

for (const path of requiredPaths) {
  if (!existsSync(resolvePath(path))) {
    errors.push(`Missing required path: ${path}`);
  }
}

for (const path of forbiddenPaths) {
  if (existsSync(resolvePath(path))) {
    errors.push(`Forbidden path still exists: ${path}`);
  }
}

for (const path of docFiles) {
  const content = readText(path);
  if (content.includes('templates/create-component/[component-name]')) {
    errors.push(`Stale create-component template path in ${path}`);
  }
  if (content.includes('templates/create-ui-primitive/[component-name]')) {
    errors.push(`Stale create-ui-primitive template path in ${path}`);
  }
}

const filesToScan = skillResourceRoots.flatMap((root) => listFiles(root));
for (const path of filesToScan) {
  const content = readText(path);
  if (/\bReact\.[A-Za-z]/u.test(content)) {
    errors.push(`React namespace type/value usage found in ${path}`);
  }
}

const sharedTsconfigPath = 'packages/tsconfig/tsconfig.base.json';
if (existsSync(resolvePath(sharedTsconfigPath))) {
  const tsconfig = JSON.parse(readText(sharedTsconfigPath));
  if (!Array.isArray(tsconfig.exclude) || !tsconfig.exclude.includes('.agents')) {
    errors.push(`${sharedTsconfigPath} must exclude .agents`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('agent skills smoke test passed');
}
