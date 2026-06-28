import Link from "next/link";
import type { ReactNode } from "react";
import { MODULES, moduleBySlug, localize, type Locale } from "@/lib/site";
import { Container, LevelBadge } from "./ui";
import Reveal from "./Reveal";

export default function ModuleScaffold({
  slug,
  locale = "en",
  children,
}: {
  slug: string;
  locale?: Locale;
  children: ReactNode;
}) {
  const meta = moduleBySlug(slug);
  if (!meta) return null;
  const ar = locale === "ar";
  const prev = MODULES[meta.index - 1];
  const next = MODULES[meta.index + 1];
  const title = (m: typeof meta) => (ar ? m.titleAr : m.title);

  return (
    <Container className="py-10">
      <div className="grid gap-10 lg:grid-cols-[240px_1fr]" dir={ar ? "rtl" : "ltr"}>
        {/* sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-faint">
              {ar ? "الوحدات" : "Modules"}
            </div>
            <nav className="space-y-0.5">
              {MODULES.map((m) => {
                const active = m.slug === slug;
                return (
                  <Link
                    key={m.slug}
                    href={localize(`/learn/${m.slug}`, locale)}
                    className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition ${
                      active
                        ? "bg-accent-soft font-medium text-accent-soft-fg"
                        : "text-fg-muted hover:bg-bg-muted hover:text-fg"
                    }`}
                  >
                    <span className="w-4 font-mono text-xs text-fg-faint">{m.index}</span>
                    <span className="truncate">{title(m)}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* main */}
        <article className="min-w-0">
          <Reveal>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-mono text-fg-faint">
                {ar ? `الوحدة ${meta.index}` : `Module ${meta.index}`}
              </span>
              <span className="text-border-strong">·</span>
              <LevelBadge level={meta.level} locale={locale} />
              <span className="text-border-strong">·</span>
              <span className="text-fg-subtle">{ar ? meta.durationAr : meta.duration}</span>
            </div>
            <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{title(meta)}</h1>
          </Reveal>

          <div className="mt-10">{children}</div>

          {/* report link */}
          <div className="mt-16 flex justify-center">
            <Link
              href={localize(`/feedback?module=${encodeURIComponent(ar ? meta.titleAr : meta.title)}`, locale)}
              className="text-sm text-fg-subtle transition hover:text-accent"
            >
              {ar ? "الإبلاغ عن مشكلة في هذه الوحدة" : "Report an issue with this module"}
            </Link>
          </div>

          {/* prev / next */}
          <nav className="mt-6 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {prev ? (
              <Link href={localize(`/learn/${prev.slug}`, locale)} className="group rounded-xl border border-border bg-card p-4 transition hover:border-accent/40">
                <span className="text-xs text-fg-faint">{ar ? "→ السابق" : "← Previous"}</span>
                <div className="mt-1 font-medium text-fg group-hover:text-accent">{title(prev)}</div>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={localize(`/learn/${next.slug}`, locale)} className="group rounded-xl border border-border bg-card p-4 text-right transition hover:border-accent/40">
                <span className="text-xs text-fg-faint">{ar ? "التالي ←" : "Next →"}</span>
                <div className="mt-1 font-medium text-fg group-hover:text-accent">{title(next)}</div>
              </Link>
            ) : (
              <Link href={localize("/quiz", locale)} className="group rounded-xl border border-border bg-card p-4 text-right transition hover:border-accent/40">
                <span className="text-xs text-fg-faint">{ar ? "التالي ←" : "Next →"}</span>
                <div className="mt-1 font-medium text-fg group-hover:text-accent">{ar ? "اعرف مستواك" : "Find Your Level"}</div>
              </Link>
            )}
          </nav>
        </article>
      </div>
    </Container>
  );
}
