import { Prose, Callout, Quiz, type QuizQuestion } from "@/components/content";
import CodeBlock from "@/components/CodeBlock";
import Terminal, { type Step } from "@/components/Terminal";
import Reveal from "@/components/Reveal";

const initScript: Step[] = [
  { t: "print", text: "# Initializing project memory…", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/init", tone: "user", prompt: ">" },
  { t: "wait", ms: 300 },
  { t: "out", lines: [
    { text: "Scanning codebase…", tone: "muted" },
    { text: "  ✔  package.json — Node.js 20, TypeScript 5", tone: "green" },
    { text: "  ✔  tsconfig.json — strict mode", tone: "green" },
    { text: "  ✔  .eslintrc — ESLint + Prettier", tone: "green" },
    { text: "  ✔  src/  — Express API, Prisma ORM", tone: "green" },
    { text: "  ✔  jest.config.ts — test framework", tone: "green" },
  ], gap: 80 },
  { t: "wait", ms: 400 },
  { t: "out", lines: [
    { text: "Generating CLAUDE.md…", tone: "muted" },
    { text: "  Created CLAUDE.md (47 lines)", tone: "green" },
    { text: "", tone: "muted" },
    { text: "✦  Commit CLAUDE.md to git so the whole team gets the same context.", tone: "amber" },
  ], gap: 100 },
  { t: "wait", ms: 500 },
  { t: "type", text: "git add CLAUDE.md && git commit -m 'chore: add Claude project memory'", tone: "user", prompt: "$", speed: 30 },
  { t: "wait", ms: 300 },
  { t: "out", lines: [
    { text: "[main 4a1f92c] chore: add Claude project memory", tone: "green" },
    { text: " 1 file changed, 47 insertions(+)", tone: "muted" },
  ], gap: 80 },
];

const permissionsScript: Step[] = [
  { t: "print", text: "# Pre-approving common project commands", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/permissions", tone: "user", prompt: ">" },
  { t: "wait", ms: 300 },
  { t: "out", lines: [
    { text: "Current permissions (project .claude/settings.json):", tone: "muted" },
    { text: "  allow: Bash(git *)          ✔  git operations", tone: "green" },
    { text: "  allow: Bash(npm *)          ✔  npm scripts", tone: "green" },
    { text: "  allow: Bash(npx *)          ✔  npx tools", tone: "green" },
    { text: "  allow: Read(**/*)", tone: "green" },
    { text: "  allow: Write(src/**/*)", tone: "green" },
    { text: "  allow: Edit(src/**/*)", tone: "green" },
  ], gap: 80 },
  { t: "wait", ms: 400 },
  { t: "type", text: "claude --add-dir ../shared-types", tone: "user", prompt: "$", speed: 35 },
  { t: "wait", ms: 300 },
  { t: "out", lines: [
    { text: "Added directory: ../shared-types", tone: "green" },
    { text: "  Claude can now read and edit files in that path for this session.", tone: "muted" },
  ], gap: 90 },
];

const questions: QuizQuestion[] = [
  {
    q: "Which command generates an initial CLAUDE.md by scanning your codebase?",
    options: ["/setup", "/init", "/memory", "/scaffold"],
    answer: 1,
    explanation:
      "/init tells Claude to read package.json, existing docs, and directory structure, then write a CLAUDE.md capturing your stack, commands, and conventions.",
  },
  {
    q: "Which settings file is committed to git so the whole team shares the same permissions?",
    options: [
      ".claude/settings.local.json",
      "~/.claude/settings.json",
      ".claude/settings.json",
      "CLAUDE.md",
    ],
    answer: 2,
    explanation:
      ".claude/settings.json is the project-level file that lives in source control. .claude/settings.local.json is git-ignored for personal overrides, and ~/.claude/settings.json is per-user.",
  },
  {
    q: "Which setting controls precedence ABOVE command-line arguments and cannot be overridden by anything else?",
    options: [
      "Project settings (.claude/settings.json)",
      "User settings (~/.claude/settings.json)",
      "Local settings (.claude/settings.local.json)",
      "Managed settings",
    ],
    answer: 3,
    explanation:
      "Managed settings sit at the top of the precedence chain: Managed > CLI args > Local (.local.json) > Project (settings.json) > User. They are intended for enterprise/policy deployments.",
  },
  {
    q: "What does --add-dir do when launching Claude Code?",
    options: [
      "Permanently adds a directory to the project's allowed paths",
      "Creates a new subdirectory inside the project",
      "Grants read/edit access to a directory outside the project root for that session",
      "Copies a directory's CLAUDE.md rules into the current project",
    ],
    answer: 2,
    explanation:
      "--add-dir is a per-session grant that lets Claude read and edit files in a sibling directory (e.g. ../shared-types). For a permanent grant across sessions use permissions.additionalDirectories in settings.json.",
  },
];

export default function Content() {
  return (
    <Prose>
      {/* ── Intro ─────────────────────────────────────────────────────── */}
      <Reveal>
        <p>
          Getting Claude Code working well on a project takes about ten minutes
          of setup. The payoff is that Claude understands your conventions from
          the first message, has the right permissions to do useful work, and
          behaves consistently for everyone on the team. This module walks
          through the setup steps in order.
        </p>
      </Reveal>

      {/* ── 1. Initializing Project Memory ────────────────────────────── */}
      <Reveal delay={70}>
        <h2>Initializing Project Memory</h2>
        <p>
          Start with <code>/init</code>. Claude scans your codebase — reading{" "}
          <code>package.json</code>, existing docs, directory structure — and
          generates a <code>CLAUDE.md</code> that captures your tech stack, key
          commands, and initial conventions. Commit this file to git immediately
          so teammates get the same context.
        </p>
        <p>
          A good <code>CLAUDE.md</code> is concise and specific. Aim for under
          200 lines per file. Every line should be relevant to nearly every
          session — if something only matters for one feature, put it in a
          path-scoped rules file instead. The most valuable sections are:
        </p>
        <ul>
          <li>Tech stack and versions</li>
          <li>Development commands (install, test, build, lint)</li>
          <li>Naming conventions that aren&apos;t obvious from the code</li>
          <li>Known gotchas that would trip up a new developer</li>
        </ul>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="CLAUDE.md"
          lang="markdown"
          code={`# Project: Payment Service

## Stack

- Node.js 20, TypeScript 5, PostgreSQL 15
- Express for API, Prisma for ORM, Jest for tests

## Commands

- \`npm run dev\` — start with hot reload
- \`npm test\` — run test suite
- \`npm run migrate\` — apply pending migrations
- \`npm run lint\` — ESLint + Prettier check

## Conventions

- All monetary values stored as integers (cents)
- Use \`Result<T, E>\` pattern for error handling, never throw in service layer
- Database columns: snake_case; TypeScript: camelCase`}
        />
      </Reveal>

      <Reveal delay={210}>
        <Terminal
          script={initScript}
          title="claude — /init"
          loop={false}
          showStatus={false}
        />
      </Reveal>

      <Reveal delay={280}>
        <Callout tone="tip" title="Commit CLAUDE.md right away">
          Treat <code>CLAUDE.md</code> like any other source file. Committing it
          immediately gives every teammate — human and AI — the same starting
          context on the next clone or pull.
        </Callout>
      </Reveal>

      {/* ── 2. Configuring Permissions ────────────────────────────────── */}
      <Reveal delay={70}>
        <h2>Configuring Permissions</h2>
        <p>
          Claude Code operates within a permission system that controls which
          tools it can use without asking. The default mode requires approval for
          most file writes and all bash commands. For active development, you'll
          want to pre-approve common operations.
        </p>
        <p>
          Open the permission manager with <code>/permissions</code>. Add
          patterns for the commands Claude will use repeatedly. Use{" "}
          <code>Bash(git *)</code> to allow all git commands,{" "}
          <code>Bash(npm *)</code> for npm, or{" "}
          <code>Bash(npx jest *)</code> for a specific tool. File operations can
          be scoped to specific paths.
        </p>
        <p>
          Settings files control permissions at project and user level.{" "}
          <code>.claude/settings.json</code> is committed to git for the team.{" "}
          <code>.claude/settings.local.json</code> is git-ignored for personal
          overrides:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename=".claude/settings.json"
          lang="json"
          code={`{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm *)",
      "Bash(npx *)",
      "Read(**/*)",
      "Write(src/**/*)",
      "Edit(src/**/*)"
    ]
  }
}`}
        />
      </Reveal>

      <Reveal delay={210}>
        <Callout tone="warn" title="Sensitive operations">
          For operations like production deploys, leave them requiring approval
          or use <code>disable-model-invocation: true</code> on skills so Claude
          can never trigger them automatically.
        </Callout>
      </Reveal>

      {/* ── 3. Extending Directories with --add-dir ───────────────────── */}
      <Reveal delay={70}>
        <h3>Extending Directories with --add-dir</h3>
        <p>
          When a task needs files outside the project root — a sibling library,
          a shared types package, a generated bundle — use{" "}
          <code>--add-dir</code> at launch (or <code>/add-dir</code>{" "}
          mid-session) to extend Claude&apos;s working directories for that
          session. Each path must exist as a directory and the flag only grants
          file access, not the rest of <code>.claude/</code> configuration in
          that tree:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`# Start a session with read/edit access in two sibling directories
claude --add-dir ../shared-types --add-dir ../design-tokens`}
        />
      </Reveal>

      <Reveal delay={210}>
        <p>
          To persist those directories across every session in the project
          instead of typing them each time, set{" "}
          <code>permissions.additionalDirectories</code> in{" "}
          <code>.claude/settings.json</code>. <code>--add-dir</code> is the
          temporary, per-session form of the same grant.
        </p>
      </Reveal>

      <Reveal delay={280}>
        <Terminal
          script={permissionsScript}
          title="claude — permissions + --add-dir"
          loop={false}
          showStatus={false}
        />
      </Reveal>

      {/* ── 4. Security — Marketplace Restrictions ────────────────────── */}
      <Reveal delay={70}>
        <h2>Security — Marketplace Restrictions</h2>
        <p>
          Use <code>blockedMarketplaces</code> to restrict which plugin
          marketplaces can be used. Entries support <code>hostPattern</code> to
          block by domain (e.g., <code>&quot;*.example.com&quot;</code>) and{" "}
          <code>pathPattern</code> to block by repository path (e.g.,{" "}
          <code>&quot;acme/corp-plugins&quot;</code>):
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename=".claude/settings.json"
          lang="json"
          code={`{
  "blockedMarketplaces": [
    { "hostPattern": "*.untrusted-domain.io" },
    { "pathPattern": "acme/corp-plugins" }
  ]
}`}
        />
      </Reveal>

      <Reveal delay={210}>
        <p>
          This is enforced at the policy level — users cannot override it with
          local settings. Available in managed policy for enterprise deployments.
        </p>
        <p>
          When writing plugin manifests for your project, note that{" "}
          <code>monitors</code> and <code>themes</code> are experimental and
          should be declared under <code>experimental: {"{}"}</code> rather than
          at the top level of <code>plugin.json</code>. Top-level declarations
          still work but <code>claude plugin validate</code> will warn, and a
          future release will require the nested form.
        </p>
      </Reveal>

      {/* ── 5. Settings and Environment ───────────────────────────────── */}
      <Reveal delay={70}>
        <h2>Settings and Environment</h2>
        <p>Settings follow this precedence from highest to lowest:</p>
        <ol>
          <li>
            <strong>Managed settings</strong> — cannot be overridden by
            anything, including command-line arguments
          </li>
          <li>
            <strong>Command-line arguments</strong>
          </li>
          <li>
            <strong>Local</strong> (<code>.claude/settings.local.json</code>) —
            overrides project and user settings
          </li>
          <li>
            <strong>Project</strong> (<code>.claude/settings.json</code>)
          </li>
          <li>
            <strong>User</strong> (<code>~/.claude/settings.json</code>)
          </li>
        </ol>
        <p>
          Local settings override project settings, not the reverse. Managed
          delivery can use platform policy files or managed configuration
          directories, but those are implementation details for the top managed
          layer rather than separate everyday scopes.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <h3>Auto-updates</h3>
        <p>
          The native installer auto-updates in the background by default.
          Homebrew and WinGet installations do not auto-update by default — to
          opt in, set <code>CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE=1</code>.
          Claude Code will then run the package manager upgrade in the
          background when a new version is available and prompt you to restart
          on success. To upgrade manually instead, run{" "}
          <code>brew upgrade claude-code</code> or{" "}
          <code>winget upgrade Anthropic.ClaudeCode</code>.
        </p>
        <p>
          You can control the release channel with the{" "}
          <code>autoUpdatesChannel</code> setting:
        </p>
        <ul>
          <li>
            <code>&quot;latest&quot;</code> (default) — receives new features
            immediately
          </li>
          <li>
            <code>&quot;stable&quot;</code> — uses a version about one week old
            that skips releases with major regressions
          </li>
        </ul>
        <p>
          To disable auto-updates entirely, set <code>DISABLE_UPDATES</code> to{" "}
          <code>&quot;1&quot;</code> in your settings <code>env</code> block —
          this blocks all update paths including manual{" "}
          <code>claude update</code>. For a less strict option,{" "}
          <code>DISABLE_AUTOUPDATER</code> suppresses package manager update
          notifications only.
        </p>
      </Reveal>

      <Reveal delay={210}>
        <h3>Useful env and model settings</h3>
        <p>
          Beyond permissions, useful settings include <code>env</code> for
          environment variables that should be present in every session,{" "}
          <code>agent</code> to set a custom default agent, and{" "}
          <code>claudeMdExcludes</code> for filtering out irrelevant memory files
          in monorepos. You can also set the default model and effort level:
        </p>
      </Reveal>

      <Reveal delay={280}>
        <CodeBlock
          filename=".claude/settings.json"
          lang="json"
          code={`{
  "model": "claude-sonnet-4-6",
  "env": {
    "NODE_ENV": "development",
    "LOG_LEVEL": "debug"
  }
}`}
        />
      </Reveal>

      <Reveal delay={350}>
        <Callout tone="info" title="What to share with the team">
          Add <code>.claude/settings.local.json</code> to your{" "}
          <code>.gitignore</code> so personal overrides stay personal. Share{" "}
          <code>.claude/settings.json</code>, <code>CLAUDE.md</code>,{" "}
          <code>.claude/rules/</code>, <code>.claude/skills/</code>, and
          optionally <code>.claude/agents/</code> with the team via git. That
          gives teammates the same shared project instructions and
          project-scoped extensions, while personal settings and auto memory
          remain local to each machine.
        </Callout>
      </Reveal>

      {/* ── Quiz ──────────────────────────────────────────────────────── */}
      <Reveal delay={70}>
        <Quiz questions={questions} title="Quick check — Project Setup" />
      </Reveal>
    </Prose>
  );
}
