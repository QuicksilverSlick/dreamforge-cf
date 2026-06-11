# "21 Questions" Intake Interview — Feature Plan

> **Status: PLANNED, not implemented.** Authored 2026-06-11 from (a) a live web-research pass on
> June-2026 elicitation practice (Lovable follow-up questions, Replit Plan Mode, Bolt Discussion
> Mode, Base44 Plan Mode, GitHub Spec Kit `/clarify`, Kiro EARS specs, survey/onboarding drop-off
> data) and (b) a full codebase mapping of the blueprint pipeline. File:line pointers verified at
> `main` tip 2026-06-11 — re-verify before editing.

## 1. Goal

When a user starts a new project, run a short, jargon-free interview — **at most 21 questions,
typically 8–14 in under 4 minutes** — that extracts everything needed to write a complete build
spec, so the blueprint builds the right app in **one pass** (or as few as possible). The
questions read like a human asking ("Would you like to take payments?"), never like an engineer
("Do you need Stripe webhooks?").

Why we believe this works: every major builder converged on plan-first modes in 2025-26, and the
academic studies (Curiosity by Design, arXiv 2507.21285) show users prefer clarification-first
outputs 78-82% of the time. The known failure modes to avoid: jargon questions (Replit),
unexpected credit charges for questions (Replit complaint threads), and asking what the user
already said (universal).

## 2. Design principles (each is load-bearing, sourced from the research)

1. **Adaptive with a hard budget, not a fixed form.** "21" is the brand and the ceiling. Stop
   early the moment no remaining question would change what gets built (Spec Kit's rule).
2. **Never ask what they already told you.** An LLM triage pass over the initial prompt
   pre-answers questions before any are shown.
3. **One question per message, ≤2 sentences, 2–5 option chips + free text always.** The
   conversational one-at-a-time format roughly doubles completion vs forms (Typeform ~47% vs
   ~21%). Exception: one multi-select capability checklist screen.
4. **Mom Test phrasing:** ask about specific past behavior, not hypotheticals. "When a customer
   books today, how do you find out?" beats "Would you like email notifications?"
5. **Escape hatches everywhere:** every question after Phase 1 has "Skip" and "You decide"
   chips; a persistent "Just build it with what you've got →" exits to build at any time. A
   detailed first prompt may legitimately skip the whole interview (power-user bypass).
6. **Show every assumption.** Silent defaults erode trust; the live summary panel lists "You
   didn't mention X, so I chose Y — tap to change."
7. **Visibly free.** Interview turns must not consume build credits, and the UI says so.
8. **Every answer mutates the spec immediately** (atomic integration), so an abandoned interview
   still improves the build.
9. **Confirm by restatement** (Bolt pattern): the last step restates the whole plan in the
   user's own words — "Did I get this right?" — before any build tokens are spent.

## 3. The interview (phases, budgets, branching)

Budget: 3 / 3 / 9 / 2 / 1 = 18 + 3 reserved for contradiction-clarification = **21 hard cap**.

### Phase 1 — The problem (3 questions, never skipped, mostly free text)
1. "What's the annoying thing this app should fix? Tell me about the last time it happened."
2. "Who'll use it — just you, your team, or your customers?"
   *(chips: Just me / My team / My customers / Everyone — this single answer prunes the most:
   auth, roles, admin)*
3. "Six months from now, what would make you say this app worked?" *(success criteria)*

### Phase 2 — The main flow (2–3 questions)
4. "Walk me through the main thing someone does in the app, step by step — like you're
   explaining it to a friend." *(seeds data model + views)*
5. Archetype restate-and-confirm: "Sounds like a [booking app for dog groomers]. Close?"
   *(chips: Exactly / Sort of / No)*
6. Only if archetype still unclear: "Which of these feels closest?" *(chips: friendly archetype
   labels — see §4)*

### Phase 3 — Capability sweep (1 multi-select + up to 8 branched follow-ups, max 2 per branch)
7. **The big checklist** (one screen, multi-select): "Which of these will your app need? Tap all
   that apply — you can change your mind later."
   - People sign in with their own account
   - Take payments
   - Let people book times or appointments
   - Sell products
   - Upload photos or files
   - Send emails or reminders automatically
   - A private "behind the counter" area just for you
   - Different access for different people (e.g. staff vs customers)
   - None of these / Not sure — you decide

   Branch follow-ups (examples; each branch caps at 2):
   - Payments → "One-time payments, subscriptions, or sending invoices?" · "Roughly what will
     things cost?"
   - Booking → "Fixed time slots, or your live availability?" · "Should people get a reminder
     before their appointment?"
   - Accounts → "Can anyone sign up, or only people you invite?"
   - Selling → "A handful of things, or hundreds?" *(catalog complexity)*
   - Roles → "Who are the different kinds of people, and what should each see?"

### Phase 4 — Shape & feel (2 questions, both skippable)
- "Any app or website whose look you love?"
- "What should we call it?" *(pre-filled suggestion)*

### Phase 5 — Confirm (1)
- Full plain-English summary ("Your app so far") including the **Assumptions** list, then:
  "Ready to build, or want to change anything?" *(chips: Build it / Change something)*

### Reserve (≤3)
Contradiction/clarify questions generated only when answers conflict (e.g. "just me" + "staff
roles"), ranked by Impact × Uncertainty (Spec Kit heuristic).

## 4. Answer → capability mapping (deterministic table, Dreamforge-original)

Maintained as typed config in the worker; each flag expands into pre-written EARS requirement
snippets so the blueprint receives requirements, not vibes.

| Plain-language answer | Capability flags | Build implications (generated app) |
|---|---|---|
| "customers use it" / "just me" / "no login" | `auth.full` / `auth.single-admin` / `auth.none` | login screens, sessions, user table |
| payments: one-time / subscription / invoices | `payments.checkout` / `.subscriptions` / `.invoicing` | Stripe integration scaffold + **credentials needed: Stripe keys** |
| booking | `scheduling.calendar` + `notifications.email` | availability data model, booking views, reminder hooks |
| selling products | `catalog`, `cart`, images → `storage` | product data model, admin CRUD |
| uploads | `uploads` + `storage` | object storage (R2) wiring |
| reminders/emails | `notifications.email` | email provider scaffold + **credentials needed** |
| "behind the counter" area | `admin.dashboard` | admin views + `auth.single-admin` minimum |
| staff vs customers | `roles.multi` | role column, row-level ownership, gated views |
| monetization: free/ads/paid | monetization flags | gating, pricing page |

Archetypes (Phase 2 chips): booking · store · customer portal · internal tool · community ·
content/blog · dashboard · something else.

**Verification item (must be done in PR 3, do not assume):** confirm exactly which bindings a
*generated app* can actually get when deployed via the sandbox/dispatch path (D1? KV? R2?).
Template details come from the sandbox service (`SandboxSdkClient.listTemplates()` /
`getTemplateDetails()`); the mapping table must only promise capabilities the deploy path can
provision. Credentials the user must supply (Stripe etc.) are **out of scope here** — the spec
records a `credentialsNeeded` list as a handoff to the (separate, upcoming) secrets-collection
feature.

## 5. Output artifact: the spec

The interview emits a structured spec (this is what makes one-pass builds possible):

- **Problem & outcome** (user's own words, lightly cleaned)
- **Users & roles**
- **User stories** for the main flow
- **EARS acceptance criteria** ("WHEN a booking is created, THE SYSTEM SHALL email the owner…")
  — generated by expanding capability flags through the snippet library + the LLM synthesis pass
- **Capability flags** (machine-readable, drives template selection + blueprint prompt)
- **Assumptions** ("not stated → we chose") — shown to user, embedded in spec
- **credentialsNeeded** list
- **Look & feel notes**, app name

This spec becomes the `query` for `POST /api/agent` (plus structured `metadata`), feeding the
existing pipeline.

## 6. Architecture (grounded in the codebase as of 2026-06-11)

**Where it hooks.** Today: home prompt box (`src/routes/home.tsx` ~L210–227) →
`/chat/new?query=…` → `POST /api/agent` (`worker/api/routes/codegenRoutes.ts:16` →
`CodingAgentController.startCodeGeneration`, `worker/api/controllers/agent/controller.ts`
~L35–173) → DO `initialize()` (`worker/agents/core/simpleGeneratorAgent.ts` ~L280–348) →
template selection (`worker/agents/planning/templateSelector.ts` ~L23–137, schema
`worker/agents/schemas.ts` L4–11) → `generateBlueprint()`
(`worker/agents/planning/blueprint.ts` ~L178–250, `BlueprintSchema` in
`worker/agents/schemas.ts` ~L89–117). **Nothing asks the user anything pre-blueprint today.**

**Decision: the interview runs BEFORE the agent DO exists** (pre-agent), as a dedicated
endpoint + frontend experience on the `/chat/new` screen. Rationale: zero changes to the
generation DO; an abandoned interview costs nothing; the existing WS conversation machinery
(`conversation_response` / `user_suggestion`, `worker/api/websocketTypes.ts` ~L292–310) remains
dedicated to during-build feedback. (A future v2 can move the interview into the agent for
mid-build re-interviews.)

**Engine shape: deterministic tree + exactly two LLM calls.**
- LLM call 1 (**triage**, on interview start): extract pre-answers + archetype + already-stated
  capabilities from the initial prompt; mark those questions answered. Cheap model, structured
  output.
- The phases/branches/follow-ups are a **typed static decision tree** in the worker (fast, no
  per-question LLM latency, predictable, testable).
- LLM call 2 (**synthesis**, on finish): fold free-text answers + flags + EARS snippets into the
  spec markdown + metadata JSON.
- Optional LLM call 3 only when the contradiction reserve triggers.

**Session state:** interview sessions are short-lived → KV (`VibecoderStore`) under
`interview:<sessionId>` with TTL, or component state only (decide in PR 1; KV survives refresh
and enables resume — preferred).

## 7. PR slicing (one PR per slice, strict flow, atomic-green each)

| PR | Content | Notes |
|---|---|---|
| 1 | **Worker interview engine**: typed question tree + capability mapping table + EARS snippet library; `POST /api/interview` (start: triage + first questions) and `POST /api/interview/:sessionId/answer`; KV session state; spec synthesis. Unit tests for tree traversal, budget enforcement, triage pre-answering, flag mapping | Rate-limit: reuse existing API limiter; interview calls use a cheap model and are free to users |
| 2 | **Frontend interview UI**: on `/chat/new` (pre-WS), one-question-at-a-time chat-style UI with chips, the multi-select checklist, live "Your app so far" panel with editable assumptions, Skip / You decide / "Just build it →", then hands enhanced query + metadata to the existing agent-creation call. Power-user bypass: if triage says the prompt is already complete, jump straight to Phase 5 confirm | Vite build gate; verify in preview |
| 3 | **Blueprint integration**: thread `metadata.capabilities` into `selectTemplate()` (use-case/complexity hints already exist in `TemplateSelectionSchema`) and the `generateBlueprint()` system prompt; extend `BlueprintSchema` only if needed (prefer prompt-side injection first); ensure `implementationRoadmap`/`initialPhase` wire flagged capabilities from phase 1 (auth/payments scaffolds present from the first build). **Includes the §4 verification item** (what bindings deployed user apps can really get) | The riskiest PR — touches the generation hot path |
| 4 | **Telemetry + rollout**: per-question drop-off events (<20%/step target), interview-completed vs skipped cohort tagging, correction-cycle count comparison; feature flag for gradual rollout | Defines success: fewer correction cycles for interviewed builds |

Deferred (explicitly out of scope): BYOP interview variant (the import flow
`src/routes/import.tsx` / `CodebaseAnalyzer` skips this pipeline entirely and needs different
questions); credentials collection (separate upcoming feature — the spec's `credentialsNeeded`
list is the handoff); mid-build re-interview via the agent conversation machinery.

## 8. Success metrics

- Interview completion rate (target: >60%, conversational-form benchmark)
- Per-question drop-off (<20%/step)
- Median questions shown (target 8–14) and time (<4 min)
- **The metric that matters:** correction cycles per build, interviewed vs skipped cohorts
- Blueprint regeneration rate; user satisfaction on first preview

## 9. Open questions for the product owner

1. Should the interview be opt-out (default on for everyone) or opt-in at launch? (Plan assumes
   default-on with the "Just build it" escape + auto-skip for complete prompts.)
2. Tone/voice of questions — Dreamforge brand voice (non-tech, dream-builder audience per the
   landing repositioning) should be applied to the final question copy.
3. Where does the spec live after build start — shown in the chat sidebar? Stored on the app
   record for later re-edit?
