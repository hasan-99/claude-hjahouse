import Link from "next/link";
import Terminal, { type Step } from "@/components/Terminal";
import Reveal from "@/components/Reveal";
import { Container, ArrowLink, LevelBadge } from "@/components/ui";
import { MODULES } from "@/lib/site";

const HERO_SCRIPT: Step[] = [
  { t: "print", text: "Welcome to Claude Code! Type a command or /help to get started.", tone: "system" },
  { t: "wait", ms: 500 },
  { t: "type", text: "/help", tone: "user" },
  {
    t: "out",
    lines: [
      { text: "Available commands:", tone: "muted" },
      { text: "  /help        Show available commands", tone: "blue" },
      { text: "  /clear       Clear conversation history", tone: "blue" },
      { text: "  /model       Switch the active model", tone: "blue" },
      { text: "  /review      Review code changes", tone: "blue" },
      { text: "  /init        Generate a CLAUDE.md file", tone: "blue" },
    ],
  },
  { t: "wait", ms: 900 },
  { t: "type", text: "Create a React component for a todo list", tone: "user" },
  {
    t: "out",
    lines: [
      { text: "✦ Thinking…", tone: "amber" },
      { text: "● Created TodoList.tsx with add, toggle, and delete", tone: "green" },
      { text: "  + 42 lines · useState · accessible checkboxes", tone: "muted" },
      { text: "Done — ready to drop into your app.", tone: "default" },
    ],
    gap: 120,
  },
  { t: "wait", ms: 1600 },
];

const FEATURES = [
  {
    title: "Try before you install",
    body: "Practice slash commands, hooks, and skills in a terminal simulator right in your browser. No setup, no API key.",
  },
  {
    title: "Build real configs",
    body: "Interactive forms generate CLAUDE.md, hooks, and plugin configs you can copy straight into your project.",
  },
  {
    title: "Verify understanding",
    body: "Each module ends with a quiz. Answer wrong and you get the explanation, not just the answer.",
  },
];

const EXPLORE = [
  { title: "Playground", href: "/playground", body: "Practice commands in a dedicated full-size terminal sandbox." },
  { title: "Config Builder", href: "/build", body: "Generate CLAUDE.md, skills, agents, hooks, MCP servers, and plugins." },
  { title: "Cheat Sheet", href: "/reference", body: "Printable shortlist of the commands, shortcuts, and files you use most." },
  { title: "Feature Index", href: "/catalog", body: "Search the full Claude Code feature list by type, level, category, and module." },
  { title: "Resources", href: "/resources", body: "Template packs, external guides, and community links." },
];

export default function Home() {
  const basics = MODULES.slice(0, 5);

  return (
    <Container className="pb-10">
      {/* Hero */}
      <section className="grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
        <Reveal>
          <h1 className="text-[2.6rem] font-semibold leading-[1.08] sm:text-[3.4rem]">
            Learn Claude Code
            <br />
            <span className="text-fg-subtle">by doing, not reading.</span>
          </h1>
          <p className="mt-4 text-sm font-medium text-fg-faint">by Hasan Jahoush</p>
          <p className="mt-5 max-w-md text-lg text-fg-muted">
            12 interactive modules with terminal simulators, config builders, and
            quizzes. No setup required.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-[var(--shadow-md)] transition hover:bg-accent-hover"
            >
              Find Your Level
            </Link>
            <Link
              href="/learn/slash-commands"
              className="rounded-lg border border-border-strong bg-bg-subtle px-5 py-2.5 text-sm font-semibold text-fg-muted transition hover:border-accent/40 hover:text-fg"
            >
              Jump Right In
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <Terminal script={HERO_SCRIPT} ariaLabel="Claude Code auto-playing demo" />
        </Reveal>
      </section>

      {/* Feature row */}
      <section className="grid gap-8 border-t border-border py-12 sm:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 90}>
            <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-md bg-accent-soft text-accent-soft-fg">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-lg">{f.title}</h3>
            <p className="mt-2 text-sm text-fg-subtle">{f.body}</p>
          </Reveal>
        ))}
      </section>

      {/* Start with the basics */}
      <section className="border-t border-border py-14">
        <Reveal>
          <h2 className="text-2xl">Start with the basics</h2>
          <p className="mt-2 text-fg-subtle">
            12 modules from beginner to advanced. Most people begin here.
          </p>
        </Reveal>
        <div className="mt-8 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {basics.map((m, i) => (
            <Reveal key={m.slug} delay={i * 60}>
              <Link
                href={`/learn/${m.slug}`}
                className="group flex items-center gap-4 px-5 py-4 transition hover:bg-card-hover"
              >
                <span className="font-mono text-sm text-fg-faint">{m.index}</span>
                <span className="flex-1">
                  <span className="font-medium text-fg">{m.title}</span>
                  <span className="ml-2 text-sm text-fg-faint">{m.duration}</span>
                </span>
                <LevelBadge level={m.level} />
                <svg className="h-4 w-4 text-fg-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-6">
          <ArrowLink href="/learn">See all 12 modules</ArrowLink>
        </div>
      </section>

      {/* Explore */}
      <section className="border-t border-border py-14">
        <Reveal>
          <h2 className="text-2xl">Explore</h2>
          <p className="mt-2 text-fg-subtle">
            Tools to practice, reference, and deepen your understanding.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE.map((c, i) => (
            <Reveal key={c.href} delay={i * 70}>
              <Link
                href={c.href}
                className="group block h-full rounded-xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-lg)]"
              >
                <h3 className="flex items-center justify-between text-lg">
                  {c.title}
                  <svg className="h-4 w-4 text-fg-faint transition group-hover:translate-x-0.5 group-hover:text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17 17 7M7 7h10v10" />
                  </svg>
                </h3>
                <p className="mt-2 text-sm text-fg-subtle">{c.body}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </Container>
  );
}
