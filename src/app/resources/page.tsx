import Link from "next/link";
import { Container, PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { Callout } from "@/components/content";
import CodeBlock from "@/components/CodeBlock";

/* ─── data ─────────────────────────────────────────────────────────────── */

const templatePacks = [
  {
    id: "starter",
    badge: "Core",
    title: "Starter Template Pack",
    subtitle: "Core files for setting up Claude Code quickly in a new project.",
    size: "~1 KB",
    files: [
      { icon: "📄", name: "CLAUDE.md", desc: "Project rules and review expectations" },
      { icon: "🔧", name: "settings.json", desc: "Baseline permission & model config" },
      { icon: "⚓", name: "pre-commit hook", desc: "Hook config for pre-commit validation" },
      { icon: "⚡", name: "skill-starter.md", desc: "Skill definition for repeatable workflows" },
    ],
    href: "https://claude.hjahouse.me/downloads/claude-code-starter-templates.zip",
    accent: "bg-accent-soft",
  },
  {
    id: "advanced",
    badge: "Advanced",
    title: "Advanced Template Pack",
    subtitle:
      "Expanded templates for multi-tool workflows, MCP integrations, and team conventions.",
    size: "~1.1 KB",
    files: [
      { icon: "🔌", name: "mcp-config.json", desc: "MCP server configuration example" },
      { icon: "📦", name: "plugin/index.ts", desc: "Plugin skeleton with TypeScript entrypoint" },
      { icon: "🤖", name: "agent.md", desc: "Agent config for specialized automation" },
      { icon: "🔗", name: "multi-hook.json", desc: "Multi-hook pipeline example" },
    ],
    href: "https://claude.hjahouse.me/downloads/claude-code-advanced-templates.zip",
    accent: "bg-bg-subtle",
  },
];

const officialLinks = [
  {
    href: "https://docs.anthropic.com/en/docs/claude-code",
    title: "Claude Code Documentation",
    desc: "Official Anthropic docs for installation, workflows, and tool usage.",
    tag: "docs.anthropic.com",
  },
  {
    href: "https://docs.anthropic.com/",
    title: "Anthropic API Documentation",
    desc: "Reference material for building Claude-powered tools and integrations.",
    tag: "docs.anthropic.com",
  },
  {
    href: "https://github.com/anthropics/claude-code",
    title: "Claude Code GitHub Repository",
    desc: "Track issues, releases, and implementation details in the public repository.",
    tag: "github.com",
  },
];

const toolLinks = [
  {
    href: "https://modelcontextprotocol.io/",
    title: "Model Context Protocol",
    desc: "Protocol docs and examples for connecting Claude to external tools and data.",
    tag: "modelcontextprotocol.io",
  },
];

const communityLinks = [
  {
    href: "https://discord.gg/anthropic",
    title: "Anthropic Discord",
    desc: "Community discussions, support, and examples from other Claude builders.",
    tag: "discord.gg",
  },
  {
    href: "https://github.com/hesreallyhim/awesome-claude-code",
    title: "Awesome Claude Code",
    desc: "A curated list of community resources, prompts, and integrations.",
    tag: "github.com",
  },
];

const claudeMdSample = `# Project Rules

## Review expectations
- Always read the file before editing
- Prefer surgical edits over full rewrites
- Explain reasoning for non-obvious choices

## Permissions
- Bash: git, npm, tsc, eslint
- Read: **/*
- Write: src/**

## Project context
Stack: Next.js App Router, TypeScript, Tailwind
Database: Supabase (RLS on every table)
`.trim();

/* ─── sub-components ──────────────────────────────────────────────────── */

function ExternalLink({
  href,
  title,
  desc,
  tag,
}: {
  href: string;
  title: string;
  desc: string;
  tag: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-md)]"
    >
      {/* arrow icon */}
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-subtle text-fg-subtle transition group-hover:border-accent/40 group-hover:text-accent">
        <svg
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-medium text-fg transition group-hover:text-accent">
            {title}
          </span>
          <span className="font-mono text-[11px] text-fg-faint">{tag}</span>
        </div>
        <p className="mt-1 text-sm text-fg-subtle">{desc}</p>
      </div>
    </Link>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-2xl font-semibold text-fg sm:text-3xl">{children}</h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-base font-semibold uppercase tracking-wider text-fg-muted">
      {children}
    </h3>
  );
}

/* ─── page ────────────────────────────────────────────────────────────── */

export default function ResourcesPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          title="Resources"
          lede="Download ready-to-use starter files, then keep exploring with the best official and community references for Claude Code."
        />

        {/* ── Template Packs ───────────────────────────────────────────── */}
        <section className="mb-20">
          <Reveal>
            <SectionHeading>Template Packs</SectionHeading>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {templatePacks.map((pack, i) => (
              <Reveal key={pack.id} delay={i * 70}>
                <Card className="flex h-full flex-col transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-md)]">
                  {/* card header */}
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <span
                        className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent ${pack.accent}`}
                      >
                        {pack.badge}
                      </span>
                      <h3 className="text-lg font-semibold text-fg">{pack.title}</h3>
                      <p className="mt-1 text-sm text-fg-subtle">{pack.subtitle}</p>
                    </div>
                    <span className="shrink-0 rounded border border-border px-2 py-0.5 font-mono text-xs text-fg-faint">
                      {pack.size}
                    </span>
                  </div>

                  {/* file list */}
                  <ul className="mb-6 space-y-2.5">
                    {pack.files.map((f) => (
                      <li key={f.name} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 text-base leading-none">{f.icon}</span>
                        <div>
                          <span className="font-mono text-[13px] font-medium text-fg">
                            {f.name}
                          </span>
                          <span className="ml-2 text-fg-subtle">{f.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* download CTA */}
                  <div className="mt-auto">
                    <Link
                      href={pack.href}
                      className="group inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:bg-accent-hover"
                    >
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download pack
                    </Link>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* sample CLAUDE.md preview */}
          <Reveal delay={140}>
            <div className="mt-8">
              <Callout tone="tip" title="What's inside CLAUDE.md?">
                Every pack includes a ready-to-edit{" "}
                <code className="rounded bg-bg-muted px-1 font-mono text-xs text-fg">
                  CLAUDE.md
                </code>{" "}
                that Claude reads at session start. Customise the rules block for your team
                before committing.
              </Callout>
              <CodeBlock
                code={claudeMdSample}
                filename="CLAUDE.md"
                lang="markdown"
                className="mt-4"
              />
            </div>
          </Reveal>
        </section>

        {/* ── External Resources ───────────────────────────────────────── */}
        <section className="mb-20">
          <Reveal>
            <SectionHeading>External Resources</SectionHeading>
          </Reveal>

          {/* Official Documentation */}
          <Reveal delay={0}>
            <SubHeading>Official Documentation</SubHeading>
          </Reveal>
          <div className="mb-10 grid gap-4 sm:grid-cols-1 md:grid-cols-1">
            {officialLinks.map((link, i) => (
              <Reveal key={link.href} delay={i * 70}>
                <ExternalLink {...link} />
              </Reveal>
            ))}
          </div>

          {/* Tools */}
          <Reveal delay={0}>
            <SubHeading>Tools</SubHeading>
          </Reveal>
          <div className="mb-10 grid gap-4">
            {toolLinks.map((link, i) => (
              <Reveal key={link.href} delay={i * 70}>
                <ExternalLink {...link} />
              </Reveal>
            ))}
          </div>

          {/* Community */}
          <Reveal delay={0}>
            <SubHeading>Community</SubHeading>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {communityLinks.map((link, i) => (
              <Reveal key={link.href} delay={i * 70}>
                <ExternalLink {...link} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── bottom CTA strip ─────────────────────────────────────────── */}
        <Reveal>
          <div className="mb-16 flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-fg">Ready to start building?</p>
              <p className="mt-0.5 text-sm text-fg-subtle">
                Download a starter pack, drop it in your repo, and run{" "}
                <code className="rounded bg-bg-muted px-1 font-mono text-[12px] text-fg">
                  claude
                </code>{" "}
                to begin.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/learn"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg transition hover:border-accent/40 hover:text-accent"
              >
                Browse modules
              </Link>
              <Link
                href="/playground"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:bg-accent-hover"
              >
                Open playground
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
