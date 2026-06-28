"use client";

import { useState, useMemo } from "react";
import Reveal from "@/components/Reveal";
import { LevelBadge } from "@/components/ui";
import type { Level, Locale } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type FeatureType =
  | "command"
  | "config"
  | "feature"
  | "flag"
  | "hook"
  | "setting"
  | "shortcut"
  | "skill"
  | "tool"
  | "workflow";

interface Feature {
  name: string;
  type: FeatureType;
  level: Level;
  category: string;
  description: string;
  descAr: string;
}

/* ------------------------------------------------------------------ */
/*  Dataset — 259 features extracted from claude.hjahouse.me/catalog      */
/* ------------------------------------------------------------------ */

const FEATURES: Feature[] = [
  // Commands
  { name: "/help", type: "command", level: "beginner", category: "navigation", description: "Show help information and learn available commands", descAr: "اعرض معلومات المساعدة واتعرّف على الأوامر المتاحة" },
  { name: "/btw", type: "command", level: "beginner", category: "input", description: "Ask a side question without adding it to the conversation context", descAr: "اسأل سؤال جانبي من غير ما يتضاف للـ context بتاع المحادثة" },
  { name: "/chrome", type: "command", level: "intermediate", category: "development", description: "Configure Chrome integration for browser automation", descAr: "اضبط إعدادات Chrome للـ browser automation" },
  { name: "/clear", type: "command", level: "beginner", category: "session", description: "Clear conversation history to start fresh or reduce context", descAr: "امسح تاريخ المحادثة وابدأ من جديد أو قلّل الـ context" },
  { name: "/diff", type: "command", level: "intermediate", category: "development", description: "Open interactive diff viewer to review changes", descAr: "افتح الـ diff viewer التفاعلي عشان تراجع التغييرات" },
  { name: "/config", type: "command", level: "beginner", category: "configuration", description: "View or edit Claude Code configuration settings", descAr: "اعرض أو عدّل إعدادات Claude Code" },
  { name: "/status", type: "command", level: "beginner", category: "session", description: "Show current session status and state", descAr: "اعرض حالة الجلسة الحالية" },
  { name: "/agents", type: "command", level: "intermediate", category: "workflow", description: "List available subagents and delegation options", descAr: "اعرض قائمة الـ subagents المتاحة وخيارات التفويض" },
  { name: "/skills", type: "command", level: "intermediate", category: "workflow", description: "List available skills with type-to-filter search and auto-invoke triggers", descAr: "اعرض قائمة الـ skills المتاحة والـ triggers بتاعة التشغيل التلقائي" },
  { name: "/hooks", type: "command", level: "advanced", category: "hooks", description: "List configured hooks for debugging event-driven automation", descAr: "اعرض الـ hooks المضبوطة لتتبّع الـ event-driven automation" },
  { name: "/insights", type: "command", level: "intermediate", category: "session", description: "Analyze session patterns for optimization", descAr: "حلّل أنماط الجلسة عشان تحسّن الأداء" },
  { name: "/install-slack-app", type: "command", level: "intermediate", category: "workflow", description: "Install the Claude Slack app for team communication integration", descAr: "ثبّت تطبيق Claude على Slack للتواصل مع الفريق" },
  { name: "/keybindings", type: "command", level: "intermediate", category: "configuration", description: "Customize keyboard shortcuts including chord key support", descAr: "خصّص اختصارات الكيبورد بما فيها دعم الـ chord keys" },
  { name: "/mcp", type: "command", level: "intermediate", category: "development", description: "List connected MCP servers and check external integrations", descAr: "اعرض سيرفرات الـ MCP المتصلة وتحقّق من التكاملات الخارجية" },
  { name: "/memory", type: "command", level: "intermediate", category: "memory", description: "View loaded memory files to debug context loading", descAr: "اعرض ملفات الذاكرة المحمّلة لتتبّع تحميل الـ context" },
  { name: "/mobile", type: "command", level: "beginner", category: "session", description: "Generate a mobile QR code for accessing Claude Code on mobile", descAr: "ولّد QR code للموبايل عشان تستخدم Claude Code من الهاتف" },
  { name: "/passes", type: "command", level: "beginner", category: "session", description: "View usage passes and subscription information", descAr: "اعرض بيانات الاستخدام ومعلومات الاشتراك" },
  { name: "/plugin", type: "command", level: "advanced", category: "configuration", description: "Manage plugins: install, remove, update, and list extensions", descAr: "أدِر الـ plugins: تثبيت، إزالة، تحديث، وعرض الإضافات" },
  { name: "/plan", type: "command", level: "intermediate", category: "development", description: "Enter planning mode for complex implementations using read-only tools", descAr: "ادخل وضع التخطيط للتنفيذات المعقدة باستخدام أدوات القراءة فقط" },
  { name: "/rewind", type: "command", level: "intermediate", category: "session", description: "Rewind to a previous checkpoint to undo changes or explore alternatives", descAr: "ارجع لنقطة حفظ سابقة عشان تتراجع عن تغييرات أو تستكشف بدائل" },
  { name: "/checkpoint", type: "command", level: "intermediate", category: "session", description: "Save and restore conversation checkpoints", descAr: "احفظ واسترجع نقاط حفظ المحادثة" },
  { name: "/cost", type: "command", level: "beginner", category: "session", description: "Show token usage costs to monitor spending", descAr: "اعرض تكلفة استهلاك الـ tokens عشان تتابع المصاريف" },
  { name: "/context", type: "command", level: "beginner", category: "session", description: "Show context window usage to manage conversation length", descAr: "اعرض استخدام الـ context window عشان تدير طول المحادثة" },
  { name: "/export", type: "command", level: "beginner", category: "session", description: "Export the current conversation for external reference", descAr: "صدّر المحادثة الحالية كمرجع خارجي" },
  { name: "/usage-credits", type: "command", level: "intermediate", category: "session", description: "View and manage usage credits on your account. Renamed from `/extra-usage` in v2.1.144 — the old name still works as an alias.", descAr: "اعرض وأدِر الـ usage credits على حسابك. اتغيّر الاسم من `/extra-usage` في v2.1.144 — والاسم القديم لسه شغّال كـ alias." },
  { name: "/code-review", type: "command", level: "intermediate", category: "development", description: "Bundled skill that reviews the current diff for correctness bugs. Accepts effort level (low/medium/high/xhigh/max) and `--comment` to post inline PR comments. Pass `ultra` to run a deep multi-agent review. `--fix` applies findings to your working tree.", descAr: "Bundled skill بيراجع الـ diff الحالي للـ correctness bugs. بيقبل effort level (low/medium/high/xhigh/max) و`--comment` لنشر inline comments على الـ PR. مرّر `ultra` لمراجعة عميقة متعددة الـ agents. `--fix` بيطبّق النتايج على شجرة العمل." },
  { name: "/feedback", type: "command", level: "beginner", category: "session", description: "Submit feedback or bug reports to Anthropic", descAr: "ابعت ملاحظات أو بلاغات أخطاء لـ Anthropic" },
  { name: "/login", type: "command", level: "beginner", category: "session", description: "Authenticate with Anthropic to access features", descAr: "سجّل دخولك مع Anthropic عشان توصل للمميزات" },
  { name: "/logout", type: "command", level: "beginner", category: "session", description: "Sign out of Claude Code to switch accounts", descAr: "سجّل خروجك من Claude Code عشان تبدّل الحسابات" },
  { name: "/sandbox", type: "command", level: "advanced", category: "security", description: "Toggle sandbox mode for safe command execution in restricted environments", descAr: "فعّل أو عطّل وضع الـ sandbox لتنفيذ الأوامر بأمان في بيئة محدودة" },
  { name: "/vim", type: "command", level: "intermediate", category: "input", description: "Toggle vim mode for vim-style text editing in the prompt", descAr: "فعّل أو عطّل وضع vim لتحرير النصوص بأسلوب vim في الـ prompt" },
  { name: "/doctor", type: "command", level: "intermediate", category: "debugging", description: "Run diagnostics to troubleshoot Claude Code issues", descAr: "شغّل تشخيصات لحل مشاكل Claude Code" },
  { name: "/reload-plugins", type: "command", level: "advanced", category: "configuration", description: "Reload installed plugins without restarting Claude Code", descAr: "أعد تحميل الـ plugins المثبّتة من غير ما تعيد تشغيل Claude Code" },
  { name: "/release-notes", type: "command", level: "beginner", category: "session", description: "Show release notes to check new features", descAr: "اعرض ملاحظات الإصدار عشان تشوف المميزات الجديدة" },
  { name: "/remote-control", type: "command", level: "advanced", category: "workflow", description: "Enable remote control for accessing Claude Code sessions via API", descAr: "فعّل التحكم عن بُعد للوصول لجلسات Claude Code عبر الـ API" },
  { name: "/permissions", type: "command", level: "intermediate", category: "permissions", description: "Manage permissions to control tool access and authorization", descAr: "أدِر الصلاحيات للتحكم في وصول الأدوات والتفويضات" },
  { name: "/session", type: "command", level: "intermediate", category: "session", description: "Manage sessions for multi-session workflows", descAr: "أدِر الجلسات لسير عمل متعدد الجلسات" },
  { name: "/rename", type: "command", level: "beginner", category: "session", description: "Rename the current session to organize work", descAr: "غيّر اسم الجلسة الحالية لتنظيم شغلك" },
  { name: "/resume", type: "command", level: "beginner", category: "session", description: "Resume a previous session to continue work", descAr: "استأنف جلسة سابقة عشان تكمّل شغلك" },
  { name: "/todo", type: "command", level: "beginner", category: "workflow", description: "View and manage the todo list to track tasks", descAr: "اعرض وأدِر قائمة المهام لتتبّع المطلوب" },
  { name: "/tasks", type: "command", level: "intermediate", category: "workflow", description: "View and manage background tasks and async operations", descAr: "اعرض وأدِر المهام الخلفية والعمليات غير المتزامنة" },
  { name: "/copy", type: "command", level: "beginner", category: "session", description: "Copy the last response to clipboard for quick sharing", descAr: "انسخ آخر رد للـ clipboard لمشاركة سريعة" },
  { name: "/teleport", type: "command", level: "advanced", category: "session", description: "Transfer the current session to another machine to continue work remotely", descAr: "انقل الجلسة الحالية لجهاز تاني عشان تكمّل شغلك عن بُعد" },
  { name: "/desktop", type: "command", level: "beginner", category: "session", description: "Open or switch to the Claude Desktop app", descAr: "افتح أو انتقل لتطبيق Claude Desktop" },
  { name: "/theme", type: "command", level: "beginner", category: "configuration", description: "Change the color theme to customize appearance", descAr: "غيّر الـ theme عشان تخصّص المظهر" },
  { name: "/usage", type: "command", level: "beginner", category: "session", description: "Unified dashboard merging /cost and /stats — shows cost estimate, duration, and code change metrics", descAr: "لوحة معلومات موحّدة تدمج /cost و/stats — بتعرض تقدير التكلفة والمدة ومقاييس تغييرات الكود" },
  { name: "/fork", type: "command", level: "intermediate", category: "session", description: "Fork the current conversation to explore alternatives without losing history", descAr: "اعمل fork للمحادثة الحالية عشان تستكشف بدائل من غير ما تفقد التاريخ" },
  { name: "/stats", type: "command", level: "beginner", category: "session", description: "Show session statistics to review metrics", descAr: "اعرض إحصائيات الجلسة لمراجعة المقاييس" },
  { name: "/statusline", type: "command", level: "intermediate", category: "configuration", description: "Configure the status line display", descAr: "اضبط عرض شريط الحالة" },
  { name: "/stickers", type: "command", level: "beginner", category: "session", description: "View session stickers earned as fun rewards", descAr: "اعرض ملصقات الجلسة اللي كسبتها كمكافآت ممتعة" },
  { name: "/fast", type: "command", level: "intermediate", category: "session", description: "Toggle fast output mode to speed up responses", descAr: "فعّل أو عطّل وضع الإخراج السريع لتسريع الردود" },
  { name: "/terminal-setup", type: "command", level: "beginner", category: "configuration", description: "Write terminal keybindings like Shift+Enter for newlines (VS Code, Cursor, Devin Desktop, Alacritty, Zed) plus integration tweaks like iTerm2 clipboard access", descAr: "يكتب keybindings الترمينال زي Shift+Enter للسطر الجديد (VS Code وCursor وDevin Desktop وAlacritty وZed) وتعديلات تكامل زي وصول الحافظة في iTerm2" },
  { name: "/upgrade", type: "command", level: "beginner", category: "maintenance", description: "Check for Claude Code updates and manage version upgrades", descAr: "تحقّق من تحديثات Claude Code وأدِر ترقية الإصدارات" },
  { name: "/optimize", type: "command", level: "intermediate", category: "development", description: "Analyze code for performance optimization opportunities", descAr: "حلّل الكود لاكتشاف فرص تحسين الأداء" },
  { name: "/pr", type: "command", level: "intermediate", category: "development", description: "Prepare a pull request with context and descriptions", descAr: "جهّز pull request بالـ context والوصف المناسب" },
  { name: "/generate-api-docs", type: "command", level: "intermediate", category: "development", description: "Generate API documentation from code", descAr: "ولّد وثائق الـ API من الكود" },
  { name: "/commit", type: "command", level: "beginner", category: "development", description: "Create a git commit with contextual message generation", descAr: "أنشئ git commit مع توليد رسالة تلقائية بناءً على السياق" },
  { name: "/push-all", type: "command", level: "intermediate", category: "development", description: "Stage, commit, and push changes in one quick step", descAr: "اعمل stage و commit و push للتغييرات في خطوة واحدة سريعة" },
  { name: "/doc-refactor", type: "command", level: "intermediate", category: "development", description: "Restructure documentation to improve organization and clarity", descAr: "أعد هيكلة التوثيق لتحسين التنظيم والوضوح" },
  { name: "/setup-ci-cd", type: "command", level: "advanced", category: "deployment", description: "Setup CI/CD pipeline configuration for new projects", descAr: "اضبط إعدادات الـ CI/CD pipeline للمشاريع الجديدة" },
  { name: "/unit-test-expand", type: "command", level: "intermediate", category: "development", description: "Expand test coverage by generating additional unit tests", descAr: "وسّع تغطية الاختبارات بتوليد unit tests إضافية" },
  { name: "/proactive", type: "command", level: "intermediate", category: "automation", description: "Alias for /loop — run a prompt on a recurring interval for proactive monitoring or polling", descAr: "Alias لـ /loop — بيشغّل prompt على فترات متكررة للمراقبة الاستباقية أو الـ polling" },
  { name: "/schedule", type: "command", level: "advanced", category: "automation", description: "Create, update, list, or run cloud-backed scheduled routines conversationally", descAr: "إنشاء وتحديث وعرض وتشغيل routines مجدولة في الـ cloud بشكل تفاعلي" },
  { name: "/goal", type: "command", level: "intermediate", category: "session", description: "Set a completion condition that Claude works toward across turns, with a live overlay showing elapsed time, turn count, and token usage", descAr: "اضبط هدف إنجاز يعمل Claude نحوه عبر الدورات، مع overlay مباشر يعرض الوقت المنقضي وعدد الدورات واستهلاك الـ tokens" },
  { name: "claude plugin details", type: "command", level: "intermediate", category: "configuration", description: "Show a plugin's component inventory (skills, agents, hooks, MCP servers) and projected token cost per session", descAr: "اعرض مكونات الـ plugin (skills وagents وhooks وMCP servers) والتكلفة المتوقعة بالـ tokens لكل جلسة" },
  { name: "claude agents (Agent view)", type: "command", level: "intermediate", category: "workflow", description: "Open the agent view showing a roster of all Claude Code sessions with state (working, waiting, completed, failed, idle, stopped) and activity", descAr: "افتح عرض الـ agents اللي بيعرض قائمة بكل جلسات Claude Code مع حالتها (شغّال، منتظر، مكتمل، فاشل، خامل، موقوف) ونشاطها" },
  { name: "claude plugin tag", type: "command", level: "intermediate", category: "configuration", description: "Tag a plugin version for release with optional push, dry-run, and force options", descAr: "ضع tag على إصدار plugin للنشر مع خيارات push وdry-run وforce" },
  { name: "plugin prune / --prune", type: "command", level: "intermediate", category: "maintenance", description: "Remove auto-installed plugin dependencies no longer required by any installed plugin; directly-installed plugins are never touched", descAr: "احذف تبعيات الـ plugins المثبتة تلقائيًا اللي مش محتاجها أي plugin مثبّت؛ الـ plugins المثبتة مباشرة مش بتتلمس" },
  { name: "claude ultrareview CLI", type: "command", level: "advanced", category: "development", description: "Run /ultrareview non-interactively from CI or scripts; prints findings to stdout (--json for raw output) and exits 0 on success or 1 on failure", descAr: "شغّل /ultrareview بشكل غير تفاعلي من CI أو سكربتات؛ بيطبع النتايج على stdout (--json للإخراج الخام) ويخرج بـ 0 في النجاح أو 1 في الفشل" },
  { name: "claude project purge", type: "command", level: "advanced", category: "maintenance", description: "Delete all Claude Code state for a project including sessions, memory, and cached data; supports --dry-run, -y/--yes, -i/--interactive, and --all flags", descAr: "احذف كل حالة Claude Code للمشروع بما فيها الجلسات والذاكرة والبيانات المخزنة مؤقتًا؛ يدعم --dry-run و-y/--yes و-i/--interactive و--all" },
  { name: "/fewer-permission-prompts", type: "command", level: "intermediate", category: "permissions", description: "Scans recent transcripts for common read-only Bash and MCP tool calls and proposes an allowlist to add to .claude/settings.json.", descAr: "بيمسح الـ transcripts الأخيرة عشان يلاقي أوامر Bash وأدوات MCP read-only شائعة ويقترح allowlist تتضاف لـ .claude/settings.json." },
  { name: "claude plugin enable", type: "command", level: "intermediate", category: "configuration", description: "Re-enable a plugin that was previously disabled, without re-installing it. Accepts `--scope user|project|local` (default: user)", descAr: "أعد تفعيل plugin كان معطّلاً من غير ما تعيد تثبيته. يقبل `--scope user|project|local` (افتراضي: user)" },
  { name: "claude plugin disable", type: "command", level: "intermediate", category: "configuration", description: "Disable a plugin without uninstalling it. Accepts `--scope user|project|local` (default: user) — useful for toggling plugins on and off across scopes", descAr: "عطّل plugin من غير ما تحذفه. يقبل `--scope user|project|local` (افتراضي: user) — مفيد للتبديل بين تفعيل وتعطيل الـ plugins عبر النطاقات" },
  { name: "/cd", type: "command", level: "intermediate", category: "navigation", description: "Move the session to a new working directory without breaking the prompt cache mid-session", descAr: "نقل الجلسة لمجلد عمل جديد من غير ما يتكسر الـ prompt cache في نص الجلسة" },
  { name: "/plugin Discover & Browse", type: "command", level: "intermediate", category: "configuration", description: "The /plugin Discover and Browse screens show a plugin's commands, agents, skills, hooks, and MCP/LSP servers inline before you install — Discover for marketplace plugins, Browse for installed ones", descAr: "شاشات /plugin بتاعت Discover و Browse بقت تعرض commands وagents وskills وhooks وMCP/LSP servers الـ plugin قبل التثبيت — Discover لـ plugins الـ marketplace، Browse للمثبت" },
  { name: "Session Recap", type: "command", level: "beginner", category: "session", description: "Automatic one-line recap when you return to the terminal after stepping away. Run /recap on demand. Disable via /config.", descAr: "ملخص تلقائي من سطر واحد لما ترجع للتيرمنال بعد ما تبعد. شغّل /recap في أي وقت. اقفله من /config." },
  { name: "/deep-research", type: "command", level: "intermediate", category: "workflow", description: "Bundled dynamic workflow that fans out web searches across several angles, cross-checks sources, votes on each claim, and returns a cited report with unsupported claims filtered out. Requires the WebSearch tool", descAr: "dynamic workflow مدمج بينشر web searches على زوايا مختلفة، يتحقق من المصادر اللي بيلاقيها مع بعض، يعمل vote على كل claim، ويرجّع تقرير بـ citations مع شطب الـ claims غير المدعومة. محتاج الـ WebSearch tool" },
  // Settings
  { name: "default permission mode", type: "setting", level: "beginner", category: "permissions", description: "Standard interactive mode that prompts for each tool call authorization", descAr: "الوضع التفاعلي العادي اللي بيسألك قبل كل استخدام أداة" },
  { name: "acceptEdits permission mode", type: "setting", level: "intermediate", category: "permissions", description: "Auto-accept file edits while prompting for other tool types", descAr: "قبول تعديلات الملفات تلقائيًا مع السؤال عن أنواع الأدوات التانية" },
  { name: "plan permission mode", type: "setting", level: "intermediate", category: "permissions", description: "Read-only tool access for planning and exploration without writes", descAr: "وصول للأدوات بوضع القراءة فقط للتخطيط والاستكشاف من غير كتابة" },
  { name: "auto permission mode", type: "setting", level: "advanced", category: "permissions", description: "Fully autonomous operation that accepts all tools without prompting (Research Preview)", descAr: "تشغيل مستقل بالكامل بيقبل كل الأدوات من غير ما يسأل (Research Preview)" },
  { name: "bypassPermissions permission mode", type: "setting", level: "advanced", category: "permissions", description: "Skip all permission checks for CI/CD and headless environments", descAr: "تخطي كل فحوصات الصلاحيات لبيئات الـ CI/CD والـ headless" },
  { name: "dontAsk permission mode", type: "setting", level: "advanced", category: "permissions", description: "Skip tools that would require permission for non-interactive scripting", descAr: "تخطي الأدوات اللي بتحتاج صلاحيات في بيئات الـ scripting غير التفاعلية" },
  { name: "Auto Mode Hard Deny Rules", type: "setting", level: "advanced", category: "security", description: "autoMode.hard_deny rules block actions unconditionally in auto mode, regardless of allow exceptions or user intent. Use for security boundaries that must never be crossed.", descAr: "قواعد autoMode.hard_deny بتمنع إجراءات بشكل غير مشروط في الوضع التلقائي، بغض النظر عن استثناءات allow أو نية المستخدم. استخدمها لحدود الأمان اللي مينفعش تتخطاها." },
  { name: "continueOnBlock for PostToolUse hooks", type: "setting", level: "advanced", category: "hooks", description: "Config option that feeds a PostToolUse hook rejection reason back to Claude as context and continues the turn instead of ending it. Useful for lint checks where Claude should self-correct.", descAr: "خيار config بيرجّع سبب رفض hook الـ PostToolUse لـ Claude كـ context وبيكمّل الدور بدل ما ينهيه. مفيد لفحوصات الـ lint لما تعايز Claude يصلّح نفسه." },
  { name: "Ultracode (/effort ultracode)", type: "setting", level: "advanced", category: "workflow", description: "Effort mode that combines xhigh reasoning with automatic workflow orchestration — Claude plans a dynamic workflow for each substantial task without being asked. Lasts for the current session.", descAr: "وضع effort بيجمع بين استدلال xhigh وorchestration workflow تلقائي — Claude بيخطّط dynamic workflow لكل مهمة أساسية من غير ما حد يطلب منه. بيفضل للجلسة الحالية." },
  { name: "disableSkillShellExecution", type: "setting", level: "advanced", category: "security", description: "Managed setting that disables inline shell execution in skills, custom slash commands, and plugin commands", descAr: "إعداد مُدار بيعطّل تنفيذ الـ shell المباشر في الـ skills والأوامر المخصصة وأوامر الـ plugins" },
  // Tools / Subagents
  { name: "general-purpose subagent", type: "tool", level: "intermediate", category: "workflow", description: "Multi-step research and complex multi-file task agent with all tools available", descAr: "agent متعدد الخطوات للبحث والمهام المعقدة عبر ملفات متعددة مع كل الأدوات المتاحة" },
  { name: "Plan subagent", type: "tool", level: "intermediate", category: "workflow", description: "Implementation planning agent for architecture design using read-only tools", descAr: "agent تخطيط التنفيذ لتصميم المعمارية باستخدام أدوات القراءة فقط" },
  { name: "Explore subagent", type: "tool", level: "intermediate", category: "workflow", description: "Codebase exploration agent using Haiku 4.5 for quick searches and code understanding", descAr: "agent استكشاف الكود باستخدام Haiku 4.5 للبحث السريع وفهم الكود" },
  { name: "Bash subagent", type: "tool", level: "intermediate", category: "workflow", description: "Command execution agent for git operations and terminal tasks", descAr: "agent تنفيذ الأوامر لعمليات git ومهام الـ terminal" },
  { name: "statusline-setup subagent", type: "tool", level: "intermediate", category: "workflow", description: "Status line configuration agent powered by Sonnet 4.6", descAr: "agent ضبط شريط الحالة مدعوم بـ Sonnet 4.6" },
  { name: "Claude Code Guide subagent", type: "tool", level: "beginner", category: "workflow", description: "Help and documentation agent using Haiku 4.5 for learning Claude Code features", descAr: "agent المساعدة والتوثيق باستخدام Haiku 4.5 لتعلّم مميزات Claude Code" },
  { name: "code-reviewer subagent", type: "tool", level: "intermediate", category: "development", description: "Comprehensive code quality review agent for code review sessions", descAr: "agent مراجعة جودة الكود الشاملة لجلسات الـ code review" },
  { name: "code-architect subagent", type: "tool", level: "advanced", category: "development", description: "Feature architecture design agent for planning new features", descAr: "agent تصميم معمارية المميزات لتخطيط الميزات الجديدة" },
  { name: "code-explorer subagent", type: "tool", level: "intermediate", category: "development", description: "Deep codebase analysis agent for understanding existing features", descAr: "agent تحليل الكود المعمّق لفهم المميزات الموجودة" },
  { name: "clean-code-reviewer subagent", type: "tool", level: "intermediate", category: "development", description: "Code review agent applying Clean Code principles for maintainability", descAr: "agent مراجعة الكود بمبادئ Clean Code لتحسين القابلية للصيانة" },
  { name: "test-engineer subagent", type: "tool", level: "intermediate", category: "development", description: "Test strategy and coverage planning agent for comprehensive test plans", descAr: "agent استراتيجية الاختبار وتخطيط التغطية لخطط اختبار شاملة" },
  { name: "documentation-writer subagent", type: "tool", level: "intermediate", category: "development", description: "Technical documentation agent for API docs and guides", descAr: "agent التوثيق التقني لوثائق الـ API والأدلة" },
  { name: "secure-reviewer subagent", type: "tool", level: "advanced", category: "security", description: "Security-focused code review agent for security audits", descAr: "agent مراجعة الكود المركّز على الأمان لعمليات الـ security audit" },
  { name: "implementation-agent subagent", type: "tool", level: "advanced", category: "development", description: "Full feature implementation agent for end-to-end feature development", descAr: "agent تنفيذ المميزات الكاملة من البداية للنهاية" },
  { name: "debugger subagent", type: "tool", level: "intermediate", category: "debugging", description: "Root cause analysis agent for bug investigation", descAr: "agent تحليل السبب الجذري للتحقيق في الأخطاء" },
  { name: "data-scientist subagent", type: "tool", level: "advanced", category: "development", description: "SQL queries and data analysis agent for data tasks", descAr: "agent استعلامات SQL وتحليل البيانات لمهام البيانات" },
  { name: "GitHub MCP server", type: "tool", level: "intermediate", category: "development", description: "MCP server for PR management, issues, and code access via GitHub API", descAr: "سيرفر MCP لإدارة الـ PRs و issues والوصول للكود عبر GitHub API" },
  { name: "Database MCP server", type: "tool", level: "intermediate", category: "development", description: "MCP server for SQL queries and direct database access", descAr: "سيرفر MCP لاستعلامات SQL والوصول المباشر لقاعدة البيانات" },
  { name: "Filesystem MCP server", type: "tool", level: "intermediate", category: "development", description: "MCP server for advanced file operations beyond built-in file tools", descAr: "سيرفر MCP لعمليات الملفات المتقدمة أكتر من أدوات الملفات المدمجة" },
  { name: "Slack MCP server", type: "tool", level: "intermediate", category: "workflow", description: "MCP server for team communication, notifications, and Slack updates", descAr: "سيرفر MCP للتواصل مع الفريق والإشعارات وتحديثات Slack" },
  { name: "Google Docs MCP server", type: "tool", level: "intermediate", category: "development", description: "MCP server for document access, editing, and review via Google Docs", descAr: "سيرفر MCP للوصول للمستندات وتعديلها ومراجعتها عبر Google Docs" },
  { name: "Asana MCP server", type: "tool", level: "intermediate", category: "workflow", description: "MCP server for project management and task tracking via Asana", descAr: "سيرفر MCP لإدارة المشاريع وتتبّع المهام عبر Asana" },
  { name: "Stripe MCP server", type: "tool", level: "advanced", category: "development", description: "MCP server for payment data access and financial analysis", descAr: "سيرفر MCP للوصول لبيانات المدفوعات والتحليل المالي" },
  { name: "Memory MCP server", type: "tool", level: "intermediate", category: "memory", description: "MCP server providing persistent memory for cross-session recall", descAr: "سيرفر MCP بيوفّر ذاكرة دائمة للاسترجاع عبر الجلسات" },
  { name: "Context7 MCP server", type: "tool", level: "intermediate", category: "development", description: "Built-in MCP server for up-to-date library documentation lookup", descAr: "سيرفر MCP مدمج للبحث في وثائق المكتبات المحدّثة" },
  // Skills
  { name: "code-review skill", type: "skill", level: "intermediate", category: "development", description: "Comprehensive code review skill auto-invoked by 'Review this code' or 'Check quality'", descAr: "skill مراجعة كود شاملة بيشتغل تلقائيًا لما تقول 'Review this code' أو 'Check quality'" },
  { name: "brand-voice skill", type: "skill", level: "intermediate", category: "development", description: "Brand consistency checker for marketing copy and content", descAr: "أداة فحص اتساق العلامة التجارية للنصوص التسويقية والمحتوى" },
  { name: "doc-generator skill", type: "skill", level: "intermediate", category: "development", description: "API documentation generator auto-invoked by 'Generate docs' or 'Document API'", descAr: "مولّد وثائق الـ API بيشتغل تلقائيًا لما تقول 'Generate docs' أو 'Document API'" },
  { name: "refactor skill", type: "skill", level: "intermediate", category: "development", description: "Systematic code refactoring skill auto-invoked by 'Refactor this' or 'Clean up code'", descAr: "skill إعادة هيكلة الكود بيشتغل تلقائيًا لما تقول 'Refactor this' أو 'Clean up code'" },
  { name: "/simplify bundled skill", type: "skill", level: "beginner", category: "development", description: "From v2.1.154 /simplify is a separate cleanup-only skill that applies reuse, simplification, and efficiency fixes without hunting for bugs — no longer just an alias for /code-review --fix.", descAr: "من v2.1.154 /simplify بقى skill منفصل للـ cleanup بس بيطبّق إصلاحات reuse وsimplification وefficiency من غير ما يبحث عن bugs — مش مجرد alias لـ /code-review --fix." },
  { name: "/batch bundled skill", type: "skill", level: "intermediate", category: "automation", description: "Run prompts on multiple files for batch operations", descAr: "شغّل prompts على ملفات متعددة لعمليات الـ batch" },
  { name: "/debug bundled skill", type: "skill", level: "intermediate", category: "debugging", description: "Debug failing tests or errors during debugging sessions", descAr: "اكتشف أخطاء الـ tests الفاشلة أو الأخطاء أثناء جلسات الـ debugging" },
  { name: "/loop bundled skill", type: "skill", level: "intermediate", category: "automation", description: "Run prompts on a recurring interval for scheduled or repeating tasks", descAr: "شغّل prompts على فترات متكررة للمهام المجدولة أو المتكررة" },
  { name: "/claude-api bundled skill", type: "skill", level: "advanced", category: "development", description: "Build applications with Claude API for API development tasks", descAr: "ابنِ تطبيقات بـ Claude API لمهام تطوير الـ API" },
  // Hooks
  { name: "SessionStart hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered on session begin or resume for setup tasks", descAr: "بيشتغل عند بداية أو استئناف الجلسة لمهام الإعداد" },
  { name: "InstructionsLoaded hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when CLAUDE.md or rules file is loaded for custom instruction handling", descAr: "بيشتغل لما يتحمّل ملف CLAUDE.md أو ملف rules للتعامل مع التعليمات المخصصة" },
  { name: "UserPromptSubmit hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered before prompt processing for input validation and transformation", descAr: "بيشتغل قبل معالجة الـ prompt للتحقق من المدخلات وتحويلها" },
  { name: "PreToolUse hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered before any tool execution for validation and logging", descAr: "بيشتغل قبل تنفيذ أي أداة للتحقق والتسجيل" },
  { name: "PermissionRequest hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when permission dialog is shown for custom approval flows", descAr: "بيشتغل لما يظهر مربع حوار الصلاحيات لتدفقات الموافقة المخصصة" },
  { name: "PostToolUse hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered after successful tool execution for formatting and notifications", descAr: "بيشتغل بعد تنفيذ الأداة بنجاح للتنسيق والإشعارات" },
  { name: "PostToolUseFailure hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered after tool execution failure for error handling and logging", descAr: "بيشتغل بعد فشل تنفيذ الأداة للتعامل مع الأخطاء والتسجيل" },
  { name: "Notification hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when Claude sends a notification for external alerting", descAr: "بيشتغل لما Claude يبعت إشعار للتنبيهات الخارجية" },
  { name: "SubagentStart hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when a subagent is spawned to initialize subagent context", descAr: "بيشتغل لما يتم إنشاء subagent لتهيئة سياق الـ subagent" },
  { name: "SubagentStop hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when a subagent finishes for chaining subsequent actions", descAr: "بيشتغل لما ينتهي subagent لربط الإجراءات اللاحقة" },
  { name: "Stop hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when Claude finishes responding for cleanup and reporting", descAr: "بيشتغل لما Claude يخلّص رده لعمليات التنظيف وإعداد التقارير" },
  { name: "StopFailure hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered on API error ending a turn for error recovery and logging", descAr: "بيشتغل عند خطأ في الـ API بينهي الدور لاستعادة الأخطاء والتسجيل" },
  { name: "TeammateIdle hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when a teammate agent is idle to distribute work across agent teams", descAr: "بيشتغل لما يكون agent زميل فاضي لتوزيع الشغل على فرق الـ agents" },
  { name: "TaskCompleted hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when a task is marked complete for post-task processing", descAr: "بيشتغل لما مهمة تتعلّم كمكتملة لمعالجة ما بعد المهمة" },
  { name: "TaskCreated hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when a task is created via TaskCreate for task tracking and logging", descAr: "بيشتغل لما يتم إنشاء مهمة عبر TaskCreate لتتبّع المهام والتسجيل" },
  { name: "ConfigChange hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when configuration is updated to react to settings changes", descAr: "بيشتغل لما يتم تحديث الإعدادات للتفاعل مع تغييرات الضبط" },
  { name: "CwdChanged hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when the working directory changes for directory-specific setup", descAr: "بيشتغل لما يتغيّر مجلد العمل لإعداد خاص بالمجلد" },
  { name: "FileChanged hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when a watched file is modified for file monitoring and rebuilds", descAr: "بيشتغل لما يتعدّل ملف مراقَب لمراقبة الملفات وإعادة البناء" },
  { name: "PreCompact hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered before context compaction for state preservation", descAr: "بيشتغل قبل ضغط الـ context لحفظ الحالة" },
  { name: "PostCompact hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered after context compaction completes for post-compact actions", descAr: "بيشتغل بعد اكتمال ضغط الـ context لإجراءات ما بعد الضغط" },
  { name: "WorktreeCreate hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when a git worktree is created for worktree environment setup", descAr: "بيشتغل لما يتم إنشاء git worktree لإعداد بيئة الـ worktree" },
  { name: "WorktreeRemove hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when a git worktree is removed for worktree resource cleanup", descAr: "بيشتغل لما يتم إزالة git worktree لتنظيف موارد الـ worktree" },
  { name: "Elicitation hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when an MCP server requests user input for input validation", descAr: "بيشتغل لما سيرفر MCP يطلب مدخلات من المستخدم للتحقق من المدخلات" },
  { name: "ElicitationResult hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered when a user responds to an MCP elicitation for response processing", descAr: "بيشتغل لما المستخدم يرد على MCP elicitation لمعالجة الرد" },
  { name: "SessionEnd hook", type: "hook", level: "advanced", category: "hooks", description: "Triggered on session termination for cleanup and saving state", descAr: "بيشتغل عند إنهاء الجلسة لعمليات التنظيف وحفظ الحالة" },
  { name: "validate-bash.py hook", type: "hook", level: "advanced", category: "security", description: "PreToolUse:Bash hook that validates shell commands before execution", descAr: "hook من نوع PreToolUse:Bash بيتحقق من أوامر الـ shell قبل تنفيذها" },
  { name: "security-scan.py hook", type: "hook", level: "advanced", category: "security", description: "PostToolUse:Write hook that scans written files for security issues", descAr: "hook من نوع PostToolUse:Write بيعمل scan أمني للملفات المكتوبة" },
  { name: "format-code.sh hook", type: "hook", level: "intermediate", category: "development", description: "PostToolUse:Write hook that auto-formats code after file writes", descAr: "hook من نوع PostToolUse:Write بيعمل format للكود تلقائيًا بعد كتابة الملفات" },
  { name: "validate-prompt.py hook", type: "hook", level: "advanced", category: "hooks", description: "UserPromptSubmit hook that validates prompts before processing", descAr: "hook من نوع UserPromptSubmit بيتحقق من الـ prompts قبل معالجتها" },
  { name: "context-tracker.py hook", type: "hook", level: "advanced", category: "hooks", description: "Stop hook that tracks token usage across sessions", descAr: "hook من نوع Stop بيتتبّع استهلاك الـ tokens عبر الجلسات" },
  { name: "pre-commit.sh hook", type: "hook", level: "advanced", category: "development", description: "PreToolUse:Bash hook that runs pre-commit validation checks", descAr: "hook من نوع PreToolUse:Bash بيشغّل فحوصات التحقق قبل الـ commit" },
  { name: "log-bash.sh hook", type: "hook", level: "advanced", category: "hooks", description: "PostToolUse:Bash hook that logs all executed shell commands", descAr: "hook من نوع PostToolUse:Bash بيسجّل كل أوامر الـ shell المنفّذة" },
  { name: "Agent Hook Type", type: "hook", level: "advanced", category: "hooks", description: "Hook type that spawns a subagent instead of running a shell command by setting type: agent", descAr: "نوع hook بيشغّل subagent بدل ما يشغّل أمر shell عن طريق ضبط type: agent" },
  { name: "Prompt Hook Type", type: "hook", level: "advanced", category: "hooks", description: "Hook type that injects prompt text into the conversation by setting type: prompt", descAr: "نوع hook بيحقن نص prompt في المحادثة عن طريق ضبط type: prompt" },
  { name: "MCP tool hooks (type: mcp_tool)", type: "hook", level: "advanced", category: "hooks", description: "Hook type that invokes an MCP tool directly — call external services from hooks without shelling out", descAr: "نوع hook بيستدعي أداة MCP مباشرةً — استدعِ خدمات خارجية من الـ hooks من غير ما تستخدم shell" },
  { name: "Hook args field (exec form)", type: "hook", level: "advanced", category: "hooks", description: "When args is set as an array, the hook command spawns directly without a shell (exec form); when omitted, the command passes to shell for tokenization (shell form)", descAr: "لما args تتضبط كـ array، أمر الـ hook بيشتغل مباشرة من غير shell (exec form)؛ لما يتحذف، الأمر بيتمرر للـ shell للتحليل (shell form)" },
  { name: "PostToolUse duration_ms", type: "hook", level: "advanced", category: "hooks", description: "PostToolUse and PostToolUseFailure hook inputs include duration_ms with tool execution time in milliseconds", descAr: "مدخلات hook الـ PostToolUse والـ PostToolUseFailure بتتضمن duration_ms مع وقت تنفيذ الأداة بالمللي ثانية" },
  { name: "Stop/SubagentStop background_tasks & session_crons", type: "hook", level: "advanced", category: "hooks", description: "Stop and SubagentStop hook inputs now include `background_tasks` (running background bash/subagents) and `session_crons` (queued scheduled tasks). A completion-gate hook can return {\"decision\":\"block\"} while either array is non-empty.", descAr: "inputs الـ Stop والـ SubagentStop بقت تتضمن `background_tasks` (bash/subagents شغّالة في الخلفية) و`session_crons` (مهام مجدولة في الطابور). completion-gate hook يقدر يرجّع `{\"decision\":\"block\"}` طول ما أي array منهم مش فاضي." },
  // Config
  { name: "Managed Policy memory", type: "config", level: "advanced", category: "configuration", description: "Organization-managed policies automatically applied to all users for org-wide standards", descAr: "سياسات مُدارة من المؤسسة بتتطبّق تلقائيًا على كل المستخدمين للمعايير المؤسسية" },
  { name: "CLAUDE.md", type: "config", level: "beginner", category: "memory", description: "Project-level memory file for team standards and project context, committed to git", descAr: "ملف ذاكرة على مستوى المشروع لمعايير الفريق وسياق المشروع، بيتعمله commit في git" },
  { name: ".claude/rules/", type: "config", level: "intermediate", category: "memory", description: "Modular project rules directory for organized, team-shared Claude instructions", descAr: "مجلد قواعد مشروع منظّم للتعليمات المشتركة مع الفريق في Claude" },
  { name: "~/.claude/CLAUDE.md", type: "config", level: "beginner", category: "memory", description: "User-level memory file for personal preferences and global instructions", descAr: "ملف ذاكرة على مستوى المستخدم للتفضيلات الشخصية والتعليمات العامة" },
  { name: "~/.claude/rules/", type: "config", level: "intermediate", category: "memory", description: "Modular personal rules directory for organized user-specific Claude instructions", descAr: "مجلد قواعد شخصية منظّم لتعليمات Claude الخاصة بالمستخدم" },
  { name: "CLAUDE.local.md", type: "config", level: "intermediate", category: "memory", description: "Local machine-specific memory file that is git-ignored for personal overrides", descAr: "ملف ذاكرة خاص بالجهاز المحلي بيتعمله git-ignore للتعديلات الشخصية" },
  { name: "Subagent model field", type: "config", level: "advanced", category: "configuration", description: "Override the model for a specific subagent (e.g., haiku-4.5 for faster, cheaper tasks)", descAr: "غيّر الموديل لـ subagent معيّن (مثلاً haiku-4.5 لمهام أسرع وأرخص)" },
  { name: "Subagent effort field", type: "config", level: "advanced", category: "configuration", description: "Set reasoning effort level (low, medium, high) for a subagent to control compute usage", descAr: "اضبط مستوى عمق التفكير (low, medium, high) لـ subagent للتحكم في استهلاك الحوسبة" },
  { name: "Subagent initialPrompt field", type: "config", level: "advanced", category: "configuration", description: "System prompt injected at subagent start to customize agent behavior", descAr: "system prompt بيتحقن عند بداية الـ subagent لتخصيص سلوك الـ agent" },
  { name: "Subagent disallowedTools field", type: "config", level: "advanced", category: "security", description: "Explicitly deny specific tools from a subagent for security and scope control", descAr: "امنع أدوات محددة من subagent بشكل صريح للأمان والتحكم في النطاق" },
  { name: "Skill autoInvoke field", type: "config", level: "intermediate", category: "configuration", description: "YAML frontmatter field defining trigger phrases for automatic skill invocation", descAr: "حقل في YAML frontmatter بيحدّد عبارات التشغيل التلقائي للـ skill" },
  { name: "Skill effort field", type: "config", level: "advanced", category: "configuration", description: "YAML frontmatter field setting reasoning effort level for the skill (low, medium, high)", descAr: "حقل في YAML frontmatter بيضبط مستوى عمق التفكير للـ skill (low, medium, high)" },
  { name: "Skill shell field", type: "config", level: "intermediate", category: "configuration", description: "YAML frontmatter field specifying the shell to use for skill scripts (bash, zsh, sh)", descAr: "حقل في YAML frontmatter بيحدّد الـ shell المستخدم لتشغيل scripts الـ skill (bash, zsh, sh)" },
  { name: "Plugin monitors manifest key", type: "config", level: "advanced", category: "configuration", description: "Manifest key (now nested under experimental) pointing at background Monitor tool configs that auto-arm when the plugin is enabled", descAr: "مفتاح في الـ manifest (دلوقتي تحت experimental) بيشاور على إعدادات أداة Monitor اللي بتتفعّل تلقائي أول ما الـ plugin يتفعّل" },
  { name: "cleanupPeriodDays", type: "config", level: "advanced", category: "maintenance", description: "Settings.json option controlling how long session files are retained before automatic deletion at startup; also controls orphaned subagent worktree cleanup", descAr: "خيار في settings.json بيتحكم في مدة الاحتفاظ بملفات الجلسة قبل الحذف التلقائي عند التشغيل؛ بيتحكم كمان في تنظيف worktrees الـ subagent المهجورة" },
  { name: "CLAUDE_CODE_FORK_SUBAGENT", type: "config", level: "advanced", category: "configuration", description: "Environment variable to enable forked subagents that inherit full conversation context from the main session, changes /fork behavior, and runs all subagent spawns in the background (interactive mode only)", descAr: "متغير بيئة لتفعيل subagents متفرّعة ترث السياق الكامل للمحادثة من الجلسة الرئيسية، يغيّر سلوك /fork، وبيشغّل كل إنشاءات الـ subagents في الخلفية (الوضع التفاعلي فقط)" },
  { name: "DISABLE_UPDATES", type: "config", level: "advanced", category: "maintenance", description: "Environment variable that blocks all update paths including manual claude update — stricter than DISABLE_AUTOUPDATER", descAr: "متغير بيئة بيحجب كل مسارات التحديث بما فيها تحديث claude اليدوي — أصرم من DISABLE_AUTOUPDATER" },
  { name: "Auto mode $defaults token", type: "config", level: "advanced", category: "configuration", description: "Include \"$defaults\" in autoMode.allow, soft_deny, or environment to extend built-in rules instead of replacing them", descAr: "ضمّن \"$defaults\" في autoMode.allow أو soft_deny أو environment لتوسيع القواعد المدمجة بدل استبدالها" },
  { name: "prUrlTemplate", type: "config", level: "advanced", category: "configuration", description: "Settings.json option that points the footer PR badge at a custom code-review URL instead of GitHub", descAr: "خيار في settings.json بيوجّه شارة الـ PR في التذييل لـ URL مراجعة كود مخصص بدل GitHub" },
  { name: "CLAUDE_CODE_HIDE_CWD", type: "config", level: "intermediate", category: "configuration", description: "Environment variable that hides the working directory from the startup logo banner", descAr: "متغير بيئة بيخفي مجلد العمل من شعار بداية التشغيل" },
  { name: "ANTHROPIC_DEFAULT_*_MODEL", type: "config", level: "advanced", category: "configuration", description: "Environment variables to override default model names for Haiku, Sonnet, and Opus model tiers", descAr: "متغيرات بيئة لتجاوز أسماء الموديلات الافتراضية لمستويات Haiku وSonnet وOpus" },
  { name: "${CLAUDE_EFFORT} in skills", type: "config", level: "intermediate", category: "configuration", description: "Skills can reference the current effort level with ${CLAUDE_EFFORT} in their content to adapt behavior dynamically", descAr: "الـ skills تقدر تستخدم ${CLAUDE_EFFORT} في محتواها للإشارة لمستوى الجهد الحالي وتكييف السلوك ديناميكيًا" },
  { name: "ANTHROPIC_BEDROCK_SERVICE_TIER", type: "config", level: "advanced", category: "configuration", description: "Environment variable to select a Bedrock service tier (default, flex, or priority), sent as the X-Amzn-Bedrock-Service-Tier header", descAr: "متغير بيئة لاختيار مستوى خدمة Bedrock (default أو flex أو priority)، بيتبعت كـ header الـ X-Amzn-Bedrock-Service-Tier" },
  { name: "AI_AGENT env var", type: "config", level: "intermediate", category: "configuration", description: "Environment variable set for subprocesses so tools like gh can attribute traffic to Claude Code", descAr: "متغير بيئة بيتضبط للعمليات الفرعية عشان أدوات زي gh تقدر تنسب الـ traffic لـ Claude Code" },
  { name: "blockedMarketplaces", type: "config", level: "advanced", category: "security", description: "Managed policy setting to restrict plugin marketplaces by hostPattern (domain) and pathPattern (repository path)", descAr: "إعداد managed policy لتقييد أسواق الـ plugins عبر hostPattern (النطاق) وpathPattern (مسار المستودع)" },
  { name: "CLAUDE_EFFORT in hooks", type: "config", level: "advanced", category: "hooks", description: "Environment variable available in hook commands containing the current effort level, allowing hooks to adapt behavior based on session effort", descAr: "متغير بيئة متاح في أوامر الـ hooks بيحتوي على مستوى الجهد الحالي، يتيح للـ hooks تكييف سلوكها بناءً على جهد الجلسة" },
  { name: "CLAUDE_EFFORT in Bash", type: "config", level: "advanced", category: "configuration", description: "Environment variable set in Bash subprocesses with the current effort level (low, medium, high, xhigh, max), enabling scripts to adjust behavior dynamically", descAr: "متغير بيئة بيتضبط في الـ Bash subprocesses مع مستوى الجهد الحالي (low, medium, high, xhigh, max)، يتيح للسكربتات ضبط سلوكها ديناميكيًا" },
  { name: "CLAUDE_CODE_SESSION_ID", type: "config", level: "advanced", category: "configuration", description: "Environment variable set in Bash subprocesses and hooks containing the unique session identifier for tracking and correlation", descAr: "متغير بيئة بيتضبط في الـ Bash subprocesses والـ hooks بيحتوي على معرّف الجلسة الفريد للتتبع والربط" },
  { name: "CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN", type: "config", level: "intermediate", category: "configuration", description: "Environment variable that disables the fullscreen alternate-screen renderer, keeping conversation in the terminal's native scrollback", descAr: "متغير بيئة بيعطّل عارض الشاشة البديلة الملء شاشة، مع الاحتفاظ بالمحادثة في scrollback الترمينال الأصلي" },
  { name: "CLAUDE_CODE_FORCE_SYNC_OUTPUT", type: "config", level: "advanced", category: "configuration", description: "Environment variable that force-enables synchronized output rendering on terminals where auto-detection fails", descAr: "متغير بيئة بيجبر تفعيل عرض الإخراج المتزامن على الترمينالات اللي بيفشل فيها الاكتشاف التلقائي" },
  { name: "CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE", type: "config", level: "intermediate", category: "maintenance", description: "Environment variable enabling automatic background updates for Homebrew and WinGet installations with a restart prompt when a new version is available", descAr: "متغير بيئة بيفعّل التحديثات التلقائية في الخلفية لتثبيتات Homebrew وWinGet مع طلب إعادة تشغيل عند توفر إصدار جديد" },
  { name: "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY", type: "config", level: "advanced", category: "configuration", description: "Environment variable that enables automatic population of the model picker from a configured LLM gateway's /v1/models endpoint", descAr: "متغير بيئة بيفعّل ملء منتقي الموديل تلقائيًا من endpoint الـ /v1/models بتاع LLM gateway المضبوط" },
  { name: "channelsEnabled", type: "config", level: "advanced", category: "configuration", description: "Managed-only setting that enables channel notifications (Telegram, Discord, iMessage) for the organization, required for API key authentication on Console", descAr: "إعداد مُدار فقط بيفعّل إشعارات القنوات (Telegram وDiscord وiMessage) للمؤسسة، مطلوب لمصادقة مفتاح الـ API على Console" },
  { name: "GH_TOKEN", type: "config", level: "intermediate", category: "configuration", description: "Environment variable containing a GitHub personal access token, used by the gh CLI and cloud session tools for repository access", descAr: "متغير بيئة بيحتوي على GitHub personal access token، بيستخدمه CLI الـ gh وأدوات الجلسة السحابية للوصول للمستودع" },
  { name: "GH_HOST", type: "config", level: "advanced", category: "configuration", description: "Environment variable specifying the GitHub hostname for GitHub Enterprise Server installations, used by the gh CLI in cloud sessions", descAr: "متغير بيئة بيحدّد hostname الـ GitHub لتثبيتات GitHub Enterprise Server، بيستخدمه CLI الـ gh في الجلسات السحابية" },
  { name: "GH_ENTERPRISE_TOKEN / GITHUB_ENTERPRISE_TOKEN", type: "config", level: "advanced", category: "configuration", description: "Environment variables for authenticating with GitHub Enterprise Server instances, used by the gh CLI when GH_HOST points to an enterprise server", descAr: "متغيرات بيئة للمصادقة مع نسخ GitHub Enterprise Server، بيستخدمها CLI الـ gh لما GH_HOST يشاور على سيرفر enterprise" },
  { name: "CLAUDE_CODE_DISABLE_AGENT_VIEW", type: "config", level: "advanced", category: "configuration", description: "Environment variable that disables the background agents and agent view UI", descAr: "متغير بيئة بيعطّل الـ agents الخلفية وواجهة عرض الـ agent" },
  { name: "CLAUDE_CODE_MAX_TURNS", type: "config", level: "intermediate", category: "configuration", description: "Environment variable that caps the number of agentic turns in a session, useful for limiting automated runs", descAr: "متغير بيئة بيحدّد الحد الأقصى لعدد الدورات الـ agentic في الجلسة، مفيد لتقييد التشغيلات الآلية" },
  { name: "CLAUDE_CODE_NATIVE_CURSOR", type: "config", level: "intermediate", category: "configuration", description: "Environment variable that shows the terminal's own cursor at the input caret instead of Claude Code's drawn block, respecting the terminal's blink, shape, and focus settings", descAr: "متغير بيئة بيخلّي Claude Code يعرض مؤشر الـ terminal الأصلي عند خانة الإدخال بدل البلوك المرسوم، مع احترام إعدادات الـ blink والشكل والـ focus" },
  { name: "CLAUDE_CODE_RESUME_PROMPT", type: "config", level: "advanced", category: "configuration", description: "Environment variable that overrides the continuation message injected when resuming a session that ended mid-turn (default: 'Continue from where you left off.')", descAr: "متغير بيئة بيستبدل رسالة الاستكمال اللي بتتحقن لما تستأنف جلسة وقفت في نص الـ turn (الافتراضي: 'Continue from where you left off.')" },
  { name: "CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL", type: "config", level: "advanced", category: "configuration", description: "Environment variable that routes the session quality survey to your OpenTelemetry collector when Anthropic-bound nonessential traffic is blocked; emits ratings only as OTEL events, never to Anthropic", descAr: "متغير بيئة بيوجّه استبيان جودة الجلسة لـ OpenTelemetry collector بتاعك لما يكون الـ traffic غير الأساسي المتجه لـ Anthropic مقفول؛ التقييمات بتتبعت كـ OTEL events بس، مش لـ Anthropic" },
  { name: "ANTHROPIC_WORKSPACE_ID", type: "config", level: "advanced", category: "configuration", description: "Workspace ID used by workload identity federation. Set it when your federation rule is scoped to more than one workspace so the token exchange knows which workspace to target", descAr: "معرّف الـ workspace بيستخدمه workload identity federation. اضبطه لما يكون قاعدة الـ federation مضبوطة لأكتر من workspace عشان تبادل الـ token يعرف أي workspace يستهدف" },
  { name: "CLAUDE_CODE_PLUGIN_PREFER_HTTPS", type: "config", level: "intermediate", category: "configuration", description: "Set to `1` to clone GitHub `owner/repo` plugin sources over HTTPS instead of SSH. Useful in CI runners, containers, or any environment without a configured SSH key for github.com", descAr: "اضبطه على `1` عشان يستنسخ مصادر plugins الـ GitHub `owner/repo` عبر HTTPS بدل SSH. مفيد في CI runners والحاويات وأي بيئة من غير مفتاح SSH مضبوط لـ github.com" },
  { name: "sandbox.network.deniedDomains", type: "config", level: "advanced", category: "security", description: "Block specific domains from outbound network access even when a broader allowedDomains wildcard would permit them", descAr: "حجب domains معينة من الترافيك الخارجي في الـ sandbox حتى لو wildcard أوسع في allowedDomains كان هيسمح بيها" },
  { name: "sandbox.bwrapPath / sandbox.socatPath", type: "config", level: "advanced", category: "security", description: "Managed-only settings (Linux/WSL2) to specify absolute paths to the bubblewrap and socat binaries for sandbox isolation, overriding automatic PATH detection", descAr: "إعدادات مُدارة فقط (Linux/WSL2) لتحديد المسارات المطلقة لـ binaries الـ bubblewrap وsocat لعزل الـ sandbox، تتجاوز الاكتشاف التلقائي لـ PATH" },
  { name: "parentSettingsBehavior", type: "config", level: "advanced", category: "configuration", description: "Admin-tier managed setting controlling whether parent-supplied settings (from SDK or IDE) merge with or are overridden by admin-deployed policies—'first-wins' (default) or 'merge'", descAr: "إعداد managed على مستوى admin بيتحكم في ما إذا كانت الإعدادات المقدَّمة من الوالد (من SDK أو IDE) تتدمج أو تتجاوزها السياسات المنشورة من admin — 'first-wins' (افتراضي) أو 'merge'" },
  { name: "alwaysLoad (MCP config)", type: "config", level: "intermediate", category: "configuration", description: "Exempt an MCP server from tool search deferral so its tools are always loaded into context", descAr: "استثنِ سيرفر MCP من تأجيل البحث عن الأدوات عشان أدواته دايمًا بتتحمّل في الـ context" },
  { name: "worktree.baseRef", type: "config", level: "advanced", category: "configuration", description: "Settings.json option controlling which git reference new worktrees branch from—'fresh' (default, from remote default branch) or 'head' (from local HEAD)", descAr: "خيار في settings.json بيتحكم في أي git reference تتفرع منه الـ worktrees الجديدة — 'fresh' (افتراضي، من remote default branch) أو 'head' (من local HEAD)" },
  { name: "CLAUDE_CODE_USE_POWERSHELL_TOOL", type: "config", level: "advanced", category: "configuration", description: "Set to `1` to enable the PowerShell tool on Linux/macOS/WSL (requires `pwsh` 7+ on PATH). On Windows set it to `0` to opt out of the progressive rollout.", descAr: "اضبطه على `1` لتفعيل أداة PowerShell على Linux/macOS/WSL (بتحتاج `pwsh` 7+ على PATH). على Windows اضبطه على `0` للخروج من الطرح التدريجي." },
  // Features
  { name: "Auto Memory", type: "feature", level: "intermediate", category: "memory", description: "Automatically captured insights and corrections stored across the session", descAr: "رؤى وتصحيحات بتتسجّل تلقائيًا عبر الجلسة" },
  { name: "Remote Control", type: "feature", level: "advanced", category: "workflow", description: "Control Claude Code sessions remotely via API by sending prompts and receiving responses programmatically", descAr: "تحكّم في جلسات Claude Code عن بُعد عبر الـ API بإرسال prompts واستقبال ردود برمجيًا" },
  { name: "Web Sessions", type: "feature", level: "intermediate", category: "session", description: "Run Claude Code in a browser-based environment via Anthropic Console", descAr: "شغّل Claude Code في بيئة المتصفح عبر Anthropic Console" },
  { name: "Desktop App", type: "feature", level: "beginner", category: "session", description: "Native desktop application for Claude Code with enhanced UI", descAr: "تطبيق سطح مكتب أصلي لـ Claude Code بواجهة مستخدم محسّنة" },
  { name: "Agent Teams", type: "feature", level: "advanced", category: "workflow", description: "Coordinate multiple agents working on related tasks with shared context", descAr: "نسّق بين agents متعددة شغّالة على مهام مرتبطة بـ context مشترك" },
  { name: "Task List", type: "feature", level: "intermediate", category: "workflow", description: "Background task management and monitoring for async operations", descAr: "إدارة ومراقبة المهام الخلفية للعمليات غير المتزامنة" },
  { name: "Prompt Suggestions", type: "feature", level: "beginner", category: "input", description: "Context-aware command suggestions that appear automatically based on current context", descAr: "اقتراحات أوامر ذكية بتظهر تلقائيًا بناءً على السياق الحالي" },
  { name: "Git Worktrees", type: "feature", level: "advanced", category: "development", description: "Isolated git worktrees for safe parallel branch development", descAr: "git worktrees معزولة لتطوير branches متوازية بأمان" },
  { name: "Sandboxing", type: "feature", level: "advanced", category: "security", description: "Isolated execution environments for running commands safely in restricted containers", descAr: "بيئات تنفيذ معزولة لتشغيل الأوامر بأمان في حاويات محدودة" },
  { name: "MCP OAuth", type: "feature", level: "advanced", category: "security", description: "OAuth authentication for MCP servers for secure credential-based access", descAr: "مصادقة OAuth لسيرفرات الـ MCP للوصول الآمن ببيانات الاعتماد" },
  { name: "MCP Tool Search", type: "feature", level: "intermediate", category: "development", description: "Search and discover MCP tools dynamically across connected servers", descAr: "ابحث واكتشف أدوات MCP ديناميكيًا عبر السيرفرات المتصلة" },
  { name: "Scheduled Tasks", type: "feature", level: "advanced", category: "automation", description: "Set up recurring tasks using /loop and cron tools for automated scheduling", descAr: "اضبط مهام متكررة باستخدام /loop وأدوات الـ cron للجدولة التلقائية" },
  { name: "Chrome Integration", type: "feature", level: "intermediate", category: "development", description: "Browser automation with headless Chromium via --chrome flag or /chrome command", descAr: "أتمتة المتصفح مع headless Chromium عبر flag الـ --chrome أو أمر /chrome" },
  { name: "Keyboard Customization", type: "feature", level: "intermediate", category: "configuration", description: "Customize keybindings including chord key support via /keybindings or ~/.claude/keybindings.json", descAr: "خصّص اختصارات الكيبورد بما فيها دعم الـ chord keys عبر /keybindings أو ~/.claude/keybindings.json" },
  { name: "Auto Mode", type: "feature", level: "advanced", category: "automation", description: "Fully autonomous operation without permission prompts via --mode auto (Research Preview)", descAr: "تشغيل مستقل بالكامل من غير طلبات صلاحيات عبر --mode auto (Research Preview)" },
  { name: "Channels", type: "feature", level: "advanced", category: "workflow", description: "Push events into a running session from an MCP server — Telegram, Discord, and iMessage channel plugins (Research Preview, requires v2.1.80+)", descAr: "بعت أحداث لجلسة شغّالة من MCP server — plugins قنوات Telegram و Discord و iMessage (Research Preview، محتاجة v2.1.80+)" },
  { name: "Voice Dictation", type: "feature", level: "beginner", category: "input", description: "Voice input for prompts using microphone icon or voice keybinding", descAr: "إدخال صوتي للـ prompts باستخدام أيقونة الميكروفون أو اختصار الصوت" },
  { name: "MCP Elicitation", type: "feature", level: "advanced", category: "development", description: "MCP servers can request user input during tool execution via Elicitation events", descAr: "سيرفرات الـ MCP تقدر تطلب مدخلات من المستخدم أثناء تنفيذ الأداة عبر أحداث Elicitation" },
  { name: "WebSocket MCP Transport", type: "feature", level: "advanced", category: "development", description: "WebSocket-based transport for MCP server connections via transport: websocket config", descAr: "نقل بيانات عبر WebSocket لاتصالات سيرفر MCP عبر إعداد transport: websocket" },
  { name: "Plugin LSP Support", type: "feature", level: "advanced", category: "development", description: "Language Server Protocol integration via plugins for editor features like autocomplete", descAr: "تكامل Language Server Protocol عبر plugins لمميزات المحرر زي الـ autocomplete" },
  { name: "Managed Drop-ins", type: "feature", level: "advanced", category: "configuration", description: "Organization-managed drop-in configurations auto-applied to all users via managed policies (v2.1.83)", descAr: "إعدادات drop-in مُدارة من المؤسسة بتتطبّق تلقائيًا على كل المستخدمين عبر managed policies (v2.1.83)" },
  { name: "EnterWorktree tool", type: "feature", level: "advanced", category: "development", description: "Tool that creates an isolated git worktree and switches into it; accepts a path parameter to enter an existing worktree instead", descAr: "أداة بتعمل git worktree معزول وتدخل فيه؛ بتقبل argument بـ path عشان تدخل worktree موجود بدل ما تعمل واحد جديد" },
  { name: "Advisor Tool (experimental)", type: "feature", level: "advanced", category: "development", description: "Experimental dual-model feature that lets a faster executor model consult a higher-intelligence advisor model mid-task; enable with /advisor", descAr: "ميزة تجريبية بموديلين تتيح لموديل منفّذ أسرع التشاور مع موديل مستشار أعلى ذكاءً في منتصف المهمة؛ فعّلها بـ /advisor" },
  { name: "Native Glob and Grep (bfs/ugrep)", type: "feature", level: "advanced", category: "development", description: "On native macOS/Linux builds, Glob and Grep tools are replaced by embedded bfs and ugrep binaries through Bash for faster searches", descAr: "في builds macOS/Linux الأصلية، أدوات Glob وGrep بتتستبدل بـ binaries مدمجة bfs وugrep عبر Bash لبحث أسرع" },
  { name: "Concurrent MCP connect", type: "feature", level: "intermediate", category: "development", description: "MCP servers connect concurrently at startup by default for faster initialization when multiple servers are configured", descAr: "سيرفرات MCP بتتصل بشكل متزامن عند التشغيل كافتراضي لتهيئة أسرع لما يكون في سيرفرات متعددة مضبوطة" },
  { name: "Vim visual mode (v / V)", type: "feature", level: "intermediate", category: "input", description: "Character-wise (v) and line-wise (V) visual selection in the input editor with operators like d, y, c, p, and text objects", descAr: "تحديد بصري بالحرف (v) والسطر (V) في محرر الإدخال مع operators زي d وy وc وp وكائنات النص" },
  { name: "Custom themes (/theme)", type: "feature", level: "beginner", category: "configuration", description: "Create and switch named color themes stored as JSON in ~/.claude/themes/; plugins can ship themes too", descAr: "أنشئ وبدّل بين themes لونية مسمّاة مخزنة كـ JSON في ~/.claude/themes/؛ الـ plugins تقدر تشحن themes كمان" },
  { name: "PostToolUse updatedToolOutput", type: "feature", level: "advanced", category: "hooks", description: "PostToolUse hooks can replace tool output for all tools via hookSpecificOutput.updatedToolOutput, not just MCP tools", descAr: "hooks الـ PostToolUse تقدر تستبدل إخراج الأداة لكل الأدوات عبر hookSpecificOutput.updatedToolOutput، مش الـ MCP tools بس" },
  { name: "--dangerously-skip-permissions .claude/ exemption", type: "feature", level: "advanced", category: "security", description: "When --dangerously-skip-permissions is active, writes to .claude/skills/, .claude/agents/, and .claude/commands/ are still allowed without prompting", descAr: "لما --dangerously-skip-permissions يكون مفعّل، الكتابة على .claude/skills/ و.claude/agents/ و.claude/commands/ لا تزال مسموحة من غير طلب" },
  { name: "Pasting… footer hint", type: "feature", level: "beginner", category: "input", description: "Status bar hint that appears while an image paste (Ctrl+V) is being read from the clipboard", descAr: "تلميح شريط الحالة بيظهر أثناء قراءة لصق صورة (Ctrl+V) من الحافظة" },
  { name: "Dynamic Workflows", type: "feature", level: "advanced", category: "workflow", description: "Orchestrate dozens to hundreds of subagents from a JavaScript script Claude writes and a runtime executes in the background. Trigger by including 'workflow' in your prompt or with /effort ultracode.", descAr: "نسّق من dozens لـ hundreds من الـ subagents من script بلغة JavaScript بيكتبه Claude وruntime بينفّذه في الخلفية. شغّله بحط كلمة 'workflow' في الـ prompt أو بـ /effort ultracode." },
  { name: "pr-review plugin", type: "feature", level: "advanced", category: "development", description: "PR review workflow plugin bundling 3 commands, 3 agents, and GitHub MCP", descAr: "plugin لسير عمل مراجعة الـ PR فيه 3 أوامر و 3 agents و GitHub MCP" },
  { name: "devops-automation plugin", type: "feature", level: "advanced", category: "deployment", description: "Deployment and monitoring plugin bundling 4 commands, 3 agents, and Kubernetes MCP", descAr: "plugin للنشر والمراقبة فيه 4 أوامر و 3 agents و Kubernetes MCP" },
  { name: "documentation plugin", type: "feature", level: "advanced", category: "development", description: "Documentation generation suite bundling 4 commands, 3 agents, and templates", descAr: "حزمة توليد التوثيق فيها 4 أوامر و 3 agents وقوالب" },
  // Flags
  { name: "--yes / -y", type: "flag", level: "beginner", category: "automation", description: "Auto-accept confirmation prompts in CLI commands like plugin install and project purge", descAr: "قبول طلبات التأكيد تلقائيًا في أوامر CLI زي تثبيت plugin وتنظيف المشروع" },
  { name: "--dangerously-skip-permissions", type: "flag", level: "advanced", category: "security", description: "CLI flag equivalent to --permission-mode bypassPermissions that skips all permission prompts; name emphasizes the security trade-off", descAr: "flag في CLI مكافئ لـ --permission-mode bypassPermissions بيتجاوز كل طلبات الصلاحيات؛ الاسم بيؤكد المقايضة الأمنية" },
  { name: "claude ultrareview --timeout", type: "flag", level: "advanced", category: "development", description: "Cap the maximum runtime of claude ultrareview in minutes before returning partial results", descAr: "حدّد الحد الأقصى لوقت تشغيل claude ultrareview بالدقائق قبل إرجاع نتايج جزئية" },
  { name: "--plugin-url", type: "flag", level: "advanced", category: "configuration", description: "CLI flag that fetches a plugin as a .zip archive from a URL for the current session, allowing dynamic plugin loading without permanent installation", descAr: "flag في CLI بيجلب plugin كأرشيف .zip من URL للجلسة الحالية، يتيح تحميل plugin ديناميكيًا من غير تثبيت دائم" },
  { name: "--cwd", type: "flag", level: "intermediate", category: "navigation", description: "Flag for `claude agents` that filters the Agent view to sessions started under the given working directory; useful when juggling multiple repos", descAr: "flag لـ `claude agents` بيصفّي عرض الـ Agent للجلسات المبدوءة تحت مجلد العمل المحدد؛ مفيد لما تشتغل على مستودعات متعددة" },
  { name: "--permission-mode", type: "flag", level: "intermediate", category: "permissions", description: "Begin a session in a specified permission mode. Accepts default, acceptEdits, plan, auto, dontAsk, or bypassPermissions; overrides `defaultMode` from settings for that session", descAr: "ابدأ جلسة في وضع صلاحيات محدد. يقبل default وacceptEdits وplan وauto وdontAsk وbypassPermissions؛ بيتجاوز `defaultMode` من الإعدادات للجلسة دي" },
  { name: "--add-dir", type: "flag", level: "intermediate", category: "configuration", description: "Add additional working directories Claude can read and edit for this session. Each path must exist as a directory. To persist across sessions, use `permissions.additionalDirectories` in settings", descAr: "أضف مجلدات عمل إضافية Claude يقدر يقرأها ويعدّلها للجلسة دي. كل مسار لازم يكون موجود كمجلد. للاحتفاظ بيه عبر الجلسات، استخدم `permissions.additionalDirectories` في الإعدادات" },
  { name: "--mcp-config", type: "flag", level: "intermediate", category: "configuration", description: "Load MCP server definitions from one or more JSON files (space-separated paths). Combine with `--strict-mcp-config` to ignore every other MCP source for the session", descAr: "حمّل تعريفات سيرفر MCP من ملف JSON واحد أو أكتر (مسارات مفصولة بمسافات). ادمجها مع `--strict-mcp-config` لتجاهل كل مصادر MCP التانية للجلسة" },
  { name: "claude agents --json", type: "flag", level: "intermediate", category: "workflow", description: "Print the Agent view's session roster as a JSON array (pid, cwd, kind, startedAt, plus sessionId, name, and status when set) for scripts — tmux-resurrect-style boot scripts, custom status bars, session pickers", descAr: "اطبع روستر جلسات الـ Agent view كـ JSON array (pid وcwd وkind وstartedAt، وكمان sessionId واسم وstatus لما يكونوا متضبطين) للسكربتات" },
  { name: "--safe-mode", type: "flag", level: "intermediate", category: "configuration", description: "Start Claude Code with all customizations (CLAUDE.md, plugins, skills, hooks, MCP servers) disabled for troubleshooting. Equivalent to CLAUDE_CODE_SAFE_MODE=1", descAr: "ابدأ Claude Code بكل التخصيصات (CLAUDE.md والـ plugins والـ skills والـ hooks وMCP servers) متعطّلة للتشخيص. نفس CLAUDE_CODE_SAFE_MODE=1" },
  { name: "--from-pr multi-platform", type: "flag", level: "intermediate", category: "development", description: "The --from-pr flag now accepts GitHub, GitHub Enterprise, GitLab merge-request, and Bitbucket pull-request URLs", descAr: "flag الـ --from-pr دلوقتي بيقبل URLs الـ GitHub وGitHub Enterprise وGitLab merge-request وBitbucket pull-request" },
  // Shortcuts
  { name: "Ctrl+R Reverse Search", type: "shortcut", level: "beginner", category: "navigation", description: "Interactively search command history across all projects. Press Ctrl+S to cycle scope between current session, current project, and all projects.", descAr: "البحث التفاعلي Ctrl+R في تاريخ الأوامر عبر كل المشاريع. اضغط Ctrl+S عشان تتنقل بين نطاق الجلسة الحالية، المشروع الحالي، وكل المشاريع." },
  // Workflows
  { name: "claude auth login (OAuth paste)", type: "workflow", level: "beginner", category: "session", description: "Authentication workflow for environments where the browser callback cannot reach localhost (WSL2, SSH, containers); manually paste the OAuth code after browser sign-in", descAr: "سير عمل المصادقة للبيئات اللي ما يقدرش فيها browser callback يوصل لـ localhost (WSL2، SSH، حاويات)؛ الصق كود الـ OAuth يدويًا بعد تسجيل الدخول بالمتصفح" },
  { name: "Mobile Push Notifications", type: "workflow", level: "intermediate", category: "workflow", description: "When Remote Control is active, Claude sends push notifications to your phone when a task finishes or needs input. Enable via /config → Push when Claude decides. Requires Claude mobile app.", descAr: "لما الـ Remote Control مفعّل، Claude بيبعت إشعارات فورية على موبايلك لما مهمة تخلص أو يحتاج قرارك. فعّلها من /config → Push when Claude decides. محتاج تطبيق Claude على الموبايل." },
  { name: "Read tool partial-view truncation", type: "workflow", level: "intermediate", category: "development", description: "When a whole-file read would exceed the token limit, the Read tool now returns a truncated first page with a `PARTIAL view` notice instead of a hard error. Claude can paginate with `offset`/`limit`", descAr: "لما قراءة الملف كامل تتجاوز حد الـ tokens، أداة Read بقت بترجّع صفحة أولى مقتطعة مع إشعار `PARTIAL view` بدل خطأ مانع. Claude يقدر يقسّم بـ `offset`/`limit`" },
  { name: "Output Styles", type: "workflow", level: "intermediate", category: "configuration", description: "Change how Claude responds (role, tone, format) by modifying the system prompt. Built-in styles: Default, Proactive, Explanatory, Learning. Custom styles are Markdown files in ~/.claude/output-styles/", descAr: "غيّر طريقة رد Claude (الدور والنبرة والصيغة) عن طريق تعديل الـ system prompt. أنماط مدمجة: Default وProactive وExplanatory وLearning. الأنماط المخصصة ملفات Markdown في ~/.claude/output-styles/" },
  { name: "Computer Use", type: "workflow", level: "advanced", category: "automation", description: "Let Claude open apps, control your screen, and interact with GUIs on macOS. Enable the computer-use MCP server via /mcp. Requires Pro or Max plan, macOS, and an interactive session. Research preview", descAr: "خلّي Claude يفتح تطبيقات ويتحكم في شاشتك ويتفاعل مع واجهات المستخدم على macOS. فعّل MCP server الـ computer-use عبر /mcp. محتاج اشتراك Pro أو Max وmacOS وجلسة تفاعلية. معاينة بحثية" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const ALL_TYPES: FeatureType[] = [
  "command", "config", "feature", "flag", "hook", "setting", "shortcut", "skill", "tool", "workflow",
];

const ALL_LEVELS: Level[] = ["beginner", "intermediate", "advanced"];

const ALL_CATEGORIES = Array.from(new Set(FEATURES.map((f) => f.category))).sort();

const TYPE_COLORS: Record<FeatureType, string> = {
  command:  "bg-accent/10 text-accent border-accent/20",
  config:   "bg-blue-500/10 text-blue-500 border-blue-500/20",
  feature:  "bg-purple-500/10 text-purple-500 border-purple-500/20",
  flag:     "bg-amber-500/10 text-amber-600 border-amber-500/20",
  hook:     "bg-red-500/10 text-red-500 border-red-500/20",
  setting:  "bg-teal-500/10 text-teal-500 border-teal-500/20",
  shortcut: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  skill:    "bg-green-500/10 text-green-600 border-green-500/20",
  tool:     "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  workflow: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const LEVEL_DOT: Record<Level, string> = {
  beginner: "bg-beginner",
  intermediate: "bg-intermediate",
  advanced: "bg-advanced",
};

/* ------------------------------------------------------------------ */
/*  i18n strings                                                        */
/* ------------------------------------------------------------------ */

const UI = {
  en: {
    searchPlaceholder: "Search features by name or description…",
    typeLabel: "Type",
    levelLabel: "Level",
    categoryLabel: "Category",
    allCategories: "All",
    clearAll: "Clear all",
    emptyTitle: "No features found",
    emptyBody: "Try adjusting your search or clearing the filters to see more results.",
    clearFilters: "Clear filters",
  },
  ar: {
    searchPlaceholder: "ابحث في الميزات بالاسم أو الوصف…",
    typeLabel: "النوع",
    levelLabel: "المستوى",
    categoryLabel: "الفئة",
    allCategories: "الكل",
    clearAll: "مسح الكل",
    emptyTitle: "لا توجد ميزات",
    emptyBody: "جرّب تعديل بحثك أو مسح التصفية لرؤية المزيد من النتائج.",
    clearFilters: "مسح التصفية",
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Client Component                                                    */
/* ------------------------------------------------------------------ */

interface CatalogClientProps {
  locale?: "en" | "ar";
}

export default function CatalogClient({ locale = "en" }: CatalogClientProps) {
  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<Set<FeatureType>>(new Set());
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const t = UI[locale];
  const isAr = locale === "ar";

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return FEATURES.filter((f) => {
      const desc = isAr ? f.descAr : f.description;
      const matchesQuery =
        !q ||
        f.name.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q);
      const matchesType = activeTypes.size === 0 || activeTypes.has(f.type);
      const matchesLevel = !activeLevel || f.level === activeLevel;
      const matchesCategory = !activeCategory || f.category === activeCategory;
      return matchesQuery && matchesType && matchesLevel && matchesCategory;
    });
  }, [query, activeTypes, activeLevel, activeCategory, isAr]);

  const toggleType = (t: FeatureType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const toggleLevel = (l: Level) =>
    setActiveLevel((prev) => (prev === l ? null : l));

  const toggleCategory = (c: string) =>
    setActiveCategory((prev) => (prev === c ? null : c));

  const clearAll = () => {
    setQuery("");
    setActiveTypes(new Set());
    setActiveLevel(null);
    setActiveCategory(null);
  };

  const hasFilters = query || activeTypes.size > 0 || activeLevel || activeCategory;

  return (
    <div className="pb-20" dir={isAr ? "rtl" : undefined}>
      {/* Search bar */}
      <Reveal className="mb-6">
        <div className="relative">
          <svg
            className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle ${isAr ? "right-4" : "left-4"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className={`w-full rounded-xl border border-border bg-card py-3.5 text-sm text-fg placeholder:text-fg-subtle shadow-[var(--shadow-sm)] transition focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20 ${isAr ? "pr-11 pl-4 text-right" : "pl-11 pr-4"}`}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className={`absolute top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg transition ${isAr ? "left-4" : "right-4"}`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </Reveal>

      {/* Type filter chips */}
      <Reveal delay={70} className="mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle mr-1">{t.typeLabel}</span>
          {ALL_TYPES.map((tp) => (
            <button
              key={tp}
              onClick={() => toggleType(tp)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                activeTypes.has(tp)
                  ? TYPE_COLORS[tp]
                  : "border-border bg-card text-fg-muted hover:border-accent/40 hover:text-fg"
              }`}
            >
              {tp}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Level filter chips */}
      <Reveal delay={140} className="mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle mr-1">{t.levelLabel}</span>
          {ALL_LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => toggleLevel(l)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                activeLevel === l
                  ? l === "beginner"
                    ? "border-beginner/40 bg-beginner/10 text-beginner"
                    : l === "intermediate"
                    ? "border-intermediate/40 bg-intermediate/10 text-intermediate"
                    : "border-advanced/40 bg-advanced/10 text-advanced"
                  : "border-border bg-card text-fg-muted hover:border-accent/40 hover:text-fg"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${LEVEL_DOT[l]}`} />
              {l}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Category filter chips */}
      <Reveal delay={210} className="mb-6">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle mr-1">{t.categoryLabel}</span>
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              !activeCategory
                ? "bg-accent/10 text-accent border-accent/20"
                : "border-border bg-card text-fg-muted hover:border-accent/40 hover:text-fg"
            }`}
          >
            {t.allCategories}
          </button>
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => toggleCategory(c)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                activeCategory === c
                  ? "bg-accent/10 text-accent border-accent/20"
                  : "border-border bg-card text-fg-muted hover:border-accent/40 hover:text-fg"
              }`}
            >
              {c}
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="ml-2 text-xs text-fg-subtle hover:text-fg underline transition"
            >
              {t.clearAll}
            </button>
          )}
        </div>
      </Reveal>

      {/* Results count */}
      <Reveal delay={280} className="mb-5">
        <p className={`font-mono text-sm text-fg-subtle ${isAr ? "text-right" : ""}`}>
          {isAr ? (
            <>
              <span className="font-semibold text-fg">{filtered.length}</span>
              {" "}من{" "}
              <span className="font-semibold text-fg">{FEATURES.length}</span>
              {" "}ميزة{hasFilters ? " تطابق التصفية" : ""}
            </>
          ) : (
            <>
              <span className="font-semibold text-fg">{filtered.length}</span>
              {" "}of {FEATURES.length} features
              {hasFilters && <span className="ml-2 text-fg-subtle">matching filters</span>}
            </>
          )}
        </p>
      </Reveal>

      {/* Empty state */}
      {filtered.length === 0 && (
        <Reveal>
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
            <svg
              className="mb-4 h-10 w-10 text-fg-subtle"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p className="text-lg font-semibold text-fg">{t.emptyTitle}</p>
            <p className="mt-2 text-sm text-fg-muted max-w-xs">
              {t.emptyBody}
            </p>
            <button
              onClick={clearAll}
              className="mt-6 rounded-lg border border-border bg-bg-subtle px-4 py-2 text-sm font-medium text-fg-muted transition hover:border-accent/40 hover:text-fg"
            >
              {t.clearFilters}
            </button>
          </div>
        </Reveal>
      )}

      {/* Results grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f, i) => (
            <Reveal key={`${f.name}-${i}`} delay={Math.min(i * 30, 420)}>
              <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-md)]">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-sm font-semibold text-fg leading-snug break-all">
                    {f.name}
                  </span>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${TYPE_COLORS[f.type]}`}
                  >
                    {f.type}
                  </span>
                </div>

                {/* Description */}
                <p className={`flex-1 text-xs leading-relaxed text-fg-muted ${isAr ? "text-right font-sans" : ""}`}>
                  {isAr ? f.descAr : f.description}
                </p>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <LevelBadge level={f.level} />
                  <span className="rounded bg-bg-subtle px-2 py-0.5 font-mono text-[10px] text-fg-subtle">
                    {f.category}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
