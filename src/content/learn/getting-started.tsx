import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Kbd, Quiz, Prose, type QuizQuestion } from "@/components/content";

/* ── Terminal demo: first session ─────────────────────────────────────────── */
const firstSessionScript: Step[] = [
  { t: "print", text: "~ Navigate to your project", tone: "system" },
  { t: "type", text: "cd my-project", tone: "user", prompt: "$" },
  { t: "print", text: "", tone: "default" },
  { t: "type", text: "claude", tone: "user", prompt: "$" },
  { t: "wait", ms: 400 },
  { t: "out", lines: [
    { text: "╭──────────────────────────────────────────╮", tone: "muted" },
    { text: "│  Welcome to Claude Code  v1.24.12        │", tone: "green" },
    { text: "│  Type /help for available commands       │", tone: "muted" },
    { text: "╰──────────────────────────────────────────╯", tone: "muted" },
  ], gap: 55 },
  { t: "wait", ms: 300 },
  { t: "type", text: "What files are in this project and what does it do?", tone: "user", prompt: ">" },
  { t: "wait", ms: 500 },
  { t: "out", lines: [
    { text: "Reading project structure…", tone: "system" },
    { text: "", tone: "default" },
    { text: "This is a Next.js 14 app with TypeScript.", tone: "green" },
    { text: "Key files:", tone: "green" },
    { text: "  • src/app/page.tsx — home route", tone: "default" },
    { text: "  • src/lib/api.ts   — fetch helpers", tone: "default" },
    { text: "  • package.json     — Node 18, React 18", tone: "default" },
  ], gap: 60 },
];

/* ── Terminal demo: /help ─────────────────────────────────────────────────── */
const helpScript: Step[] = [
  { t: "type", text: "/help", tone: "user", prompt: ">" },
  { t: "wait", ms: 300 },
  { t: "out", lines: [
    { text: "Available commands:", tone: "system" },
    { text: "", tone: "default" },
    { text: "  /help            Show this help message", tone: "green" },
    { text: "  /config          Open configuration panel", tone: "green" },
    { text: "  /clear           Clear conversation history", tone: "green" },
    { text: "  /memory          View or edit memory files", tone: "green" },
    { text: "  /doctor          Check installation health", tone: "amber" },
    { text: "  /logout          Sign out of Claude Code", tone: "amber" },
    { text: "  /terminal-setup  Configure terminal keybindings", tone: "blue" },
    { text: "", tone: "default" },
    { text: "  Type any prompt in plain English to get started.", tone: "muted" },
  ], gap: 55 },
];

/* ── Quiz ─────────────────────────────────────────────────────────────────── */
const questions: QuizQuestion[] = [
  {
    q: "What is the recommended installation method for Claude Code that provides automatic updates?",
    options: [
      "npm install -g @anthropic-ai/claude-code",
      "brew install --cask claude-code",
      "The native installer via curl / PowerShell",
      "winget install Anthropic.ClaudeCode",
    ],
    answer: 2,
    explanation:
      "The native installer (curl -fsSL https://claude.ai/install.sh | bash on macOS/Linux, or the PowerShell equivalent on Windows) is the recommended method because it auto-updates in the background so you always have the latest version.",
  },
  {
    q: "Where does Claude Code store your credentials on Linux and Windows?",
    options: [
      "In the macOS Keychain",
      "In ~/.claude/.credentials.json (mode 0600)",
      "In a browser cookie",
      "In an environment variable in your shell profile",
    ],
    answer: 1,
    explanation:
      "On Linux and Windows, Claude Code stores credentials at ~/.claude/.credentials.json with mode 0600 (readable only by your user). On macOS it uses the native Keychain instead.",
  },
  {
    q: "Which slash command checks your Claude Code installation health, MCP servers, and settings?",
    options: ["/help", "/config", "/doctor", "/terminal-setup"],
    answer: 2,
    explanation:
      "Running claude doctor (or /doctor) performs a detailed check of your setup including MCP servers and settings — more thorough than just running claude --version.",
  },
  {
    q: "What is the minimum Node.js version required for the npm installation method?",
    options: ["Node.js 14+", "Node.js 16+", "Node.js 18+", "Node.js 20+"],
    answer: 2,
    explanation:
      "The npm method (npm install -g @anthropic-ai/claude-code) requires Node.js 18 or higher. The native installer bundles its own runtime so it has no Node.js prerequisite.",
  },
];

export default function Content() {
  return (
    <Prose>
      {/* ── Intro ──────────────────────────────────────────────────────────── */}
      <Reveal delay={0}>
        <p>
          Claude Code is an <strong>AI coding assistant</strong> that lives in your{" "}
          <strong>terminal</strong> — the text-based window where developers type commands.
          Instead of clicking buttons in an app, you type what you want in plain English,
          and Claude reads your code, suggests fixes, writes new features, runs tests, and
          even manages files — all by understanding your project directly on your machine.
        </p>
      </Reveal>

      {/* ── What is Claude Code ──────────────────────────────────────────────── */}
      <Reveal delay={70}>
        <h2>What is Claude Code?</h2>
        <p>
          Before you can use any slash command or build a workflow, you need Claude Code
          running on your machine. This module walks you through installation,
          authentication, picking the right terminal and IDE setup, and running your very
          first session.
        </p>
      </Reveal>

      {/* ── Key terms ─────────────────────────────────────────────────────────── */}
      <Reveal delay={140}>
        <Callout tone="info" title="New to the terminal? — key terms explained">
          <ul className="mt-1 space-y-1.5">
            <li>
              <strong>Terminal</strong> (also called console or command line): a text
              window where you type commands instead of clicking icons. On macOS it&apos;s
              called Terminal.app; on Windows it&apos;s Windows Terminal or PowerShell.
            </li>
            <li>
              <strong>CLI</strong> (Command Line Interface): a program you control by
              typing commands rather than using a graphical interface. Claude Code is a
              CLI tool.
            </li>
            <li>
              <strong>Slash command</strong>: a shortcut that starts with <Kbd>/</Kbd>{" "}
              (like <Kbd>/help</Kbd> or <Kbd>/config</Kbd>) that triggers a specific
              action inside Claude Code.
            </li>
            <li>
              <strong>OAuth</strong>: a secure sign-in method that opens your browser so
              you can log in without pasting passwords into the terminal.
            </li>
            <li>
              <strong>API key</strong>: a secret code that lets a program authenticate
              with a service. Used as an alternative to OAuth when connecting Claude Code.
            </li>
            <li>
              <strong>IDE</strong> (Integrated Development Environment): a code editor
              with built-in tools — VS Code, IntelliJ IDEA, and PyCharm are popular
              examples.
            </li>
          </ul>
        </Callout>
      </Reveal>

      {/* ── Prerequisites ─────────────────────────────────────────────────────── */}
      <Reveal delay={210}>
        <h2>Prerequisites</h2>
        <p>
          Claude Code runs on <strong>macOS 13+</strong>,{" "}
          <strong>Ubuntu 20.04+</strong> (and other modern Linux distros), and{" "}
          <strong>Windows 10 1809+</strong> (native or WSL). You need at least 4 GB of
          RAM — 8 GB is recommended for comfortable use. An active internet connection
          is required at all times.
        </p>
        <p>
          You also need an eligible Anthropic account — a Pro, Max, Team, Enterprise, or
          Console account. The free Claude.ai plan does <em>not</em> include Claude Code
          access. Alternatively, you can use an API key from the Anthropic Console or
          connect through Amazon Bedrock, Google Vertex AI, or Microsoft Foundry.
        </p>
      </Reveal>

      <Reveal delay={280}>
        <Callout tone="note">
          When Git for Windows is installed, Claude Code uses Git Bash for the Bash tool.
          The PowerShell tool is rolling out progressively — set{" "}
          <code>CLAUDE_CODE_USE_POWERSHELL_TOOL=1</code> to opt in or{" "}
          <code>0</code> to opt out.
        </Callout>
      </Reveal>

      {/* ── Installing the CLI ────────────────────────────────────────────────── */}
      <Reveal delay={350}>
        <h2>Installing the CLI</h2>
        <p>
          The recommended way to install Claude Code is the{" "}
          <strong>native installer</strong>. It auto-updates in the background so you
          always have the latest version.
        </p>
      </Reveal>

      <Reveal delay={420}>
        <h3>macOS or Linux (including WSL)</h3>
        <CodeBlock
          lang="bash"
          filename="Terminal"
          code={`curl -fsSL https://claude.ai/install.sh | bash`}
        />
      </Reveal>

      <Reveal delay={490}>
        <h3>Windows via PowerShell</h3>
        <CodeBlock
          lang="powershell"
          filename="PowerShell"
          code={`irm https://claude.ai/install.ps1 | iex`}
        />
      </Reveal>

      <Reveal delay={560}>
        <h3>Windows via CMD</h3>
        <CodeBlock
          lang="cmd"
          filename="Command Prompt"
          code={`curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd`}
        />
      </Reveal>

      <Reveal delay={630}>
        <h3>Alternative installation methods</h3>
        <p>
          These alternatives require manual updates:
        </p>
        <CodeBlock
          lang="bash"
          filename="Alternative methods"
          code={`# Homebrew (stable)
brew install --cask claude-code

# Homebrew (latest)
brew install --cask claude-code@latest

# WinGet (Windows)
winget install Anthropic.ClaudeCode

# npm (requires Node.js 18+)
npm install -g @anthropic-ai/claude-code

# Linux package managers
sudo apt install claude-code        # Debian/Ubuntu
sudo dnf install claude-code        # Fedora/RHEL
apk add claude-code                 # Alpine`}
        />
      </Reveal>

      <Reveal delay={700}>
        <h3>Verify the installation</h3>
        <p>After installation, confirm it worked:</p>
        <CodeBlock
          lang="bash"
          filename="Terminal"
          code={`claude --version`}
        />
        <p>
          For a more detailed check of your installation and configuration, run{" "}
          <code>claude doctor</code> — it validates your setup, MCP servers, and settings.
          You can also control the update channel through <Kbd>/config</Kbd> — choose
          between <code>latest</code> (newest features) and <code>stable</code> (tested
          releases, about one week behind).
        </p>
      </Reveal>

      {/* ── Authentication ────────────────────────────────────────────────────── */}
      <Reveal delay={770}>
        <h2>Authentication</h2>
        <p>
          When you run <code>claude</code> for the first time, it automatically opens your
          browser for OAuth authentication. Sign in with your Anthropic account and
          you&apos;re ready to go.
        </p>
        <p>If you&apos;re using an API key instead, set the environment variable before launching:</p>
        <CodeBlock
          lang="bash"
          filename="Terminal"
          code={`export ANTHROPIC_API_KEY=sk-ant-...
claude`}
        />
      </Reveal>

      <Reveal delay={840}>
        <h3>Enterprise / cloud provider setups</h3>
        <p>Use the corresponding environment variables for cloud providers:</p>
        <CodeBlock
          lang="bash"
          filename="Terminal"
          code={`# Amazon Bedrock
CLAUDE_CODE_USE_BEDROCK=1

# Google Vertex AI
CLAUDE_CODE_USE_VERTEX=1

# Microsoft Foundry
CLAUDE_CODE_USE_FOUNDRY=1`}
        />
      </Reveal>

      <Reveal delay={910}>
        <p>
          Your credentials are stored securely — in the <strong>macOS Keychain</strong> on
          Mac, or in <code>~/.claude/.credentials.json</code> (mode 0600) on Linux and
          Windows.
        </p>
        <p>
          To switch accounts or re-authenticate at any time, use{" "}
          <Kbd>/logout</Kbd>. You can also explicitly trigger authentication with{" "}
          <code>claude auth login</code> — it opens the browser OAuth flow, or if the
          browser can&apos;t open, prints a URL you can paste into any browser.
          Additional options include:
        </p>
        <ul>
          <li>
            <code>claude auth login --email</code> — pre-fill your email
          </li>
          <li>
            <code>claude auth login --sso</code> — for SSO-enabled organizations
          </li>
          <li>
            <code>claude auth login --console</code> — API key authentication through the
            Anthropic Console
          </li>
        </ul>
      </Reveal>

      {/* ── Terminal Recommendation ───────────────────────────────────────────── */}
      <Reveal delay={980}>
        <h2>Your Terminal: Warp Recommended</h2>
        <p>
          Claude Code works in any terminal — Terminal.app, iTerm2, Windows Terminal,
          Alacritty, Kitty, Ghostty, and more. But for the best experience, we recommend{" "}
          <strong>Warp</strong>.
        </p>
        <p>
          Warp has an official Claude Code plugin that provides native desktop
          notifications when Claude completes a task, needs your input, or requests
          permissions. This is especially useful for long-running operations where you
          switch to another window.
        </p>
        <p>To set up the Warp plugin, run these commands inside Claude Code after installation:</p>
        <CodeBlock
          lang="bash"
          filename="Claude Code prompt"
          code={`/plugin marketplace add warpdotdev/claude-code-warp
/plugin install warp@claude-code-warp`}
        />
      </Reveal>

      <Reveal delay={1050}>
        <Callout tone="tip">
          By default, Claude Code only sends desktop notifications in Ghostty, Kitty, and
          iTerm2. In any other terminal, set <code>preferredNotifChannel</code> to{" "}
          <code>&quot;terminal_bell&quot;</code> to ring the terminal bell instead, or
          configure a Notification hook for a custom sound.
          <br />
          <br />
          By default, Claude Code uses the terminal&apos;s alternate screen for a fullscreen
          rendering experience. Set{" "}
          <code>CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1</code> before launching if you
          prefer native scrollback (useful for screen readers or terminal multiplexers).
        </Callout>
      </Reveal>

      {/* ── IDE Extensions ────────────────────────────────────────────────────── */}
      <Reveal delay={1120}>
        <h2>IDE Extensions</h2>
        <p>
          Claude Code started as a CLI tool, but it now has official extensions for major
          editors. You can use both — the CLI for heavy terminal work and the extension
          for in-editor convenience.
        </p>
      </Reveal>

      <Reveal delay={1190}>
        <h3>VS Code</h3>
        <p>
          The most mature integration. Install it from the VS Code Marketplace or run:
        </p>
        <CodeBlock
          lang="bash"
          filename="Terminal"
          code={`code --install-extension Anthropic.claude-code`}
        />
        <p>
          It gives you a native graphical interface, visual diff review, file references,
          conversation history, and the ability to run multiple conversations in tabs.
        </p>
      </Reveal>

      <Reveal delay={1260}>
        <h3>JetBrains</h3>
        <p>
          An official plugin in beta, available in the JetBrains Marketplace for
          IntelliJ IDEA, WebStorm, PyCharm, and other JetBrains IDEs. It orchestrates
          the CLI with the IDE&apos;s diff viewer for a seamless experience.
        </p>
      </Reveal>

      <Reveal delay={1330}>
        <Callout tone="info" title="Beyond IDE extensions">
          There&apos;s also a <strong>Desktop App</strong> for macOS and Windows (not
          available on Linux — use the CLI instead) that provides visual diffs, live app
          preview, and autonomous background agents — no terminal needed. And{" "}
          <strong>Claude Code on the Web</strong> (claude.ai/code) is a research preview
          that runs on cloud VMs, so you can work from any browser without any local
          setup.
        </Callout>
      </Reveal>

      {/* ── First Session ─────────────────────────────────────────────────────── */}
      <Reveal delay={1400}>
        <h2>Your First Session</h2>
        <p>
          Navigate to any project directory and launch Claude Code:
        </p>
        <CodeBlock
          lang="bash"
          filename="Terminal"
          code={`cd my-project
claude`}
        />
        <p>
          You&apos;ll see a welcome message and a prompt. Just type what you want Claude
          to do in plain English. You can also paste images with{" "}
          <Kbd>Ctrl</Kbd>+<Kbd>V</Kbd> — a &quot;Pasting…&quot; hint appears in the
          footer while the image is being read from the clipboard:
        </p>
        <CodeBlock
          lang="text"
          filename="Your first prompt"
          code={`What files are in this project and what does it do?`}
        />
        <p>
          Claude will read your files, analyze the structure, and give you a summary.
          From here, you can ask it to make changes, fix bugs, run tests, or explain
          code. When Claude needs to perform actions like editing files or running
          commands, it will ask for your permission first.
        </p>
      </Reveal>

      {/* ── Live terminal demo: first session ────────────────────────────────── */}
      <Reveal delay={1470}>
        <Terminal
          script={firstSessionScript}
          title="First Claude Code Session"
          loop={true}
          showStatus={true}
          className="my-6"
        />
      </Reveal>

      {/* ── /help demo ────────────────────────────────────────────────────────── */}
      <Reveal delay={1540}>
        <h2>Getting Help: /help</h2>
        <p>
          Once you&apos;re inside a Claude Code session, type <Kbd>/help</Kbd> at any time
          to see every available slash command. This is the fastest way to discover what
          Claude Code can do without leaving the terminal.
        </p>
        <Terminal
          script={helpScript}
          title="Claude Code — /help"
          loop={false}
          showStatus={true}
          className="my-6"
        />
      </Reveal>

      <Reveal delay={1610}>
        <Callout tone="tip" title="Run /doctor first">
          After your first successful login, run <Kbd>/doctor</Kbd> (or{" "}
          <code>claude doctor</code>) to verify your full setup: authentication, Node
          version, MCP server connections, and settings. It&apos;s the quickest way to
          catch any configuration issues before you start working.
        </Callout>
      </Reveal>

      {/* ── Quiz ──────────────────────────────────────────────────────────────── */}
      <Reveal delay={1680}>
        <Quiz questions={questions} title="Quick check — Getting Started" />
      </Reveal>
    </Prose>
  );
}
