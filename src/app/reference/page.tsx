import { Container, PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { Callout, Kbd } from "@/components/content";
import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Data tables                                                          */
/* ------------------------------------------------------------------ */

interface Row {
  cmd: string;
  desc: string;
  example?: string;
}

const slashCommands: Row[] = [
  { cmd: "/help", desc: "Show available commands and usage hints." },
  { cmd: "/clear", desc: "Start a fresh conversation. CLAUDE.md instructions stay active." },
  { cmd: "/compact", desc: "Summarize conversation to reduce context usage. Accepts focus instructions.", example: "/compact focus on the auth module" },
  { cmd: "/context", desc: "Show context window usage with a visual breakdown of token allocation." },
  { cmd: "/diff", desc: "Open an interactive viewer for uncommitted changes." },
  { cmd: "/model", desc: "Switch between Sonnet, Opus, and Haiku mid-session.", example: "/model opus" },
  { cmd: "/cost", desc: "Show session token usage and estimated cost." },
  { cmd: "/status", desc: "Show current version, model, and account info." },
  { cmd: "/cd", desc: "Move the session to a new working directory without breaking the prompt cache mid-session.", example: "/cd ../api" },
  { cmd: "/doctor", desc: "Run a health check on your Claude Code installation." },
  { cmd: "/init", desc: "Scan your project and generate a starter CLAUDE.md." },
  { cmd: "/memory", desc: "View and edit CLAUDE.md memory files (global, project, auto)." },
  { cmd: "/review", desc: "Review code changes on the current branch with suggestions." },
  { cmd: "/permissions", desc: "View and manage tool permissions. Configure in .claude/settings.json." },
  { cmd: "/config", desc: "Open Claude Code configuration and settings." },
  { cmd: "/login", desc: "Switch Anthropic accounts." },
  { cmd: "/branch", desc: "Fork conversation into a parallel branch to explore alternatives." },
  { cmd: "/rewind", desc: "Roll back to a previous message and undo file changes after that point." },
  { cmd: "/resume", desc: "Resume a previously saved session by name or ID.", example: "/resume auth-refactor" },
  { cmd: "/rename", desc: "Rename the current session for easier recall later." },
  { cmd: "/export", desc: "Export the conversation to a markdown file.", example: "/export session-review.md" },
  { cmd: "/effort", desc: "Set reasoning depth: low, medium, high, xhigh, or max (session-only). /effort ultracode adds automatic workflow orchestration on top of xhigh.", example: "/effort high" },
  { cmd: "/plan", desc: "Enter planning mode — Claude researches first, then presents a plan for approval.", example: "/plan migrate from REST to GraphQL" },
  { cmd: "/btw", desc: "Ask a side question without adding it to conversation history.", example: "/btw what's the syntax for a TS generic constraint?" },
  { cmd: "/batch", desc: "Split work across parallel agents in isolated git worktrees.", example: "/batch add JSDoc to all exported functions" },
  { cmd: "/loop", desc: "Run a task on a recurring interval within your session.", example: "/loop 5m check if the build succeeded" },
  { cmd: "/schedule", desc: 'Create a cloud-backed scheduled task that runs even when offline.', example: '/schedule "run security audit every Monday at 9am"' },
  { cmd: "/workflows", desc: "List and manage running and completed dynamic workflows; open a run's progress view, and press s to save a run's script as a /command. Start a workflow by including 'ultracode' in your prompt or with /effort ultracode." },
  { cmd: "/deep-research", desc: "Bundled dynamic workflow that fans out web searches, cross-checks sources, and returns a cited report with weak claims filtered out. Requires the WebSearch tool.", example: "/deep-research what changed in the Node.js permission model between v20 and v22?" },
  { cmd: "/debug", desc: "Toggle verbose mode to see tool calls and thinking steps. Also Ctrl+O." },
  { cmd: "/code-review", desc: "Review the current diff for correctness bugs. Accepts an effort level (low/medium/high/xhigh/max/ultra) and --comment to post inline comments on the current GitHub PR.", example: "/code-review high --comment" },
  { cmd: "/code-review ultra", desc: "Run a deep, multi-agent code review in a cloud sandbox using parallel analysis and critique. /ultrareview is an alias.", example: "/code-review ultra 128" },
  { cmd: "/simplify", desc: "Cleanup-only review that applies fixes (reuse, simplification, efficiency, abstraction level) without hunting for bugs." },
  { cmd: "/security-review", desc: "Security-focused review of pending changes. Read-only — never edits files." },
  { cmd: "/agents", desc: "List, create, edit, or remove subagent definitions." },
  { cmd: "/mcp", desc: "Show active MCP server connections and available tools." },
  { cmd: "/plugin", desc: "Manage plugins — install, list, remove, or reload.", example: "/plugin install pr-review" },
  { cmd: "/reload-plugins", desc: "Hot-reload all plugin files during development." },
  { cmd: "/goal", desc: "Set a completion condition Claude works toward across turns. Shows live elapsed time, turns, and tokens.", example: "/goal migrate all API endpoints from REST to GraphQL" },
  { cmd: "/recap", desc: "Generate a one-line summary of the current session. Also runs automatically when returning to the terminal after stepping away." },
  { cmd: "/fewer-permission-prompts", desc: "Scan recent transcripts for common read-only tool calls and propose an allowlist to reduce permission prompts." },
  { cmd: "/tui", desc: "Switch between classic and flicker-free fullscreen rendering mid-conversation." },
  { cmd: "/focus", desc: "Toggle focus view for distraction-free input." },
  { cmd: "/sandbox", desc: "Enable OS-level isolation for file system and network access." },
  { cmd: "/usage-credits", desc: "View and manage usage credits on your account. Renamed from /extra-usage in v2.1.144; the old name still works." },
];

const keyboardShortcuts: Row[] = [
  { cmd: "Shift+Tab", desc: "Cycle through permission modes: default → plan → acceptEdits → auto." },
  { cmd: "Option+T / Alt+T", desc: "Toggle extended thinking on or off." },
  { cmd: "Ctrl+C", desc: "Cancel the current operation or stop a running command." },
  { cmd: "Ctrl+D", desc: "Exit Claude Code from the terminal." },
  { cmd: "Ctrl+B", desc: "Background a currently running subagent task." },
  { cmd: "Ctrl+O", desc: "Toggle verbose/debug mode (same as /debug)." },
  { cmd: "Ctrl+R", desc: "Reverse search command history across all projects. Press Ctrl+S to cycle scope." },
  { cmd: "Ctrl+G", desc: "Open the current plan in an external editor." },
  { cmd: "Ctrl+K", desc: "Open site search on claude.hjahouse.me." },
  { cmd: "Esc", desc: "Dismiss the active dialog or current suggestion." },
];

const cliFlags: Row[] = [
  { cmd: 'claude -p "prompt"', desc: "Run a one-shot prompt non-interactively. Foundation for CI/CD integration.", example: 'echo "$DIFF" | claude -p "review these changes for security issues"' },
  { cmd: "--output-format json", desc: "Return structured JSON output. Useful for parsing in scripts and pipelines.", example: 'claude -p "analyze this" --output-format json' },
  { cmd: "--model <name>", desc: "Override the default model for a single invocation.", example: 'claude --model opus "redesign the database schema"' },
  { cmd: "--permission-mode <mode>", desc: "Start in a specific permission mode (default, acceptEdits, plan, auto, dontAsk, or bypassPermissions).", example: 'claude -p "run tests" --permission-mode bypassPermissions' },
  { cmd: "--sandbox", desc: "Enable OS-level isolation for safe automated analysis." },
  { cmd: "--safe-mode", desc: "Start with all customizations (CLAUDE.md, plugins, skills, hooks, MCP servers) disabled for troubleshooting. Same as CLAUDE_CODE_SAFE_MODE=1." },
  { cmd: "--max-turns <n>", desc: "Cap execution to n turns. Useful for time-limiting automated runs." },
  { cmd: "--no-session-persistence", desc: "Don't save session data. Good for disposable automation tasks." },
  { cmd: "--resume", desc: "Resume the most recent Claude Code session." },
  { cmd: "--continue", desc: "Continue a paused workflow from the current repository." },
  { cmd: "--agent <name>", desc: "Start a session with a specific subagent.", example: "claude --agent security-reviewer" },
  { cmd: "--plugin-dir <path>", desc: "Load a plugin for this session only (for testing).", example: "claude --plugin-dir ./my-plugin" },
  { cmd: "--bare", desc: "Cleanest output for scripted usage. No formatting or decoration." },
  { cmd: "--worktree", desc: "Run in an isolated git worktree for experimental work." },
  { cmd: "--dangerously-skip-permissions", desc: "Skip all permission prompts. Equivalent to --permission-mode bypassPermissions." },
  { cmd: "claude project purge [path]", desc: "Delete all Claude Code state for a project. Supports --dry-run, --all, -y, and -i flags.", example: "claude project purge --dry-run" },
  { cmd: "--plugin-url <url>", desc: "Fetch a plugin .zip from a URL for the current session. Repeatable for multiple plugins.", example: "claude --plugin-url https://example.com/my-plugin.zip" },
  { cmd: "claude agents", desc: "Open the agent view — a roster of all sessions showing state, last activity, and running status." },
  { cmd: "claude agents --json", desc: "Print the session roster as a JSON array for scripting.", example: "claude agents --json | jq '.[] | select(.status == \"waiting\")'" },
  { cmd: "claude plugin details <name>", desc: "Show a plugin's component inventory and projected token cost per session.", example: "claude plugin details pr-review" },
  { cmd: "claude plugin prune", desc: "Remove auto-installed plugin dependencies no longer required by any installed plugin.", example: "claude plugin uninstall pr-review --prune" },
  { cmd: "claude plugin enable <name>", desc: "Re-enable a previously disabled plugin without re-installing. Accepts --scope user|project|local.", example: "claude plugin enable formatter --scope project" },
  { cmd: "claude plugin disable <name>", desc: "Disable an installed plugin without uninstalling it.", example: "claude plugin disable formatter --scope project" },
  { cmd: "--add-dir <path>", desc: "Extend working directories with read/edit access for this session. Repeatable.", example: "claude --add-dir ../shared-types" },
  { cmd: "--mcp-config <file>", desc: "Load MCP servers from one or more JSON files. Pair with --strict-mcp-config to ignore other sources.", example: "claude --strict-mcp-config --mcp-config ./repro.json" },
  { cmd: "--channels <plugin>", desc: "Enable channel plugins that push events (chat messages, webhooks) into the running session.", example: "claude --channels plugin:telegram@claude-plugins-official" },
  { cmd: "claude auth login", desc: "Authenticate with OAuth. In headless environments (WSL2, SSH), paste the code manually." },
];

const configFiles: Row[] = [
  { cmd: "CLAUDE.md", desc: "Project-level instructions, conventions, and workflow notes. Committed to git and shared with the team." },
  { cmd: "CLAUDE.local.md", desc: "Personal overrides for CLAUDE.md. Git-ignored, not shared." },
  { cmd: ".claude/settings.json", desc: "Project settings: permissions, hooks, MCP servers. Committed to git.", example: '{ "permissions": { "allow": ["Bash(npm run test)"], "deny": ["Bash(rm -rf /)"] } }' },
  { cmd: ".claude/settings.local.json", desc: "Personal project settings. Git-ignored, overrides .claude/settings.json." },
  { cmd: "~/.claude/CLAUDE.md", desc: "Global user instructions that apply to all projects." },
  { cmd: "~/.claude/settings.json", desc: "Global user settings that apply to all projects." },
  { cmd: ".claude/skills/", desc: "Project-scoped custom skills (SKILL.md files). Committed to git." },
  { cmd: ".claude/agents/", desc: "Project-scoped subagent definitions. Committed to git." },
  { cmd: ".claude/rules/*.md", desc: "Path-scoped rules. Use frontmatter paths: field to target specific files.", example: "---\npaths: src/api/**/*.ts\n---\nAlways validate input parameters." },
  { cmd: ".mcp.json", desc: "Project MCP server configuration. Committed to git, shared with team." },
  { cmd: "~/.claude.json", desc: "User/local MCP server configuration." },
];

const mcpSetup: Row[] = [
  { cmd: "claude mcp add <name> <uri>", desc: "Register a new MCP server. Supports HTTP and stdio transports.", example: "claude mcp add --transport stdio github -- npx @modelcontextprotocol/server-github" },
  { cmd: "claude mcp add --header", desc: "Add an MCP server with authentication headers.", example: 'claude mcp add --header "Authorization: Bearer $TOKEN" api https://api.example.com/mcp' },
  { cmd: "claude mcp list", desc: "List all configured MCP servers with transport and connection status." },
  { cmd: "claude mcp get <name>", desc: "Show details for a specific MCP server." },
  { cmd: "claude mcp remove <name>", desc: "Remove an MCP server configuration." },
  { cmd: "claude mcp add-from-claude-desktop", desc: "Import MCP server configurations from Claude Desktop." },
  { cmd: "/mcp", desc: "Show active connections in-session and trigger OAuth flows." },
  { cmd: "mcp__server__tool", desc: "MCP tools appear namespaced. Use naturally in conversation.", example: "Use the GitHub MCP to list open PRs older than 3 days." },
];

const hooks: Row[] = [
  { cmd: "PreToolUse", desc: "Runs before a tool executes. Can block the action (exit code 2).", example: "Validate Bash commands before execution, block dangerous patterns." },
  { cmd: "PostToolUse", desc: "Runs after a tool completes. Use for formatting, linting, or logging.", example: "Auto-format files after Edit/Write with prettier." },
  { cmd: "UserPromptSubmit", desc: "Intercept user input before Claude processes it." },
  { cmd: "Stop", desc: "Runs when Claude finishes responding. Check completion criteria.", example: "Verify all tests pass before marking a task complete." },
  { cmd: "SubagentStart / SubagentStop", desc: "Track subagent lifecycle for orchestration and logging." },
  { cmd: "Hook types", desc: "command (shell), prompt (LLM evaluation), agent (subagent), http (webhook)." },
  { cmd: "Hook matchers", desc: "Filter which tools trigger hooks: exact name, regex, or * for all.", example: 'matcher: "Edit|Write" — only trigger on file modifications.' },
  { cmd: "Hook args (exec form)", desc: "Set args as an array to spawn without a shell. Omit for shell tokenization.", example: '"command": "node", "args": ["--check", "file.js"]' },
  { cmd: "Skill-level hooks", desc: "Define hooks in SKILL.md frontmatter. Scoped to that skill only." },
  { cmd: "Stop / SubagentStop input fields", desc: "Hook input includes background_tasks (running bash/subagents) and session_crons (queued scheduled tasks).", example: "if data['background_tasks'] or data['session_crons']: print('{\"decision\":\"block\"}')" },
];

const permissions: Row[] = [
  { cmd: "default", desc: "Ask before write/edit/bash operations. Read, Glob, Grep always allowed." },
  { cmd: "plan", desc: "Research and present plans only. No file modifications until approved." },
  { cmd: "acceptEdits", desc: "Allow file edits without prompting. Still ask for Bash commands." },
  { cmd: "auto", desc: "Allow all operations without prompting. Use in trusted environments." },
  { cmd: "bypassPermissions", desc: "Skip all safety checks. Only for fully automated CI/CD pipelines." },
  { cmd: "Allow patterns", desc: "Pre-approve specific tools in .claude/settings.json.", example: '"allow": ["Bash(npm run test)", "Bash(git *)", "Read", "Edit"]' },
  { cmd: "Deny patterns", desc: "Block dangerous operations regardless of permission mode.", example: '"deny": ["Bash(git push --force*)", "Bash(rm -rf /)"]' },
];

const subagents: Row[] = [
  { cmd: '@"agent-name"', desc: "Invoke a specific agent inline during conversation.", example: '@"security-reviewer" audit the auth module' },
  { cmd: "claude --agent <name>", desc: "Start a full session with a specific agent from the CLI." },
  { cmd: ".claude/agents/*.md", desc: "Define project-scoped agents with frontmatter for tools, model, effort." },
  { cmd: "Built-in agents", desc: "general-purpose, Explore (Haiku, read-only), Plan (research first)." },
  { cmd: "isolation: worktree", desc: "Run agent in an isolated git worktree for safe experimentation." },
  { cmd: "background: true", desc: "Run agent in background. Use Ctrl+B to background a running agent." },
];

const plugins: Row[] = [
  { cmd: "/plugin install <name>", desc: "Install a plugin from the official marketplace.", example: "/plugin install pr-review" },
  { cmd: "/plugin install github:user/repo", desc: "Install a plugin directly from a GitHub repository." },
  { cmd: "/plugin list", desc: "List installed plugins with their skills, agents, and hooks." },
  { cmd: "/reload-plugins", desc: "Hot-reload plugin files during development." },
  { cmd: "claude --plugin-dir ./path", desc: "Load a plugin for one session only (for testing)." },
  { cmd: ".claude-plugin/plugin.json", desc: "Required plugin manifest. Declares name, version, author, userConfig." },
  { cmd: "plugin-name:command", desc: "Plugin commands are namespaced to avoid conflicts.", example: "/pr-review:check-security" },
];

const envVars: Row[] = [
  { cmd: "CLAUDE_EFFORT", desc: "Current effort level (low/medium/high/xhigh/max). Available in Bash subprocesses and hooks." },
  { cmd: "CLAUDE_CODE_SESSION_ID", desc: "Unique session identifier. Available in Bash subprocesses and hooks for tracking and correlation." },
  { cmd: "CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN", desc: "Set to 1 to keep conversation in terminal scrollback instead of fullscreen alternate screen." },
  { cmd: "CLAUDE_CODE_FORCE_SYNC_OUTPUT", desc: "Set to 1 to force-enable synchronized output rendering on terminals where auto-detection fails." },
  { cmd: "CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE", desc: "Set to 1 to enable automatic background updates for Homebrew/WinGet installations." },
  { cmd: "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY", desc: "Set to 1 to populate the /model picker from your LLM gateway's /v1/models endpoint." },
  { cmd: "CLAUDE_CODE_HIDE_CWD", desc: "Set to 1 to hide the working directory from the startup banner." },
  { cmd: "CLAUDE_CODE_SAFE_MODE", desc: "Set to 1 (or pass --safe-mode) to start with all customizations — CLAUDE.md, plugins, skills, hooks, MCP servers — disabled for troubleshooting." },
  { cmd: "CLAUDE_CODE_DISABLE_BUNDLED_SKILLS", desc: "Set to 1 to hide bundled skills, workflows, and built-in slash commands from the model." },
  { cmd: "DISABLE_UPDATES", desc: "Set to 1 to block all update paths including manual claude update." },
  { cmd: "CLAUDE_CODE_USE_POWERSHELL_TOOL", desc: "Set to 1 to enable the PowerShell tool on Linux/macOS/WSL (requires pwsh 7+). On Windows set to 0 to opt out of the rollout." },
  { cmd: "CLAUDE_CODE_DISABLE_WORKFLOWS", desc: "Set to 1 to turn off dynamic workflows. Read at startup. You can also toggle them in /config or set disableWorkflows in settings." },
];

const configOptions: Row[] = [
  { cmd: "worktree.baseRef", desc: "Controls worktree branching: 'fresh' (default, from remote) or 'head' (from local HEAD)." },
  { cmd: "sandbox.bwrapPath / sandbox.socatPath", desc: "Managed-only (Linux/WSL2). Absolute paths to bubblewrap and socat binaries for sandbox." },
  { cmd: "parentSettingsBehavior", desc: "Admin-tier. Controls SDK/IDE parent settings merge: 'first-wins' (default) or 'merge'." },
  { cmd: "cleanupPeriodDays", desc: "Days before session files and orphaned worktrees are auto-deleted (default: 30)." },
  { cmd: "prUrlTemplate", desc: "Custom URL template for the footer PR badge. Supports {owner}, {repo}, {number} placeholders." },
  { cmd: "disableBundledSkills", desc: "Set to true to hide bundled skills, workflows, and built-in slash commands from the model. CLAUDE_CODE_DISABLE_BUNDLED_SKILLS is the env-var equivalent." },
  { cmd: "enforceAvailableModels", desc: "Managed setting (v2.1.175). When enabled, the availableModels allowlist also constrains the Default model, not just alternate models." },
  { cmd: "footerLinksRegexes", desc: "Settings (v2.1.176) for regex-matched link badges in the footer row, configurable via user or managed settings." },
];

const workflows: Row[] = [
  { cmd: "/effort high → /plan → approve → implement", desc: "Deep work: set high reasoning, plan first, then execute." },
  { cmd: "/diff → /cost → /export → /compact", desc: "End-of-session: review changes, check cost, export, then compact." },
  { cmd: "/batch <instruction>", desc: "Large refactors: split work across parallel agents in isolated worktrees." },
  { cmd: "/loop 5m <check>", desc: "Monitoring: poll build status, error logs, or deploy health on interval." },
  { cmd: "/branch → experiment → /resume", desc: "Exploration: branch conversation, try an approach, resume if it fails." },
  { cmd: 'echo $DIFF | claude -p "review" --output-format json', desc: "CI/CD: pipe diffs into Claude for automated code review with JSON output." },
  { cmd: "/init → edit CLAUDE.md → commit", desc: "Project setup: generate instructions, customize, share with team." },
];

/* ------------------------------------------------------------------ */
/* Section badge labels (mirror the original page chips)               */
/* ------------------------------------------------------------------ */
const sectionBadges: Record<string, string> = {
  "Slash Commands": "/",
  "Keyboard Shortcuts": "Keys",
  "CLI Flags": "CLI",
  "Configuration Files": "Config",
  "MCP Setup": "MCP",
  "Hooks": "Hooks",
  "Permissions": "Access",
  "Subagents": "Agent",
  "Plugins": "Plug",
  "Environment Variables": "Env",
  "Config Options": "Config",
  "Common Workflows": "Flow",
};

/* ------------------------------------------------------------------ */
/* Reusable ref-table row component                                     */
/* ------------------------------------------------------------------ */
function RefRow({ cmd, desc, example, mono = true }: Row & { mono?: boolean }) {
  return (
    <div className="group/row grid grid-cols-1 gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4">
      <div className="flex items-start gap-2">
        <code className="inline-flex items-center rounded bg-bg-muted px-2 py-0.5 font-mono text-[12px] text-accent break-all leading-relaxed border border-border">
          {cmd}
        </code>
      </div>
      <div>
        <p className="text-sm text-fg-muted leading-relaxed">{desc}</p>
        {example && (
          <div className="mt-1.5">
            <code className="text-[11px] font-mono text-fg-subtle bg-bg-muted px-2 py-0.5 rounded border border-border block overflow-x-auto whitespace-pre-wrap break-all">
              {example}
            </code>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section wrapper                                                       */
/* ------------------------------------------------------------------ */
function Section({
  id,
  title,
  children,
  delay = 0,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const badge = sectionBadges[title];
  return (
    <Reveal delay={delay}>
      <section id={id} className="scroll-mt-24">
        <div className="mb-4 flex items-center gap-3">
          {badge && (
            <span className="rounded-md bg-accent-soft px-2.5 py-0.5 font-mono text-[11px] font-semibold text-accent-soft-fg tracking-wide">
              {badge}
            </span>
          )}
          <h2 className="text-xl font-semibold text-fg sm:text-2xl">{title}</h2>
        </div>
        <Card className="transition hover:border-accent/30">
          <div className="divide-y-0">{children}</div>
        </Card>
      </section>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Page nav (anchor links to sections)                                  */
/* ------------------------------------------------------------------ */
const sections = [
  { id: "slash-commands", label: "Slash Commands" },
  { id: "keyboard-shortcuts", label: "Keyboard Shortcuts" },
  { id: "cli-flags", label: "CLI Flags" },
  { id: "configuration-files", label: "Config Files" },
  { id: "mcp-setup", label: "MCP Setup" },
  { id: "hooks", label: "Hooks" },
  { id: "permissions", label: "Permissions" },
  { id: "subagents", label: "Subagents" },
  { id: "plugins", label: "Plugins" },
  { id: "env-vars", label: "Env Vars" },
  { id: "config-options", label: "Config Options" },
  { id: "common-workflows", label: "Workflows" },
];

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function ReferencePage() {
  return (
    <main id="main-content" className="pb-24">
      <Container>
        <PageHeader
          title="Cheat Sheet"
          lede="Keep the Claude Code commands, shortcuts, files, and workflow reminders you use most in one printable place."
        />

        {/* Intro callout with link to catalog */}
        <Reveal delay={70}>
          <Callout tone="info">
            Need the full searchable list instead?{" "}
            <Link href="/catalog" className="text-accent underline hover:text-accent/80 transition-colors">
              Open the feature index
            </Link>
            .
          </Callout>
        </Reveal>

        {/* Page-internal nav */}
        <Reveal delay={140}>
          <nav
            aria-label="Jump to section"
            className="mt-6 mb-10 flex flex-wrap gap-2"
          >
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-fg-muted transition hover:border-accent/40 hover:text-accent hover:-translate-y-0.5 min-h-[36px] flex items-center"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </Reveal>

        {/* Sections */}
        <div className="space-y-10">
          <Section id="slash-commands" title="Slash Commands" delay={0}>
            {slashCommands.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="keyboard-shortcuts" title="Keyboard Shortcuts" delay={70}>
            {keyboardShortcuts.map((row) => (
              <div
                key={row.cmd}
                className="grid grid-cols-1 gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4"
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  {row.cmd.split(" / ").map((part) =>
                    part.split("+").map((k, ki, arr) => (
                      <span key={`${part}-${ki}`} className="inline-flex items-center gap-1">
                        <Kbd>{k.trim()}</Kbd>
                        {ki < arr.length - 1 && (
                          <span className="text-fg-subtle text-xs">+</span>
                        )}
                      </span>
                    ))
                  ).reduce<React.ReactNode[]>((acc, el, i) => {
                    if (i > 0) acc.push(<span key={`sep-${i}`} className="text-fg-faint text-xs">/</span>);
                    acc.push(el);
                    return acc;
                  }, [])}
                </div>
                <p className="text-sm text-fg-muted leading-relaxed">{row.desc}</p>
              </div>
            ))}
          </Section>

          <Section id="cli-flags" title="CLI Flags" delay={140}>
            {cliFlags.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="configuration-files" title="Configuration Files" delay={210}>
            {configFiles.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="mcp-setup" title="MCP Setup" delay={280}>
            {mcpSetup.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="hooks" title="Hooks" delay={0}>
            {hooks.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="permissions" title="Permissions" delay={70}>
            {permissions.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="subagents" title="Subagents" delay={140}>
            {subagents.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="plugins" title="Plugins" delay={210}>
            {plugins.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="env-vars" title="Environment Variables" delay={0}>
            {envVars.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="config-options" title="Config Options" delay={70}>
            {configOptions.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="common-workflows" title="Common Workflows" delay={140}>
            {workflows.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>
        </div>

        {/* Bottom tip */}
        <Reveal delay={70} className="mt-14">
          <Callout tone="tip" title="Print-friendly">
            This page is designed to be printed. Use your browser&apos;s print dialog (<Kbd>Ctrl P</Kbd> / <Kbd>Cmd P</Kbd>) for a clean single-column reference sheet.
          </Callout>
        </Reveal>
      </Container>
    </main>
  );
}
