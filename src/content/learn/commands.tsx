import { Prose, Callout, Kbd, Quiz, type QuizQuestion } from "@/components/content";
import CodeBlock from "@/components/CodeBlock";
import Terminal, { type Step } from "@/components/Terminal";
import Reveal from "@/components/Reveal";

/* ── Terminal scripts ─────────────────────────────────────────────── */

const contextScript: Step[] = [
  { t: "print", text: "# Session & context management", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/context", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "Context window usage:", tone: "green" },
    { text: "████████████░░░░░░░░  62% used  (49,800 / 80,000 tokens)", tone: "amber" },
  ], gap: 60 },
  { t: "wait", ms: 700 },
  { t: "type", text: "/compact focus on the auth refactor", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "✓ Conversation compacted. Preserved: auth refactor plan, open TODOs.", tone: "green" },
  ], gap: 60 },
  { t: "wait", ms: 700 },
  { t: "type", text: "/rename auth-refactor-v2", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "✓ Session saved as \"auth-refactor-v2\"", tone: "green" },
  ], gap: 60 },
  { t: "wait", ms: 600 },
  { t: "type", text: "/export auth-refactor-v2.md", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "✓ Transcript written to auth-refactor-v2.md", tone: "green" },
  ], gap: 60 },
  { t: "wait", ms: 1200 },
  { t: "clear" },
];

const fastModeScript: Step[] = [
  { t: "print", text: "# Fast mode + effort level", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/fast", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "↯  Fast mode enabled — switched to Opus 4.8", tone: "amber" },
    { text: "Responses up to 2.5× faster at higher per-token cost.", tone: "muted" },
  ], gap: 70 },
  { t: "wait", ms: 700 },
  { t: "type", text: "/effort low", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "Effort set to: low  (minimal thinking time)", tone: "blue" },
    { text: "Tip: combine with /fast for maximum speed on simple tasks.", tone: "muted" },
  ], gap: 70 },
  { t: "wait", ms: 700 },
  { t: "type", text: "refactor this function to async/await", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "↯ [fast+low]  Refactoring…", tone: "green" },
    { text: "✓ Done in 0.8 s", tone: "green" },
  ], gap: 60 },
  { t: "wait", ms: 1400 },
  { t: "clear" },
];

const skillsScript: Step[] = [
  { t: "print", text: "# Bundled skills demo", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/code-review high --comment", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "Running multi-agent review (high effort)…", tone: "muted" },
    { text: "CRITICAL  src/auth/session.ts:42  service_role key exposed client-side", tone: "error" },
    { text: "HIGH      src/api/users.ts:17     no error handling on DELETE endpoint", tone: "amber" },
    { text: "MEDIUM    src/components/Form.tsx:88  missing loading state", tone: "blue" },
    { text: "✓ Findings posted as inline comments on PR #24", tone: "green" },
  ], gap: 80 },
  { t: "wait", ms: 700 },
  { t: "type", text: "/batch add JSDoc to all public functions in src/", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "Planning batch operation across 18 files…", tone: "muted" },
    { text: "Using isolated git worktrees. Press Ctrl+B to background.", tone: "muted" },
    { text: "Progress: [████████░░░░░░░░]  8/18 files", tone: "blue" },
  ], gap: 80 },
  { t: "wait", ms: 1200 },
  { t: "clear" },
];

const shortcutsScript: Step[] = [
  { t: "print", text: "# Keyboard shortcuts in action", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "print", text: "  Shift+Tab   →  cycle permission mode", tone: "muted" },
  { t: "print", text: "  Option+T    →  toggle extended thinking", tone: "muted" },
  { t: "print", text: "  Ctrl+O      →  verbose (show tool calls)", tone: "muted" },
  { t: "print", text: "  Ctrl+R      →  reverse search history", tone: "muted" },
  { t: "print", text: "  Ctrl+B      →  background running agent", tone: "muted" },
  { t: "print", text: "  Ctrl+U      →  clear input buffer", tone: "muted" },
  { t: "print", text: "  Ctrl+Y      →  restore cleared input", tone: "muted" },
  { t: "wait", ms: 600 },
  { t: "type", text: "/effort high", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "Effort set to: high  (deep reasoning enabled)", tone: "blue" },
  ], gap: 60 },
  { t: "wait", ms: 600 },
  { t: "type", text: "/btw what's the difference between async and defer on script tags?", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "[side question — not added to context]", tone: "system" },
    { text: "async: download + execute immediately, blocks parsing at exec time.", tone: "default" },
    { text: "defer: download in parallel, execute after parsing completes.", tone: "default" },
  ], gap: 70 },
  { t: "wait", ms: 1200 },
  { t: "clear" },
];

/* ── Quiz ─────────────────────────────────────────────────────────── */

const quizQuestions: QuizQuestion[] = [
  {
    q: "Which command compresses the conversation history while letting you preserve a specific focus?",
    options: ["/context", "/compact focus on …", "/rewind", "/clear"],
    answer: 1,
    explanation: "/compact reduces token usage while keeping the most relevant context. You can pass a focus hint like '/compact focus on the database migration plan' so Claude knows what to preserve.",
  },
  {
    q: "What does enabling fast mode do?",
    options: [
      "Lowers response quality to save tokens",
      "Switches to a smaller, cheaper model",
      "Delivers Opus quality up to 2.5× faster at a higher per-token cost",
      "Disables extended thinking permanently",
    ],
    answer: 2,
    explanation: "Fast mode is a high-speed API configuration for Opus. It keeps the same model quality but responds faster — at a higher per-token cost. It doesn't change the model, just its serving configuration.",
  },
  {
    q: "What keyboard shortcut asks a side question without adding it to conversation history?",
    options: ["Ctrl+Q", "/btw", "Ctrl+B", "Shift+Tab"],
    answer: 1,
    explanation: "/btw your question asks a side question outside the main context window — useful for quick syntax checks or one-off facts that would otherwise clutter the conversation.",
  },
  {
    q: "How does /code-review differ from /simplify as of v2.1.154?",
    options: [
      "They are identical aliases for the same command",
      "/code-review edits files; /simplify only reports",
      "/code-review reports findings without editing; /simplify applies cleanup fixes",
      "/simplify was removed in v2.1.154",
    ],
    answer: 2,
    explanation: "As of v2.1.154, /code-review reviews the diff and reports findings without editing files. /simplify runs a separate cleanup-only review that applies fixes — it is no longer a simple alias.",
  },
];

/* ── Component ────────────────────────────────────────────────────── */

export default function Content() {
  return (
    <Prose>
      {/* ── Intro ── */}
      <Reveal delay={0}>
        <p>
          You&apos;ve seen the basic slash commands. This module covers the commands that
          experienced Claude Code users reach for once the initial workflow is working —
          context management, session tools, the bundled skills, and keyboard shortcuts
          that speed everything up.
        </p>
      </Reveal>

      {/* ── Context & Session Management ── */}
      <Reveal delay={70}>
        <h2>Context and Session Management</h2>
        <p>
          Every Claude Code session has a context window. <code>/context</code> visualizes it
          as a colored grid — green for available, yellow for getting full, red for nearly
          exhausted. When context gets long, <code>/compact</code> compresses the conversation.
          Pass focus instructions to preserve what matters:
        </p>
        <CodeBlock
          filename="session-management.sh"
          lang="bash"
          code={`/compact focus on the auth refactor`}
        />
        <p>
          <code>/branch</code> creates a parallel conversation from the current point, letting
          you explore two approaches side by side. <code>/rewind</code> rolls back to an earlier
          point — useful when Claude went down the wrong path. It optionally reverts file changes
          too, functioning as an undo for both conversation and code.
        </p>
        <p>
          Session resumption makes long work possible. <code>/rename my-feature</code> saves the
          current session with a readable name. <code>/resume my-feature</code> picks it back up
          later with full context intact. Export a session to a file or clipboard with{" "}
          <code>/export</code> for sharing or archiving.
        </p>
        <CodeBlock
          filename="session-commands.sh"
          lang="bash"
          code={`/context
/compact focus on the auth refactor
/branch
/rename auth-refactor-v2
/export auth-refactor-v2.md`}
        />
      </Reveal>

      <Reveal delay={140}>
        <Terminal
          script={contextScript}
          title="Session Management"
          loop
          showStatus
        />
      </Reveal>

      {/* ── Bundled Skills ── */}
      <Reveal delay={0}>
        <h2>Bundled Skills</h2>
        <p>
          Claude Code ships with built-in skills that work like commands. These are always
          available without installation.
        </p>
        <p>
          <code>/code-review</code> (renamed from <code>/simplify</code> in v2.1.147) reviews
          the current diff for correctness bugs and reports findings without editing files. Lower
          effort levels (<code>/code-review low</code>) return fewer high-confidence findings;{" "}
          <code>high</code> through <code>max</code> give broader coverage, and{" "}
          <code>/code-review ultra</code> runs a deeper multi-agent review in the cloud. As of
          v2.1.154, <code>/simplify</code> runs a separate cleanup-only review that applies fixes
          without hunting for bugs — it is no longer a simple alias for <code>/code-review</code>.
          Pass <code>--comment</code> to post findings as inline comments on the current GitHub PR,
          or pass a path or PR reference to target a specific change.
        </p>
        <p>
          <code>/batch &lt;instruction&gt;</code> is for large-scale changes across many files —
          it plans the work, uses isolated git worktrees, and can coordinate verification and
          PR-oriented follow-up. <code>/loop 5m check deploy status</code> runs a prompt
          repeatedly on an interval, useful for polling long-running operations.{" "}
          <code>/proactive</code> is an alias for <code>/loop</code> — same behaviour, often more
          readable when the goal is &quot;keep watching and act on what you see&quot; rather than
          &quot;run this on a timer&quot;. The word <code>ultracode</code> triggers a dynamic
          workflow run — the trigger keyword was renamed from <code>workflow</code> to{" "}
          <code>ultracode</code> in v2.1.160.
        </p>
        <p>
          <code>/debug</code> enables verbose logging to help diagnose issues with Claude&apos;s
          behavior or tool use. <code>/claude-api</code> loads the Anthropic SDK reference for
          the project&apos;s language — it activates automatically when it detects imports from{" "}
          <code>@anthropic-ai/sdk</code> or the Python <code>anthropic</code> package.
        </p>
        <CodeBlock
          filename="bundled-skills.sh"
          lang="bash"
          code={`/code-review
/code-review high --comment
/batch add JSDoc comments to all public functions in src/
/loop 2m check if the build finished
/debug`}
        />
      </Reveal>

      <Reveal delay={70}>
        <Terminal
          script={skillsScript}
          title="Bundled Skills"
          loop
          showStatus
        />
      </Reveal>

      {/* ── Fast Mode ── */}
      <Reveal delay={0}>
        <h2>Fast Mode</h2>
        <p>
          Fast mode is a high-speed API configuration for Opus that delivers the same model
          quality with up to 2.5× faster responses at a higher per-token cost. It supports
          Opus 4.8 (the default since v2.1.154), Opus 4.7, and Opus 4.6 — but fast mode on
          Opus 4.6 is deprecated and will be removed about 30 days after the Opus 4.8 launch.
          Available via <code>/fast</code> or by setting <code>fastMode: true</code> in user
          settings. When enabled, a <code>↯</code> icon appears next to the prompt bar.
        </p>
        <CodeBlock
          filename="fast-mode.sh"
          lang="bash"
          code={`/fast          # toggle on/off
/fast on       # explicitly enable
/fast off      # explicitly disable`}
        />
        <p>
          Fast mode switches you to Opus automatically if you&apos;re on a different model —
          Opus 4.8 by default. When you turn fast mode off, you stay on Opus — use{" "}
          <code>/model</code> to switch.
        </p>
        <p>
          If you&apos;re using a custom LLM gateway, set{" "}
          <code>CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1</code> to populate the{" "}
          <code>/model</code> picker from your gateway&apos;s <code>/v1/models</code> endpoint
          automatically.
        </p>
      </Reveal>

      <Reveal delay={70}>
        <Callout tone="info" title="Fast mode vs effort level">
          Fast mode and effort level are separate speed levers. <code>/fast</code> reduces
          latency without changing quality. <code>/effort low</code> reduces thinking time,
          which may lower quality on complex tasks. Combine both for maximum speed on
          straightforward work:
          <CodeBlock
            filename="speed-combo.sh"
            lang="bash"
            code={`/fast
/effort low`}
          />
        </Callout>
      </Reveal>

      <Reveal delay={140}>
        <Terminal
          script={fastModeScript}
          title="Fast Mode + Effort"
          loop
          showStatus
        />
      </Reveal>

      <Reveal delay={0}>
        <p>
          When the fast mode rate limit is hit, it automatically falls back to standard Opus
          speed (the <code>↯</code> icon turns gray) and re-enables when the cooldown expires.
          The fast mode rate-limit pool is shared across Opus 4.8, 4.7, and 4.6. Fast mode
          requires usage credits to be enabled on your account — manage them with{" "}
          <code>/usage-credits</code> (renamed from <code>/extra-usage</code> in v2.1.144; the
          old name still works) — and is not available on Bedrock, Vertex AI, Foundry, or Claude
          Platform on AWS, nor in the VS Code extension. Enterprise admins can control
          availability through managed settings.
        </p>
      </Reveal>

      {/* ── Keyboard Shortcuts ── */}
      <Reveal delay={0}>
        <h2>Keyboard Shortcuts and Power Features</h2>
        <p>
          <Kbd>Shift+Tab</Kbd> cycles through permission modes. The order is{" "}
          <code>default</code>, <code>acceptEdits</code>, <code>plan</code>, and then optional
          modes like <code>auto</code> or <code>bypassPermissions</code> if they are enabled in
          your environment. This is the fastest way to switch to plan mode for a complex task
          and back afterward.
        </p>
        <p>
          <Kbd>Option+T</Kbd> (macOS) or <Kbd>Alt+T</Kbd> toggles extended thinking — Claude
          spends more time reasoning before responding. Use <code>/effort</code> to set reasoning
          depth: <code>auto</code>, <code>low</code>, <code>medium</code>, <code>high</code>,{" "}
          <code>xhigh</code>, or <code>max</code> where supported. <code>max</code> applies to
          the current session only. <Kbd>Ctrl+O</Kbd> enters verbose mode to see tool calls and
          thinking steps as they happen.
        </p>
        <p>
          <code>/btw your question</code> asks a side question without adding it to the
          conversation history — useful for checking a fact or asking about syntax without
          cluttering the context. <Kbd>Ctrl+B</Kbd> backgrounds running bash commands and agents
          so you can give Claude another instruction while they continue working. If you need to
          kill all background agents, the official shortcut is <Kbd>Ctrl+X Ctrl+K</Kbd>.
        </p>
        <p>
          <Kbd>Ctrl+U</Kbd> clears the entire input buffer, and <Kbd>Ctrl+Y</Kbd> restores what
          you just cleared — handy when you&apos;ve typed a long prompt and want to start over
          without losing it. <Kbd>Ctrl+L</Kbd> forces a full screen redraw in addition to
          clearing the prompt input, useful when terminal output tears or drifts. In the
          transcript viewer footer, <Kbd>[</Kbd> dumps the transcript to scrollback and{" "}
          <Kbd>v</Kbd> opens it in your <code>$EDITOR</code>.
        </p>
        <p>
          The <code>/diff</code> command opens an interactive diff viewer for uncommitted changes —
          better than reading raw git output when you want to review what Claude has done before
          committing. <code>/insights</code> generates a session analysis report with statistics
          on what was accomplished.
        </p>
        <CodeBlock
          filename="shortcuts-demo.sh"
          lang="bash"
          code={`# Toggle to plan mode, then back
Shift+Tab
Shift+Tab

/effort high
/btw what's the difference between async and defer on script tags?`}
        />
      </Reveal>

      <Reveal delay={70}>
        <Terminal
          script={shortcutsScript}
          title="Keyboard Shortcuts"
          loop
          showStatus
        />
      </Reveal>

      {/* ── Vim Visual Mode ── */}
      <Reveal delay={0}>
        <h2>Vim Visual Mode</h2>
        <p>
          Vim users get visual selection in the input editor. Press <Kbd>v</Kbd> for
          character-wise selection and <Kbd>V</Kbd> for line-wise selection. Once in visual mode,
          navigation keys (<Kbd>h</Kbd> <Kbd>j</Kbd> <Kbd>k</Kbd> <Kbd>l</Kbd> <Kbd>w</Kbd>{" "}
          <Kbd>e</Kbd> <Kbd>b</Kbd> <Kbd>f</Kbd> <Kbd>F</Kbd> <Kbd>t</Kbd> <Kbd>T</Kbd>) extend
          the selection. Then apply an operator:
        </p>
        <p>
          <Kbd>d</Kbd>/<Kbd>x</Kbd> deletes, <Kbd>y</Kbd> yanks, <Kbd>c</Kbd>/<Kbd>s</Kbd>{" "}
          changes, <Kbd>p</Kbd> replaces with register contents, <Kbd>r{"{char}"}</Kbd> replaces
          every selected character, <Kbd>~</Kbd>/<Kbd>u</Kbd>/<Kbd>U</Kbd> toggles or forces
          case, <Kbd>{">"}</Kbd>/<Kbd>{"<"}</Kbd> indents or dedents, <Kbd>J</Kbd> joins lines,
          and <Kbd>o</Kbd> swaps the cursor and anchor. Text objects like <Kbd>iw</Kbd>,{" "}
          <Kbd>aw</Kbd>, <Kbd>i&quot;</Kbd>, <Kbd>a&quot;</Kbd>, <Kbd>i(</Kbd>, <Kbd>a(</Kbd>{" "}
          work for precise selections. Block-wise visual mode (<Kbd>Ctrl+V</Kbd>) is not
          supported.
        </p>
      </Reveal>

      {/* ── Partial View ── */}
      <Reveal delay={0}>
        <h2>Reading Huge Files — Partial View</h2>
        <p>
          The Read tool now returns a truncated first page with a <code>PARTIAL view</code>{" "}
          notice instead of a hard error when a whole-file read would exceed the token limit.
          Before, asking Claude to read a 500 KB JSON dump or a generated bundle would fail
          outright; now it gets the first page plus a clear marker that more content exists, and
          can call Read again with <code>offset</code>/<code>limit</code> to page through the
          rest. The token budget for any single read is governed by{" "}
          <code>CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS</code> — raise it for sessions that
          legitimately need bigger reads, lower it for tight environments.
        </p>
        <Callout tone="tip" title="You don't need to do anything">
          When Claude sees the partial-view notice, it knows to either narrow with{" "}
          <code>grep</code> first or paginate with <code>offset</code> until it has what it
          needs. The behavior matters most for migrations, large logs, and tooling like{" "}
          <code>/init</code> that scans many files.
        </Callout>
      </Reveal>

      {/* ── /usage ── */}
      <Reveal delay={0}>
        <h2>/usage — Unified Session Statistics</h2>
        <p>
          The <code>/usage</code> command shows a unified dashboard that supersedes what{" "}
          <code>/cost</code> and <code>/stats</code> used to show separately — total cost
          estimate, API and wall-clock duration, and lines added or removed. As of v2.1.149, it
          also includes per-category breakdowns showing what&apos;s driving your limits: skills,
          subagents, plugins, and per-MCP-server cost. For API users it includes detailed token
          statistics; for subscribers it shows plan usage bars and activity. Both{" "}
          <code>/cost</code> and <code>/stats</code> still work as shortcuts that open the
          relevant tab. Dollar figures are locally computed estimates — check the Claude Console
          for authoritative billing.
        </p>
      </Reveal>

      {/* ── /goal ── */}
      <Reveal delay={0}>
        <h2>/goal — Goal-Directed Sessions</h2>
        <p>
          The <code>/goal</code> command sets a completion condition that Claude works toward
          across multiple turns. Once a goal is active, Claude keeps working autonomously until
          the condition is satisfied. A live overlay shows elapsed time, turn count, and token
          usage so you can monitor progress without interrupting.
        </p>
        <CodeBlock
          filename="goal-examples.sh"
          lang="bash"
          code={`/goal migrate all API endpoints from REST to GraphQL
/goal all tests pass and coverage is above 80%`}
        />
        <p>
          Goals pair well with <code>/effort high</code> for complex multi-step tasks. To cap
          how many turns Claude will take, set <code>CLAUDE_CODE_MAX_TURNS</code> as an
          environment variable:
        </p>
        <CodeBlock
          filename="max-turns.sh"
          lang="bash"
          code={`export CLAUDE_CODE_MAX_TURNS=50`}
        />
      </Reveal>

      {/* ── Session Recap ── */}
      <Reveal delay={0}>
        <h2>Session Recap</h2>
        <p>
          When you return to the terminal after stepping away, Claude Code shows a one-line recap
          of what happened while you were gone. The recap generates in the background once at
          least three minutes have passed since the last completed turn and the terminal is
          unfocused, so it&apos;s ready when you switch back. Recaps only appear once the session
          has at least three turns, and never twice in a row.
        </p>
        <p>
          Run <code>/recap</code> to generate a summary on demand. To turn automatic recaps off,
          open <code>/config</code> and disable <strong>Session recap</strong>. Session recap is
          on by default for every plan and provider. It&apos;s always skipped in non-interactive
          mode.
        </p>
      </Reveal>

      {/* ── Command History ── */}
      <Reveal delay={0}>
        <h2>Command History and Reverse Search</h2>
        <p>
          Claude Code maintains input history per working directory. Submitting the same prompt
          twice in a row records one entry, so pressing <Kbd>↑</Kbd> steps to the previous
          distinct prompt. History resets when you run <code>/clear</code>, though the previous
          session&apos;s conversation is preserved for <code>/resume</code>.
        </p>
        <p>
          Press <Kbd>Ctrl+R</Kbd> to interactively search through your command history. Type a
          query to search and press <Kbd>Ctrl+R</Kbd> again to cycle through older matches.
          Search defaults to prompts from all projects — press <Kbd>Ctrl+S</Kbd> to cycle the
          scope through the current session, the current project, and all projects. Press{" "}
          <Kbd>Tab</Kbd> or <Kbd>Esc</Kbd> to accept the match and keep editing, <Kbd>Enter</Kbd>{" "}
          to accept and execute immediately, or <Kbd>Ctrl+C</Kbd> to cancel.
        </p>
        <CodeBlock
          filename="history-search.sh"
          lang="bash"
          code={`Ctrl+R → type "migration" → Ctrl+R (older matches) → Tab (accept)`}
        />
      </Reveal>

      {/* ── Custom Themes ── */}
      <Reveal delay={0}>
        <h2>Custom Themes</h2>
        <p>
          The <code>/theme</code> command lets you create and switch between named color themes.
          Themes are stored as JSON files in <code>~/.claude/themes/</code> and can be
          hand-edited. Plugins can also ship themes via a <code>themes/</code> directory in the
          plugin bundle.
        </p>
      </Reveal>

      {/* ── Output Styles ── */}
      <Reveal delay={0}>
        <h2>Output Styles</h2>
        <p>
          Output styles change how Claude responds without changing what it knows. They modify
          the system prompt to set role, tone, and format. Four built-in styles are available:
        </p>
        <ul>
          <li>
            <strong>Default</strong> — standard software engineering assistant.
          </li>
          <li>
            <strong>Proactive</strong> — executes immediately, makes reasonable assumptions
            instead of pausing. Stronger autonomous guidance than auto mode, works independently
            of permission mode.
          </li>
          <li>
            <strong>Explanatory</strong> — adds educational &quot;Insights&quot; between coding
            steps.
          </li>
          <li>
            <strong>Learning</strong> — collaborative mode where Claude marks strategic pieces
            with <code>TODO(human)</code> for you to implement.
          </li>
        </ul>
        <p>
          Switch styles via <code>/config</code> → <strong>Output style</strong>. The selection
          is saved to <code>.claude/settings.local.json</code>. Changes take effect after{" "}
          <code>/clear</code> or a new session because output style is part of the system prompt.
        </p>
        <p>
          Custom output styles are Markdown files with frontmatter. Save them in{" "}
          <code>~/.claude/output-styles/</code> (user), <code>.claude/output-styles/</code>{" "}
          (project), or the managed settings directory (policy). The file name becomes the style
          name unless you set <code>name:</code> in the frontmatter. Set{" "}
          <code>keep-coding-instructions: true</code> to retain Claude Code&apos;s built-in
          software engineering instructions alongside your custom ones — leave it out when Claude
          isn&apos;t doing software engineering at all, like a writing assistant or data analyst:
        </p>
        <CodeBlock
          filename="output-style.md"
          lang="markdown"
          code={`---
name: Diagrams first
description: Lead every explanation with a diagram
keep-coding-instructions: true
---

When explaining code, architecture, or data flow, start with a Mermaid diagram showing the structure, then explain in prose.`}
        />
        <Callout tone="note" title="Plugin output styles">
          Plugins can ship output styles in an <code>output-styles/</code> directory, and plugin
          styles can set <code>force-for-plugin: true</code> to apply automatically when the
          plugin is enabled.
        </Callout>
      </Reveal>

      {/* ── Quiz ── */}
      <Reveal delay={0}>
        <Quiz questions={quizQuestions} title="Commands in Depth — Quick Check" />
      </Reveal>
    </Prose>
  );
}
