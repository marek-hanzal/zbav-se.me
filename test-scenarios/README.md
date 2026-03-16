# Test Scenarios

This directory is the source of truth for repository-level agent-driven end-to-end scenario files.

Every scenario in this suite must follow the contract defined in this document. If this README changes, existing scenario files must be updated to match the latest version.

## Purpose

The suite exists to store standalone Markdown scenarios that an agent can execute end to end without relying on hidden context, undocumented setup, or another scenario being run first.

Each scenario must give the agent enough information to:

- prepare the required local environment
- seed or mutate data
- open the correct browser sessions
- act as one or more actors
- verify the expected outcomes
- clean up after the run when needed

## Design Principle

Prefer scenarios that validate product behavior over scenarios that merely replicate UI choreography.

## Core Rules

- Write every scenario in English.
- Keep every scenario standalone.
- Build every scenario in planning mode together with the operator before writing the final scenario file.
- Do not commit planning notes or draft planning output as a scenario file.
- Do not assume the agent knows repo-specific conventions unless the scenario states them explicitly.
- Do not rely on another scenario file for setup, seed data, actors, or assertions.
- Use explicit commands, URLs, actor names, and expected results.
- Separate environment setup, browser interaction, assertions, and cleanup into dedicated sections.
- Treat lifecycle rules, hard gates, bans, sensitivity, and terminal states as hard constraints.
- Prefer existing repo tooling over ad-hoc instructions.

## Repository Context

Scenario authors should use the real repository entry points that already exist:

- Local infrastructure: `docker-compose.yml`
- Root commands: `bun run dev`, `bun run seed:core`, `bun run seed:interaction`
- Local URLs:
  - Web: `http://localhost:3030`
  - App: `http://localhost:3031`
  - API: `http://localhost:3032`
  - OpenAPI docs: `http://localhost:3032/docs`
- Domain guidance for agent reasoning:
  - `MASTER.md`
  - `apps/server/public/mcp/guide/*`
  - `apps/server/public/mcp/profile/*`

Use those references when they reduce ambiguity. Do not dump irrelevant repo context into a scenario.

## Required Scenario Contract

Every scenario file must contain the sections below in this order.

### 1. Scenario Metadata

This section must identify the scenario clearly.

Required fields:

- `Scenario ID`: stable identifier in kebab-case
- `Title`: short human-readable name
- `Intent`: one paragraph describing what behavior is being validated
- `Scope`: what the scenario covers and what it intentionally does not cover

### 2. Success Criteria

This section must define what makes the scenario pass.

Required content:

- a flat list of observable outcomes
- outcomes written as verifiable facts, not vague expectations
- outcomes that map to browser state, API state, database-visible effects, or cleanup-visible effects

### 3. Prerequisites

This section must state everything required before execution starts.

Required content:

- required local services
- required commands to start the environment
- required accounts, users, or secrets if applicable
- required initial repo state if the scenario depends on it

If something is optional, label it clearly as optional.

### 4. Actors

This section defines who participates in the scenario.

Required content:

- each actor name
- each actor role
- each actor permission boundary when relevant
- whether the actor uses an existing account or a seeded account
- which browser session belongs to that actor

If the scenario needs multiple tabs or windows for the same actor, state that explicitly.

This section should make it obvious what an actor can and cannot do in the scenario.

### 5. System State Model

This section defines where the agent should verify truth during execution and debugging.

Required content:

- the relevant UI state surfaces
- the relevant API state surfaces when applicable
- the relevant database-visible effects when applicable
- which surfaces are authoritative for pass or fail decisions

This section should help the agent answer "where do I verify this?" without guessing.

### 6. Environment and Data Setup

This section describes how the agent prepares the state before browser interaction starts.

Required content:

- exact commands to run
- seed commands or manual mutation steps
- explicit test data to create or locate
- test data ownership and uniqueness strategy
- any time-based setup required for lifecycle behavior

Rules:

- never say "seed as needed"
- never hide critical setup in prose outside this section
- if setup uses historical timestamps, state the exact target offsets or timestamps
- if setup cannot be done through existing repo commands, explain the manual fallback precisely
- setup should be idempotent whenever reasonably possible
- running setup twice must not break the scenario
- scenario test data should be uniquely identifiable
- prefer scenario-specific prefixes or markers such as `SCENARIO-<scenario-id>`

### 7. Browser Session Plan

This section defines the browser topology before step execution starts.

Required content:

- total number of sessions
- which actor is attached to each session
- target app or page for each session
- whether sessions must stay open concurrently
- whether sessions must stay isolated from each other
- page readiness signal for each session when relevant

The goal is to prevent ambiguity about how many active browser contexts the agent should control.

Session isolation rule:

- each session must use a separate browser context
- sessions must not share cookies or local storage unless the scenario explicitly requires it
- sessions must remain open until all assertions complete unless the scenario explicitly requires closing one
- sessions must not be refreshed unless the scenario explicitly requires a refresh

### 8. Deterministic Execution Rules

This section defines how the agent keeps execution stable and reproducible.

Required content:

- the visible precondition model for steps
- what the agent must wait for before acting
- selector or label strategy when the UI allows multiple targets
- retry policy for waits and assertions
- any timing guardrails needed to avoid race conditions

Hard rules:

- every execution step must include an observable state check before the next action
- do not rely on implicit navigation completion
- do not continue until the expected UI signal is visible
- use `data-action` for interactive elements such as buttons and links where available
- use `data-ui` for stable UI targeting where available
- if neither `data-action` nor `data-ui` is available, prefer the most stable accessible locator
- use brittle CSS selectors only as a last resort
- maximum scenario runtime is 5 minutes unless the scenario explicitly documents a justified exception

Selector priority order:

1. `data-action` for interactive elements
2. `data-ui`
3. stable accessible locator such as role plus name or `aria-label`
4. unambiguous visible text
5. CSS selector as a last resort

Retry policy guidance:

- define an explicit retry window for UI waits
- define an explicit retry window for assertion waits
- define an explicit retry window for network or background processing waits when relevant
- prefer explicit wait signals over blind sleeps whenever possible

Page readiness guidance:

- a page should be treated as ready only after its primary readiness signal is visible
- readiness signals should prefer stable heading, primary action, or loading-state disappearance
- URL changes alone are not a sufficient readiness signal unless the scenario explicitly says so

### 9. State Mutation Rules

This section defines how the agent must treat state-changing actions.

Required content:

- which actions create data
- which actions are destructive
- what guards must be verified before repeating or confirming a mutation
- how each important mutation becomes observable

Hard rules:

- actions that create data must not be executed twice unless the scenario explicitly allows it
- destructive actions must be guarded by a visible confirmation step when such a step exists
- important mutations must be observable through UI state, API state, or another explicit surface
- the agent must not invent retries for destructive mutations without an explicit rule in the scenario

### 10. Execution Steps

This section contains the actual scenario flow.

Required content:

- numbered steps
- explicit actor ownership for each step
- explicit page or area being used
- explicit action to perform
- explicit precondition before the action
- explicit expected intermediate result after the action when relevant

Rules:

- do not use vague phrases like "go through the flow"
- if the agent must click something, identify the target clearly
- if the step depends on prior state, say what state should be visible before acting
- keep setup steps out of this section unless they are intentionally part of the user journey
- use a structured format that is easy to parse
- keep scenarios at or below 25 execution steps unless there is a strong documented reason to exceed that limit
- keep scenarios at or below 3 actors unless there is a strong documented reason to exceed that limit
- keep scenarios at or below 4 sessions unless there is a strong documented reason to exceed that limit

Recommended step shape:

- `Actor`: who acts
- `Session`: which browser session is active
- `Page`: where the action happens
- `Precondition`: what must already be visible or true
- `Action`: the exact interaction
- `Expected State`: the immediate observable result

### 11. Scenario Invariants

This section defines what must remain true while the scenario runs.

Required content:

- the key state assumptions that must not drift during execution
- actor authentication expectations when relevant
- data stability expectations when relevant

Examples:

- actors remain authenticated unless the scenario explicitly tests logout behavior
- seeded listings used by the scenario must remain available until assertions complete
- append-only message history must not be rewritten during execution

### 12. Assertions

This section defines what must be verified after the flow finishes.

Required content:

- `Critical Assertions`
- `Secondary Assertions` when helpful
- `Negative Assertions` when absence is important
- assertion source when the verification surface is non-obvious or when multiple surfaces exist

Good assertions are binary and observable. Bad assertions are subjective or underspecified.

Critical assertions should capture fail-fast outcomes that define whether the scenario actually passed.

Recommended assertion shape:

- `Source`: UI, API, database-visible effect, or another explicit surface
- `Expected`: the exact result to verify

### 13. Cleanup

This section explains how to leave the environment in a safe state after execution.

Required content:

- cleanup commands if required
- whether cleanup is mandatory or optional
- what data or sessions should be removed, reset, or left intact

If no cleanup is needed, state `No cleanup required` explicitly.

### 14. Failure Clues

This section helps the agent recover when the scenario fails.

Required content:

- `Detection`: how the failure usually shows up
- `Severity`: retryable, environment failure, or product bug
- `Diagnosis`: what to inspect first and where the expected truth should be visible
- `Recovery`: what the agent should try next when recovery is safe
- which repo documents or endpoints help explain the failure
- diagnostic commands when useful

Keep this practical. It is not a postmortem section.

## Writing Rules

- Use short, direct sentences.
- Prefer commands and facts over explanation.
- Use fenced code blocks for shell commands and payloads.
- Use flat bullet lists only.
- Use absolute statements for hard gates and lifecycle rules.
- Call out when a result must not happen.
- Make actor switching obvious.
- Keep one scenario focused on one primary behavior cluster.
- Keep the scenario short enough to remain debuggable.
- Prefer structured step records over prose paragraphs.

## Agent Safety Rules

- Never delete global seed data.
- Never modify unrelated listings, transactions, messages, or users.
- Never perform destructive actions outside the explicit scenario scope.
- Never broaden cleanup beyond the data owned by the scenario.
- Prefer isolated scenario data over shared ambient data whenever possible.

## Standalone Requirement

A scenario is standalone only if all of the following are true:

- it can be executed from that single file
- it was planned with the operator before the file was finalized
- it does not depend on another scenario having created data first
- it defines all required actors and sessions
- it includes all required commands and assertions
- it makes hidden assumptions explicit
- draft planning output was not committed as the final scenario file

If any of those fail, the scenario is incomplete.

## Codex-First Guidance

This suite is optimized for Codex-style execution.

That means every scenario should be friendly to an agent that can:

- run shell commands
- inspect repository files
- open browser sessions
- switch between actors
- verify visible outcomes

Do not assume custom automation wrappers exist unless the scenario names them explicitly.

## Agent Capability Contract

Scenario authors should assume the executing agent can:

- run shell commands
- inspect repository files
- open and control browser sessions
- switch between sessions and actors
- verify visible UI outcomes

Scenario authors should not assume the executing agent can:

- infer hidden product rules that are not written in the scenario or referenced docs
- guess the correct selector when multiple plausible targets are visible
- recover safely from destructive side effects unless recovery steps are documented
- resolve ambiguous pass or fail conditions from intuition alone

## Selector Stability Rule

Selectors used by scenario files must remain stable across releases whenever reasonably possible.

When a stable selector changes, affected scenario files should be updated in the same change set.

## Scenario Starter Template

Use this skeleton when creating a new scenario file.

````md
# Scenario: <title>

## 1. Scenario Metadata

- Scenario ID: `<scenario-id>`
- Title: `<human-readable title>`
- Intent: `<what behavior this scenario validates>`
- Scope: `<included behavior and explicit exclusions>`

## 2. Success Criteria

- `<observable pass condition>`
- `<observable pass condition>`

## 3. Prerequisites

- `<required service or command>`
- `<required account, environment variable, or local state>`

## 4. Actors

- `<actor name>`: `<role>`, `<seeded or existing account>`, session `<session id>`
- `<actor name>`: `<role>`, `<seeded or existing account>`, session `<session id>`

Permissions:

- `<actor name>` can `<allowed actions>` and cannot `<disallowed actions>`

## 5. System State Model

UI state:

- `<visible state surface>`

API state:

- `<endpoint or response surface>`

Database-visible effects:

- `<record or field to verify>`

Authoritative truth:

- `<which surface decides pass or fail>`

## 6. Environment and Data Setup

```bash
<exact command>
```

- `<explicit data setup note>`
- `<explicit time or state note>`
- `<idempotency note>`
- `<test data ownership or prefix rule>`

## 7. Browser Session Plan

- Session 1: `<actor>`, `<starting URL or page>`
- Session 2: `<actor>`, `<starting URL or page>`
- Concurrency: `<which sessions stay open together>`
- Isolation: `<how sessions stay isolated>`
- Readiness signal: `<heading, primary action, or loading-state signal>`

## 8. Deterministic Execution Rules

- Before every action, verify `<visible precondition>`
- Wait for `<explicit UI signal>` before continuing
- Selector priority: `data-action` -> `data-ui` -> accessible locator -> visible text -> CSS last resort
- Retry policy: `<ui wait window>`, `<assertion wait window>`, `<background wait window>`
- Timing guardrails: `<timing or retry note>`

## 9. State Mutation Rules

- Create-once actions: `<actions that must not be repeated>`
- Destructive actions: `<actions that need confirmation or extra care>`
- Mutation visibility: `<where state changes become visible>`
- Retry guard: `<when mutation retry is allowed or forbidden>`

## 10. Execution Steps

1. Actor: `<actor>`
   Session: `<session id>`
   Page: `<page or area>`
   Precondition: `<what is visible before acting>`
   Action: `<exact action>`
   Expected State: `<immediate observable result>`

2. Actor: `<actor>`
   Session: `<session id>`
   Page: `<page or area>`
   Precondition: `<what is visible before acting>`
   Action: `<exact action>`
   Expected State: `<immediate observable result>`

## 11. Scenario Invariants

- `<state that must remain true during execution>`
- `<authentication or data stability rule>`

## 12. Assertions

Critical Assertions

- `<must-pass assertion>`
- `<must-pass assertion>`

Assertion Source

- Source: `<UI | API | database-visible effect>`
- Expected: `<exact result>`

Secondary Assertions

- `<nice-to-have or supporting assertion>`

Negative Assertions

- `<must not happen>`

## 13. Cleanup

- `<cleanup command or note>`

## 14. Failure Clues

Detection

- `<how the failure appears>`

Severity

- `<retryable | environment failure | product bug>`

Diagnosis

- Diagnostic command: `<command>`
- Inspect first: `<where to look>`
- Supporting repo doc or endpoint: `<reference>`

Recovery

- `<safe next action>`

````

## Definition of Done for Any Scenario File

A scenario file is ready only when:

- all required sections exist
- every command is executable as written
- actor and session ownership is unambiguous
- deterministic execution rules are explicit
- selector strategy is explicit
- mutation rules are explicit
- assertions are concrete
- cleanup is explicit
- the scenario was planned together with the operator before finalization
- planning output was not committed as the scenario itself
- the file can be handed to an agent without additional verbal briefing
