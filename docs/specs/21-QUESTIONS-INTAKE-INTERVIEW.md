# "21 Questions" Intake Interview — Feature Spec (v2)

> **Status: PLANNED, not implemented.** v2 authored 2026-06-11 after product-owner decisions and
> four parallel research/analysis passes: (a) June-2026 elicitation practice, (b) a deep codebase
> map of the blueprint/phase machinery, (c) OpenAI Realtime voice (June-2026 state), (d) admin-
> backend prevalence, (e) spec→phase dependency-ordering practice (Spec Kit, Kiro, Codex
> ExecPlans, Stripe's own sequencing). File:line pointers verified at `main` 2026-06-11 —
> re-verify before editing.

## 0. Product-owner decisions (binding, 2026-06-11)

1. **Default ON, obvious toggle, never a yes/no gate.** The landing/home prompt box triggers the
   interview by default; whatever the user typed seeds the triage pass. A clearly visible toggle
   on the interview screen (and new-build screen) turns it off for that build. No "want the
   interview?" question.
2. **Text-chip interview ships first** (Feature Phase A). **Voice is Feature Phase B** — voice-
   first UX on OpenAI Realtime with live dual transcripts; text always available as fallback;
   the on-screen experience is IDENTICAL in both modes (same questions, same chips highlighting,
   same live summary panel).
3. **Brand voice everywhere:** non-technical, warm, friendly dream-builder tone for question
   copy; the voice persona equally warm and approachable, never imposing.
4. **Chips over LLM:** anything answerable by a click is a chip/selector — no LLM round-trip for
   tree navigation.
5. **The spec must drive dependency-ordered build phases** (no Stripe before there's an app and
   something to sell; no database table before its feature). Prefer extending the existing
   blueprint over replacing it.
6. **Admin "back room" is a near-default capability** for any app with users beyond the owner
   (research-confirmed, §4.1).

## 1. Goal

When a user starts a new project, run a short, jargon-free interview — **at most 21 questions,
typically 8–14 in under 4 minutes** — that extracts everything needed to produce a complete,
dependency-ordered build spec, so the blueprint builds the right app in **one pass** (or as few
as possible). Questions read like a human ("Would you like to take payments?"), never an
engineer ("Do you need Stripe webhooks?").

Evidence base: all major builders converged on plan-first modes in 2025-26; clarification-first
outputs are preferred 78-82% of the time in user studies (arXiv 2507.21285); one-question-at-a-
time conversational format roughly doubles completion vs forms (Typeform ~47% vs ~21%). Known
failure modes to avoid: jargon questions (Replit), charging credits for questions, asking what
was already stated.

## 2. Design principles

1. **Adaptive with a hard budget.** 21 is the ceiling; stop the moment no remaining question
   would change what gets built (Spec Kit rule).
2. **Never ask what they already told you** — LLM triage pre-answers from the initial prompt.
3. **One question per message, ≤2 sentences, 2–5 chips + free text always.** Exception: one
   multi-select capability checklist screen.
4. **Mom Test phrasing:** specific past behavior over hypotheticals.
5. **Escape hatches:** "Skip" and "You decide" chips on everything after Phase 1; persistent
   "Just build it with what you've got →"; a complete first prompt may auto-skip to the confirm
   step.
6. **Show every assumption** in the live summary: "You didn't mention X, so I chose Y — tap to
   change."
7. **Visibly free.** Interview turns consume no build credits, and the UI says so.
8. **Every answer mutates the spec immediately** — an abandoned interview still improves the
   build.
9. **Confirm by restatement** before any build tokens are spent.
10. **Identical experience across input modes.** Voice mode renders the same chat bubbles,
    chips, and summary panel; spoken answers select chips visibly (voice is an I/O layer over
    the same deterministic tree — never a separate flow).

## 3. The interview (phases, budgets, branching)

Budget: 3 / 3 / 9 / 2 / 1 = 18 + 3 reserved for contradiction-clarification = **21 hard cap**.

### Phase 1 — The problem (3, never skipped, mostly free text)
1. "What's the annoying thing this app should fix? Tell me about the last time it happened."
2. "Who will be using this once it's live?"
   *(chips: Just me / Me and my team / My customers or clients / Anyone who finds it)* — this
   single answer prunes the most: auth, roles, admin.
3. "Six months from now, what would make you say this app worked?"

### Phase 2 — The main flow (2–3)
4. "Walk me through the main thing someone does in the app, step by step — like you're
   explaining it to a friend."
5. Archetype restate-and-confirm: "Sounds like a [booking app for dog groomers]. Close?"
   *(chips: Exactly / Sort of / No)*
6. Only if still unclear: "Which of these feels closest?" *(chips: booking · store · customer
   portal · internal tool · community · content/blog · dashboard · something else)*

### Phase 3 — Capability sweep (1 multi-select + up to 8 branched follow-ups, max 2 per branch)
7. **The big checklist** (one screen, multi-select): "Which of these will your app need? Tap all
   that apply — you can change your mind later."
   - People sign in with their own account
   - Take payments
   - Let people book times or appointments
   - Sell products
   - Upload photos or files
   - Send emails or reminders automatically
   - Different access for different people (e.g. staff vs customers)
   - None of these / Not sure — you decide

   Branch follow-ups (max 2 per branch), e.g.:
   - Payments → "One-time payments, subscriptions, or sending invoices?" · "Roughly what will
     things cost?"
   - Booking → "Fixed time slots, or your live availability?" · "Should people get a reminder
     before their appointment?"
   - Accounts → "Can anyone sign up, or only people you invite?"
   - Selling → "A handful of things, or hundreds?"
   - Roles → "Who are the different kinds of people, and what should each see?"

8. **The back room** (fires whenever Phase 1 Q2 ≠ "Just me"; replaces the old "behind the
   counter" checklist row):
   > "Want a private 'back room' only you can get into — where you can see who's signed up,
   > check new orders or bookings, and make changes without touching anything technical?"
   > *(chips: Yes — I want to see everything in one place · Yes — and some of my team need
   > their own keys too (→ roles) · No thanks — keep it simple · Not sure — add it if it'd
   > help (→ include))*

   **Auto-include rule (no question needed):** when the app clearly has outside users, takes
   orders/bookings/payments, or collects submissions, include the admin baseline and just show
   it in the summary ("We added a private back room where you can see orders and customers —
   remove?"). Ask only when the audience is ambiguous. Skip silently for single-user tools and
   zero-data pages; a landing page with a contact form gets a minimal leads inbox by default.
   (Research: Base44/Softr/Glide ship admin by default; Lovable/Bolt/v0 make users ask — and
   non-technical users don't know to ask. Auto-inclusion is a differentiator.)

### Phase 4 — Shape & feel (2, both skippable)
- "Any app or website whose look you love?"
- "What should we call it?" *(pre-filled suggestion)*

### Phase 5 — Confirm (1)
- Full plain-English summary ("Your app so far") incl. the **Assumptions** list, then: "Ready to
  build, or want to change anything?" *(chips: Build it / Change something)*

### Reserve (≤3)
Contradiction questions only (e.g. "just me" + "staff roles"), ranked Impact × Uncertainty.

## 4. Answer → capability mapping

Typed config in the worker; each flag expands into pre-written EARS requirement snippets.

| Plain-language answer | Capability flags | Build implications |
|---|---|---|
| customers use it / just me / no login | `auth.full` / `auth.single-admin` / `auth.none` | login, sessions, user table |
| payments: one-time / subscription / invoices | `payments.checkout` / `.subscriptions` / `.invoicing` | Stripe scaffold + **credentialsNeeded: Stripe keys** |
| booking | `scheduling.calendar` + `notifications.email` | availability model, booking views, reminders |
| selling products | `catalog`, `cart`, images → `storage` | product model, owner CRUD |
| uploads | `uploads` + `storage` | object storage wiring |
| reminders/emails | `notifications.email` | email scaffold + **credentialsNeeded** |
| back room: yes / team keys too / no | `admin.dashboard` / + `roles.multi` / none | §4.1 baseline |
| staff vs customers | `roles.multi` | role column, ownership, gated views |
| monetization free/ads/paid | monetization flags | gating, pricing page |

### 4.1 Admin baseline (2026 standard, research-verified)
When `admin.dashboard` is set (chosen or auto-included), the spec includes exactly four things —
the converged 2026 baseline (Base44 default dashboard, Lovable's admin guides, SaaS boilerplate
canon): **(1)** the business-records list (orders/bookings/submissions, searchable, edit/delete),
**(2)** a people list (two-role Owner/User split by default), **(3)** summary stat cards (counts,
new-this-week), **(4)** all behind login + role gate. Action automations and fine-grained roles
are upgrade tier, not baseline.

### 4.2 Runtime reality check (from the codebase map — verify in slice A3)
Generated apps CAN get D1/KV provisioned via `worker/services/sandbox/resourceProvisioner.ts`
(referenced from the deploy path); templates ship React/Vite/Tailwind/shadcn with no
binding metadata; there is **no per-app secrets mechanism today** — so capabilities requiring
third-party keys (Stripe, email) are scaffolded code-complete but inert until the separate
credentials-collection feature (out of scope here) supplies keys. The spec's `credentialsNeeded`
list is the handoff contract. The mapping table must only promise what the deploy path can
provision — re-verify `resourceProvisioner` end-to-end in slice A3 before enabling the
payments/email flags in production.

## 5. Output artifact: the spec

- **Problem & outcome** (user's words, lightly cleaned); **users & roles**
- **User stories** with stable IDs (`US-1`, …)
- **EARS acceptance criteria** per story (`US-1.AC-2`: "WHEN a booking is created, THE SYSTEM
  SHALL email the owner…") — from flag-expanded snippets + the synthesis pass
- **Capability flags** (machine-readable)
- **Assumptions** (shown to user, embedded in spec); **credentialsNeeded**; look & feel; name

## 6. Spec → blueprint → dependency-ordered phases (the pipeline refactor)

### 6.1 How phasing works today (codebase map, file:line at `main` 2026-06-11)
Phases are **re-planned each cycle, not pre-scheduled**: `PhaseGenerationOperation`
(`worker/agents/operations/PhaseGeneration.ts` ~L183–233) receives the full blueprint + completed
phases + current files + issues and emits the next `PhaseConceptGenerationSchema`
(`worker/agents/schemas.ts` ~L25–43: `name`, `description`, `files[]`, `lastPhase`,
`installCommands[]` — **no dependency or traceability fields**). The blueprint's
`implementationRoadmap` (`schemas.ts` ~L110–113) is unstructured hints the model may ignore.
Loop ends on `lastPhase: true` or counter exhaustion (`simpleGeneratorAgent.ts` ~L887, MAX ~5,
+3 recharge per user suggestion). The blueprint is injected into every operation's prompt
automatically via `getSystemPromptWithProjectContext` — **fields added to BlueprintSchema reach
all prompts with zero plumbing**. User input rides `UserContext { suggestions, images }`
(`worker/agents/core/types.ts` ~L160).

### 6.2 Design (chosen: extend, don't replace — minimal rebuild)
The blueprint **embeds the spec** and the roadmap becomes a validated dependency DAG. The
blueprint stays the user-facing artifact; its display gains a spec/requirements section
(satisfies the "blueprint references the spec docs in the phases" direction).

```ts
// BlueprintSchema additions
spec: z.object({
    userStories: z.array(z.object({ id: z.string(), story: z.string() })),
    acceptanceCriteria: z.array(z.object({ id: z.string(), criterion: z.string() })), // EARS
    capabilityFlags: z.record(z.string(), z.boolean()),
    assumptions: z.array(z.string()),
    credentialsNeeded: z.array(z.string()),
}).nullable(),  // null = legacy/non-interview builds, fully backward-compatible

// implementationRoadmap item becomes:
{
    id: z.string(),                 // stable slug, e.g. "payments-checkout"
    phase: z.string(),              // title (existing)
    description: z.string(),        // existing
    dependsOn: z.array(z.string()), // roadmap ids — validated acyclic, referentially intact
    satisfies: z.array(z.string()), // US-*/AC-* ids (Kiro-style traceability)
    capability: z.enum(['shell','core-flow','persistence','auth','uploads','payments',
                        'email','realtime','admin','analytics','polish']),
    demonstrable: z.string(),       // one behavior a human can verify in the preview
}
```

**Validation in code, not prompt-trust** (the research's key warning — don't ask the model for
tier numbers; derive them): referential integrity → cycle detection → capability partial-order
lint (§6.3) → requirement-coverage check (every US/AC id appears in ≥1 phase; if unplaceable,
surface it, never invent) → tiers computed by longest-path depth. On lint failure, one repair
re-prompt with the specific violations; then fall back to a code-side topological reorder.

`PhaseConceptSchema` gains optional `satisfies` + `roadmapId` so each generated phase declares
what it advances; `executePhaseImplementation` gains a pre-flight check that a phase's
`dependsOn` roadmap items are complete. `UserContext` gains optional `spec` so mid-build
re-prompts keep requirement context. Phase-counter policy: MAX phases scales with roadmap length
(cap ~8) instead of flat 5 — sized in slice A3.

### 6.3 Canonical capability partial order (house canon, grounded in Stripe docs + walking-skeleton doctrine)
shell → core-flow (one end-to-end slice, mock data OK) → persistence *with* its feature (never
tables up front) → auth (before any user-owned data or money) → user-owned CRUD → uploads with
their feature → payments (catalog → checkout → webhooks/entitlements → portal — Stripe's stated
order; requires auth + something to sell) → email/notifications (after their trigger events
exist) → realtime → **admin (after the flow it administers)** → analytics/polish last.

### 6.4 Phase-planning prompt rules (added to `PhaseGeneration` strategy block)
1. Walking skeleton first; every phase leaves the preview app running and demonstrably better
   ("working behavior, not merely code changes").
2. Vertical slices in dependency order; never create a table/API/integration before the phase
   that uses it.
3. Identity before ownership; money after value (auth precedes user-owned data and payments;
   payments follow catalog → checkout → webhooks).
4. Trace everything: every phase lists the `satisfies` ids; unplaceable requirements are
   reported, not invented around.
5. Each phase states one `demonstrable` user-verifiable behavior.

## 7. Architecture

### 7.1 Entry & toggle (decision #1)
Home prompt box (`src/routes/home.tsx` ~L210–227) submits → interview screen (within
`/chat/new` pre-WS, the typed prompt seeding triage). The interview screen carries a clearly
visible toggle ("Interview: on — answer a few quick questions for a much better first build /
turn off to build straight from your prompt"); preference persisted per user (localStorage +
profile setting), default ON. "Just build it →" remains available mid-interview.

### 7.2 Engine (unchanged from v1, decision #5 reaffirmed)
Deterministic typed question tree + **two LLM calls** (triage at start: pre-answer + archetype +
stated capabilities; synthesis at end: spec assembly). Optional third only for the contradiction
reserve. Sessions in KV with TTL (survives refresh). `POST /api/interview` (start) +
`POST /api/interview/:sessionId/answer`. Interview model = cheap tier; free to users and labeled
as such.

### 7.3 Voice mode (Feature Phase B — researched June 2026, build after text ships)
- **Models:** `gpt-realtime-mini` default, config flag to `gpt-realtime-2` (GA May 2026; 128K
  ctx, parallel tool calls). Est. cost/interview: **~$0.08–0.15 mini, ~$0.25–0.45 flagship.**
  Eval mini's tool-call reliability across 21 consecutive structured calls before committing.
- **Transport/auth:** browser **WebRTC**; a Worker endpoint (`POST /api/interview/voice-session`)
  mints ephemeral client secrets (`POST /v1/realtime/client_secrets`, `expires_after: 60`) with
  the session config — instructions, tools, voice — **pinned server-side** so the client can't
  repurpose the session. (Hardening alternative: the `/v1/realtime/calls` SDP-proxy pattern —
  no token in the browser at all.) Reference impl: `craigsdennis/talk-to-javascript-openai-workers`.
- **Voice is I/O, the tree is truth:** the model gets ONLY the current question + options
  (injected per turn via `session.update`/conversation items) and answers by calling client-side
  tools — `select_chip(questionId, optionId)`, `record_answer(questionId, value)`,
  `repeat_question()`, `switch_to_text()`. The client executes them (chip highlights, tree
  advances, summary updates) and returns `function_call_output`. The model never freelances the
  next question. A dropped session therefore loses zero answers.
- **Dual live transcripts (decision: both sides visible as text):** agent speech via
  `response.output_audio_transcript.delta`; user speech via input transcription
  (`gpt-realtime-whisper`, `delay: low`) → `conversation.item.input_audio_transcription.delta/
  .completed`. Render keyed by `item_id` (cross-turn event order is NOT guaranteed); treat the
  user transcript as cosmetic — the tool call is authoritative.
- **Persona (decision #3):** voice **Marin** (OpenAI's recommended warm voice) + terse tone
  instructions ("warm, friendly, encouraging; 1–2 sentences per turn; celebrate answers");
  playback `speed` adjustable. Keep instructions short — per-turn instruction re-input dominates
  cost; rely on caching.
- **Fallbacks (text parity, decision #2/#4):** mic-permission pre-flight → text chips instantly
  on denial; session start bound to the user's tap (iOS Safari gesture requirement;
  `visibilitychange` resume handling; real-device testing mandatory); on `connectionState`
  failed → keep all tree state, offer "continue by text" and optional voice re-mint with
  context re-injection. Chips stay clickable DURING voice — a click is the same `record_answer`
  path.
- **Known gap:** browser WebRTC bypasses our AI Gateway (no logging/BYOK on the audio path; the
  Gateway's Realtime WebSocket support exists but is WebSocket-only with a reported BYOK bug).
  v1 posture: voice traffic goes direct with platform OpenAI key + `OpenAI-Safety-Identifier`;
  revisit when Gateway WebRTC lands.

## 8. Implementation slicing (one PR per slice, strict flow, atomic-green each)

**Feature Phase A — text interview + pipeline (ship first, decision #2):**
| Slice | Content |
|---|---|
| A1 | Worker engine: question tree + mapping table + EARS snippets + admin auto-include rules; `/api/interview` endpoints; KV sessions; triage + synthesis ops; tree/budget/coverage unit tests |
| A2 | Frontend: interview UI on /chat/new (chips, checklist, live summary w/ editable assumptions, escape hatches), default-ON toggle + persistence, home-box seeding, auto-skip-to-confirm for complete prompts |
| A3 | Pipeline: BlueprintSchema spec embed + roadmap DAG fields + code-side validation pipeline; PhaseGeneration prompt rules (§6.4); PhaseConcept `satisfies`; pre-flight dependency check; phase-counter policy; blueprint view renders the spec section; **resourceProvisioner verification** |
| A4 | Telemetry + rollout: per-question drop-off (<20%/step), cohort tagging, correction-cycle comparison, feature flag |

**Feature Phase B — voice (after A stabilizes):**
| Slice | Content |
|---|---|
| B1 | Worker voice-session endpoint (ephemeral mint, server-pinned config) + WebRTC client + tool loop (select_chip/record_answer) + dual transcripts |
| B2 | Fallback hardening (iOS gesture/backgrounding, reconnect, mid-session text handoff), mini-vs-flagship eval, persona tuning, cost telemetry |

Deferred: BYOP interview variant; credentials collection (separate feature; `credentialsNeeded`
is the contract); mid-build re-interview.

## 9. Success metrics
Completion >60%; per-question drop-off <20%; median 8–14 questions, <4 min; **correction cycles
per build, interviewed vs toggled-off** (the metric that matters); blueprint regeneration rate;
voice-phase: voice completion rate vs text, tool-call accuracy, cost/interview.
