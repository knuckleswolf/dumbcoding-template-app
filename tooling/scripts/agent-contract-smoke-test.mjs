import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const errors = [];

const requiredPaths = [
  '.mcp.json',
  'docs/brief.md',
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
  '.agents/skills/create-route-screen/SKILL.md',
  '.agents/skills/create-feature/SKILL.md',
  '.agents/skills/project-intake/SKILL.md',
  '.agents/skills/seo/SKILL.md',
  '.agents/skills/create-feature/templates/[feature-name]/[feature-name].model.ts.template',
  '.agents/skills/create-feature/templates/[feature-name]/[feature-name].types.ts.template',
  '.agents/skills/create-feature/templates/[feature-name]/[feature-name].schema.ts.template',
  '.agents/skills/create-feature/templates/[feature-name]/[feature-name].constants.ts.template',
  '.agents/skills/create-feature/templates/[feature-name]/[feature-name].hooks.ts.template',
  '.agents/skills/create-feature/templates/[feature-name]/index.ts.template',
  '.agents/skills/create-feature/templates/[feature-name]/__tests__/[feature-name].model.test.ts.template',
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
  'AGENTS.md',
  'CONVENTION.md',
  'README.md',
  'docs/brief.md',
  'docs/features/README.md',
  '.agents/skills/create-api-layer/SKILL.md',
  '.agents/skills/create-component/SKILL.md',
  '.agents/skills/create-component/templates/README.md',
  '.agents/skills/create-ui-primitive/SKILL.md',
  '.agents/skills/create-ui-primitive/templates/README.md',
  '.agents/skills/create-route-screen/SKILL.md',
  '.agents/skills/create-feature/SKILL.md',
  '.agents/skills/project-intake/SKILL.md',
  '.agents/skills/seo/SKILL.md',
];

const forbiddenDocMarkers = [
  'create-adapter-factory',
  'verify-contrast',
  'check:contrast',
  'Read first:** `docs/product.md`',
  'docs/product update',
  'guided checklist in `docs/product.md`',
];

const requiredDocMarkers = [
  {
    path: 'AGENTS.md',
    markers: [
      'project-intake` skill using `docs/brief.md`, then create `docs/product.md`',
      'route-screen > feature capability/entry > product component > UI primitive > Ark UI > native DOM',
      'Components and UI primitives must not import from `src/features/*`',
      '`src/lib` and `src/utils` contain no UI',
      'Use Tailwind utilities for feature/component styling',
      'Use Ark UI through `src/ui/*` primitives',
      'UI primitives are styled slot APIs',
      'move stable shared contracts to `src/lib` or `src/types`',
      'Use Zod for runtime validation schemas',
      'Before implementing Ark-based primitives/components',
    ],
  },
  {
    path: 'README.md',
    markers: [
      'run the `project-intake` skill using `docs/brief.md`, then create',
      '`docs/product.md` is created during intake',
      'features, route-screens, components, UI primitives',
      'Ark UI MCP is configured in `.mcp.json`',
    ],
  },
  {
    path: 'docs/brief.md',
    markers: ['create `docs/product.md`', '## Required First Quiz', '## Guided Rounds'],
  },
  {
    path: '.agents/skills/project-intake/SKILL.md',
    markers: ['Read first:** `docs/brief.md`', 'Create `docs/product.md`', 'Do not reuse fixed generic labels'],
  },
  {
    path: '.agents/skills/create-feature/SKILL.md',
    markers: ['thin pass-through', 'all UI in features/components', 'zero Ark UI or zero primitives has an approved exception'],
  },
  {
    path: '.agents/skills/create-route-screen/SKILL.md',
    markers: ['TanStack route file is the screen boundary', 'route may mount that feature entry', 'workbench/shell components'],
  },
  {
    path: '.agents/skills/create-component/SKILL.md',
    markers: ['Components must not import `src/features/*`', 'slot-first `src/ui/*` primitive wrapper', 'Style with Tailwind/shared primitives'],
  },
  {
    path: '.agents/skills/create-ui-primitive/SKILL.md',
    markers: ['inspect `package.json`, existing UI folders, and the configured Ark UI', 'Prefer slot-first APIs', 'target Ark Root/part type'],
  },
];

const lineLimitsByPath = {
  'AGENTS.md': 180,
  'CONVENTION.md': 260,
  'API_CONVENTION.md': 260,
  'AI_STYLEGUIDE.md': 180,
  'docs/brief.md': 160,
  'docs/product.md': 160,
  '.agents/skills': 120,
};

const skillResourceRoots = [
  '.agents/skills/create-api-layer/templates',
  '.agents/skills/create-api-layer/examples',
  '.agents/skills/create-component/templates',
  '.agents/skills/create-component/examples',
  '.agents/skills/create-ui-primitive/templates',
  '.agents/skills/create-ui-primitive/examples',
  '.agents/skills/create-feature/templates',
];

const resolvePath = (path) => join(workspaceRoot, path);

const readText = (path) => readFileSync(resolvePath(path), 'utf8');

const countLines = (content) => {
  if (content.length === 0) {
    return 0;
  }

  return content.replace(/\n$/u, '').split(/\r?\n/u).length;
};

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
  for (const marker of forbiddenDocMarkers) {
    if (content.includes(marker)) {
      errors.push(`Forbidden stale marker found in ${path}: ${marker}`);
    }
  }
  if (content.includes('templates/create-component/[component-name]')) {
    errors.push(`Stale create-component template path in ${path}`);
  }
  if (content.includes('templates/create-ui-primitive/[component-name]')) {
    errors.push(`Stale create-ui-primitive template path in ${path}`);
  }
}

for (const { path, markers } of requiredDocMarkers) {
  const content = readText(path);
  for (const marker of markers) {
    if (!content.includes(marker)) {
      errors.push(`Required instruction marker missing in ${path}: ${marker}`);
    }
  }
}

const skillDirectories = readdirSync(resolvePath('.agents/skills'));
const skillLineLimit = lineLimitsByPath['.agents/skills'];
for (const skillDirectory of skillDirectories) {
  const skillPath = `.agents/skills/${skillDirectory}/SKILL.md`;
  if (existsSync(resolvePath(skillPath))) {
    lineLimitsByPath[skillPath] = skillLineLimit;
  }
}

for (const [path, max] of Object.entries(lineLimitsByPath)) {
  if (!existsSync(resolvePath(path))) {
    continue;
  }

  if (statSync(resolvePath(path)).isDirectory()) {
    continue;
  }

  const lineCount = countLines(readText(path));
  if (lineCount > max) {
    errors.push(`${path} has ${lineCount} lines, expected at most ${max}`);
  }
}

const filesToScan = skillResourceRoots.flatMap((root) => listFiles(root));
for (const path of filesToScan) {
  const content = readText(path);
  if (/\bReact\.[A-Za-z]/u.test(content)) {
    errors.push(`React namespace type/value usage found in ${path}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('agent contract smoke test passed');
}
