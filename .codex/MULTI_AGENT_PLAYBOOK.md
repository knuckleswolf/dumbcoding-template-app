# Multi-Agent Playbook

This playbook defines how the coordinating agent should choose subagent count, ownership, and verification scope.

## Core rule

Launch subagents only when the task can be partitioned into non-overlapping ownership boundaries.

Good ownership boundaries:
- one package
- one module subtree
- one isolated config area
- one explicit file list

Bad ownership boundaries:
- vague business areas with shared files
- overlapping barrels or root exports
- shared test utilities without a clear owner

## Agent selection

- `default`: coordinator, integrator, and final verifier
- `explorer`: read-only analysis, review, dependency tracing, risk mapping
- `worker`: implementation within one assigned write set

## Launch heuristic

### 0 subagents

Use no subagents when:
- the task is answer-only
- the change is tiny or single-file
- the write set is obviously smaller than the delegation overhead

### 1 explorer

Use one `explorer` when:
- the scope is unclear
- file targeting is uncertain
- the task is review-only
- the main risk is analysis, not implementation

### 1 worker

Use one `worker` when:
- implementation is needed
- the write set is isolated
- the coordinator does not need parallel read-side analysis

### 1 explorer + 1 worker

Use this when:
- implementation is needed
- the scope is moderately ambiguous
- the worker can proceed on a bounded slice while the explorer checks risks or collateral impact

### 2 workers

Use two `worker`s only when:
- there are two clearly disjoint write sets
- each set has a clean ownership boundary
- integration happens later in one place

### 1 explorer + 2 workers

Use this for broader tasks when:
- there are multiple isolated write sets
- one agent is useful for read-only dependency and regression analysis
- the coordinator still retains ownership of shared files and final verification

Avoid going beyond this unless the task has unusually clean partitioning.

## Ownership rules

- assign ownership before spawning
- each `worker` owns exactly one write set
- do not assign the same file, barrel, or root config to multiple workers
- keep shared merge points under the coordinator whenever possible
- if ownership becomes ambiguous during execution, stop delegation expansion and re-centralize the merge point

## Verification rules

- workers run only local file-level formatting on the files they changed
- workers do not run repo-wide verification
- the coordinator aggregates the final changed file set
- the coordinator runs `pnpm verify -- <changed files...>` only if the combined change set intersects the verification whitelist
- the coordinator runs `pnpm verify:all` only for unconditional full-repo validation
- verification uses terminating non-watch test scripts

## Abstract scenarios

### Scenario 1: scope unknown

- launch: `default` + 1 `explorer`
- outcome: identify file targets and risks before implementation

### Scenario 2: isolated implementation

- launch: `default` + 1 `worker`
- outcome: one bounded code change, no parallel decomposition needed

### Scenario 3: analysis plus bounded implementation

- launch: `default` + 1 `explorer` + 1 `worker`
- outcome: the worker executes while the explorer checks blast radius and test gaps

### Scenario 4: two disjoint implementations

- launch: `default` + 2 `worker`s
- outcome: parallel implementation on two non-overlapping write sets

### Scenario 5: risky cross-cutting task

- launch: `default` + 1 `explorer` + 2 `worker`s
- outcome: the explorer traces risks while each worker owns one isolated slice

### Scenario 6: review-only pass

- launch: `default` + 1 or 2 `explorer`s
- outcome: parallel read-only review without implementation agents
