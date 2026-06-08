# Design System: Dreamforge (v2 — dual-theme, reference-grade)

> Source of truth for `getdreamforge.com`. Modeled on Rive, Suno, Stripe, Retool, Brex.
> Principle: **generous space, one disciplined accent, premium purposeful motion, and the
> product (or the act of using it) shown in the hero.** Density 3 (airy) · Variance 6 ·
> Motion 6 · Creativity 7. Clarity beats cleverness.

## 1. Theme
Two full themes via `[data-theme]` on `<html>`. **Default: dark** (set pre-paint by an inline
head script reading `localStorage['df-theme'] ?? 'dark'` — no flash). A sun/moon **toggle** in the
nav persists the choice. Both themes share one accent, one type system, one spacing scale.

## 2. Color tokens
**Accent (Electric Aqua-Teal)** — the single vivid accent; CTAs, prompt-submit, links, focus
rings, key highlights. Two-token per theme for WCAG AA on both canvases:
- Dark: `--accent #1FE0C0`, `--accent-deep #14B8A1`, text-on-accent `--accent-ink #06201C`
- Light: `--accent #0E8C7A`, `--accent-deep #0A6E60`, text-on-accent `--accent-ink #FFFFFF`

**Dark theme** — bg `#0C0F0E` · surface `#141917` · surface-2 `#1B221F` ·
ink `#F2F5F3` · ink-soft `#A7B0AC` · muted `#6E7873` · border `rgba(255,255,255,.10)`.
**Light theme** — bg `#F4F3EE` · surface `#FFFFFF` · surface-2 `#FBFAF7` ·
ink `#16201E` · ink-soft `#454F4C` · muted `#7C857F` · border `rgba(22,32,30,.10)`.

Discipline: exactly one accent hue. "Success" reuses the accent. The "problem" state uses
neutrals (muted/ink), never a second color. No second accent, no rainbow, no neon over-glow
(a restrained accent-tinted shadow on the primary CTA in dark mode is allowed as "lighting").

## 3. Typography
- Display: **Cabinet Grotesk** 800/700 — large, track-tight, `clamp()`-scaled.
- Body/UI: **Satoshi** 400/500/700.
- Mono: **JetBrains Mono** 400/500 — eyebrows (UPPERCASE +0.14em), labels, build-log, citations.
- **Two-tone headline:** first clause `--ink`, second clause `--ink-soft` (Stripe/Retool move).
- Banned: Inter, generic serifs, gradient text on headers.

## 4. Hero — "try-it" prompt box (Suno/Retool)
The hero centers a real **"Describe your app…"** input. A typewriter cycles example ideas as the
placeholder; submit deep-links to `app.getdreamforge.com/?prompt=<encoded>` to start a build
(dependency: app must read `?prompt`). Accent submit. Behind it: a theme-aware **ambient gradient**
(accent glow on dark; soft wash on light) and an **animated build mock** (log → preview, looping).
Two-tone headline above; quiet grayscale credibility strip below ("Runs on Cloudflare").

## 5. Components
- **Buttons:** pill. Primary = accent fill + accent-ink text (subtle accent shadow on dark).
  Ghost secondary = 1px border + ink. Tactile `translateY(1px)` active.
- **Icons:** line SVG, `stroke="currentColor"`, colored via `--accent`/`--ink`/`--muted`. No emoji.
- **Cards / bento:** generous radius (1–1.5rem), border + theme shadow; asymmetric bento, never a
  3-equal-card row.
- **Checks:** theme-scoped `--check` data-URI in the accent color.
- **Inputs:** accent focus ring (`--accent-wash`). **Proof:** dashed placeholder cards, bracketed.

## 6. Layout & spacing
Max container ~1200px. Very generous: hero ≈ 100dvh feel, section padding `clamp(5rem,10vw,9rem)`.
Grid-first; asymmetric where it earns it. Sections alternate bg/surface for quiet rhythm. Mobile:
single column, full-width CTAs, carousels peek.

## 7. Motion
Spring ease `cubic-bezier(.2,.8,.2,1)`. Ambient gradient drift, typewriter, looping build mock,
live-status pulse, staggered scroll reveals. `transform`/`opacity` only. `prefers-reduced-motion`
disables all loops and reveals.

## 8. Anti-patterns
No emoji · no Inter/serif · no pure black (#000) · no second accent · no neon glow · no gradient
headers · no 3-equal-card rows · no fabricated/dashboard stats (real + cited, editorial only) ·
no generic placeholder names · no broken image links.
