# AGENT.md

Single entrypoint for AI coding agents that look for this filename.

## Always Do First

1. Read `AGENTS.md` and `CONVENTION.md`.
2. Read `AI_STYLEGUIDE.md` for non-trivial implementation or review work.
3. Read `API_CONVENTION.md` when touching API or query code.
4. Read `docs/product.md` only when product/demo behavior matters.
5. Check local `tsconfig.json`, `tsconfig*.json`, and `biome.json` when relevant.
6. Do not scan the whole repo by default; read only what you need.

## Output Format

- Plan - 3 to 7 bullets for non-trivial work.
- Changes - file list plus what changed.
- Verification - commands run.
- Risks/follow-ups - short and concrete.
