# Design It Twice

When exploring alternative interfaces for a chosen deepening candidate, use this parallel sub-agent pattern. Based on "Design It Twice" (Ousterhout) — your first idea is unlikely to be the best.

Uses the vocabulary in [SKILL.md](SKILL.md) — **module**, **interface**, **seam**, **adapter**, **leverage**.

## Process

### 1. Frame the problem space

Write the constraints any new interface would need to satisfy, the dependency category (see [DEEPENING.md](DEEPENING.md)), and a rough sketch to ground those constraints — not a proposal.

### 2. Spawn sub-agents

Spawn 3+ sub-agents in parallel. Each must produce a **radically different** interface:

- Agent 1: Minimize the interface — 1–3 entry points max.
- Agent 2: Maximise flexibility.
- Agent 3: Optimise for the most common caller.
- Agent 4 (if applicable): Ports & adapters for cross-seam dependencies.

### 3. Present and compare

Contrast by **depth**, **locality**, and **seam placement**. Be opinionated about which design is strongest.
