"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ---------------------------------------------------------------------------
   Full self-assessment quiz — mirrors claude.hjahouse.me/quiz
   Score thresholds match the original:
     0–6  → beginner
     7–14 → intermediate
     15–20 → advanced
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
    text: "Have you used Claude Code before?",
    options: [
      { id: "a", text: "Never heard of it until now", score: 0 },
      { id: "b", text: "I've seen demos but haven't used it", score: 0 },
      { id: "c", text: "I've used it a few times", score: 1 },
      { id: "d", text: "I use it daily", score: 2 },
    ],
  },
  {
    id: "sa2",
    text: "What does the /compact command do?",
    options: [
      { id: "a", text: "No idea", score: 0 },
      { id: "b", text: "Something with files?", score: 0 },
      { id: "c", text: "Reduces the conversation context size", score: 1 },
      { id: "d", text: "Compresses context with optional focus instructions", score: 2 },
    ],
  },
  {
    id: "sa3",
    text: "What is CLAUDE.md?",
    options: [
      { id: "a", text: "A documentation file for Claude", score: 0 },
      { id: "b", text: "A file that stores instructions Claude follows", score: 1 },
      { id: "c", text: "A memory file with user/project/global scopes that persists across sessions", score: 2 },
      { id: "d", text: "I've created custom CLAUDE.md files with specific project conventions", score: 2 },
    ],
  },
  {
    id: "sa4",
    text: "How comfortable are you with Claude Code's permission system?",
    options: [
      { id: "a", text: "What permission system?", score: 0 },
      { id: "b", text: "I know it asks before running commands", score: 0 },
      { id: "c", text: "I've configured allowedTools in settings.json", score: 1 },
      { id: "d", text: "I use different permission profiles and understand Bash(git *) patterns", score: 2 },
    ],
  },
  {
    id: "sa5",
    text: "What are Claude Code skills?",
    options: [
      { id: "a", text: "No idea", score: 0 },
      { id: "b", text: "Some kind of plugin?", score: 0 },
      { id: "c", text: "Markdown-based custom slash commands in .claude/skills/", score: 1 },
      { id: "d", text: "I've written multi-step skills with progressive disclosure", score: 2 },
    ],
  },
  {
    id: "sa6",
    text: "Have you used hooks in Claude Code?",
    options: [
      { id: "a", text: "What are hooks?", score: 0 },
      { id: "b", text: "I know they exist but haven't used them", score: 0 },
      { id: "c", text: "I've set up basic hooks like linting on file save", score: 1 },
      { id: "d", text: "I use PreToolUse/PostToolUse hooks with custom scripts", score: 2 },
    ],
  },
  {
    id: "sa7",
    text: "What is MCP in the context of Claude Code?",
    options: [
      { id: "a", text: "No clue", score: 0 },
      { id: "b", text: "Something about connecting to external tools?", score: 0 },
      { id: "c", text: "Model Context Protocol — connects Claude to external data sources and tools", score: 1 },
      { id: "d", text: "I've configured MCP servers and know the difference between stdio and HTTP transport", score: 2 },
    ],
  },
  {
    id: "sa8",
    text: "How do you typically run Claude Code?",
    options: [
      { id: "a", text: "I haven't run it yet", score: 0 },
      { id: "b", text: "In the terminal with basic prompts", score: 0 },
      { id: "c", text: "Interactive mode with slash commands and custom settings", score: 1 },
      { id: "d", text: "Both interactive and headless/CI modes with automation", score: 2 },
    ],
  },
  {
    id: "sa9",
    text: "What are subagents?",
    options: [
      { id: "a", text: "Never heard of them", score: 0 },
      { id: "b", text: "Some kind of background process?", score: 0 },
      { id: "c", text: "Custom agents defined in .claude/agents/ that Claude can delegate tasks to", score: 1 },
      { id: "d", text: "I've created subagents with custom tools and model overrides", score: 2 },
    ],
  },
  {
    id: "sa10",
    text: "Have you built a Claude Code plugin?",
    options: [
      { id: "a", text: "Didn't know that was possible", score: 0 },
      { id: "b", text: "I know plugins exist but haven't built one", score: 0 },
      { id: "c", text: "I understand the plugin structure but haven't shipped one", score: 1 },
      { id: "d", text: "I've built and distributed a plugin", score: 2 },
    ],
  },
];

function scoreToLevel(score: number): "beginner" | "intermediate" | "advanced" {
  if (score <= 6) return "beginner";
  if (score <= 14) return "intermediate";
  return "advanced";
}

type Phase = "intro" | "quiz" | "done";

export default function QuizClient() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({}); // questionId → score
  const [selected, setSelected] = useState<string | null>(null); // currently selected optionId

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
    if (selected !== null) return; // locked
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
      // Quiz complete
      const totalScore = Object.values(newAnswers).reduce((a, b) => a + b, 0);
      const level = scoreToLevel(totalScore);
      setPhase("done");
      router.push(`/quiz/result/${level}`);
    }
  }

  function handleBack() {
    if (current === 0) {
      setPhase("intro");
      setSelected(null);
      return;
    }
    // Remove last answer
    const prevQ = QUESTIONS[current - 1];
    const newAnswers = { ...answers };
    delete newAnswers[prevQ.id];
    setAnswers(newAnswers);
    setCurrent((c) => c - 1);
    setSelected(null);
  }

  // ── INTRO ──
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-lg text-center animate-fade-up">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-3xl">
          🎯
        </div>
        <h2 className="text-2xl font-semibold text-fg">Find Your Starting Point</h2>
        <p className="mt-3 text-base leading-relaxed text-fg-muted">
          Answer 10 quick questions about your Claude Code experience. No wrong answers — this
          just helps us recommend where to begin.
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-accent px-8 py-3 text-base font-semibold text-accent-fg shadow-[var(--shadow-sm)] transition hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Start Quiz
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    );
  }

  // ── DONE ──
  if (phase === "done") {
    return (
      <div className="mx-auto max-w-lg text-center animate-fade-up">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-3xl">
          ✓
        </div>
        <p className="text-lg font-medium text-fg">Calculating your level…</p>
      </div>
    );
  }

  // ── QUIZ ──
  const isAnswered = selected !== null;

  return (
    <div className="mx-auto max-w-lg animate-fade-up">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-fg-subtle">
          <span>
            Question {current + 1} of {total}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <p className="mb-5 text-lg font-semibold leading-snug text-fg">
          {question.text}
        </p>

        <div className="space-y-2.5">
          {question.options.map((opt) => {
            const isSelected = selected === opt.id;
            let cls =
              "flex min-h-[44px] w-full items-center rounded-lg border px-4 py-3 text-left text-sm transition";

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
                <span className="mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-border bg-bg text-xs font-mono text-fg-subtle">
                  {opt.id.toUpperCase()}
                </span>
                <span className="flex-1">{opt.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg-muted transition hover:border-border-strong hover:text-fg"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          {current === 0 ? "Back to intro" : "Previous"}
        </button>

        <button
          type="button"
          disabled={!isAnswered}
          onClick={handleNext}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-fg shadow-[var(--shadow-sm)] transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {current === total - 1 ? "See my result" : "Next"}
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
