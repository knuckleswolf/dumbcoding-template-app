---
name: sync-agent-contract
description: Pull new agent instructions, skills, MCP settings, and agent-contract tooling from knuckleswolf/dumbcoding-template-app using the repository allowlist.
---

## When to use

Use when the user asks to update or sync template agent instructions/settings from
`knuckleswolf/dumbcoding-template-app`, including `.agents`, `.codex`, `.claude`, `.mcp.json`,
agent docs, brief docs, or the `tooling` folder.

## Workflow

1. Read the local diff first. This sync overwrites allowlisted instruction files, so know what local
   changes might be replaced.
2. Run a dry-run:
   `pnpm sync:agent-contract`
3. Decide optional files:
   - `package.json`: keep optional because it can change scripts, dependencies, runtime versions, and
     lockfile expectations. Include it only when syncing dependency/script policy intentionally.
     The script keeps local `name`, adds or updates scripts, and adds or updates dependency versions
     from upstream dependency sections.
4. Apply only after reviewing the dry-run:
   `pnpm sync:agent-contract --apply --include-package-json`
5. If `package.json` was included, run `pnpm install` to reconcile `pnpm-lock.yaml`; this is an
   intentional lockfile update, not a frozen prepare install.
6. Review `git diff`. Keep only reusable template/agent contract changes; do not keep upstream
   product-specific content.
7. Verify with `pnpm test:agents`. If `package.json`, tooling, or config changed, run
   `pnpm verify -- <changed files...>`.

## Script

Use `tooling/scripts/sync-agent-contract.mjs` through `pnpm sync:agent-contract`.

Safety defaults:

- dry-run unless `--apply` is passed;
- requires a clean worktree before apply unless `--allow-dirty` is passed;
- syncs only the hardcoded allowlist;
- stages all upstream files and merged `package.json` under local `.temp` before applying;
- reports `add`, `modify`, `remove`, and `unchanged` files in the allowlisted paths;
- skips `.DS_Store`;
- does not prune removed upstream files unless `--prune` is passed;
- on apply, updates `tooling/scripts/sync-agent-contract.mjs` first and restarts with the same
  arguments before applying any other changes.

Useful options:

- `--ref <ref>`: sync a branch, tag, or commit.
- `--path <path>`: sync one allowlisted root.
- `--include-package-json`: include `package.json`.
- `--list-paths`: print the active allowlist.
