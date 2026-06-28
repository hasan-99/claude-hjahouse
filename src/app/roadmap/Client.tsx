"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { LevelBadge } from "@/components/ui";
import { MODULES, MODULE_SUMMARY_AR, type Level, type Locale, localize } from "@/lib/site";

const STORAGE_KEY = "claude-roadmap-completed";

interface LevelGroupDef {
  level: Level;
  label: { en: string; ar: string };
  desc: { en: string; ar: string };
}

const levelGroupDefs: LevelGroupDef[] = [
  {
    level: "beginner",
    label: { en: "Beginner", ar: "مبتدئ" },
    desc: {
      en: "Foundation concepts — install, configure, and work with Claude Code daily.",
      ar: "المفاهيم الأساسية — التثبيت والإعداد والعمل مع Claude Code يوميًا.",
    },
  },
  {
    level: "intermediate",
    label: { en: "Intermediate", ar: "متوسط" },
    desc: {
      en: "Expand your toolkit with skills, hooks, MCP servers, and multi-agent patterns.",
      ar: "وسّع أدواتك بالمهارات والـ hooks وخوادم MCP وأنماط الوكلاء المتعددين.",
    },
  },
  {
    level: "advanced",
    label: { en: "Advanced", ar: "متقدم" },
    desc: {
      en: "Production-grade automation, programmatic usage, workflows, and plugins.",
      ar: "أتمتة احترافية، استخدام برمجي، سير عمل، وإضافات.",
    },
  },
];

const levelDot: Record<Level, string> = {
  beginner: "bg-beginner",
  intermediate: "bg-intermediate",
  advanced: "bg-advanced",
};

const levelRing: Record<Level, string> = {
  beginner: "border-beginner/30",
  intermediate: "border-intermediate/30",
  advanced: "border-advanced/30",
};

const levelBg: Record<Level, string> = {
  beginner: "bg-beginner/8",
  intermediate: "bg-intermediate/8",
  advanced: "bg-advanced/8",
};

interface RoadmapClientProps {
  locale?: Locale;
}

export default function RoadmapClient({ locale = "en" }: RoadmapClientProps) {
  const isAr = locale === "ar";
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Load from localStorage once mounted
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch {}
    setMounted(true);
  }, []);

  const toggleModule = (slug: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const total = MODULES.length;
  const done = mounted ? completed.size : 0;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const motivation = isAr
    ? done === 0
      ? "ابدأ رحلتك مع الوحدة الأولى — كل خبير كان في البداية مبتدئًا."
      : done === total
      ? "أكملت جميع الوحدات. أنت الآن خبير في Claude Code!"
      : `${total - done} ${total - done === 1 ? "وحدة متبقية" : "وحدات متبقية"}. واصل!`
    : done === 0
    ? "Start your journey with Module 1 — every expert was once a beginner."
    : done === total
    ? "You've completed all modules. You're a Claude Code expert!"
    : `${total - done} module${total - done === 1 ? "" : "s"} remaining. Keep going!`;

  return (
    <>
      {/* Progress banner */}
      <Reveal className="mb-10">
        <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-fg">
                {mounted ? (
                  <>
                    {isAr ? (
                      <>
                        {done} من {total} وحدات مكتملة —{" "}
                        <span className="text-accent">{pct}%</span>
                      </>
                    ) : (
                      <>
                        {done} of {total} modules complete —{" "}
                        <span className="text-accent">{pct}%</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {isAr
                      ? `${total} وحدة · جارٍ تحميل التقدم…`
                      : `${total} modules · loading progress…`}
                  </>
                )}
              </p>
              <p className="mt-1 text-sm text-fg-muted">{motivation}</p>
            </div>
            {done > 0 && mounted && (
              <button
                onClick={() => {
                  setCompleted(new Set());
                  try {
                    localStorage.removeItem(STORAGE_KEY);
                  } catch {}
                }}
                className="shrink-0 rounded-lg border border-border px-4 py-2 text-xs text-fg-subtle transition hover:border-border-strong hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {isAr ? "إعادة ضبط التقدم" : "Reset progress"}
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-bg-muted">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Mini module indicators */}
          <div className="mt-3 flex gap-1">
            {MODULES.map((m) => (
              <div
                key={m.slug}
                title={isAr ? m.titleAr : m.title}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  mounted && completed.has(m.slug)
                    ? "bg-accent"
                    : "bg-bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </Reveal>

      {/* Module groups */}
      <div className="space-y-12 pb-20">
        {levelGroupDefs.map((group, gi) => {
          const modules = MODULES.filter((m) => m.level === group.level);
          const groupDone = mounted
            ? modules.filter((m) => completed.has(m.slug)).length
            : 0;

          return (
            <Reveal key={group.level} delay={gi * 80}>
              {/* Section header */}
              <div className="mb-5 flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${levelDot[group.level]}`}
                />
                <h2 className="text-xl font-semibold text-fg">
                  {group.label[locale]}
                </h2>
                {mounted && (
                  <span className="ml-auto font-mono text-xs text-fg-subtle">
                    {groupDone}/{modules.length}
                  </span>
                )}
              </div>
              <p className="mb-5 text-sm text-fg-muted">{group.desc[locale]}</p>

              {/* Module cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((m, i) => {
                  const isDone = mounted && completed.has(m.slug);
                  const moduleTitle = isAr ? m.titleAr : m.title;
                  const moduleDuration = isAr ? m.durationAr : m.duration;
                  const moduleHref = localize(`/learn/${m.slug}`, locale);
                  return (
                    <Reveal key={m.slug} delay={gi * 80 + i * 70}>
                      <div
                        className={`group relative flex flex-col rounded-xl border bg-card p-6 shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] ${
                          isDone
                            ? `${levelBg[group.level]} ${levelRing[group.level]} border-opacity-60`
                            : "border-border hover:border-accent/40"
                        }`}
                      >
                        {/* Large faint index */}
                        <span
                          aria-hidden="true"
                          className="absolute right-5 top-4 select-none font-serif text-5xl font-bold leading-none text-fg-faint"
                        >
                          {m.index}
                        </span>

                        {/* Completion toggle */}
                        <button
                          onClick={() => toggleModule(m.slug)}
                          aria-label={
                            isDone
                              ? isAr
                                ? `تحديد ${moduleTitle} كغير مكتملة`
                                : `Mark ${m.title} as incomplete`
                              : isAr
                              ? `تحديد ${moduleTitle} كمكتملة`
                              : `Mark ${m.title} as complete`
                          }
                          className={`absolute right-4 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border text-[11px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                            isDone
                              ? "border-accent bg-accent text-accent-fg"
                              : "border-border bg-bg-subtle text-transparent hover:border-accent/60 hover:text-fg-subtle"
                          }`}
                        >
                          ✓
                        </button>

                        {/* Content */}
                        <div className="pr-8">
                          <LevelBadge level={m.level} locale={locale} />
                          <h3 className="mt-2 text-lg font-semibold leading-snug text-fg transition group-hover:text-accent">
                            {moduleTitle}
                          </h3>
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
                            {isAr ? MODULE_SUMMARY_AR[m.slug] : m.summary}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                          <span className="font-mono text-xs text-fg-subtle">
                            {moduleDuration}
                          </span>
                          <Link
                            href={moduleHref}
                            className="text-xs font-medium text-accent transition hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {isDone
                              ? isAr
                                ? "مراجعة ←"
                                : "Review →"
                              : isAr
                              ? "ابدأ ←"
                              : "Start →"}
                          </Link>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Tips callout */}
      <Reveal delay={300}>
        <div className="mb-20 rounded-xl border border-accent/20 bg-accent-soft p-6">
          <p className="text-sm font-semibold text-fg">
            {isAr ? "✦ كيف تستخدم خارطة التعلّم" : "✦ How to use this roadmap"}
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-fg-muted">
            {isAr ? (
              <>
                <li>
                  انقر على الدائرة في أي بطاقة لتحديدها كمكتملة — يُحفظ التقدم محليًا في متصفحك.
                </li>
                <li>
                  كل وحدة تبني على السابقة، لكن يمكنك الانتقال لأي موضوع يثير اهتمامك.
                </li>
                <li>
                  الوحدات مجمّعة حسب الصعوبة: مبتدئ → متوسط → متقدم.
                </li>
              </>
            ) : (
              <>
                <li>
                  Click the circle on any card to mark it complete — progress is
                  saved locally in your browser.
                </li>
                <li>
                  Each module builds on the previous, but feel free to jump to any
                  topic that interests you.
                </li>
                <li>
                  Modules are grouped by difficulty: beginner → intermediate →
                  advanced.
                </li>
              </>
            )}
          </ul>
        </div>
      </Reveal>
    </>
  );
}
