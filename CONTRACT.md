# Builder Contract — claude.hjahouse.me clone

You are building one route of a faithful clone of **https://claude.hjahouse.me/**.
Project root: `C:/Users/hasan/Projects/Hasan-apps/claude-clone`. Dev server: `http://localhost:3001`.
Stack: **Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4**.
`params` is a **Promise** in Next 16 (`const { slug } = await params;`).

## Look & feel (already themed — just use the tokens)

Warm "Claude" sepia palette. DM Sans body, **Source Serif 4** headings (auto-applied to `h1–h4`), JetBrains Mono code. Burnt-orange accent `#B45309`.

### Tailwind color utilities (light + dark already wired)
`bg-bg` `bg-bg-subtle` `bg-bg-muted` `bg-card` `bg-card-hover` ·
`text-fg` `text-fg-muted` `text-fg-subtle` `text-fg-faint` ·
`border-border` `border-border-strong` ·
`text-accent` `bg-accent` `text-accent-fg` `bg-accent-soft` `text-accent-soft-fg` `hover:bg-accent-hover` ·
terminal: `bg-term-bg` `bg-term-bar` `text-term-fg` `text-term-muted` `text-term-green` `text-term-amber` `text-term-blue` `text-term-purple` ·
levels: `text-beginner` `text-intermediate` `text-advanced`.
Fonts: `font-sans` `font-serif` `font-mono`. Radii via rounded-md / rounded-lg / rounded-xl. Shadows via the CSS vars `--shadow-sm`, `--shadow-md`, `--shadow-lg` (use them as `shadow-[var(--shadow-md)]`).

**Do NOT hardcode hex colors.** Use the tokens so dark mode works automatically.

## Animations (REQUIRED on every page)

- Wrap each section/card in `<Reveal>` (fade + rise on scroll). `delay={i*70}` to stagger.
- Use `<Terminal>` for any terminal demo (typing animation built in).
- Hover transitions on cards/links (`transition hover:-translate-y-0.5 hover:border-accent/40`).
- Keyframe utilities available: `animate-fade-up` `animate-fade-in` `animate-blink` `animate-pulse-dot`.

## Shared components — import and reuse, do not reinvent

```ts
import { Container, PageHeader, LevelBadge, ArrowLink, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Kbd, Quiz, Prose, type QuizQuestion } from "@/components/content";
import { MODULES, NAV, SITE, moduleBySlug } from "@/lib/site";
```

- `<Container>` — `max-w-6xl` page width wrapper. Every page body sits in one.
- `<PageHeader eyebrow title lede />` — standard sub-page header (serif title + lede).
- `<Terminal script={Step[]} title? loop? showStatus? />` — Step kinds:
  `{t:"print",text,tone}` `{t:"type",text,tone,prompt?}` `{t:"out",lines:[{text,tone}],gap?}` `{t:"wait",ms}` `{t:"clear"}`.
  tones: `system user green amber blue purple muted error default`.
- `<CodeBlock code filename? lang? tone? />` — copy button built in. `tone="terminal"` for dark.
- `<Callout tone="note|tip|warn|info" title?>…</Callout>`, `<Kbd>Ctrl K</Kbd>`.
- `<Quiz questions={QuizQuestion[]} />` — `{q, options[], answer:number, explanation}`. Modules end with one.
- `<Prose>` — wrapper giving `p/h2/h3/ul/li/code/a` sensible module-body styles.

## Rules

1. **Read the original page first** — scrape `https://claude.hjahouse.me/<route>` (firecrawl_scrape markdown, or the localized `/ar` variant for Arabic). Reproduce its real headings, copy, code samples, and sections faithfully — "all the details".
2. Server Components by default. Add `"use client"` only for interactivity (state, effects, handlers).
3. Match section order and structure of the original. Include loading/empty/hover states.
4. Mobile-first responsive (works at 375px and 1440px). Touch targets ≥ 40px.
5. Only write the file(s) for YOUR assigned route. Do not edit shared components, layout, globals.css, site.ts, or other routes' files.
6. End by confirming your route returns content (you may `curl -s http://localhost:3001/<route>`).
