import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageHeader, LevelBadge, ArrowLink, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { MODULES, type Level } from "@/lib/site";

/* ---------------------------------------------------------------------------
   Quiz result pages for /quiz/result/beginner|intermediate|advanced
--------------------------------------------------------------------------- */

type Params = Promise<{ level: string }>;

export function generateStaticParams() {
  return [
    { level: "beginner" },
    { level: "intermediate" },
    { level: "advanced" },
  ];
}

export async function generateMetadata({ params }: { params: Params }) {
  const { level } = await params;
  const label = level.charAt(0).toUpperCase() + level.slice(1);
  return {
    title: `I scored ${label} on the Claude Code Assessment!`,
    description: `You scored at the ${label} level. Here's your personalized Claude Code learning path.`,
  };
}

/* ── Level-specific content ── */
const LEVEL_META: Record<
  Level,
  {
    emoji: string;
    headline: string;
    summary: string;
    encouragement: string;
    color: string;
    badgeCls: string;
    modules: string[]; // slugs to recommend
    scoreRange: string;
  }
> = {
  beginner: {
    emoji: "🌱",
    headline: "You're just getting started",
    summary:
      "Claude Code has a lot to offer — and starting from the beginning is the best way to build strong intuitions. The modules below will take you from installation to your first real project in about two hours.",
    encouragement:
      "Everyone starts here. The fundamentals you pick up now will make everything else click faster.",
    color: "text-beginner",
    badgeCls: "bg-beginner/10 border-beginner/30",
    modules: ["getting-started", "slash-commands", "memory", "project-setup", "commands"],
    scoreRange: "0 – 6",
  },
  intermediate: {
    emoji: "⚡",
    headline: "You know the basics — now level up",
    summary:
      "You've got Claude Code running and understand the core flow. The next step is customisation: skills let you build reusable commands, hooks automate quality gates, and MCP connects Claude to your whole stack.",
    encouragement:
      "Intermediate is where Claude Code starts feeling like a real superpower. The skills and hooks modules are game-changers.",
    color: "text-intermediate",
    badgeCls: "bg-intermediate/10 border-intermediate/30",
    modules: ["skills", "hooks", "mcp", "subagents"],
    scoreRange: "7 – 14",
  },
  advanced: {
    emoji: "🚀",
    headline: "You're operating at the frontier",
    summary:
      "You clearly know your way around Claude Code. Dive into the advanced content: headless/CI usage, plugin authoring, and production workflow orchestration at scale.",
    encouragement:
      "The advanced modules cover things most Claude Code users haven't touched. You're in the right place.",
    color: "text-advanced",
    badgeCls: "bg-advanced/10 border-advanced/30",
    modules: ["advanced-features", "workflows", "plugins"],
    scoreRange: "15 – 20",
  },
};

export default async function ResultPage({ params }: { params: Params }) {
  const { level } = await params;

  if (!["beginner", "intermediate", "advanced"].includes(level)) {
    notFound();
  }

  const meta = LEVEL_META[level as Level];
  const recommended = MODULES.filter((m) => meta.modules.includes(m.slug));

  return (
    <main id="main-content">
      <Container>
        <PageHeader
          eyebrow="Your result"
          title="Find Your Level"
          lede="Here's your personalized Claude Code learning path."
        />

        {/* Result hero card */}
        <Reveal className="mb-10">
          <div className={`rounded-2xl border p-8 ${meta.badgeCls}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-card text-4xl shadow-[var(--shadow-sm)]">
                {meta.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <span className={`text-2xl font-bold capitalize ${meta.color}`}>
                    {level}
                  </span>
                  <LevelBadge level={level as Level} />
                </div>
                <h2 className="text-xl font-semibold text-fg">
                  I scored <span className="capitalize">{level}</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{meta.summary}</p>
              </div>
            </div>

            {/* Score range note */}
            <div className="mt-5 rounded-lg border border-border bg-card/60 px-4 py-3">
              <p className="text-sm text-fg-muted">
                <span className="font-medium text-fg">Score range for this level: </span>
                <span className="font-mono text-accent">{meta.scoreRange}</span>
                {" "}points out of a maximum of 20.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Encouragement callout */}
        <Reveal delay={70} className="mb-10">
          <div className="rounded-xl border border-border-strong bg-bg-subtle px-5 py-4 text-sm text-fg-muted">
            <span className="mr-2 text-accent">✦</span>
            {meta.encouragement}
          </div>
        </Reveal>

        {/* Recommended modules */}
        <Reveal delay={140} className="mb-4">
          <h3 className="text-xl font-semibold text-fg">Recommended modules for you</h3>
          <p className="mt-1 text-sm text-fg-muted">
            Start with these — they&apos;re ordered to build on each other.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-6">
          {recommended.map((m, i) => (
            <Reveal key={m.slug} delay={210 + i * 70}>
              <Link
                href={`/learn/${m.slug}`}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-mono text-xs text-fg-subtle">
                    {String(m.index).padStart(2, "0")}
                  </span>
                  <LevelBadge level={m.level} />
                </div>
                <h4 className="mb-2 text-base font-semibold text-fg transition group-hover:text-accent">
                  {m.title}
                </h4>
                <p className="flex-1 text-sm leading-relaxed text-fg-muted">{m.summary}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="font-mono text-xs text-fg-subtle">{m.duration}</span>
                  <svg
                    className="h-4 w-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Retake / Browse all / Roadmap CTAs */}
        <Reveal delay={350} className="mb-20 flex flex-col items-start gap-4 sm:flex-row sm:items-center pt-4 border-t border-border">
          <ArrowLink href="/learn">Browse all modules</ArrowLink>
          <ArrowLink href="/roadmap">View Learning Roadmap</ArrowLink>
          <Link
            href="/quiz"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg-muted transition hover:border-border-strong hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            Retake the quiz
          </Link>
        </Reveal>
      </Container>
    </main>
  );
}
