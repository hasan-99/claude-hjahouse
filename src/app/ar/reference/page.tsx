import { Container, PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { Callout, Kbd } from "@/components/content";
import Link from "next/link";
import { localize } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Data tables — Arabic descriptions, commands stay English             */
/* ------------------------------------------------------------------ */

interface Row {
  cmd: string;
  desc: string;
  example?: string;
}

const slashCommands: Row[] = [
  { cmd: "/help", desc: "اعرض الأوامر المتاحة ونصائح الاستخدام." },
  { cmd: "/clear", desc: "ابدأ محادثة جديدة من الصفر. تعليمات CLAUDE.md بتفضل شغّالة." },
  { cmd: "/compact", desc: "لخّص المحادثة عشان توفّر مساحة في الـ context. ممكن تحدد نقطة تركيز.", example: "/compact focus on the auth module" },
  { cmd: "/context", desc: "اعرض استخدام الـ context window مع تفصيل مرئي لتوزيع الـ tokens." },
  { cmd: "/diff", desc: "افتح عارض تفاعلي للتغييرات اللي لسه ما اتعملش لها commit." },
  { cmd: "/model", desc: "بدّل بين Sonnet و Opus و Haiku في نص الجلسة.", example: "/model opus" },
  { cmd: "/cost", desc: "اعرض استهلاك الـ tokens والتكلفة التقديرية للجلسة." },
  { cmd: "/status", desc: "اعرض الإصدار الحالي والـ model ومعلومات الحساب." },
  { cmd: "/cd", desc: "نقل الجلسة لمجلد عمل جديد من غير ما يتكسر الـ prompt cache في نص الجلسة.", example: "/cd ../api" },
  { cmd: "/doctor", desc: "شغّل فحص صحة على Claude Code عشان تتأكد كل حاجة شغّالة." },
  { cmd: "/init", desc: "امسح مشروعك وولّد ملف CLAUDE.md مبدئي." },
  { cmd: "/memory", desc: "اعرض وعدّل ملفات ذاكرة CLAUDE.md (عامة، مشروع، تلقائية)." },
  { cmd: "/review", desc: "راجع تغييرات الكود على الـ branch الحالي مع اقتراحات." },
  { cmd: "/permissions", desc: "اعرض وأدِر صلاحيات الأدوات. اضبطها في .claude/settings.json." },
  { cmd: "/config", desc: "افتح إعدادات Claude Code." },
  { cmd: "/login", desc: "بدّل حسابات Anthropic." },
  { cmd: "/branch", desc: "افرع المحادثة لـ branch موازي عشان تجرّب بدائل." },
  { cmd: "/rewind", desc: "ارجع لرسالة سابقة وألغِ تغييرات الملفات اللي بعدها." },
  { cmd: "/resume", desc: "استأنف جلسة محفوظة بالاسم أو الـ ID.", example: "/resume auth-refactor" },
  { cmd: "/rename", desc: "سمّي الجلسة الحالية عشان ترجع لها بسهولة بعدين." },
  { cmd: "/export", desc: "صدّر المحادثة لملف markdown.", example: "/export session-review.md" },
  { cmd: "/effort", desc: "اضبط عمق التفكير: low أو medium أو high أو xhigh أو max (جلسة فقط). /effort ultracode بيضيف orchestration workflow تلقائي فوق xhigh.", example: "/effort high" },
  { cmd: "/plan", desc: "ادخل وضع التخطيط — Claude بيبحث الأول وبعدين يعرض خطة للموافقة.", example: "/plan migrate from REST to GraphQL" },
  { cmd: "/btw", desc: "اسأل سؤال جانبي من غير ما يتضاف لسجل المحادثة.", example: "/btw what's the syntax for a TS generic constraint?" },
  { cmd: "/batch", desc: "وزّع الشغل على agents متوازيين في git worktrees معزولة.", example: "/batch add JSDoc to all exported functions" },
  { cmd: "/loop", desc: "شغّل مهمة على فترات متكررة خلال الجلسة.", example: "/loop 5m check if the build succeeded" },
  { cmd: "/schedule", desc: "أنشئ مهمة مجدولة على السحابة بتشتغل حتى وأنت offline.", example: '/schedule "run security audit every Monday at 9am"' },
  { cmd: "/workflows", desc: "اعرض وأدِر الـ dynamic workflows الشغّالة والمكتملة؛ افتح progress view لأي run، واضغط s عشان تحفظ script بتاع run كـ /command. ابدأ workflow بحط كلمة 'ultracode' في الـ prompt أو بـ /effort ultracode." },
  { cmd: "/deep-research", desc: "dynamic workflow مدمج بينشر web searches، يتحقق من المصادر مع بعض، ويرجّع تقرير بـ citations مع شطب الـ claims الضعيفة. محتاج الـ WebSearch tool.", example: "/deep-research what changed in the Node.js permission model between v20 and v22?" },
  { cmd: "/debug", desc: "فعّل الوضع المفصّل عشان تشوف الـ tool calls وخطوات التفكير. أو Ctrl+O." },
  { cmd: "/code-review", desc: "راجع الـ diff الحالي للـ correctness bugs. بيقبل effort level (low/medium/high/xhigh/max/ultra) و--comment لنشر inline comments على الـ GitHub PR الحالي.", example: "/code-review high --comment" },
  { cmd: "/code-review ultra", desc: "مراجعة عميقة متعددة الـ agents للكود في الـ cloud باستخدام تحليل ونقد بالتوازي. /ultrareview هو alias ليه.", example: "/code-review ultra 128" },
  { cmd: "/simplify", desc: "مراجعة بتركيز على الـ cleanup بس بتطبّق إصلاحات (reuse، simplification، efficiency، مستوى الـ abstraction) من غير ما تبحث عن bugs." },
  { cmd: "/security-review", desc: "مراجعة بتركيز أمني للتغييرات المعلّقة. Read-only — مبيعدّلش ملفات أبدًا." },
  { cmd: "/agents", desc: "اعرض أو أنشئ أو عدّل أو امسح تعريفات الـ subagents." },
  { cmd: "/mcp", desc: "اعرض اتصالات الـ MCP servers النشطة والأدوات المتاحة." },
  { cmd: "/plugin", desc: "أدِر الـ plugins — تثبيت أو عرض أو حذف أو إعادة تحميل.", example: "/plugin install pr-review" },
  { cmd: "/reload-plugins", desc: "أعِد تحميل كل ملفات الـ plugins أثناء التطوير." },
  { cmd: "/goal", desc: "حدد شرط إكمال تشتغل نحوه Claude عبر الـ turns. بيعرض الوقت المنقضي والـ turns والـ tokens لحظياً.", example: "/goal migrate all API endpoints from REST to GraphQL" },
  { cmd: "/recap", desc: "ولّد ملخص من سطر واحد للجلسة الحالية. كمان بيشتغل تلقائيًا لما ترجع للتيرمنال بعد ما تبعد." },
  { cmd: "/fewer-permission-prompts", desc: "امسح الـ transcripts الأخيرة عشان تلاقي أدوات read-only شائعة واقترح allowlist تقلل permission prompts." },
  { cmd: "/tui", desc: "بدّل بين الـ rendering الكلاسيكي والـ fullscreen الخالي من الـ flicker وسط المحادثة." },
  { cmd: "/focus", desc: "فعّل أو ألغِ وضع التركيز للإدخال بدون تشتيت." },
  { cmd: "/sandbox", desc: "فعّل العزل على مستوى نظام التشغيل للوصول للملفات والشبكة." },
  { cmd: "/usage-credits", desc: "اعرض وأدِر الـ usage credits على حسابك. الاسم اتغيّر من /extra-usage في v2.1.144؛ والاسم القديم لسه شغّال." },
];

const keyboardShortcuts: Row[] = [
  { cmd: "Shift+Tab", desc: "بدّل بين أوضاع الصلاحيات: default → plan → acceptEdits → auto." },
  { cmd: "Option+T / Alt+T", desc: "فعّل أو ألغِ التفكير الموسّع." },
  { cmd: "Ctrl+C", desc: "ألغِ العملية الحالية أو أوقف أمر شغّال." },
  { cmd: "Ctrl+D", desc: "اخرج من Claude Code في الـ terminal." },
  { cmd: "Ctrl+B", desc: "حوّل subagent شغّال للعمل في الخلفية." },
  { cmd: "Ctrl+O", desc: "فعّل أو ألغِ الوضع المفصّل (زي /debug)." },
  { cmd: "Ctrl+R", desc: "بحث عكسي في تاريخ الأوامر عبر كل المشاريع. اضغط Ctrl+S عشان تغيّر النطاق." },
  { cmd: "Ctrl+G", desc: "افتح الخطة الحالية في محرر خارجي." },
  { cmd: "Ctrl+K", desc: "افتح البحث في الموقع على claude.hjahouse.me." },
  { cmd: "Esc", desc: "ألغِ الحوار النشط أو الاقتراح الحالي." },
];

const cliFlags: Row[] = [
  { cmd: 'claude -p "prompt"', desc: "شغّل prompt لمرة واحدة بدون تفاعل. أساس تكامل الـ CI/CD.", example: 'echo "$DIFF" | claude -p "review these changes for security issues"' },
  { cmd: "--output-format json", desc: "رجّع output بصيغة JSON منظّمة. مفيد للـ parsing في الـ scripts والـ pipelines.", example: 'claude -p "analyze this" --output-format json' },
  { cmd: "--model <name>", desc: "غيّر الـ model الافتراضي لتشغيل واحد بس.", example: 'claude --model opus "redesign the database schema"' },
  { cmd: "--permission-mode <mode>", desc: "ابدأ في وضع صلاحيات معين (default أو acceptEdits أو plan أو auto أو dontAsk أو bypassPermissions).", example: 'claude -p "run tests" --permission-mode bypassPermissions' },
  { cmd: "--sandbox", desc: "فعّل العزل على مستوى نظام التشغيل للتحليل الآمن والمؤتمت." },
  { cmd: "--safe-mode", desc: "ابدأ بكل التخصيصات (CLAUDE.md والـ plugins والـ skills والـ hooks وMCP servers) متعطّلة للتشخيص. نفس تأثير CLAUDE_CODE_SAFE_MODE=1." },
  { cmd: "--max-turns <n>", desc: "حدد التنفيذ بعدد n من الـ turns. مفيد لتحديد وقت التشغيل المؤتمت." },
  { cmd: "--no-session-persistence", desc: "ما تحفظش بيانات الجلسة. مناسب لمهام الأتمتة المؤقتة." },
  { cmd: "--resume", desc: "استأنف آخر جلسة Claude Code." },
  { cmd: "--continue", desc: "كمّل workflow متوقف من الـ repo الحالي." },
  { cmd: "--agent <name>", desc: "ابدأ جلسة مع subagent محدد.", example: "claude --agent security-reviewer" },
  { cmd: "--plugin-dir <path>", desc: "حمّل plugin لجلسة واحدة بس (للتجربة).", example: "claude --plugin-dir ./my-plugin" },
  { cmd: "--bare", desc: "output نظيف للاستخدام البرمجي. بدون تنسيق أو زخارف." },
  { cmd: "--worktree", desc: "شغّل في git worktree معزول للشغل التجريبي." },
  { cmd: "--dangerously-skip-permissions", desc: "تخطَّ كل permission prompts. يساوي --permission-mode bypassPermissions." },
  { cmd: "claude project purge [path]", desc: "احذف كل بيانات Claude Code لمشروع معين. بيدعم --dry-run و--all و-y و-i.", example: "claude project purge --dry-run" },
  { cmd: "--plugin-url <url>", desc: "حمّل plugin كأرشيف .zip من URL للجلسة الحالية. يتكرر لأكتر من plugin.", example: "claude --plugin-url https://example.com/my-plugin.zip" },
  { cmd: "claude agents", desc: "افتح عرض الـ agents — روستر لكل الجلسات مع الحالة وآخر نشاط وحالة التشغيل." },
  { cmd: "claude agents --json", desc: "اطبع روستر الجلسات كـ JSON array للسكربتات.", example: "claude agents --json | jq '.[] | select(.status == \"waiting\")'" },
  { cmd: "claude plugin details <name>", desc: "اعرض مخزون مكونات الـ plugin والتكلفة التقديرية بالـ tokens لكل جلسة.", example: "claude plugin details pr-review" },
  { cmd: "claude plugin prune", desc: "احذف dependencies الـ plugins المثبّتة تلقائيًا اللي ما بقاش محتاجها أي plugin.", example: "claude plugin uninstall pr-review --prune" },
  { cmd: "claude plugin enable <name>", desc: "فعّل plugin معطّل من غير ما تعيد تثبيته. بياخد --scope user|project|local.", example: "claude plugin enable formatter --scope project" },
  { cmd: "claude plugin disable <name>", desc: "وقّف plugin مثبّت من غير ما تشيله.", example: "claude plugin disable formatter --scope project" },
  { cmd: "--add-dir <path>", desc: "وسّع الـ working directories بصلاحية قراءة/تعديل للجلسة دي. متكرر.", example: "claude --add-dir ../shared-types" },
  { cmd: "--mcp-config <file>", desc: "حمّل MCP servers من ملف JSON واحد أو أكتر. مع --strict-mcp-config بيتجاهل المصادر التانية.", example: "claude --strict-mcp-config --mcp-config ./repro.json" },
  { cmd: "--channels <plugin>", desc: "فعّل plugins القنوات اللي بتبعت أحداث (رسائل شات، webhooks) للجلسة الشغّالة.", example: "claude --channels plugin:telegram@claude-plugins-official" },
  { cmd: "claude auth login", desc: "تحقق بـ OAuth. في البيئات بدون واجهة (WSL2، SSH)، الصق الـ code يدويًا." },
];

const configFiles: Row[] = [
  { cmd: "CLAUDE.md", desc: "تعليمات على مستوى المشروع، conventions، وملاحظات سير العمل. بتتعمل لها commit وبتتشارك مع الفريق." },
  { cmd: "CLAUDE.local.md", desc: "تعديلات شخصية على CLAUDE.md. بتتجاهل في git ومش بتتشارك." },
  { cmd: ".claude/settings.json", desc: "إعدادات المشروع: الصلاحيات والـ hooks والـ MCP servers. بتتعمل لها commit.", example: '{ "permissions": { "allow": ["Bash(npm run test)"], "deny": ["Bash(rm -rf /)"] } }' },
  { cmd: ".claude/settings.local.json", desc: "إعدادات مشروع شخصية. بتتجاهل في git وبتعمل override لـ .claude/settings.json." },
  { cmd: "~/.claude/CLAUDE.md", desc: "تعليمات المستخدم العامة اللي بتتطبق على كل المشاريع." },
  { cmd: "~/.claude/settings.json", desc: "إعدادات المستخدم العامة اللي بتتطبق على كل المشاريع." },
  { cmd: ".claude/skills/", desc: "skills خاصة بالمشروع (ملفات SKILL.md). بتتعمل لها commit." },
  { cmd: ".claude/agents/", desc: "تعريفات subagents خاصة بالمشروع. بتتعمل لها commit." },
  { cmd: ".claude/rules/*.md", desc: "قواعد مخصصة حسب المسار. استخدم frontmatter paths: لاستهداف ملفات محددة.", example: "---\npaths: src/api/**/*.ts\n---\nAlways validate input parameters." },
  { cmd: ".mcp.json", desc: "إعدادات MCP servers للمشروع. بتتعمل لها commit وبتتشارك مع الفريق." },
  { cmd: "~/.claude.json", desc: "إعدادات MCP servers الخاصة بالمستخدم/المحلية." },
];

const mcpSetup: Row[] = [
  { cmd: "claude mcp add <name> <uri>", desc: "سجّل MCP server جديد. بيدعم HTTP و stdio كـ transports.", example: "claude mcp add --transport stdio github -- npx @modelcontextprotocol/server-github" },
  { cmd: "claude mcp add --header", desc: "أضِف MCP server مع authentication headers.", example: 'claude mcp add --header "Authorization: Bearer $TOKEN" api https://api.example.com/mcp' },
  { cmd: "claude mcp list", desc: "اعرض كل الـ MCP servers المتصلة مع نوع الـ transport وحالة الاتصال." },
  { cmd: "claude mcp get <name>", desc: "اعرض تفاصيل MCP server معين." },
  { cmd: "claude mcp remove <name>", desc: "امسح إعدادات MCP server." },
  { cmd: "claude mcp add-from-claude-desktop", desc: "استورد إعدادات MCP servers من Claude Desktop." },
  { cmd: "/mcp", desc: "اعرض الاتصالات النشطة خلال الجلسة وشغّل OAuth flows." },
  { cmd: "mcp__server__tool", desc: "أدوات الـ MCP بتظهر بـ namespace. استخدمها بشكل طبيعي في المحادثة.", example: "Use the GitHub MCP to list open PRs older than 3 days." },
];

const hooks: Row[] = [
  { cmd: "PreToolUse", desc: "بيشتغل قبل ما أداة تتنفّذ. ممكن يمنع العملية (exit code 2).", example: "Validate Bash commands before execution, block dangerous patterns." },
  { cmd: "PostToolUse", desc: "بيشتغل بعد ما أداة تخلّص. استخدمه للتنسيق أو الـ linting أو الـ logging.", example: "Auto-format files after Edit/Write with prettier." },
  { cmd: "UserPromptSubmit", desc: "بيعترض مدخلات المستخدم قبل ما Claude يعالجها." },
  { cmd: "Stop", desc: "بيشتغل لما Claude يخلّص الرد. تحقّق من معايير الاكتمال.", example: "Verify all tests pass before marking a task complete." },
  { cmd: "SubagentStart / SubagentStop", desc: "تتبّع دورة حياة الـ subagent للتنسيق والـ logging." },
  { cmd: "Hook types", desc: "command (shell)، prompt (تقييم LLM)، agent (subagent)، http (webhook)." },
  { cmd: "Hook matchers", desc: "حدد أي أدوات تفعّل الـ hooks: اسم محدد أو regex أو * للكل.", example: 'matcher: "Edit|Write" — only trigger on file modifications.' },
  { cmd: "Hook args (exec form)", desc: "حدد args كـ array لتشغيل بدون shell. احذفها للـ shell tokenization.", example: '"command": "node", "args": ["--check", "file.js"]' },
  { cmd: "Skill-level hooks", desc: "عرّف hooks في frontmatter ملف SKILL.md. نطاقها محدود بالـ skill دي بس." },
  { cmd: "Stop / SubagentStop input fields", desc: "input الـ hook بيتضمن background_tasks (bash/subagents شغّالة) و session_crons (مهام مجدولة في الطابور).", example: "if data['background_tasks'] or data['session_crons']: print('{\"decision\":\"block\"}')" },
];

const permissions: Row[] = [
  { cmd: "default", desc: "اسأل قبل عمليات الكتابة والتعديل والـ Bash. القراءة والـ Glob والـ Grep مسموحين دايمًا." },
  { cmd: "plan", desc: "بحث وعرض خطط بس. مفيش تعديل ملفات لحد ما توافق." },
  { cmd: "acceptEdits", desc: "اسمح بتعديل الملفات من غير ما تسأل. لسه بتسأل على أوامر Bash." },
  { cmd: "auto", desc: "اسمح بكل العمليات من غير ما تسأل. استخدمه في بيئات موثوقة." },
  { cmd: "bypassPermissions", desc: "تخطَّ كل فحوصات الأمان. بس لـ pipelines الـ CI/CD المؤتمتة بالكامل." },
  { cmd: "Allow patterns", desc: "وافق مسبقًا على أدوات محددة في .claude/settings.json.", example: '"allow": ["Bash(npm run test)", "Bash(git *)", "Read", "Edit"]' },
  { cmd: "Deny patterns", desc: "امنع عمليات خطيرة بغض النظر عن وضع الصلاحيات.", example: '"deny": ["Bash(git push --force*)", "Bash(rm -rf /)"]' },
];

const subagents: Row[] = [
  { cmd: '@"agent-name"', desc: "استدعِ agent معين inline خلال المحادثة.", example: '@"security-reviewer" audit the auth module' },
  { cmd: "claude --agent <name>", desc: "ابدأ جلسة كاملة مع agent محدد من الـ CLI." },
  { cmd: ".claude/agents/*.md", desc: "عرّف agents خاصة بالمشروع مع frontmatter للأدوات والـ model ومستوى الجهد." },
  { cmd: "Built-in agents", desc: "general-purpose، Explore (Haiku، للقراءة فقط)، Plan (بحث الأول)." },
  { cmd: "isolation: worktree", desc: "شغّل الـ agent في git worktree معزول للتجريب الآمن." },
  { cmd: "background: true", desc: "شغّل الـ agent في الخلفية. استخدم Ctrl+B لتحويل agent شغّال للخلفية." },
];

const plugins: Row[] = [
  { cmd: "/plugin install <name>", desc: "ثبّت plugin من الـ marketplace الرسمي.", example: "/plugin install pr-review" },
  { cmd: "/plugin install github:user/repo", desc: "ثبّت plugin مباشرة من GitHub repo." },
  { cmd: "/plugin list", desc: "اعرض الـ plugins المثبّتة مع الـ skills والـ agents والـ hooks بتاعتها." },
  { cmd: "/reload-plugins", desc: "أعِد تحميل ملفات الـ plugins أثناء التطوير." },
  { cmd: "claude --plugin-dir ./path", desc: "حمّل plugin لجلسة واحدة بس (للتجربة)." },
  { cmd: ".claude-plugin/plugin.json", desc: "ملف manifest الـ plugin المطلوب. بيعلن الاسم والإصدار والمؤلف والـ userConfig." },
  { cmd: "plugin-name:command", desc: "أوامر الـ plugins بتكون namespaced عشان ما يحصلش تعارض.", example: "/pr-review:check-security" },
];

const envVars: Row[] = [
  { cmd: "CLAUDE_EFFORT", desc: "مستوى الجهد الحالي (low/medium/high/xhigh/max). متاح في Bash subprocesses والـ hooks." },
  { cmd: "CLAUDE_CODE_SESSION_ID", desc: "معرّف الجلسة الفريد. متاح في Bash subprocesses والـ hooks للتتبع والربط." },
  { cmd: "CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN", desc: "حدّد القيمة 1 عشان تبقى المحادثة في scrollback الـ terminal بدل الـ fullscreen." },
  { cmd: "CLAUDE_CODE_FORCE_SYNC_OUTPUT", desc: "حدّد القيمة 1 لإجبار synchronized output rendering على terminals الـ auto-detection بتفشل فيها." },
  { cmd: "CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE", desc: "حدّد القيمة 1 لتفعيل التحديثات التلقائية في الخلفية لتثبيتات Homebrew/WinGet." },
  { cmd: "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY", desc: "حدّد القيمة 1 عشان تملّي /model picker من endpoint الـ /v1/models بتاع الـ LLM gateway." },
  { cmd: "CLAUDE_CODE_HIDE_CWD", desc: "حدّد القيمة 1 عشان تخبّي الـ working directory من startup banner." },
  { cmd: "CLAUDE_CODE_SAFE_MODE", desc: "حدّد القيمة 1 (أو مرّر --safe-mode) عشان تبدأ بكل التخصيصات معطّلة للتشخيص." },
  { cmd: "CLAUDE_CODE_DISABLE_BUNDLED_SKILLS", desc: "حدّد القيمة 1 عشان تخبّي الـ bundled skills والـ workflows والأوامر المدمجة من الـ model." },
  { cmd: "DISABLE_UPDATES", desc: "حدّد القيمة 1 عشان تحجب كل مسارات التحديث بما فيها claude update اليدوي." },
  { cmd: "CLAUDE_CODE_USE_POWERSHELL_TOOL", desc: "حدّد القيمة 1 لتفعيل الـ PowerShell tool على Linux/macOS/WSL (محتاج pwsh 7+). على Windows حدّد 0 للخروج من الـ rollout." },
  { cmd: "CLAUDE_CODE_DISABLE_WORKFLOWS", desc: "حدّد القيمة 1 لتعطيل الـ dynamic workflows. بيتقرأ عند بدء التشغيل. كمان ممكن تضبطه في /config." },
];

const configOptions: Row[] = [
  { cmd: "worktree.baseRef", desc: "بيتحكم في تفريع الـ worktree: 'fresh' (الافتراضي، من remote) أو 'head' (من HEAD المحلي)." },
  { cmd: "sandbox.bwrapPath / sandbox.socatPath", desc: "للإدارة بس (Linux/WSL2). مسارات مطلقة لـ bubblewrap وsocat للـ sandbox." },
  { cmd: "parentSettingsBehavior", desc: "إعداد admin. بيتحكم في دمج SDK/IDE parent settings: 'first-wins' (الافتراضي) أو 'merge'." },
  { cmd: "cleanupPeriodDays", desc: "عدد الأيام قبل حذف ملفات الجلسة والـ worktrees اليتيمة تلقائيًا (الافتراضي: 30)." },
  { cmd: "prUrlTemplate", desc: "نموذج URL مخصص لـ badge الـ PR في الـ footer. بيدعم {owner} و{repo} و{number} كـ placeholders." },
  { cmd: "disableBundledSkills", desc: "حدّد true عشان تخبّي الـ bundled skills والـ workflows والأوامر المدمجة من الـ model." },
  { cmd: "enforceAvailableModels", desc: "إعداد managed (v2.1.175). لما يتفعّل، allowlist الـ availableModels بيقيّد الـ Default model كمان مش بس الـ alternate models." },
  { cmd: "footerLinksRegexes", desc: "إعدادات (v2.1.176) لـ regex-matched link badges في صف الـ footer، قابلة للضبط عبر إعدادات المستخدم أو المُدارة." },
];

const workflows: Row[] = [
  { cmd: "/effort high → /plan → approve → implement", desc: "شغل عميق: اضبط تفكير عالي، خطّط الأول، وبعدين نفّذ." },
  { cmd: "/diff → /cost → /export → /compact", desc: "نهاية الجلسة: راجع التغييرات، شيّك على التكلفة، صدّر، وبعدين compact." },
  { cmd: "/batch <instruction>", desc: "تعديلات كبيرة: وزّع الشغل على agents متوازيين في worktrees معزولة." },
  { cmd: "/loop 5m <check>", desc: "مراقبة: تابع حالة الـ build أو الأخطاء أو صحة الـ deploy على فترات." },
  { cmd: "/branch → experiment → /resume", desc: "استكشاف: افرع المحادثة، جرّب طريقة، وارجع لو ما نفعتش." },
  { cmd: 'echo $DIFF | claude -p "review" --output-format json', desc: "CI/CD: مرّر الـ diffs لـ Claude لمراجعة كود مؤتمتة مع output بصيغة JSON." },
  { cmd: "/init → edit CLAUDE.md → commit", desc: "إعداد المشروع: ولّد التعليمات، خصّصها، وشاركها مع الفريق." },
];

/* ------------------------------------------------------------------ */
/* Section badge labels                                                 */
/* ------------------------------------------------------------------ */
const sectionBadges: Record<string, string> = {
  "أوامر الـ Slash Commands": "/",
  "اختصارات الكيبورد": "Keys",
  "خيارات الـ CLI": "CLI",
  "ملفات الإعدادات": "Config",
  "إعداد الـ MCP": "MCP",
  "الـ Hooks": "Hooks",
  "الصلاحيات": "Access",
  "الـ Subagents": "Agent",
  "الـ Plugins": "Plug",
  "متغيرات البيئة": "Env",
  "خيارات الإعداد": "Config",
  "سير العمل الشائع": "Flow",
};

/* ------------------------------------------------------------------ */
/* Reusable ref-table row component                                     */
/* ------------------------------------------------------------------ */
function RefRow({ cmd, desc, example }: Row) {
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
/* Page-internal nav sections                                            */
/* ------------------------------------------------------------------ */
const sections = [
  { id: "slash-commands", label: "أوامر الـ Slash" },
  { id: "keyboard-shortcuts", label: "اختصارات الكيبورد" },
  { id: "cli-flags", label: "خيارات الـ CLI" },
  { id: "configuration-files", label: "ملفات الإعدادات" },
  { id: "mcp-setup", label: "إعداد الـ MCP" },
  { id: "hooks", label: "الـ Hooks" },
  { id: "permissions", label: "الصلاحيات" },
  { id: "subagents", label: "الـ Subagents" },
  { id: "plugins", label: "الـ Plugins" },
  { id: "env-vars", label: "متغيرات البيئة" },
  { id: "config-options", label: "خيارات الإعداد" },
  { id: "common-workflows", label: "سير العمل" },
];

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function ArReferencePage() {
  return (
    <main id="main-content" className="pb-24">
      <Container>
        <PageHeader
          eyebrow="مرجع سريع"
          title="ورقة مرجعية"
          lede="احتفظ بأوامر Claude Code والاختصارات والملفات وتذكيرات سير العمل الأكثر استخدامًا في مكان واحد قابل للطباعة."
        />

        {/* Intro callout with link to catalog */}
        <Reveal delay={70}>
          <Callout tone="info">
            محتاج القائمة الكاملة القابلة للبحث؟{" "}
            <Link
              href={localize("/catalog", "ar")}
              className="text-accent underline hover:text-accent/80 transition-colors"
            >
              افتح دليل الميزات
            </Link>
            .
          </Callout>
        </Reveal>

        {/* Page-internal nav */}
        <Reveal delay={140}>
          <nav
            aria-label="انتقل إلى القسم"
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
          <Section id="slash-commands" title="أوامر الـ Slash Commands" delay={0}>
            {slashCommands.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="keyboard-shortcuts" title="اختصارات الكيبورد" delay={70}>
            {keyboardShortcuts.map((row) => (
              <div
                key={row.cmd}
                className="grid grid-cols-1 gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4"
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  {row.cmd.split(" / ").map((part, pi) => (
                    <span key={pi} className="inline-flex items-center gap-1">
                      {pi > 0 && <span className="text-fg-faint text-xs">/</span>}
                      {part.split("+").map((k, ki, arr) => (
                        <span key={ki} className="inline-flex items-center gap-1">
                          <Kbd>{k.trim()}</Kbd>
                          {ki < arr.length - 1 && (
                            <span className="text-fg-subtle text-xs">+</span>
                          )}
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-fg-muted leading-relaxed">{row.desc}</p>
              </div>
            ))}
          </Section>

          <Section id="cli-flags" title="خيارات الـ CLI" delay={140}>
            {cliFlags.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="configuration-files" title="ملفات الإعدادات" delay={210}>
            {configFiles.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="mcp-setup" title="إعداد الـ MCP" delay={280}>
            {mcpSetup.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="hooks" title="الـ Hooks" delay={0}>
            {hooks.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="permissions" title="الصلاحيات" delay={70}>
            {permissions.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="subagents" title="الـ Subagents" delay={140}>
            {subagents.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="plugins" title="الـ Plugins" delay={210}>
            {plugins.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="env-vars" title="متغيرات البيئة" delay={0}>
            {envVars.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="config-options" title="خيارات الإعداد" delay={70}>
            {configOptions.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>

          <Section id="common-workflows" title="سير العمل الشائع" delay={140}>
            {workflows.map((row) => (
              <RefRow key={row.cmd} {...row} />
            ))}
          </Section>
        </div>

        {/* Bottom tip */}
        <Reveal delay={70} className="mt-14">
          <Callout tone="tip" title="قابل للطباعة">
            هذه الصفحة مصمّمة للطباعة. استخدم خاصية الطباعة في متصفحك (<Kbd>Ctrl P</Kbd> / <Kbd>Cmd P</Kbd>) للحصول على ورقة مرجعية نظيفة بعمود واحد.
          </Callout>
        </Reveal>
      </Container>
    </main>
  );
}
