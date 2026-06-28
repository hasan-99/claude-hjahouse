"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ---------------------------------------------------------------------------
   نسخة عربية من اختبار التقييم الذاتي — تُوجَّه إلى /ar/quiz/result/[level]
   نفس منطق التسجيل الأصلي:
     0–6  → مبتدئ  (beginner)
     7–14 → متوسط  (intermediate)
     15–20 → متقدم (advanced)
--------------------------------------------------------------------------- */

interface Option {
  id: string;
  text: string;
  score: number;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: "sa1",
    text: "هل سبق لك استخدام Claude Code؟",
    options: [
      { id: "a", text: "ما سمعت بيه قبل كده", score: 0 },
      { id: "b", text: "شفت عروض عنه بس ما استخدمتوش", score: 0 },
      { id: "c", text: "استخدمته مرات قليلة", score: 1 },
      { id: "d", text: "بستخدمه كل يوم", score: 2 },
    ],
  },
  {
    id: "sa2",
    text: "إيه اللي بيعمله الأمر /compact؟",
    options: [
      { id: "a", text: "مش عارف", score: 0 },
      { id: "b", text: "حاجة تتعلق بالملفات؟", score: 0 },
      { id: "c", text: "بيصغّر حجم المحادثة في الـ context", score: 1 },
      { id: "d", text: "بيضغط الـ context مع إمكانية تحديد focus instructions", score: 2 },
    ],
  },
  {
    id: "sa3",
    text: "إيه هو ملف CLAUDE.md؟",
    options: [
      { id: "a", text: "ملف توثيق لـ Claude", score: 0 },
      { id: "b", text: "ملف فيه تعليمات بيتبعها Claude", score: 1 },
      { id: "c", text: "ملف ذاكرة بنطاقات مستخدم/مشروع/عام بيستمر بين الجلسات", score: 2 },
      { id: "d", text: "عملت ملفات CLAUDE.md مخصصة بأعراف مشاريع محددة", score: 2 },
    ],
  },
  {
    id: "sa4",
    text: "كيف مستواك في نظام الأذونات في Claude Code؟",
    options: [
      { id: "a", text: "إيه نظام الأذونات ده؟", score: 0 },
      { id: "b", text: "عارف إنه بيسأل قبل ما يشغّل أوامر", score: 0 },
      { id: "c", text: "ضبطت allowedTools في settings.json", score: 1 },
      { id: "d", text: "بستخدم profiles مختلفة وفاهم أنماط زي Bash(git *)", score: 2 },
    ],
  },
  {
    id: "sa5",
    text: "إيه هي المهارات (skills) في Claude Code؟",
    options: [
      { id: "a", text: "مش عارف", score: 0 },
      { id: "b", text: "نوع من الـ plugins؟", score: 0 },
      { id: "c", text: "أوامر سلاش مخصصة بصيغة Markdown في .claude/skills/", score: 1 },
      { id: "d", text: "كتبت مهارات متعددة الخطوات مع كشف تدريجي للتعقيد", score: 2 },
    ],
  },
  {
    id: "sa6",
    text: "هل استخدمت الـ Hooks في Claude Code؟",
    options: [
      { id: "a", text: "إيه الـ Hooks دي؟", score: 0 },
      { id: "b", text: "عارف إنها موجودة بس ما استخدمتهاش", score: 0 },
      { id: "c", text: "ضبطت hooks أساسية زي الـ linting عند حفظ الملفات", score: 1 },
      { id: "d", text: "بستخدم PreToolUse/PostToolUse hooks مع scripts مخصصة", score: 2 },
    ],
  },
  {
    id: "sa7",
    text: "إيه هو MCP في سياق Claude Code؟",
    options: [
      { id: "a", text: "مش عارف خالص", score: 0 },
      { id: "b", text: "حاجة لربط أدوات خارجية؟", score: 0 },
      { id: "c", text: "Model Context Protocol — يربط Claude بمصادر بيانات وأدوات خارجية", score: 1 },
      { id: "d", text: "ضبطت MCP servers وعارف الفرق بين stdio و HTTP transport", score: 2 },
    ],
  },
  {
    id: "sa8",
    text: "إزاي بتشغّل Claude Code عادةً؟",
    options: [
      { id: "a", text: "ما شغّلتوش لسه", score: 0 },
      { id: "b", text: "في الـ terminal بـ prompts بسيطة", score: 0 },
      { id: "c", text: "الوضع التفاعلي مع أوامر السلاش وإعدادات مخصصة", score: 1 },
      { id: "d", text: "التفاعلي والـ headless/CI مع الأتمتة", score: 2 },
    ],
  },
  {
    id: "sa9",
    text: "إيه هي الوكلاء الفرعيون (subagents)؟",
    options: [
      { id: "a", text: "ما سمعت عنهم", score: 0 },
      { id: "b", text: "نوع من العمليات في الخلفية؟", score: 0 },
      { id: "c", text: "وكلاء مخصصين في .claude/agents/ بيفوّضلهم Claude مهام", score: 1 },
      { id: "d", text: "عملت subagents بأدوات مخصصة وـ model overrides", score: 2 },
    ],
  },
  {
    id: "sa10",
    text: "هل بنيت plugin لـ Claude Code من قبل؟",
    options: [
      { id: "a", text: "ما كنتش عارف إن ده ممكن", score: 0 },
      { id: "b", text: "عارف إن الـ plugins موجودة بس ما بنيتش واحد", score: 0 },
      { id: "c", text: "فاهم هيكل الـ plugin بس ما شحنتش واحد", score: 1 },
      { id: "d", text: "بنيت ونشرت plugin", score: 2 },
    ],
  },
];

function scoreToLevel(score: number): "beginner" | "intermediate" | "advanced" {
  if (score <= 6) return "beginner";
  if (score <= 14) return "intermediate";
  return "advanced";
}

type Phase = "intro" | "quiz" | "done";

export default function ArQuizClient() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const total = QUESTIONS.length;
  const question = QUESTIONS[current];
  const progress = phase === "intro" ? 0 : ((current + (selected ? 1 : 0)) / total) * 100;

  function handleStart() {
    setPhase("quiz");
    setCurrent(0);
    setAnswers({});
    setSelected(null);
  }

  function handleSelect(optId: string) {
    if (selected !== null) return;
    setSelected(optId);
  }

  function handleNext() {
    if (!selected) return;
    const opt = question.options.find((o) => o.id === selected)!;
    const newAnswers = { ...answers, [question.id]: opt.score };
    setAnswers(newAnswers);

    if (current < total - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      const totalScore = Object.values(newAnswers).reduce((a, b) => a + b, 0);
      const level = scoreToLevel(totalScore);
      setPhase("done");
      router.push(`/ar/quiz/result/${level}`);
    }
  }

  function handleBack() {
    if (current === 0) {
      setPhase("intro");
      setSelected(null);
      return;
    }
    const prevQ = QUESTIONS[current - 1];
    const newAnswers = { ...answers };
    delete newAnswers[prevQ.id];
    setAnswers(newAnswers);
    setCurrent((c) => c - 1);
    setSelected(null);
  }

  /* ── مرحلة المقدمة ── */
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-lg text-center animate-fade-up">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-3xl">
          🎯
        </div>
        <h2 className="text-2xl font-semibold text-fg">اكتشف نقطة البداية</h2>
        <p className="mt-3 text-base leading-relaxed text-fg-muted">
          جاوب على ١٠ أسئلة سريعة عن تجربتك مع Claude Code. مفيش إجابات غلط — ده بس عشان نقترح
          عليك تبدأ منين.
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-accent px-8 py-3 text-base font-semibold text-accent-fg shadow-[var(--shadow-sm)] transition hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ابدأ الاختبار
          <svg
            className="h-4 w-4 rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    );
  }

  /* ── مرحلة الانتهاء ── */
  if (phase === "done") {
    return (
      <div className="mx-auto max-w-lg text-center animate-fade-up">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-3xl">
          ✓
        </div>
        <p className="text-lg font-medium text-fg">جارٍ حساب مستواك…</p>
      </div>
    );
  }

  /* ── مرحلة الاختبار ── */
  const isAnswered = selected !== null;

  return (
    <div className="mx-auto max-w-lg animate-fade-up">
      {/* شريط التقدم */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-fg-subtle">
          <span>سؤال {current + 1} من {total}</span>
          <span>{Math.round(progress)}% مكتمل</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* بطاقة السؤال */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <p className="mb-5 text-lg font-semibold leading-snug text-fg">
          {question.text}
        </p>

        <div className="space-y-2.5">
          {question.options.map((opt) => {
            const isSelected = selected === opt.id;
            let cls =
              "flex min-h-[44px] w-full items-center rounded-lg border px-4 py-3 text-right text-sm transition";

            if (!isAnswered) {
              cls += isSelected
                ? " border-accent/60 bg-accent-soft text-fg font-medium"
                : " border-border bg-bg-subtle text-fg-muted hover:border-accent/40 hover:bg-bg-muted cursor-pointer";
            } else {
              if (isSelected) {
                cls += " border-accent/60 bg-accent-soft text-fg font-medium";
              } else {
                cls += " border-border bg-bg-subtle text-fg-faint cursor-default";
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={isAnswered && !isSelected}
                onClick={() => handleSelect(opt.id)}
                className={cls}
              >
                <span className="ms-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-border bg-bg text-xs font-mono text-fg-subtle">
                  {opt.id.toUpperCase()}
                </span>
                <span className="flex-1">{opt.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* أزرار التنقل */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg-muted transition hover:border-border-strong hover:text-fg"
        >
          <svg
            className="h-4 w-4 rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
          {current === 0 ? "العودة للمقدمة" : "السابق"}
        </button>

        <button
          type="button"
          disabled={!isAnswered}
          onClick={handleNext}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-fg shadow-[var(--shadow-sm)] transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {current === total - 1 ? "شوف نتيجتي" : "التالي"}
          <svg
            className="h-4 w-4 rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
