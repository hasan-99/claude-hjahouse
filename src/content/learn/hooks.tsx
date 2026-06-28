import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Prose, Quiz, type QuizQuestion } from "@/components/content";

/* ─── Terminal demo script ─── */
const hookDemo: Step[] = [
  { t: "print", text: "# Claude Code hook system demo", tone: "muted" },
  { t: "wait", ms: 400 },
  { t: "type", text: "claude 'add a .env file with API_KEY=secret'", prompt: "$" },
  { t: "out", lines: [
    { text: "Claude: I'll create .env with that variable.", tone: "system" },
    { text: "[PreToolUse] matcher: Write — running security-check.sh …", tone: "amber" },
    { text: "⚠  Hook blocked: .env file contains potential secret (API_KEY)", tone: "error" },
    { text: "Claude: I cannot write .env files containing raw secrets.", tone: "system" },
  ], gap: 80 },
  { t: "wait", ms: 600 },
  { t: "type", text: "claude 'refactor utils.ts and format it'", prompt: "$" },
  { t: "out", lines: [
    { text: "Claude: Editing src/utils.ts …", tone: "system" },
    { text: "[PostToolUse] matcher: Write|Edit — running prettier …", tone: "amber" },
    { text: "src/utils.ts formatted successfully ✓", tone: "green" },
    { text: "Claude: Done. File is formatted and committed.", tone: "system" },
  ], gap: 80 },
  { t: "wait", ms: 600 },
  { t: "type", text: "claude 'run the full test suite and summarise'", prompt: "$" },
  { t: "out", lines: [
    { text: "Claude: Running tests …", tone: "system" },
    { text: "[Stop] prompt hook — verifying completion criteria …", tone: "amber" },
    { text: "✓ All 47 tests passing. PR description updated.", tone: "green" },
    { text: "Claude: Task complete. All checks passed.", tone: "system" },
  ], gap: 80 },
  { t: "wait", ms: 800 },
  { t: "clear" },
];

/* ─── Quiz ─── */
const questions: QuizQuestion[] = [
  {
    q: "Which exit code causes a PreToolUse hook to block the tool and show an error to Claude?",
    options: ["Exit code 0", "Exit code 1", "Exit code 2", "Exit code 3"],
    answer: 2,
    explanation:
      "Exit code 2 is the blocking exit code. Claude stops and shows your stderr message. Exit code 0 means success, and any other non-zero code is a non-blocking warning shown only in verbose mode.",
  },
  {
    q: "What is the purpose of the `matcher` field in a hook definition?",
    options: [
      "It specifies which shell interpreter to use",
      "It is a regex pattern matched against the tool name to decide when the hook fires",
      "It sets the hook's execution timeout in seconds",
      "It selects which user's session the hook applies to",
    ],
    answer: 1,
    explanation:
      "The `matcher` field is a regex pattern matched against the tool name. For example, `\"Bash\"` matches exactly, `\"Write|Edit\"` matches either, and `\"mcp__github__.*\"` matches all GitHub MCP tools.",
  },
  {
    q: "What does the `once: true` flag do in a skill's hook frontmatter?",
    options: [
      "Runs the hook only the first time it fires per matching tool call",
      "Runs the hook only once per session instead of on every matching tool use",
      "Prevents the hook from running more than once per file",
      "Limits the hook timeout to one second",
    ],
    answer: 1,
    explanation:
      "The `once: true` flag runs the hook only once per session rather than on every matching tool use. This is useful for setup checks that only need to happen once — for example, a production safety check at the start of a deploy skill.",
  },
  {
    q: "Which hook event can block Claude Code from compacting the conversation?",
    options: ["PostCompact", "PreToolUse", "PreCompact", "UserPromptSubmit"],
    answer: 2,
    explanation:
      "PreCompact runs just before Claude Code compresses the conversation. It can block compaction by exiting with code 2 or by returning a JSON decision payload `{\"decision\": \"block\", \"reason\": \"...\"}`. PostCompact fires after compaction succeeds and is the right place to re-attach notes or log what was preserved.",
  },
];

export default function Content() {
  return (
    <Prose>
      {/* ── Intro ── */}
      <Reveal delay={0}>
        <p>
          Hooks are scripts that execute automatically when specific events occur during a Claude
          Code session. They receive JSON input via stdin and communicate results through exit
          codes and JSON output. Command hooks are deterministic, composable, testable, and
          language-agnostic. Prompt hooks and agent hooks use a Claude model for evaluation, so
          their behavior is non-deterministic. This module covers the hook system, the key
          events, and how to write useful hooks.
        </p>
      </Reveal>

      {/* ── Live demo ── */}
      <Reveal delay={70}>
        <Terminal
          script={hookDemo}
          title="hooks demo"
          loop
          showStatus
          className="my-8"
        />
      </Reveal>

      {/* ══════════════════════════════════════════════
          SECTION 1 — Architecture & Configuration
      ══════════════════════════════════════════════ */}
      <Reveal delay={0}>
        <h2>Hook Architecture and Configuration</h2>
        <p>
          Hooks are configured in settings files under a <code>hooks</code> key. Each event has
          an array of matchers, and each matcher has an array of hook definitions. The{" "}
          <code>matcher</code> field is a regex pattern matched against the tool name —{" "}
          <code>&quot;Bash&quot;</code> matches exactly, <code>&quot;Write|Edit&quot;</code>{" "}
          matches either, <code>&quot;*&quot;</code> matches all tools, and{" "}
          <code>&quot;mcp__github__.*&quot;</code> matches all GitHub MCP tools.
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename=".claude/settings.json"
          lang="json"
          code={`{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 \\"$CLAUDE_PROJECT_DIR/.claude/hooks/validate-bash.py\\"",
            "timeout": 10
          }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          Matchers also support a conditional <code>if</code> field (v2.1.85) that uses
          permission rule syntax to further filter when a hook fires. While <code>matcher</code>{" "}
          selects the tool by name, <code>if</code> narrows to specific invocations of that
          tool. This is useful when you only care about a subset of a tool&apos;s calls — for
          example, intercepting <code>git push</code> commands without running on every Bash
          invocation:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".claude/settings.json"
          lang="json"
          code={`{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "if": "Bash(git push*)",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/check-push.sh"
          }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      <Reveal delay={280}>
        <Callout tone="info" title="if field syntax">
          The <code>if</code> pattern follows the same syntax as permission rules —{" "}
          <code>Bash(git *)</code> matches any git command,{" "}
          <code>Write(src/**/test_*.py)</code> matches test file writes. A hook with an{" "}
          <code>if</code> field only triggers when both the <code>matcher</code> and the{" "}
          <code>if</code> condition match.
        </Callout>
      </Reveal>

      {/* ── 30 hook events overview ── */}
      <Reveal delay={0}>
        <h3>The 30 Hook Events</h3>
        <p>
          Claude Code supports 30 hook events. The most useful for day-to-day work are:
        </p>
        <ul>
          <li>
            <strong>PreToolUse</strong> — validate before a tool runs, can block.
          </li>
          <li>
            <strong>PostToolUse</strong> — observe or react after, can add context or replace
            output.
          </li>
          <li>
            <strong>UserPromptSubmit</strong> — intercept user input before Claude processes it.
          </li>
          <li>
            <strong>Stop</strong> — run checks when Claude finishes responding.
          </li>
        </ul>
        <p>
          There are also events for permission handling (<code>PermissionRequest</code>),
          notifications, subagent lifecycle (<code>SubagentStart</code>,{" "}
          <code>SubagentStop</code>), failures (<code>PostToolUseFailure</code>,{" "}
          <code>StopFailure</code>), config changes, file watching (<code>FileChanged</code>),
          context compaction (<code>PreCompact</code>, <code>PostCompact</code>), and worktree
          management.
        </p>
      </Reveal>

      {/* ── Newer events ── */}
      <Reveal delay={70}>
        <h3>Newer Lifecycle Events</h3>
        <p>
          Several newer events expand what hooks can react to:
        </p>
        <ul>
          <li>
            <strong>CwdChanged</strong> (v2.1.83) — fires when the working directory changes,
            enabling direnv-like reactive environment management.
          </li>
          <li>
            <strong>TaskCreated</strong> (v2.1.84) — fires when the <code>TaskCreate</code>{" "}
            tool is used, so you can log or validate new tasks as they&apos;re spawned.
          </li>
          <li>
            <strong>WorktreeCreate</strong> (v2.1.84) — fires when a worktree agent is created;
            supports <code>type: &quot;http&quot;</code> for remote notifications.
          </li>
          <li>
            <strong>Elicitation</strong> (v2.1.76) — fires when an MCP server requests
            structured user input mid-task via an interactive dialog. Can intercept and modify
            the elicitation before it&apos;s shown to the user.
          </li>
          <li>
            <strong>ElicitationResult</strong> (v2.1.76) — fires after the user responds to an
            MCP elicitation. Can intercept and override the response before it&apos;s sent back
            to the MCP server.
          </li>
        </ul>
      </Reveal>

      {/* ── PreCompact / PostCompact ── */}
      <Reveal delay={140}>
        <h3>PreCompact and PostCompact</h3>
        <p>
          <code>PreCompact</code> runs just before Claude Code compresses the conversation to
          free context, and it can block compaction from happening — useful when you want to
          snapshot state, warn the user, or veto an auto-compaction that would drop critical
          context. The event&apos;s <code>matcher</code> distinguishes what triggered it:{" "}
          <code>&quot;manual&quot;</code> when the user ran <code>/compact</code>, and{" "}
          <code>&quot;auto&quot;</code> when Claude Code compacted automatically because the
          context filled up.
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".claude/settings.json"
          lang="json"
          code={`{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "auto",
        "hooks": [
          { "type": "command", "command": "./scripts/snapshot-context.sh" }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      <Reveal delay={280}>
        <Callout tone="note" title="Blocking compaction">
          Return{" "}
          <code>
            {`{"decision": "block", "reason": "active refactor in flight"}`}
          </code>{" "}
          from the script to keep the conversation as-is. <code>PostCompact</code> fires after
          compaction succeeds — the right place to re-attach notes, re-invoke a skill, or log
          what was preserved.
        </Callout>
      </Reveal>

      {/* ── Reading JSON input ── */}
      <Reveal delay={0}>
        <h3>Reading Hook Input</h3>
        <p>
          Hook scripts receive JSON via stdin and have access to several environment variables
          automatically set by Claude Code. <code>CLAUDE_CODE_SESSION_ID</code> contains the
          unique session identifier — use it to correlate hook logs and external telemetry with
          a specific session.
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename="hooks/read-input.py"
          lang="python"
          code={`import json, sys, os

data = json.load(sys.stdin)
tool_name  = data.get("tool_name", "")
tool_input = data.get("tool_input", {})
session_id = os.environ.get("CLAUDE_CODE_SESSION_ID", "")`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          Exit code <strong>0</strong> means success (parse JSON stdout for output). Exit code{" "}
          <strong>2</strong> means blocking error — Claude stops and shows your stderr message.
          Any other exit code is a non-blocking warning shown in verbose mode.
        </p>
        <p>
          Hook input also includes an <code>effort</code> object with the active effort level:{" "}
          <code>{`{ "effort": { "level": "medium" } }`}</code>. Available levels are{" "}
          <code>low</code>, <code>medium</code>, <code>high</code>, <code>xhigh</code>,{" "}
          <code>max</code>, and <code>auto</code>. The same value is also available as the{" "}
          <code>$CLAUDE_EFFORT</code> environment variable:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename="hooks/read-effort.py"
          lang="python"
          code={`import json, os, sys

data = json.load(sys.stdin)
effort_level = data.get("effort", {}).get("level", "medium")  # from JSON
effort_env   = os.environ.get("CLAUDE_EFFORT", "medium")      # from env var`}
        />
      </Reveal>

      {/* ══════════════════════════════════════════════
          SECTION 2 — Hook Types and Patterns
      ══════════════════════════════════════════════ */}
      <Reveal delay={0}>
        <h2>Common Hook Types and Patterns</h2>

        <h3>Shell Form vs Exec Form</h3>
        <p>
          Command hooks support two forms. <strong>Shell form</strong> (default) passes the{" "}
          <code>command</code> string to a shell for tokenization. <strong>Exec form</strong>{" "}
          sets an <code>args</code> array alongside the <code>command</code>, spawning the
          process directly without a shell — this avoids shell escaping issues and is more
          secure for commands with user-supplied arguments:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename=".claude/settings.json"
          lang="json"
          code={`{
  "type": "command",
  "command": "node",
  "args": ["./scripts/validate.js", "--strict"]
}`}
        />
      </Reveal>

      {/* ── Five hook types ── */}
      <Reveal delay={140}>
        <h3>The Five Hook Types</h3>
        <p>Hooks can run five ways:</p>
        <ul>
          <li>
            <strong>command</strong> — execute local shell commands.
          </li>
          <li>
            <strong>prompt</strong> — ask Claude to evaluate a prompt, usually on{" "}
            <code>Stop</code> or <code>SubagentStop</code>.
          </li>
          <li>
            <strong>agent</strong> — spawn a subagent for multi-step validation (unlike prompt
            hooks, can use tools).
          </li>
          <li>
            <strong>http</strong> — POST the same JSON payload to a webhook endpoint, useful
            for remote logging or policy services. HTTP hooks support environment-variable
            interpolation in headers (variables must be explicitly allowlisted).
          </li>
          <li>
            <strong>mcp_tool</strong> — invoke an MCP tool directly, useful when a hook needs
            to call an external service (like posting to Slack or creating a GitHub issue)
            without shelling out. Note: the in-app config builder does not yet generate{" "}
            <code>mcp_tool</code> hooks.
          </li>
        </ul>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".claude/settings.json — mcp_tool example"
          lang="json"
          code={`{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "mcp_tool",
            "server": "slack",
            "tool": "send_message",
            "input": { "channel": "#deploys", "text": "Claude finished the task" }
          }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      {/* ── duration_ms ── */}
      <Reveal delay={280}>
        <Callout tone="tip" title="duration_ms field">
          <code>PostToolUse</code> and <code>PostToolUseFailure</code> hook inputs include a{" "}
          <code>duration_ms</code> field with the tool&apos;s execution time in milliseconds
          (excluding permission prompts and PreToolUse hooks). Use it to track slow tools or
          set up alerts when a tool exceeds a threshold.
        </Callout>
      </Reveal>

      {/* ── Stop / SubagentStop background_tasks ── */}
      <Reveal delay={0}>
        <h3>Stop and SubagentStop — background_tasks and session_crons</h3>
        <p>
          <code>Stop</code> and <code>SubagentStop</code> hook inputs now also carry{" "}
          <code>background_tasks</code> and <code>session_crons</code> arrays.{" "}
          <code>background_tasks</code> lists the bash commands and subagents still running in
          the background when the turn ended; <code>session_crons</code> lists scheduled tasks
          attached to the session. A completion-gate hook can use these to keep Claude working
          until everything actually wraps:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename="hooks/completion-gate.py"
          lang="python"
          code={`import json, sys

data = json.load(sys.stdin)

pending_bg   = [t for t in data.get("background_tasks", [])
                if t.get("status") in ("running", "starting")]
pending_cron = data.get("session_crons", [])

if pending_bg or pending_cron:
    print(json.dumps({
        "decision": "block",
        "reason": (
            f"{len(pending_bg)} background task(s) and "
            f"{len(pending_cron)} scheduled task(s) still active"
        )
    }))
    sys.exit(0)`}
        />
      </Reveal>

      {/* ══════════════════════════════════════════════
          SECTION 3 — Common Patterns
      ══════════════════════════════════════════════ */}
      <Reveal delay={0}>
        <h2>Common Hook Patterns</h2>

        <h3>Auto-formatting on File Save</h3>
        <p>
          Auto-formatting on file save is one of the most useful hooks. A{" "}
          <code>PostToolUse</code> hook on <code>Write|Edit</code> runs your formatter
          automatically, so Claude&apos;s output is always clean:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename=".claude/hooks/format-on-write.sh"
          lang="bash"
          code={`#!/bin/bash
INPUT=$(cat)
FILE=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))")

case "$FILE" in
  *.ts|*.tsx|*.js) prettier --write "$FILE" 2>/dev/null ;;
  *.py)            black "$FILE" 2>/dev/null ;;
  *.go)            gofmt -w "$FILE" 2>/dev/null ;;
esac

exit 0`}
        />
      </Reveal>

      {/* ── Security scanning ── */}
      <Reveal delay={140}>
        <h3>Security Scanning on Writes</h3>
        <p>
          Security scanning on writes uses <code>PostToolUse</code> with{" "}
          <code>additionalContext</code> output to warn Claude about potential secrets it just
          wrote:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".claude/hooks/security-scan.py"
          lang="python"
          code={`import json, re, sys

SECRET_PATTERNS = [
    (r"api[_-]?key\s*=\s*['\"][^'\"]+['\"]", "Potential hardcoded API key"),
    (r"password\s*=\s*['\"][^'\"]+['\"]",     "Potential hardcoded password"),
]

data    = json.load(sys.stdin)
content = data.get("tool_result", "")
warnings = []

for pattern, message in SECRET_PATTERNS:
    if re.search(pattern, content, re.IGNORECASE):
        warnings.append(message)

if warnings:
    output = {
        "hookSpecificOutput": {
            "hookEventName": "PostToolUse",
            "additionalContext": f"Security warnings: {'; '.join(warnings)}"
        }
    }
    print(json.dumps(output))

sys.exit(0)`}
        />
      </Reveal>

      {/* ── updatedToolOutput ── */}
      <Reveal delay={280}>
        <h3>Replacing Tool Output with updatedToolOutput</h3>
        <p>
          <code>PostToolUse</code> hooks can replace the tool&apos;s output entirely via{" "}
          <code>updatedToolOutput</code>. Claude sees the replaced content instead of the
          original. This works for all tools (not just MCP) as of v2.1.121:
        </p>
      </Reveal>

      <Reveal delay={350}>
        <CodeBlock
          filename=".claude/hooks/sanitize-output.py"
          lang="python"
          code={`import json, sys

data      = json.load(sys.stdin)
original  = data.get("tool_result", "")
sanitized = original.replace("/home/user", "~")

output = {
    "hookSpecificOutput": {
        "updatedToolOutput": sanitized
    }
}
print(json.dumps(output))`}
        />
      </Reveal>

      {/* ── Blocking dangerous commands ── */}
      <Reveal delay={0}>
        <h3>Blocking Dangerous Commands</h3>
        <p>
          Blocking dangerous commands uses <code>PreToolUse</code> with a regex check and exit
          code 2:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename=".claude/hooks/block-dangerous.py"
          lang="python"
          code={`import json, re, sys

data    = json.load(sys.stdin)
command = data.get("tool_input", {}).get("command", "")

BLOCKED = [
    (r"\brm\s+-rf\s+/",   "Blocking dangerous rm -rf /"),
    (r"\bdrop\s+table\b", "Blocking DROP TABLE statement"),
]

for pattern, message in BLOCKED:
    if re.search(pattern, command, re.IGNORECASE):
        print(message, file=sys.stderr)
        sys.exit(2)  # exit 2 = blocking error

sys.exit(0)`}
        />
      </Reveal>

      {/* ══════════════════════════════════════════════
          SECTION 4 — Prompt Hooks and Component Scope
      ══════════════════════════════════════════════ */}
      <Reveal delay={0}>
        <h2>Advanced: Prompt Hooks and Component Scope</h2>

        <h3>Prompt Hooks</h3>
        <p>
          For <code>Stop</code> and <code>SubagentStop</code> events, hook type{" "}
          <code>&quot;prompt&quot;</code> uses an LLM to evaluate task completion. The LLM
          reads the conversation and returns a structured decision on whether to let Claude stop
          or continue working. This is powerful for tasks with explicit completion criteria:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename=".claude/settings.json"
          lang="json"
          code={`{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Check: 1) Were all files modified? 2) Do tests pass? 3) Is the PR description updated? If anything is missing, explain what.",
            "timeout": 30
          }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      {/* ── Agent hooks ── */}
      <Reveal delay={140}>
        <h3>Agent Hooks</h3>
        <p>
          Hook type <code>&quot;agent&quot;</code> spawns a subagent to do the evaluation —
          unlike prompt hooks (single-turn), agent hooks can use tools and perform multi-step
          reasoning. Use this when the check requires reading files or running commands.
        </p>
      </Reveal>

      {/* ── Skill-scoped hooks ── */}
      <Reveal delay={210}>
        <h3>Hooks Scoped to Skills and Agents</h3>
        <p>
          Hooks can be scoped to individual skills and agents using the <code>hooks</code>{" "}
          frontmatter field. A <code>PreToolUse</code> hook in a skill&apos;s frontmatter only
          fires during that skill&apos;s execution:
        </p>
      </Reveal>

      <Reveal delay={280}>
        <CodeBlock
          filename=".claude/skills/production-deploy.md"
          lang="yaml"
          code={`---
name: production-deploy
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/production-safety-check.sh"
          once: true
---`}
        />
      </Reveal>

      <Reveal delay={350}>
        <Callout tone="tip" title="once: true">
          The <code>once: true</code> flag runs the hook only once per session rather than on
          every matching tool use. This is useful for setup checks that only need to happen
          once — for example, checking production credentials at the beginning of a deploy
          skill.
        </Callout>
      </Reveal>

      {/* ── continueOnBlock ── */}
      <Reveal delay={0}>
        <h3>continueOnBlock for PostToolUse</h3>
        <p>
          For <code>PostToolUse</code> hooks, the <code>continueOnBlock</code> config option
          feeds the hook&apos;s rejection reason back to Claude as context and continues the
          turn instead of ending it. Without <code>continueOnBlock</code>, a blocking{" "}
          <code>PostToolUse</code> hook terminates the turn immediately. With it, Claude sees
          the reason and can adjust its approach — useful for lint checks or style enforcement
          where you want Claude to self-correct rather than stop.
        </p>
      </Reveal>

      <Reveal delay={70}>
        <h3>Terminal Sequences and Headless Notifications</h3>
        <p>
          Hooks also support a <code>terminalSequence</code> field in their JSON output, which
          lets hooks emit desktop notifications, window titles, and bells without needing a
          controlling terminal — useful for headless or remote sessions.
        </p>
      </Reveal>

      {/* ── Terminal demo 2: blocking ── */}
      <Reveal delay={140}>
        <Terminal
          script={[
            { t: "print", text: "# PreToolUse blocking example", tone: "muted" },
            { t: "wait", ms: 300 },
            { t: "type", text: "# Claude tries to run rm -rf /tmp/deploy", prompt: "$" },
            { t: "out", lines: [
              { text: "[PreToolUse] Bash — running block-dangerous.py …", tone: "amber" },
              { text: "Blocking dangerous rm -rf /", tone: "error" },
              { text: "Hook exited with code 2 — tool blocked.", tone: "error" },
              { text: "Claude: I cannot run that command. Adjusting approach.", tone: "system" },
            ], gap: 90 },
            { t: "wait", ms: 700 },
            { t: "clear" },
            { t: "print", text: "# PostToolUse auto-format example", tone: "muted" },
            { t: "wait", ms: 300 },
            { t: "type", text: "# Claude writes src/utils.ts", prompt: "$" },
            { t: "out", lines: [
              { text: "[PostToolUse] Write — running format-on-write.sh …", tone: "amber" },
              { text: "src/utils.ts 2.1kB formatted with Prettier ✓", tone: "green" },
              { text: "Exit 0 — hook succeeded.", tone: "muted" },
            ], gap: 90 },
            { t: "wait", ms: 800 },
            { t: "clear" },
          ]}
          title="hook execution"
          loop
          showStatus
          className="my-8"
        />
      </Reveal>

      {/* ══════════════════════════════════════════════
          QUIZ
      ══════════════════════════════════════════════ */}
      <Reveal delay={0}>
        <Quiz questions={questions} title="Hooks — Quick check" />
      </Reveal>
    </Prose>
  );
}
