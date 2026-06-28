import { Prose, Callout, Quiz, type QuizQuestion } from "@/components/content";
import CodeBlock from "@/components/CodeBlock";
import Terminal, { type Step } from "@/components/Terminal";
import Reveal from "@/components/Reveal";

/* --------------------------------------------------------------------------
   Terminal demo: CI/CD automated PR review run via claude -p
-------------------------------------------------------------------------- */
const ciScript: Step[] = [
  { t: "print", text: "# GitHub Actions step — automated PR review", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "DIFF=$(git diff origin/main...HEAD)", tone: "user", prompt: "$" },
  { t: "wait", ms: 300 },
  { t: "type",
    text: 'REVIEW=$(echo "$DIFF" | claude -p "Review these changes. Output JSON with fields: summary, critical_issues, suggestions" --output-format json --permission-mode bypassPermissions)',
    tone: "user", prompt: "$", speed: 22 },
  { t: "wait", ms: 600 },
  { t: "print", text: "Running Claude Code analysis…", tone: "amber" },
  { t: "wait", ms: 800 },
  { t: "out", lines: [
    { text: '{', tone: "green" },
    { text: '  "summary": "Adds rate-limiting middleware to /api/auth/login",', tone: "green" },
    { text: '  "critical_issues": [],', tone: "green" },
    { text: '  "suggestions": ["Consider adding unit tests for the limiter", "Log blocked IPs to audit log"]', tone: "green" },
    { text: '}', tone: "green" },
  ], gap: 55 },
  { t: "wait", ms: 500 },
  { t: "type", text: 'echo "$REVIEW" | jq \'.critical_issues[]\' >> $GITHUB_STEP_SUMMARY', tone: "user", prompt: "$" },
  { t: "wait", ms: 400 },
  { t: "print", text: "✓ Review posted to step summary", tone: "green" },
];

/* --------------------------------------------------------------------------
   Terminal demo: scheduling a cloud routine
-------------------------------------------------------------------------- */
const scheduleScript: Step[] = [
  { t: "print", text: "# Create a cloud-backed routine", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/schedule daily PR review at 9am", tone: "user", prompt: ">" },
  { t: "wait", ms: 600 },
  { t: "out", lines: [
    { text: "✓ Routine created: \"daily PR review at 9am\"", tone: "green" },
    { text: "  Trigger: scheduled — every weekday at 09:00", tone: "muted" },
    { text: "  Repositories: org/repo (current)", tone: "muted" },
    { text: "  MCP connectors: 3 included", tone: "muted" },
  ], gap: 70 },
  { t: "wait", ms: 500 },
  { t: "type", text: "/schedule list", tone: "user", prompt: ">" },
  { t: "wait", ms: 500 },
  { t: "out", lines: [
    { text: "ID   Name                        Next run", tone: "muted" },
    { text: "─────────────────────────────────────────────", tone: "muted" },
    { text: "r1   daily PR review at 9am       Mon 09:00", tone: "green" },
    { text: "r2   weekly security audit         Sun 02:00", tone: "green" },
  ], gap: 60 },
  { t: "wait", ms: 400 },
  { t: "type", text: "/schedule run r2", tone: "user", prompt: ">" },
  { t: "wait", ms: 600 },
  { t: "print", text: "✓ Routine r2 triggered immediately", tone: "green" },
];

/* --------------------------------------------------------------------------
   Terminal demo: ultrareview + dynamic workflows
-------------------------------------------------------------------------- */
const workflowScript: Step[] = [
  { t: "print", text: "# Run a comprehensive code review", tone: "system" },
  { t: "wait", ms: 300 },
  { t: "type", text: "/ultrareview", tone: "user", prompt: ">" },
  { t: "wait", ms: 800 },
  { t: "out", lines: [
    { text: "✦ Launching cloud review session…", tone: "blue" },
    { text: "  Fetching branch diff (main..feature/auth-refactor)", tone: "muted" },
    { text: "  Spawning parallel review agents:", tone: "muted" },
    { text: "    ▸ security-agent", tone: "purple" },
    { text: "    ▸ performance-agent", tone: "purple" },
    { text: "    ▸ coverage-agent", tone: "purple" },
  ], gap: 65 },
  { t: "wait", ms: 600 },
  { t: "print", text: "  Track progress with /tasks", tone: "amber" },
  { t: "wait", ms: 1000 },
  { t: "print", text: "# Enable ultracode effort for automatic workflow orchestration", tone: "system" },
  { t: "wait", ms: 300 },
  { t: "type", text: "/effort ultracode", tone: "user", prompt: ">" },
  { t: "wait", ms: 500 },
  { t: "print", text: "✓ Effort level: ultracode (xhigh + auto workflow orchestration)", tone: "green" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/deep-research What changed in the Node.js permission model between v20 and v22?", tone: "user", prompt: ">" },
  { t: "wait", ms: 700 },
  { t: "out", lines: [
    { text: "⟳ Fanning out searches across 8 angles…", tone: "blue" },
    { text: "  Fetching & cross-checking 24 sources…", tone: "muted" },
    { text: "  Voting on 47 claims…", tone: "muted" },
    { text: "✓ Report ready — 12 cited findings, 3 claims filtered out", tone: "green" },
  ], gap: 70 },
];

const quizQuestions: QuizQuestion[] = [
  {
    q: "Which flag makes claude -p run without any approval prompts, suitable for fully automated CI environments?",
    options: [
      "--no-session-persistence",
      "--permission-mode bypassPermissions",
      "--bare",
      "--output-format json",
    ],
    answer: 1,
    explanation:
      "--permission-mode bypassPermissions disables all permission prompts so Claude can run unattended in CI pipelines. --no-session-persistence prevents session saving, and --bare gives cleaner output, but neither controls permissions.",
  },
  {
    q: "What does the --from-pr flag do when starting a Claude Code session?",
    options: [
      "Automatically merges the pull request after review",
      "Bootstraps a session with the PR's diff, description, and review comments",
      "Opens a browser window pointing to the pull request URL",
      "Enables push notifications for the PR's CI status",
    ],
    answer: 1,
    explanation:
      "--from-pr fetches the diff, description, and review comments so Claude can jump straight into fixing or extending PR feedback. It accepts GitHub, GitLab, and Bitbucket URLs as of v2.1.119.",
  },
  {
    q: "How does /ultrareview differ from a regular interactive code review with Claude?",
    options: [
      "It only reviews files you have opened in the editor",
      "It runs a single-agent analysis and returns inline comments",
      "It runs a comprehensive cloud-based review using parallel multi-agent analysis and critique",
      "It requires Zero Data Retention to be enabled on the account",
    ],
    answer: 2,
    explanation:
      "/ultrareview uses parallel multi-agent analysis on Claude Code on the web infrastructure. Pro/Max accounts get 3 free one-time runs; beyond that each review costs roughly $5–$20 as extra usage.",
  },
  {
    q: "What is the difference between /loop and a Routine when scheduling recurring tasks?",
    options: [
      "/loop persists across terminal sessions; Routines only last while Claude Code is running",
      "/loop is session-scoped and stops when Claude Code closes; Routines are cloud-backed and run independently",
      "Both are cloud-backed, but /loop supports GitHub triggers while Routines support only time-based triggers",
      "Routines require the API trigger; /loop uses cron expressions",
    ],
    answer: 1,
    explanation:
      "/loop creates session-scoped recurring checks — it stops when Claude Code stops. Routines are cloud-backed scheduled tasks that persist on Anthropic-managed infrastructure independently of your local terminal session.",
  },
];

export default function Content() {
  return (
    <Prose>
      {/* ── Intro ── */}
      <Reveal delay={0}>
        <p>
          Claude Code moves from interactive assistant to active team member when you wire it into
          your automation infrastructure. This module covers CI/CD integration, scheduled tasks,
          the GitHub Actions integration, and patterns for building reliable multi-step workflows.
        </p>
      </Reveal>

      {/* ── Section 1: CI/CD Integration ── */}
      <Reveal delay={70}>
        <h2>CI/CD Integration with Programmatic Runs</h2>
      </Reveal>

      <Reveal delay={140}>
        <p>
          The <code>claude -p</code> flag is the foundation of CI/CD integration. It runs Claude
          non-interactively, sends a prompt, and returns the result to stdout. Combine it with{" "}
          <code>--output-format json</code> for structured parsing,{" "}
          <code>--permission-mode bypassPermissions</code> for fully automated runs (no approval
          prompts), and <code>--max-turns</code> to cap execution time.
        </p>
        <p>
          A common pattern is running Claude as part of a PR review process. Configure it as a
          GitHub Actions step:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".github/workflows/review.yml"
          lang="yaml"
          code={`- name: Claude Code Review
  run: |
    DIFF=$(git diff origin/main...HEAD)
    REVIEW=$(echo "$DIFF" | claude -p "Review these changes. Output JSON with fields: summary, critical_issues, suggestions" \\
      --output-format json \\
      --permission-mode bypassPermissions)
    echo "$REVIEW" | jq '.critical_issues[]' >> $GITHUB_STEP_SUMMARY`}
        />
      </Reveal>

      <Reveal delay={280}>
        <p>
          The <code>--from-pr</code> flag bootstraps a session from an existing pull request. It
          fetches the diff, description, and review comments so Claude can jump straight into
          fixing or extending PR feedback. As of v2.1.119, <code>--from-pr</code> accepts URLs
          from GitHub, GitHub Enterprise, GitLab merge requests, and Bitbucket pull requests:
        </p>
      </Reveal>

      <Reveal delay={350}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`claude --from-pr https://github.com/org/repo/pull/123
claude --from-pr https://gitlab.com/org/repo/-/merge_requests/456
claude --from-pr https://bitbucket.org/org/repo/pull-requests/789`}
        />
      </Reveal>

      <Reveal delay={420}>
        <p>
          For disposable automation, Claude can generate tests for new code, update documentation
          when APIs change, run linters and auto-fix issues, or check for security
          vulnerabilities. Use <code>--no-session-persistence</code> to avoid saving a session,
          and consider <code>--bare</code> when you want the cleanest scripted output.
        </p>
        <p>
          Use <code>prUrlTemplate</code> (new in v2.1.119) to point the footer PR badge at a
          custom code-review URL instead of the default github.com link — useful for enterprise
          deployments with internal GitHub instances or custom review tooling:
        </p>
      </Reveal>

      <Reveal delay={490}>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "prUrlTemplate": "https://review.example.internal/pr/{number}"
}`}
        />
      </Reveal>

      <Reveal delay={560}>
        <p>
          The <code>/install-github-app</code> command sets up the official GitHub integration,
          which allows Claude to respond to <code>@claude</code> mentions in PR comments and
          issues.
        </p>
      </Reveal>

      <Reveal delay={630}>
        <Terminal
          script={ciScript}
          title="GitHub Actions — claude -p review"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      {/* ── Mobile Push / autofix-pr / ultrareview ── */}
      <Reveal delay={700}>
        <h3>Mobile Push Notifications</h3>
        <p>
          When Remote Control is active, Claude can send push notifications to your phone. Claude
          decides when to push — typically when a long-running task finishes or when it needs a
          decision to continue. You can also request one in your prompt:{" "}
          <em>notify me when the tests finish</em>. Setup requires the Claude mobile app (iOS or
          Android), signed in with the same account, and <strong>Push when Claude decides</strong>{" "}
          enabled in <code>/config</code>. Requires Claude Code v2.1.110+.
        </p>
      </Reveal>

      <Reveal delay={770}>
        <p>
          For autonomous PR monitoring, <code>/autofix-pr</code> spawns a Claude Code on the web
          session that watches your current branch&apos;s PR. When CI fails or a reviewer leaves a
          comment, Claude investigates and pushes a fix. Pass a prompt to narrow scope:{" "}
          <code>/autofix-pr only fix lint and type errors</code>. It requires the Claude GitHub
          App installed on the repository and access to Claude Code on the web, and is not
          available to organizations with Zero Data Retention enabled.
        </p>
      </Reveal>

      <Reveal delay={840}>
        <Callout tone="info" title="/ultrareview — parallel multi-agent review">
          <code>/ultrareview</code> (new in v2.1.86, highlighted in v2.1.112) runs a
          comprehensive cloud-based code review using parallel multi-agent analysis and critique.
          It requires Claude.ai account authentication — if signed in with an API key only, run{" "}
          <code>/login</code> first. Invoke with no arguments to review your current branch, or{" "}
          <code>/ultrareview &lt;PR#&gt;</code> to fetch and review a specific GitHub PR.
          Pro/Max get 3 free one-time runs per account (does not refresh); each additional review
          costs roughly $5–$20 as extra usage. Team/Enterprise are billed as extra usage with no
          free runs.
        </Callout>
      </Reveal>

      <Reveal delay={910}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`/ultrareview           # review current branch
/ultrareview 456       # review GitHub PR #456`}
        />
      </Reveal>

      {/* ── Section 2: Scheduled Tasks & Routines ── */}
      <Reveal delay={0}>
        <h2>Scheduled Tasks, Routines, and Background Automation</h2>
      </Reveal>

      <Reveal delay={70}>
        <p>
          Claude Code supports multiple scheduling layers. <code>/loop</code> creates
          session-scoped recurring checks while Claude Code is running. Routines are cloud-backed
          scheduled tasks that persist independently of your local terminal — each run clones your
          repo fresh, executes autonomously, and can push branches or open PRs.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`# Check build status every 5 minutes (session-scoped)
/loop 5m check if the build succeeded and summarize any failures

# Create a cloud routine from the CLI
/schedule "run a full security audit at 2am"
/schedule daily PR review at 9am`}
        />
      </Reveal>

      <Reveal delay={210}>
        <h3>Routines</h3>
        <p>
          A routine is a saved Claude Code configuration — a prompt, one or more repositories,
          and a set of connectors — packaged once and run automatically on
          Anthropic-managed infrastructure. Create and manage them from the web at{" "}
          <code>claude.ai/code/routines</code>, from the Desktop app, or via <code>/schedule</code>{" "}
          in the CLI. Use <code>/schedule list</code> to view all routines,{" "}
          <code>/schedule update</code> to modify one, and <code>/schedule run</code> to trigger
          one immediately.
        </p>
        <p>Each routine can have multiple triggers combined:</p>
        <ul>
          <li>
            <strong>Scheduled</strong> — recurring cadence (hourly, daily, weekdays, weekly) or a
            one-off run at a specific time. One-off runs don&apos;t count against the daily
            routine cap. Custom cron expressions are available via <code>/schedule update</code>{" "}
            (minimum interval: 1 hour).
          </li>
          <li>
            <strong>API</strong> — a per-routine HTTP endpoint. POST with a bearer token to
            trigger a run, optionally passing context in a <code>text</code> field. Wire it into
            alerting systems, deploy pipelines, or internal tools.
          </li>
          <li>
            <strong>GitHub</strong> — reacts to repository events like pull requests or releases.
            Filters let you narrow by author, title, labels, base/head branch, draft status, and
            more. Requires the Claude GitHub App installed on the repository.
          </li>
        </ul>
      </Reveal>

      <Reveal delay={280}>
        <Callout tone="note" title="Routine permissions">
          Routines run as full Claude Code cloud sessions with no permission prompts. They can
          use your connected MCP connectors (included by default — remove any that aren&apos;t
          needed). By default, Claude can only push to <code>claude/</code>-prefixed branches;
          enable <strong>Allow unrestricted branch pushes</strong> per repository if needed.
          Routines are available on Pro, Max, Team, and Enterprise plans.
        </Callout>
      </Reveal>

      <Reveal delay={350}>
        <Terminal
          script={scheduleScript}
          title="Routines — /schedule"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      <Reveal delay={420}>
        <h3>Background Automation</h3>
        <p>
          Background subagents with <code>background: true</code> in their frontmatter run
          without blocking the main conversation. This enables workflows where you kick off a
          long analysis, continue other work, and get notified when it completes. Use the
          officially documented task and team hook events in their intended contexts:{" "}
          <code>TaskCompleted</code> for task state changes and <code>TeammateIdle</code> for
          agent teams teammates about to go idle.
        </p>
      </Reveal>

      <Reveal delay={490}>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "hooks": {
    "TaskCompleted": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "curl -X POST $SLACK_WEBHOOK -d '{\"text\": \"Task completed: $TASK_NAME\"}'"
          }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      <Reveal delay={560}>
        <p>
          For long-running research that spans multiple sessions, resumable agents and regular
          memory workflows are the safer mental model: let the agent write findings into memory
          or project docs, then resume the agent or session later when needed.
        </p>
      </Reveal>

      {/* ── Section 3: Dynamic Workflows ── */}
      <Reveal delay={0}>
        <h2>Dynamic Workflows</h2>
      </Reveal>

      <Reveal delay={70}>
        <p>
          Beyond single-session patterns, Claude Code supports <strong>dynamic workflows</strong>{" "}
          — a research-preview feature introduced in v2.1.154 that lets you orchestrate dozens to
          hundreds of subagents from a JavaScript script Claude writes. Unlike <code>/loop</code>{" "}
          or <code>/batch</code>, which run within a single conversation, a workflow moves the
          plan into a script: the script holds the loop, the branching, and the intermediate
          results, so Claude&apos;s context keeps only the final answer.
        </p>
        <p>
          To run a workflow, include the word <code>ultracode</code> anywhere in your prompt (the
          trigger keyword was renamed from <code>workflow</code> to <code>ultracode</code> in
          v2.1.160; asking for one in your own words still works), or turn on{" "}
          <code>/effort ultracode</code> to let Claude plan one for every substantial task. Claude
          writes an orchestration script tailored to your goal, then a runtime executes it in the
          background while your session stays responsive. Resume works within the same Claude Code
          session — if you exit Claude Code while a workflow is running, the next session starts
          the workflow fresh. Dynamic workflows fit codebase-wide audits, large migrations,
          cross-checked research, and any task that needs more agents than one conversation can
          coordinate.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <p>
          The bundled <code>/deep-research &lt;question&gt;</code> workflow automates multi-source
          research: it fans out web searches across several angles, fetches and cross-checks the
          sources it finds, votes on each claim, and returns a cited report with claims that
          didn&apos;t survive cross-checking filtered out. It requires the WebSearch tool to be
          available:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`/deep-research What changed in the Node.js permission model between v20 and v22?`}
        />
      </Reveal>

      <Reveal delay={280}>
        <p>
          Run <code>/workflows</code> to list running and completed workflows and open a progress
          view that shows each phase&apos;s agent count, token total, and elapsed time. When a run
          does what you wanted, select it in the <code>/workflows</code> view and press{" "}
          <kbd>s</kbd> to save its script as a command — it then runs as{" "}
          <code>/&lt;name&gt;</code> in future sessions, alongside the bundled workflows. Reuse
          pays off for recurring work like a weekly code audit or a release checklist.
        </p>
        <p>
          For maximum reasoning depth, <code>/effort ultracode</code> combines <code>xhigh</code>{" "}
          effort with automatic workflow orchestration — Claude decides when a task warrants a
          workflow and coordinates the agents without being asked. It lasts for the current
          session; drop back with <code>/effort high</code> for routine work.
        </p>
      </Reveal>

      <Reveal delay={350}>
        <Callout tone="warn" title="Dynamic workflow requirements">
          Dynamic workflows require Claude Code v2.1.154+ and are available on all paid plans
          (Pro, Max, Team, Enterprise). On Pro, turn them on from the Dynamic workflows row in{" "}
          <code>/config</code>. To disable them, toggle Dynamic workflows off in{" "}
          <code>/config</code>, set <code>&quot;disableWorkflows&quot;: true</code> in settings,
          or set <code>CLAUDE_CODE_DISABLE_WORKFLOWS=1</code>. Dynamic workflows are also
          available on Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Foundry (Claude Code
          v2.1.154+).
        </Callout>
      </Reveal>

      <Reveal delay={420}>
        <Terminal
          script={workflowScript}
          title="ultrareview + dynamic workflows"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      {/* ── Section 4: Multi-Step Workflow Patterns ── */}
      <Reveal delay={0}>
        <h2>Multi-Step Workflow Patterns</h2>
      </Reveal>

      <Reveal delay={70}>
        <p>
          The most reliable workflows combine skills, hooks, and subagents into a pipeline where
          each step has clear inputs, outputs, and error handling.
        </p>
        <p>
          The <strong>&ldquo;develop and verify&rdquo;</strong> pattern pairs a <code>Stop</code>{" "}
          prompt hook that checks completion criteria against an implementation skill. When Claude
          stops, the hook evaluates whether all requirements were met. If not, it tells Claude
          what&apos;s missing and Claude continues:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Check: 1) Were all files in the spec modified? 2) Do tests pass? 3) Is the implementation complete per the requirements? If anything is incomplete, explain what remains.",
            "timeout": 30
          }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      <Reveal delay={210}>
        <p>
          The <strong>&ldquo;parallel review&rdquo;</strong> pattern uses Agent Teams
          (experimental, disabled by default — requires{" "}
          <code>CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1</code>) to have multiple specialists
          review simultaneously. One agent checks security, another checks performance, another
          checks test coverage. The team lead synthesizes their findings into a single report.
          Agent Teams have known limitations around session resumption, task coordination, and
          shutdown behavior.
        </p>
      </Reveal>

      <Reveal delay={280}>
        <p>
          For tasks that modify many files across a codebase, <code>/batch &lt;instruction&gt;</code>{" "}
          plans the work, splits it across background agents in isolated git worktrees, and is
          designed for large-scale refactors or repetitive changes. Depending on the workflow, it
          can also run verification steps and help open PRs for the results.
        </p>
        <p>
          Git worktrees (<code>isolation: worktree</code> on subagents) are also useful for
          experimental work. The agent makes changes in an isolated branch, returns the worktree
          path when done, and you review or discard without affecting your working tree.
        </p>
      </Reveal>

      <Reveal delay={350}>
        <Callout tone="tip" title="Workflow composition strategy">
          Combine these patterns: use a Routine to trigger a scheduled run, have it spawn a
          dynamic workflow that orchestrates subagents in worktrees, and wire a{" "}
          <code>TaskCompleted</code> hook to post a Slack notification when every agent finishes.
          Each layer adds reliability without complicating any individual piece.
        </Callout>
      </Reveal>

      {/* ── Quiz ── */}
      <Reveal delay={420}>
        <Quiz questions={quizQuestions} title="Workflows — Quick Check" />
      </Reveal>
    </Prose>
  );
}
