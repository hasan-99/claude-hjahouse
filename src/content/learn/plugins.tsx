import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Quiz, Prose, type QuizQuestion } from "@/components/content";

/* ── Terminal demo: install & enable a plugin ── */
const installScript: Step[] = [
  { t: "print", text: "# Install a plugin from the official marketplace", tone: "muted" },
  { t: "type", text: "/plugin install pr-review", prompt: ">" },
  { t: "out", lines: [
    { text: "Resolving pr-review from claude-plugins-official…", tone: "muted" },
    { text: "✓  Fetched manifest  (v1.2.0)", tone: "green" },
    { text: "  Skills:    check-security, check-coverage, summarize-changes", tone: "blue" },
    { text: "  Agents:    review-specialist.md", tone: "blue" },
    { text: "  Hooks:     PostToolUse → bin/audit.js", tone: "blue" },
    { text: "  MCP:       (none)", tone: "muted" },
  ], gap: 60 },
  { t: "wait", ms: 400 },
  { t: "print", text: "✓  Plugin installed: pr-review@1.2.0", tone: "green" },
  { t: "wait", ms: 700 },
  { t: "type", text: "/pr-review:check-security", prompt: ">" },
  { t: "out", lines: [
    { text: "Running security scan on 14 changed files…", tone: "amber" },
    { text: "✓  No critical findings. 2 low-severity notes attached.", tone: "green" },
  ], gap: 80 },
  { t: "wait", ms: 900 },
  { t: "type", text: "claude plugin list", prompt: "$" },
  { t: "out", lines: [
    { text: "INSTALLED PLUGINS", tone: "muted" },
    { text: "  pr-review  v1.2.0  (enabled)", tone: "green" },
  ], gap: 60 },
];

/* ── Terminal demo: prune & disable ── */
const manageScript: Step[] = [
  { t: "print", text: "# Disable a plugin project-wide without removing it", tone: "muted" },
  { t: "type", text: "claude plugin disable formatter --scope project", prompt: "$" },
  { t: "out", lines: [
    { text: "✓  formatter disabled (scope: project)", tone: "green" },
    { text: "  Written to .claude/settings.json", tone: "muted" },
  ], gap: 70 },
  { t: "wait", ms: 600 },
  { t: "print", text: "# Re-enable later without touching the install", tone: "muted" },
  { t: "type", text: "claude plugin enable formatter --scope project", prompt: "$" },
  { t: "out", lines: [
    { text: "✓  formatter enabled (scope: project)", tone: "green" },
  ], gap: 70 },
  { t: "wait", ms: 600 },
  { t: "print", text: "# Remove auto-installed dependencies no longer needed", tone: "muted" },
  { t: "type", text: "claude plugin prune", prompt: "$" },
  { t: "out", lines: [
    { text: "Scanning dependency tree…", tone: "muted" },
    { text: "✓  Removed 2 orphaned auto-installs.", tone: "green" },
    { text: "  Your directly-installed plugins were not touched.", tone: "muted" },
  ], gap: 60 },
];

const quizQuestions: QuizQuestion[] = [
  {
    q: "What is the only required file inside a plugin directory?",
    options: [
      "skills/SKILL.md",
      ".claude-plugin/plugin.json",
      "hooks/hooks.json",
      "settings.json",
    ],
    answer: 1,
    explanation:
      "The only required file is .claude-plugin/plugin.json — the manifest that declares the plugin's identity. All other directories (skills/, agents/, hooks/, etc.) are optional conventions that Claude Code recognizes.",
  },
  {
    q: "How are plugin commands namespaced to avoid conflicts?",
    options: [
      "They are prefixed with a hash, e.g. #pr-review:check",
      "They are loaded into a separate namespace file",
      "They use the form plugin-name:command-name, e.g. /pr-review:check-security",
      "They are only accessible via the CLI, not the / prompt",
    ],
    answer: 2,
    explanation:
      "Plugin commands and skills are namespaced as plugin-name:command-name. You invoke them with the full form, such as /pr-review:check-security, to avoid conflicts with project-level configuration.",
  },
  {
    q: "What does `claude plugin prune` (alias: autoremove) do?",
    options: [
      "Deletes all plugins including ones you installed directly",
      "Removes only auto-installed dependency plugins that no other installed plugin still requires",
      "Validates all plugin manifests and removes invalid ones",
      "Clears the plugin data directory stored in CLAUDE_PLUGIN_DATA",
    ],
    answer: 1,
    explanation:
      "claude plugin prune (new in v2.1.121, aliased autoremove) removes auto-installed plugin dependencies that no other installed plugin still requires. Plugins you installed directly are never touched.",
  },
  {
    q: "Which environment variable forces HTTPS cloning instead of SSH when installing a GitHub plugin?",
    options: [
      "CLAUDE_PLUGIN_GIT_HTTPS=true",
      "GIT_PROTOCOL=https",
      "CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1",
      "PLUGIN_CLONE_MODE=https",
    ],
    answer: 2,
    explanation:
      "Set CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1 to force HTTPS cloning for GitHub owner/repo plugin sources. This is essential in CI runners and containers that don't have a configured SSH key for github.com.",
  },
];

export default function Content() {
  return (
    <Prose>
      {/* ── Intro ── */}
      <Reveal delay={0}>
        <p>
          Plugins are the highest-level extension mechanism in Claude Code. They bundle
          skills, subagents, hooks, MCP servers, and LSP configurations into a single
          installable package. A team installs one plugin and immediately gets everything
          configured — no manual setup for each component. This module covers the plugin
          structure, manifest format, distribution mechanisms, and how to build your own.
        </p>
      </Reveal>

      {/* ── Plugin Architecture ── */}
      <Reveal delay={70}>
        <h2>Plugin Architecture</h2>
        <p>
          A plugin is a directory with a specific structure. The only required file is{" "}
          <code>.claude-plugin/plugin.json</code>, the manifest that declares the
          plugin&apos;s identity. Everything else is optional but follows conventions
          Claude Code recognizes:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="my-plugin/ (directory layout)"
          lang="text"
          code={`my-plugin/
├── .claude-plugin/
│   └── plugin.json       # Required manifest
├── skills/               # SKILL.md files
│   └── my-skill/
│       └── SKILL.md
├── agents/               # Subagent definitions
│   └── specialist.md
├── commands/             # Legacy command files (also work)
│   └── my-command.md
├── hooks/
│   └── hooks.json        # Plugin-scoped hooks
├── .mcp.json             # MCP server configs
├── .lsp.json             # LSP server configs
├── settings.json         # Default settings
└── bin/
    └── helper.sh`}
        />
      </Reveal>

      <Reveal delay={210}>
        <p>
          A plugin that ships exactly one skill can place <code>SKILL.md</code> directly
          at the plugin root instead of creating a <code>skills/</code> directory. Claude
          Code loads it as a single skill and uses the frontmatter <code>name</code> field
          for the invocation name. Use the <code>skills/</code> layout for plugins that
          may grow to more than one skill.
        </p>
        <p>
          The manifest identifies the plugin and its metadata:
        </p>
      </Reveal>

      <Reveal delay={280}>
        <CodeBlock
          filename=".claude-plugin/plugin.json"
          lang="json"
          code={`{
  "name": "pr-review",
  "description": "Complete PR review workflow with security and test coverage checks",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  },
  "repository": "https://github.com/you/pr-review",
  "license": "MIT"
}`}
        />
      </Reveal>

      <Reveal delay={350}>
        <Callout tone="info" title="Namespaced commands">
          Plugin commands and plugin-provided skills are namespaced as{" "}
          <code>plugin-name:command-name</code> to avoid conflicts with project-level
          configuration. Invoke them with the full namespaced form, such as{" "}
          <code>/pr-review:check-security</code>.
        </Callout>
      </Reveal>

      {/* ── Manifest Features ── */}
      <Reveal delay={0}>
        <h2>Manifest Features</h2>
        <p>
          The manifest supports several powerful fields for configuring plugin behavior.
          <code>userConfig</code> declares user-configurable options. Fields marked{" "}
          <code>sensitive: true</code> are stored in the system keychain rather than
          plain-text settings:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename=".claude-plugin/plugin.json — userConfig"
          lang="json"
          code={`{
  "name": "my-plugin",
  "version": "1.0.0",
  "userConfig": {
    "apiKey": {
      "description": "API key for the integration",
      "sensitive": true
    },
    "region": {
      "description": "Deployment region",
      "default": "us-east-1"
    }
  }
}`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          Plugins get a persistent data directory via <code>{"${CLAUDE_PLUGIN_DATA}"}</code>{" "}
          (v2.1.78+). This survives across sessions, making it suitable for caches, state
          files, and databases. Use <code>{"${CLAUDE_PLUGIN_ROOT}"}</code> to reference
          paths relative to the plugin installation directory — essential for hooks and MCP
          configurations:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".claude-plugin/plugin.json — hooks with CLAUDE_PLUGIN_ROOT"
          lang="json"
          code={`{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \${CLAUDE_PLUGIN_ROOT}/bin/audit.js"
          }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      <Reveal delay={280}>
        <h3>Monitors</h3>
        <p>
          Plugin monitors require Claude Code v2.1.105 or later. Declare them under the{" "}
          <code>experimental</code> key in your manifest (
          <code>experimental.monitors</code>) — the top-level form still works but{" "}
          <code>claude plugin validate</code> will warn, and a future release will require
          the nested form. The <code>monitors</code> manifest key wires the plugin into the
          Monitor tool. Point it at a JSON file (or inline the config) and its background
          watches auto-arm the moment the plugin is enabled at session start, or when one
          of the plugin&apos;s skills is invoked.
        </p>
      </Reveal>

      <Reveal delay={350}>
        <CodeBlock
          filename=".claude-plugin/plugin.json — monitors"
          lang="json"
          code={`{
  "name": "ci-watcher",
  "version": "1.0.0",
  "experimental": {
    "monitors": "./monitors.json"
  }
}`}
        />
        <Callout tone="warn" title="Custom monitors path">
          When the manifest sets a custom <code>monitors</code> path, the default{" "}
          <code>monitors/monitors.json</code> location is no longer scanned — specify
          the default explicitly if you still want it loaded alongside your custom file.
        </Callout>
      </Reveal>

      <Reveal delay={420}>
        <h3>LSP Support</h3>
        <p>
          LSP support adds real-time language server protocol integration. Put a{" "}
          <code>.lsp.json</code> in the plugin root to configure language servers that
          provide instant diagnostics, go-to-definition, and symbol search as Claude edits
          files:
        </p>
      </Reveal>

      <Reveal delay={490}>
        <CodeBlock
          filename=".lsp.json"
          lang="json"
          code={`{
  "typescript": {
    "command": "typescript-language-server",
    "args": ["--stdio"],
    "extensionToLanguage": {
      ".ts": "typescript",
      ".tsx": "typescriptreact"
    }
  }
}`}
        />
      </Reveal>

      {/* ── Distribution & Development ── */}
      <Reveal delay={0}>
        <h2>Distribution and Development</h2>
        <p>
          Test a plugin locally with the <code>--plugin-dir</code> flag before
          distributing. It loads the plugin for that session only — no installation:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename="bash"
          lang="bash"
          code={`claude --plugin-dir ./my-plugin
# Test multiple plugins simultaneously:
claude --plugin-dir ./my-plugin --plugin-dir ./another-plugin`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          For plugins hosted as <code>.zip</code> archives,{" "}
          <code>--plugin-url</code> fetches and installs them for the current session
          without permanent installation. Repeat the flag for multiple plugins:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename="bash"
          lang="bash"
          code={`claude --plugin-url https://example.com/my-plugin.zip
claude --plugin-url https://example.com/a.zip --plugin-url https://example.com/b.zip`}
        />
        <Callout tone="warn" title="Security — remote archives">
          Only use <code>--plugin-url</code> with URLs you trust — loading remote archives
          executes third-party code on your machine.
        </Callout>
      </Reveal>

      <Reveal delay={280}>
        <p>
          Use <code>/reload-plugins</code> to hot-reload plugin files during development
          without restarting the session. This re-reads all manifests, skills, agents,
          hooks, and MCP configurations instantly.
        </p>
        <p>
          The <code>/plugin</code> Discover and Browse screens show a full inventory of
          what a plugin will install before you commit to it — commands, agents, skills,
          hooks, and any MCP or LSP servers it ships. This makes vetting a marketplace
          plugin a one-screen decision.
        </p>
      </Reveal>

      {/* ── Marketplace & Install ── */}
      <Reveal delay={0}>
        <h2>Marketplace Installation</h2>
        <p>
          Plugin distribution follows a marketplace model. The official Anthropic
          marketplace is <code>claude-plugins-official</code>. Add additional marketplaces
          with <code>/plugin marketplace add owner/repo-name</code>. Install plugins with{" "}
          <code>/plugin install plugin-name</code> or{" "}
          <code>claude plugin install plugin-name@marketplace</code>:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename="bash"
          lang="bash"
          code={`# Install from official marketplace
/plugin install pr-review

# Install from GitHub
/plugin install github:username/my-plugin

# Install from local path (for testing)
/plugin install ./path/to/plugin`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          When a plugin source is a GitHub <code>owner/repo</code> shorthand, Claude Code
          defaults to cloning over SSH. That breaks in CI runners, containers, or any
          environment without a configured SSH key for <code>github.com</code>. Set{" "}
          <code>CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1</code> to force HTTPS cloning instead:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename="bash"
          lang="bash"
          code={`# Force HTTPS for plugin clones in CI
CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1 claude plugin install owner/repo`}
        />
      </Reveal>

      {/* ── Live demo: install ── */}
      <Reveal delay={280}>
        <p className="mb-3 text-sm font-medium text-fg-muted">
          Terminal demo — install a plugin and invoke a namespaced skill:
        </p>
        <Terminal
          script={installScript}
          title="claude — plugin install"
          loop={true}
          loopDelay={3000}
        />
      </Reveal>

      {/* ── Enable / Disable / Prune ── */}
      <Reveal delay={0}>
        <h2>Enable, Disable, and Prune</h2>
        <p>
          <code>claude plugin enable</code> and <code>claude plugin disable</code> toggle
          an installed plugin on or off without removing it. Both accept a{" "}
          <code>{"<plugin>"}</code> name (or <code>{"<plugin>@<marketplace>"}</code> to
          disambiguate) and a <code>--scope</code> of <code>user</code>,{" "}
          <code>project</code>, or <code>local</code> (default: <code>user</code>).
          Disabling at <code>project</code> scope writes the choice into{" "}
          <code>.claude/settings.json</code> so the whole team picks it up; <code>user</code>{" "}
          scope keeps it personal:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename="bash"
          lang="bash"
          code={`# Personal: turn off a noisy plugin just for you
claude plugin disable formatter@anthropics/claude-plugins

# Team: keep the plugin in settings but turn it off project-wide
claude plugin disable formatter --scope project

# Re-enable later without touching its install or version
claude plugin enable formatter --scope project`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          <code>claude plugin prune</code> (new in v2.1.121, aliased <code>autoremove</code>)
          removes auto-installed plugin dependencies that no other installed plugin still
          requires — plugins you installed directly are never touched. To uninstall a
          plugin and clean up its dependencies in one step:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename="bash"
          lang="bash"
          code={`# Uninstall a plugin and clean up orphaned auto-installs
claude plugin uninstall my-plugin --prune

# Or prune only (keep all directly-installed plugins)
claude plugin prune`}
        />
      </Reveal>

      <Reveal delay={280}>
        <p className="mb-3 text-sm font-medium text-fg-muted">
          Terminal demo — disable project-wide, re-enable, then prune orphans:
        </p>
        <Terminal
          script={manageScript}
          title="claude — plugin manage"
          loop={true}
          loopDelay={3000}
        />
      </Reveal>

      {/* ── Useful lifecycle commands ── */}
      <Reveal delay={0}>
        <h2>Lifecycle Commands</h2>
        <p>
          Useful built-in plugin lifecycle commands at a glance:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <div className="my-5 overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-subtle">
                <th className="px-4 py-3 text-left font-semibold text-fg">Command</th>
                <th className="px-4 py-3 text-left font-semibold text-fg">What it does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["claude plugin list", "List all installed plugins"],
                ["claude plugin enable <name>", "Enable an installed plugin"],
                ["claude plugin disable <name>", "Disable without uninstalling"],
                ["claude plugin uninstall <name>", "Remove a plugin permanently"],
                ["claude plugin validate", "Validate manifest + warn about deprecated fields"],
                ["claude plugin prune / autoremove", "Remove orphaned auto-install deps"],
                ["claude plugin details <name>", "Show skills, agents, hooks, MCP/LSP, token cost"],
                ["claude plugin tag", "Create a release git tag (v2.1.118+, with version validation)"],
              ].map(([cmd, desc], i) => (
                <tr
                  key={i}
                  className="transition hover:-translate-y-0.5 hover:bg-card-hover"
                >
                  <td className="px-4 py-3 font-mono text-xs text-accent">{cmd}</td>
                  <td className="px-4 py-3 text-fg-muted">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* ── Inline plugins ── */}
      <Reveal delay={0}>
        <h2>Inline Plugins (Settings-Embedded)</h2>
        <p>
          The inline plugin pattern (<code>source: &apos;settings&apos;</code> in v2.1.80+)
          lets you embed a plugin definition directly in a settings file without a separate
          repository. This is useful for small team-internal tools that don&apos;t warrant
          a full git repository:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename=".claude/settings.json — inline plugin"
          lang="json"
          code={`{
  "pluginMarketplaces": [
    {
      "name": "internal-tools",
      "source": "settings",
      "plugins": [
        {
          "name": "code-standards",
          "source": "./local-plugins/code-standards"
        }
      ]
    }
  ]
}`}
        />
      </Reveal>

      {/* ── Enterprise ── */}
      <Reveal delay={140}>
        <h2>Enterprise Controls</h2>
        <p>
          For enterprise environments, <code>managed-mcp.json</code> controls which MCP
          servers plugins can use. The <code>enabledPlugins</code>,{" "}
          <code>extraKnownMarketplaces</code>, <code>strictKnownMarketplaces</code>, and{" "}
          <code>blockedMarketplaces</code> settings in managed policy control which plugins
          and marketplaces are allowed organization-wide.
        </p>
        <Callout tone="warn" title="Plugin subagent restrictions">
          Plugin subagents have restricted frontmatter — they cannot define{" "}
          <code>hooks</code>, <code>mcpServers</code>, or <code>permissionMode</code> to
          prevent privilege escalation.
        </Callout>
      </Reveal>

      {/* ── Quiz ── */}
      <Reveal delay={0}>
        <Quiz questions={quizQuestions} title="Quick check — Plugins" />
      </Reveal>
    </Prose>
  );
}
