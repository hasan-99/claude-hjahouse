import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Quiz, Prose, type QuizQuestion } from "@/components/content";

/* ------------------------------------------------------------------ */
/*  Terminal demo — shows creating a CLAUDE.md and triggering memory   */
/* ------------------------------------------------------------------ */
const memoryScript: Step[] = [
  { t: "print", text: "# Starting Claude Code in project root", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "claude", prompt: "$" },
  { t: "out", lines: [
    { text: "✓ Loaded ~/.claude/CLAUDE.md (user memory)", tone: "green" },
    { text: "✓ Loaded ./CLAUDE.md (project memory)", tone: "green" },
    { text: "  No auto memory found — starting fresh", tone: "muted" },
    { text: "", tone: "default" },
    { text: "Claude Code ready. Type your request or / for commands.", tone: "system" },
  ], gap: 70 },
  { t: "wait", ms: 600 },
  { t: "type", text: "remember that all API tests require Redis to be running", prompt: ">" },
  { t: "out", lines: [
    { text: "", tone: "default" },
    { text: "Got it. I'll add this to your project CLAUDE.md so it's", tone: "default" },
    { text: "available in every future session.", tone: "default" },
    { text: "", tone: "default" },
    { text: "Updated CLAUDE.md:", tone: "amber" },
    { text: "  ## Testing", tone: "muted" },
    { text: "  All API tests require Redis to be running (`redis-server`).", tone: "green" },
  ], gap: 65 },
  { t: "wait", ms: 800 },
  { t: "type", text: "/memory", prompt: ">" },
  { t: "out", lines: [
    { text: "", tone: "default" },
    { text: "Opening memory files in editor…", tone: "system" },
    { text: "  [1] ~/.claude/CLAUDE.md         (user — global)", tone: "blue" },
    { text: "  [2] ./CLAUDE.md                 (project — shared)", tone: "blue" },
    { text: "  [3] ./CLAUDE.local.md           (local — gitignored)", tone: "blue" },
    { text: "  [4] ~/.claude/projects/.../MEMORY.md  (auto memory)", tone: "purple" },
  ], gap: 60 },
  { t: "wait", ms: 700 },
  { t: "clear" },
  { t: "print", text: "# Auto memory loading at session start", tone: "system" },
  { t: "wait", ms: 300 },
  { t: "type", text: "CLAUDE_CODE_DISABLE_AUTO_MEMORY=1 claude", prompt: "$" },
  { t: "out", lines: [
    { text: "✓ Loaded ~/.claude/CLAUDE.md", tone: "green" },
    { text: "✓ Loaded ./CLAUDE.md", tone: "green" },
    { text: "  Auto memory disabled for this session.", tone: "amber" },
  ], gap: 70 },
];

/* ------------------------------------------------------------------ */
/*  Quiz                                                               */
/* ------------------------------------------------------------------ */
const questions: QuizQuestion[] = [
  {
    q: "Which CLAUDE.md location is gitignored by default and meant for personal project-specific settings?",
    options: [
      "~/.claude/CLAUDE.md",
      "./CLAUDE.md",
      "./.claude/CLAUDE.md",
      "./CLAUDE.local.md",
    ],
    answer: 3,
    explanation:
      "CLAUDE.local.md is the personal project-specific file. It is gitignored by convention, so your custom aliases and local shortcuts stay private and are never shared with teammates.",
  },
  {
    q: "What is the first 200 lines / 25 KB of ~/.claude/projects/<project>/memory/MEMORY.md used for?",
    options: [
      "Storing project-level CLAUDE.md overrides",
      "Auto memory — loaded automatically at each session start",
      "The system prompt that Claude sends to the API",
      "Credentials for MCP servers",
    ],
    answer: 1,
    explanation:
      "Auto memory is a directory Claude writes for itself. The first 200 lines or 25 KB of MEMORY.md in that directory load automatically at the start of every session. Additional topic files like debugging.md load on demand.",
  },
  {
    q: "How do path-scoped rules in .claude/rules/*.md work?",
    options: [
      "They apply globally to all files the project touches",
      "They only activate when Claude works with files matching the frontmatter paths pattern",
      "They replace CLAUDE.md entirely for the matched paths",
      "They must be manually loaded with /memory before each session",
    ],
    answer: 1,
    explanation:
      "A rule with 'paths: src/api/**/*.ts' in its frontmatter activates only when Claude reads files matching that glob pattern. Rules without a paths field are loaded at launch with the same priority as .claude/CLAUDE.md.",
  },
  {
    q: "Where should you set autoMemoryDirectory if you want to move auto memory to a custom path?",
    options: [
      "In project settings (./claude/settings.json)",
      "In CLAUDE.local.md",
      "In user settings (~/.claude/settings.json)",
      "As an environment variable CLAUDE_AUTO_MEMORY_DIR",
    ],
    answer: 2,
    explanation:
      "autoMemoryDirectory must be set in user settings, not project or local settings. Project and local settings can redirect writes to sensitive locations and are therefore not accepted for this option.",
  },
];

/* ------------------------------------------------------------------ */
/*  Module body                                                        */
/* ------------------------------------------------------------------ */
export default function Content() {
  return (
    <Prose>
      {/* Intro */}
      <Reveal delay={0}>
        <p>
          Memory in Claude Code means context that persists across sessions. Unlike the
          conversation window which resets when you close it, memory files are loaded
          automatically every time Claude Code starts. This module explains the hierarchy of
          memory files, how to create and update them, and how auto memory works in the
          background.
        </p>
      </Reveal>

      {/* ── Section 1: Hierarchy ────────────────────────────────────── */}
      <Reveal delay={70}>
        <h2>The Memory Hierarchy</h2>
        <p>
          Claude Code has two main memory systems: <code>CLAUDE.md</code> files that{" "}
          <em>you</em> write, and auto memory that <em>Claude</em> writes for itself.
          Officially documented <code>CLAUDE.md</code> locations, from highest to most
          specific priority, are:
        </p>
        <ul>
          <li>
            <strong>Managed policy</strong> — org-wide settings pushed by an administrator
          </li>
          <li>
            <strong>Project instructions</strong> — <code>CLAUDE.md</code> or{" "}
            <code>.claude/CLAUDE.md</code> at the project root, committed to git
          </li>
          <li>
            <strong>User instructions</strong> — <code>~/.claude/CLAUDE.md</code>, your
            personal global preferences
          </li>
          <li>
            <strong>Local instructions</strong> — <code>./CLAUDE.local.md</code>, personal
            project-specific settings that are gitignored
          </li>
        </ul>
      </Reveal>

      <Reveal delay={140}>
        <p>
          <strong>Project memory</strong> is the one you&apos;ll use most. It&apos;s a
          markdown file committed to git and shared with your team. Put your tech stack,
          naming conventions, common commands, and non-obvious gotchas here.{" "}
          <strong>User memory</strong> is for personal preferences that apply across all
          your projects — your preferred patterns, how you like code explained, tools you
          always use.
        </p>
        <Callout tone="tip" title="Rule of thumb">
          Use project memory for everything a teammate would need to understand the
          codebase — setup steps, testing commands, architecture decisions. Use user memory
          for how you personally like to work, not what the project does. When a project
          memory entry only matters to you (for example, a custom alias or local shortcut),
          put it in <code>CLAUDE.local.md</code> instead so it stays private.
        </Callout>
      </Reveal>

      {/* Path-scoped rules */}
      <Reveal delay={210}>
        <h3>Path-scoped rules</h3>
        <p>
          For larger projects, split instructions into <code>.claude/rules/*.md</code>{" "}
          files. Rules can be global to the project or scoped to paths with frontmatter. A
          rule with <code>paths: src/api/**/*.ts</code> only activates when Claude works
          with matching files:
        </p>
      </Reveal>

      <Reveal delay={280}>
        <CodeBlock
          filename=".claude/rules/api-validation.md"
          lang="markdown"
          code={`---
paths: src/api/**/*.ts
---
All API endpoints must validate input with Zod. Return 400 with field-level errors on validation failure.`}
        />
        <p>
          Path-scoped rules trigger when Claude reads files matching the pattern, not on
          every tool use involving those files. Rules without a <code>paths</code> field
          are loaded at launch with the same priority as{" "}
          <code>.claude/CLAUDE.md</code>. Circular symlinks are detected and handled
          gracefully.
        </p>
      </Reveal>

      {/* ── Section 2: Creating & Updating ──────────────────────────── */}
      <Reveal delay={350}>
        <h2>Creating and Updating Memory</h2>
        <p>
          The fastest way to start is <code>/init</code>. Run it in your project directory
          and Claude analyzes the codebase to generate a starter <code>CLAUDE.md</code>.
          Use <code>CLAUDE_CODE_NEW_INIT=1 claude</code> for an interactive multi-phase
          setup flow.
        </p>
        <p>
          For larger edits, <code>/memory</code> opens your memory files in your system
          editor. Make changes, save, and Claude reloads them automatically. If you want
          Claude to remember something automatically, ask it naturally — like{" "}
          <em>&ldquo;remember that the API tests require Redis.&rdquo;</em> If you want it
          written into <code>CLAUDE.md</code>, ask Claude explicitly to add it there.
        </p>
      </Reveal>

      {/* # shortcut */}
      <Reveal delay={420}>
        <h3>The # shortcut</h3>
        <p>
          Prefix any message with <code>#</code> to tell Claude to save that note to
          memory immediately, without performing any other action:
        </p>
      </Reveal>

      <Reveal delay={490}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`> # all API tests require Redis to be running
# Saved to CLAUDE.md under ## Testing.`}
        />
      </Reveal>

      {/* @import syntax */}
      <Reveal delay={560}>
        <h3>@import syntax</h3>
        <p>
          The <code>@path/to/file</code> import syntax lets you reference existing
          documentation rather than duplicating it. Claude reads the referenced files and
          folds them into its context at session start:
        </p>
      </Reveal>

      <Reveal delay={630}>
        <CodeBlock
          filename="CLAUDE.md"
          lang="markdown"
          code={`# Project Standards

@README.md
@docs/architecture.md
@package.json`}
        />
        <Callout tone="note">
          Imports support a maximum depth of four hops. First-time imports from external
          paths trigger an approval dialog before Claude reads the file.
        </Callout>
      </Reveal>

      {/* ── Section 3: Auto Memory ──────────────────────────────────── */}
      <Reveal delay={700}>
        <h2>Auto Memory</h2>
        <p>
          Auto memory is a directory where Claude writes its own notes during sessions —
          patterns it discovers, project-specific behaviors, debugging insights. The first{" "}
          <strong>200 lines</strong> or <strong>25 KB</strong> of{" "}
          <code>~/.claude/projects/&lt;project&gt;/memory/MEMORY.md</code>, whichever
          comes first, load automatically at session start. Additional topic files such as{" "}
          <code>debugging.md</code> and <code>api-conventions.md</code> are loaded on
          demand.
        </p>
        <p>
          Subagents can also maintain their own auto memory. See the{" "}
          <a href="/learn/subagents">subagent configuration</a> module for details.
        </p>
      </Reveal>

      <Reveal delay={770}>
        <p>
          You don&apos;t need to maintain auto memory manually — Claude handles writes
          itself. You can read and edit the files if you want to correct or add to
          Claude&apos;s notes. You can toggle it in <code>/memory</code>, disable it for a
          session with <code>CLAUDE_CODE_DISABLE_AUTO_MEMORY=1 claude</code>, or set{" "}
          <code>autoMemoryEnabled</code> in settings.
        </p>
        <p>
          To move the directory to a synced location or a custom path, set{" "}
          <code>autoMemoryDirectory</code> in <strong>user settings</strong> (not project
          or local settings — project and local settings can redirect writes to sensitive
          locations and are not accepted):
        </p>
      </Reveal>

      <Reveal delay={840}>
        <CodeBlock
          filename="~/.claude/settings.json"
          lang="json"
          code={`{
  "autoMemoryEnabled": true,
  "autoMemoryDirectory": "/path/to/shared/memory"
}`}
        />
      </Reveal>

      {/* claudeMdExcludes */}
      <Reveal delay={910}>
        <h3>Excluding files in monorepos</h3>
        <p>
          In large monorepos with many <code>CLAUDE.md</code> files, use{" "}
          <code>claudeMdExcludes</code> in settings to skip irrelevant ones:
        </p>
      </Reveal>

      <Reveal delay={980}>
        <CodeBlock
          filename="~/.claude/settings.json"
          lang="json"
          code={`{
  "claudeMdExcludes": [
    "packages/legacy-app/CLAUDE.md",
    "vendors/**/CLAUDE.md"
  ]
}`}
        />
        <p>
          Claude also loads <code>CLAUDE.md</code> files it finds <em>above</em> your
          current working directory, and it loads subdirectory <code>CLAUDE.md</code>{" "}
          files on demand when Claude reads files in those directories. In monorepos,{" "}
          <code>claudeMdExcludes</code> helps keep unrelated instructions out of context.
        </p>
      </Reveal>

      {/* ── Terminal demo ────────────────────────────────────────────── */}
      <Reveal delay={1050}>
        <h2>Seeing it in action</h2>
        <p>
          The demo below shows Claude loading memory at startup, accepting a natural
          language &ldquo;remember&rdquo; request, and the <code>/memory</code> command
          listing available memory files.
        </p>
      </Reveal>

      <Reveal delay={1120}>
        <Terminal
          script={memoryScript}
          title="Memory & CLAUDE.md demo"
          loop={true}
          loopDelay={3000}
          showStatus={true}
        />
      </Reveal>

      {/* ── Section 4: Write effective instructions ──────────────────── */}
      <Reveal delay={1190}>
        <h2>Write effective instructions</h2>
        <p>
          The context window visualization shows where <code>CLAUDE.md</code> loads
          relative to the rest of the startup context. Use it to understand how much room
          your instructions consume.
        </p>
        <ul>
          <li>
            Target <strong>under 200 lines</strong> per <code>CLAUDE.md</code> file —
            longer files consume more context and reduce adherence.
          </li>
          <li>
            If instructions are growing large, use path-scoped rules so instructions load
            only when Claude works with matching files.
          </li>
          <li>
            Prefer <code>@import</code> references to actual project docs over duplicating
            content inside <code>CLAUDE.md</code>.
          </li>
          <li>
            Keep user memory (<code>~/.claude/CLAUDE.md</code>) focused on personal
            working style, not project-specific facts.
          </li>
        </ul>
      </Reveal>

      <Reveal delay={1260}>
        <Callout tone="warn" title="Context budget">
          Every line in your <code>CLAUDE.md</code> consumes context on every turn. A
          2000-line file leaves significantly less room for actual code, tool output, and
          conversation. Keep it tight and use path-scoped rules to load instructions only
          when needed.
        </Callout>
      </Reveal>

      {/* ── Quiz ─────────────────────────────────────────────────────── */}
      <Reveal delay={1330}>
        <Quiz questions={questions} title="Memory & CLAUDE.md — quick check" />
      </Reveal>
    </Prose>
  );
}
