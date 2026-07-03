# Dreamforge Copy + Positioning Brief
## Reworking getdreamforge.com around the two-lane model (EXPLORE / PRODUCE)
### For the StoryBrand copywriting pass (Sparks PR H) — direction, not final polish

> Produced 2026-07-02 from a three-stream research pass: full audit of the current
> landing-page copy, July-2026 two-lane pricing-page best practices, and
> outcome-led copy patterns. Commercial parameters are the locked §0 catalog in
> [`PLATFORM-BILLING-SPEC.md`](./PLATFORM-BILLING-SPEC.md).

---

## 0. THE CONTROLLING IDEA (read first)

The current site already owns the right villain ("the prototype trap") and the right promise ("a real app, live"). The two-lane model doesn't replace that story — it **completes** it. The current site says "most AI apps never make it to the real world" and then only offers... another AI tool. The rework closes that loop:

> **Dreamforge is the path from exploring to producing. Explore free with Sparks. When you're ready to put something real in front of real users — for yourself, your company, your customers — we produce it with you: validated first, built by an assigned Dreamforge engineer, shipped live, and kept alive.**

One narrative spine for every page: **Explorer → Producer.** EXPLORE is the on-ramp, not the product ceiling. PRODUCE is not "tier 4" — it is a different service with a different unit (outcomes, not Sparks), presented in its own visual lane, priced against hiring a developer, a $15k–$65k agency MVP, or a $5k+ AI workshop — **never against $25 tools** (research: HubSpot/Webflow segmentation pattern; premium anchors down onto self-serve, never the reverse, when the lanes use different value metrics).

---

## (A) HOMEPAGE — KEEP / CHANGE / ADD MAP

### 1. Hero — KEEP, extend the second beat
- **KEEP verbatim spirit:** "Describe your idea." / "Get a real app, live in one click." — owner-locked, and it still passes the grunt test.
- **KEEP:** the prompt form, "Build my app," "No code. Free to start."
- **CHANGE:** the badge "From an idea to a real, live app — no code required" → widen to the journey: *"From exploring an idea to producing a real business — one platform, one path."*
- **ADD:** a single quiet line under the primary CTA introducing lane two: *"Ready to ship for real customers? **We'll produce it with you** →"* (links to /pricing#produce or /produce). One line only — the hero stays EXPLORE-first because free signup is still the widest door.
- **KEEP:** credibility strip ("Runs on Cloudflare — the network behind ~20% of the web").

### 2. Build showcase (#demo) — KEEP as-is
The build log ("Designing the pages people will see" → "Your app is live") is the EXPLORE proof object. No changes needed beyond eventually shipping the real video.

### 3. Stakes (#stakes) — KEEP the villain, sharpen the resolution
- **KEEP verbatim:** headline "Most AI-built apps never make it to the real world" — owner-locked, and it's the single strongest line on the site. Keep the "prototype trap" naming and the Before/After columns.
- **KEEP:** the four cited stats (Bubble 9%, Gartner ≥30%, CVE-2025-48757, the deleted-database story). They're real and cited — the DESIGN.md anti-pattern rule ("no fabricated stats") is being honored; keep honoring it.
- **CHANGE:** "The Dreamforge Way" right column currently answers the trap only with platform features. Add one capstone line answering with the *service*: after "Grows with you — no rebuild, no starting over," extend: *"And when it's time to launch for real — a Dreamforge engineer takes it the rest of the way with you."* This is the first moment the reader learns the wall has a human answer, right where the wall is described.

### 4. Value bento (#why) — KEEP
"What if your idea just… worked?" and all six cards stay. This section sells EXPLORE and the platform under PRODUCE simultaneously. Zero changes required.

### 5. Guide section ("Why we built this") — KEEP, add one paragraph
- **KEEP verbatim:** "We've watched too many great ideas die at the demo." and the bolded thesis "You shouldn't have to become a developer to put your idea into the world. That's the whole reason we built Dreamforge."
- **ADD (one paragraph, after the bold line), guide voice:** *"So we built both halves of the answer. A place to explore — where a rough idea becomes a working app you can touch, for free. And a way to produce — where our engineers take what you've explored and turn it into something validated, launched, and alive in the market. Exploring is how you find the idea. Producing is how it becomes real."*
- **KEEP:** the four credentials (Cloudflare, careful builds, one-click live, always yours).

### 6. How it works (#how) — CHANGE: 3 steps = the EXPLORE plan; ADD the PRODUCE plan
- **KEEP:** "From idea to live app in three steps" and steps 01–03 verbatim.
- **ADD:** the **Producer path** as its own 4-step plan: *Validated → Built → Shipped → Kept alive* (Traction Sprint → assigned engineer + training → live → evolving). On the homepage a single transition line suffices: *"That's how you explore. Here's how you produce →"* — the full 4-step strip lives on the pricing page.

### 7. Comparison (#compare) — KEEP, do not extend
The Lovable/Bolt/v0 table stays — but it belongs to the EXPLORE lane only. **Never add a PRODUCE row or compare PRODUCE against these tools anywhere.** PRODUCE's comparison set (dev hire / agency / workshop) lives on the pricing page, in its own section.

### 8. Under the hood — KEEP as-is
Serves the technical validator persona; also functions as PRODUCE proof (process transparency = credibility; a guarantee must sit on a visible process).

### 9. Pricing section (#pricing) — **REPLACE ENTIRELY**
Current three tiers (Starter $0 / Pro $49 / Scale $149) are dead — wrong prices, wrong model, wrong story. Replace with a **journey teaser**, not full pricing:
- Two cards side by side: **Explore** ("Start free — 300 welcome Sparks + 150 every month. Plans from $25.") and **Produce** ("Validated, built, and shipped live by a Dreamforge engineer. Engagements from $750."). Each links to the pricing page's respective section.
- **KEEP verbatim:** the guarantee box "No lock-in, ever." + "Start free with no credit card. Your app is always yours — export it and take it with you whenever you want."
- Section headline direction: *"Two ways in. One path to real."* or *"Start free. Produce when you're ready."*

### 10. Lead gen ("Free guide") — KEEP, retitle toward the journey
Keep the guide offer ("5 hidden walls" is exactly the PRODUCE qualification narrative). Add a second CTA for warm PRODUCE prospects: *"Already know you want it produced? Apply for a scoping call →"*. (Form wiring still TODO.)

### 11. Proof (#proof) — CHANGE strategy while testimonials are placeholders
Placeholder testimonials are a liability. Until verified quotes exist, use the **no-case-study proof stack**: real platform aggregate stats only, clickable LIVE production apps ("click these — they're running right now"), the published week-by-week PRODUCE process, and the named process guarantee. **Founding-Producer pricing** ("locked rate in exchange for the case study") fills this section within a quarter.

### 12. FAQ (#faq) — KEEP all 8, ADD 4
1. *"What are Sparks?"* — with the outcome translation (§B3).
2. *"What's the difference between Explore and Produce?"* — Explore = you build with AI, free to start; Produce = we validate, build, ship, and keep it alive with you.
3. *"Do I have to explore before you'll produce?"* — No, but it helps.
4. *"What does the Traction Sprint guarantee?"* — the locked process guarantee: *"You won't spend the build cost discovering the market didn't want it."* (Never promise revenue/success.)

### 13. Final CTA (#cta) — KEEP headline, dual the CTA
- **KEEP verbatim:** "Stop building demos. Build the real thing."
- **CHANGE:** primary "Start building free" + secondary ghost link "Or have us produce it →".

### 14. Footer — minor ADD
Add "Produce" / "Traction Sprint" links under Product.

---

## (B) PRICING PAGE STRUCTURE (one page, journey-framed)

**Governing rules:** never a single 6-card grid; different value units per lane (Sparks vs outcomes) break cross-anchoring; PRODUCE's visible prices help EXPLORE (anchor-down lifts mid-tier 10–20%); **show PRODUCE prices** — $1k–$15k is productized-service money; 74% of B2B buyers expect on-page pricing (TrustRadius 2025).

### Section order (top → bottom)
1. **Journey header.** *"From exploring to producing. Start free. Build with Sparks. When it's time to ship for real, we produce it with you."* Sub-line defines the graduation trigger: *"Playing with an idea? Explore. Shipping to real customers, your company, or a paying market? Produce."*
2. **Lane selector.** "Which one am I?" — two segment buttons ("I'm exploring" / "I'm ready to produce").
3. **EXPLORE section — "Explore it yourself."** Three cards, lighter self-serve styling:
   - **Free:** 150/mo + **300 welcome** — "Build and launch your first app on us"
   - **Starter $25/mo** ★ Most popular — 2,500 Sparks — "≈ 3–4 launched apps a month, or one app you keep refining (~75 changes)"
   - **Plus $50/mo** — 6,000 Sparks — "≈ 8–10 launched apps, or serious iteration across several projects"
   - **"What costs what" mini-table directly under the cards** (Lovable per-action pattern): Build a complete app **200** · Make a change **30** · Generate an image **65** · Deploy live **10**. Plus the worked example: *"A built, launched, and polished app ≈ 600–700 Sparks (one build, a deploy, ~10 changes, a couple of images)."*
   - **Trust line:** *"Hosting included. No surprise bills. Predictable Spark costs, published right here."* (Direct counter to the Lovable hidden-2–3× and Replit effort-pricing backlash — predictability is a marketable differentiator.)
4. **Journey bridge (the seam).** Narrative band, not a card: *"Sparks get your idea working. Producing gets it into the world."* + *"When you've outgrown DIY — real customers, real stakes, a real deadline — you don't need more Sparks. You need it produced."*
5. **PRODUCE section — "Have us produce it."** Darker/premium treatment. Lead with the 4-step strip **Validated → Built → Shipped → Kept alive**. Show ALL prices, one-time + monthly as two labeled line items (the one-time is *the build*, the monthly is *the run*):
   - **Traction Sprint — $750** as a distinct full-width **"Step 1" banner** above the tier cards (it's a stage, not a sibling tier; restores a 4-card row). *"Prove people want it before you spend the build cost."* CTA: **Book your scoping call**.
   - **Solo — $1,000 build + $99/mo to keep it alive** (1 founder, 1 real product). CTA: **Apply**.
   - **Team Studio — $3,500 + $695/mo · up to 5 seats.** ★ "Most producers choose Studio" (one badge per lane). CTA: **Apply**.
   - **Team Pro — $7,500 + $1,800/mo · up to 10 seats.** CTA: **Apply**.
   - **Enterprise — $15,000 + $4,000/mo.** CTA: **Apply**. (Its presence anchors Studio/Pro downward even if few buy.)
   - **Show vs gate:** show price, deliverables, timeline, who-it's-for, seats. Gate exact scope/architecture/custom terms behind the call. Application framed as scoping, not gatekeeping: *"Apply in 2 minutes → a real scoping call on Zoom → a fixed price, in writing, before you pay a dollar."*
6. **Anchor section (PRODUCE only).** Honest comparison vs hiring a developer ($150k+/yr), a $15,000–$65,000 agency MVP (citable: TeaCode 2026 $15k–$120k), and $5k+ AI workshops that ship nothing. Rows = risk + predictability (price known upfront / time to live / one accountable owner / after-launch / validation included). **Never** Lovable/Bolt/v0 here.
7. **Guarantee band.** The process guarantee, stated once, prominently (named — see §C). Plus "No lock-in, ever."
8. **FAQ** (Sparks translation, rollover/expiry policy — decide + publish it, what the monthly covers, the scoping call, what happens if the Sprint says "no demand").
9. **Final dual CTA.** "Start exploring free" / "Apply to produce."

**Mobile:** recommended-tier-first within each lane (Starter first, Studio first).

---

## (C) DRAFT COPY DIRECTION (final polish via storybrand-2.0 skill)

**Journey masthead candidates:**
- *"From exploring to producing. Real apps, real users, real businesses."*
- *"Explore your idea free. Produce it for real. One path, no rebuild."*
- *"Most AI apps never make it to the real world. Yours will — because we built the whole road."*

**EXPLORE anchor sentences:**
- *"300 Sparks free the moment you sign up — enough to build and launch your first real app today."*
- *"Sparks are simple: 200 builds an app, 30 makes a change, 10 puts it live. No meters you can't read, no bill you can't predict."*
- *"Hosting included. The price on this page is the price."*

**PRODUCE replacement headline (Designjoy pattern):**
- *"Dreamforge Produce replaces the $40,000 agency quote, the developer you can't find, and the workshop that ships nothing — with a validated, launched, kept-alive product."*

**Accountability, never effortlessness (TurboTax/Pilot pattern; Builder.ai is the cautionary tale):**
- *"Your idea. Your app. Your business. We get it live — and keep it alive."*
- *"50/50 platform and people: the AI builds fast; your Dreamforge engineer makes it real."*

**Assigned-expert lines:**
- *"You're matched with a dedicated Dreamforge engineer — the same person from scoping call to launch day, and after."*
- *"We don't hand you a login. We hand you an engineer, and training to run what we build together."*

**Validation-as-benefit (the Traction Sprint — de-risking, never gatekeeping):**
- *"An agency MVP runs $15,000–$65,000. The Traction Sprint is $750 — and it answers the only question that matters before you spend build money: will people actually want this?"*
- *"Real validation isn't a survey. It's demand you can see before the build begins."*
- *"Your build starts with buyers, not mockups. The Sprint is week one of producing — not a test you have to pass."*
- *"If the market says no, you find out for $750 — not for your entire build budget. That's not a failed project. That's the cheapest lesson in business."*
- **The guarantee, locked shape:** *"Our guarantee is simple: you will never spend the build cost discovering the market didn't want it."* Consider naming it — **"The Validated-First Guarantee"** (named guarantees read as product features).

**PRODUCE intro anchor sentence:**
- *"Hiring a developer costs six figures a year. An agency MVP runs $15,000–$65,000 — and validation isn't included. Dreamforge Produce starts at $1,000, with an assigned engineer, and demand proven before the build."*

**Vs-tool wedge (narrative only, never price comparison):**
- *"AI builders get you 80% of the way there. Producing is the other 20% — the part that survives real users: sign-ins, payments, uptime, and someone accountable when it matters."*

**CTA language:** EXPLORE = "Start building free" / "Start exploring" (never "Buy"/"Subscribe"). PRODUCE = "Book your scoping call" (Sprint) / "Apply to produce" (tiers), with microcopy: *"2 minutes. Then a real conversation, a fixed price in writing, and only then a payment link."*

**Voice guardrails:** keep the plain-spoken, non-technical warmth. PRODUCE copy sounds *senior and calm*, not salesy. Honor DESIGN.md: clarity beats cleverness, two-tone headlines, no fabricated stats, cited numbers only.

---

## (D) WHAT NOT TO SAY

1. **No churn stats.** The Lovable ~85% figure is internal-only — never publish, imply, or footnote it. The public version of that insight = the already-cited Bubble/Gartner stats + the "prototype trap" narrative.
2. **No outcome guarantees.** Never promise revenue, customers, traction, ROI, or refunds tied to market results. The guarantee is process-shaped and locked. The guarantee must always appear NEXT TO the visible 4-step Producer path.
3. **The $25-anchor trap.** PRODUCE never shares a sentence, table, card row, or comparison with the $25/$50 tiers or Lovable/Bolt/v0 pricing. The bridge between lanes is *journey* language ("outgrown DIY"), never value-per-dollar language.
4. **No effortlessness over-promise.** Promise accountability, an assigned human, a visible process — not magic.
5. **No fabricated proof.** No invented testimonials/stats/logos. Use aggregate platform stats, live clickable production apps, the published process.
6. **No opaque metering.** Never describe Sparks in tokens/"compute"/effort terms (the Replit backlash). Every Spark number carries an outcome translation.
7. **No hidden PRODUCE prices.** All five price points shown; only scope/quote specifics gate behind the call.
8. **Don't demote EXPLORE.** Never "the toy version" — "Explorer" is an identity to be proud of; "Producer" is the transformation.
9. **Don't kill the locked lines.** "Describe your idea. Get a real app, live in one click." and "Most AI-built apps never make it to the real world" survive every rewrite.

---

**Implementation note (PR H):** primary file `worker/static/landing-pages/index.html` (section IDs map above); the pricing page is net-new in the same directory, styled per `worker/static/landing-pages/DESIGN.md`. Final copy crafted with the **storybrand-2.0 skill** using this brief as the BrandScript input: Hero = the Explorer with a real idea; Guide = Dreamforge (empathy: "we've watched ideas die at the demo"; authority: Cloudflare + process + engineer); Plan = Explore (3 steps) then Produce (Validated → Built → Shipped → Kept alive); Stakes = the prototype trap; Success = a real app, real users, a real business; Identity transformation = **Explorer → Producer**.
