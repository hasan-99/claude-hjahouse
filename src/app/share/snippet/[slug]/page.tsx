import Link from "next/link";
import { Container, PageHeader, Card, ArrowLink, LevelBadge } from "@/components/ui";
import Reveal from "@/components/Reveal";
import CodeBlock from "@/components/CodeBlock";
import { Callout } from "@/components/content";
import { moduleBySlug, MODULES } from "@/lib/site";

/* ---------------------------------------------------------------------------
   Shared Snippet page — /share/snippet/[slug]
   slug format: "<module-slug>--<snippet-title-kebab>"
   e.g. hooks--post-edit-formatting-hook
--------------------------------------------------------------------------- */

/** Convert a kebab-case or double-dash slug segment to Title Case prose. */
function toTitle(raw: string): string {
  return raw
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Derive module slug and snippet title from the full URL slug. */
function parseSlug(slug: string): { moduleSlug: string; snippetTitle: string } {
  const sepIdx = slug.indexOf("--");
  if (sepIdx === -1) {
    return { moduleSlug: slug, snippetTitle: toTitle(slug) };
  }
  const moduleSlug = slug.slice(0, sepIdx);
  const snippetPart = slug.slice(sepIdx + 2);
  return { moduleSlug, snippetTitle: toTitle(snippetPart) };
}

/** Very small set of representative snippets keyed by full slug.
    Falls back to a generated placeholder for unknown slugs. */
interface SnippetData {
  lang: string;
  filename?: string;
  code: string;
  description: string;
  tone?: "default" | "terminal";
}

const KNOWN_SNIPPETS: Record<string, SnippetData> = {
  "hooks--post-edit-formatting-hook": {
    lang: "json",
    filename: "claude.json (hooks section)",
    tone: "default",
    description:
      "A PostToolUse hook that auto-formats files after Claude edits them. It matches the Edit and Write tools, then runs Prettier on the file path Claude just touched. The `2>/dev/null || true` tail ensures Claude never sees a formatting failure as a blocking error.",
    code: `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \\"$CLAUDE_TOOL_INPUT_FILE_PATH\\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}`,
  },
};

/** Fall-back snippet generator for any unknown slug. */
function fallbackSnippet(moduleSlug: string, snippetTitle: string): SnippetData {
  return {
    lang: "json",
    filename: `${moduleSlug}.json`,
    tone: "default",
    description: `A configuration snippet from the ${toTitle(moduleSlug)} module demonstrating ${snippetTitle.toLowerCase()}.`,
    code: `{
  "// snippet": "${snippetTitle}",
  "// module": "${moduleSlug}",
  "// See the full module for context": "/learn/${moduleSlug}"
}`,
  };
}

/* --------------- related snippets sidebar data ---------------------------- */
const RELATED: Record<string, { title: string; slug: string }[]> = {
  hooks: [
    { title: "Pre-tool validation hook", slug: "hooks--pre-tool-validation-hook" },
    { title: "Notification hook", slug: "hooks--notification-hook" },
    { title: "Stop hook example", slug: "hooks--stop-hook-example" },
  ],
  memory: [
    { title: "Project CLAUDE.md template", slug: "memory--project-claude-md-template" },
    { title: "Auto-compact settings", slug: "memory--auto-compact-settings" },
  ],
  mcp: [
    { title: "MCP server config", slug: "mcp--server-config" },
    { title: "MCP scope settings", slug: "mcp--scope-settings" },
  ],
};

/* =========================================================================
   Page component
   ========================================================================= */

export default async function SnippetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { moduleSlug, snippetTitle } = parseSlug(slug);

  const moduleMeta = moduleBySlug(moduleSlug);
  const snippet = KNOWN_SNIPPETS[slug] ?? fallbackSnippet(moduleSlug, snippetTitle);
  const related = RELATED[moduleSlug] ?? [];

  // Other modules for the "Explore more" row
  const otherModules = MODULES.filter((m) => m.slug !== moduleSlug).slice(0, 3);

  return (
    <main id="main-content" className="pb-24 pt-6">
      <Container>

        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <Reveal delay={0}>
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-fg-subtle">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span className="text-fg-faint">/</span>
            <Link href="/learn" className="hover:text-accent transition-colors">Learn</Link>
            <span className="text-fg-faint">/</span>
            <Link
              href={`/learn/${moduleSlug}`}
              className="hover:text-accent transition-colors capitalize"
            >
              {moduleMeta?.title ?? toTitle(moduleSlug)}
            </Link>
            <span className="text-fg-faint">/</span>
            <span className="text-fg-muted font-medium">{snippetTitle}</span>
          </nav>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">

          {/* ── Main content column ──────────────────────────────── */}
          <div className="min-w-0">

            {/* Header */}
            <Reveal delay={70}>
              <div className="mb-2 flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Shared Snippet
                </span>
                {moduleMeta && (
                  <LevelBadge level={moduleMeta.level} />
                )}
              </div>
              <h1 className="mb-3 text-3xl font-semibold sm:text-4xl">{snippetTitle}</h1>
              <p className="text-base text-fg-subtle leading-relaxed max-w-2xl">
                {snippet.description}
              </p>
            </Reveal>

            {/* Module origin badge */}
            {moduleMeta && (
              <Reveal delay={140}>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-fg-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  From the
                  <Link
                    href={`/learn/${moduleSlug}`}
                    className="font-semibold text-accent hover:underline"
                  >
                    {moduleMeta.title}
                  </Link>
                  module · {moduleMeta.duration} · {moduleMeta.level}
                </div>
              </Reveal>
            )}

            {/* ── Code block ───────────────────────────────────────── */}
            <Reveal delay={210}>
              <div className="mt-8">
                <div className="mb-3 flex items-center gap-2">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-fg-subtle">
                    Configuration
                  </h2>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <CodeBlock
                  code={snippet.code}
                  filename={snippet.filename}
                  lang={snippet.lang}
                  tone={snippet.tone ?? "default"}
                />
              </div>
            </Reveal>

            {/* ── How it works callout ──────────────────────────────── */}
            <Reveal delay={280}>
              <Callout tone="info" title="How this works">
                {moduleSlug === "hooks"
                  ? "Place this config in your project's claude.json or pass it via CLAUDE_HOOKS. The matcher field is a regex matched against the tool name — Edit|Write fires on both the Edit and Write tools. Claude injects the file path as $CLAUDE_TOOL_INPUT_FILE_PATH so your formatter always receives the right target."
                  : `This snippet is part of the ${moduleMeta?.title ?? toTitle(moduleSlug)} module. Refer to the full module for setup context, prerequisites, and related examples.`}
              </Callout>
            </Reveal>

            {/* ── Usage steps ──────────────────────────────────────── */}
            {moduleSlug === "hooks" && (
              <Reveal delay={350}>
                <div className="mt-8">
                  <h2 className="mb-4 text-lg font-semibold">How to use this snippet</h2>
                  <ol className="space-y-4">
                    {[
                      {
                        step: "1",
                        title: "Open your claude.json",
                        body: "This lives at the project root or in ~/.claude/claude.json for user-level hooks.",
                      },
                      {
                        step: "2",
                        title: "Add the hooks key",
                        body: 'Paste the PostToolUse block under the top-level "hooks" key. If the key already exists, merge the PostToolUse array.',
                      },
                      {
                        step: "3",
                        title: "Make sure Prettier is available",
                        body: "Run npm install --save-dev prettier in your project, or install it globally with npm i -g prettier.",
                      },
                      {
                        step: "4",
                        title: "Edit any file with Claude",
                        body: "After Claude writes or edits a file, Prettier will silently format it. Errors are swallowed so Claude never blocks.",
                      },
                    ].map((item, i) => (
                      <Reveal key={item.step} delay={i * 70}>
                        <Card className="flex gap-4 transition hover:-translate-y-0.5 hover:border-accent/40">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">
                            {item.step}
                          </div>
                          <div>
                            <div className="font-semibold text-fg">{item.title}</div>
                            <div className="mt-0.5 text-sm text-fg-muted">{item.body}</div>
                          </div>
                        </Card>
                      </Reveal>
                    ))}
                  </ol>
                </div>
              </Reveal>
            )}

            {/* ── Customization tips ───────────────────────────────── */}
            {moduleSlug === "hooks" && (
              <Reveal delay={420}>
                <div className="mt-8">
                  <h2 className="mb-4 text-lg font-semibold">Customise it</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        label: "Different formatter",
                        code: `"command": "npx eslint --fix \\"$CLAUDE_TOOL_INPUT_FILE_PATH\\" 2>/dev/null || true"`,
                        note: "Swap Prettier for ESLint --fix or any other formatter.",
                      },
                      {
                        label: "TypeScript only",
                        code: `"matcher": "Edit|Write",\n// Add a shell guard:\n"command": "case \\"$CLAUDE_TOOL_INPUT_FILE_PATH\\" in *.ts|*.tsx) npx prettier --write \\"$CLAUDE_TOOL_INPUT_FILE_PATH\\";; esac"`,
                        note: "Run formatter only on .ts / .tsx files.",
                      },
                    ].map((tip, i) => (
                      <Reveal key={tip.label} delay={i * 70}>
                        <Card className="transition hover:-translate-y-0.5 hover:border-accent/40">
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
                            {tip.label}
                          </div>
                          <code className="block whitespace-pre-wrap break-all rounded bg-bg-subtle px-2.5 py-2 font-mono text-[11px] text-fg-muted">
                            {tip.code}
                          </code>
                          <p className="mt-2 text-xs text-fg-subtle">{tip.note}</p>
                        </Card>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* ── Back to module CTA ───────────────────────────────── */}
            <Reveal delay={490}>
              <div className="mt-10 flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
                <div>
                  <div className="text-sm font-semibold text-fg">
                    {moduleMeta?.title ?? toTitle(moduleSlug)} module
                  </div>
                  <div className="mt-0.5 text-xs text-fg-subtle">
                    {moduleMeta?.summary ?? `See the full ${toTitle(moduleSlug)} guide for context.`}
                  </div>
                </div>
                <ArrowLink href={`/learn/${moduleSlug}`} className="shrink-0">
                  View Full Module
                </ArrowLink>
              </div>
            </Reveal>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <aside className="space-y-6">

            {/* Quick copy card */}
            <Reveal delay={140}>
              <Card>
                <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                  Quick copy
                </div>
                <p className="text-sm text-fg-muted">
                  Copy the snippet above into your project&apos;s{" "}
                  <code className="rounded bg-bg-subtle px-1.5 py-0.5 font-mono text-[11px]">
                    claude.json
                  </code>{" "}
                  hooks section. The copy button in the code block copies the raw JSON.
                </p>
                <div className="mt-4 border-t border-border pt-4">
                  <ArrowLink href={`/learn/${moduleSlug}`}>
                    Full {moduleMeta?.title ?? toTitle(moduleSlug)} guide
                  </ArrowLink>
                </div>
              </Card>
            </Reveal>

            {/* Related snippets */}
            {related.length > 0 && (
              <Reveal delay={210}>
                <Card>
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                    Related snippets
                  </div>
                  <ul className="space-y-2">
                    {related.map((r, i) => (
                      <li key={r.slug}>
                        <Link
                          href={`/share/snippet/${r.slug}`}
                          className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-fg-muted transition hover:bg-bg-subtle hover:text-fg"
                        >
                          <span className="text-fg-faint text-xs">{i + 1}.</span>
                          {r.title}
                          <svg
                            className="ml-auto h-3 w-3 shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 text-accent"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            )}

            {/* Module info card */}
            {moduleMeta && (
              <Reveal delay={280}>
                <Card>
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                    Module info
                  </div>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-fg-subtle">Level</dt>
                      <dd>
                        <LevelBadge level={moduleMeta.level} />
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-fg-subtle">Duration</dt>
                      <dd className="text-fg-muted">{moduleMeta.duration}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-fg-subtle">Module #</dt>
                      <dd className="text-fg-muted">{moduleMeta.index + 1} of {MODULES.length}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 border-t border-border pt-4">
                    <ArrowLink href={`/learn/${moduleSlug}`}>Open module</ArrowLink>
                  </div>
                </Card>
              </Reveal>
            )}
          </aside>
        </div>

        {/* ── Explore more modules ─────────────────────────────────── */}
        <Reveal delay={0}>
          <div className="mt-16 border-t border-border pt-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Explore more modules</h2>
              <ArrowLink href="/learn">All modules</ArrowLink>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherModules.map((m, i) => (
                <Reveal key={m.slug} delay={i * 70}>
                  <Link
                    href={`/learn/${m.slug}`}
                    className="group block rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-md)]"
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <LevelBadge level={m.level} />
                      <span className="font-mono text-[11px] text-fg-faint">{m.duration}</span>
                    </div>
                    <div className="font-semibold text-fg group-hover:text-accent transition-colors">
                      {m.title}
                    </div>
                    <p className="mt-1 text-xs text-fg-subtle line-clamp-2">{m.summary}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

      </Container>
    </main>
  );
}
