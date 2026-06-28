import Link from "next/link";
import { Container, PageHeader, LevelBadge } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { MODULES } from "@/lib/site";

export const metadata = {
  title: "Learn Claude Code",
  description:
    "12 interactive modules from beginner to advanced. Start your Claude Code learning journey.",
};

export default function LearnPage() {
  return (
    <main id="main-content">
      <Container>
        {/* Navigate intro line — mirrors original */}
        <Reveal className="pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-subtle">
            Navigate
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            Jump to learning, practice, or reference tools.
          </p>
        </Reveal>

        <PageHeader
          title="Learning Modules"
          lede="12 modules take you from your first slash command to building production plugins. Each module includes interactive terminals, config builders, and quizzes."
        />

        {/* Module grid */}
        <div className="pb-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, i) => (
            <Reveal key={m.slug} delay={i * 60}>
              <Link
                href={`/learn/${m.slug}`}
                className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-md)]"
              >
                {/* Big faint index number */}
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-4 font-serif text-6xl font-bold leading-none text-fg-faint select-none"
                >
                  {m.index}
                </span>

                {/* Title */}
                <h2 className="mt-2 pr-10 text-xl font-semibold leading-snug text-fg transition group-hover:text-accent">
                  {m.title}
                </h2>

                {/* Summary */}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
                  {m.summary}
                </p>

                {/* Footer row */}
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <LevelBadge level={m.level} />
                  <span className="font-mono text-xs text-fg-subtle">
                    {m.duration}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </main>
  );
}
