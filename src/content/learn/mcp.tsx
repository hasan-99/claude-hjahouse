import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Quiz, Prose, type QuizQuestion } from "@/components/content";

/* --------------------------------------------------------------------------
   MCP Servers — module body
   Faithful reproduction of claude.hjahouse.me/learn/mcp
-------------------------------------------------------------------------- */

const addServerScript: Step[] = [
  { t: "print", text: "# Add a remote HTTP server", tone: "muted" },
  {
    t: "type",
    text: "claude mcp add --transport http notion https://mcp.notion.com/mcp",
    tone: "user",
    prompt: "$",
  },
  {
    t: "out",
    lines: [
      { text: "✓ Added MCP server: notion", tone: "green" },
      { text: "  Transport: http", tone: "muted" },
      { text: "  URL: https://mcp.notion.com/mcp", tone: "muted" },
    ],
    gap: 60,
  },
  { t: "wait", ms: 800 },
  { t: "print", text: "# Add a local Node.js server via stdio", tone: "muted" },
  {
    t: "type",
    text: "claude mcp add --transport stdio github -- npx @modelcontextprotocol/server-github",
    tone: "user",
    prompt: "$",
  },
  {
    t: "out",
    lines: [
      { text: "✓ Added MCP server: github", tone: "green" },
      { text: "  Transport: stdio", tone: "muted" },
      { text: "  Command: npx @modelcontextprotocol/server-github", tone: "muted" },
    ],
    gap: 60,
  },
  { t: "wait", ms: 800 },
  {
    t: "type",
    text: "claude mcp list",
    tone: "user",
    prompt: "$",
  },
  {
    t: "out",
    lines: [
      { text: "Active MCP servers:", tone: "system" },
      { text: "  notion     http  https://mcp.notion.com/mcp", tone: "green" },
      { text: "  github     stdio npx @modelcontextprotocol/server-github", tone: "green" },
    ],
    gap: 70,
  },
];

const toolSearchScript: Step[] = [
  {
    t: "print",
    text: "# Tool search defers MCP definitions until needed",
    tone: "muted",
  },
  {
    t: "type",
    text: "List all open PRs that haven't been reviewed in more than 3 days.",
    tone: "user",
    prompt: ">",
  },
  {
    t: "out",
    lines: [
      { text: "⟳ Searching tools for: github pull requests…", tone: "amber" },
      { text: "✓ Found: github__list_pull_requests", tone: "green" },
      { text: "⟳ Calling github__list_pull_requests…", tone: "amber" },
    ],
    gap: 80,
  },
  {
    t: "out",
    lines: [
      { text: "Open PRs without review (>3 days):", tone: "blue" },
      { text: "  #142  Fix auth token refresh     4 days  @alice", tone: "default" },
      { text: "  #137  Add dark mode toggle       6 days  @bob", tone: "default" },
      { text: "  #129  Upgrade to Node 22         9 days  @carol", tone: "default" },
    ],
    gap: 65,
  },
];

const channelScript: Step[] = [
  {
    t: "print",
    text: "# Install the Telegram channel plugin",
    tone: "muted",
  },
  {
    t: "type",
    text: "/plugin install telegram@claude-plugins-official",
    tone: "user",
    prompt: ">",
  },
  {
    t: "out",
    lines: [
      { text: "✓ Plugin installed: telegram@claude-plugins-official", tone: "green" },
      { text: "  Configure with: /telegram:configure <token>", tone: "muted" },
    ],
    gap: 70,
  },
  { t: "wait", ms: 700 },
  {
    t: "type",
    text: "claude --channels plugin:telegram@claude-plugins-official",
    tone: "user",
    prompt: "$",
  },
  {
    t: "out",
    lines: [
      { text: "⟳ Connecting channel: telegram…", tone: "amber" },
      { text: "✓ Channel active — events will arrive in this session", tone: "green" },
      { text: "  Waiting for messages…", tone: "muted" },
    ],
    gap: 75,
  },
  { t: "wait", ms: 900 },
  {
    t: "out",
    lines: [
      { text: "[Telegram] @alice: deploy status?", tone: "purple" },
      { text: "⟳ Handling message…", tone: "amber" },
      { text: "[Telegram → @alice] Build passed ✓ — deployed to prod 4 min ago.", tone: "green" },
    ],
    gap: 80,
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    q: "Which command adds a remote HTTP MCP server named 'notion'?",
    options: [
      "claude mcp add notion --url https://mcp.notion.com/mcp",
      "claude mcp add --transport http notion https://mcp.notion.com/mcp",
      "claude mcp connect http notion https://mcp.notion.com/mcp",
      "claude mcp add --type remote notion https://mcp.notion.com/mcp",
    ],
    answer: 1,
    explanation:
      "The correct form is `claude mcp add --transport http <name> <url>`. The --transport flag selects the connection type (http, stdio, or sse), followed by the server name and endpoint.",
  },
  {
    q: "Where should you put MCP configuration that the whole team shares via git?",
    options: [
      "~/.claude.json at the global user level",
      ".mcp.json in the project root",
      "claude.settings.json next to package.json",
      "CLAUDE.md under an [mcp] heading",
    ],
    answer: 1,
    explanation:
      ".mcp.json lives in the project root, is checked into git, and prompts teammates for approval on first use. ~/.claude.json stores local or user-scoped config that is NOT shared.",
  },
  {
    q: "What does `alwaysLoad: true` do in a server's MCP config?",
    options: [
      "Forces the server to reconnect on every session start",
      "Increases the per-tool output token limit for that server",
      "Skips tool-search deferral so all tools are always in context",
      "Loads the server before other servers in the startup sequence",
    ],
    answer: 2,
    explanation:
      "By default, tool search defers MCP tool definitions and discovers them on demand. Setting alwaysLoad: true overrides this so every tool from that server is available immediately without going through the discovery step.",
  },
  {
    q: "Which flag makes Claude Code use ONLY the servers in a specified JSON file, ignoring all other MCP config?",
    options: [
      "--mcp-config ./file.json",
      "--strict-mcp-config --mcp-config ./file.json",
      "--mcp-only ./file.json",
      "--no-mcp --mcp-config ./file.json",
    ],
    answer: 1,
    explanation:
      "--strict-mcp-config tells Claude Code to ignore every other MCP source (user config, project config) for the session, loading only what is in the file(s) passed to --mcp-config. Perfect for reproducing bugs against a known, controlled server set.",
  },
];

export default function Content() {
  return (
    <Prose>
      {/* ── Intro ─────────────────────────────────────────────────────── */}
      <Reveal delay={0}>
        <p>
          MCP (Model Context Protocol) gives Claude real-time access to external
          services. Unlike memory files that store static context, MCP connections
          let Claude query <em>live data</em> — your GitHub issues, production
          database, Slack channels, or any service with an MCP server. This module
          covers adding servers, understanding scopes, and using MCP tools
          effectively.
        </p>
      </Reveal>

      {/* ── Section 1: Adding MCP Servers ─────────────────────────────── */}
      <Reveal delay={70}>
        <h2>Adding MCP Servers</h2>
      </Reveal>

      <Reveal delay={140}>
        <p>
          The fastest way to add a server is the{" "}
          <code>claude mcp add</code> command. Choose the transport that matches
          the server type: <code>http</code> for remote servers,{" "}
          <code>stdio</code> for locally-running processes, and <code>sse</code>{" "}
          for older remote servers that haven&apos;t moved to HTTP yet.
        </p>
      </Reveal>

      <Reveal delay={210}>
        <Callout tone="warn" title="SSE is deprecated">
          SSE transport is deprecated — use HTTP servers instead where available.
          On native Windows you&apos;ll often need{" "}
          <code>cmd /c</code> when launching <code>npx</code>-based stdio servers.
        </Callout>
      </Reveal>

      <Reveal delay={280}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`# Add a remote HTTP server
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Add a local Node.js server via stdio
claude mcp add --transport stdio github -- npx @modelcontextprotocol/server-github

# Add with an auth header
claude mcp add --transport http my-api https://api.example.com/mcp \\
  --header "Authorization: Bearer $MY_TOKEN"`}
        />
      </Reveal>

      <Reveal delay={350}>
        <Terminal
          script={addServerScript}
          title="claude mcp add"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      <Reveal delay={420}>
        <p>
          Manage your servers with <code>claude mcp list</code>,{" "}
          <code>claude mcp get &lt;name&gt;</code>, and{" "}
          <code>claude mcp remove &lt;name&gt;</code>. The <code>/mcp</code>{" "}
          command inside a session shows active connections and triggers OAuth
          flows for servers that require browser-based authentication. Other
          useful commands include <code>claude mcp reset-project-choices</code>,{" "}
          <code>claude mcp add-from-claude-desktop</code>, and{" "}
          <code>claude mcp serve</code> when you want Claude Code itself to act
          as an MCP server.
        </p>
      </Reveal>

      {/* ── .mcp.json ─────────────────────────────────────────────────── */}
      <Reveal delay={490}>
        <h3>Project config with .mcp.json</h3>
      </Reveal>

      <Reveal delay={560}>
        <p>
          MCP configurations live in <code>~/.claude.json</code> (your local
          user config) or <code>.mcp.json</code> in the project root (shared
          with the team). The <code>.mcp.json</code> file is checked into git
          and prompts teammates for approval on first use. Environment variable
          expansion works in all configuration fields — use{" "}
          <code>{"${VAR:-default}"}</code> for fallbacks:
        </p>
      </Reveal>

      <Reveal delay={630}>
        <CodeBlock
          filename=".mcp.json"
          lang="json"
          code={`{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "\${GITHUB_TOKEN}"
      }
    }
  }
}`}
        />
      </Reveal>

      {/* ── --mcp-config flag ─────────────────────────────────────────── */}
      <Reveal delay={700}>
        <h3>Per-session config with --mcp-config</h3>
      </Reveal>

      <Reveal delay={770}>
        <p>
          For one-off sessions — quick experiments, CI runs, or sandboxed
          reproductions — <code>--mcp-config</code> loads MCP servers from JSON
          files instead of touching your saved config. The flag accepts one or
          more file paths (space-separated), so a single command can layer a
          shared config on top of local overrides. Pair it with{" "}
          <code>--strict-mcp-config</code> to ignore every other MCP source for
          that session, which is the cleanest way to reproduce a bug against a
          known server set:
        </p>
      </Reveal>

      <Reveal delay={840}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`# Load a single config file for this session only
claude --mcp-config ./ci-servers.json

# Combine multiple files (space-separated)
claude --mcp-config "./shared-servers.json ./local-overrides.json"

# Reproduce a bug against exactly one server, ignoring user/project config
claude --strict-mcp-config --mcp-config ./repro.json`}
        />
      </Reveal>

      {/* ── Timeouts & Concurrency ────────────────────────────────────── */}
      <Reveal delay={910}>
        <h3>Timeouts and concurrent connections</h3>
      </Reveal>

      <Reveal delay={980}>
        <p>
          MCP servers now connect <strong>concurrently</strong> by default. When
          you have multiple servers configured — both local stdio servers and
          remote claude.ai connectors — they initialize in parallel at startup
          rather than one at a time. This significantly reduces startup latency
          for projects with several MCP integrations.
        </p>
        <p>
          Two different timeouts control MCP behavior. Configure the{" "}
          <strong>server startup timeout</strong> with the{" "}
          <code>MCP_TIMEOUT</code> environment variable (for example,{" "}
          <code>MCP_TIMEOUT=10000 claude</code> sets a 10-second connection
          timeout at launch). <strong>Tool execution</strong> has a separate
          limit: add a <code>timeout</code> field in milliseconds to a
          server&apos;s <code>.mcp.json</code> entry — for example{" "}
          <code>&quot;timeout&quot;: 600000</code> for ten minutes — to cap how
          long any single tool call to that server may run.
        </p>
      </Reveal>

      <Reveal delay={1050}>
        <Callout tone="info" title="Per-server timeout wins">
          The per-server <code>timeout</code> value in <code>.mcp.json</code>{" "}
          overrides the <code>MCP_TOOL_TIMEOUT</code> environment variable for
          that server only. It is a hard wall-clock limit that progress
          notifications do not extend, and values below 1000&nbsp;ms are ignored.
        </Callout>
      </Reveal>

      {/* ── Section 2: Scopes and Tool Discovery ──────────────────────── */}
      <Reveal delay={0}>
        <h2>Scopes and Tool Discovery</h2>
      </Reveal>

      <Reveal delay={70}>
        <p>
          MCP configurations have three scopes. <strong>Local scope</strong>{" "}
          (stored in <code>~/.claude.json</code> under your project&apos;s key)
          is private — just you, just this project. <strong>Project scope</strong>{" "}
          (<code>.mcp.json</code>) is shared with the team via git.{" "}
          <strong>User scope</strong> (<code>~/.claude.json</code> globally)
          applies across all your projects.
        </p>
        <p>
          When the same server is defined at multiple scopes, the local
          configuration wins. This lets you override a team-wide server config
          with a local version for testing without affecting anyone else.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <h3>MCP prompts and resources</h3>
      </Reveal>

      <Reveal delay={210}>
        <p>
          MCP prompts appear as slash commands using the pattern{" "}
          <code>/mcp__servername__promptname</code>. MCP resources can be
          referenced inline with{" "}
          <code>@server:protocol://resource/path</code>.
        </p>
      </Reveal>

      <Reveal delay={280}>
        <h3>Tool search deferral</h3>
      </Reveal>

      <Reveal delay={350}>
        <p>
          Tool search is enabled by default — MCP tool definitions are deferred
          and discovered on demand, so only the tools Claude actually uses for a
          task enter context. It is off by default only on Vertex AI and when{" "}
          <code>ANTHROPIC_BASE_URL</code> points to a non-first-party proxy.
          Override it with the <code>ENABLE_TOOL_SEARCH</code> environment
          variable:
        </p>
        <ul>
          <li>
            <code>true</code> — forces tool search always on
          </li>
          <li>
            <code>false</code> — loads every definition upfront on every turn
          </li>
          <li>
            <code>auto</code> — activates tool search only when tool definitions
            exceed 10% of the context window
          </li>
          <li>
            <code>auto:N</code> — sets a custom percentage threshold
          </li>
        </ul>
      </Reveal>

      <Reveal delay={420}>
        <Callout tone="tip" title="alwaysLoad: true">
          To override deferral for a specific server, add{" "}
          <code>alwaysLoad: true</code> to its config entry — all tools from
          that server will skip tool-search deferral and always be available in
          the session. Individual MCP tool descriptions and server instructions
          are each capped at 2 KB to prevent OpenAPI-generated servers from
          bloating context.
        </Callout>
      </Reveal>

      <Reveal delay={490}>
        <CodeBlock
          filename=".mcp.json"
          lang="json"
          code={`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
      "alwaysLoad": true,
      "timeout": 30000
    }
  }
}`}
        />
      </Reveal>

      <Reveal delay={560}>
        <p>
          A runtime warning appears when an MCP tool&apos;s output exceeds
          10,000 tokens. To increase this limit, set the{" "}
          <code>MAX_MCP_OUTPUT_TOKENS</code> environment variable (default
          25,000).
        </p>
      </Reveal>

      <Reveal delay={630}>
        <Terminal
          script={toolSearchScript}
          title="tool search in action"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      {/* ── Subagent-scoped MCP ───────────────────────────────────────── */}
      <Reveal delay={700}>
        <h3>Subagent-scoped MCP servers</h3>
      </Reveal>

      <Reveal delay={770}>
        <p>
          Subagent-scoped MCP lets you give specific agents access to servers
          that the rest of the session doesn&apos;t need. Define the servers
          directly in the agent&apos;s front-matter:
        </p>
      </Reveal>

      <Reveal delay={840}>
        <CodeBlock
          filename="agents/data-analyst.md"
          lang="yaml"
          code={`---
name: data-analyst
description: Analyze production data
mcpServers:
  - database
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
---`}
        />
      </Reveal>

      {/* ── Section 3: Practical Usage Patterns ───────────────────────── */}
      <Reveal delay={0}>
        <h2>Practical Usage Patterns</h2>
      </Reveal>

      <Reveal delay={70}>
        <h3>GitHub MCP: PRs, issues, and commits</h3>
      </Reveal>

      <Reveal delay={140}>
        <p>
          With the GitHub MCP connected, you can work with PRs, issues, and
          commits using natural language. Claude queries the server, gets live
          data, and responds:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename="claude prompt"
          lang="text"
          code={`List all open PRs that haven't been reviewed in more than 3 days.
Create an issue for the login timeout bug with medium priority.
/mcp__github__pr_review 456`}
        />
      </Reveal>

      <Reveal delay={280}>
        <h3>Database MCP: natural language queries</h3>
      </Reveal>

      <Reveal delay={350}>
        <p>
          The database MCP enables natural language queries without writing SQL
          yourself:
        </p>
      </Reveal>

      <Reveal delay={420}>
        <CodeBlock
          filename="claude prompt"
          lang="text"
          code={`Find all users who placed more than 5 orders in the last 30 days.
What's the average order value by country for Q1 2026?`}
        />
      </Reveal>

      <Reveal delay={490}>
        <h3>Composing multiple servers</h3>
      </Reveal>

      <Reveal delay={560}>
        <p>
          For complex workflows, multiple MCP servers compose naturally. A daily
          report workflow might: fetch PR metrics from GitHub MCP, query sales
          data from the database MCP, write a report using the filesystem MCP,
          and post it via Slack MCP — all in a single session.
        </p>
      </Reveal>

      {/* ── MCP Elicitation ───────────────────────────────────────────── */}
      <Reveal delay={630}>
        <h3>MCP elicitation</h3>
      </Reveal>

      <Reveal delay={700}>
        <p>
          MCP elicitation lets a server pause the workflow and request structured
          input from the user. When a server needs information it can&apos;t get
          on its own — an OAuth authorization, a confirmation before a
          destructive action, or a form with project-specific parameters — it
          triggers an interactive dialog. The user sees form fields or a browser
          URL, provides the response, and the server resumes where it left off.
          The <code>Elicitation</code> and <code>ElicitationResult</code> hooks
          let you intercept or customize these dialogs programmatically.
        </p>
      </Reveal>

      {/* ── Security best practices ───────────────────────────────────── */}
      <Reveal delay={770}>
        <h3>Security best practices</h3>
      </Reveal>

      <Reveal delay={840}>
        <ul>
          <li>Always use environment variables for credentials</li>
          <li>Never commit tokens to git</li>
          <li>Use read-only tokens when you only need to query data</li>
          <li>
            Limit server access scope to the minimum needed
          </li>
          <li>
            For enterprise deployments, <code>managed-mcp.json</code> lets
            administrators enforce an allowlist of permitted servers
            organization-wide
          </li>
        </ul>
      </Reveal>

      {/* ── Reconnection & list_changed ───────────────────────────────── */}
      <Reveal delay={910}>
        <h3>Reconnection and dynamic tool updates</h3>
      </Reveal>

      <Reveal delay={980}>
        <p>
          MCP servers can send <code>list_changed</code> notifications to
          dynamically update their available tools, prompts, and resources
          without requiring reconnection. If an HTTP or SSE server disconnects
          mid-session, Claude Code automatically reconnects with exponential
          backoff — up to five attempts, starting at a one-second delay and
          doubling each time. For initial connections at startup, the same
          backoff applies but retries up to three times on transient errors such
          as a 5xx response, a connection refused, or a timeout.
        </p>
      </Reveal>

      {/* ── Section 4: Channels ───────────────────────────────────────── */}
      <Reveal delay={0}>
        <h2>Channels: Push Events Into a Running Session</h2>
      </Reveal>

      <Reveal delay={70}>
        <p>
          Channels are MCP servers that push events into your running session so
          Claude can react while you&apos;re away from the terminal. Unlike
          standard MCP servers that Claude queries on demand, a channel delivers
          messages proactively — a chat bridge from Telegram, a CI webhook, or a
          monitoring alert. Events only arrive while the session is open.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <Callout tone="warn" title="Research preview">
          Channels are in research preview and require Claude Code v2.1.80 or
          later. Three plugins are included: <strong>Telegram</strong>,{" "}
          <strong>Discord</strong>, and <strong>iMessage</strong>. Channels
          require Anthropic authentication (claude.ai or Console API key) and
          are <strong>not</strong> available on Bedrock, Vertex AI, or Foundry.
        </Callout>
      </Reveal>

      <Reveal delay={210}>
        <p>
          Install a channel plugin with{" "}
          <code>/plugin install telegram@claude-plugins-official</code>,
          configure it with the plugin&apos;s{" "}
          <code>/telegram:configure &lt;token&gt;</code> command, then restart
          with the <code>--channels</code> flag to activate it:
        </p>
      </Reveal>

      <Reveal delay={280}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`claude --channels plugin:telegram@claude-plugins-official`}
        />
      </Reveal>

      <Reveal delay={350}>
        <p>
          Each channel maintains a sender allowlist — only IDs you&apos;ve added
          can push messages. Telegram and Discord use a pairing flow: message
          your bot, receive a code, then approve it in Claude Code with{" "}
          <code>/telegram:access pair &lt;code&gt;</code> and lock down with{" "}
          <code>/telegram:access policy allowlist</code>. iMessage bypasses
          pairing for self-chat and lets you add contacts by handle.
        </p>
      </Reveal>

      <Reveal delay={420}>
        <Terminal
          script={channelScript}
          title="channels demo"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      <Reveal delay={490}>
        <p>
          Team and Enterprise organizations must enable channels via{" "}
          <code>channelsEnabled</code> in managed settings — they&apos;re blocked
          by default. Pro and Max users can use channels directly by opting in
          per session with <code>--channels</code>. Admins can also restrict
          which plugins are allowed via the <code>allowedChannelPlugins</code>{" "}
          managed setting.
        </p>
        <p>
          When Claude replies through a channel, the reply appears on the
          external platform (Telegram, Discord, etc.) — your terminal shows the
          tool call and confirmation but not the reply text itself.
        </p>
      </Reveal>

      {/* ── Quiz ──────────────────────────────────────────────────────── */}
      <Reveal delay={0}>
        <Quiz questions={quizQuestions} title="Quick check — MCP Servers" />
      </Reveal>
    </Prose>
  );
}
