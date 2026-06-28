import { Container, PageHeader } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { Callout } from "@/components/content";

export const metadata = {
  title: "Changelog",
  description:
    "What's been shipped and fixed on the Claude Code learning platform.",
};

/* ------------------------------------------------------------------ */
/*  Data — faithful reproduction of claude.hjahouse.me/changelog content  */
/* ------------------------------------------------------------------ */

type Tag = "Improved" | "Fixed" | "Added" | "Arabic";

interface ChangeItem {
  tag: Tag;
  heading: string;
  body: string;
}

interface Entry {
  version: string;
  date: string;
  title: string;
  summary: string;
  items: ChangeItem[];
}

const TAG_COLORS: Record<Tag, string> = {
  Added: "bg-beginner/15 text-beginner border border-beginner/30",
  Improved: "bg-accent-soft text-accent border border-accent/30",
  Fixed: "bg-intermediate/15 text-intermediate border border-intermediate/30",
  Arabic: "bg-bg-muted text-fg-muted border border-border",
};

const ENTRIES: Entry[] = [
  {
    version: "v1.24.12",
    date: "Jun 28, 2026",
    title:
      "Consolidate five audit PRs across memory, mcp, plugins, subagents, and workflows (supersedes #314–#318)",
    summary:
      "Today's pass reviewed five auto-generated audit PRs against the official Claude Code docs and shipped all five confirmed findings as one consolidated change, EN and AR.",
    items: [
      {
        tag: "Improved",
        heading: "memory: clarify path-scoped rule activation and add a 'Write effective instructions' section",
        body: "Path-scoped rules in .claude/rules/ trigger when Claude reads files matching the pattern, not on every tool use; rules without a paths field load at launch with the same priority as .claude/CLAUDE.md; circular symlinks are detected and handled gracefully. A new 'Write effective instructions' section covers the context-window visualization and the under-200-lines-per-CLAUDE.md target.",
      },
      {
        tag: "Improved",
        heading: "mcp, plugins, subagents, workflows: document four confirmed doc nuances",
        body: "Channels lead with their research-preview status and v2.1.80 minimum (mcp); a single-skill plugin can place SKILL.md at the plugin root with the frontmatter name as the invocation name (plugins); the built-in Explore and Plan agents skip CLAUDE.md and git status while every other subagent loads both (subagents); and dynamic-workflow resume only works within the same Claude Code session, restarting fresh after you exit (workflows).",
      },
      {
        tag: "Fixed",
        heading: "memory: restore the deleted guided-terminal marker from audit PR #315",
        body: "Auto-generated PR #315 replaced the English memory module's <!-- terminal: guided --> marker with its new paragraph, which would have broken the guided terminal step and left EN out of parity with AR (which kept the marker). The marker is restored and the new paragraph now sits before it, matching the Arabic structure.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity across all five module updates",
        body: "The Arabic memory, mcp, plugins, subagents, and workflows modules mirror every English change — path-scoped rule behavior and the effective-instructions section, the Channels rewording, the single-skill SKILL.md note, the Explore/Plan skip note, and the workflow resume clarification.",
      },
    ],
  },
  {
    version: "v1.24.11",
    date: "Jun 27, 2026",
    title:
      "Distinguish MCP startup timeout from tool-execution timeout (supersedes audit PR #312)",
    summary:
      "The module covered only the startup timeout and never mentioned the separate tool-execution timeout. That distinction now lives in the mcp module, EN and AR.",
    items: [
      {
        tag: "Improved",
        heading: "mcp: distinguish the server startup timeout from the per-server tool-execution timeout",
        body: "MCP_TIMEOUT sets the server startup/connection timeout at launch. Tool execution has a separate cap: a timeout field in milliseconds on a server's .mcp.json entry (e.g. \"timeout\": 600000 for ten minutes) limits how long any single tool call may run, overrides MCP_TOOL_TIMEOUT for that server only, is a hard wall-clock limit that progress notifications don't extend, and ignores values below 1000.",
      },
      {
        tag: "Fixed",
        heading: "mcp: reject the imprecise MCP_TIMEOUT re-wording from audit PR #312",
        body: "Audit PR #312 wanted to relabel MCP_TIMEOUT as 'a per-server startup timeout, not a general per-server timeout'. The docs call it the 'MCP server startup timeout' — a launch-time environment variable, not a per-server field — so the awkward clause was dropped in favor of the accurate startup-vs-tool-execution split.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for the MCP timeout distinction",
        body: "The Arabic mcp module mirrors the startup-timeout (MCP_TIMEOUT) versus tool-execution-timeout (per-server timeout field / MCP_TOOL_TIMEOUT) split, matching the English change.",
      },
    ],
  },
  {
    version: "v1.24.10",
    date: "Jun 26, 2026",
    title:
      "Document claude plugin prune accurately, reject the auto:N removal (consolidates audit PRs #308–#310)",
    summary:
      "Reviewed three auto-generated audit PRs against the official Claude Code docs. Only what held up was shipped.",
    items: [
      {
        tag: "Improved",
        heading: "plugins: document claude plugin prune accurately + the plugin details inventory (PR #309)",
        body: "claude plugin prune (new in v2.1.121, aliased autoremove) removes auto-installed plugin dependencies that no other installed plugin still requires — directly-installed plugins are never touched, and 'uninstall <plugin> --prune' does both in one step. claude plugin details now lists the component inventory grouped as Skills, Agents, Hooks, MCP servers, and LSP servers with a projected per-session token cost. Added to the plugins module, the reference cheatsheet, and the feature catalog.",
      },
      {
        tag: "Fixed",
        heading: "mcp: keep ENABLE_TOOL_SEARCH=auto:N (rejected audit PR #308)",
        body: "An audit PR removed the auto:N variant of ENABLE_TOOL_SEARCH. The MCP reference documents it verbatim — 'auto:N: Threshold mode with a custom percentage, where N is 0-100' (e.g. auto:5 for 5%) — so the variant stays. The mcp module and quiz were left unchanged.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for the plugin prune / details updates",
        body: "The Arabic plugins module mirrors the corrected claude plugin prune description and the expanded claude plugin details inventory, matching the English changes.",
      },
    ],
  },
  {
    version: "v1.24.9",
    date: "Jun 25, 2026",
    title:
      "Clarify /code-review is the renamed /simplify, keep Console in the account list (consolidates audit PRs #304–#306)",
    summary:
      "Three auto-generated audit PRs reviewed against the official Claude Code docs. Two findings applied, one rejected as a regression.",
    items: [
      {
        tag: "Improved",
        heading: "slash-commands: /code-review is the renamed /simplify, not a brand-new command (PR #306)",
        body: "The '(new in v2.1.147)' tag implied /code-review was new; the changelog records /simplify being renamed to /code-review in v2.1.147. The module and quiz now describe /code-review as the bundled skill formerly called /simplify, in EN and AR.",
      },
      {
        tag: "Fixed",
        heading: "getting-started: keep Console in the account requirement list (corrects rejected audit PR #304)",
        body: "An audit PR dropped 'Console' from the supported account list. The install doc states 'Claude Code requires a Pro, Max, Team, Enterprise, or Console account' — Console stays. We adopted the docs' clearer 'requires … account' phrasing while keeping all five account types.",
      },
      {
        tag: "Fixed",
        heading: "mcp: keep 'claude mcp serve' / 'add-from-claude-desktop' and the v2.1.121 startup-retry version (rejected audit PR #305)",
        body: "An audit PR removed two documented commands and re-dated the startup-retry behavior to v2.1.187. The MCP reference documents both 'claude mcp add-from-claude-desktop' and 'claude mcp serve', and dates the up-to-three startup retries on transient errors to v2.1.121 (v2.1.187 is the unrelated 5-minute remote-tool idle timeout). The original mcp content was correct and was kept unchanged.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for the /code-review and account-list updates",
        body: "The Arabic slash-commands module and quiz mirror the /code-review-formerly-/simplify clarification, and the Arabic getting-started module keeps Console in the account list with the 'requires' phrasing.",
      },
    ],
  },
  {
    version: "v1.24.8",
    date: "Jun 24, 2026",
    title:
      "Correct the /fewer-permission-prompts command name and the subagent priority order (consolidates audit PRs #300–#302)",
    summary:
      "v1.24.5 had incorrectly renamed the permission-prompts command. The wrong name is now reverted everywhere it leaked.",
    items: [
      {
        tag: "Fixed",
        heading: "slash-commands: the command is /fewer-permission-prompts, not /less-permission-prompts (corrects v1.24.5)",
        body: "v1.24.5 renamed the command the wrong way round. The official name — per the v2.1.105–v2.1.113 release notes and the live /fewer-permission-prompts skill — is /fewer-permission-prompts. Reverted across the slash-commands and skills modules, the reference cheatsheet, and the feature catalog (entry id and name).",
      },
      {
        tag: "Fixed",
        heading: "subagents: priority is managed > CLI flag > project > user > plugin (PR #302)",
        body: "The subagent definition priority no longer lists 'built-in' as a priority level. Per the features-overview docs, built-in subagents are always available and are not part of the name-override priority system, which runs managed > CLI flag > project > user > plugin.",
      },
      {
        tag: "Fixed",
        heading: "workflows: ultracode trigger rename stays v2.1.160 (rejected audit PR #300)",
        body: "An audit proposed moving the rename from v2.1.160 to v2.1.154, citing the GitHub CHANGELOG.md. The official workflows docs state 'Before v2.1.160 the literal trigger keyword was workflow' — so v2.1.160 is the documented rename version and the existing content was kept unchanged.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for the command-name and priority fixes",
        body: "The Arabic slash-commands, skills, and subagents modules, plus the Arabic feature catalog and reference cheatsheet, mirror the /fewer-permission-prompts revert and the subagent-priority correction.",
      },
    ],
  },
  {
    version: "v1.24.7",
    date: "Jun 23, 2026",
    title:
      "Correct MCP tool search: it IS enabled by default — auto is only the 10% threshold mode (rejected audit PR #298)",
    summary:
      "An audit PR tried to rewrite the MCP module to claim tool search is off until you set ENABLE_TOOL_SEARCH=auto. The official reference says the opposite: tool search is enabled by default.",
    items: [
      {
        tag: "Improved",
        heading: "mcp: document the full ENABLE_TOOL_SEARCH value table",
        body: "The MCP module now spells out the override values from the docs: true forces tool search always on, false loads every definition upfront on every turn, and auto (or auto:N) activates tool search only when tool definitions exceed 10% (or N%) of the context window.",
      },
      {
        tag: "Fixed",
        heading: "mcp: tool search is enabled by default — reject audit PR #298",
        body: "An audit PR claimed tool search only works after setting ENABLE_TOOL_SEARCH=auto. The official tool search reference states tool search is enabled by default (definitions deferred and discovered on demand), off by default only on Vertex AI or non-first-party ANTHROPIC_BASE_URL proxies. The original content was correct; PR #298 was a regression and is closed.",
      },
      {
        tag: "Fixed",
        heading: "mcp quiz: q6 reframed to scope the 10% threshold to auto mode",
        body: "Quiz q6 previously framed the 10% threshold as automatic default behavior. Per the docs, the 10% threshold is specifically the ENABLE_TOOL_SEARCH=auto mode — under the default (unset), tool search is already on regardless of size. The question now asks what auto does when definitions cross 10%.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for the MCP tool search correction",
        body: "The Arabic MCP module and quiz get the same correction: tool search on by default, the full ENABLE_TOOL_SEARCH value table, and q6 reframed around auto mode.",
      },
    ],
  },
  {
    version: "v1.24.6",
    date: "Jun 22, 2026",
    title:
      "Add practical memory guidance (issue #293), fix the claude plugin tag version, and reject the subagents effort 'max' removal",
    summary:
      "Three open PRs consolidated into one release: practical memory guidance added, plugin tag version corrected, and subagents effort max kept.",
    items: [
      {
        tag: "Improved",
        heading: "memory: practical guidance on which memory to use (issue #293)",
        body: "A reader said the memory hierarchy was confusing without context on why it matters. The Memory Hierarchy section now has an 'In practice' callout: use project memory for what a teammate needs to understand the codebase (setup, testing, architecture), user memory for how you personally like to work, and CLAUDE.local.md for entries that only matter to you.",
      },
      {
        tag: "Fixed",
        heading: "plugins: claude plugin tag is v2.1.118, not v2.1.121",
        body: "The plugins module attributed claude plugin tag to v2.1.121. The official changelog shows v2.1.118 added claude plugin tag (release git tags with version validation) and v2.1.121 added the separate claude plugin prune command, so the annotation now reads v2.1.118.",
      },
      {
        tag: "Fixed",
        heading: "subagents: effort keeps max (rejected audit PR #296)",
        body: "An audit PR removed max from the subagents effort values, claiming v2.1.72 dropped it. The official sub-agents reference lists the effort options verbatim as low, medium, high, xhigh, max, so the existing content is correct and max was kept.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for all three changes",
        body: "The Arabic memory module gets the same 'In practice' callout, the Arabic plugins module gets the v2.1.118 fix for claude plugin tag, and the Arabic subagents module keeps max in its effort values.",
      },
    ],
  },
  {
    version: "v1.24.5",
    date: "Jun 21, 2026",
    title:
      "Finish the /less-permission-prompts rename across the catalog and cheatsheet; reject the repeat skills-budget PR",
    summary:
      "Merged the slash-commands rename (PR #291) and closed parity gaps the PR left behind in the feature catalog and reference cheatsheet.",
    items: [
      {
        tag: "Fixed",
        heading: "slash-commands: /less-permission-prompts rename completed everywhere",
        body: "The command is now /less-permission-prompts across the slash-commands module (PR #291), the feature catalog, and the reference cheatsheet. The catalog and cheatsheet had been missed by PR #291 and still showed the old /fewer-permission-prompts name, so the command search index now matches the official spelling. Verified against the changelog (added in v2.1.112).",
      },
      {
        tag: "Fixed",
        heading: "skills: budget stays at 1% (rejected audit PR #290)",
        body: "PR #290 repeated the already-rejected #288 proposal to change the skill-description budget from 1% to 2%. The official /en/skills docs state 'The budget scales at 1% of the model's context window' and give 0.02 = 2% only as the example for raising it via skillListingBudgetFraction, so the existing 1% content is correct and was kept.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for the command rename",
        body: "The Arabic feature catalog and reference cheatsheet now use /less-permission-prompts, matching the English content and the slash-commands module.",
      },
    ],
  },
  {
    version: "v1.24.4",
    date: "Jun 19, 2026",
    title:
      "Fact-check: keep skills budget at 1% and the v2.1.160 ultracode rename; document the v2.1.178 Agent Teams change where it belongs",
    summary:
      "Triaged three auto-generated audit PRs against the official Claude Code docs. Two were rejected as inaccurate; the Agent Teams v2.1.178 change was applied to the subagents module.",
    items: [
      {
        tag: "Fixed",
        heading: "subagents: Agent Teams reflects the v2.1.178 tool removal",
        body: "The existing Agent Teams paragraph now notes that v2.1.178 removed the TeamCreate and TeamDelete tools — with CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 set, every session already has one implicit team, so teammates are spawned directly through the Agent tool's name parameter with no setup step and cleanup happens automatically on session exit.",
      },
      {
        tag: "Fixed",
        heading: "skills: budget stays at 1% (rejected audit PR #288)",
        body: "The skills module and quiz keep '1% of the context window' as the default skill-description budget. The official skills docs say 1% verbatim; the 0.02 = 2% value the audit cited is the example for raising the budget with skillListingBudgetFraction, not the default, and the claimed changelog line does not exist.",
      },
      {
        tag: "Fixed",
        heading: "advanced-features: ultracode stays a v2.1.160 rename (rejected audit PR #286)",
        body: "The dynamic-workflow paragraph keeps its accurate wording: the trigger keyword was renamed from workflow to ultracode in v2.1.160. The changelog says 'Renamed the dynamic-workflow trigger keyword from workflow to ultracode', so the audit's 'two separate changes in v2.1.178, not a rename' reframing was incorrect and was not applied.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for the Agent Teams update",
        body: "The Arabic subagents module mirrors the v2.1.178 Agent Teams change (TeamCreate/TeamDelete removed, implicit team per session, spawn via the Agent tool's name parameter, automatic cleanup on session exit).",
      },
    ],
  },
  {
    version: "v1.24.3",
    date: "Jun 18, 2026",
    title:
      "Fact-check: hooks count is exactly 30, and Auto Mode's block thresholds (3 consecutive / 20 total) now appear in the module",
    summary:
      "Consolidated two auto-generated audit PRs (#284 hooks, #283 advanced-features) into one release after verifying both against the official docs.",
    items: [
      {
        tag: "Fixed",
        heading: "hooks: exact count of 30 hook events",
        body: "The hooks module said Claude Code 'supports 30+ hook events'; the official hooks docs enumerate exactly 30, so the prose now states '30 hook events' for precision.",
      },
      {
        tag: "Fixed",
        heading: "advanced-features: Auto Mode block thresholds documented",
        body: "Added the Auto Mode fallback thresholds (3 consecutive blocks or 20 total blocks pause auto mode and resume prompting; not configurable) to the classifier-precedence paragraph, matching the permission-modes docs and making the existing quiz q2 answerable from the module.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for both fact-checks",
        body: "The Arabic hooks and advanced-features modules mirror both changes — '30 hook events' and the Auto Mode block-threshold sentence.",
      },
    ],
  },
  {
    version: "v1.24.2",
    date: "Jun 17, 2026",
    title:
      "Fact-check: fix the getting-started quiz's Console answer — Console logs in via browser, not 'API key authentication'",
    summary:
      "Corrected the getting-started quiz q3 wording. Console is API access billed from pre-paid credits with the same browser sign-in as subscription plans — not an API-key-only path.",
    items: [
      {
        tag: "Fixed",
        heading: "getting-started quiz: accurate Console wording",
        body: "Quiz q3 asks 'Which subscription plans include Claude Code access?', so the correct answer stays the four subscription plans (Pro, Max, Team, Enterprise) and the explanation now frames the Anthropic Console accurately as a non-subscription option — API access billed from pre-paid credits, with the same browser sign-in — instead of PR #281's inaccurate 'Console uses API key authentication rather than a subscription' framing.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for the Console answer fix",
        body: "The Arabic getting-started quiz q3 mirrors the corrected wording: the four subscription plans remain the answer, and the Console is described as a non-subscription option (pre-paid API access, same browser sign-in).",
      },
    ],
  },
  {
    version: "v1.24.1",
    date: "Jun 16, 2026",
    title:
      "Fact-check: xhigh and max effort levels still exist — reject audit PRs that would have deleted them",
    summary:
      "Eight auto-generated audit PRs triaged against the official docs. Four accurate findings merged; three rejected because they would have deleted valid xhigh and max effort levels.",
    items: [
      {
        tag: "Improved",
        heading: "advanced-features, slash-commands, subagents: four accurate findings merged",
        body: "MCP_TIMEOUT startup-timeout env var (#275), managed settings have the highest precedence and cannot be overridden by command-line arguments (#276), sandboxed Bash runs on macOS/Linux/WSL2 but not native Windows (#273), and CLAUDE_CODE_FORK_SUBAGENT=1 makes forked subagents inherit the full conversation and runs every spawn in the background (#279) — all verified and applied.",
      },
      {
        tag: "Fixed",
        heading: "Skills quiz: removed an unverifiable ${CLAUDE_EFFORT} value",
        body: "Quiz q6 described ${CLAUDE_EFFORT} as resolving to 'low, medium, high, xhigh, max, or ultra — the stored value for ultracode'. The docs do not define an 'ultra' effort value for this variable, so the explanation now lists the verified levels low/medium/high/xhigh/max.",
      },
      {
        tag: "Fixed",
        heading: "Reference cheat sheet: corrected the CLAUDE_EFFORT description",
        body: "The CLAUDE_EFFORT environment-variable entry no longer claims it can resolve to 'ultra for ultracode', matching the feature catalog's accurate list of low/medium/high/xhigh/max.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for the effort-level fix",
        body: "The Arabic skills quiz q6 mirrors the corrected ${CLAUDE_EFFORT} level list (low/medium/high/xhigh/max).",
      },
    ],
  },
  {
    version: "v1.24.0",
    date: "Jun 14, 2026",
    title:
      "Full-surface coverage for /cd, --safe-mode, and the new model/footer/bundled-skills settings",
    summary:
      "Audit PRs added several v2.1.169+ features to module prose. This release carries those new features across the rest of the surfaces so search and the reference tools catch them.",
    items: [
      {
        tag: "Added",
        heading: "/cd in the terminal simulator, cheat sheet, and catalog",
        body: "The terminal playground simulates /cd <directory> (moving the session without breaking the prompt cache) and lists it in /help; the reference cheat sheet and feature catalog both gained a /cd entry.",
      },
      {
        tag: "Added",
        heading: "--safe-mode and CLAUDE_CODE_SAFE_MODE reference coverage",
        body: "The cheat sheet documents the --safe-mode flag and CLAUDE_CODE_SAFE_MODE env var (start with all customizations disabled for troubleshooting), and the feature catalog adds a --safe-mode flag entry.",
      },
      {
        tag: "Added",
        heading: "Bundled-skills and model/footer settings in the cheat sheet",
        body: "Added CLAUDE_CODE_DISABLE_BUNDLED_SKILLS / disableBundledSkills, plus the enforceAvailableModels (v2.1.175) and footerLinksRegexes (v2.1.176) managed settings, to the reference cheat sheet's env-vars and config-options sections.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for the new coverage",
        body: "The Arabic terminal commands, cheat sheet (slash commands + CLI flags), and feature catalog mirror the /cd and --safe-mode additions.",
      },
    ],
  },
  {
    version: "v1.23.7",
    date: "Jun 13, 2026",
    title:
      "Fact-check: MCP reconnection + channel version requirement, and remove a duplicate MCP quiz question",
    summary:
      "Verified MCP connection-resilience and channels details against the official MCP and channels docs, and fixed a structural duplicate in the MCP quiz.",
    items: [
      {
        tag: "Fixed",
        heading: "MCP reconnection now covers SSE servers and startup retries",
        body: "The MCP module states that HTTP or SSE servers reconnect mid-session with exponential backoff (up to five attempts), and that as of v2.1.121 the initial connection at startup is retried up to three times on transient errors such as a 5xx response, connection refused, or timeout.",
      },
      {
        tag: "Fixed",
        heading: "Channels note the v2.1.80 minimum version",
        body: "The Channels section now states that the Telegram, Discord, and iMessage channel plugins require Claude Code v2.1.80 or later, matching the official channels documentation.",
      },
      {
        tag: "Fixed",
        heading: "Removed a duplicate MCP quiz question",
        body: "The MCP quiz had two near-identical questions both testing the alwaysLoad config option; the redundant one is removed and the remaining questions renumbered to q1–q9.",
      },
      {
        tag: "Fixed",
        heading: "Corrected the Channels feature-catalog entry",
        body: "The catalog described channels as 'Telegram, Slack, and other platforms'; both now correctly list the Telegram, Discord, and iMessage channel plugins. The feature entry notes the research-preview / v2.1.80 requirement. Slack is a separate integration, not a channel.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for the MCP fixes",
        body: "The Arabic MCP module mirrors the SSE/startup-retry and v2.1.80 channel updates, the Arabic MCP quiz is renumbered to a matching q1–q9, and the Arabic feature catalog's Channels entry is corrected.",
      },
    ],
  },
  {
    version: "v1.23.6",
    date: "Jun 12, 2026",
    title:
      "Fact-check: ExitWorktree isn't available to isolated subagents, and worktree.baseRef defaults to 'fresh'",
    summary:
      "Two factual corrections verified against the official tools reference and worktrees docs.",
    items: [
      {
        tag: "Fixed",
        heading: "Corrected the ExitWorktree availability claim for isolated subagents",
        body: "The Subagents module no longer says isolation: worktree agents can use ExitWorktree to leave their worktree early — the tools reference states ExitWorktree is not available to subagents that run in their own working directory. Claude locks the worktree while the agent runs so cleanup can't remove it, and isolated worktrees branch from the repository's default branch unless worktree.baseRef is set to head.",
      },
      {
        tag: "Fixed",
        heading: "Fixed the worktree.baseRef default in Advanced Features",
        body: "The module now lists fresh (branch from the remote default for a clean tree) as the default for worktree.baseRef, with head as the opt-in for branching from local HEAD — matching the official docs, the module quiz, and the reference cheatsheet.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for both worktree fixes",
        body: "The Arabic Subagents and Advanced Features pages mirror the ExitWorktree and baseRef corrections.",
      },
    ],
  },
  {
    version: "v1.23.5",
    date: "Jun 11, 2026",
    title:
      "Fact-check: drop the non-existent deniedPlugins setting from the Plugins module",
    summary:
      "The Plugins module listed deniedPlugins as one of the managed-policy settings. No such setting exists in the official docs — the real managed-policy controls are enabledPlugins, extraKnownMarketplaces, strictKnownMarketplaces, and blockedMarketplaces.",
    items: [
      {
        tag: "Fixed",
        heading: "Removed fictional deniedPlugins managed-policy setting",
        body: "The Plugins module now lists only the managed-policy settings that exist in the official docs — enabledPlugins, extraKnownMarketplaces, strictKnownMarketplaces, and blockedMarketplaces — instead of the non-existent deniedPlugins.",
      },
      {
        tag: "Fixed",
        heading: "Plugins quiz distractor corrected",
        body: "The team-disable quiz question no longer presents deniedPlugins as a real setting; the distractor and its explanation now turn on the real blockedMarketplaces managed-policy blocklist.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for the deniedPlugins fix",
        body: "The Arabic Plugins module and quiz mirror the English correction, dropping deniedPlugins for the real managed-policy settings.",
      },
    ],
  },
  {
    version: "v1.23.4",
    date: "Jun 10, 2026",
    title: "Clarify settings precedence wording in the Project Setup module",
    summary:
      "Tightens the settings precedence explanation so the override direction is unambiguous: project settings are overridden by local settings, and only managed settings and command-line arguments override local.",
    items: [
      {
        tag: "Fixed",
        heading: "Settings precedence wording made unambiguous",
        body: "The Project Setup module now states plainly that project settings are overridden by local settings, and that only managed settings and command-line arguments override local — matching the official precedence order (managed > command-line > local > project > user).",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity + managed-settings terminology consistency",
        body: "The Arabic Project Setup page mirrors the precedence clarification and now uses 'الإعدادات المُدارة' consistently for the managed layer instead of switching to 'سياسة المنظمة'.",
      },
    ],
  },
  {
    version: "v1.23.3",
    date: "Jun 9, 2026",
    title:
      "Fact-check: /ultrareview free runs are a one-time allotment (no fixed expiry date)",
    summary:
      "Two fact-check fixes verified against the official docs. The /ultrareview expiry date is removed; the /code-review vs /simplify wording in the quiz is aligned with docs.",
    items: [
      {
        tag: "Fixed",
        heading: "/ultrareview free runs: no fixed May 5, 2026 expiry",
        body: "The Workflows module no longer claims the 3 Pro/Max free /ultrareview runs expire on May 5, 2026. Per the official ultrareview docs, the three runs are a one-time allotment per account that does not refresh — there is no published expiry date. Corrected in EN and AR.",
      },
      {
        tag: "Fixed",
        heading: "slash-commands quiz: /code-review vs /simplify wording aligned with docs",
        body: "Quiz q7 keeps the doc-accurate 'renamed from /simplify in v2.1.147' framing, and its closing note now matches the docs: from v2.1.154 /simplify is a separate cleanup-only review that applies fixes without hunting for bugs, and /code-review --fix is the bug-finding-with-fixes path.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for both fixes",
        body: "The Arabic Workflows module and slash-commands quiz mirror the /ultrareview free-runs correction and the /code-review wording, with natural phrasing.",
      },
    ],
  },
  {
    version: "v1.23.2",
    date: "Jun 8, 2026",
    title:
      "Fact-check: skill description budget is 1% of the context window by default",
    summary:
      "Corrects the Skills module and quiz against the official skills docs. The total budget for skill descriptions is 1% of the model's context window by default — not 2%.",
    items: [
      {
        tag: "Fixed",
        heading: "Skill description budget is ~1% of the context window by default",
        body: "Skills module and quiz corrected from ~2% to ~1%, the documented default. The 2% figure is only an example of a raised budget, not the default. Raise it with the skillListingBudgetFraction setting or the SLASH_COMMAND_TOOL_CHAR_BUDGET environment variable.",
      },
      {
        tag: "Fixed",
        heading: "Use /doctor (not /context) to check the skill budget",
        body: "The Skills module and quiz now point to /doctor to see whether the skill-description budget is overflowing and which skills are dropped from the listing, matching the official docs.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity and tanween fix",
        body: "The Arabic Skills module and quiz mirror the 1%/budget corrections, and a tanween spelling fix is applied in the budget example.",
      },
    ],
  },
  {
    version: "v1.23.1",
    date: "Jun 7, 2026",
    title:
      "Fact-check: corrected /terminal-setup behavior in Getting Started",
    summary:
      "The Getting Started module's /terminal-setup description is corrected against the official terminal-config docs. The command writes the Shift+Enter keybinding — not notification support.",
    items: [
      {
        tag: "Fixed",
        heading: "/terminal-setup no longer described as a notification configurator",
        body: "Getting Started now explains that /terminal-setup writes the Shift+Enter keybinding for VS Code, Cursor, Devin Desktop, Alacritty, and Zed — not notification support for Kitty/Ghostty/Alacritty. Desktop notifications work by default in Ghostty, Kitty, and iTerm2; other terminals use preferredNotifChannel: \"terminal_bell\" or a Notification hook.",
      },
      {
        tag: "Fixed",
        heading: "Restored the GPU-acceleration and scroll-sensitivity detail for VS Code forks",
        body: "In VS Code, Cursor, and Devin Desktop, /terminal-setup turns off the integrated terminal's GPU acceleration (to prevent garbled text) and adjusts its scroll sensitivity for smoother fullscreen scrolling. The feature-catalog description was sharpened to match.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for the /terminal-setup correction",
        body: "The Arabic Getting Started module and feature catalog mirror the English corrections with consistent phrasing for the Shift+Enter keybinding scope, the notification defaults, and the GPU-acceleration/scroll-sensitivity behavior.",
      },
    ],
  },
  {
    version: "v1.23.0",
    date: "Jun 6, 2026",
    title: "Site-wide search with ⌘K command palette",
    summary:
      "Added a site-wide search experience: press ⌘K (or Ctrl+K) anywhere to open a command palette that searches across modules, slash commands, settings, and reference content.",
    items: [
      {
        tag: "Added",
        heading: "⌘K command palette for site-wide search",
        body: "A new search island lets you open a command palette with ⌘K / Ctrl+K and find modules, commands, and reference material from any page, with keyboard navigation through results.",
      },
    ],
  },
  {
    version: "v1.22.8",
    date: "Jun 6, 2026",
    title:
      "Fact-check sweep: /code-review effort levels, /simplify split, ultracode trigger, MAX_THINKING_TOKENS scope",
    summary:
      "Four audit findings verified against the official Claude Code docs and reflected across English and Arabic content.",
    items: [
      {
        tag: "Improved",
        heading: "/code-review effort levels now include ultra",
        body: "The /code-review effort range now includes ultra (which runs a deeper multi-agent review in the cloud), matching the documented [low|medium|high|xhigh|max|ultra] signature.",
      },
      {
        tag: "Improved",
        heading: "/simplify is no longer a simple alias for /code-review",
        body: "From v2.1.154, /simplify runs a separate cleanup-only review that applies fixes without hunting for bugs. /code-review --fix is the bug-finding-with-fixes path.",
      },
      {
        tag: "Improved",
        heading: "Dynamic workflow trigger keyword is now ultracode",
        body: "Renamed from workflow in v2.1.160; natural-language requests still work. Updated across the workflows module, quiz, reference cheatsheet, and terminal simulation.",
      },
      {
        tag: "Fixed",
        heading: "MAX_THINKING_TOKENS=0 only disables thinking on specific models",
        body: "The advanced-features module clarifies that MAX_THINKING_TOKENS=0 only disables thinking on Opus 4.6 and Sonnet 4.6 — on Opus 4.7 and later, adaptive reasoning is always used and the variable does not apply.",
      },
    ],
  },
  {
    version: "v1.22.7",
    date: "Jun 5, 2026",
    title: "v2.1.162 fact-check: claude agents --json field names and waitingFor",
    summary:
      "Two doc-coverage updates verified against the official Claude Code docs: corrected claude agents --json field names and added the new waitingFor field; also added OTEL_RESOURCE_ATTRIBUTES to advanced-features.",
    items: [
      {
        tag: "Added",
        heading: "waitingFor field disambiguates what a waiting session needs",
        body: "When status is waiting, the new waitingFor field (v2.1.162) says exactly what the session is blocked on — permission prompt or input needed. The subagents module, templates, terminal simulation, and reference cheatsheet now include a jq example that wakes only permission-prompt sessions with claude respawn, so a boot script can route those two cases to different handlers.",
      },
      {
        tag: "Added",
        heading: "OTEL_RESOURCE_ATTRIBUTES env var documented",
        body: "Advanced-features module now documents OTEL_RESOURCE_ATTRIBUTES as the supported way to attach team, department, or cost-center labels to every metric datapoint and event. Formatting rules (comma-separated, no spaces, percent-encode special characters) and the OTEL_METRICS_INCLUDE_RESOURCE_ATTRIBUTES=false cardinality escape hatch are called out. Built-in attributes like user.id and session.id always win on key collision.",
      },
      {
        tag: "Fixed",
        heading: "claude agents --json field names match the docs",
        body: "Subagents module, terminal simulation, templates, quiz Q9 explanation, reference cheatsheet, and feature catalog now list the documented pid, cwd, kind, startedAt, sessionId, name, and status fields — replacing the older id/state/project/last_activity names. All jq examples are updated from .state to .status and from .id to .sessionId so they actually parse the live output.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for all three changes",
        body: "Arabic subagents module, advanced-features module, terminal simulation, templates, quiz, reference cheatsheet, and feature catalog all mirror the field-name correction, the waitingFor addition, and the OTEL_RESOURCE_ATTRIBUTES env var.",
      },
    ],
  },
  {
    version: "v1.22.6",
    date: "Jun 4, 2026",
    title: "v2.1.162 fact-check: Windsurf renamed to Devin Desktop",
    summary:
      "Windsurf has been renamed to Devin Desktop in Claude Code v2.1.162; Kiro is added as a second VS Code fork. Getting-started module and quiz updated.",
    items: [
      {
        tag: "Added",
        heading: "Kiro listed as a supported VS Code fork",
        body: "The official VS Code extension docs page now states the extension installs in 'other VS Code forks like Devin Desktop or Kiro'. The getting-started module and Q5 quiz explanation both add Kiro alongside Cursor and Devin Desktop so learners see the full set of VS Code forks where the Claude Code extension is supported.",
      },
      {
        tag: "Fixed",
        heading: "Windsurf is now Devin Desktop in the Claude Code UI",
        body: "Getting-started module no longer presents Windsurf as a current VS Code fork name — it now describes Cursor, Devin Desktop (renamed from Windsurf in v2.1.162), and Kiro as the VS Code forks that support the Claude Code VS Code extension and the integrated terminal. The paragraph also notes that /ide and /scroll-speed use the new Devin Desktop label.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for the Devin Desktop rename and Kiro addition",
        body: "The Arabic getting-started module and Arabic getting-started quiz mirror the rename — Cursor وDevin Desktop (الاسم الجديد لـ Windsurf من v2.1.162) وKiro — with consistent phrasing for the /ide, /terminal-setup, and /scroll-speed label change.",
      },
    ],
  },
  {
    version: "v1.22.5",
    date: "Jun 3, 2026",
    title: "Auto Mode on Bedrock/Vertex/Foundry + workflows availability fix",
    summary:
      "Auto Mode availability documented for Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Foundry; the /ultrareview restriction hedge removed from the workflows module.",
    items: [
      {
        tag: "Added",
        heading: "Auto Mode availability on Bedrock, Vertex AI, and Foundry",
        body: "Advanced-features module now documents Auto Mode platform availability: on the Anthropic API it's on by default; on Bedrock, Vertex AI, and Foundry (v2.1.158+) it's gated behind CLAUDE_CODE_ENABLE_AUTO_MODE=1 and only Opus 4.7 and Opus 4.8 are supported. The permissions.disableAutoMode: \"disable\" admin override is called out.",
      },
      {
        tag: "Fixed",
        heading: "Workflows module: drop the unsupported /ultrareview restriction hedge",
        body: "The /ultrareview paragraph used to caveat that workflows generally work on Bedrock, Vertex AI, and Foundry while /ultrareview specifically might be restricted. The official workflows page now states plainly that dynamic workflows are available on all paid plans on those platforms with Claude Code v2.1.154+, so the hedge is removed.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for both Auto Mode and workflows updates",
        body: "Both changes are mirrored in the Arabic advanced-features and workflows modules with consistent phrasing for platform availability, the CLAUDE_CODE_ENABLE_AUTO_MODE opt-in, and the model restriction to Opus 4.7/4.8 on third-party providers.",
      },
    ],
  },
  {
    version: "v1.22.4",
    date: "Jun 2, 2026",
    title: "v2.1.160 fact-check: ultracode rename and OPUS_4_6 override removal",
    summary:
      "Three audit findings applied: the dynamic-workflow trigger keyword renamed to ultracode, CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE removed as a no-op, and /ultrareview version corrected to v2.1.86.",
    items: [
      {
        tag: "Fixed",
        heading: "Dynamic-workflow trigger renamed to ultracode",
        body: "Advanced-features and commands modules now document the v2.1.160 rename of the trigger keyword from workflow to ultracode. The literal workflow keyword no longer triggers a run, but a natural-language request still works, and /effort ultracode activates dynamic workflows.",
      },
      {
        tag: "Fixed",
        heading: "CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE removed (no-op)",
        body: "Removed all instructions to set this env var: from the commands module fast-mode section, the advanced-features environment-variable section and templates, and the feature catalog. Quiz Q23 in advanced-features now teaches that the variable was removed in v2.1.160 with no replacement.",
      },
      {
        tag: "Fixed",
        heading: "/ultrareview introduced in v2.1.86, not v2.1.112",
        body: "Workflows module now reflects the official docs — /ultrareview has been available since Claude Code v2.1.86 and was highlighted in v2.1.112, instead of being marked only as new in v2.1.112.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity across all three audit fixes",
        body: "Every change is mirrored in the Arabic modules (advanced-features, commands, workflows), Arabic templates, Arabic feature catalog, and Arabic quizzes, with Arabic phrasing for the workflow/ultracode distinction clarified after CodeRabbit review.",
      },
    ],
  },
  {
    version: "v1.22.3",
    date: "Jun 1, 2026",
    title: "Fast mode now covers Opus 4.8; project-setup quiz hierarchy fix",
    summary:
      "Updates the Fast Mode section to match current docs — fast mode supports Opus 4.8, 4.7, and 4.6 — and corrects a backwards settings-precedence explanation in the project-setup quiz.",
    items: [
      {
        tag: "Fixed",
        heading: "Fast mode covers Opus 4.8, 4.7, and 4.6",
        body: "Commands module no longer pins fast mode to Opus 4.6 alone. Opus 4.8 is the fast mode default in v2.1.154+, and the CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1 env var is documented for pinning back to 4.6 while it remains supported. The Opus 4.6 fast mode deprecation timeline is called out.",
      },
      {
        tag: "Fixed",
        heading: "Fast mode platform exclusions are complete",
        body: "Commands module now lists all platforms where fast mode is unavailable — Bedrock, Vertex AI, Foundry, Claude Platform on AWS — and notes it is not supported in the VS Code extension. The rate-limit pool is shared across Opus 4.8, 4.7, and 4.6.",
      },
      {
        tag: "Fixed",
        heading: "Project-setup quiz Q4 precedence explanation",
        body: "Project-setup quiz Q4 option B explanation was inverted: settings.local.json (not project settings) overrides project. The corrected explanation now reads: project settings override user settings, but they are overridden by local settings, managed policy, and command-line arguments — matching the official settings hierarchy.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for fast mode and project-setup quiz",
        body: "Every change is mirrored in the Arabic commands module and the Arabic project-setup quiz, with consistent terminology for deprecation and platform exclusions.",
      },
    ],
  },
  {
    version: "v1.22.2",
    date: "May 31, 2026",
    title: "Plugin manifests: monitors and themes nest under experimental",
    summary:
      "Updates plugin manifest guidance to match the current Claude Code schema — monitors and themes should now be declared under the experimental key in plugin.json.",
    items: [
      {
        tag: "Fixed",
        heading: "Plugin monitors nest under experimental",
        body: "Plugins module now shows monitors declared under experimental.monitors in plugin.json, with a note that top-level still works but claude plugin validate warns. Feature catalog entry updated to match.",
      },
      {
        tag: "Fixed",
        heading: "Project setup mentions monitors/themes are experimental",
        body: "Project-setup module now tells learners that monitors and themes are experimental plugin manifest keys and should be nested under experimental: {}.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for plugin manifest guidance",
        body: "Mirrored in the Arabic plugins and project-setup modules plus the AR feature catalog, with cleaner Arabic phrasing for the new project-setup paragraph.",
      },
    ],
  },
  {
    version: "v1.22.1",
    date: "May 30, 2026",
    title: "Audit fact-check pass: docs and quizzes across seven modules",
    summary:
      "Applies seven targeted audit findings verified against the official Claude Code docs, covering getting-started, memory, project-setup, skills, slash-commands, subagents, and workflows.",
    items: [
      {
        tag: "Fixed",
        heading: "IDE extensions: Cursor and Windsurf are VS Code forks",
        body: "Getting-started module now describes Cursor and Windsurf as VS Code forks that reuse the VS Code extension and integrated terminal, with /terminal-setup auto-configuring GPU acceleration and scroll sensitivity. Quiz updated to match.",
      },
      {
        tag: "Fixed",
        heading: "Subagents have their own auto memory",
        body: "Memory module now notes that subagents can maintain their own auto memory, with a link back to the subagents module for configuration details.",
      },
      {
        tag: "Fixed",
        heading: "DISABLE_UPDATES vs DISABLE_AUTOUPDATER",
        body: "Project-setup module now distinguishes DISABLE_UPDATES=1 (blocks all update paths, including manual claude update) from DISABLE_AUTOUPDATER (suppresses package-manager update notifications only).",
      },
      {
        tag: "Fixed",
        heading: "Skill description budget is ~2% of the context window",
        body: "Skills module and quiz updated from the older ~1% figure to the current ~2% budget, with SLASH_COMMAND_TOOL_CHAR_BUDGET callable to raise the cap. All q3 option explanations now agree.",
      },
      {
        tag: "Fixed",
        heading: "/simplify and /code-review behavior",
        body: "Slash-commands module clarifies that /code-review is a bundled skill that reports findings, /code-review --fix applies them to the working tree, and /simplify now invokes /code-review (report only) — the old cleanup-and-fix /simplify behavior was removed, but /simplify still works as an alias.",
      },
      {
        tag: "Fixed",
        heading: "CLAUDE_CODE_FORK_SUBAGENT scope",
        body: "Subagents module and quiz now state that forked subagents work in interactive sessions, non-interactive mode, the Agent SDK, and on external builds — dropping the inaccurate 'interactive mode only' framing.",
      },
      {
        tag: "Fixed",
        heading: "/ultrareview platform availability",
        body: "Workflows module no longer claims /ultrareview is unavailable on Bedrock, Vertex AI, or Foundry. Learners are pointed to the official docs to confirm, since the workflows feature itself works on those platforms.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for all fixes",
        body: "Every fix is mirrored in the Arabic module pages and quizzes, including the cross-module link in memory.md and the consistent 2% phrasing across all skills q3 explanations.",
      },
    ],
  },
  {
    version: "v1.22.0",
    date: "May 29, 2026",
    title: "Dynamic workflows and the full bundled-skills set",
    summary:
      "Adds the workflows module's Dynamic Workflows section (/workflows orchestration, /deep-research, /effort ultracode) and expands the skills module to list every bundled skill. Full EN/AR parity.",
    items: [
      {
        tag: "Fixed",
        heading: "Clarified the channels research-preview wording",
        body: "MCP module now says the Telegram, Discord, and iMessage channel plugins are 'included in' the research preview, matching the official docs phrasing.",
      },
      {
        tag: "Added",
        heading: "Added dynamic workflows",
        body: "Workflows module now covers dynamic workflows (v2.1.154+) — orchestrating dozens to hundreds of subagents from a script Claude writes, the bundled /deep-research workflow, /effort ultracode, saving a run as a /command, and disabling via /config or CLAUDE_CODE_DISABLE_WORKFLOWS=1. Mirrored in the feature catalog, reference cheatsheet, and terminal simulation (/workflows, /deep-research).",
      },
      {
        tag: "Added",
        heading: "Expanded the built-in skills list",
        body: "Skills module now lists the full set of bundled skills available in every session — /code-review, /batch, /debug, /loop, and /claude-api — alongside the /run, /verify, and /run-skill-generator trio (v2.1.145+). Added /claude-api to the terminal simulation.",
      },
      {
        tag: "Added",
        heading: "New quiz coverage",
        body: "Added a workflows quiz question on how to start a dynamic workflow (the 'workflow' keyword or /effort ultracode, not /workflows) and a skills quiz question on bundled skills. Corrected the skills effort-variable answer to include the ultra value.",
      },
      {
        tag: "Arabic",
        heading: "Arabic parity for all changes",
        body: "Translated the dynamic workflows section, bundled-skills table, new quiz questions, feature-catalog entries, and cheatsheet rows into Arabic.",
      },
    ],
  },
  {
    version: "v1.21.1",
    date: "May 28, 2026",
    title: "Effort level corrections, cloud code review, and PowerShell clarification",
    summary:
      "Corrects the reasoning effort levels to include xhigh across modules, documents the deep cloud code review (/code-review ultra, alias /ultrareview), and clarifies the PowerShell tool shell setting on Linux/macOS.",
    items: [
      {
        tag: "Fixed",
        heading: "Corrected reasoning effort levels",
        body: "Hooks and subagents modules now list the full effort set — low, medium, high, xhigh, max, auto — matching official docs. xhigh was added for Opus 4.7, sitting between high and max.",
      },
      {
        tag: "Fixed",
        heading: "Clarified the PowerShell tool shell setting",
        body: "Skills module now notes that enabling the PowerShell tool with CLAUDE_CODE_USE_POWERSHELL_TOOL=1 on Linux and macOS also requires pwsh on your PATH.",
      },
      {
        tag: "Fixed",
        heading: "Fixed Arabic permission-mode cycle order",
        body: "Commands module (Arabic) now shows Shift+Tab cycling default → acceptEdits → plan, matching the English module and official docs.",
      },
      {
        tag: "Added",
        heading: "Documented the cloud code review",
        body: "Slash commands module, feature catalog, reference cheatsheet, and terminal simulation now cover /code-review ultra (alias /ultrareview) — a deep, multi-agent code review run in a cloud sandbox.",
      },
      {
        tag: "Arabic",
        heading: "Localized feature catalog categories",
        body: "Arabic feature catalog now uses Arabic category labels for the new entries, and fenced code blocks carry language tags.",
      },
    ],
  },
  {
    version: "v1.21.0",
    date: "May 27, 2026",
    title: "Session recap, command history search, push notifications, and auto mode hard deny",
    summary:
      "Adds coverage for session recap (/recap), Ctrl+R reverse command history search, mobile push notifications via Remote Control, auto mode hard_deny rules, and new slash commands (/fewer-permission-prompts, /tui, /focus, /undo).",
    items: [
      {
        tag: "Added",
        heading: "Added session recap and command history",
        body: "Commands module now covers automatic session recaps when returning to the terminal, /recap on-demand summaries, and Ctrl+R reverse history search with Ctrl+S scope cycling.",
      },
      {
        tag: "Added",
        heading: "Added mobile push notifications",
        body: "Workflows module now documents push notifications via Remote Control — Claude sends phone alerts when tasks finish or need input.",
      },
      {
        tag: "Added",
        heading: "Expanded auto mode configuration",
        body: "Advanced features module now documents hard_deny rules (unconditional blocks), four-tier precedence, and claude auto-mode defaults/config/critique CLI subcommands.",
      },
      {
        tag: "Added",
        heading: "Added new slash commands",
        body: "Slash commands module now includes /recap, /fewer-permission-prompts, /tui, /focus, and /undo (alias for /rewind).",
      },
      {
        tag: "Added",
        heading: "Added hook configuration options",
        body: "Hooks module now documents continueOnBlock (feed rejection back to Claude instead of ending the turn) and terminalSequence (emit notifications without a terminal).",
      },
      {
        tag: "Arabic",
        heading: "Full EN/AR parity for all changes",
        body: "All new content mirrored in Arabic modules, quizzes, feature catalog, and reference cheatsheet.",
      },
    ],
  },
  {
    version: "v1.20.0",
    date: "May 26, 2026",
    title: "Output styles, channels, computer use, and expanded routines",
    summary:
      "Adds coverage for output styles, MCP channels (Telegram, Discord, iMessage), computer use (GUI control on macOS), and fully documents routines with API triggers, GitHub triggers, and cloud management.",
    items: [
      {
        tag: "Added",
        heading: "Added output styles section",
        body: "Commands module now covers built-in output styles (Default, Proactive, Explanatory, Learning) and custom output style creation with Markdown files and keep-coding-instructions frontmatter.",
      },
      {
        tag: "Added",
        heading: "Added channels section",
        body: "MCP module now documents channels — MCP servers that push events (Telegram, Discord, iMessage) into running sessions. Covers --channels flag, pairing, allowlists, and enterprise controls.",
      },
      {
        tag: "Added",
        heading: "Added computer use section",
        body: "Advanced features module now covers the computer-use MCP server for GUI control on macOS. Includes enabling, permissions, per-app approval, and safety features.",
      },
      {
        tag: "Added",
        heading: "Expanded routines documentation",
        body: "Workflows module now fully documents routines: API triggers, GitHub triggers, web UI at claude.ai/code/routines, connectors, one-off scheduled runs, and /schedule list/update/run CLI management.",
      },
      {
        tag: "Arabic",
        heading: "Full EN/AR parity for all changes",
        body: "All new content mirrored in Arabic modules, quizzes, feature catalog, and reference cheatsheet.",
      },
    ],
  },
  {
    version: "v1.19.0",
    date: "May 25, 2026",
    title: "Bundled skills, auto-update accuracy, and installation coverage",
    summary:
      "Adds /run, /verify, /run-skill-generator bundled skills and skillOverrides to the skills module; fixes inaccurate auto-update guidance and npm deprecation claims; adds Linux package managers, claude doctor, and release channel details.",
    items: [
      {
        tag: "Fixed",
        heading: "Fixed auto-update documentation accuracy",
        body: "Project-setup module now correctly documents that Homebrew/WinGet can opt in to auto-updates via CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE=1, adds autoUpdatesChannel setting, and DISABLE_AUTOUPDATER env var. Previous PR #195 incorrectly claimed the env var was unsupported.",
      },
      {
        tag: "Fixed",
        heading: "Removed incorrect npm deprecation claim",
        body: "Getting-started module, quiz, and installation tabs no longer describe npm as deprecated — the official docs list it as a supported alternative installation method.",
      },
      {
        tag: "Added",
        heading: "Added /run, /verify, /run-skill-generator bundled skills",
        body: "Documents the three bundled skills for launching, verifying, and recording app build recipes. Added to both English and Arabic skills module.",
      },
      {
        tag: "Added",
        heading: "Added skillOverrides setting",
        body: "Documents the skillOverrides setting for controlling skill visibility from settings.json without editing SKILL.md frontmatter. Includes the /skills interactive menu workflow.",
      },
      {
        tag: "Added",
        heading: "Added string substitution variables",
        body: "Documents ${CLAUDE_SESSION_ID}, ${CLAUDE_EFFORT}, ${CLAUDE_SKILL_DIR}, and named arguments frontmatter in the skills module.",
      },
      {
        tag: "Added",
        heading: "Added Linux package managers and claude doctor",
        body: "Getting-started module now documents apt, dnf, and apk installation methods and the claude doctor verification command.",
      },
      {
        tag: "Arabic",
        heading: "Full EN/AR parity for all changes",
        body: "All module text, quiz corrections, and tab content mirrored in Arabic.",
      },
    ],
  },
  {
    version: "v1.18.1",
    date: "May 24, 2026",
    title: "Coverage gaps, audit fixes, and EN/AR alignment",
    summary:
      "Closes verified content gaps (updatedToolOutput, args exec form, --add-dir, --mcp-config), incorporates two audit findings, and aligns all changes across English and Arabic.",
    items: [
      {
        tag: "Fixed",
        heading: "Fixed CLAUDE_CODE_FORK_SUBAGENT availability and Arabic description",
        body: "English corrected from 'interactive mode only' to 'interactive sessions, non-interactive mode, and the Agent SDK'. Arabic completely rewritten to match (was incorrectly described as external-builds-only).",
      },
      {
        tag: "Fixed",
        heading: "Corrected /less-permission-prompts version",
        body: "Version corrected from v2.1.112 to v2.1.111 (confirmed via CHANGELOG) in both English and Arabic skills module.",
      },
      {
        tag: "Added",
        heading: "Added PostToolUse updatedToolOutput documentation",
        body: "PostToolUse hooks can replace tool output entirely via hookSpecificOutput.updatedToolOutput (works for all tools since v2.1.121). Quiz q8 tested it, but the module content was missing.",
      },
      {
        tag: "Added",
        heading: "Added --add-dir and --mcp-config CLI flags",
        body: "--add-dir grants Read/Edit access to additional directories; --mcp-config loads MCP servers from external JSON for the current session. Both documented in subagents module and terminal simulator.",
      },
      {
        tag: "Arabic",
        heading: "Added missing args exec form to Arabic hooks",
        body: "The English hooks module documented the exec form (args array for shell-free process spawning) but Arabic was missing it entirely.",
      },
    ],
  },
  {
    version: "v1.18.0",
    date: "May 22, 2026",
    title: "v2.1.146 coverage — /code-review bundled skill",
    summary:
      "Documents the new /code-review bundled slash command (formerly /simplify, which still works as an alias), verified against the official Claude Code commands reference. Mirrored across English and Arabic.",
    items: [
      {
        tag: "Added",
        heading: "Added /code-review bundled slash command",
        body: "Reviews the current diff for correctness bugs and reports findings without editing files. Accepts effort levels (low/medium/high/xhigh/max) and --comment to post inline GitHub PR comments. Renames /simplify, which still works as an alias.",
      },
      {
        tag: "Arabic",
        heading: "Full Arabic parity for /code-review",
        body: "Mirrored across Arabic module content, quizzes, terminal steps, terminal-commands.json, templates, the feature catalog, and the reference cheatsheet.",
      },
    ],
  },
  {
    version: "v1.17.0",
    date: "May 20, 2026",
    title: "v2.1.144 / v2.1.145 coverage — 5 verified features",
    summary:
      "Documents 5 features verified against the official Claude Code docs and CHANGELOG, mirrored across all content, quizzes, terminal steps, templates, the feature catalog, and the reference cheatsheet in both English and Arabic.",
    items: [
      {
        tag: "Added",
        heading: "Added claude agents --json for scripting",
        body: "claude agents --json prints the session roster as a JSON array — id, state, name, project, last activity — for tmux-resurrect-style boot scripts, status bars, and session pickers.",
      },
      {
        tag: "Added",
        heading: "Added Stop/SubagentStop background_tasks and session_crons fields",
        body: "Stop and SubagentStop hook inputs now include background_tasks (running background bash/subagents) and session_crons (queued scheduled tasks). A completion-gate hook can block until both arrays drain.",
      },
      {
        tag: "Added",
        heading: "Added /plugin Discover/Browse component preview",
        body: "The /plugin Discover and Browse screens now show a plugin's commands, agents, skills, hooks, and MCP/LSP servers inline before installation.",
      },
      {
        tag: "Added",
        heading: "Added Read tool partial-view truncation",
        body: "When a whole-file read exceeds the token limit, Read now returns a truncated first page with a PARTIAL view notice instead of a hard error. Claude paginates with offset/limit or narrows with grep.",
      },
      {
        tag: "Fixed",
        heading: "Renamed /extra-usage to /usage-credits",
        body: "v2.1.144 renamed 'extra usage' to 'usage credits' across the CLI; /extra-usage still works as an alias. Catalog, cheatsheet, slash-commands module, fast-mode copy, and terminal sim updated.",
      },
      {
        tag: "Arabic",
        heading: "Full Arabic parity for v2.1.144 + v2.1.145",
        body: "All five features mirrored across Arabic module content, quizzes, terminal steps, templates, terminal-commands.json, feature catalog, and reference cheatsheet.",
      },
    ],
  },
  {
    version: "v1.16.0",
    date: "May 16, 2026",
    title: "v2.1.143 coverage — plugin enable/disable and audit fixes",
    summary:
      "Documents 5 features from v2.1.143 verified against the official Claude Code docs, plus audit corrections for memory, project-setup, hooks, and plugins modules.",
    items: [
      {
        tag: "Fixed",
        heading: "Audit corrections across 4 modules",
        body: "Fact-check fixes in memory, project-setup, hooks, and plugins modules from automated audit pipeline.",
      },
      {
        tag: "Added",
        heading: "Added claude plugin enable/disable commands",
        body: "Toggle installed plugins on or off without uninstalling. Accepts --scope (user/project/local) to control where the setting is stored.",
      },
      {
        tag: "Added",
        heading: "Added /plugin marketplace projected context cost",
        body: "Plugin Discover/Browse screens now show projected token cost per session for each plugin.",
      },
      {
        tag: "Added",
        heading: "Added plugin details and plugin tag commands",
        body: "claude plugin details <name> shows component inventory and token cost; claude plugin tag creates release git tags with version validation.",
      },
    ],
  },
  {
    version: "v1.15.0",
    date: "May 16, 2026",
    title: "Curated YAML changelog",
    summary:
      "Replaces the GitHub-driven changelog with a hand-curated YAML format. Each release now has a title, summary, and categorized entries with related issue links.",
    items: [
      {
        tag: "Improved",
        heading: "Migrated changelog to curated YAML format",
        body: "Changelog data moved from GitHub API scraping to a structured YAML file (changelog.yaml) with per-release entries, categories, and issue references.",
      },
    ],
  },
  {
    version: "v1.14.0",
    date: "May 15, 2026",
    title: "v2.1.142 coverage — agents, permissions, identity, and plugins",
    summary:
      "Documents 4 features verified against the official Claude Code docs: agents --cwd filtering, --permission-mode flag, ANTHROPIC_WORKSPACE_ID workload identity, and CLAUDE_CODE_PLUGIN_PREFER_HTTPS.",
    items: [
      {
        tag: "Added",
        heading: "Added agents --cwd directory-filtered Agent view",
        body: "claude agents --cwd <path> filters the Agent view to only show agents running in that directory.",
      },
      {
        tag: "Added",
        heading: "Added --permission-mode flag with full accepted-modes list",
        body: "Documents --permission-mode <mode> flag with the complete list of accepted permission modes.",
      },
      {
        tag: "Added",
        heading: "Added ANTHROPIC_WORKSPACE_ID workload identity federation",
        body: "Documents ANTHROPIC_WORKSPACE_ID for Workload Identity Federation on cloud platforms.",
      },
      {
        tag: "Added",
        heading: "Added CLAUDE_CODE_PLUGIN_PREFER_HTTPS for CI plugin cloning",
        body: "CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1 ensures plugins are cloned over HTTPS in CI environments.",
      },
    ],
  },
  {
    version: "v1.13.0",
    date: "May 14, 2026",
    title: "v2.1.138/140 env vars and sidebar visibility fix",
    summary:
      "Adds newly documented environment variables from v2.1.138/140 and fixes a longstanding sidebar visibility issue with higher-contrast toggle styling.",
    items: [
      {
        tag: "Improved",
        heading: "Brightened sidebar collapse toggle",
        body: "Higher-contrast text in expanded state with full text-primary color and thicker chevron stroke when collapsed.",
      },
      {
        tag: "Fixed",
        heading: "Fixed backwards CLAUDE_CODE_NATIVE_CURSOR description",
        body: "Corrected the pre-existing backwards description for CLAUDE_CODE_NATIVE_CURSOR.",
      },
      {
        tag: "Added",
        heading: "Added 3 publicly documented env vars from v2.1.138/140",
        body: "CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE, CLAUDE_CODE_RESUME_PROMPT, and CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL across modules, feature catalog, quizzes, and templates.",
      },
    ],
  },
  {
    version: "v1.12.1",
    date: "May 12, 2026",
    title: "6 new features and full Arabic quiz parity",
    summary:
      "Adds module content for 6 verified features, 12 quiz questions, complete Arabic parity across all 7 modules, and a security note for plugin URLs.",
    items: [
      {
        tag: "Fixed",
        heading: "Added --plugin-url trust warning",
        body: "Added a security note for --plugin-url in both English and Arabic plugins documentation.",
      },
      {
        tag: "Added",
        heading: "Added 6 verified features across 5 modules",
        body: "Gateway model discovery, alternate screen toggle, image pasting hint, --plugin-url flag, package manager auto-update, and SESSION_ID env var.",
      },
      {
        tag: "Added",
        heading: "Added 12 quiz questions across 6 modules",
        body: "New quiz questions covering the 6 verified features added this release, with correct numbering throughout.",
      },
      {
        tag: "Arabic",
        heading: "Complete Arabic quiz parity across all 7 modules",
        body: "15 missing Arabic quiz questions added (getting-started q7-q8, hooks q9-q10, project-setup q6, advanced-features q13-q21), plus 4 terminal steps and 4 templates.",
      },
    ],
  },
  {
    version: "v1.12.0",
    date: "May 10, 2026",
    title: "v2.1.138/139 coverage — 7 verified features",
    summary:
      "Closes coverage gaps for 7 features verified against the official Claude Code documentation, with module content, quizzes, templates, and feature catalog entries.",
    items: [
      {
        tag: "Added",
        heading: "Added 7 features from v2.1.138/139",
        body: "Module content, quizzes, templates, and feature catalog entries for 7 newly verified Claude Code features.",
      },
    ],
  },
  {
    version: "v1.11.0",
    date: "May 7, 2026",
    title: "v2.1.128–133 coverage and #122 content",
    summary:
      "Closes coverage gaps across multiple module areas informed by user feedback and audit findings, adding module content, quizzes, and templates for 5+ newly verified Claude Code features.",
    items: [
      {
        tag: "Added",
        heading: "Added 5+ features from v2.1.128–133",
        body: "Module content, quizzes, and templates for 5+ newly verified Claude Code features.",
      },
    ],
  },
  {
    version: "v1.10.2",
    date: "May 6, 2026",
    title: "Shift+Tab permission mode cycling fix",
    summary:
      "Corrects the cycling order for Shift+Tab in permission mode, which was broken in a prior release.",
    items: [
      {
        tag: "Fixed",
        heading: "Corrected Shift+Tab permission mode cycling order",
        body: "Shift+Tab now correctly cycles through permission modes in the right order instead of skipping states.",
      },
    ],
  },
  {
    version: "v1.10.1",
    date: "May 5, 2026",
    title: "ultrareview --timeout template and catalog entry",
    summary:
      "Adds a new workflow template and feature catalog entry for running ultrareview with a --timeout flag for CI environments.",
    items: [
      {
        tag: "Added",
        heading: "New ultrareview --timeout template",
        body: "Added a CI code review workflow template that runs ultrareview with --timeout for environments where long reviews are disruptive.",
      },
    ],
  },
  {
    version: "v1.10.0",
    date: "May 5, 2026",
    title: "v2.1.119–126 coverage — 7 verified features",
    summary:
      "Closes 7 coverage gaps for features verified against the official Claude Code documentation, with module content, quizzes, and templates.",
    items: [
      {
        tag: "Added",
        heading: "Added 7 features from v2.1.119–126",
        body: "Module content, quizzes, and templates for 7 newly verified Claude Code features.",
      },
    ],
  },
  {
    version: "v1.9.0",
    date: "May 1, 2026",
    title: "v2.1.118–123 coverage — 10 verified features",
    summary:
      "Closes 10 coverage gaps across commands, plugins, MCP, and advanced-features modules with content, quizzes, and templates for 10 verified Claude Code features.",
    items: [
      {
        tag: "Added",
        heading: "Added 10 features from v2.1.118–123",
        body: "Full content, quiz questions, and templates for 10 verified features across commands, plugins, MCP, and advanced-features.",
      },
    ],
  },
  {
    version: "v1.8.0",
    date: "Apr 30, 2026",
    title: "Beginner-friendly Getting Started module",
    summary:
      "Adds a beginner-friendly introduction and glossary to the Getting Started module in both English and Arabic.",
    items: [
      {
        tag: "Added",
        heading: "New beginner introduction and glossary",
        body: "The Getting Started module now includes a step-by-step beginner guide and a glossary of terms for those new to Claude Code.",
      },
    ],
  },
  {
    version: "v1.7.0",
    date: "Apr 29, 2026",
    title: "Advisor Tool full coverage",
    summary:
      "Adds complete Advisor Tool coverage including a quiz question and terminal step in both English and Arabic.",
    items: [
      {
        tag: "Added",
        heading: "Added Advisor Tool quiz and terminal step",
        body: "Full quiz question and terminal step coverage for the Advisor Tool in both English and Arabic.",
      },
    ],
  },
  {
    version: "v1.6.0",
    date: "Apr 28, 2026",
    title: "Module 0 — Getting Started complete",
    summary:
      "Completes the Getting Started module (Module 0) with install, auth, terminal, and IDE setup in both English and Arabic.",
    items: [
      {
        tag: "Added",
        heading: "Complete Getting Started module",
        body: "Full Module 0 coverage for install, authentication, terminal, and IDE setup in English and Arabic.",
      },
    ],
  },
  {
    version: "v1.5.0",
    date: "Apr 25, 2026",
    title: "Advisor Tool description correction",
    summary:
      "Corrects the Advisor Tool description and removes references to undocumented environment variables from the feature catalog.",
    items: [
      {
        tag: "Fixed",
        heading: "Corrected Advisor Tool description",
        body: "Advisor Tool description is now accurate. Undocumented env vars have been removed from the feature catalog.",
      },
    ],
  },
  {
    version: "v1.4.5",
    date: "Apr 21, 2026",
    title: "Slash-commands audit and quiz consistency",
    summary:
      "Corrected a command that was documented but not built-in, fixed mismatched Arabic quiz questions, and replaced quiz auto-advance with a manual button.",
    items: [
      {
        tag: "Improved",
        heading: "Quiz no longer auto-advances after correct answer",
        body: "Learners can read explanations before deciding to continue. A 'Next Question' button replaces the automatic advance.",
      },
      {
        tag: "Fixed",
        heading: "Removed /allowed-tools from Configuration commands",
        body: "/allowed-tools was listed as a built-in command but does not exist in Claude Code. Removed it from the slash-commands module.",
      },
      {
        tag: "Fixed",
        heading: "Fixed 5 mismatched Arabic quiz questions",
        body: "Arabic quiz questions in memory, skills, and slash-commands modules now match their English counterparts.",
      },
    ],
  },
  {
    version: "v1.4.4",
    date: "Apr 21, 2026",
    title: "Effort max is session-only, not Opus-only",
    summary:
      "Corrects documentation that incorrectly stated the effort maximum was an Opus-only feature; the effort maximum is session-wide.",
    items: [
      {
        tag: "Fixed",
        heading: "Corrected effort max scoping",
        body: "The effort maximum is session-wide, not Opus-only. Documentation corrected across 4 modules.",
      },
    ],
  },
  {
    version: "v1.4.3",
    date: "Apr 20, 2026",
    title: "sandbox.network.deniedDomains coverage",
    summary:
      "Adds quiz and template coverage for the sandbox.network.deniedDomains configuration option in advanced-features.",
    items: [
      {
        tag: "Added",
        heading: "Added sandbox.network.deniedDomains coverage",
        body: "Documents sandbox.network.deniedDomains in advanced-features with quiz questions and templates.",
      },
    ],
  },
  {
    version: "v1.4.2",
    date: "Apr 16, 2026",
    title: "v2.1.105 coverage gaps",
    summary:
      "Closes coverage gaps for v2.1.105 features across commands, hooks, plugins, skills, and subagents modules.",
    items: [
      {
        tag: "Added",
        heading: "Added v2.1.105 coverage across 5 modules",
        body: "Module content updates for commands, hooks, plugins, skills, and subagents covering newly verified Claude Code features.",
      },
    ],
  },
  {
    version: "v1.4.1",
    date: "Apr 8, 2026",
    title: "Skills module accuracy",
    summary:
      "Corrects the Arabic context budget figure and adds documentation for missing skill frontmatter fields.",
    items: [
      {
        tag: "Fixed",
        heading: "Corrected Arabic context budget figure",
        body: "Skill description budget corrected from 2% / 16,000 to 1% / 8,000 characters.",
      },
      {
        tag: "Added",
        heading: "Documented model and shell frontmatter fields",
        body: "Added documentation for model and shell frontmatter fields in the skills module.",
      },
    ],
  },
  {
    version: "v1.4.0",
    date: "Apr 4, 2026",
    title: "Terminal, card download, and template fixes",
    summary:
      "Three UI-level fixes: /clear now clears the terminal simulator, card download shows an error on failure, and the template copy button no longer overlaps text.",
    items: [
      {
        tag: "Fixed",
        heading: "/clear command clears the terminal",
        body: "The /clear command in the terminal simulator now clears visible history instead of printing text.",
      },
      {
        tag: "Fixed",
        heading: "Card download shows error on failure",
        body: "When html2canvas fails, a localized error message appears below the button instead of silently failing.",
      },
      {
        tag: "Fixed",
        heading: "Template copy button no longer overlaps text",
        body: "Code template blocks push content below the copy button to prevent text rendering underneath it.",
      },
    ],
  },
  {
    version: "v1.3.2",
    date: "Apr 2, 2026",
    title: "Arabic layout, keyboard navigation, and scoring fixes",
    summary:
      "Migrates to CSS logical properties for proper RTL support, adds RTL-aware keyboard navigation, and corrects the self-assessment scoring range.",
    items: [
      {
        tag: "Fixed",
        heading: "Migrated to CSS logical properties",
        body: "Replaced physical CSS properties with logical equivalents across 8 components for proper RTL support.",
      },
      {
        tag: "Fixed",
        heading: "RTL-aware keyboard navigation",
        body: "Added RTL-aware arrow-key navigation to BuildTabs, QuizBlock, and InteractiveDiagram.",
      },
      {
        tag: "Fixed",
        heading: "Arabic self-assessment scoring corrected",
        body: "Self-assessment scores now correctly cap at 20. Expert users are no longer misclassified as Beginner.",
      },
      {
        tag: "Arabic",
        heading: "Feedback form mixed-script input support",
        body: "Free-text fields use dir='auto' for mixed Arabic/English input. Email fields use dir='ltr'.",
      },
    ],
  },
  {
    version: "v1.3.1",
    date: "Apr 3, 2026",
    title: "New audit skills for content integrity",
    summary:
      "Launches audit-quiz and audit-terminal skills for automated content integrity checking across all modules, plus a new /allowed-tools command for the terminal simulator.",
    items: [
      {
        tag: "Added",
        heading: "New audit-quiz skill",
        body: "Automated skill for checking quiz data integrity, structural validity, and EN/AR consistency.",
      },
      {
        tag: "Added",
        heading: "New audit-terminal skill",
        body: "Automated skill for cross-referencing module content against terminal-commands.json and terminal-steps.yaml files.",
      },
      {
        tag: "Added",
        heading: "New /allowed-tools command",
        body: "Terminal simulator now supports /allowed-tools for managing permitted tools with add/remove and wildcard support.",
      },
    ],
  },
  {
    version: "v1.3.0",
    date: "Apr 2, 2026",
    title: "GLM audit workflow and module accuracy",
    summary:
      "Adds an automated audit fact-checking workflow and corrects documentation in slash-commands and subagents modules.",
    items: [
      {
        tag: "Fixed",
        heading: "Corrected slash-commands and subagents documentation",
        body: "Fixed command discovery, model aliases, effort options, diagnostics, and Agent Teams documentation.",
      },
      {
        tag: "Added",
        heading: "GLM audit workflow for learning modules",
        body: "Automated audit workflow with OpenCode agents, runner scripts, report templates, and tracker sync.",
      },
    ],
  },
  {
    version: "v1.1.2",
    date: "Mar 31, 2026",
    title: "Self-assessment scoring ranges fixed",
    summary:
      "Self-assessment now scores correctly up to 20 points with proportional level ranges: Beginner 0–6, Intermediate 7–14, Advanced 15–20.",
    items: [
      {
        tag: "Fixed",
        heading: "Self-assessment scores correctly up to 20 points",
        body: "Score ranges are Beginner 0–6, Intermediate 7–14, Advanced 15–20. Expert users are no longer classified as Beginner.",
      },
    ],
  },
  {
    version: "v1.1.0",
    date: "Mar 28, 2026",
    title: "Public feedback system and navigation launch",
    summary:
      "Launches the public feedback tracker, changelog page, per-module Report an issue links, and navigation reorganization.",
    items: [
      {
        tag: "Added",
        heading: "Public feedback tracker",
        body: "New /feedback page showing active feedback organized by status with item counts and a submission form.",
      },
      {
        tag: "Added",
        heading: "Changelog page for shipped items",
        body: "New /changelog page showing what has been shipped and fixed, linked from the footer.",
      },
      {
        tag: "Added",
        heading: "Report an issue link on every learn page",
        body: "Each module page has a link that opens the feedback form with the module name pre-filled.",
      },
      {
        tag: "Improved",
        heading: "Navigation renamed for clarity",
        body: "Build → Config Builder, Quick Reference → Cheat Sheet, Feature Catalog → Feature Index. Footer and sidebar reorganized.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Tag badge component                                                  */
/* ------------------------------------------------------------------ */
function TagBadge({ tag }: { tag: Tag }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${TAG_COLORS[tag]}`}
    >
      {tag}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Single changelog entry card                                          */
/* ------------------------------------------------------------------ */
function EntryCard({ entry, index }: { entry: Entry; index: number }) {
  return (
    <Reveal delay={index * 60}>
      <div className="group relative flex gap-6 pb-12 last:pb-0">
        {/* Left accent rail + dot */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-10 mt-1 h-3 w-3 flex-shrink-0 rounded-full border-2 border-accent bg-card transition-all group-hover:scale-125 group-hover:bg-accent" />
          {/* Connector line — hidden on last item via parent last:pb-0 */}
          <div className="mt-1 w-px flex-1 bg-border group-last:hidden" />
        </div>

        {/* Entry body */}
        <div className="min-w-0 flex-1 pb-2">
          {/* Version + date */}
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm font-bold text-accent">
              {entry.version}
            </span>
            <span className="text-xs text-fg-subtle">{entry.date}</span>
          </div>

          {/* Card */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] transition duration-200 hover:border-accent/30 hover:shadow-[var(--shadow-md)]">
            {/* Title */}
            <h2 className="mb-2 text-base font-semibold leading-snug text-fg sm:text-lg">
              {entry.title}
            </h2>

            {/* Summary */}
            <p className="mb-5 text-sm leading-relaxed text-fg-muted">
              {entry.summary}
            </p>

            {/* Change items */}
            <div className="space-y-4">
              {entry.items.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-bg-subtle p-4 transition hover:border-border-strong"
                >
                  <div className="mb-2 flex flex-wrap items-start gap-2">
                    <TagBadge tag={item.tag} />
                    <span className="text-sm font-medium text-fg">
                      {item.heading}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-fg-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                 */
/* ------------------------------------------------------------------ */
export default function ChangelogPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          title="Changelog"
          lede="See what's been shipped and fixed on the learning platform."
        />

        {/* Stats bar */}
        <Reveal delay={80}>
          <div className="mb-10 flex flex-wrap gap-6 rounded-xl border border-border bg-card px-6 py-4 shadow-[var(--shadow-sm)]">
            <div className="flex flex-col">
              <span className="font-mono text-2xl font-bold text-accent">
                {ENTRIES.length}+
              </span>
              <span className="text-xs text-fg-subtle">Releases logged</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-2xl font-bold text-accent">
                {ENTRIES.reduce((s, e) => s + e.items.length, 0)}+
              </span>
              <span className="text-xs text-fg-subtle">Individual changes</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-2xl font-bold text-accent">
                {ENTRIES[0].version}
              </span>
              <span className="text-xs text-fg-subtle">Current version</span>
            </div>
          </div>
        </Reveal>

        {/* Info callout */}
        <Reveal delay={120}>
          <Callout tone="info" title="How this works">
            Each release is an audit pass: the platform&apos;s learning content
            is automatically compared against the official Claude Code docs. Confirmed
            findings ship as a versioned entry; inaccurate auto-generated PRs are
            closed with an explanation. Every change ships in English and Arabic.
          </Callout>
        </Reveal>

        {/* Timeline */}
        <div className="mt-10 pb-20">
          {ENTRIES.map((entry, i) => (
            <EntryCard key={entry.version} entry={entry} index={i} />
          ))}
        </div>
      </Container>
    </main>
  );
}
