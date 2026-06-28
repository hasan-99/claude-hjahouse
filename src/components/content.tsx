"use client";

import { useState, type ReactNode } from "react";

/* ---- Callout / note box ---- */
type CalloutTone = "note" | "tip" | "warn" | "info";
const calloutStyle: Record<CalloutTone, { ring: string; label: string; icon: ReactNode }> = {
  note: { ring: "border-border-strong bg-bg-subtle", label: "Note", icon: "✎" },
  tip: { ring: "border-beginner/40 bg-beginner/8", label: "Tip", icon: "✦" },
  warn: { ring: "border-advanced/40 bg-advanced/8", label: "Heads up", icon: "▲" },
  info: { ring: "border-accent/40 bg-accent-soft", label: "Good to know", icon: "ⓘ" },
};

export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: CalloutTone;
  title?: string;
  children: ReactNode;
}) {
  const s = calloutStyle[tone];
  return (
    <div className={`my-5 rounded-lg border px-4 py-3.5 text-sm ${s.ring}`}>
      <div className="mb-1 flex items-center gap-2 font-semibold text-fg">
        <span className="text-accent">{s.icon}</span>
        {title ?? s.label}
      </div>
      <div className="text-fg-muted [&_a]:text-accent [&_a]:underline">{children}</div>
    </div>
  );
}

/* ---- Keyboard key ---- */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-border-strong bg-bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
      {children}
    </kbd>
  );
}

/* ---- Interactive quiz ---- */
export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

export function Quiz({
  questions,
  title = "Quick check",
}: {
  questions: QuizQuestion[];
  title?: string;
}) {
  const [picked, setPicked] = useState<(number | null)[]>(
    questions.map(() => null)
  );

  const choose = (qi: number, oi: number) =>
    setPicked((p) => {
      if (p[qi] !== null) return p;
      const next = [...p];
      next[qi] = oi;
      return next;
    });

  const correctCount = picked.filter((p, i) => p === questions[i].answer).length;
  const answered = picked.filter((p) => p !== null).length;

  return (
    <div className="my-8 rounded-xl border border-border bg-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg">{title}</h3>
        {answered > 0 && (
          <span className="font-mono text-xs text-fg-subtle">
            {correctCount}/{questions.length} correct
          </span>
        )}
      </div>
      <div className="space-y-6">
        {questions.map((question, qi) => {
          const sel = picked[qi];
          return (
            <div key={qi}>
              <p className="mb-3 font-medium text-fg">
                {qi + 1}. {question.q}
              </p>
              <div className="grid gap-2">
                {question.options.map((opt, oi) => {
                  const isAnswer = oi === question.answer;
                  const isPicked = sel === oi;
                  let cls =
                    "border-border bg-bg-subtle text-fg-muted hover:border-accent/40";
                  if (sel !== null) {
                    if (isAnswer) cls = "border-beginner/60 bg-beginner/10 text-fg";
                    else if (isPicked) cls = "border-advanced/60 bg-advanced/10 text-fg";
                    else cls = "border-border bg-bg-subtle text-fg-faint";
                  }
                  return (
                    <button
                      key={oi}
                      disabled={sel !== null}
                      onClick={() => choose(qi, oi)}
                      className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition ${cls}`}
                    >
                      <span>{opt}</span>
                      {sel !== null && isAnswer && <span className="text-beginner">✓</span>}
                      {sel !== null && isPicked && !isAnswer && <span className="text-advanced">✕</span>}
                    </button>
                  );
                })}
              </div>
              {sel !== null && (
                <p className="mt-3 rounded-lg bg-bg-muted px-4 py-3 text-sm text-fg-muted animate-fade-in">
                  {question.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Prose wrapper for module bodies ---- */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose-body max-w-none text-[15px] text-fg-muted">{children}</div>;
}
