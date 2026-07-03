# Dreamforge Business Model — Training-Included Subscription vs. Credit/Sparks

**Status:** Strategy brief for lead review (no code). **Date:** 2026-06-30.
**Companion:** [`PLATFORM-BILLING-SPEC.md`](./PLATFORM-BILLING-SPEC.md) (the credit/Sparks build spec).
**Live models (Google Sheets, editable):**
- Credit/Sparks model — `1VHAsf8s0lLYF4BujLRDGchTgrRw5PuXHCWJ5qH7LecQ`
- Training model v2 (grounded, solved to 65% margin) — `1mOPF4zzgK6IZqlLBGKyYREzAh0RK6Nh5_Jc3Xq083Ts`

> This brief consolidates four June-2026 research passes (churn/production reality, education→efficiency, trainer economics, Jevons/caps, premium+team comps, and grounded build-intensity). Figures are cited; where a number is triangulated/anecdotal it is flagged.

---

## Executive summary — the decision

**Run BOTH models, not one instead of the other.** A **training-included subscription** is the **premium anchor** (sells on success-rate + fixed-cost-no-overrun-anxiety + an assigned engineer → high LTV/stickiness); the **credit/Sparks model is the self-serve entry path** (captures the casual builder + breakage). The credit model has higher margin *per dollar of revenue*; the training model has higher *lifetime value*. They are complementary.

The training thesis is **defensible and likely higher-LTV — but only if** (1) training is delivered **group/cohort + async**, not 1-on-1 (1-on-1 reserved for team tiers), and (2) usage is capped at the **cost driver (full builds), not vanity metrics (apps)**. At a grounded median of ~2–3 real builds/user/month, the solved tiers hit a clean **65% margin**.

---

## 1. Validation of the premises

| Premise | Verdict |
|---|---|
| "Lovable ~85% churn" (internal figure) | **REAL internal signal — but NOT publicly citable** |
| Churn is severe across the funnel | **TRUE (reframed)** |
| Few users reach production | **STRONGLY TRUE** |
| Un-educated trial-and-error is a top hidden cost | **TRUE (directionally)** |

**1.1 — The "85%" figure: a real internal signal, not a public citation.** The ~85% churn was shared with us **internally from Lovable** as a real problem they're facing — credible as a private signal. But it is **cumulative over an unspecified window** (likely heavy first-month drop-off, not a clean monthly rate), and because Lovable is a **private company that controls its own narrative**, it **cannot stand up publicly** — they would reframe or deny it (their CEO has publicly cited "85%" as *Day-30 retention of payers*, the opposite spin). **Use it internally as directional confirmation that churn is a serious, real industry problem — never in a public deck or external claim.** Lead all external messaging with the **cited, defensible data below** (RevenueCat's ~30%-faster AI-app churn + the sub-1%-reach-production funnel).

**1.2 — The defensible churn story (lead with this):** **RevenueCat 2026 State of Subscription Apps** (115,000+ apps, 1B+ transactions): AI apps retain **6.1% monthly vs 9.5%** non-AI, **21.1% vs 30.7% annual** — AI apps lose subscribers **~30% faster at the median**, with higher refunds (4.2% vs 3.5%). Counterpoint: AI apps convert trial→paid *better* (8.5% vs 5.6%). Pattern = **"easy to acquire, hard to keep."** Bolt.new CEO: "churn rate for everyone is really high." (Do NOT cite the Forbes "retention crisis" piece — zero quantified figures.)

**1.3 — "Few reach production" is the strongest argument.** Lovable's own numbers: ~25M+ projects (Q4'25; 50M+ early'26), 100k+ new/day; **only ~12% are "production-capable"**; **~10,000+ custom domains connected = ~0.04% of all projects, ~0.3% of production-capable.** Quality is genuinely low: a scan of 1,645 apps from Lovable's *own showcase* found **10.3% with critical RLS/data-exposure flaws** (CVE-2025-48757); Escape.tech scan of ~5,600 found **~1 in 3 with an exploitable flaw.**

**1.4 — "Unmonitored user costs" / reburn — directionally true.** Credits exist *specifically* to recover margin: Replit's gross margin swung **+36% → −14%** on flat per-checkpoint pricing before moving to credits; GitHub Copilot reportedly lost **>$20/user/mo** at its $10 launch. The dominant leak is **"reburn"** — users paying repeatedly for the AI to fix bugs *it* introduced (context drift). A whole Fiverr/Upwork "fix my Lovable/Bolt/Replit app" economy exists. *Caveat:* 63% of vibe-coders are non-developers, so some tickets are genuine user error; no source cleanly splits the ratio.

**Lead the narrative with:** RevenueCat churn gap + the ~12%-production / sub-1%-deployed funnel + the reburn dynamic.

---

## 2. Trainer economics (the new COGS line)

| Input | In-house (US) | Offshore (agency) |
|---|---|---|
| Fully-loaded $/hr (1.4× base) | **$50–$65/hr** (~$115–135k/yr) | **$15–$30/hr all-in** (2–4× cheaper) |

**Capacity (accounts/trainer):** high-touch 1:1 ~22 · mid-touch ~40–49 · **tech-touch / one-to-many ~144** · SMB ~100. Moving 90-min 1:1 → webinar + 30-min Q&A cut training load **~two-thirds**; one CSM went **100 → 300 customers (~3×)** via weekly webinars.

**Cohort defaults:** size 8–15 (plan 12); 4–8 weeks; 3+ sessions/week. Worked unit: 12 sessions @ $150/hr + 6 coaching hrs = ~$2,700 instructor time / 15 students = **~$180/student (~12% of a $1,500 cohort price)**. Keep services **≤15% of total revenue**; price onboarding **≥2.0–2.5× burdened cost**.

**Model planning defaults:** group/cohort training **~$6/attendee-month** (offshore-led, weekly, amortized); 1-on-1 **~$15–30/30-min offshore** ($25 used in the model) — reserve for higher tiers.

**Decision (lead-confirmed): Hybrid — async library first + offshore-led group/cohort live, 1-on-1 only at team tiers.** This is the margin-safe delivery.

---

## 3. Education-efficiency factor (net of Jevons)

**Gross gain (fewer wasted iterations):** RCT anchor — ROPE requirement-oriented training gave **20% task-success vs 1%** for conventional prompt training (n=30 novices). ~45% of AI interactions iterate; structured onboarding converting a third-to-half of avoidable retries → **25–50% gross**. Training helps *most* exactly where Dreamforge sits (novices on unfamiliar ground).

**Jevons offset (trained, confident users build MORE):** direct rebound 10–30%; capability-unlock can exceed 100% (backfire); **power concentration is the real anchor — 8% of users = 61% of inference cost; heavy users 8–10× median** (Freemius).

**Net factor used:** **−20% LLM COGS per *successful* app (base case).** *Do not* model "average user × efficiency" — model a **distribution**; the tail gets fatter over time. The caps protect margin even if the efficiency gain = 0%.

---

## 4. Grounded build intensity (the median that decides everything)

**Conversion assumption:** competitor units (Lovable credits, Bolt tokens, Replit effort-$, messages) meter *all* actions; **~80–90% are light edits, only ~10–20% heavy generations**. A Dreamforge **"build" = full rebuild + sandbox deploy** = the heaviest subset. **Light edits ride FREE — only full builds count against the cap.**

| Segment | MEDIAN builds/mo | P90 (soft cap) | Confidence |
|---|---|---|---|
| **Solo** | **2** | **4** | direction MED, integer LOW-MED |
| **Team / business (per active seat)** | **2.5** | **5** | LOW-MED |

Grounding: ~12% project→app conversion; ~2.5–3 projects/user lifetime (Base44); trained builder 3–6 heavy gens to ship one app; reburn 30–40%. No vendor publishes per-user build telemetry → **validate post-launch by cohort (builds/user month-1 vs month-3).**

---

## 5. Cost FLOOR — tiers at 65% margin (the floor, NOT the recommendation)

> These are cost-plus-65% prices — the **floor below which we lose money**. The **recommended** prices are value-based and far above this (§5b). Keep this table only as the margin-safety check.

**Margin formula:** `Price = COGS_base / (1 − Stripe − Margin) = COGS_base / 0.295` (Stripe charged on revenue). Cost basis: effective build **$2.00** (raw $2.50 − 20%), image **$0.67/build**, hosting **$3/seat/mo**, group training **$6/seat/mo** ($3 for Solo), 1-on-1 **$25/30-min**, Stripe **5.5%**.

| Tier | Seats | Builds median / cap | **List price** | Per-seat | Margin@median | Margin@cap | Overage |
|---|---|---|---|---|---|---|---|
| **Solo** | 1 | 2 / 4 | **$39/mo** | $39 | **65%** | ~52% | $2.50/build |
| **Team Studio** | ≤5 pooled | 12.5 / 25 | **$265/mo** | $53.14 | **65%** | ~52% | $2.50/build |
| **Team Pro** | ≤10 pooled | 25 / 50 | **$700/mo** | $70.08 | **65%** | ~55% | $2.50/build |

**Worked math (Solo):** LLM 2×$2.00=$4.00 · image 2×$0.67=$1.34 · hosting $3 · training $3 · COGS_base $11.34 → Price 11.34/0.295 = **$38.44 → list $39**. **Overage = $2.50/build** (raw unit cost, zero subsidy → the heavy tail self-funds; never a hard mid-build wall).

**Market sanity (June 2026):** Solo $39 sits in the **$20–40 builder band** (Lovable Pro $25 / Replit Core $25 / Bolt $20–25 / v0 $20 / Cursor ~$20). Team Studio $53/seat = top of the **$30–50 team band**. Team Pro $70/seat sits **below v0 Business $100** — sell as a high-touch / sales-assisted plan.

**Solo note:** the $6 group-training line is heavy for a 1-seat plan, so Solo runs **lighter $3 cohort training** to land $39 at full 65%. Alternative: hold a **$49 list** with full $6 training + 3 builds and accept **~60% margin** as a CAC-subsidized acquisition tier (training is the moat).

---

## 5b. Value-based pricing — THE RECOMMENDATION (skill-value, not cost-plus)

**Live model:** `12pQs-QeNI8mZI_KZ3C_9YXFGKDFlqPNWawdpsm1euy4`.

We don't sell tool-usage — we sell a **high-value skill (build + ship real business apps) with the platform + an assigned engineer included**. Price on what the *skill/outcome* is worth, not on COGS.

**Value ceilings (June 2026 research):**
- **Individual: $1,000–$5,000** (live AI cohorts $800–$4,995; Nucamp Solo AI $3,980; a fractional slice of the **+$18k/yr ($28%) AI-skills wage premium**; citizen-dev roles **$107–129k**).
- **Small team (≤5): $5,000–$16,000** (SMB AI-training agency workshops $5k–$16k — for *weaker* third-party tools, **no platform**; exec-ed $5k–15k/person; $1,000–1,500/employee AI L&D).
- **Larger team (≤10): $12,000–$35,000** (firm-wide launch / leadership cohorts).

The cost floor ($39/$265/$700) sits **10×–50× below** these — the constraint is **credibility & framing, not margin.**

**Recommended structure — split fee** (one-time captures the skill transfer = high margin + kills "learn-and-leave"; monthly = platform + assigned engineer + hosting):

| Tier | One-time | Monthly | Year-1 / customer | Monthly margin | Year-1 margin |
|---|---|---|---|---|---|
| **Solo** | **$500** | **$79/mo** | **~$1,448** | ~76% | ~74% |
| **Team Studio (≤5)** | **$2,500** | **$495/mo** | **~$8,440** | ~69% | ~71% |
| **Team Pro (≤10)** | **$5,000** | **$1,200/mo** | **~$19,400** | ~68% | ~71% |

(Blended-monthly alternative if you reject a separate onboarding fee: **Solo $99–129 · Studio $650–900 · Pro $1,800–2,400.**) Value pricing lifts recurring margin from the 65% floor toward **~70–86%** plus a near-100%-margin one-time line — a **~5–6× Year-1 gross-profit-per-customer** lift with **zero COGS change**.

**Shared-build lever (Q3):** because Dreamforge already supports **team builds**, a `ShareFactor` reduces effective team builds (Studio 8.5 vs 12.5; Pro 16 vs 25 at 0.4) → lower COGS → more headroom. Departments building *different* apps push it back up — hence it's a slider.

**Adversarial verdict (steelman + strawman):** the bundle premium is empirically real (comps run 3×–100× the tool price; we're asking far less). It works **conditionally**, and the conditions ARE the failure modes:
1. **Anchor risk (top):** a tool-aware buyer anchors to $25 Lovable → $79+$500 reads as gouging. **Mitigation:** never market as "a better Lovable"; anchor every page against **hiring a dev ($70k) / agency build ($25k) / AI workshop ($5k+)**; lead with the engineer + outcome.
2. **Learn-and-leave churn:** once they have the skill the platform is swappable. **Mitigation:** the **one-time fee captures value up front**; $39/mo survives only as a graduate "keep-building" winback tier — never the headline.
3. **The human doesn't scale:** the 1:1 engineer is the premium *and* the margin/churn trap. **Mitigation (the #1 unsolved execution risk):** templated curriculum + pooled office-hours + async-with-escalation so the assigned engineer scales past 1:1 without collapsing into "just a course."
- Other risks: positioning confusion (course vs tool), outcome-guarantee refund exposure (gate it like a bootcamp), platform commoditizes as base AI improves (teaching value is highest *now*).

**Win/lose on two disciplines, not the price:** (1) marketing holds the anchor vs dev/agency, (2) ops productizes the human.

---

## 5c. Outcome-to-production — THE FINAL POSITIONING (refines §5b)

**The shift:** we don't sell a tool (learn-and-leave via the $25 anchor) *or* even a skill (learn-and-leave once mastered). We sell the **OUTCOME: your real app, live and working, and kept that way.** Training + the assigned engineer stop being the product — they're the **mechanism** that de-risks the outcome. All three premises **confirmed** by June-2026 research:

- **Paid vibe-coders have a purpose** (a16z segmentation: 2 of 3 builder types are money-backed + goal-directed; >100% NRR cohorts; named non-engineer outcomes like Plinq $456k ARR).
- **The market fails them at the last mile** (best-quantified fact in the space): **91.5–98% of deployed vibe-coded apps carry a security flaw** (Symbiotic 1,072-app scan: 98% flawed, 16% critical); the **"70% problem"** (last 20–30% = real engineering: auth/RLS/deploy); satisfaction collapses **85% (landing pages) → 40% (SaaS+payments) → 15–20% (multi-user)**; the reburn doom-loop ("a month's credits debugging Stripe in one afternoon").
- **Outcome-to-production is an unserved MARKET** — a whole agency category (Revex/Sommo/Shipkit) exists solely to harden prototype→production; people pay agency prices to cross this mile.

> **⚠️ Load-bearing correction:** "reaching production" ≠ "the user succeeds." The #1 startup killer is **no market demand (43%)**, not no-deploy. Scope the promise as **"get your real app live and keep it evolving," NEVER "make your idea succeed."**
> **⚠️ Stat hygiene:** the "<1% deployed / 0.04% custom domain" figure is **not primary-sourced** (Lovable doesn't publish it) — the *mechanisms* are all confirmed, but don't cite the exact number publicly.

**Headline (recommended):** *"Dreamforge gets your app real, live, and working — and keeps it that way. Not a prototype. Not a demo stuck at 90%. A production app your customers actually use."*

**Value anchor (rises vs §5b):** the comparable is now **agency/DFY, not SaaS** — **$15K–$65K to have an agency ship an MVP once and walk away**; the live app then returns **$30K–$187K+/yr**. Anchor sentence: *"An agency charges $15K–$30K to ship this once and leave. Dreamforge ships it AND keeps it evolving — for a fraction, ongoing."*

**Learn-and-leave PATCH (the big win):** RevenueCat's identified churn *cure* is compounding value + workflow lock-in — **a live app the business runs on IS that lock-in.** Reframing value as "the running asset + ongoing iteration" (not "a skill you now own") converts the primary churn driver into a retention driver. **Residual leaks it does NOT fix:** (1) **no-traction churn** — a live app nobody uses is a cancellable hosting bill (biggest residual); (2) the **single-purpose buyer** (retain at a maintenance floor, not a full seat); (3) the **dependency trap** — if the engineer does everything, it's margin-capped consulting, not product.

**Reshaped, RAISED tiers** (split-fee reframed: onboarding = *to your first SHIPPED app*; monthly = *keep it live + evolving*):

| Tier | Onboarding (→ first shipped app) | Monthly (keep-it-live) | Anchored against |
|---|---|---|---|
| **Solo** | $500–$1,500 | $79–$149/mo | $800–$8K no-code build + hosting |
| **Studio** | $2,500–$5,000 | $495–$995/mo | $15K–$30K agency MVP + retainer |
| **Pro** | $5,000–**$10,000** | $1,200–$2,500/mo | $30K–$65K+ agency + fractional-CTO |

Pro onboarding can credibly reach **$10K** — still a *fraction* of the $30K–$120K it displaces. (The value model v3 sheet numbers sit at the low end of these bands.)

**The bounded guarantee — risk-reversal, NOT contingency:** guarantee **PROCESS + EFFORT**, never market outcome. Structure: **free discovery + scoping gate** (filters unbuildable ideas before the guarantee attaches) → **milestone-gated onboarding** (fee tied to a defined *"shipped"* deliverable list: auth, secure data access, deployed, domain live) → *"we get you live or you don't pay the ship milestone."* This is the fractional-CTO structure, **not** the coding-bootcamp-ISA trap (Flockjay: 114 started → 22 got the promised outcome; guarantees survived only on fine print).

**Adversarial verdict — refined thesis is *strictly better*, but do NOT ship the naive version.**
- ❌ **Don't say** "we guarantee your idea reaches production." Three landmines: wrong outcome (deployed ≠ succeeds; 43% die of no-demand → you'd refund + eat reputation on the *modal* case), guarantee-shaped language + assigned engineer = unbounded liability + non-scaling cost, and the scalability trap (the defensible part — human last-mile judgment — doesn't scale; the scalable part — product+training — isn't the moat).
- **THE REAL RISK:** you *cannot* deliver production for arbitrary ideas, so don't try. Mitigations that make it shippable:
  1. **Qualification/scoping gate — choose the ideas you accept.** Take the confirmed low-churn buildable segments: **internal business tools, ops dashboards, agency/freelancer client work, MVPs-to-launch.** Decline/flag: regulated (health/finance/payments-heavy), un-buildable-on-our-stack, and no-demand-signal validation-stage ideas.
  2. **Bound scope ruthlessly → productize the last mile.** "Path to Live" = a hard deliverable list per tier; the assigned engineer = **capped hours**, not open-ended. This is what holds **40–75% productized-service margins** vs 18–22% agency gravity.
  3. **Gate the guarantee** to process/deliverable, refundable only against *that* milestone.
  4. **Separate "live" from "successful"** in all marketing; offer demand/validation as an explicit *separate* pre-build screen (itself sellable + refund-reducing → closes the no-traction leak).
  5. **Pick a side on scale + cap it:** this is a **done-with-you, high-touch, headcount-bounded** business — a *great* one at these prices (70%+ margin if scoped), but cap bespoke availability; training is what lets one engineer serve many (users drive daily iteration themselves; the engineer is the capped safety net for the irreducible 20%).

**Bottom line:** ship *"we get your real app live and keep it evolving"* with milestone-gated onboarding (ceiling to $10K at Pro), a process-not-outcome guarantee behind a scoping gate, and ruthless scope bounding. It anchors on a bigger, provably stickier value and neutralizes the primary churn mechanism — the value is real *because* the last mile is hard, so sell the outcome you control (live + iterating), gate the ideas you accept, price against agency/DFY.

---

## 5d. Demand validation — THE KEYSTONE (closes the no-traction leak)

**The move (Product Launch Formula logic):** before we spend a paying customer's build budget, we help them get **real market signal** — does the market agree the problem is real, would they use the solution, would they *pay*? This attacks the category's #1 churn driver (no-traction) **and** startups' #1 death cause **at the same time**, and it's the only lever that works *upstream* (it changes **which apps get built**) instead of trying to retain dead apps downstream.

**Verdict: bake it in — but strip three words that would sink it: "gate," "should," "automated."** It becomes a **paid, fixed-scope, evidence-gathering FIRST DELIVERABLE of the PRODUCE tier** — never an acquisition gate, never an idea-judging oracle, never inside EXPLORE.

**Confirmed & citable:** **~43% of startups fail from poor product-market fit / no market need** (CB Insights, 385–431 companies); **74% of high-growth failures = premature scaling** ("spending without evidence," Startup Genome); churn is category-wide (Bolt CEO Eric Simons: *"churn rate for everyone is really high"*; post-2025 traffic Lovable −40% / v0 −64%). **As AI drives build cost toward zero, the scarce resource was never the code — it's knowing *what* to build, so validation's *relative* value goes UP.** → Cleanest public claim: *"~4 in 10 startups fail because they build something nobody wants — validation is the cheapest insurance against the most expensive mistake."* **Never quote a specific "success-rate lift"** (the Lean-Startup academic base is mixed/survivor-biased; PLF's "$1B" is marketing).

**Three framing rules (each fixes a documented failure mode):**
1. **Kill "gate."** Funnel friction is a conversion tax you can't afford (5 steps @ 80% = 33% survive). It's *"the first deliverable you paid for,"* not a gate on strangers.
2. **Kill "should."** Never let the platform render a verdict on the *idea* — that's the false-negative reputational bomb (Airbnb was rejected 7–15×; ~72% of unicorns were called "too niche"). You surface **the founder's own market evidence**; the *market* says yes/no, never you.
3. **Coach, not gatekeeper.** Frame it as *"let's get you paying customers before you spend the build budget"* (founders **want** this) — never *"let me check if your idea is good"* (insulting).

**The "Traction Sprint" (the pre-build playbook — ~10–14 days, engineer-guided, a validation *ladder* weighted to the bottom rung = money):**

| Step | Method | "Validated" threshold |
|---|---|---|
| 1 | **Problem interviews (Mom Test)** — ask past behavior, never "would you use this?" | ≥60–70% surface the *same unprompted pain* + an existing workaround |
| 2 | **Smoke-test landing page** *(built ON Dreamforge — dogfood)* with real pricing + one CTA | on ≥300 targeted visitors: **<5% kill · 6–10% iterate · ≥10% strong pull** |
| 3 | **Paid-ad demand test** ($50–100 non-network traffic) | conversion clears bar *and* CPA is sane vs. price |
| 4 | **Pre-sale / deposit / signed LOI** (the deciding rung) | **any real money / signed commitment appears** |

**Go/no-go: green-light the build only when the *bottom* of the ladder lights up** (money/commitment), not just emails. Cost to a decision: **~$200–500, <2 weeks** — vs. an unvalidated MVP costing 50–100× more to learn the same "no." The smoke-test page is itself the customer's **first real Dreamforge build** (dogfooding loop).

**De-risking framing (honest, not patronizing):** *"We won't tell you if your idea is good — the market will, and it's cheaper to ask now. Before we spend your build budget, let's put a real page in front of real people and see who clicks, signs up, and pays. If they do, we build with confidence. If they don't, you just saved the build cost."*

**Tiering — the clean line: EXPLORE sells a TOOL · PRODUCE sells an OUTCOME.**

| | **EXPLORE** (cheap standard tier) | **PRODUCE** (§5c premium tiers) |
|---|---|---|
| Buyer | tinkerers/hobbyists | outcome-buyers who want a real business |
| Competes with | Lovable/Bolt/v0 on price + low friction | nobody directly (validation + engineer + training) |
| Validation | **NONE — hermetically absent, zero lectures** | **included as deliverable #1 (Traction Sprint)** |
| Upgrade path | organic-traction users are the natural upsell into PRODUCE | — |

Validation is **also sellable standalone** (a fixed-scope **Traction Sprint, ~$500–1,500, 1–2 wks**) as a low-commitment on-ramp; inside PRODUCE it's **folded into the existing up-front build fee** as the first milestone (no re-pricing — it just reallocates week 1 from "start coding" to "confirm we should").

**Adversarial mitigations:** (a) **quarantine validation to PRODUCE, post-payment** — keep EXPLORE hermetic or you re-import the conversion tax; (b) **never render a verdict** — surface the founder's own signal (sidesteps the Airbnb false-negative entirely); (c) **fixed-scope/fixed-hours module** = the margin firewall against consulting scope-creep; (d) **thresholds are coaching signals, not verdicts** — a miss → "sharpen the offer/audience and retest," never "your idea failed" (novel products under-read on fake-door tests). **Helps** on commodity/known-demand apps (most of the audience); **must yield** for genuinely novel conviction-bets and anywhere near EXPLORE/top-of-funnel.

**Revised Path to Live: VALIDATE → build → ship → keep-live.** This closes the no-traction leak *at the root* — every prior retention lever (training, evolution, engineer) operated downstream trying to save an app nobody wanted; validation is the only one that changes *which apps get built*, so the retention machinery finally has **live users** to work with (traction = the retention mechanism the whole category is missing).

**Guarantee stays PROCESS, not OUTCOME:** *"We guarantee the process — real market signal before we spend your build budget, an assigned engineer, and an app that stays live and evolves. We don't guarantee your app succeeds; we guarantee you won't spend the build cost discovering the market didn't want it."*

---

## 6. Credit vs. Training — the comparison

| | Credit/Sparks | Training-included |
|---|---|---|
| Revenue timing | Upfront (cash-positive) | Recurring flat MRR |
| Breakage upside | **+5–10% margin** (unredeemed) | none — training drives retention instead |
| Gross margin | **~70–80% platform-only** (eroded by reburn/support) | **~55–70% blended** (training is COGS) |
| Hidden cost | reburn + support tickets ($15–45 each) | training cuts how-to tickets 30–50% |
| Retention/LTV | churns ~30% faster (RevenueCat) | high-touch adds 18–32 NRR points; cohort completion 60–90% vs 10–15% self-paced |

**The trade:** credit = higher per-dollar margin (+breakage) but lower retention + fatter reburn tail; training = lower headline margin but structurally higher LTV. **Verdict: training-included as the premium anchor ALONGSIDE credits as the self-serve entry.**

---

## 7. Risks & protective policies

- **Trainer cost scaling** → hard-cap 1-on-1 to team tiers; default to group/cohort/webinar (3× capacity); offshore-led; services ≤15% of revenue.
- **Training no-shows** → async-first (record everything); gate any outcome guarantee on attendance/completion; over-book cohorts ~15–20%.
- **Power users / Jevons overrun** → soft-cap builds at P90; **overage at-or-below unit cost** so heavy users self-fund; ship a live 50/80/100% meter *before* the cap; reuse `RATE_LIMIT_EXEMPT_USER_IDS`-style plumbing.
- **Caps too tight** → median user must NEVER feel the cap; soft cap → overage credits, never a mid-build stop; cap builds, never apps-kept.
- **Outcome guarantee → refund risk** → conditional (program-completion-gated), group-delivered, Pro-tier only; outcome *positioning* (+10–15% price), not money-back-no-questions.
- **Efficiency factor doesn't materialize** → treat net −20% as a hypothesis to validate by cohort A/B; the caps protect margin even at 0% gain.

---

## 8. Free→paid promo (global-training conversion)

**Live model:** `1yQYNnp7jawlW82MBLMoYjV-S14sL249SZr2RpFt_Rvs`.

**Mechanic:** free users get **no paid training** but may join a **weekly GLOBAL group session**; that session runs a **limited-time first-month-discount upgrade promo** to convert attendees on a live close. One trainer, one-to-many, huge group → the session cost is **flat (~$300/mo for 4 weekly webinars), it does NOT scale with attendance** — that's the whole point.

**Modeled outcome** (conservative: 1,000 free users · 15% attend · 18% attendee conversion vs 3% baseline · $39 Solo · 50% first-month discount · $300/mo trainer · 10-mo avg lifetime):

| Metric | Value |
|---|---|
| Conversion lift (attendee vs baseline) | **6×** |
| Total conversions / mo | 52.5 (vs 30 counterfactual) |
| **Incremental conversions / mo** | **+22.5** |
| Incremental ongoing MRR | $877.5/mo |
| Net incremental profit / mo (after trainer cost) | **$270/mo (90% monthly ROI)** |
| **Incremental LTV created per month of promo** | **$5,704 (≈ 19× the $300 cost)** |

**Why it's a top-of-funnel weapon:** near-zero marginal cost, each conversion **recurs**, and the session *itself* (training) should lift the converted users' lifetime — compounding the LTV. Levers: raise attendance (promote the session), raise attendee conversion (better live offer), extend lifetime (training reduces churn).

---

## 9. Open questions for the lead

1. **ANSWERED (Q1): Solo = $500 + $79/mo (value-priced), NOT the $39 cost floor.** Sold on the skill + the assigned engineer, anchored against dev/agency/workshop cost. $39/mo is retained only as a downstream graduate "keep-building" platform-only tier (learn-and-leave winback), never the headline. (See §5b.)
2. Team Pro **$700 / 10 seats / 2 milestones** vs trimmed **$616 / 1 milestone** — confirm.
3. The grounded median (2–3 builds) is the load-bearing assumption — accept for launch and validate by cohort, or instrument first?
4. Run both models from day one, or lead with training and add credits later (or vice-versa)?

*(The credit/Sparks build spec is unaffected — it's a different model; no reconciliation needed.)*
