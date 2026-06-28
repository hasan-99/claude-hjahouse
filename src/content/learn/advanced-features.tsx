import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Quiz, Prose, type QuizQuestion } from "@/components/content";

/* ---- Terminal demo scripts ---- */

const headlessScript: Step[] = [
  { t: "print", text: "# Non-interactive code review via claude -p", tone: "muted" },
  { t: "wait", ms: 400 },
  {
    t: "type",
    text: 'git diff HEAD~1 | claude -p "review for security issues" --output-format json --permission-mode bypassPermissions',
    tone: "user",
    prompt: "$",
  },
  { t: "wait", ms: 700 },
  {
    t: "out",
    lines: [
      { text: '{"findings":[', tone: "green" },
      { text: '  {"severity":"HIGH","file":"auth.ts","line":42,', tone: "green" },
      { text: '   "message":"User input passed to eval() without sanitization"},', tone: "green" },
      { text: '  {"severity":"LOW","file":"utils.ts","line":17,', tone: "green" },
      { text: '   "message":"console.log left in production code"}', tone: "green" },
      { text: "]}",  tone: "green" },
    ],
    gap: 55,
  },
  { t: "wait", ms: 800 },
  {
    t: "type",
    text: 'claude -p "generate JSDoc for all functions in $CHANGED_FILE" --print --no-session-persistence',
    tone: "user",
    prompt: "$",
  },
  { t: "wait", ms: 600 },
  { t: "out", lines: [{ text: "✓ JSDoc written to src/utils.ts", tone: "green" }] },
];

const sandboxScript: Step[] = [
  { t: "print", text: "# Enable sandbox, then run headless analysis", tone: "muted" },
  { t: "wait", ms: 400 },
  {
    t: "type",
    text: 'claude -p "analyze the security of this codebase" --sandbox --permission-mode plan --output-format json',
    tone: "user",
    prompt: "$",
  },
  { t: "wait", ms: 700 },
  { t: "out", lines: [
    { text: "◆ sandbox enabled — OS-level isolation active", tone: "amber" },
    { text: "◆ network: github.com, *.npmjs.org  (uploads.github.com denied)", tone: "amber" },
    { t: "out", lines: [] } as never,
  ]},
  { t: "out", lines: [
    { text: "Planning…", tone: "muted" },
    { text: "  [1/4] Scanning dependency tree", tone: "blue" },
    { text: "  [2/4] Checking for known CVEs", tone: "blue" },
    { text: "  [3/4] Auditing auth surface", tone: "blue" },
    { text: "  [4/4] Writing report", tone: "blue" },
    { text: '{"summary":"3 high, 1 critical issue found"}', tone: "green" },
  ], gap: 90 },
];

const autoModeScript: Step[] = [
  { t: "print", text: "# Inspect and tune Auto Mode rules", tone: "muted" },
  { t: "wait", ms: 400 },
  { t: "type", text: "claude auto-mode defaults", tone: "user", prompt: "$" },
  { t: "wait", ms: 600 },
  {
    t: "out",
    lines: [
      { text: "Built-in hard_deny rules:", tone: "amber" },
      { text: "  • Never exfiltrate repo contents to 3rd-party APIs", tone: "default" },
      { text: "  • Never push to production branches without approval", tone: "default" },
      { text: "Built-in soft_deny rules:", tone: "amber" },
      { text: "  • Caution on force-push, DB drops, mass deletes", tone: "default" },
    ],
    gap: 65,
  },
  { t: "wait", ms: 500 },
  { t: "type", text: "claude auto-mode config", tone: "user", prompt: "$" },
  { t: "wait", ms: 500 },
  {
    t: "out",
    lines: [
      { text: "Effective merged config:", tone: "blue" },
      { text: '  allow:    ["$defaults", "Deploying to staging is allowed"]', tone: "green" },
      { text: '  soft_deny:["$defaults", "Never run migrations outside CLI"]', tone: "green" },
      { text: '  hard_deny:["$defaults", "Never send repo to 3rd-party APIs"]', tone: "green" },
    ],
    gap: 65,
  },
];

const purgeScript: Step[] = [
  { t: "print", text: "# Preview then purge project state", tone: "muted" },
  { t: "wait", ms: 400 },
  { t: "type", text: "claude project purge --dry-run", tone: "user", prompt: "$" },
  { t: "wait", ms: 600 },
  {
    t: "out",
    lines: [
      { text: "Would delete:", tone: "amber" },
      { text: "  ~/.claude/projects/my-app/transcripts/  (47 files)", tone: "default" },
      { text: "  ~/.claude/projects/my-app/tasks.json", tone: "default" },
      { text: "  ~/.claude/projects/my-app/history.db", tone: "default" },
    ],
    gap: 65,
  },
  { t: "wait", ms: 500 },
  { t: "type", text: "claude project purge --yes", tone: "user", prompt: "$" },
  { t: "wait", ms: 500 },
  { t: "out", lines: [{ text: "✓ Project state purged.", tone: "green" }] },
];

/* ---- Quiz ---- */
const questions: QuizQuestion[] = [
  {
    q: "Which flag starts Claude Code non-interactively and pipes output to stdout?",
    options: [
      "--headless",
      "-p / --print",
      "--non-interactive",
      "--batch",
    ],
    answer: 1,
    explanation:
      'claude -p "prompt" (short for --print) runs non-interactively, sending all output to stdout so it can be composed in shell pipelines or CI scripts.',
  },
  {
    q: "In Auto Mode, which rule tier blocks tool calls unconditionally — even when the user explicitly asks?",
    options: ["allow", "soft_deny", "hard_deny", "environment"],
    answer: 2,
    explanation:
      "hard_deny rules are unconditional: neither user intent nor allow exceptions can override them. soft_deny can be overridden by explicit user intent or allow rules.",
  },
  {
    q: "What does including \"$defaults\" in an autoMode array do?",
    options: [
      "Resets the array to factory defaults",
      "Keeps built-in rules AND appends your custom ones",
      "Disables all built-in rules for that tier",
      "Routes the array to managed settings only",
    ],
    answer: 1,
    explanation:
      'Without "$defaults", your array replaces the built-ins entirely. Including "$defaults" merges them, so your custom rules sit alongside the existing safety rules.',
  },
  {
    q: "Which setting controls how long session files are retained before being auto-deleted at startup?",
    options: [
      "sessionRetentionDays",
      "transcriptTTL",
      "cleanupPeriodDays",
      "sessionMaxAge",
    ],
    answer: 2,
    explanation:
      "cleanupPeriodDays in settings.json sets the retention window (default 30, minimum 1). It also controls automatic removal of orphaned subagent worktrees at startup.",
  },
];

/* ============================================================ */
export default function Content() {
  return (
    <Prose>
      {/* Intro */}
      <Reveal delay={0}>
        <p>
          Claude Code has a set of power features that experienced users reach for on complex or
          risky work. Planning mode, extended thinking, auto mode, sandboxing, and headless
          operation all change how Claude works in fundamental ways. This module covers each one
          in depth.
        </p>
      </Reveal>

      {/* ── Planning Mode ── */}
      <Reveal delay={70}>
        <h2>Planning Mode and Extended Thinking</h2>
      </Reveal>
      <Reveal delay={140}>
        <p>
          Planning mode separates thinking from doing. When you activate it, Claude first
          researches the codebase and creates a detailed implementation plan. You review and
          optionally modify the plan, then Claude executes it. This prevents the common failure
          mode of Claude starting to code before fully understanding the problem.
        </p>
        <p>
          Activate it with <code>/plan &lt;description&gt;</code>, the{" "}
          <code>--permission-mode plan</code> CLI flag, or <kbd>Shift+Tab</kbd> to cycle
          permission modes. Use <kbd>Ctrl+G</kbd> to open the current plan in your external editor
          for detailed modifications before approving. The <code>opusplan</code> model alias routes
          planning to Opus and execution to Sonnet:
        </p>
      </Reveal>
      <Reveal delay={210}>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`claude --model opusplan "redesign the database schema for multi-tenancy"`}
        />
      </Reveal>
      <Reveal delay={280}>
        <p>
          Extended thinking gives Claude more time to reason before responding. Toggle it with{" "}
          <kbd>Option+T</kbd> (macOS) or <kbd>Alt+T</kbd>. The <code>/effort</code> command sets
          reasoning depth: <code>low</code>, <code>medium</code>, <code>high</code>,{" "}
          <code>xhigh</code>, or <code>max</code> (session-only). Set it per-session with:
        </p>
      </Reveal>
      <Reveal delay={350}>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`export CLAUDE_CODE_EFFORT_LEVEL=high`}
        />
      </Reveal>
      <Reveal delay={420}>
        <p>
          For prompts where you need maximum reasoning, include the word <strong>ultrathink</strong>{" "}
          — it activates deep reasoning mode regardless of the effort setting. The word{" "}
          <strong>ultracode</strong> triggers a dynamic workflow run (renamed from{" "}
          <code>workflow</code> in v2.1.160). <code>MAX_THINKING_TOKENS=0</code> disables thinking
          on Opus 4.6 and Sonnet 4.6 only; on Opus 4.7 and later, adaptive reasoning is always
          used and the variable is a no-op.
        </p>
        <p>
          The combination of plan mode plus high effort is powerful for complex architectural
          decisions:
        </p>
      </Reveal>
      <Reveal delay={490}>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`claude --permission-mode plan --effort high --model opusplan "migrate from REST to GraphQL"`}
        />
      </Reveal>

      {/* ── Ultraplan ── */}
      <Reveal delay={0}>
        <h2>Ultraplan: Cloud-Powered Planning</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          Ultraplan extends planning mode by handing the plan to a Claude Code web session. Claude
          drafts the plan in the cloud while your terminal stays free. You then open it in your
          browser to comment on specific sections, request revisions, and choose where to execute.
        </p>
        <p>
          Three ways to launch it: the <code>/ultraplan &lt;prompt&gt;</code> command, including
          the word <strong>ultraplan</strong> in a normal prompt, or choosing &ldquo;Refine with
          Ultraplan on the web&rdquo; from a finished local plan dialog.
        </p>
        <p>
          After launch, a status badge appears at your prompt: <code>◇ ultraplan</code> while
          drafting, <code>◇ ultraplan needs your input</code> when Claude has questions, and{" "}
          <code>◆ ultraplan ready</code> when the plan is ready for review. Open the session link
          on claude.ai to review — you can leave inline comments, add emoji reactions, and ask for
          revisions before approving.
        </p>
      </Reveal>
      <Reveal delay={140}>
        <p>When you approve, two execution paths:</p>
        <ul>
          <li>
            <strong>Execute on the web</strong> — Claude implements the plan in the cloud, and you
            review the diff and open a PR from the browser.
          </li>
          <li>
            <strong>Send back to terminal</strong> — the plan teleports to your CLI for local
            implementation with full access to your environment.
          </li>
        </ul>
      </Reveal>
      <Reveal delay={210}>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`/ultraplan migrate the auth service from sessions to JWTs`}
        />
        <Callout tone="warn" title="Subscription required">
          Ultraplan requires a claude.ai subscription and a connected GitHub repository. It is not
          available on Bedrock, Vertex AI, or Foundry.
        </Callout>
      </Reveal>

      {/* ── Auto Mode ── */}
      <Reveal delay={0}>
        <h2>Auto Mode and Permission Control</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          Auto Mode is a research-preview permission mode that uses a background safety classifier
          to decide whether tool calls are safe to run without prompting. It is designed for
          higher-autonomy workflows where you still want guardrails around risky actions.
        </p>
        <p>
          Use it the same way as other permission modes: select <code>auto</code> in your
          permission settings or cycle to it with <kbd>Shift+Tab</kbd> when available. When a
          permission check stalls, the spinner turns red — making it clear a check is in progress
          rather than a tool running.
        </p>
      </Reveal>
      <Reveal delay={140}>
        <h3>Classifier precedence (four tiers)</h3>
        <ul>
          <li>
            <strong>hard_deny</strong> — blocks unconditionally; user intent and allow exceptions
            do not apply.
          </li>
          <li>
            <strong>soft_deny</strong> — blocks next, but user intent and allow exceptions can
            override.
          </li>
          <li>
            <strong>allow</strong> — overrides matching soft_deny rules.
          </li>
          <li>
            <strong>Explicit user intent</strong> — overrides remaining soft blocks (a vague
            &ldquo;clean up the repo&rdquo; does not qualify; &ldquo;force-push this branch&rdquo;
            does).
          </li>
        </ul>
        <p>
          If the classifier blocks an action 3 times in a row or 20 times total, auto mode pauses
          and Claude Code resumes prompting. These thresholds are not configurable.
        </p>
      </Reveal>
      <Reveal delay={210}>
        <p>
          Always include <code>&quot;$defaults&quot;</code> in your custom arrays to keep the
          built-in rules alongside your additions. Without it, your array replaces the defaults
          entirely:
        </p>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "autoMode": {
    "allow":      ["$defaults", "Deploying to staging is allowed"],
    "soft_deny":  ["$defaults", "Never run migrations outside the migrations CLI"],
    "hard_deny":  ["$defaults", "Never send repo contents to third-party APIs"],
    "environment":["$defaults", "Internal API: api.corp.example.com"]
  }
}`}
        />
      </Reveal>
      <Reveal delay={280}>
        <h3>Permission mode spectrum</h3>
        <p>
          Permission modes span a spectrum. <code>default</code> reads freely but prompts for
          write actions. <code>acceptEdits</code> auto-approves file edits for the session.{" "}
          <code>plan</code> switches to planning-first research mode. <code>auto</code> uses the
          classifier. <code>dontAsk</code> only runs pre-approved tools. <code>bypassPermissions</code>{" "}
          skips most prompts (including protected paths as of v2.1.126). The{" "}
          <code>--dangerously-skip-permissions</code> flag is a shorthand for{" "}
          <code>--permission-mode bypassPermissions</code>.
        </p>
      </Reveal>
      <Reveal delay={350}>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`# Start a session in a specific mode
claude --permission-mode plan "draft the migration"
claude -p "audit dependencies" --permission-mode dontAsk

# Set a default so most sessions start in acceptEdits
# settings.json:
# { "permissions": { "defaultMode": "acceptEdits" } }`}
        />
      </Reveal>
      <Reveal delay={420}>
        <p>Auto Mode availability by platform:</p>
        <ul>
          <li>
            <strong>Anthropic API</strong> — available by default once your account meets model and
            admin requirements.
          </li>
          <li>
            <strong>Bedrock / Vertex AI / Foundry (v2.1.158+)</strong> — gated behind{" "}
            <code>CLAUDE_CODE_ENABLE_AUTO_MODE=1</code>; only Opus 4.7 and Opus 4.8 are supported.
          </li>
          <li>
            <strong>Older models</strong> — Sonnet 4.5, Opus 4.5, Haiku, and Claude 3 never get
            Auto Mode on any provider.
          </li>
        </ul>
        <p>
          Administrators can lock the mode off entirely with{" "}
          <code>permissions.disableAutoMode: &quot;disable&quot;</code> in managed settings.
        </p>
      </Reveal>
      <Reveal delay={490}>
        <Terminal
          script={autoModeScript}
          title="Auto Mode inspection"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      {/* ── Programmatic & Sandbox ── */}
      <Reveal delay={0}>
        <h2>Programmatic and Sandboxed Operation</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          Running Claude Code programmatically with <code>claude -p &quot;your prompt&quot;</code>{" "}
          executes it non-interactively. Output goes to stdout, making it composable with shell
          pipelines and automation systems. Combine it with{" "}
          <code>--output-format json</code> for structured output. Use{" "}
          <code>--permission-mode bypassPermissions</code> for fully automated CI/CD use. Hooks
          running in these sessions can read the active effort level via the{" "}
          <code>$CLAUDE_EFFORT</code> environment variable.
        </p>
        <p>
          <code>/cd &lt;directory&gt;</code> moves a session to a new working directory without
          breaking the prompt cache mid-session.
        </p>
      </Reveal>
      <Reveal delay={140}>
        <Terminal
          script={headlessScript}
          title="Headless / CI usage"
          loop={false}
          showStatus={true}
        />
      </Reveal>
      <Reveal delay={210}>
        <h3>Sandboxing</h3>
        <p>
          Sandboxing provides OS-level isolation for file system and network access. Available on
          macOS, Linux, and WSL2 — native Windows is not supported. Enable it with{" "}
          <code>/sandbox</code> in-session. In sandbox mode, Claude can only access approved paths
          and network rules you configure.
        </p>
        <p>
          Fine-tune network isolation with <code>sandbox.network.allowedDomains</code> and{" "}
          <code>sandbox.network.deniedDomains</code>. <code>deniedDomains</code> always takes
          precedence — even when a wildcard in <code>allowedDomains</code> would permit the domain.
          Both support wildcards like <code>*.example.com</code>:
        </p>
      </Reveal>
      <Reveal delay={280}>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "sandbox": {
    "enabled": true,
    "network": {
      "allowedDomains": ["github.com", "*.npmjs.org"],
      "deniedDomains":  ["uploads.github.com"]
    }
  }
}`}
        />
        <Callout tone="info" title="Deny rules always win">
          In managed deployments, <code>deniedDomains</code> is merged from ALL settings sources
          (managed, user, project, local) regardless of <code>allowManagedDomainsOnly</code>. A
          user-level block cannot be silently dropped by enterprise policy.
        </Callout>
      </Reveal>
      <Reveal delay={350}>
        <p>
          On Linux and WSL, use <code>sandbox.bwrapPath</code> and <code>sandbox.socatPath</code>{" "}
          to specify custom binary locations for bubblewrap and socat:
        </p>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "sandbox": {
    "bwrapPath": "/usr/local/bin/bwrap",
    "socatPath": "/usr/bin/socat"
  }
}`}
        />
      </Reveal>
      <Reveal delay={420}>
        <Terminal
          script={sandboxScript}
          title="Sandbox + headless analysis"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      {/* ── Advisor Tool ── */}
      <Reveal delay={0}>
        <h2>Advisor Tool (Experimental)</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          The Advisor Tool is an experimental dual-model feature that lets a faster executor model
          (like Sonnet) consult a higher-intelligence advisor model (like Opus) mid-task for
          strategic guidance. The advisor reads the full conversation and produces a plan or course
          correction, then the executor continues. This pattern fits long-horizon agentic workloads
          where most turns are mechanical but having an excellent plan is crucial.
        </p>
        <p>
          Enable it with the <code>/advisor</code> command. When active, sessions show an
          &ldquo;experimental&rdquo; label and a startup notification. Enable it via{" "}
          <code>CLAUDE_CODE_ENABLE_EXPERIMENTAL_ADVISOR_TOOL</code> in your environment.
        </p>
      </Reveal>

      {/* ── Native Glob/Grep ── */}
      <Reveal delay={0}>
        <h2>Native Glob and Grep on macOS/Linux</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          On native macOS and Linux builds, the Glob and Grep tools are replaced by embedded{" "}
          <code>bfs</code> and <code>ugrep</code> binaries available through the Bash tool. The
          result is faster file searches without a separate tool round-trip — Claude issues a
          single Bash command instead of calling a dedicated tool, reducing latency on large
          codebases.
        </p>
        <p>
          Windows and npm-installed builds are unaffected. The environment variables{" "}
          <code>CLAUDE_CODE_GLOB_HIDDEN</code>, <code>CLAUDE_CODE_GLOB_NO_IGNORE</code>, and{" "}
          <code>CLAUDE_CODE_GLOB_TIMEOUT_SECONDS</code> still apply to the original tools where
          they remain in use.
        </p>
      </Reveal>

      {/* ── Session cleanup ── */}
      <Reveal delay={0}>
        <h2>Session Cleanup with cleanupPeriodDays</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          The <code>cleanupPeriodDays</code> setting controls how long session files are retained
          before automatic deletion at startup. The default is 30 days and the minimum is 1 —
          setting it to <code>0</code> is rejected with a validation error. The setting also
          controls removal of orphaned subagent worktrees (from crashes or interrupted parallel
          runs) at startup, provided they have no uncommitted changes, untracked files, or unpushed
          commits. Worktrees you create with <code>--worktree</code> are never removed by this
          sweep:
        </p>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "cleanupPeriodDays": 14
}`}
        />
        <p>
          To keep transcripts from being written at all in non-interactive mode, use{" "}
          <code>--no-session-persistence</code>.
        </p>
      </Reveal>

      {/* ── Project Purge ── */}
      <Reveal delay={0}>
        <h2>Project Purge</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          When <code>cleanupPeriodDays</code> isn&apos;t enough and you want to wipe all Claude
          Code state for a project right now, use <code>claude project purge</code>. It deletes
          transcripts, task lists, debug logs, file-edit history, prompt history, and the project
          entry itself:
        </p>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`# Preview what would be deleted
claude project purge --dry-run

# Purge state for the current project
claude project purge

# Skip the confirmation prompt
claude project purge --yes

# Interactively choose which items to remove
claude project purge --interactive

# Purge state for every project at once
claude project purge --all

# Combine flags: preview a full wipe
claude project purge --all --dry-run`}
        />
      </Reveal>
      <Reveal delay={140}>
        <Terminal
          script={purgeScript}
          title="Project purge"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      {/* ── Env vars ── */}
      <Reveal delay={0}>
        <h2>Debugging and Platform Environment Variables</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          A set of environment variables unlocks surfaces that are not exposed as commands or
          settings yet.
        </p>
        <ul>
          <li>
            <code>OTEL_LOG_RAW_API_BODIES=1</code> — emits full API request and response bodies as
            OpenTelemetry log events. Be careful with the logs afterwards since request bodies can
            contain secrets.
          </li>
          <li>
            <code>OTEL_RESOURCE_ATTRIBUTES</code> — adds custom <code>key=value</code> pairs
            (comma-separated, no spaces) as labels on every metric datapoint. Useful for slicing
            by team, department, or cost center.
          </li>
          <li>
            <code>CLAUDE_CODE_USE_POWERSHELL_TOOL=1</code> — opts into the PowerShell tool on
            Linux and macOS. On Windows with this enabled, PowerShell becomes the primary shell.
          </li>
          <li>
            <code>DISABLE_UPDATES=1</code> — blocks all update paths, including manual{" "}
            <code>claude update</code>. Stricter than <code>DISABLE_AUTOUPDATER</code>.
          </li>
          <li>
            <code>CLAUDE_CODE_SAFE_MODE=1</code> or <code>--safe-mode</code> — starts Claude Code
            with all customizations (CLAUDE.md, plugins, skills, hooks, MCP servers) disabled.
          </li>
          <li>
            <code>CLAUDE_CODE_HIDE_CWD=1</code> — hides the working directory from the startup
            banner. Useful for screen recordings.
          </li>
          <li>
            <code>CLAUDE_CODE_NATIVE_CURSOR=1</code> — shows the terminal&apos;s own cursor at
            the input caret, respecting the terminal&apos;s blink, shape, and focus settings.
          </li>
          <li>
            <code>CLAUDE_CODE_RESUME_PROMPT</code> — overrides the continuation message injected
            when resuming a session that ended mid-turn. Default:{" "}
            <em>Continue from where you left off.</em>
          </li>
          <li>
            <code>ANTHROPIC_WORKSPACE_ID</code> — the workspace ID for workload identity
            federation. Set it when your federation rule is scoped to more than one workspace.
          </li>
        </ul>
      </Reveal>
      <Reveal delay={140}>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`# Capture full OTEL telemetry while reproducing an API bug
OTEL_LOG_RAW_API_BODIES=1 claude --print 'reproduce the failure'

# Slice metrics by team and cost center in your OTEL backend
OTEL_RESOURCE_ATTRIBUTES="department=engineering,team.id=platform,cost_center=eng-123" \\
  claude

# Enable PowerShell tool on macOS or Linux
CLAUDE_CODE_USE_POWERSHELL_TOOL=1 claude

# Block all updates on a locked-down machine
DISABLE_UPDATES=1 claude

# Hide the working directory in the startup banner
CLAUDE_CODE_HIDE_CWD=1 claude

# Use the terminal's own cursor at the input caret
CLAUDE_CODE_NATIVE_CURSOR=1 claude

# Override the resume continuation message for an agent boot script
CLAUDE_CODE_RESUME_PROMPT="Resume the migration and stop after the next test run." \\
  claude --resume

# Route session quality survey through your OTEL collector
CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 \\
  CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL=1 claude

# Workload identity federation with a multi-workspace rule
ANTHROPIC_WORKSPACE_ID=ws_01abcd... claude`}
        />
      </Reveal>

      {/* ── Cloud & Handoff ── */}
      <Reveal delay={0}>
        <h2>Claude Code on the Web and Session Handoff</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          Claude Code on the web runs tasks on Anthropic-managed cloud infrastructure at
          claude.ai/code. Cloud sessions persist even when you close your browser, and you can
          monitor them from the Claude mobile app.
        </p>
        <p>
          Launch a cloud session from your terminal with{" "}
          <code>claude --remote &quot;your task&quot;</code>. Claude clones your repo from GitHub
          (push local commits first), executes the prompt autonomously, and can open PRs when done.
          Use multiple <code>--remote</code> calls to run tasks in parallel.
        </p>
        <ul>
          <li>
            <code>/teleport</code> (alias <code>/tp</code>) — pulls a cloud session back into your
            local terminal, fetching the branch and full conversation history.
          </li>
          <li>
            <code>/autofix-pr</code> — spawns a cloud session that watches your current PR. When
            CI fails or reviewers leave comments, Claude investigates and pushes a fix. Requires
            the Claude GitHub App installed on the repository.
          </li>
        </ul>
      </Reveal>
      <Reveal delay={140}>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`# Plan locally, execute in the cloud
claude --permission-mode plan
# ... finalize plan, commit, push ...
claude --remote "Execute the migration plan in docs/migration-plan.md"

# Pull the cloud session back when done
/teleport`}
        />
        <Callout tone="note">
          Cloud sessions include standard runtimes (Node.js, Python, Go, Rust, Java, Ruby, Docker,
          PostgreSQL), up to 16 GB RAM, and configurable network access. Repo-level config
          (CLAUDE.md, settings, MCP servers, skills) carries over automatically. User-level
          settings (~/.claude/) do not — commit project config to the repo.
        </Callout>
      </Reveal>

      {/* ── PR URL & Worktree ── */}
      <Reveal delay={0}>
        <h2>PR URL Customization and Worktree Configuration</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          The <code>prUrlTemplate</code> setting points the footer PR badge at a custom
          code-review URL instead of the default GitHub link — useful for teams using GitLab,
          Bitbucket, or an internal review tool:
        </p>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "prUrlTemplate": "https://gitlab.example.com/org/repo/-/merge_requests/{{pr_number}}"
}`}
        />
      </Reveal>
      <Reveal delay={140}>
        <p>
          Git worktrees let you check out multiple branches simultaneously without stashing.{" "}
          <code>claude --worktree &lt;name&gt;</code> creates a new worktree linked to{" "}
          <code>&lt;name&gt;/</code>. The <code>worktree.baseRef</code> setting (new in v2.1.133)
          controls which ref to branch from:
        </p>
        <ul>
          <li>
            <code>fresh</code> (default) — branches from <code>origin/&lt;default&gt;</code>, a
            clean tree matching the remote.
          </li>
          <li>
            <code>head</code> — branches from your local <code>HEAD</code>, preserving unpushed
            local commits in new worktrees.
          </li>
        </ul>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "worktree": {
    "baseRef": "head"
  }
}`}
        />
      </Reveal>

      {/* ── Computer Use ── */}
      <Reveal delay={0}>
        <h2>Computer Use (Research Preview)</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          Computer use lets Claude open apps, control your screen, and interact with GUIs on
          macOS — building a Swift app, launching it, clicking through every button, and
          screenshotting the result, all in the same conversation. It handles tasks that require a
          GUI: validating native app builds, end-to-end UI testing without a test harness,
          debugging visual layout issues, and driving GUI-only tools like design apps or the iOS
          Simulator.
        </p>
        <p>
          Claude tries more precise tools first: MCP servers, Bash, or Chrome integration.
          Computer use is the fallback for things nothing else can reach — native apps, simulators,
          and tools without an API.
        </p>
        <p>
          Enable it by running <code>/mcp</code> in a session, finding the{" "}
          <code>computer-use</code> server, and selecting <strong>Enable</strong>. The setting
          persists per project. On first use, macOS prompts for Accessibility and Screen Recording
          permissions. When Claude wants to control a specific app, a prompt appears for you to
          approve — approvals last for the current session only.
        </p>
        <p>
          While Claude works, other visible apps are hidden so it only interacts with approved
          apps. Your terminal window stays visible and is excluded from screenshots. Press{" "}
          <kbd>Esc</kbd> anywhere or <kbd>Ctrl+C</kbd> to abort immediately.
        </p>
        <Callout tone="warn" title="Requirements">
          Computer use requires a Pro or Max plan, macOS, Claude Code v2.1.85+, and an interactive
          session (not available with <code>-p</code>). Not available on Team, Enterprise, Bedrock,
          Vertex AI, or Foundry.
        </Callout>
      </Reveal>

      {/* ── More Features ── */}
      <Reveal delay={0}>
        <h2>More Advanced Features</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          Claude Code&apos;s advanced toolkit goes further. Background tasks let long-running work
          continue while you keep chatting. Scheduled tasks support <code>/loop</code> for
          session-scoped recurring checks and <code>/schedule</code> for cloud-backed scheduled
          work. Session tools like <code>/resume</code>, <code>/rename</code>, and{" "}
          <code>/teleport</code> make it easy to move between local CLI, the browser, and the
          desktop app.
        </p>
        <p>
          There are also platform features for daily use: voice dictation with <code>/voice</code>,
          Chrome integration with <code>--chrome</code>, remote control via{" "}
          <code>/remote-control</code>, the <code>/powerup</code> interactive feature discovery
          lessons, persistent task lists, and git worktree workflows with{" "}
          <code>claude --worktree</code>. These all share the same permission system, so advanced
          usage is mostly about combining the right mode with the right surface.
        </p>
      </Reveal>

      {/* ── Quiz ── */}
      <Reveal delay={0}>
        <Quiz questions={questions} title="Quick check — Advanced Features" />
      </Reveal>
    </Prose>
  );
}
