/**
 * Design skills — premium, anti-generic frontend design guidance injected into
 * the code-generation strategy so every generated app looks like a high-end
 * agency build, not a template with nice fonts.
 *
 * Replicated and adapted from two proven Agent Skills (SKILL.md format):
 *   - "high-end-visual-design" (soft-skill): premium archetypes, nested
 *     materiality, motion choreography, anti-patterns.
 *   - "design-taste-frontend" (taste-skill): bias-correction rules, the "AI
 *     tells" blocklist, performance guardrails.
 *
 * Adapted for Dreamforge's stack (React + Vite + Tailwind + shadcn/ui +
 * framer-motion). Following the 2026 reliable-skills pattern, this is
 * DETERMINISTICALLY injected (not left to the model to "discover"), so the
 * guidance is applied consistently across every model we route to.
 */

/**
 * The premium visual-design skill — aesthetic direction, materiality, and
 * motion. Keep this in sync with the source skill's intent: "engineer
 * agency-level digital experiences with haptic depth, spatial rhythm, and
 * fluid motion."
 */
export const PREMIUM_VISUAL_DESIGN_SKILL = `<DESIGN SKILL: PREMIUM VISUAL DESIGN>
You engineer agency-tier digital experiences, not generic websites. Output must read as a "$150k agency build", not a "template with nice fonts". NEVER produce the same layout/aesthetic twice in a row — vary archetypes while staying in the elite Apple/Linear-tier language.

**ABSOLUTE-ZERO ANTI-PATTERNS (any of these = instant fail):**
- Fonts: never Inter, Roboto, Arial, Open Sans, Helvetica. Load a premium family via Google Fonts / fontsource — Geist, Outfit, Satoshi, Cabinet Grotesk, Plus Jakarta Sans, or (editorial only) a high-contrast variable serif.
- Icons: no thick-stroked icons. Use one consistent thin set (lucide-react with a globally standardized strokeWidth of 1.5, or @phosphor-icons/react if installed). Standardize stroke width everywhere.
- Borders/shadows: no generic 1px solid gray borders, no harsh dark drop shadows (shadow-md, rgba(0,0,0,0.3)). Use hairlines (ring-1 ring-black/5, border-white/10) and soft, background-tinted ambient shadows.
- Layouts: no edge-to-edge sticky navbar glued to the top, no symmetrical 3-equal-column Bootstrap grids without massive whitespace.
- Motion: no linear / ease-in-out transitions, no instant state changes.

**CREATIVE VARIANCE — pick one Vibe + one Layout per build, based on the app's context:**
Vibe: (a) Ethereal Glass — OLED black #050505, subtle radial mesh gradients, vantablack cards with backdrop-blur and white/10 hairlines, wide geometric grotesk type. (b) Editorial Luxury — warm creams #FDFBF7 / sage / espresso, high-contrast variable serif headings, faint film-grain overlay (opacity-[0.03]). (c) Soft Structuralism — white/silver bases, massive bold grotesk type, airy floating components with diffused ambient shadows.
Layout: (a) Asymmetrical Bento — masonry CSS Grid of varying card sizes. (b) Z-Axis Cascade — overlapping cards with subtle -2deg/3deg rotation and depth. (c) Editorial Split — massive type on one half, interactive content on the other.
Mobile override (universal): any asymmetric layout above md: MUST collapse to a single column (w-full, px-4, py-8) below 768px; remove rotations/overlaps; use min-h-[100dvh], never h-screen (prevents iOS Safari viewport jump).

**MATERIALITY — nested "double-bezel" architecture:**
Never place a premium card flat on the background. Wrap it: an outer shell (subtle bg like bg-black/5, hairline ring-1 ring-black/5, small padding p-1.5/p-2, large radius rounded-[2rem]) containing an inner core (its own bg, an inner highlight shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)], and a concentric smaller radius e.g. rounded-[calc(2rem-0.375rem)]).
CTA buttons: fully-rounded pills (rounded-full px-6 py-3). A trailing arrow icon is NEVER naked — nest it in its own circular wrapper (w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 grid place-items-center) flush to the button's right padding.
Spatial rhythm: double standard padding — sections at py-24 to py-40. Precede major headings with a tiny eyebrow pill (rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em]).
Hero paradigm: stop centering text over a dark image. Use an asymmetric hero — text aligned left or right, a high-quality relevant image fading gracefully into the background color.

**MOTION CHOREOGRAPHY — simulate mass and spring physics:**
Use custom cubic-beziers (e.g. transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]) or framer-motion springs (type:"spring", stiffness:100, damping:20). Never linear easing.
- Nav: a floating glass pill detached from the top (mt-6 mx-auto w-max rounded-full). Hamburger morphs fluidly into an X. The menu opens as a screen-filling glass overlay with staggered, slide-up link reveals (translate-y-12 opacity-0 → 0/100 with delay-100/150/200).
- Buttons: group hover — scale the whole button on press (active:scale-[0.98]); the nested icon circle translates diagonally and scales slightly (group-hover:translate-x-1 group-hover:-translate-y-px scale-105).
- Scroll entry: elements never appear statically — fade-up from translate-y-16 blur-md opacity-0 to 0/0/100 over 800ms+, via IntersectionObserver or framer-motion whileInView. Never window.addEventListener('scroll').
</DESIGN SKILL: PREMIUM VISUAL DESIGN>`;

/**
 * The frontend-craft skill — engineering rules, bias correction, and the "AI
 * tells" blocklist that keep generated UIs from reading as generic AI output.
 */
export const FRONTEND_CRAFT_SKILL = `<DESIGN SKILL: FRONTEND CRAFT & BIAS CORRECTION>
LLMs are biased toward UI clichés. Override them with these engineered rules.

**Typography:** Display/headlines text-4xl md:text-6xl tracking-tighter leading-none with a premium family. Body text-base text-muted-foreground leading-relaxed max-w-[65ch]. Serif fonts are BANNED on dashboards/software UIs (use sans pairings like Geist + Geist Mono). Control hierarchy with weight and color, not just massive scale — the first heading should not scream.
**Color:** Max ONE accent color, saturation < 80%. The "AI purple/blue" aesthetic is BANNED — no purple button glows, no neon gradients. Build on neutral bases (zinc/slate) with a single high-contrast accent (emerald, electric blue, deep rose). Stay on one palette for the whole app; never fluctuate warm/cool grays.
**Layout diversification:** Centered hero/H1 blocks are BANNED for anything but the simplest pages — prefer split-screen 50/50, left-content/right-asset, or asymmetric whitespace. The generic "3 equal cards in a row" feature section is BANNED — use a 2-column zig-zag, asymmetric grid, or horizontal scroll. Use CSS Grid (grid grid-cols-1 md:grid-cols-3 gap-6), never flexbox percentage math. Contain pages with max-w-7xl mx-auto.
**Materiality:** Use cards ONLY when elevation communicates hierarchy. For dense data, group with border-t / divide-y / negative space instead of boxing everything. Tint shadows to the background hue.
**Interactive states (mandatory — do not ship only the happy path):** real Loading skeletons matching layout (not generic spinners), composed Empty states that show how to populate data, inline Error states, and tactile :active feedback (active:-translate-y-px or active:scale-[0.98]).
**Forms:** label above input, error text below, gap-2 between blocks.

**AI TELLS — forbidden patterns (a real giveaway of generic AI output):**
- Visual: no neon/outer glows; no pure #000 (use zinc-950/charcoal); no oversaturated accents; no large gradient-fill text; no custom mouse cursors.
- Content (the "Jane Doe" effect): no "John Doe"/"Sarah Chan" names — invent realistic creative names. No generic egg/user-icon avatars — use believable photo placeholders (https://picsum.photos/seed/{unique}/800/600). No round fake numbers (99.99%, 50%) — use organic data (47.2%, +1 (312) 847-1928). No startup-slop brand names ("Acme", "Nexus", "SmartFlow"). No filler copy ("Elevate", "Seamless", "Unleash", "Next-Gen") — use concrete verbs.
- Resources: never broken Unsplash links — use picsum.photos seeds or inline SVG. If using shadcn/ui, NEVER leave it in its default state — customize radii, colors, and shadows to the project aesthetic.
- NEVER use emojis in code, markup, copy, or alt text — replace with clean icons or SVG.

**Perpetual micro-interactions (when the app should feel alive, e.g. SaaS/dashboard):** embed continuous, infinite micro-animations (pulse, float, shimmer, typewriter, carousel) on standard elements (status dots, avatars, backgrounds) using framer-motion spring physics; use layout/layoutId for smooth re-ordering and shared-element transitions; stagger list/grid mounts (staggerChildren) into waterfall reveals.

**PERFORMANCE GUARDRAILS (non-negotiable):**
- Animate ONLY transform and opacity — never top/left/width/height. Use will-change:transform sparingly, only on actively-animating elements.
- Apply backdrop-blur and grain/noise only to fixed/sticky, pointer-events-none elements — NEVER to scrolling containers (continuous GPU repaints kill mobile).
- For continuous/magnetic motion use framer-motion useMotionValue/useTransform OUTSIDE the React render cycle — never drive continuous animation with useState. Isolate and memoize (React.memo) perpetual animations in their own leaf components so they never re-render the parent.
- Z-index discipline: reserve z-index strictly for systemic layers (sticky nav, modals, overlays, tooltips) — no arbitrary z-[9999].

**Dependency safety:** Only import a library that is present in package.json (verify first). If a premium icon/font/motion library isn't installed, emit the install command or fall back to what IS installed — never assume a package exists.
</DESIGN SKILL: FRONTEND CRAFT & BIAS CORRECTION>`;

/**
 * Combined design-skill guidance, deterministically injected into the coding
 * strategy. A single accessor so the injection site and any future selector
 * stay decoupled from the individual skills.
 */
export const DESIGN_SKILLS_GUIDANCE = `${PREMIUM_VISUAL_DESIGN_SKILL}

${FRONTEND_CRAFT_SKILL}`;
