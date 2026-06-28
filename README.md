<div align="center">

# ⬡ claude.hjahouse.me

### An interactive, **bilingual** learning platform for Claude Code

A faithful, pixel-aware rebuild of an interactive Claude Code learning site — **English + العربية (full RTL)**, light **and** dark, with animated terminals, an interactive playground, a config builder, quizzes, and 12 hands‑on modules. Branded with the **Nexus‑AI** identity.

`Next.js 16` · `React 19` · `TypeScript` · `Tailwind v4` · `49 routes` · `EN + AR` · `light + dark`

</div>

---

## 📑 Table of contents

1. [What is this repo for?](#-what-is-this-repo-for)
2. [Feature highlights](#-feature-highlights)
3. [Site map](#-site-map)
4. [Architecture at a glance](#-architecture-at-a-glance)
5. [How a request becomes a page](#-how-a-request-becomes-a-page)
6. [Bilingual (i18n) routing](#-bilingual-i18n-routing)
7. [Theme: no‑flash dark mode](#-theme-no-flash-dark-mode)
8. [The animated terminal engine](#-the-animated-terminal-engine)
9. [Design system & brand](#-design-system--brand)
10. [Project structure](#-project-structure)
11. [Routes](#-routes)
12. [Run locally](#-run-locally)
13. [How it was built](#-how-it-was-built)

---

## 🎯 What is this repo for?

This repo is a **complete, self‑contained web app** that teaches people how to use **Claude Code** (Anthropic's terminal coding agent) — *by doing, not reading*. Instead of static docs, every concept is interactive:

- **Try** commands in a real in‑browser terminal (no install, no API key)
- **Generate** real config files (`CLAUDE.md`, hooks, skills, MCP servers, plugins) with live preview
- **Verify** understanding with quizzes at the end of every module

It's fully **bilingual** — every page exists in English (`/`) and Arabic with right‑to‑left layout (`/ar`) — and ships in both **light and dark** themes.

```mermaid
flowchart LR
    V(["👩‍💻 Visitor"]) --> Learn["📚 Learn<br/>12 guided modules"]
    V --> Practice["💻 Practice<br/>Playground terminal"]
    V --> Generate["🛠️ Generate<br/>Config Builder"]
    V --> Check["🎯 Check level<br/>Quiz"]
    Learn --> Outcome(["✅ Confident with Claude Code"])
    Practice --> Outcome
    Generate --> Outcome
    Check --> Outcome
```

---

## ✨ Feature highlights

| Area | What it does |
|---|---|
| 🖥️ **Animated terminal** | Character‑by‑character typing engine with blinking cursor, click‑to‑pause, looped scripts. Powers the hero demo + module demos. |
| 💻 **Playground** | A real interactive terminal sandbox — type slash‑commands (`/help`, `/clear`, `/model`…) and natural‑language prompts, get simulated Claude responses, command history. |
| 🛠️ **Config Builder** | Tabbed forms (CLAUDE.md · Skill · Agent · Hook · MCP · Plugin) that **generate config live** with copy/download. |
| 🔎 **Feature Index** | ~259 Claude Code features, searchable + filterable by **type / level / category**. |
| 🎯 **Quiz** | Self‑assessment that routes you to a Beginner / Intermediate / Advanced result with recommended modules. |
| 📚 **12 modules** | Full lessons with prose, code blocks, terminal demos and a quiz — in **EN + AR**. |
| 📋 **Cheat Sheet** | Printable reference of commands, shortcuts, files, CLI flags. |
| 🗓️ **Changelog** | All **63** versions with detail. |
| ⌨️ **Command palette** | `Ctrl/⌘ + K` fuzzy search across pages & modules. |
| 🌗 **Theme + 🌍 i18n** | No‑flash dark mode; locale‑aware chrome; RTL for Arabic. |
| 🎞️ **Motion** | Scroll‑reveal on every section + hover micro‑interactions. |

---

## 🗺️ Site map

```mermaid
flowchart TD
    Root["🏠 / — Home"]
    Root --> Learn["📚 /learn — 12 modules"]
    Root --> Play["💻 /playground"]
    Root --> Build["🛠️ /build — config builder"]
    Root --> Ref["📋 /reference — cheat sheet"]
    Root --> Cat["🔎 /catalog — feature index"]
    Root --> Quiz["🎯 /quiz"]
    Root --> Extra["/resources · /changelog<br/>/feedback · /roadmap"]
    Root --> Misc["/certificate/[type]<br/>/share/snippet/[slug]"]
    Learn --> Mod["/learn/[slug]<br/>getting-started · slash-commands · memory …<br/>… · workflows · plugins"]
    Quiz --> QR["/quiz/result/[level]<br/>beginner · intermediate · advanced"]

    Root == "عربي toggle" ==> AR["🌍 /ar — Arabic RTL mirror"]
    AR --> ARtree["Every page mirrored<br/>dir=rtl · Arabic copy · localized links"]
```

---

## 🏗️ Architecture at a glance

A clean, layered structure — pages wire things together, components hold behaviour, `lib` + `content` hold data. Vendors are reached through thin seams.

```mermaid
flowchart TB
    subgraph Browser["🌐 Browser"]
        UI["Rendered page · light/dark · LTR/RTL"]
    end

    subgraph App["⚙️ Next.js App Router — src/app"]
        Layout["layout.tsx<br/>fonts · theme script · Header + Footer"]
        Routes["page.tsx routes<br/>EN at / · AR under /ar"]
        Dynamic["dynamic segments<br/>[slug] · [level] · [type] · [snippet]"]
    end

    subgraph Comp["🧩 Components — src/components"]
        Chrome["Header · Footer · CommandPalette · Providers"]
        Terminal["Terminal — typing engine"]
        Building["CodeBlock · Callout · Quiz · Reveal · ui"]
    end

    subgraph Data["📦 Data & content"]
        Site["lib/site.ts<br/>nav · MODULES · i18n · search index"]
        Lessons["content/learn/*<br/>EN + AR lesson bodies + registries"]
    end

    UI --> App
    Routes --> Comp
    Dynamic --> Lessons
    Comp --> Data
    Layout --> Site
```

---

## 🔁 How a request becomes a page

```mermaid
flowchart LR
    A["Request → /ar/learn/hooks"] --> B{"path under /ar ?"}
    B -- "yes" --> C["locale = ar · dir = rtl"]
    B -- "no" --> D["locale = en · dir = ltr"]
    C --> E["ModuleScaffold + Arabic lesson body"]
    D --> F["ModuleScaffold + English lesson body"]
    E --> G["Header/Footer read pathname<br/>→ localized labels + /ar links"]
    F --> G
    G --> H["Inline theme script applies .dark<br/>before first paint"]
    H --> I["Reveal + Terminal animate as they enter view"]
    I --> Z(["🖼️ Page painted"])
```

---

## 🌍 Bilingual (i18n) routing

English lives at the root; Arabic is a parallel subtree under `/ar` that **reuses the same components** with a `locale` prop. The chrome (Header/Footer/scaffold) derives the locale from the URL, swaps copy, prefixes internal links with `/ar`, and flips direction to RTL — while terminals and code blocks stay LTR.

```mermaid
flowchart TD
    URL["pathname"] --> Detect["localeFromPath()"]
    Detect -->|"/..."| EN["en"]
    Detect -->|"/ar/..."| AR["ar"]
    EN --> Render["Shared components"]
    AR --> Render
    Render --> Links["localize(href, locale)<br/>keeps you in the right tree"]
    Render --> Copy["EN strings ⇄ Arabic strings"]
    Render --> Dir["dir = ltr ⇄ rtl<br/>(terminals/code stay ltr)"]
```

---

## 🌗 Theme: no‑flash dark mode

A tiny **inline script** runs before the first paint, so there's never a white flash when loading a dark page. All colors are CSS variables that flip between `:root` and `.dark`.

```mermaid
flowchart LR
    Load["Page load"] --> Script["Inline script reads<br/>localStorage.theme"]
    Script --> Q{"dark?"}
    Q -- "yes" --> Add["add .dark to html<br/>before paint"]
    Q -- "no" --> Keep["light tokens"]
    Add --> Vars["CSS variables resolve<br/>:root vs .dark"]
    Keep --> Vars
    Btn["🌙 toggle"] --> Save["persist to localStorage<br/>+ swap class"] --> Vars
    Vars --> Paint(["🎨 Correct theme, zero flash"])
```

---

## ⌨️ The animated terminal engine

`Terminal.tsx` is a small state machine that walks a **script** of steps and renders them with realistic timing. The same component drives the hero, module demos, and (interactively) the Playground.

```mermaid
sequenceDiagram
    participant U as Visitor
    participant T as Terminal
    participant S as script[ ]
    T->>S: read steps
    loop each step
        alt type
            S-->>T: reveal chars one-by-one (+ jitter)
            T-->>U: typed text + blinking cursor
        else out
            S-->>T: print output lines (staggered, colored)
        else wait
            S-->>T: pause N ms
        end
    end
    U->>T: click → pause / resume
    T->>S: loop back to the start
```

Each step is one of: `type` (typed input) · `out` (printed output lines) · `print` (instant line) · `wait` · `clear`. Tones map to terminal colors (`green`, `amber`, `blue`, `purple`, `error`…).

---

## 🎨 Design system & brand

Token‑driven (Tailwind v4 `@theme` + CSS variables), so light/dark and rebrands are one‑file changes. Identity comes from **Nexus‑AI**.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--accent` | `#19ACE7` | `#2BB6EE` | brand cyan — CTAs, links, focus |
| `--fg` | `#1B2433` | `#F3F7FB` | headings / primary text |
| `--bg` | `#F6F9FC` | `#0E1622` | page ground |
| `--card` | `#FFFFFF` | `#16202E` | surfaces |
| levels | green · cyan · rose | — | beginner / intermediate / advanced |

Plus a fixed **multi‑hue aurora** background (cyan · violet · teal · pink) — subtle in light, vivid over navy in dark. Fonts: **DM Sans** (body), **Source Serif 4** (headings), **JetBrains Mono** (code).

---

## 📂 Project structure

```text
src/
├─ app/                       # Next.js App Router
│  ├─ layout.tsx              # fonts · metadata · theme script · Header/Footer
│  ├─ page.tsx                # 🏠 EN home (animated hero)
│  ├─ globals.css             # design tokens (light/dark) · animations · aurora bg
│  ├─ learn/[slug]/           # 12 EN modules (dynamic)
│  ├─ playground/             # interactive terminal + PlaygroundClient
│  ├─ build/                  # Config Builder + BuilderClient
│  ├─ catalog/ quiz/ reference/ resources/ changelog/ feedback/ roadmap/ …
│  └─ ar/                     # 🌍 full Arabic (RTL) mirror of every route
├─ components/                # Header · Footer · Terminal · CommandPalette
│  ├─ Providers.tsx           #   theme + Ctrl/⌘K palette context
│  ├─ ModuleScaffold.tsx      #   module chrome (sidebar · prev/next · locale)
│  ├─ CodeBlock.tsx content.tsx ui.tsx Reveal.tsx
├─ content/learn/             # per‑module lesson bodies
│  ├─ *.tsx                   #   English lessons + registry.tsx
│  └─ ar/*.tsx                #   Arabic lessons + registry-ar.tsx
└─ lib/site.ts                # nav · MODULES · i18n strings · search index
```

---

## 🧭 Routes

| Area | English | Arabic (RTL) |
|---|---|---|
| Home | `/` | `/ar` |
| Learn (12 modules) | `/learn`, `/learn/[slug]` | `/ar/learn`, `/ar/learn/[slug]` |
| Playground | `/playground` | `/ar/playground` |
| Config Builder | `/build` | `/ar/build` |
| Feature Index | `/catalog` | `/ar/catalog` |
| Quiz + results | `/quiz`, `/quiz/result/[level]` | `/ar/quiz`, `/ar/quiz/result/[level]` |
| Cheat Sheet | `/reference` | `/ar/reference` |
| Resources / Changelog / Feedback / Roadmap | `/resources` `/changelog` `/feedback` `/roadmap` | `/ar/…` |
| Certificate / Shared snippet | `/certificate/[type]`, `/share/snippet/[slug]` | — |

---

## ▶️ Run locally

```bash
npm install
npm run dev      # http://localhost:3000  (uses 3001 if 3000 is busy)
```

```bash
npm run build && npm start    # production build + serve
```

**Optional — use the real hostname locally.** Add to `C:\Windows\System32\drivers\etc\hosts` (admin) then visit `http://claude.hjahouse.me:3000`:

```text
127.0.0.1   claude.hjahouse.me
```

---

## 🤖 How it was built

The whole site was produced with **parallel AI agent workflows** — scout the original, lay a shared foundation, then fan out one agent per route, audit everything against the source, and fix in parallel.

```mermaid
flowchart TB
    Scout["🔍 Scout original<br/>Firecrawl map + Playwright snapshots"] --> Found["🧱 Foundation<br/>tokens · Terminal · chrome · i18n · data"]
    Found --> W1["🟦 Wave 1 — 24 agents<br/>build every English route"]
    W1 --> W2["🟩 Wave 2 — 23 agents<br/>build the Arabic RTL mirror"]
    W2 --> W3["🔬 Wave 3 — 49 auditors<br/>parity · design · animations · gaps"]
    W3 --> W4["🛠️ Wave 4 — 9 fix agents<br/>localize AR · bugfix · expand changelog"]
    W4 --> Gate["✅ tsc + next build<br/>49 routes · all 200"]
    Gate --> Brand["🎨 Nexus palette + aurora background"]
    Brand --> Ship["🚀 push → github.com/hasan-99"]
```

---

<div align="center">

**Built by Hasan Jahoush · حسن الجاهوش**

⬡ claude.hjahouse.me

</div>
