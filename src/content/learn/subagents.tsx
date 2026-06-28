import { Prose, Callout, Quiz, type QuizQuestion } from "@/components/content";
import { Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import CodeBlock from "@/components/CodeBlock";
import Terminal, { type Step } from "@/components/Terminal";

/* ---------------------------------------------------------------------------
   Subagents — faithful clone of https://claude.hjahouse.me/learn/subagents
--------------------------------------------------------------------------- */

const agentFileCode = `---
name: security-reviewer
description: Security-focused code reviewer. Use proactively after writing authentication, authorization, or data handling code.
tools: Read, Grep, Glob
---

You are a senior security engineer specializing in application security.

Review priorities:
1. Authentication and authorization flaws
2. Injection vulnerabilities (SQL, XSS, command)
3. Data exposure and sensitive information handling
4. Cryptographic weaknesses
5. Insecure direct object references

For each finding, provide: severity (Critical/High/Medium/Low), location (file:line), description, and a concrete fix with code example.

When invoked: run \`git diff HEAD\` first to focus on changed code.`;

const researcherAgentCode = `---
name: researcher
memory: user
description: Long-running research assistant with persistent notes
---
You are a research assistant. Check your MEMORY.md at session start to recall previous findings. Update it with new discoveries.`;

const addDirCode = `claude --add-dir ~/projects/shared-types --add-dir ~/projects/design-tokens
claude --mcp-config ./ci-servers.json`;

const explicitInvocationCode = `Use the security-reviewer agent to audit the new auth module.
Have the test-engineer agent write integration tests for the payment service.
Ask the debugger agent to investigate the memory leak in src/workers/queue.ts.`;

const agentViewFilterCode = `# Only show agent sessions started under ~/work/api
claude agents --cwd ~/work/api`;

const agentViewJsonCode = `# Wake up every session that's blocked on a permission prompt
claude agents --json \\
  | jq -r '.[] | select(.status == "waiting" and .waitingFor == "permission prompt") | .sessionId' \\
  | xargs -I {} claude respawn {}`;

const chainingCode = `First use the code-analyzer agent to find performance bottlenecks, then use the optimizer agent to fix them.`;

const forkSubagentCode = `CLAUDE_CODE_FORK_SUBAGENT=1 claude`;

const terminalScript: Step[] = [
  { t: "print", text: "# Creating and running a subagent session", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "ls .claude/agents/", prompt: "$", tone: "user" },
  {
    t: "out",
    lines: [
      { text: "security-reviewer.md", tone: "green" },
      { text: "test-engineer.md", tone: "green" },
      { text: "code-analyzer.md", tone: "green" },
    ],
    gap: 60,
  },
  { t: "wait", ms: 500 },
  { t: "type", text: "claude agents", prompt: "$", tone: "user" },
  {
    t: "out",
    lines: [
      { text: "Agent Roster", tone: "blue" },
      { text: "────────────────────────────────────────────", tone: "muted" },
      { text: "PID    NAME               STATUS     LAST ACTIVITY", tone: "muted" },
      { text: "1234   security-reviewer  working    2s ago", tone: "green" },
      { text: "1235   test-engineer      waiting    5s ago", tone: "amber" },
      { text: "1236   code-analyzer      completed  1m ago", tone: "muted" },
    ],
    gap: 70,
  },
  { t: "wait", ms: 600 },
  { t: "type", text: 'Use the security-reviewer agent to audit src/auth/', prompt: ">", tone: "user" },
  {
    t: "out",
    lines: [
      { text: "Delegating to security-reviewer agent...", tone: "system" },
      { text: "Running: git diff HEAD -- src/auth/", tone: "muted" },
      { text: "Scanning authentication module...", tone: "blue" },
      { text: "", tone: "default" },
      { text: "FINDINGS:", tone: "amber" },
      { text: "  [HIGH]  src/auth/login.ts:42 — JWT secret hardcoded", tone: "error" },
      { text: "  [MED]   src/auth/session.ts:18 — Missing httpOnly flag", tone: "amber" },
      { text: "  [LOW]   src/auth/utils.ts:7  — Weak hash rounds (8)", tone: "muted" },
    ],
    gap: 80,
  },
  { t: "wait", ms: 400 },
  { t: "print", text: "Security review complete. 3 findings returned.", tone: "green" },
];

const questions: QuizQuestion[] = [
  {
    q: "Where do you place agent markdown files to make them available for all your personal projects?",
    options: [
      ".claude/agents/ in the project root",
      "~/.claude/agents/ in your home directory",
      "/etc/claude/agents/ system-wide",
      "Pass them with --agent-file at runtime",
    ],
    answer: 1,
    explanation:
      "~/.claude/agents/ is the personal (user) scope. Files in .claude/agents/ apply only to the current project. Plugin-bundled agents are another option, but ~/.claude/agents/ is the right answer for all personal projects.",
  },
  {
    q: "What does the `isolation: worktree` frontmatter option do?",
    options: [
      "Runs the agent in a Docker container",
      "Gives the agent its own git worktree and branch so changes don't touch your main working tree",
      "Prevents the agent from accessing the internet",
      "Restricts the agent to a single file",
    ],
    answer: 1,
    explanation:
      "isolation: worktree creates a separate git worktree for the agent. When it finishes, it returns the worktree path and branch name for you to review. If no changes were made, the worktree is cleaned up automatically.",
  },
  {
    q: "Which built-in subagent uses Haiku for fast, read-only codebase analysis?",
    options: ["general-purpose", "Plan", "Explore", "claude-code-guide"],
    answer: 2,
    explanation:
      "Explore uses Haiku for fast read-only codebase analysis. Note that both Explore and Plan skip your CLAUDE.md files and git status to keep research fast and inexpensive.",
  },
  {
    q: "What does `CLAUDE_CODE_FORK_SUBAGENT=1` change about how subagents run?",
    options: [
      "Agents run serially instead of in parallel",
      "Agents inherit the full conversation context from the main session instead of starting fresh",
      "Agents are disabled entirely",
      "Agents are automatically given write access to all files",
    ],
    answer: 1,
    explanation:
      "When CLAUDE_CODE_FORK_SUBAGENT=1 is set, forked subagents inherit the full conversation context from the main session. It also makes /fork spawn a forked subagent rather than acting as an alias for /branch, and all subagent spawns run in the background.",
  },
];

export default function Content() {
  return (
    <Prose>
      {/* Intro */}
      <Reveal delay={0}>
        <p>
          Subagents let Claude delegate work to specialized AI assistants, each with their own
          context window, tools, and system prompt. They prevent context pollution on long tasks,
          enable parallel execution, and let you encode domain expertise into reusable agents. This
          module covers creating, configuring, and using subagents effectively.
        </p>
      </Reveal>

      {/* ------------------------------------------------------------------ */}
      {/* Creating Subagents                                                  */}
      {/* ------------------------------------------------------------------ */}
      <Reveal delay={70}>
        <h2>Creating Subagents</h2>
      </Reveal>

      <Reveal delay={140}>
        <p>
          Subagents are markdown files with YAML frontmatter. You can define them with the{" "}
          <code>--agents</code> CLI flag for one session, put them in{" "}
          <code>.claude/agents/</code> for project scope (committed to git), or{" "}
          <code>~/.claude/agents/</code> for personal scope (all projects). Plugins can bundle
          agents too. Priority is managed &gt; CLI flag &gt; project &gt; user &gt; plugin.
          Built-in subagents are always available and are not part of the name-override priority
          system. The <code>/agents</code> command provides an interactive menu to create, edit,
          and manage them.
        </p>
        <p>
          The frontmatter defines the agent&apos;s identity. The markdown body is its system
          prompt — write this like you&apos;re briefing a specialist:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".claude/agents/security-reviewer.md"
          lang="markdown"
          code={agentFileCode}
        />
      </Reveal>

      <Reveal delay={280}>
        <p>
          The <code>tools</code> field restricts which tools the agent can use. A security reviewer
          only needs <code>Read</code>, <code>Grep</code>, and <code>Glob</code> — no write access.
          An implementation agent needs the full set. Restricting tools makes the agent safer and
          its behavior more predictable. If you omit <code>tools</code>, the agent inherits all
          available tools.
        </p>
      </Reveal>

      {/* ------------------------------------------------------------------ */}
      {/* Configuration Options                                               */}
      {/* ------------------------------------------------------------------ */}
      <Reveal delay={0}>
        <h2>Configuration Options</h2>
      </Reveal>

      <Reveal delay={70}>
        <p>
          Beyond basic tool access, the frontmatter supports several powerful options.{" "}
          <code>model</code> sets which model the agent uses — <code>haiku</code> for fast,
          lightweight tasks, <code>sonnet</code> for balanced work, or <code>opus</code> for
          complex reasoning. You can also use <code>inherit</code> to inherit the parent&apos;s
          model. <code>effort</code> controls reasoning depth on supported models, with values{" "}
          <code>low</code>, <code>medium</code>, <code>high</code>, <code>xhigh</code>,{" "}
          <code>max</code>, and <code>auto</code>. <code>maxTurns</code> caps how long the agent
          can run. <code>permissionMode</code> sets the permission level. Other useful fields
          include <code>disallowedTools</code>, <code>skills</code> to preload selected skills,{" "}
          <code>mcpServers</code> for agent-scoped MCP access, and <code>initialPrompt</code> to
          auto-submit the first turn.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <p>
          <code>memory</code> gives the agent persistent storage across sessions. The first 200
          lines of a <code>MEMORY.md</code> file in the agent&apos;s memory directory load into its
          system prompt automatically — Claude writes to this file as it learns things:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".claude/agents/researcher.md"
          lang="markdown"
          code={researcherAgentCode}
        />
      </Reveal>

      <Reveal delay={280}>
        <p>
          <code>isolation: worktree</code> gives the agent its own git worktree and branch to make
          changes without touching your main working tree. When the agent finishes, it returns the
          worktree path and branch name for you to review and merge. If it made no changes, the
          worktree is cleaned up automatically. While the agent runs, Claude locks the worktree so
          a concurrent cleanup sweep can&apos;t remove it, releasing the lock once the agent
          finishes. The worktree branches from your repository&apos;s default branch (
          <code>origin/HEAD</code>) unless you set <code>worktree.baseRef</code> to{" "}
          <code>head</code> in settings, which makes isolated agents start from your local{" "}
          <code>HEAD</code> and carry along unpushed work.
        </p>
      </Reveal>

      <Reveal delay={350}>
        <Callout tone="tip" title="background: true">
          Adding <code>background: true</code> to an agent&apos;s frontmatter makes it always run
          as a background task, freeing the main conversation. You can also press{" "}
          <code>Ctrl+B</code> to background a currently running agent mid-execution.
        </Callout>
      </Reveal>

      <Reveal delay={420}>
        <p>
          Two CLI flags extend what a session can access. <code>--add-dir &lt;path&gt;</code>{" "}
          grants Read/Edit access to additional directories beyond the primary working directory —
          useful when your code references shared libraries or monorepo packages in sibling folders.
          Skills in <code>.claude/skills/</code> within added directories load automatically.
          Persist these across sessions with <code>permissions.additionalDirectories</code> in
          settings. <code>--mcp-config &lt;path&gt;</code> loads MCP server definitions from one
          or more JSON files for the current session only, merged with your user/project MCP
          sources. Add <code>--strict-mcp-config</code> to ignore user/project sources and use
          only the provided files:
        </p>
      </Reveal>

      <Reveal delay={490}>
        <CodeBlock filename="terminal" lang="bash" code={addDirCode} tone="terminal" />
      </Reveal>

      {/* ------------------------------------------------------------------ */}
      {/* Using and Chaining Subagents                                        */}
      {/* ------------------------------------------------------------------ */}
      <Reveal delay={0}>
        <h2>Using and Chaining Subagents</h2>
      </Reveal>

      <Reveal delay={70}>
        <p>
          Claude invokes agents automatically when the task description matches the agent&apos;s{" "}
          <code>description</code> field. Phrases like &quot;use proactively&quot; can encourage
          delegation, but explicit invocation is the reliable path when you need a specific agent.
          Use <code>@&quot;agent-name (agent)&quot;</code> syntax to guarantee a specific agent is
          used, bypassing the automatic matching.
        </p>
        <p>Explicit invocation via natural language also works:</p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="Explicit invocation examples"
          lang="text"
          code={explicitInvocationCode}
        />
      </Reveal>

      <Reveal delay={210}>
        <p>
          Agents can be chained in sequence, with the output of one feeding the next. Run{" "}
          <code>claude agents</code> from the terminal to open the <strong>Agent view</strong> — a
          roster of all Claude Code sessions showing their state (working, waiting, completed,
          failed, idle, stopped) and last activity. This is useful for monitoring multiple agents
          running in parallel. Pass <code>--cwd &lt;path&gt;</code> to filter the roster to
          sessions started under that directory — handy when you juggle several repos and want a
          view scoped to the one you&apos;re currently working on. Set{" "}
          <code>CLAUDE_CODE_DISABLE_AGENT_VIEW=1</code> to disable it. You can also run a full
          session with a specific agent via <code>claude --agent &lt;name&gt;</code>, and restrict
          which agents a coordinator can spawn with <code>Agent(...)</code> tool allowlists.
        </p>
      </Reveal>

      <Reveal delay={280}>
        <CodeBlock filename="terminal" lang="bash" code={agentViewFilterCode} tone="terminal" />
      </Reveal>

      {/* Terminal demo */}
      <Reveal delay={350}>
        <Terminal
          script={terminalScript}
          title="claude agents"
          loop={true}
          showStatus={true}
          className="my-6"
        />
      </Reveal>

      <Reveal delay={420}>
        <p>
          For scripts that need to consume the roster — tmux-resurrect-style boot scripts, custom
          status bars, session pickers — pass <code>--json</code> to <code>claude agents</code> to
          get the same data as a machine-readable array instead of the interactive view. Each entry
          includes <code>pid</code>, <code>cwd</code>, <code>kind</code>, and{" "}
          <code>startedAt</code>, plus <code>sessionId</code>, <code>name</code>, and{" "}
          <code>status</code> when set. When <code>status</code> is <code>waiting</code>,{" "}
          <code>waitingFor</code> says exactly what the session is blocked on, such as{" "}
          <code>permission prompt</code> or <code>input needed</code>, so a script can route those
          two cases to different actions:
        </p>
      </Reveal>

      <Reveal delay={490}>
        <CodeBlock
          filename="Respawn permission-blocked agents"
          lang="bash"
          code={agentViewJsonCode}
          tone="terminal"
        />
      </Reveal>

      <Reveal delay={560}>
        <CodeBlock
          filename="Agent chaining example"
          lang="text"
          code={chainingCode}
        />
      </Reveal>

      {/* Built-in agents */}
      <Reveal delay={0}>
        <h3>Built-in Agents</h3>
      </Reveal>

      <Reveal delay={70}>
        <p>
          Claude Code ships with several built-in agents you don&apos;t need to create:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <div className="my-5 grid gap-3 sm:grid-cols-2">
          {[
            {
              name: "general-purpose",
              desc: "Handles broad multi-step tasks across any domain.",
            },
            {
              name: "Explore",
              desc: "Uses Haiku for fast, read-only codebase analysis. Skips CLAUDE.md and git status for speed.",
            },
            {
              name: "Plan",
              desc: "Researches the codebase before presenting implementation plans. Also skips CLAUDE.md and git status.",
            },
            {
              name: "claude-code-guide",
              desc: "Answers questions about Claude Code features and capabilities.",
            },
          ].map((agent, i) => (
            <Reveal key={agent.name} delay={i * 70}>
              <Card className="transition hover:-translate-y-0.5 hover:border-accent/40">
                <div className="mb-1 font-mono text-sm font-semibold text-accent">
                  {agent.name}
                </div>
                <p className="text-sm text-fg-muted">{agent.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal delay={350}>
        <Callout tone="note" title="CLAUDE.md in built-in agents">
          <code>Explore</code> and <code>Plan</code> skip your CLAUDE.md files and git status to
          keep research fast and inexpensive. Every other built-in and custom subagent loads both.
          Agents can also be resumable, letting Claude continue a previous agent conversation by ID
          when the workflow spans multiple turns.
        </Callout>
      </Reveal>

      {/* Forked subagents */}
      <Reveal delay={0}>
        <h3>Forked Subagents</h3>
      </Reveal>

      <Reveal delay={70}>
        <p>
          Set <code>CLAUDE_CODE_FORK_SUBAGENT=1</code> to enable forked subagents. A forked
          subagent inherits the full conversation context from the main session instead of starting
          fresh. When enabled, <code>/fork</code> spawns a forked subagent rather than acting as an
          alias for <code>/branch</code>, and all subagent spawns run in the background. It works in
          interactive sessions, non-interactive mode, the Agent SDK, and on external builds:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock filename="terminal" lang="bash" code={forkSubagentCode} tone="terminal" />
      </Reveal>

      {/* Agent Teams */}
      <Reveal delay={0}>
        <h3>Agent Teams (Experimental)</h3>
      </Reveal>

      <Reveal delay={70}>
        <p>
          The experimental Agent Teams feature (requires{" "}
          <code>CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1</code> or the <code>--agent-teams</code>{" "}
          CLI flag) coordinates multiple Claude instances working in parallel via a shared task list
          and mailbox. This is for large multi-file projects where independent agents can work on
          different parts simultaneously without stepping on each other.{" "}
          <code>SendMessage</code> automatically resumes stopped agents when a message is sent to
          them, so you no longer need to explicitly resume an agent before communicating with it.
        </p>
        <p>
          As of v2.1.178 the <code>TeamCreate</code> and <code>TeamDelete</code> tools were
          removed: with the flag set, every session already has one implicit team, so you spawn
          teammates directly through the Agent tool&apos;s <code>name</code> parameter — no setup
          step — and cleanup happens automatically when the session exits.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <Callout tone="warn" title="Experimental feature">
          Agent Teams is experimental and the API is subject to change. Use it on projects where
          you can afford breaking changes between Claude Code versions.
        </Callout>
      </Reveal>

      {/* Quiz */}
      <Reveal delay={0}>
        <Quiz questions={questions} title="Quick check — Subagents" />
      </Reveal>
    </Prose>
  );
}
