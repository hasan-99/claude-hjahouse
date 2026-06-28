import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Quiz, Prose, type QuizQuestion } from "@/components/content";

/* ------------------------------------------------------------------ */
/* Terminal demo — skill auto-discovery + invocation                   */
/* ------------------------------------------------------------------ */
const demoScript: Step[] = [
  { t: "print", text: "# Claude Code — skill discovery", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/skills", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "Loaded skills:", tone: "muted" },
    { text: "  • code-review      Scan code for security vulnerabilities...", tone: "green" },
    { text: "  • pr-summary       Summarize pull request changes. Use when...", tone: "green" },
    { text: "  • api-generator    Generate REST API endpoints from schema...", tone: "green" },
    { text: "  • deep-analysis    Thoroughly analyze the codebase for a...", tone: "green" },
    { text: "", tone: "muted" },
    { text: "Budget used: 1,240 / 8,192 chars (15%)", tone: "amber" },
  ], gap: 60 },
  { t: "wait", ms: 700 },
  { t: "type", text: "/review-pr 456 high", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "Invoking skill: review-pr", tone: "system" },
    { text: "  args: $0=456, $1=high", tone: "muted" },
    { text: "  allowed-tools: Bash(gh *), Read, Grep, Glob", tone: "muted" },
    { text: "", tone: "muted" },
    { text: "Fetching PR #456...", tone: "blue" },
    { text: "gh pr view 456 --json title,body,files", tone: "muted" },
    { text: "Running security and performance review...", tone: "green" },
  ], gap: 70 },
  { t: "wait", ms: 500 },
  { t: "print", text: "✓ Skill completed — PR #456 reviewed (priority: high)", tone: "green" },
  { t: "wait", ms: 1200 },
  { t: "clear" },
];

/* ------------------------------------------------------------------ */
/* Quiz questions                                                       */
/* ------------------------------------------------------------------ */
const questions: QuizQuestion[] = [
  {
    q: "When does Claude load the full SKILL.md content?",
    options: [
      "At startup, for every skill in ~/.claude/skills/",
      "Only when the skill is actually invoked",
      "Whenever the user opens the / menu",
      "Only for project-scoped skills, never personal ones",
    ],
    answer: 1,
    explanation:
      "Skill descriptions are loaded so Claude knows what's available, but full SKILL.md content loads lazily — only when Claude decides to invoke the skill. This keeps the context window light even with many installed skills.",
  },
  {
    q: "Which frontmatter field prevents Claude from auto-invoking a skill while still allowing the user to run it via /skill-name?",
    options: [
      "user-invocable: false",
      "paths: []",
      "disable-model-invocation: true",
      "effort: low",
    ],
    answer: 2,
    explanation:
      "`disable-model-invocation: true` stops Claude from triggering the skill automatically, but the user can still invoke it from the slash menu. Use this for skills with side effects like deploys or pushes.",
  },
  {
    q: "What does `context: fork` do in a skill's frontmatter?",
    options: [
      "Copies the skill to a forked GitHub repository",
      "Runs the skill in an isolated subagent with its own context window",
      "Forks the current terminal session into a new tab",
      "Creates a forked copy of SKILL.md at runtime",
    ],
    answer: 1,
    explanation:
      "`context: fork` runs the skill in an isolated subagent so the main conversation's context window stays clean. You pair it with an `agent` field (Explore, Plan, or general-purpose) to specify the subagent type.",
  },
  {
    q: "What is the priority order when non-plugin skills share the same name?",
    options: [
      "project > personal > enterprise",
      "personal > project > enterprise",
      "enterprise > personal > project",
      "Alphabetical order by file path",
    ],
    answer: 2,
    explanation:
      "Enterprise settings take highest priority, then personal (~/.claude/skills/), then project (.claude/skills/). Plugin skills use a namespace (plugin-name:skill-name) so they never collide with project or personal skills.",
  },
];

/* ------------------------------------------------------------------ */
/* Content                                                              */
/* ------------------------------------------------------------------ */
export default function Content() {
  return (
    <Prose>
      {/* Intro */}
      <Reveal delay={0}>
        <p>
          Skills are reusable capabilities that Claude discovers and uses automatically based on
          context. They&rsquo;re more powerful than simple commands: they support progressive
          loading to stay lightweight, dynamic shell context injection, subagent isolation, and
          invocation control. This module shows you how to design and build effective skills.
        </p>
      </Reveal>

      {/* ── How Skills Load ── */}
      <Reveal delay={70}>
        <h2>How Skills Load</h2>
        <p>
          Claude keeps skill loading lightweight. Skill descriptions are loaded so Claude knows
          what capabilities are available. The full <code>SKILL.md</code> content loads only when
          the skill is invoked, and supporting files are read only when needed.
        </p>
        <p>
          This means you can install many skills without flooding the context window. Claude knows
          they exist from their descriptions, then loads the actual instructions only for the skills
          it decides to use.
        </p>
        <p>
          Skills live in <code>.claude/skills/&lt;name&gt;/SKILL.md</code> for project scope
          (committed to git) or <code>~/.claude/skills/&lt;name&gt;/SKILL.md</code> for personal
          scope. Plugin skills use a <code>plugin-name:skill-name</code> namespace, so they do not
          collide with project or personal skills. When non-plugin skills share the same name, the
          priority order is enterprise &gt; personal &gt; project.
        </p>
        <p>
          Claude also auto-discovers skills from nested <code>.claude/skills/</code> directories
          in subdirectories of the project root. For example, if you&rsquo;re working inside{" "}
          <code>packages/frontend/</code>, Claude will also find skills defined in{" "}
          <code>packages/frontend/.claude/skills/</code>. This makes skills easy to co-locate with
          specific packages or services in monorepo setups.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename=".claude/skills/code-review/"
          lang="bash"
          code={`.claude/skills/code-review/
├── SKILL.md              # Instructions (required)
├── templates/
│   └── review-checklist.md
└── scripts/
    └── analyze-metrics.py`}
        />
      </Reveal>

      {/* ── Writing Effective Skill Descriptions ── */}
      <Reveal delay={70}>
        <h2>Writing Effective Skill Descriptions</h2>
        <p>
          The description field is the most important part of a skill. It controls when Claude
          auto-invokes the skill, and it must contain enough signal for Claude to match it against
          real user requests. A vague description like &ldquo;helps with code&rdquo; will never
          trigger. A specific description with concrete trigger terms works:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="SKILL.md — minimal description"
          lang="yaml"
          code={`---
name: security-review
description: Scan code for security vulnerabilities including injection flaws, authentication issues, and data exposure. Use when reviewing code changes, preparing a PR, or when the user mentions security, vulnerabilities, or audit.
---`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          Include the task type (&ldquo;scan&rdquo;, &ldquo;generate&rdquo;,
          &ldquo;analyze&rdquo;), the subject domain (&ldquo;security&rdquo;,
          &ldquo;API&rdquo;, &ldquo;database&rdquo;), and explicit trigger phrases (&ldquo;when
          the user mentions&rdquo;, &ldquo;use when&rdquo;). The skill listing truncates each
          entry&rsquo;s combined <code>description</code> plus <code>when_to_use</code> text at
          1,536 characters, so front-load the key use case and push overflow trigger phrases into{" "}
          <code>when_to_use</code>:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="SKILL.md — split description + when_to_use"
          lang="yaml"
          code={`---
name: security-review
description: Scan code for security vulnerabilities including injection flaws, authentication issues, and data exposure.
when_to_use: When reviewing code changes, preparing a PR, or when the user mentions security, vulnerabilities, or audit.
---`}
        />
      </Reveal>

      <Reveal delay={140}>
        <Callout tone="info" title="Skill listing budget">
          Claude budgets total skill description space at about 1% of the model&rsquo;s context
          window by default. Raise it with the <code>skillListingBudgetFraction</code> setting
          (e.g. <code>0.02</code> = 2%) or the{" "}
          <code>SLASH_COMMAND_TOOL_CHAR_BUDGET</code> environment variable for a fixed character
          count. Run <code>/doctor</code> to check whether the budget is overflowing and which
          skills are being dropped from the listing.
        </Callout>
      </Reveal>

      <Reveal delay={140}>
        <p>
          Supporting files extend the skill without inflating Level 2 context. Reference them from{" "}
          <code>SKILL.md</code> with relative paths:
        </p>
        <CodeBlock
          filename="SKILL.md — referencing a supporting file"
          lang="markdown"
          code={`For the full review checklist, see [templates/review-checklist.md](templates/review-checklist.md).`}
        />
        <p>
          Claude reads supporting files with bash when it needs them. Keep <code>SKILL.md</code>{" "}
          under 500 lines; put detailed reference material in separate files.
        </p>
      </Reveal>

      {/* ── Dynamic Context and Invocation Control ── */}
      <Reveal delay={70}>
        <h2>Dynamic Context and Invocation Control</h2>
        <p>
          The <code>!command</code> syntax executes shell commands before the skill content reaches
          Claude. The output is inlined — Claude only sees the result, not the command. This is how
          you give skills live context:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="SKILL.md — pr-summary with live shell context"
          lang="yaml"
          code={`---
name: pr-summary
description: Summarize pull request changes. Use when asked to review or summarize a PR.
context: fork
agent: Explore
---

## PR context
- Diff: !\`gh pr diff\`
- Comments: !\`gh pr view --comments\`
- Changed files: !\`gh pr diff --name-only\`

Summarize the intent and key changes in this pull request.`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          The <code>shell</code> field specifies which shell to use for <code>!command</code>{" "}
          blocks. Set it to <code>powershell</code> instead of the default <code>bash</code> when
          the PowerShell tool is enabled via{" "}
          <code>CLAUDE_CODE_USE_POWERSHELL_TOOL=1</code>. On Linux and macOS, enabling it also
          requires <code>pwsh</code> on your PATH:
        </p>
        <CodeBlock
          filename="SKILL.md — shell: powershell"
          lang="yaml"
          code={`---
name: windows-helper
description: Manage Windows services and configurations
shell: powershell
---`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          Two frontmatter fields control who can invoke a skill.{" "}
          <code>disable-model-invocation: true</code> means only the user can invoke it via{" "}
          <code>/skill-name</code> — Claude will never trigger it automatically. Use this for any
          skill with side effects (deploys, pushes, sends).{" "}
          <code>user-invocable: false</code> hides the skill from the <code>/</code> menu while
          still letting Claude auto-invoke it — good for background knowledge skills that
          aren&rsquo;t actionable as commands.
        </p>
        <p>
          <code>paths:</code> accepts a YAML list of globs that scope when a skill applies. When
          set, the skill only loads when the working directory matches one of the globs. This keeps
          project-specific skills from polluting unrelated sessions:
        </p>
        <CodeBlock
          filename="SKILL.md — path-scoped skill"
          lang="yaml"
          code={`---
name: api-generator
description: Generate REST API endpoints from schema definitions.
paths: ["src/**/*.ts", "tests/**"]
---`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          <code>effort</code> controls reasoning depth for the skill. Values are{" "}
          <code>low</code>, <code>medium</code>, <code>high</code>, <code>xhigh</code>, and{" "}
          <code>max</code> (session-only). Use <code>low</code> for quick lookups or boilerplate
          generation, <code>medium</code> for most tasks, and <code>high</code> for deep analysis
          that requires careful reasoning:
        </p>
        <CodeBlock
          filename="SKILL.md — effort: high"
          lang="yaml"
          code={`---
name: security-review
description: Scan code for security vulnerabilities.
effort: high
---`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          <code>context: fork</code> runs the skill in an isolated subagent with its own context
          window. The <code>agent</code> field specifies which agent type: <code>Explore</code>{" "}
          for read-only research, <code>Plan</code> for planning,{" "}
          <code>general-purpose</code> for anything that needs all tools. The main conversation
          stays clean while the subagent does the heavy lifting.
        </p>
        <p>
          The <code>model</code> field specifies which model to use when the skill is active. This
          is useful when a task benefits from a specific model&rsquo;s strengths (e.g.,{" "}
          <code>opus</code> for complex reasoning, <code>sonnet</code> for fast execution):
        </p>
        <CodeBlock
          filename="SKILL.md — forked subagent with model selection"
          lang="yaml"
          code={`---
name: deep-analysis
description: Thoroughly analyze the codebase for a specific pattern or issue
context: fork
agent: Explore
model: opus
disable-model-invocation: true
---

Analyze $ARGUMENTS across the entire codebase:
1. Use Glob and Grep to find all occurrences
2. Read each file and understand context
3. Summarize patterns, inconsistencies, and recommendations`}
        />
      </Reveal>

      {/* ── Terminal demo ── */}
      <Reveal delay={70}>
        <Terminal
          script={demoScript}
          title="Skills — auto-discovery & invocation"
          loop
          showStatus
        />
      </Reveal>

      {/* ── Arguments and Tool Access ── */}
      <Reveal delay={70}>
        <h2>Arguments and Tool Access</h2>
        <p>
          Skills accept arguments two ways. <code>$ARGUMENTS</code> captures everything after the
          command name as a single string. <code>$0</code>, <code>$1</code>, <code>$2</code>{" "}
          capture individual space-separated arguments. You can also declare named arguments with
          the <code>arguments</code> frontmatter field — names map to positions, so{" "}
          <code>$issue</code> expands to the first argument and <code>$branch</code> to the
          second. All substitutions happen before the prompt reaches Claude.{" "}
          <code>argument-hint</code> improves the slash-menu autocomplete by showing what
          arguments a skill expects:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="SKILL.md — review-pr with positional args"
          lang="yaml"
          code={`---
name: review-pr
description: Review a GitHub PR by number
argument-hint: "<pr-number> <priority>"
allowed-tools: Bash(gh *), Read, Grep, Glob
---

Review PR #$0 with priority $1. Focus on security and performance.

Reference our standards in [standards/code-review.md](standards/code-review.md).`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          Usage: <code>/review-pr 456 high</code> — <code>$0</code> becomes <code>456</code>,{" "}
          <code>$1</code> becomes <code>high</code>.
        </p>
        <p>
          <code>allowed-tools</code> grants permission for the listed tools while the skill is
          active — it does not restrict which tools are available. Your permission settings still
          govern unlisted tools.
        </p>
        <p>
          Beyond positional arguments, skills support built-in substitution variables:{" "}
          <code>{"${CLAUDE_SESSION_ID}"}</code> for the current session ID (useful for logging),{" "}
          <code>{"${CLAUDE_EFFORT}"}</code> for the active effort level, and{" "}
          <code>{"${CLAUDE_SKILL_DIR}"}</code> for the directory containing the skill&rsquo;s{" "}
          <code>SKILL.md</code> file (use it to reference bundled scripts regardless of the
          working directory).
        </p>
        <p>
          Legacy command files in <code>.claude/commands/*.md</code> still work but skills are the
          recommended format. If both exist with the same name, the skill takes priority.
        </p>
      </Reveal>

      {/* ── Skill Visibility Overrides ── */}
      <Reveal delay={70}>
        <h2>Skill Visibility Overrides</h2>
        <p>
          The <code>skillOverrides</code> setting in <code>settings.json</code> controls skill
          visibility without editing the skill&rsquo;s own frontmatter. This is useful for shared
          project skills or plugin-provided skills you can&rsquo;t modify. The{" "}
          <code>/skills</code> menu lets you cycle states interactively — highlight a skill, press{" "}
          <code>Space</code> to cycle, then <code>Enter</code> to save to{" "}
          <code>.claude/settings.local.json</code>:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename=".claude/settings.json — skillOverrides"
          lang="json"
          code={`{
  "skillOverrides": {
    "legacy-context": "name-only",
    "deploy": "off"
  }
}`}
        />
        <p>
          Values: <code>&quot;on&quot;</code> (default — full listing),{" "}
          <code>&quot;name-only&quot;</code> (name visible but description hidden),{" "}
          <code>&quot;user-invocable-only&quot;</code> (hidden from Claude but in{" "}
          <code>/</code> menu), <code>&quot;off&quot;</code> (hidden everywhere).
        </p>
      </Reveal>

      {/* ── Built-in Skills ── */}
      <Reveal delay={70}>
        <h2>Built-in Skills</h2>
        <p>
          Claude Code includes a set of bundled skills that are available in every session,
          including <code>/code-review</code>, <code>/batch</code>, <code>/debug</code>,{" "}
          <code>/loop</code>, and <code>/claude-api</code>. Three additional bundled skills —{" "}
          <code>/run</code>, <code>/verify</code>, and <code>/run-skill-generator</code> — require
          v2.1.145+ and work together to launch your app and confirm changes against the running
          app instead of just tests:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <div className="my-5 overflow-x-auto rounded-lg border border-border bg-bg-muted">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-fg">Skill</th>
                <th className="px-4 py-3 text-left font-semibold text-fg">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["/code-review", "Review the current diff for correctness bugs and report findings"],
                ["/batch", "Execute multiple tasks in parallel across files in isolated worktrees"],
                ["/debug", "Investigate and diagnose issues from errors or logs"],
                ["/loop", "Run a task on a recurring interval within your session"],
                ["/claude-api", "Build, debug, and optimize Claude API / Anthropic SDK apps"],
                ["/run", "Launch and drive your app to see a change working"],
                ["/verify", "Build and run your app to confirm a code change does what it should"],
                ["/run-skill-generator", "Teach /run and /verify how to build and launch your project"],
              ].map(([skill, purpose], i) => (
                <tr key={i} className="transition hover:bg-card-hover">
                  <td className="px-4 py-3 font-mono text-xs text-accent">{skill}</td>
                  <td className="px-4 py-3 text-fg-muted">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <p>
          <code>/run</code> and <code>/verify</code> infer the launch from your project type
          (CLI, server, TUI, browser-driven) and from <code>package.json</code>,{" "}
          <code>Makefile</code>, or your README. For projects that need anything beyond a standard
          launch — a database, an env file, a multi-step build — run{" "}
          <code>/run-skill-generator</code> once. It gets your app running from a clean
          environment, captures what worked, and commits it as a per-project skill at{" "}
          <code>.claude/skills/run-&lt;name&gt;/</code>. After that, <code>/run</code> and{" "}
          <code>/verify</code> follow the recorded recipe instead of guessing.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <Callout tone="tip" title="/fewer-permission-prompts">
          <code>/fewer-permission-prompts</code> scans your conversation transcripts for common
          read-only Bash and MCP tool calls, then proposes a prioritized allowlist for your{" "}
          <code>.claude/settings.json</code>. Run it after a few sessions to generate a permission
          configuration tailored to your actual workflow.
          <CodeBlock
            lang="bash"
            code={`/fewer-permission-prompts`}
            className="mt-3"
          />
        </Callout>
      </Reveal>

      {/* ── Quiz ── */}
      <Reveal delay={70}>
        <Quiz questions={questions} title="Quick check — Agent Skills" />
      </Reveal>
    </Prose>
  );
}
