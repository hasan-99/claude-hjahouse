"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";

/* ---------------------------------------------------------------------------
   Interactive terminal playground — mimics Claude Code CLI behaviour.
   Supports slash commands with canned outputs and simulated Claude responses.
--------------------------------------------------------------------------- */

type Tone = "system" | "user" | "green" | "amber" | "blue" | "purple" | "muted" | "error" | "default";

interface Line {
  id: number;
  text: string;
  tone: Tone;
  prompt?: string;
}

type Mode = "free" | "guided";

const toneClass: Record<Tone, string> = {
  system: "text-term-muted",
  user: "text-term-fg",
  green: "text-term-green",
  amber: "text-term-amber",
  blue: "text-term-blue",
  purple: "text-term-purple",
  muted: "text-term-muted/70",
  error: "text-term-error",
  default: "text-term-fg",
};

let idCounter = 0;
const nextId = () => ++idCounter;

/* ---- Canned command outputs ---- */

const HELP_OUTPUT: Line[] = [
  { id: 0, text: "Available slash commands:", tone: "green" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: "  /help        Show this help message", tone: "default" },
  { id: 0, text: "  /clear       Clear the terminal screen", tone: "default" },
  { id: 0, text: "  /model       Show the current model in use", tone: "default" },
  { id: 0, text: "  /review      Run a code review on the current project", tone: "default" },
  { id: 0, text: "  /init        Initialize Claude Code in a project", tone: "default" },
  { id: 0, text: "  /cost        Show token usage and cost for this session", tone: "default" },
  { id: 0, text: "  /context     Show the current context window usage", tone: "default" },
  { id: 0, text: "  /config      Open configuration settings", tone: "default" },
  { id: 0, text: "  /status      Show Claude Code daemon status", tone: "default" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: "  Or type any natural language prompt and Claude will respond.", tone: "muted" },
];

const MODEL_OUTPUT: Line[] = [
  { id: 0, text: "Current model: claude-opus-4-5", tone: "blue" },
  { id: 0, text: "Provider: Anthropic", tone: "muted" },
  { id: 0, text: "Context window: 200k tokens", tone: "muted" },
  { id: 0, text: "Max output: 8192 tokens", tone: "muted" },
];

const REVIEW_OUTPUT: Line[] = [
  { id: 0, text: "✦ Running code review…", tone: "amber" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: "Scanning src/ for issues…", tone: "muted" },
  { id: 0, text: "  ✓ No security vulnerabilities found", tone: "green" },
  { id: 0, text: "  ✓ TypeScript types are consistent", tone: "green" },
  { id: 0, text: "  ⚠ 2 unused imports in lib/utils.ts", tone: "amber" },
  { id: 0, text: "  ⚠ Missing error boundary in <App />", tone: "amber" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: "Summary: 0 critical · 0 high · 2 medium · 0 low", tone: "default" },
  { id: 0, text: "Run /fix to auto-resolve fixable issues.", tone: "muted" },
];

const INIT_OUTPUT: Line[] = [
  { id: 0, text: "✦ Initializing Claude Code in ~/my-project…", tone: "amber" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: "  ✓ Detected: Next.js 16 · TypeScript · Tailwind v4", tone: "green" },
  { id: 0, text: "  ✓ Created CLAUDE.md with project context", tone: "green" },
  { id: 0, text: "  ✓ Added .claude/settings.json", tone: "green" },
  { id: 0, text: "  ✓ Registered 3 default hooks", tone: "green" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: "Claude Code is ready. Try asking it to:", tone: "muted" },
  { id: 0, text: "  • Explain the codebase structure", tone: "muted" },
  { id: 0, text: "  • Fix a specific bug", tone: "muted" },
  { id: 0, text: "  • Add a new feature", tone: "muted" },
];

const COST_OUTPUT: Line[] = [
  { id: 0, text: "Session token usage:", tone: "blue" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: "  Input tokens:   1,247", tone: "default" },
  { id: 0, text: "  Output tokens:    312", tone: "default" },
  { id: 0, text: "  Cache read:     8,904", tone: "muted" },
  { id: 0, text: "  Cache write:    1,247", tone: "muted" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: "  Estimated cost: $0.014", tone: "green" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: "  Cache savings: ~84% reduction vs. uncached", tone: "amber" },
];

const CONTEXT_OUTPUT: Line[] = [
  { id: 0, text: "Context window usage:", tone: "blue" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: "  Used:      12,543 / 200,000 tokens", tone: "default" },
  { id: 0, text: "  Available: 187,457 tokens (93.7%)", tone: "green" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: "  CLAUDE.md:        1,203 tokens", tone: "muted" },
  { id: 0, text: "  Conversation:     4,812 tokens", tone: "muted" },
  { id: 0, text: "  Files in context: 6,528 tokens", tone: "muted" },
];

const CONFIG_OUTPUT: Line[] = [
  { id: 0, text: "Claude Code configuration (.claude/settings.json):", tone: "blue" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: '  {', tone: "default" },
  { id: 0, text: '    "model": "claude-opus-4-5",', tone: "default" },
  { id: 0, text: '    "theme": "dark",', tone: "default" },
  { id: 0, text: '    "autoCompact": true,', tone: "default" },
  { id: 0, text: '    "hooks": {', tone: "default" },
  { id: 0, text: '      "PreToolUse": ["npx lint-staged"],', tone: "default" },
  { id: 0, text: '      "PostToolUse": ["npx tsc --noEmit"]', tone: "default" },
  { id: 0, text: '    }', tone: "default" },
  { id: 0, text: '  }', tone: "default" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: "  Edit with: claude config", tone: "muted" },
];

const STATUS_OUTPUT: Line[] = [
  { id: 0, text: "Claude Code daemon status:", tone: "blue" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: "  ● claude-daemon     active (running) since 2m ago", tone: "green" },
  { id: 0, text: "  ● mcp-server        active (3 servers connected)", tone: "green" },
  { id: 0, text: "  ○ background-agent  idle", tone: "muted" },
  { id: 0, text: "", tone: "default" },
  { id: 0, text: "  Version:    claude-code v1.24.12", tone: "muted" },
  { id: 0, text: "  Node:       v20.18.0", tone: "muted" },
  { id: 0, text: "  Platform:   darwin arm64", tone: "muted" },
];

/* Simulated Claude response fragments */
const CLAUDE_RESPONSES: Record<string, Line[]> = {
  default: [
    { id: 0, text: "✦ Thinking…", tone: "amber" },
    { id: 0, text: "", tone: "default" },
    { id: 0, text: "I understand you're working on a project. Let me help you with that.", tone: "default" },
    { id: 0, text: "", tone: "default" },
    { id: 0, text: "To get the most out of Claude Code, try:", tone: "muted" },
    { id: 0, text: "  • Being specific about what you want to change", tone: "muted" },
    { id: 0, text: "  • Mentioning relevant files or directories", tone: "muted" },
    { id: 0, text: "  • Asking follow-up questions to refine the result", tone: "muted" },
  ],
  fix: [
    { id: 0, text: "✦ Thinking…", tone: "amber" },
    { id: 0, text: "", tone: "default" },
    { id: 0, text: "I'll analyze the issue and fix it for you.", tone: "default" },
    { id: 0, text: "", tone: "default" },
    { id: 0, text: "Reading src/lib/utils.ts…", tone: "muted" },
    { id: 0, text: "  Found: unused import { deprecated } on line 3", tone: "amber" },
    { id: 0, text: "  Removing unused imports…", tone: "muted" },
    { id: 0, text: "  ✓ Fixed src/lib/utils.ts", tone: "green" },
    { id: 0, text: "", tone: "default" },
    { id: 0, text: "1 file changed, 2 deletions(−)", tone: "muted" },
  ],
  explain: [
    { id: 0, text: "✦ Thinking…", tone: "amber" },
    { id: 0, text: "", tone: "default" },
    { id: 0, text: "This is a Next.js 16 project using the App Router.", tone: "default" },
    { id: 0, text: "", tone: "default" },
    { id: 0, text: "Key directories:", tone: "muted" },
    { id: 0, text: "  src/app/           — Routes and pages", tone: "muted" },
    { id: 0, text: "  src/components/    — Reusable UI components", tone: "muted" },
    { id: 0, text: "  src/lib/           — Shared utilities and data", tone: "muted" },
    { id: 0, text: "", tone: "default" },
    { id: 0, text: "The project uses Tailwind v4 with custom design tokens for theming.", tone: "default" },
  ],
  test: [
    { id: 0, text: "✦ Thinking…", tone: "amber" },
    { id: 0, text: "", tone: "default" },
    { id: 0, text: "Running test suite…", tone: "muted" },
    { id: 0, text: "", tone: "default" },
    { id: 0, text: "  ✓ 12 tests passed", tone: "green" },
    { id: 0, text: "  ✗  1 test failed", tone: "error" },
    { id: 0, text: "", tone: "default" },
    { id: 0, text: "  FAIL  src/__tests__/auth.test.ts", tone: "error" },
    { id: 0, text: "    Expected: 200, Received: 401", tone: "error" },
    { id: 0, text: "", tone: "default" },
    { id: 0, text: "Would you like me to fix the failing test?", tone: "muted" },
  ],
};

function getClaudeResponse(input: string): Line[] {
  const lower = input.toLowerCase();
  if (lower.includes("fix") || lower.includes("bug") || lower.includes("error")) return CLAUDE_RESPONSES.fix;
  if (lower.includes("explain") || lower.includes("what") || lower.includes("how")) return CLAUDE_RESPONSES.explain;
  if (lower.includes("test") || lower.includes("spec")) return CLAUDE_RESPONSES.test;
  return CLAUDE_RESPONSES.default;
}

/* ---- Guided mode steps ---- */

const GUIDED_STEPS = [
  {
    instruction: "Step 1 of 5 — Start with /help to see all available commands.",
    command: "/help",
  },
  {
    instruction: "Step 2 of 5 — Check the model with /model.",
    command: "/model",
  },
  {
    instruction: "Step 3 of 5 — Initialize a project with /init.",
    command: "/init",
  },
  {
    instruction: "Step 4 of 5 — Check session cost with /cost.",
    command: "/cost",
  },
  {
    instruction: "Step 5 of 5 — View context usage with /context.",
    command: "/context",
  },
];

/* ---- Example sidebar commands ---- */

const EXAMPLES = [
  { label: "/help", desc: "List all commands" },
  { label: "/model", desc: "Current model info" },
  { label: "/init", desc: "Initialize project" },
  { label: "/review", desc: "Code review" },
  { label: "/cost", desc: "Session cost" },
  { label: "/context", desc: "Context window" },
  { label: "/config", desc: "Show config" },
  { label: "/status", desc: "Daemon status" },
  { label: "Fix the TypeScript error in utils.ts", desc: "Natural language" },
  { label: "Explain the codebase structure", desc: "Natural language" },
  { label: "Run the tests and show failures", desc: "Natural language" },
];

const WELCOME_LINES: Line[] = [
  {
    id: 0,
    text: "Welcome to Claude Code! You're in ~/my-project. Type a command or /help to get started.",
    tone: "system",
  },
];

/* ---- Main playground component ---- */

/* ---- i18n strings ---- */

type Locale = "en" | "ar";

interface PlaygroundStrings {
  modeFree: string;
  modeGuided: string;
  resetBtn: string;
  sidebarHeading: string;
  shortcutsHeading: string;
  clickHint: string;
  inputPlaceholder: string;
  inputThinking: string;
  inputGuidedHint: (cmd: string) => string;
  keyboardHint: string;
  guidedComplete: string;
  guidedCompleteSwitch: string;
  guidedSteps: { instruction: string; command: string }[];
  examples: { label: string; desc: string }[];
  shortcuts: { key: string; action: string }[];
}

const STRINGS: Record<Locale, PlaygroundStrings> = {
  en: {
    modeFree: "Free Type",
    modeGuided: "Guided",
    resetBtn: "Reset Playground",
    sidebarHeading: "Try these commands",
    shortcutsHeading: "Keyboard shortcuts",
    clickHint: "Click any command to load it in the terminal, then press",
    inputPlaceholder: "Type a command or ask Claude anything…",
    inputThinking: "Thinking…",
    inputGuidedHint: (cmd) => `Type "${cmd}" and press Enter`,
    keyboardHint: "↑ ↓ history · Enter to run · /help for commands",
    guidedComplete: "Guided tour complete! Switch to",
    guidedCompleteSwitch: "Free Type",
    guidedSteps: GUIDED_STEPS,
    examples: EXAMPLES,
    shortcuts: [
      { key: "Enter", action: "Run command" },
      { key: "↑ / ↓", action: "Command history" },
      { key: "/help", action: "All commands" },
      { key: "/clear", action: "Clear screen" },
    ],
  },
  ar: {
    modeFree: "كتابة حرة",
    modeGuided: "موجّه",
    resetBtn: "إعادة ضبط الساحة",
    sidebarHeading: "جرّب هذه الأوامر",
    shortcutsHeading: "اختصارات لوحة المفاتيح",
    clickHint: "اضغط على أي أمر لتحميله في الـ terminal، ثم اضغط",
    inputPlaceholder: "اكتب أمراً أو اسأل Claude أي شيء…",
    inputThinking: "جارٍ التفكير…",
    inputGuidedHint: (cmd) => `اكتب "${cmd}" ثم اضغط Enter`,
    keyboardHint: "↑ ↓ السجل · Enter للتشغيل · /help للأوامر",
    guidedComplete: "اكتملت الجولة الموجَّهة! انتقل إلى",
    guidedCompleteSwitch: "كتابة حرة",
    guidedSteps: [
      { instruction: "الخطوة ١ من ٥ — ابدأ بـ /help لعرض جميع الأوامر.", command: "/help" },
      { instruction: "الخطوة ٢ من ٥ — تحقق من النموذج عبر /model.", command: "/model" },
      { instruction: "الخطوة ٣ من ٥ — هيّئ مشروعاً بـ /init.", command: "/init" },
      { instruction: "الخطوة ٤ من ٥ — تحقق من تكلفة الجلسة بـ /cost.", command: "/cost" },
      { instruction: "الخطوة ٥ من ٥ — استعرض استخدام السياق بـ /context.", command: "/context" },
    ],
    examples: [
      { label: "/help", desc: "عرض كل الأوامر" },
      { label: "/model", desc: "معلومات النموذج الحالي" },
      { label: "/init", desc: "تهيئة المشروع" },
      { label: "/review", desc: "مراجعة الكود" },
      { label: "/cost", desc: "تكلفة الجلسة" },
      { label: "/context", desc: "نافذة السياق" },
      { label: "/config", desc: "عرض الإعدادات" },
      { label: "/status", desc: "حالة الخدمة" },
      { label: "Fix the TypeScript error in utils.ts", desc: "لغة طبيعية" },
      { label: "Explain the codebase structure", desc: "لغة طبيعية" },
      { label: "Run the tests and show failures", desc: "لغة طبيعية" },
    ],
    shortcuts: [
      { key: "Enter", action: "تشغيل الأمر" },
      { key: "↑ / ↓", action: "سجل الأوامر" },
      { key: "/help", action: "كل الأوامر" },
      { key: "/clear", action: "مسح الشاشة" },
    ],
  },
};

export default function PlaygroundClient({ locale = "en" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  const [lines, setLines] = useState<Line[]>(WELCOME_LINES.map((l) => ({ ...l, id: nextId() })));
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("free");
  const [guidedStep, setGuidedStep] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* autoscroll */
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, isThinking]);

  /* focus input on mount */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addLines = useCallback((newLines: Omit<Line, "id">[]) => {
    setLines((prev) => [
      ...prev,
      ...newLines.map((l) => ({ ...l, id: nextId() })),
    ]);
  }, []);

  const reset = useCallback(() => {
    idCounter = 0;
    setLines(WELCOME_LINES.map((l) => ({ ...l, id: nextId() })));
    setInput("");
    setIsThinking(false);
    setGuidedStep(0);
    setHistory([]);
    setHistoryIndex(-1);
    inputRef.current?.focus();
  }, []);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setGuidedStep(0);
    idCounter = 0;
    setLines(WELCOME_LINES.map((l) => ({ ...l, id: nextId() })));
    setInput("");
    setIsThinking(false);
    inputRef.current?.focus();
  }, []);

  const processCommand = useCallback(async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    /* echo user input */
    addLines([{ text: cmd, tone: "user", prompt: ">" }]);
    setHistory((h) => [cmd, ...h.slice(0, 49)]);
    setHistoryIndex(-1);
    setInput("");

    const lower = cmd.toLowerCase();

    if (lower === "/clear") {
      setLines([{ id: nextId(), text: "Screen cleared.", tone: "muted" }]);
      return;
    }

    if (lower === "/help") { addLines(HELP_OUTPUT); return; }
    if (lower === "/model") { addLines(MODEL_OUTPUT); return; }
    if (lower === "/review") { addLines(REVIEW_OUTPUT); return; }
    if (lower === "/init") { addLines(INIT_OUTPUT); return; }
    if (lower === "/cost") { addLines(COST_OUTPUT); return; }
    if (lower === "/context") { addLines(CONTEXT_OUTPUT); return; }
    if (lower === "/config") { addLines(CONFIG_OUTPUT); return; }
    if (lower === "/status") { addLines(STATUS_OUTPUT); return; }

    /* unknown slash command */
    if (cmd.startsWith("/")) {
      addLines([{ text: `Unknown command: ${cmd}. Type /help to see available commands.`, tone: "error" }]);
      return;
    }

    /* natural language → simulate Claude */
    setIsThinking(true);
    await new Promise<void>((r) => setTimeout(r, 900 + Math.random() * 600));
    setIsThinking(false);
    addLines(getClaudeResponse(cmd));
  }, [addLines]);

  const runExample = useCallback((cmd: string) => {
    setInput(cmd);
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isThinking) return;

      if (mode === "guided" && guidedStep < s.guidedSteps.length) {
        const expected = s.guidedSteps[guidedStep].command;
        if (input.trim() !== expected) {
          addLines([
            { text: input.trim(), tone: "user", prompt: ">" },
            { text: `💡 Hint: Try typing "${expected}" for this step.`, tone: "amber" },
          ]);
          setInput("");
          setHistory((h) => [input.trim(), ...h.slice(0, 49)]);
          return;
        }
        processCommand(input);
        if (guidedStep + 1 < s.guidedSteps.length) {
          setTimeout(() => {
            addLines([{ text: `\n${s.guidedSteps[guidedStep + 1].instruction}`, tone: "purple" }]);
          }, 300);
        } else {
          setTimeout(() => {
            addLines([{ text: `\n✦ ${s.guidedComplete} ${s.guidedCompleteSwitch}.`, tone: "green" }]);
          }, 300);
        }
        setGuidedStep((st) => st + 1);
        return;
      }

      processCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistoryIndex((i) => {
        const next = Math.min(i + 1, history.length - 1);
        setInput(history[next] ?? "");
        return next;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistoryIndex((i) => {
        const next = Math.max(i - 1, -1);
        setInput(next === -1 ? "" : (history[next] ?? ""));
        return next;
      });
    }
  }, [input, isThinking, mode, guidedStep, processCommand, addLines, history, s]);

  const guidedInstruction = mode === "guided" && guidedStep < s.guidedSteps.length
    ? s.guidedSteps[guidedStep].instruction
    : null;

  return (
    <div className="flex flex-col gap-6 pb-16 lg:flex-row lg:items-start lg:gap-8">
      {/* ---- Main terminal panel ---- */}
      <div className="min-w-0 flex-1">
        {/* mode bar */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg border border-border bg-bg-subtle p-1">
            {(["free", "guided"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`min-h-[40px] rounded-md px-4 py-1.5 text-sm font-medium transition ${
                  mode === m
                    ? "bg-card text-fg shadow-[var(--shadow-sm)]"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                {m === "free" ? s.modeFree : s.modeGuided}
              </button>
            ))}
          </div>
          <button
            onClick={reset}
            className="min-h-[40px] rounded-md border border-border px-4 py-1.5 text-sm text-fg-muted transition hover:border-accent/40 hover:text-fg"
          >
            {s.resetBtn}
          </button>
        </div>

        {/* guided instruction banner */}
        {guidedInstruction && (
          <div className="mb-3 rounded-lg border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-fg-muted">
            <span className="mr-2 text-accent">✦</span>
            {guidedInstruction}
          </div>
        )}
        {mode === "guided" && guidedStep >= s.guidedSteps.length && (
          <div className="mb-3 rounded-lg border border-beginner/30 bg-beginner/8 px-4 py-3 text-sm text-fg-muted">
            <span className="mr-2 text-term-green">✓</span>
            {s.guidedComplete} <strong className="text-fg">{s.guidedCompleteSwitch}</strong>.
          </div>
        )}

        {/* terminal */}
        <div
          className="overflow-hidden rounded-xl border border-term-border bg-term-bg shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)]"
          onClick={() => inputRef.current?.focus()}
          role="application"
          aria-label="Interactive Claude Code terminal"
        >
          {/* title bar */}
          <div className="flex items-center gap-3 border-b border-term-sep bg-term-bar px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-mono text-xs text-term-muted">Claude Code — Playground</span>
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-term-muted">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-term-green" />
              ~/my-project
            </span>
          </div>

          {/* scrollback body */}
          <div
            ref={bodyRef}
            className="term-scroll h-[420px] overflow-y-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed sm:h-[500px]"
          >
            {lines.map((line) => (
              <div key={line.id} className="whitespace-pre-wrap break-words">
                {line.prompt && (
                  <span className="mr-2 text-accent">{line.prompt}</span>
                )}
                <span className={toneClass[line.tone]}>{line.text}</span>
              </div>
            ))}
            {isThinking && (
              <div className="whitespace-pre-wrap break-words">
                <span className="text-term-amber">✦ Thinking…</span>
                <span className="ml-1 inline-block h-[1.05em] w-[7px] -translate-y-[1px] animate-blink bg-term-amber align-middle" />
              </div>
            )}
          </div>

          {/* input row */}
          <div className="flex items-center gap-2 border-t border-term-sep px-4 py-3">
            <span className="shrink-0 font-mono text-[13px] text-accent">{">"}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isThinking}
              placeholder={
                isThinking
                  ? s.inputThinking
                  : mode === "guided" && guidedStep < s.guidedSteps.length
                  ? s.inputGuidedHint(s.guidedSteps[guidedStep].command)
                  : s.inputPlaceholder
              }
              className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-term-fg outline-none placeholder:text-term-muted/50 disabled:opacity-50"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Terminal input"
            />
            {input && !isThinking && (
              <kbd className="shrink-0 rounded border border-term-border bg-term-bar px-1.5 py-0.5 font-mono text-[11px] text-term-muted">
                ↵ Enter
              </kbd>
            )}
          </div>
        </div>

        {/* keyboard hint */}
        <p className="mt-2 text-center font-mono text-[11px] text-fg-faint">
          {s.keyboardHint}
        </p>
      </div>

      {/* ---- Sidebar: example commands ---- */}
      <aside className="w-full shrink-0 lg:w-64 xl:w-72">
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
          <h2 className="mb-4 text-sm font-semibold text-fg">{s.sidebarHeading}</h2>
          <div className="space-y-1.5">
            {s.examples.map((ex) => (
              <button
                key={ex.label}
                title={ex.label}
                onClick={() => runExample(ex.label)}
                className="group flex w-full min-h-[40px] items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-bg-subtle hover:border-accent/20 border border-transparent"
              >
                <span className="font-mono text-[12px] text-accent leading-tight truncate" title={ex.label}>
                  {ex.label}
                </span>
                <span className="min-w-0 flex-1 text-[12px] text-fg-muted leading-tight truncate">
                  {ex.desc}
                </span>
                <svg
                  className="h-3 w-3 shrink-0 text-fg-faint opacity-0 transition group-hover:opacity-100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            ))}
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-[11px] text-fg-faint leading-relaxed">
              {s.clickHint}{" "}
              <kbd className="rounded border border-border-strong bg-bg-subtle px-1 py-0.5 font-mono text-[10px]">Enter</kbd>{" "}
              to run it.
            </p>
          </div>
        </div>

        {/* keyboard shortcuts card */}
        <div className="mt-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
          <h2 className="mb-3 text-sm font-semibold text-fg">{s.shortcutsHeading}</h2>
          <div className="space-y-2">
            {s.shortcuts.map(({ key, action }) => (
              <div key={key} className="flex items-center justify-between gap-2">
                <kbd className="rounded border border-border-strong bg-bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
                  {key}
                </kbd>
                <span className="text-[12px] text-fg-subtle">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
