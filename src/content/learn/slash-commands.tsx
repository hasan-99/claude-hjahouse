import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Kbd, Quiz, Prose, type QuizQuestion } from "@/components/content";
import { Card } from "@/components/ui";

/* --------------------------------------------------------------------------
   Terminal demo: discovering and using slash commands
-------------------------------------------------------------------------- */
const discoveryScript: Step[] = [
  { t: "print", text: "# Type / to open the command menu", tone: "system" },
  { t: "wait", ms: 500 },
  { t: "type", text: "/", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "  /clear          Start a fresh session", tone: "green" },
    { text: "  /compact        Compress conversation history", tone: "green" },
    { text: "  /config         Open settings menu", tone: "green" },
    { text: "  /context        Show context usage grid", tone: "green" },
    { text: "  /cost           Show session cost & token usage", tone: "green" },
    { text: "  /model          Switch the active model", tone: "green" },
    { text: "  /status         Show version & account info", tone: "green" },
    { text: "  ... (type to filter)", tone: "muted" },
  ], gap: 55 },
  { t: "wait", ms: 800 },
  { t: "clear" },
  { t: "print", text: "# Filter by typing letters", tone: "system" },
  { t: "type", text: "/co", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "  /compact        Compress conversation history", tone: "green" },
    { text: "  /config         Open settings menu", tone: "green" },
    { text: "  /context        Show context usage grid", tone: "green" },
    { text: "  /cost           Show session cost & token usage", tone: "green" },
  ], gap: 60 },
  { t: "wait", ms: 700 },
  { t: "clear" },
  { t: "print", text: "# Press Enter to run /context", tone: "system" },
  { t: "type", text: "/context", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "Context usage", tone: "blue" },
    { text: "████████████░░░░░░░░  62 %  of 200 k tokens used", tone: "amber" },
    { text: "Conversation turns : 24", tone: "muted" },
    { text: "Files in context   : 7", tone: "muted" },
  ], gap: 70 },
  { t: "wait", ms: 1200 },
];

/* --------------------------------------------------------------------------
   Terminal demo: compact + model switch workflow
-------------------------------------------------------------------------- */
const workflowScript: Step[] = [
  { t: "print", text: "# Compact with a custom instruction", tone: "system" },
  { t: "type", text: "/compact keep the auth refactor plan, drop the debug logs", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "✔ Compressing 24 turns → summary", tone: "green" },
    { text: "✔ Auth refactor plan preserved", tone: "green" },
    { text: "✔ Debug log thread removed", tone: "muted" },
    { text: "Context freed: ~38 k tokens", tone: "blue" },
  ], gap: 80 },
  { t: "wait", ms: 700 },
  { t: "clear" },
  { t: "print", text: "# Switch to Opus for a hard problem", tone: "system" },
  { t: "type", text: "/model opus", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "Model → claude-opus-4-5  ✔", tone: "green" },
  ], gap: 80 },
  { t: "wait", ms: 500 },
  { t: "type", text: "/effort high", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "Reasoning effort → high  ✔", tone: "green" },
  ], gap: 80 },
  { t: "wait", ms: 500 },
  { t: "type", text: "/cost", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "Session cost   : $0.14", tone: "amber" },
    { text: "Duration       : 18 min", tone: "muted" },
    { text: "Tokens in      : 62 481", tone: "muted" },
    { text: "Tokens out     : 8 204", tone: "muted" },
    { text: "Code changes   : +142 / -37 lines", tone: "green" },
  ], gap: 75 },
  { t: "wait", ms: 1400 },
];

/* --------------------------------------------------------------------------
   Quiz questions
-------------------------------------------------------------------------- */
const questions: QuizQuestion[] = [
  {
    q: "What happens when you type / at the Claude Code prompt?",
    options: [
      "Claude Code searches the web",
      "A filterable menu of all available commands appears",
      "The session resets immediately",
      "A new file is created",
    ],
    answer: 1,
    explanation:
      "Typing / opens the command menu listing every available slash command. You can then type additional letters to filter the list — for example /co narrows it down to /compact, /config, /context, and /cost.",
  },
  {
    q: "Which command compresses the conversation while letting you keep specific parts?",
    options: ["/clear", "/context", "/compact", "/export"],
    answer: 2,
    explanation:
      "/compact summarises the conversation history to free up context window space. You can pass an instruction such as '/compact keep the migration plan, drop the debugging' to control exactly what is preserved.",
  },
  {
    q: "How do you check how much of your context window is currently used?",
    options: [
      "/cost",
      "/context",
      "/status",
      "/usage-credits",
    ],
    answer: 1,
    explanation:
      "/context shows a visual grid of your context usage — how many tokens are filled and how many turns and files are in context. /cost shows session cost and token counts but not the usage grid.",
  },
  {
    q: "What does /effort high do?",
    options: [
      "Raises the Anthropic billing tier",
      "Sets Claude's extended reasoning depth for the current session",
      "Switches to the Opus model",
      "Increases the context window size",
    ],
    answer: 1,
    explanation:
      "/effort sets the reasoning depth for the current session. Valid values are low, medium, high, xhigh, max, and auto. It does not change the model or billing tier — use /model to switch models.",
  },
];

/* --------------------------------------------------------------------------
   Page body (Server Component)
-------------------------------------------------------------------------- */
export default function Content() {
  return (
    <Prose>
      {/* Intro */}
      <Reveal>
        <p>
          Slash commands are the fastest way to control Claude Code&rsquo;s behavior
          during an interactive session. Type <Kbd>/</Kbd> at any prompt to see the
          full list, or type a few letters to filter. This module covers the built-in
          commands you&rsquo;ll use every day.
        </p>
      </Reveal>

      {/* ── Discovering Commands ── */}
      <Reveal delay={70}>
        <h2>Discovering Commands</h2>
        <p>
          Type <Kbd>/</Kbd> at the prompt and a menu appears with all available
          commands. Start typing to filter — <Kbd>/co</Kbd> narrows to{" "}
          <code>/compact</code>, <code>/color</code>, <code>/config</code>,{" "}
          <code>/context</code>, <code>/cost</code>, <code>/copy</code>. Arrow keys
          navigate, Enter selects. Commands that aren&rsquo;t available for your
          current setup are hidden automatically, so you only see what works.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <Terminal
          script={discoveryScript}
          title="slash command menu"
          loop
          loopDelay={2000}
        />
      </Reveal>

      <Reveal delay={210}>
        <Callout tone="tip" title="New to Claude Code?">
          Try <code>/powerup</code> — it runs interactive lessons with animated demos
          that walk you through key features right inside the CLI.
        </Callout>
      </Reveal>

      <Reveal delay={280}>
        <p>
          Some commands accept arguments directly:{" "}
          <code>/compact focus on the API layer</code>, <code>/model opus</code>,{" "}
          <code>/effort high</code>, <code>/rename auth-refactor</code>. Others like{" "}
          <code>/context</code>, <code>/cost</code>, and <code>/status</code> run
          immediately with no arguments.
        </p>
        <CodeBlock
          filename="example"
          lang="text"
          code={`/compact focus on the payment service`}
        />
      </Reveal>

      {/* ── Command Categories ── */}
      <Reveal delay={70}>
        <h2>Command Categories</h2>
        <p>
          Built-in commands group into a few categories. Knowing the categories helps
          you find the right command without memorizing all of them.
        </p>
      </Reveal>

      {/* Context management */}
      <Reveal delay={140}>
        <h3>Context Management</h3>
        <p>Controls how much of the conversation Claude can see.</p>
        <div className="my-4 grid gap-3 sm:grid-cols-1">
          {[
            { cmd: "/context", desc: "Shows a visual grid of your context usage." },
            { cmd: "/compact [instruction]", desc: "Compresses the conversation. Pass instructions to control what's preserved." },
            { cmd: "/clear", desc: "Starts completely fresh — wipes the conversation history." },
          ].map((item, i) => (
            <Card
              key={item.cmd}
              className="transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <code className="text-sm font-semibold text-accent">{item.cmd}</code>
              <p className="mt-1 text-sm text-fg-muted">{item.desc}</p>
            </Card>
          ))}
        </div>
        <CodeBlock
          filename="context management"
          lang="text"
          code={`/context
/compact keep the auth refactor plan, drop the debugging
/clear`}
        />
      </Reveal>

      {/* Session tools */}
      <Reveal delay={140}>
        <h3>Session Tools</h3>
        <p>Manage and revisit work across sessions.</p>
        <div className="my-4 grid gap-3 sm:grid-cols-1">
          {[
            { cmd: "/rename my-feature", desc: "Gives the session a readable name for easy resumption." },
            { cmd: "/resume", desc: "Picks up a previous named session." },
            { cmd: "/branch", desc: "Creates a parallel conversation to explore an alternative without losing your current state." },
            { cmd: "/rewind  (alias: /undo)", desc: "Rolls back to an earlier point in the conversation." },
            { cmd: "/export", desc: "Saves the session to a file or clipboard." },
            { cmd: "/recap", desc: "Generates a one-line summary of what happened. Also runs automatically when you return to the terminal." },
          ].map((item, i) => (
            <Card
              key={item.cmd}
              className="transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <code className="text-sm font-semibold text-accent">{item.cmd}</code>
              <p className="mt-1 text-sm text-fg-muted">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* Configuration */}
      <Reveal delay={140}>
        <h3>Configuration</h3>
        <p>Adjust Claude&rsquo;s behavior mid-session without leaving the terminal.</p>
        <div className="my-4 grid gap-3 sm:grid-cols-1">
          {[
            { cmd: "/model", desc: "Switches between available models — Sonnet, Opus, Haiku, and aliases like best or opusplan." },
            { cmd: "/effort low|medium|high|xhigh|max|auto", desc: "Sets reasoning depth for the current session." },
            { cmd: "/permissions", desc: "Manages what Claude can do without asking for approval." },
            { cmd: "/config", desc: "Opens the settings menu." },
            { cmd: "/theme", desc: "(v2.1.118+) Creates and switches between named custom themes stored as JSON in ~/.claude/themes/." },
            { cmd: "/tui", desc: "Switches between classic and flicker-free fullscreen rendering mid-conversation." },
            { cmd: "/focus", desc: "Toggles focus view for distraction-free input." },
            { cmd: "/fewer-permission-prompts", desc: "Scans recent transcripts and proposes an allowlist for .claude/settings.json to reduce future prompts." },
          ].map((item, i) => (
            <Card
              key={item.cmd}
              className="transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <code className="text-sm font-semibold text-accent">{item.cmd}</code>
              <p className="mt-1 text-sm text-fg-muted">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* Diagnostics */}
      <Reveal delay={140}>
        <h3>Diagnostics</h3>
        <p>Help when something isn&rsquo;t working.</p>
        <div className="my-4 grid gap-3 sm:grid-cols-1">
          {[
            { cmd: "/cost", desc: "Shows session cost, duration, code changes, and token usage." },
            { cmd: "/usage-credits", desc: "(v2.1.144+, formerly /extra-usage) View and manage usage credits on your account." },
            { cmd: "/status", desc: "Shows version, model, and account info." },
            { cmd: "/doctor", desc: "Checks installation health." },
            { cmd: "/diff", desc: "Opens an interactive viewer for uncommitted changes — useful for reviewing what Claude has done before committing." },
          ].map((item, i) => (
            <Card
              key={item.cmd}
              className="transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <code className="text-sm font-semibold text-accent">{item.cmd}</code>
              <p className="mt-1 text-sm text-fg-muted">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* Pre-ship reviews */}
      <Reveal delay={140}>
        <h3>Pre-ship Reviews</h3>
        <p>Check your work before it leaves your branch.</p>
        <div className="my-4 grid gap-3 sm:grid-cols-1">
          {[
            { cmd: "/code-review [effort] [--comment] [--fix]", desc: "Reviews the current diff for correctness bugs. Accepts an effort level (low/high), --comment to post findings as inline PR comments, and --fix to apply findings to your working tree." },
            { cmd: "/code-review ultra [PR#]", desc: "Deep multi-agent review in a cloud sandbox using parallel analysis. With no args reviews the current branch; pass a PR number to review a GitHub PR. /ultrareview is an alias." },
            { cmd: "/review", desc: "Read-only deeper pass on the change set." },
            { cmd: "/security-review", desc: "Security-focused review of pending changes." },
          ].map((item, i) => (
            <Card
              key={item.cmd}
              className="transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <code className="text-sm font-semibold text-accent">{item.cmd}</code>
              <p className="mt-1 text-sm text-fg-muted">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* ── Workflow demo ── */}
      <Reveal delay={70}>
        <h2>Commands in a Real Workflow</h2>
        <p>
          Here&rsquo;s a typical sequence: compact to free context, switch to a
          more powerful model for a hard task, then check cost before finishing.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <Terminal
          script={workflowScript}
          title="workflow demo"
          loop
          loopDelay={2200}
        />
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename="common command sequence"
          lang="text"
          code={`/context
/compact keep the auth refactor plan
/model opus
/effort high
/cost
/code-review high
/code-review --comment`}
        />
      </Reveal>

      {/* Callout: argument patterns */}
      <Reveal delay={280}>
        <Callout tone="info" title="Argument patterns">
          Commands that accept free-text arguments (<code>/compact</code>,{" "}
          <code>/rename</code>) take everything after the command name as the
          argument — no quotes needed. Commands that accept flags (
          <code>/code-review --fix</code>, <code>/code-review high</code>) follow
          standard CLI conventions.
        </Callout>
      </Reveal>

      {/* ── Custom slash commands note ── */}
      <Reveal delay={70}>
        <h2>Custom Slash Commands</h2>
        <p>
          Beyond the built-ins, you can define your own slash commands as{" "}
          <strong>skills</strong>. A skill is a Markdown file placed in{" "}
          <code>~/.claude/skills/</code> (user-global) or{" "}
          <code>.claude/skills/</code> (project-local). Claude discovers the file
          and exposes it as <code>/filename</code> in the menu.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="~/.claude/skills/deploy.md"
          lang="markdown"
          code={`# deploy

Run pre-flight checks and deploy the current branch to staging.

## Steps
1. Run \`npm test\` — abort if tests fail
2. Run \`npm run build\` — abort on build errors
3. Run \`vercel --prod\` and print the deployment URL
4. Ping #deploys in Slack with the URL`}
        />
        <p className="mt-3 text-sm text-fg-muted">
          After saving that file, type <code>/deploy</code> at any Claude Code
          prompt and the skill runs automatically. Skills can include acceptance
          criteria, context references, and structured action steps — see the{" "}
          <strong>Skills</strong> module for the full format.
        </p>
      </Reveal>

      <Reveal delay={210}>
        <Callout tone="warn" title="Project vs. user skills">
          Skills in <code>.claude/skills/</code> (project-local) override same-named
          skills in <code>~/.claude/skills/</code> (user-global). Keep generic
          commands at the user level and project-specific ones in the repo so
          teammates share them via version control.
        </Callout>
      </Reveal>

      {/* ── Quiz ── */}
      <Reveal delay={70}>
        <Quiz questions={questions} title="Check your understanding" />
      </Reveal>
    </Prose>
  );
}
