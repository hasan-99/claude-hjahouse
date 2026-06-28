import { Container, PageHeader } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { Callout } from "@/components/content";

export const metadata = {
  title: "سجل التغييرات",
  description: "ما تم شحنه وإصلاحه على منصة تعلّم Claude Code.",
};

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type Tag = "تم التحسين" | "تم الإصلاح" | "تم الإطلاق" | "العربية";

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

/* ------------------------------------------------------------------ */
/*  Tag styles                                                          */
/* ------------------------------------------------------------------ */

const TAG_COLORS: Record<Tag, string> = {
  "تم الإطلاق": "bg-beginner/15 text-beginner border border-beginner/30",
  "تم التحسين": "bg-accent-soft text-accent border border-accent/30",
  "تم الإصلاح": "bg-intermediate/15 text-intermediate border border-intermediate/30",
  "العربية": "bg-bg-muted text-fg-muted border border-border",
};

/* ------------------------------------------------------------------ */
/*  Data — faithful Arabic translation of the changelog entries         */
/* ------------------------------------------------------------------ */

const ENTRIES: Entry[] = [
  {
    version: "v1.24.12",
    date: "٢٨ يونيو ٢٠٢٦",
    title:
      "دمج خمس audit PRs عبر memory وmcp وplugins وsubagents وworkflows (يتجاوز #314–#318)",
    summary:
      "مرّ هذا الإصدار على خمس audit PRs أوتوماتيكية في docs الـ Claude Code الرسمية، وشحن الخمس نتائج المؤكَّدة كتغيير واحد مدمج، إنجليزي وعربي.",
    items: [
      {
        tag: "تم التحسين",
        heading: "memory: توضيح تفعيل الـ path-scoped rules وإضافة قسم 'كتابة تعليمات فعّالة'",
        body: "الـ path-scoped rules في .claude/rules/ تتفعّل عندما يقرأ Claude ملفات مطابقة للـ pattern، لا مع كل استخدام للأداة؛ والـ rules التي لا تحتوي حقل paths تتحمّل عند بدء التشغيل بنفس أولوية .claude/CLAUDE.md؛ والـ circular symlinks تُكتشف وتُعالج بأمان. أُضيف قسم جديد 'كتابة تعليمات فعّالة' يغطّي الـ context-window visualization واستهداف أقل من 200 سطر لكل CLAUDE.md.",
      },
      {
        tag: "تم التحسين",
        heading: "mcp وplugins وsubagents وworkflows: توثيق أربع تفاصيل مؤكَّدة من الـ docs",
        body: "الـ Channels تبدأ بحالة الـ research preview والحد الأدنى v2.1.80 (mcp)؛ والـ plugin ذو الـ skill الواحد يمكنه وضع SKILL.md في root الـ plugin واستخدام حقل name في الـ frontmatter اسمًا للاستدعاء (plugins)؛ ووكيلَا Explore وPlan المدمجان يتخطيان CLAUDE.md والـ git status بينما تحمّل سائر الـ subagents كليهما (subagents)؛ واستئناف الـ dynamic workflow يعمل فقط داخل نفس جلسة Claude Code، ويبدأ من جديد بعد الخروج (workflows).",
      },
      {
        tag: "تم الإصلاح",
        heading: "memory: استرجاع علامة الـ terminal الموجّهة المحذوفة من audit PR #315",
        body: "الـ PR الأوتوماتيكي #315 استبدل علامة <!-- terminal: guided --> في موديول الـ memory الإنجليزي بفقرته الجديدة، مما كان سيكسر خطوة الـ terminal الموجّهة ويُخرج الإنجليزي عن التوافق مع العربي (الذي احتفظ بالعلامة). العلامة استُعيدت والفقرة الجديدة وُضعت قبلها، مطابِقةً للهيكل العربي.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي عبر الخمس تحديثات للموديولات",
        body: "موديولات الـ memory وmcp وplugins وsubagents وworkflows العربية تعكس كل تغيير إنجليزي — سلوك الـ path-scoped rules وقسم التعليمات الفعّالة، وإعادة صياغة الـ Channels، وملاحظة SKILL.md للـ skill الواحد، وملاحظة تخطّي Explore/Plan، وتوضيح استئناف الـ workflow.",
      },
    ],
  },
  {
    version: "v1.24.11",
    date: "٢٧ يونيو ٢٠٢٦",
    title:
      "التفرقة بين timeout بدء تشغيل الـ MCP وtimeout تنفيذ الأدوات (يتجاوز audit PR #312)",
    summary:
      "كان الموديول يغطّي timeout بدء التشغيل فقط ولا يذكر timeout تنفيذ الأدوات المنفصل. هذا التمييز موجود الآن في موديول الـ mcp، إنجليزي وعربي.",
    items: [
      {
        tag: "تم التحسين",
        heading: "mcp: التفرقة بين timeout بدء تشغيل الـ server وtimeout تنفيذ الأدوات على مستوى كل server",
        body: "MCP_TIMEOUT يحدد timeout بدء تشغيل/اتصال الـ server عند الإطلاق. تنفيذ الأدوات له حد منفصل: حقل timeout بالميلي ثانية في إدخال الـ server في .mcp.json (مثلًا \"timeout\": 600000 لعشر دقائق) يحدد أقصى مدة لأي tool call واحد، ويتجاوز MCP_TOOL_TIMEOUT لهذا الـ server فقط، وهو حد زمني صارم لا يمتد بإشعارات التقدّم، ويتجاهل القيم الأقل من 1000.",
      },
      {
        tag: "تم الإصلاح",
        heading: "mcp: رفض إعادة صياغة MCP_TIMEOUT غير الدقيقة من audit PR #312",
        body: "أراد audit PR #312 إعادة تسمية MCP_TIMEOUT كـ 'timeout بدء تشغيل خاص بكل server، لا timeout عام'. الـ docs تسمّيه 'MCP server startup timeout' — متغير بيئة وقت بدء التشغيل، لا إعدادًا على مستوى كل server — فالجملة المقترحة الركيكة حُذفت لصالح التمييز الدقيق بين timeout بدء التشغيل وtimeout تنفيذ الأدوات.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي لتمييز timeout الـ MCP",
        body: "موديول الـ mcp العربي يعكس التمييز بين timeout بدء التشغيل (MCP_TIMEOUT) وtimeout تنفيذ الأدوات (حقل timeout على مستوى كل server / MCP_TOOL_TIMEOUT)، مطابقًا للتغيير الإنجليزي.",
      },
    ],
  },
  {
    version: "v1.24.10",
    date: "٢٦ يونيو ٢٠٢٦",
    title:
      "توثيق claude plugin prune بدقة، ورفض إزالة auto:N (دمج audit PRs #308–#310)",
    summary:
      "مراجعة ثلاث audit PRs أوتوماتيكية مقارنةً بـ docs الـ Claude Code الرسمية. شُحن فقط ما صمد أمام التحقق.",
    items: [
      {
        tag: "تم التحسين",
        heading: "plugins: توثيق claude plugin prune بدقة + inventory الـ plugin details (PR #309)",
        body: "claude plugin prune (جديد في v2.1.121، والاسم البديل autoremove) يزيل الـ dependencies التي ثُبّتت تلقائيًا ولا يحتاجها أي plugin آخر مثبّت — الـ plugins التي ثبّتها بنفسك لا تُمسّ، و'uninstall <plugin> --prune' يقوم بالأمرين في خطوة واحدة. claude plugin details يعرض الآن inventory المكونات مصنَّفةً كـ Skills وAgents وHooks وMCP servers وLSP servers مع تقدير عدد الـ tokens لكل جلسة. أُضيف لموديول الـ plugins والـ reference cheatsheet وفهرس الميزات.",
      },
      {
        tag: "تم الإصلاح",
        heading: "mcp: الإبقاء على ENABLE_TOOL_SEARCH=auto:N (رفض audit PR #308)",
        body: "audit PR أزال متغير auto:N من ENABLE_TOOL_SEARCH. مرجع الـ MCP يوثّقه حرفيًا — 'auto:N: Threshold mode with a custom percentage, where N is 0-100' (مثلًا auto:5 لـ 5%) — فالمتغير يبقى. موديول وكويز الـ mcp تُركا كما هما.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي لتحديثات plugin prune / details",
        body: "موديول الـ plugins العربي يعكس وصف claude plugin prune المصحَّح وinventory الـ claude plugin details الموسَّع، مطابقًا للتغييرات الإنجليزية.",
      },
    ],
  },
  {
    version: "v1.24.9",
    date: "٢٥ يونيو ٢٠٢٦",
    title:
      "توضيح أن /code-review هو /simplify بعد إعادة التسمية، والإبقاء على Console في قائمة الحسابات (دمج audit PRs #304–#306)",
    summary:
      "ثلاث audit PRs أوتوماتيكية مراجعةً مقابل docs الـ Claude Code الرسمية. اثنتان طُبّقتا، وواحدة رُفضت كـ regression.",
    items: [
      {
        tag: "تم التحسين",
        heading: "slash-commands: /code-review هو /simplify بعد إعادة التسمية، لا أمر جديد (PR #306)",
        body: "عبارة '(جديد في v2.1.147)' كانت توحي بأن /code-review أمر جديد كليًا؛ الـ changelog يسجّل إعادة تسمية /simplify إلى /code-review في v2.1.147. الموديول والكويز يصفان الآن /code-review كـ bundled skill كان اسمه /simplify، إنجليزي وعربي.",
      },
      {
        tag: "تم الإصلاح",
        heading: "getting-started: الإبقاء على Console في قائمة متطلبات الحساب (تصحيح audit PR #304 المرفوض)",
        body: "audit PR حذف 'Console' من قائمة الحسابات المدعومة. docs التثبيت تقول حرفيًا 'Claude Code requires a Pro, Max, Team, Enterprise, or Console account' — فـ Console يبقى. اعتمدنا الصياغة الأوضح 'يتطلب … حسابًا' مع الإبقاء على الأنواع الخمسة جميعها.",
      },
      {
        tag: "تم الإصلاح",
        heading: "mcp: الإبقاء على 'claude mcp serve' / 'add-from-claude-desktop' ونسخة v2.1.121 للـ startup-retry (رفض audit PR #305)",
        body: "audit PR حذف أمرين موثّقَين وغيّر نسخة الـ startup-retry إلى v2.1.187. مرجع الـ MCP يوثّق 'claude mcp add-from-claude-desktop' و'claude mcp serve'، ويؤرّخ المحاولات التي تبلغ ثلاثًا عند بدء التشغيل في الأخطاء المؤقتة بـ v2.1.121 (v2.1.187 هي الـ idle timeout المنفصلة لمدة 5 دقائق للأدوات البعيدة). محتوى الـ mcp الأصلي كان صحيحًا وتُرك كما هو.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي لتحديثات /code-review وقائمة الحسابات",
        body: "موديول وكويز الـ slash-commands العربي يعكسان توضيح /code-review-اللي-كان-/simplify، وموديول الـ getting-started العربي يحتفظ بـ Console في قائمة الحسابات مع صياغة 'يتطلب'.",
      },
    ],
  },
  {
    version: "v1.24.8",
    date: "٢٤ يونيو ٢٠٢٦",
    title:
      "تصحيح اسم أمر /fewer-permission-prompts وترتيب أولوية الـ subagents (دمج audit PRs #300–#302)",
    summary:
      "أعاد v1.24.5 تسمية أمر الـ permission-prompts بالشكل المعكوس. الاسم الخاطئ رُجع عنه في كل مكان تسرّب إليه.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "slash-commands: الأمر اسمه /fewer-permission-prompts لا /less-permission-prompts (تصحيح v1.24.5)",
        body: "أعاد v1.24.5 التسمية بالعكس. الاسم الرسمي — وفق ملاحظات إصدار v2.1.105–v2.1.113 والـ skill الحيّة — هو /fewer-permission-prompts. رُجع عنه في موديولات slash-commands وskills، والـ reference cheatsheet، وفهرس الميزات (الـ id والاسم).",
      },
      {
        tag: "تم الإصلاح",
        heading: "subagents: الأولوية managed > CLI flag > project > user > plugin (PR #302)",
        body: "أولوية تعريف الـ subagents لم تعد تُدرج 'built-in' كطبقة أولوية. وفق docs الـ features-overview، الـ built-in subagents متاحة دائمًا وليست جزءًا من نظام أولوية تسمية الـ agents، الذي يعمل managed > CLI flag > project > user > plugin.",
      },
      {
        tag: "تم الإصلاح",
        heading: "workflows: إعادة تسمية ultracode تبقى v2.1.160 (رفض audit PR #300)",
        body: "اقترح audit PR نقل إعادة التسمية من v2.1.160 إلى v2.1.154 استنادًا للـ CHANGELOG.md على GitHub. docs الـ workflows الرسمية تقول 'Before v2.1.160 the literal trigger keyword was workflow' — فـ v2.1.160 هي نسخة إعادة التسمية الموثَّقة والمحتوى القائم تُرك كما هو.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي لتصحيح اسم الأمر وترتيب الأولوية",
        body: "موديولات slash-commands وskills وsubagents العربية، وفهرس الميزات العربي والـ reference cheatsheet، تعكس ترجيع /fewer-permission-prompts وتصحيح أولوية الـ subagents.",
      },
    ],
  },
  {
    version: "v1.24.7",
    date: "٢٣ يونيو ٢٠٢٦",
    title:
      "تصحيح الـ MCP tool search: هو مفعّل افتراضيًا — وauto هي فقط وضع عتبة الـ 10% (رفض audit PR #298)",
    summary:
      "حاول audit PR #298 إعادة كتابة موديول الـ MCP لادّعاء أن الـ tool search مقفول حتى تضبط ENABLE_TOOL_SEARCH=auto. المرجع الرسمي يقول العكس تمامًا: الـ tool search مفعّل افتراضيًا.",
    items: [
      {
        tag: "تم التحسين",
        heading: "mcp: توثيق جدول قيم ENABLE_TOOL_SEARCH الكامل",
        body: "موديول الـ MCP يوضّح الآن قيم الـ override من الـ docs: true تجبر الـ tool search دائمًا، وfalse تحمّل كل تعريف مقدّمًا في كل turn، وauto (أو auto:N) تفعّل الـ tool search فقط عندما تتجاوز تعريفات الأدوات 10% (أو N%) من الـ context window.",
      },
      {
        tag: "تم الإصلاح",
        heading: "mcp: الـ tool search مفعّل افتراضيًا — رفض audit PR #298",
        body: "ادّعى audit PR أن الـ tool search يعمل فقط بعد ضبط ENABLE_TOOL_SEARCH=auto. مرجع الـ tool search الرسمي يقول إن الـ tool search مفعّل افتراضيًا (التعريفات تتأجّل وتُكتشف عند الطلب)، ومقفول افتراضيًا فقط على Vertex AI أو proxies الـ ANTHROPIC_BASE_URL غير الـ first-party. المحتوى الأصلي كان صحيحًا؛ PR #298 كان regression وأُغلق.",
      },
      {
        tag: "تم الإصلاح",
        heading: "mcp quiz: إعادة صياغة q6 لنسب عتبة الـ 10% لوضع auto",
        body: "كان quiz q6 يصوّر عتبة الـ 10% كسلوك افتراضي تلقائي. وفق الـ docs، عتبة الـ 10% هي تحديدًا وضع ENABLE_TOOL_SEARCH=auto — وتحت الافتراضي (بدون ضبط)، الـ tool search مفعّل بالفعل بغض النظر عن الحجم. السؤال يسأل الآن عما يفعله auto عندما تتجاوز التعريفات 10%.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي لتصحيح الـ MCP tool search",
        body: "موديول الـ MCP العربي والـ quiz نالا نفس التصحيح: الـ tool search مفعّل افتراضيًا، جدول قيم ENABLE_TOOL_SEARCH الكامل، وq6 أُعيدت صياغتها حول وضع auto.",
      },
    ],
  },
  {
    version: "v1.24.6",
    date: "٢٢ يونيو ٢٠٢٦",
    title:
      "إضافة إرشاد عملي للذاكرة (issue #293)، تصحيح إصدار claude plugin tag، ورفض إزالة قيمة effort 'max' من الـ subagents",
    summary:
      "ثلاث PRs مفتوحة دُمجت في إصدار واحد: إرشاد عملي للذاكرة أُضيف، وإصدار plugin tag صُحّح، وقيمة max في الـ subagents أُبقيت.",
    items: [
      {
        tag: "تم التحسين",
        heading: "memory: إرشاد عملي لأي ذاكرة تستخدم (issue #293)",
        body: "قارئ أفاد بأن تسلسل الذاكرة كان مربكًا بدون سياق يوضّح أهميته. قسم تسلسل الذاكرة يحتوي الآن callout 'عمليًا': استخدم ذاكرة المشروع لما يحتاج زميلك فهمه عن الـ codebase (الإعداد، الاختبار، البنية)، وذاكرة المستخدم لطريقة عملك الشخصية، وCLAUDE.local.md للمدخلات التي تخصّك أنت فقط.",
      },
      {
        tag: "تم الإصلاح",
        heading: "plugins: claude plugin tag هو v2.1.118 لا v2.1.121",
        body: "موديول الـ plugins نسب claude plugin tag إلى v2.1.121. الـ changelog الرسمي يوضّح أن v2.1.118 هو الذي أضاف claude plugin tag (release git tags مع التحقق من الإصدار) وأن v2.1.121 أضاف أمر claude plugin prune المنفصل، فالملاحظة أصبحت v2.1.118.",
      },
      {
        tag: "تم الإصلاح",
        heading: "subagents: الـ effort تحتفظ بـ max (رفض audit PR #296)",
        body: "audit PR حذف max من قيم الـ effort في الـ subagents مدّعيًا أن الـ changelog حذفها في v2.1.72. مرجع الـ sub-agents الرسمي يسرد خيارات الـ effort حرفيًا كـ low وmedium وhigh وxhigh وmax — فـ max تبقى.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي للتغييرات الثلاثة",
        body: "موديول الـ memory العربي يحصل على callout 'عمليًا' ذاتها، وموديول الـ plugins العربي يحصل على تصحيح v2.1.118 لـ claude plugin tag، وموديول الـ subagents العربي يحتفظ بـ max في قيم الـ effort.",
      },
    ],
  },
  {
    version: "v1.24.5",
    date: "٢١ يونيو ٢٠٢٦",
    title:
      "إتمام إعادة تسمية /less-permission-prompts في الكاتالوج والـ cheatsheet؛ رفض PR المكرّر للـ skills-budget",
    summary:
      "دُمج تصحيح إعادة التسمية في slash-commands (PR #291) وسُدّت فجوات التماثل التي تركها PR في فهرس الميزات والـ reference cheatsheet.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "slash-commands: إعادة تسمية /less-permission-prompts أُكملت في كل مكان",
        body: "الأمر أصبح /less-permission-prompts في موديول slash-commands (PR #291) وفهرس الميزات والـ reference cheatsheet. الكاتالوج والـ cheatsheet كانا فاتا PR #291 ولا يزالان يعرضان الاسم القديم /fewer-permission-prompts، فأصبح بحث الأوامر يطابق التهجئة الرسمية. مُتحقَّق منه من الـ changelog (أُضيف في v2.1.112).",
      },
      {
        tag: "تم الإصلاح",
        heading: "skills: الميزانية تبقى 1% (رفض audit PR #290)",
        body: "كرّر PR #290 اقتراح PR #288 المرفوض سابقًا بتغيير ميزانية وصف الـ skill من 1% إلى 2%. docs الـ /en/skills الرسمية تقول 'The budget scales at 1% of the model's context window' وتُعطي 0.02 = 2% مثالًا فقط لرفع الميزانية عبر skillListingBudgetFraction، لا كقيمة افتراضية، فمحتوى الـ 1% الموجود صحيح وتُرك كما هو.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي لإعادة تسمية الأمر",
        body: "فهرس الميزات العربي والـ reference cheatsheet يستخدمان الآن /less-permission-prompts، مطابقَين للمحتوى الإنجليزي وموديول slash-commands.",
      },
    ],
  },
  {
    version: "v1.24.4",
    date: "١٩ يونيو ٢٠٢٦",
    title:
      "التحقق من الحقائق: الإبقاء على ميزانية الـ skills بنسبة 1% ونسخة إعادة تسمية ultracode v2.1.160؛ توثيق تغيير Agent Teams v2.1.178 في مكانه الصحيح",
    summary:
      "ثلاث audit PRs أوتوماتيكية حوكمت مقابل docs الـ Claude Code الرسمية. اثنتان رُفضتا كغير دقيقتين؛ تغيير Agent Teams v2.1.178 طُبّق على موديول الـ subagents.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "subagents: Agent Teams يعكس إزالة الأدوات في v2.1.178",
        body: "فقرة Agent Teams الموجودة تشير الآن إلى أن v2.1.178 أزال أداتَي TeamCreate وTeamDelete — مع تفعيل CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1، كل جلسة تحتوي على فريق واحد ضمني، فالـ teammates تُستدعى مباشرةً عبر معامل name في أداة Agent بدون خطوة إعداد وتنظيف يحدث تلقائيًا عند انتهاء الجلسة.",
      },
      {
        tag: "تم الإصلاح",
        heading: "skills: الميزانية تبقى 1% (رفض audit PR #288)",
        body: "موديول الـ skills والكويز يحتفظان بـ '1% من الـ context window' كميزانية وصف الـ skill الافتراضية. docs الـ skills الرسمية تقول 1% حرفيًا؛ قيمة 0.02 = 2% التي استشهد بها الـ audit هي مثال لرفع الميزانية عبر skillListingBudgetFraction، لا القيمة الافتراضية، وسطر الـ changelog المزعوم غير موجود.",
      },
      {
        tag: "تم الإصلاح",
        heading: "advanced-features: ultracode تبقى إعادة تسمية v2.1.160 (رفض audit PR #286)",
        body: "فقرة dynamic-workflow تحتفظ بصياغتها الدقيقة: كلمة trigger أُعيدت تسميتها من workflow إلى ultracode في v2.1.160. الـ changelog يقول 'Renamed the dynamic-workflow trigger keyword from workflow to ultracode'، فإعادة الصياغة المقترحة 'تغييران منفصلان في v2.1.178' كانت غير صحيحة ولم تُطبَّق.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي لتحديث Agent Teams",
        body: "موديول الـ subagents العربي يعكس تغيير Agent Teams في v2.1.178 (TeamCreate/TeamDelete محذوفتان، فريق ضمني واحد لكل جلسة، الاستدعاء عبر معامل name في أداة Agent، تنظيف تلقائي عند انتهاء الجلسة).",
      },
    ],
  },
  {
    version: "v1.24.3",
    date: "١٨ يونيو ٢٠٢٦",
    title:
      "التحقق من الحقائق: عدد الـ hooks هو 30 بالضبط، وحدود الحجب في Auto Mode (3 متتاليات / 20 إجمالية) موجودة الآن في الموديول",
    summary:
      "دمج اثنتَي audit PR (#284 hooks، #283 advanced-features) في إصدار واحد بعد التحقق من كليهما مقابل الـ docs الرسمية.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "hooks: العدد الدقيق 30 hook event",
        body: "كان موديول الـ hooks يقول إن Claude Code 'يدعم أكثر من 30 hook event'؛ الـ docs الرسمية تُعدّد 30 بالضبط، فالنص يقول الآن '30 hook event' للدقة.",
      },
      {
        tag: "تم الإصلاح",
        heading: "advanced-features: توثيق حدود الحجب في Auto Mode",
        body: "أُضيفت حدود الاحتياط في Auto Mode (3 حجبات متتالية أو 20 حجبًا إجماليًا توقف الـ auto mode وتستأنف الطلبات؛ غير قابلة للتهيئة) إلى فقرة تسلسل أولوية الـ classifier، مطابِقةً docs الـ permission-modes وجاعلةً quiz q2 القائم قابلًا للإجابة من الموديول.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي للتصحيحَين",
        body: "موديولا الـ hooks والـ advanced-features العربيان يعكسان كلا التغييرَين — '30 hook event' وجملة حدود الحجب في Auto Mode.",
      },
    ],
  },
  {
    version: "v1.24.2",
    date: "١٧ يونيو ٢٠٢٦",
    title:
      "التحقق من الحقائق: تصحيح إجابة كويز getting-started عن Console — Console يسجّل الدخول عبر المتصفح، لا 'مصادقة API key'",
    summary:
      "صُحّحت صياغة quiz q3 في موديول getting-started. Console هو وصول API مدفوع من رصيد مسبق الدفع بنفس تسجيل دخول المتصفح كخطط الاشتراك — لا مسار خاص بـ API key فقط.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "getting-started quiz: صياغة دقيقة عن Console",
        body: "Quiz q3 يسأل 'ما خطط الاشتراك التي تتضمن وصولًا لـ Claude Code؟'، فالإجابة الصحيحة تبقى خطط الاشتراك الأربع (Pro وMax وTeam وEnterprise) والتفسير يصف Anthropic Console بدقة كخيار بدون اشتراك — وصول API مدفوع من رصيد مسبق الدفع، بنفس تسجيل دخول المتصفح — بدلًا من الصياغة غير الدقيقة 'Console يستخدم مصادقة API key لا اشتراكًا'.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي لتصحيح إجابة Console",
        body: "quiz q3 في getting-started العربي يعكس الصياغة المصحَّحة: خطط الاشتراك الأربع تبقى الإجابة، وConsole يُوصف كخيار بدون اشتراك (وصول API مسبق الدفع، نفس تسجيل دخول المتصفح).",
      },
    ],
  },
  {
    version: "v1.24.1",
    date: "١٦ يونيو ٢٠٢٦",
    title:
      "التحقق من الحقائق: مستويات effort الـ xhigh والـ max لا تزالان موجودتَين — رفض audit PRs التي كانت ستحذفهما",
    summary:
      "ثماني audit PRs أوتوماتيكية حوكمت مقابل الـ docs الرسمية. أربع نتائج دقيقة دُمجت؛ ثلاث رُفضت لأنها كانت ستحذف مستويات xhigh وmax الصالحة.",
    items: [
      {
        tag: "تم التحسين",
        heading: "advanced-features وslash-commands وsubagents: أربع نتائج دقيقة دُمجت",
        body: "متغير بيئة MCP_TIMEOUT لـ startup timeout (#275)، الإعدادات المُدارة لها الأولوية القصوى ولا يمكن تجاوزها بمعاملات سطر الأوامر (#276)، الـ Bash المعزول يعمل على macOS وLinux وWSL2 لكن لا على Windows الأصلي (#273)، وCLAUDE_CODE_FORK_SUBAGENT=1 يجعل الـ subagents المتفرعة تَرِث المحادثة الكاملة وتُشغَّل كلها في الخلفية (#279) — جميعها تحقّق منها وطُبّقت.",
      },
      {
        tag: "تم الإصلاح",
        heading: "Skills quiz: إزالة قيمة ${CLAUDE_EFFORT} غير قابلة للتحقق",
        body: "كان quiz q6 يصف ${CLAUDE_EFFORT} بأنه يُحلّ إلى 'low أو medium أو high أو xhigh أو max أو ultra — القيمة المخزّنة لـ ultracode'. الـ docs لا تعرّف قيمة effort باسم 'ultra' لهذا المتغير، فالتفسير يسرد الآن المستويات المتحقَّق منها low/medium/high/xhigh/max.",
      },
      {
        tag: "تم الإصلاح",
        heading: "Reference cheat sheet: تصحيح وصف CLAUDE_EFFORT",
        body: "مدخل متغير البيئة CLAUDE_EFFORT لم يعد يدّعي قدرته على الحلّ إلى 'ultra لـ ultracode'، مطابقًا القائمة الدقيقة في فهرس الميزات: low/medium/high/xhigh/max.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي لتصحيح مستويات الـ effort",
        body: "Skills quiz q6 العربي يعكس قائمة ${CLAUDE_EFFORT} المصحَّحة (low/medium/high/xhigh/max).",
      },
    ],
  },
  {
    version: "v1.24.0",
    date: "١٤ يونيو ٢٠٢٦",
    title:
      "تغطية شاملة لـ /cd و--safe-mode وإعدادات model/footer/bundled-skills الجديدة",
    summary:
      "أضافت audit PRs عدة ميزات v2.1.169+ لنصوص الموديولات. هذا الإصدار يحمل تلك الميزات عبر بقية الأسطح حتى يلتقطها البحث والأدوات المرجعية.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "/cd في محاكي التيرمنال، الـ cheat sheet، والكاتالوج",
        body: "محاكي التيرمنال يحاكي الآن /cd <directory> (الانتقال في الجلسة دون كسر cache الـ prompt) ويُدرجه في /help؛ الـ reference cheat sheet وفهرس الميزات نالا كلاهما مدخلَ /cd.",
      },
      {
        tag: "تم الإطلاق",
        heading: "تغطية مرجعية لـ --safe-mode وCLAUDE_CODE_SAFE_MODE",
        body: "يوثّق الـ cheat sheet العلَم --safe-mode ومتغير البيئة CLAUDE_CODE_SAFE_MODE (البدء بتعطيل كل التخصيصات لأغراض استكشاف الأخطاء)، وفهرس الميزات يضيف مدخلَ --safe-mode.",
      },
      {
        tag: "تم الإطلاق",
        heading: "إعدادات bundled-skills وmodel/footer في الـ cheat sheet",
        body: "أُضيفت CLAUDE_CODE_DISABLE_BUNDLED_SKILLS / disableBundledSkills، وإعدادات enforceAvailableModels (v2.1.175) وfooterLinksRegexes (v2.1.176) المُدارة، إلى قسمَي env-vars وconfig-options في الـ reference cheat sheet.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي للتغطية الجديدة",
        body: "أوامر التيرمنال العربية، والـ cheat sheet (أوامر slash + علامات CLI)، وفهرس الميزات يعكسون إضافات /cd و--safe-mode.",
      },
    ],
  },
  {
    version: "v1.23.7",
    date: "١٣ يونيو ٢٠٢٦",
    title:
      "التحقق من الحقائق: إعادة اتصال MCP + متطلب إصدار channel، وإزالة سؤال MCP quiz مكرّر",
    summary:
      "تحقّق من تفاصيل مرونة اتصال MCP والـ channels مقابل الـ docs الرسمية، وإصلاح تكرار هيكلي في MCP quiz.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "إعادة اتصال MCP تشمل الآن خوادم SSE وإعادة المحاولات عند بدء التشغيل",
        body: "موديول الـ MCP يوضّح أن خوادم HTTP أو SSE تُعيد الاتصال في منتصف الجلسة بـ exponential backoff (حتى خمس محاولات)، وأنه منذ v2.1.121 يُعاد المحاولة في الاتصال الأولي عند بدء التشغيل حتى ثلاث مرات في الأخطاء المؤقتة كاستجابة 5xx أو connection refused أو timeout.",
      },
      {
        tag: "تم الإصلاح",
        heading: "الـ Channels تُشير إلى الحد الأدنى v2.1.80",
        body: "قسم الـ Channels يوضّح الآن أن إضافات channel للـ Telegram وDiscord وiMessage تتطلب Claude Code v2.1.80 أو أحدث، مطابقًا توثيق الـ channels الرسمي.",
      },
      {
        tag: "تم الإصلاح",
        heading: "حذف سؤال MCP quiz مكرّر",
        body: "كان MCP quiz يحتوي على سؤالَين متشابهَين جدًا كلاهما يختبر خيار alwaysLoad؛ السؤال الزائد حُذف وأُعيد ترقيم الأسئلة المتبقية إلى q1–q9.",
      },
      {
        tag: "تم الإصلاح",
        heading: "تصحيح مدخل Channels في فهرس الميزات",
        body: "وصف الكاتالوج للـ channels كـ 'Telegram وSlack ومنصات أخرى'؛ كلاهما يُدرجان الآن بصحة إضافات channel للـ Telegram وDiscord وiMessage. المدخل يشير إلى اشتراط research-preview / v2.1.80. Slack هي تكامل منفصل لا channel.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي لتصحيحات MCP",
        body: "موديول الـ MCP العربي يعكس تحديثات SSE/startup-retry وإصدار channel v2.1.80، وMCP quiz العربي يُرقَّم من جديد إلى q1–q9 مطابقًا، وفهرس الميزات العربي يصحّح مدخل الـ Channels.",
      },
    ],
  },
  {
    version: "v1.23.6",
    date: "١٢ يونيو ٢٠٢٦",
    title:
      "التحقق من الحقائق: ExitWorktree غير متاحة للـ subagents المعزولة، وworktree.baseRef يَفترض افتراضيًا 'fresh'",
    summary:
      "تصحيحان حقيقيان مُتحقَّق منهما مقابل مرجع الأدوات الرسمي ودليل الـ worktrees.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "تصحيح ادّعاء توفّر ExitWorktree للـ subagents المعزولة",
        body: "موديول الـ Subagents لم يعد يقول إن وكلاء isolation: worktree يمكنهم استخدام ExitWorktree للخروج المبكر من الـ worktree — مرجع الأدوات يوضّح أن ExitWorktree غير متاحة للـ subagents التي تعمل في مجلد عمل خاص بها. Claude يقفل الـ worktree أثناء تشغيل الوكيل حتى لا يتمكن التنظيف من إزالته، والـ worktrees المعزولة تتفرع من الفرع الافتراضي للمستودع ما لم يُضبط worktree.baseRef على head.",
      },
      {
        tag: "تم الإصلاح",
        heading: "تصحيح القيمة الافتراضية لـ worktree.baseRef في Advanced Features",
        body: "الموديول يُدرج الآن fresh (التفرع من الفرع الافتراضي عن بُعد للحصول على شجرة نظيفة) كقيمة افتراضية لـ worktree.baseRef، مع head كخيار اختياري للتفرع من الـ HEAD المحلي — مطابقًا الـ docs الرسمية وكويز الموديول والـ reference cheatsheet.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي لتصحيحَي الـ worktree",
        body: "صفحتا الـ Subagents والـ Advanced Features العربيتان تعكسان تصحيحَي ExitWorktree وbaseRef.",
      },
    ],
  },
  {
    version: "v1.23.5",
    date: "١١ يونيو ٢٠٢٦",
    title:
      "التحقق من الحقائق: حذف إعداد deniedPlugins غير الموجود من موديول الـ Plugins",
    summary:
      "كان موديول الـ Plugins يُدرج deniedPlugins كأحد إعدادات managed-policy. هذا الإعداد غير موجود في الـ docs الرسمية — الضوابط الحقيقية هي enabledPlugins وextraKnownMarketplaces وstrictKnownMarketplaces وblockedMarketplaces.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "إزالة إعداد managed-policy الوهمي deniedPlugins",
        body: "موديول الـ Plugins يُدرج الآن فقط إعدادات managed-policy الموجودة في الـ docs الرسمية — enabledPlugins وextraKnownMarketplaces وstrictKnownMarketplaces وblockedMarketplaces — بدلًا من deniedPlugins غير الموجود.",
      },
      {
        tag: "تم الإصلاح",
        heading: "تصحيح خيار مُضلِّل في Plugins quiz",
        body: "لم يعد سؤال الـ quiz عن تعطيل الفريق يُقدّم deniedPlugins كإعداد حقيقي؛ الخيار المُضلِّل وتفسيره يتناولان الآن managed-policy blocklist الحقيقية blockedMarketplaces.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي لتصحيح deniedPlugins",
        body: "موديول الـ Plugins العربي والـ quiz يعكسان التصحيح الإنجليزي، مع حذف deniedPlugins لصالح إعدادات managed-policy الحقيقية.",
      },
    ],
  },
  {
    version: "v1.23.4",
    date: "١٠ يونيو ٢٠٢٦",
    title: "توضيح صياغة تسلسل الأولوية في موديول Project Setup",
    summary:
      "تُشدَّد شرح تسلسل الأولوية حتى لا يكون اتجاه التجاوز غامضًا: الإعدادات المحلية تتجاوز إعدادات المشروع، والإعدادات المُدارة ومعاملات سطر الأوامر فقط هي التي تتجاوز المحلية.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "صياغة تسلسل الأولوية أصبحت لا لبس فيها",
        body: "موديول Project Setup يوضّح الآن صراحةً أن الإعدادات المحلية تتجاوز إعدادات المشروع، وأن الإعدادات المُدارة ومعاملات سطر الأوامر فقط هي التي تتجاوز المحلية — مطابقًا ترتيب الأولوية الرسمي (managed > command-line > local > project > user).",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي + اتساق مصطلح الإعدادات المُدارة",
        body: "صفحة Project Setup العربية تعكس توضيح التسلسل وتستخدم الآن 'الإعدادات المُدارة' باتساق للطبقة المُدارة بدلًا من التبديل بين 'سياسة المنظمة'.",
      },
    ],
  },
  {
    version: "v1.23.3",
    date: "٩ يونيو ٢٠٢٦",
    title:
      "التحقق من الحقائق: الجولات المجانية لـ /ultrareview هي مخصَّص لمرة واحدة (بدون تاريخ انتهاء محدد)",
    summary:
      "تصحيحان مُتحقَّق منهما مقابل الـ docs الرسمية. تاريخ انتهاء /ultrareview حُذف؛ صياغة /code-review مقابل /simplify في الكويز توافق الـ docs.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "/ultrareview الجولات المجانية: بدون تاريخ انتهاء ٥ مايو ٢٠٢٦ محدد",
        body: "لم يعد موديول الـ Workflows يدّعي أن الجولات المجانية الثلاث لـ Pro/Max في /ultrareview تنتهي في ٥ مايو ٢٠٢٦. وفق docs الـ ultrareview الرسمية، الجولات الثلاث هي مخصَّص لمرة واحدة لكل حساب لا يُجدَّد — بدون تاريخ انتهاء منشور. صُحّح في الإنجليزي والعربي.",
      },
      {
        tag: "تم الإصلاح",
        heading: "slash-commands quiz: صياغة /code-review مقابل /simplify توافق الـ docs",
        body: "Quiz q7 يحتفظ بصياغة الـ docs الدقيقة 'أُعيدت تسميتها من /simplify في v2.1.147'، وملاحظته الختامية تطابق الآن الـ docs: من v2.1.154 /simplify هو مراجعة تنظيف منفصلة تُطبّق الإصلاحات دون البحث عن أخطاء، و/code-review --fix هو مسار البحث عن الأخطاء مع الإصلاحات.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي للتصحيحَين",
        body: "موديول الـ Workflows العربي وslash-commands quiz يعكسان تصحيح الجولات المجانية لـ /ultrareview وصياغة /code-review، مع تعبيرات طبيعية.",
      },
    ],
  },
  {
    version: "v1.23.2",
    date: "٨ يونيو ٢٠٢٦",
    title:
      "التحقق من الحقائق: ميزانية وصف الـ skill هي 1% من الـ context window افتراضيًا",
    summary:
      "تصحيح موديول الـ Skills والكويز مقابل الـ docs الرسمية. إجمالي ميزانية أوصاف الـ skill هو 1% من الـ context window للنموذج افتراضيًا — لا 2%.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "ميزانية وصف الـ skill ~1% من الـ context window افتراضيًا",
        body: "صُحّح موديول الـ skills والكويز من ~2% إلى ~1%، الافتراضي الموثَّق. رقم 2% هو مجرد مثال لرفع الميزانية، لا الافتراضي. ارفعها بإعداد skillListingBudgetFraction أو متغير البيئة SLASH_COMMAND_TOOL_CHAR_BUDGET.",
      },
      {
        tag: "تم الإصلاح",
        heading: "استخدام /doctor (لا /context) للتحقق من ميزانية الـ skill",
        body: "موديول الـ Skills والكويز يُشيران الآن إلى /doctor لمعرفة ما إذا كانت ميزانية وصف الـ skill تفيض وأي skills تُحذف من القائمة، مطابقَين الـ docs الرسمية.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي وتصحيح إملائي",
        body: "موديول الـ Skills العربي والكويز يعكسان تصحيحَي 1%/الميزانية، وتصحيح إملائي طُبّق في مثال الميزانية.",
      },
    ],
  },
  {
    version: "v1.23.1",
    date: "٧ يونيو ٢٠٢٦",
    title:
      "التحقق من الحقائق: تصحيح سلوك /terminal-setup في Getting Started",
    summary:
      "صُحّح وصف /terminal-setup في موديول Getting Started مقابل الـ docs الرسمية لـ terminal-config. الأمر يكتب ربط مفتاح Shift+Enter — لا دعم الإشعارات.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "لم يعد /terminal-setup يُوصف كمهيّئ للإشعارات",
        body: "Getting Started يشرح الآن أن /terminal-setup يكتب ربط مفتاح Shift+Enter لـ VS Code وCursor وDevin Desktop وAlacritty وZed — لا دعم الإشعارات لـ Kitty/Ghostty/Alacritty. إشعارات سطح المكتب تعمل افتراضيًا في Ghostty وKitty وiTerm2؛ تستخدم التيرمنالات الأخرى preferredNotifChannel: \"terminal_bell\" أو Notification hook.",
      },
      {
        tag: "تم الإصلاح",
        heading: "استُعيدت تفاصيل GPU-acceleration وscroll-sensitivity لمتفرعات VS Code",
        body: "في VS Code وCursor وDevin Desktop، يُوقف /terminal-setup تسريع GPU في تيرمنال الـ IDE (لمنع تشويه النص) ويضبط حساسية التمرير للتمرير السلس في وضع ملء الشاشة. وُضّح وصف فهرس الميزات ليطابق ذلك.",
      },
      {
        tag: "العربية",
        heading: "تماثل عربي لتصحيح /terminal-setup",
        body: "موديول Getting Started العربي وفهرس الميزات يعكسان التصحيحات الإنجليزية بصياغة متسقة لنطاق ربط Shift+Enter وافتراضيات الإشعارات وسلوك GPU-acceleration/scroll-sensitivity.",
      },
    ],
  },
  {
    version: "v1.23.0",
    date: "٦ يونيو ٢٠٢٦",
    title: "بحث في الموقع بأكمله مع لوحة أوامر ⌘K",
    summary:
      "أُضيفت تجربة بحث شاملة في الموقع: اضغط ⌘K (أو Ctrl+K) من أي مكان لفتح لوحة أوامر تبحث في الموديولات وأوامر slash والإعدادات والمحتوى المرجعي.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "لوحة أوامر ⌘K للبحث في الموقع",
        body: "جزيرة بحث جديدة تتيح فتح لوحة أوامر بـ ⌘K / Ctrl+K والعثور على الموديولات والأوامر والمواد المرجعية من أي صفحة، مع التنقل بلوحة المفاتيح بين النتائج.",
      },
    ],
  },
  {
    version: "v1.22.7",
    date: "٥ يونيو ٢٠٢٦",
    title: "تدقيق v2.1.162: أسماء حقول claude agents --json وحقل waitingFor",
    summary:
      "تصحيح أسماء حقول claude agents --json لتطابق الـ schema الموثّقة، وتوثيق الحقل الجديد waitingFor لتمييز أنواع الانتظار، وإضافة OTEL_RESOURCE_ATTRIBUTES.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "حقل waitingFor يفرّق بين أنواع الانتظار",
        body: "لما status يبقى waiting، الحقل الجديد waitingFor (v2.1.162) يقول الجلسة مستنية إيه — permission prompt أو input needed. موديول subagents والقوالب ومحاكاة الترمينال دلوقتي فيهم مثال jq بيشغّل claude respawn بس على الجلسات المستنية إذن صلاحية.",
      },
      {
        tag: "تم الإطلاق",
        heading: "توثيق متغير OTEL_RESOURCE_ATTRIBUTES",
        body: "موديول advanced-features دلوقتي بيوثّق OTEL_RESOURCE_ATTRIBUTES كطريقة معتمدة لإلصاق labels للفريق أو القسم أو cost-center على كل metric datapoint وevent، مع خيار OTEL_METRICS_INCLUDE_RESOURCE_ATTRIBUTES=false للسيطرة على الـ cardinality.",
      },
      {
        tag: "تم الإصلاح",
        heading: "أسماء حقول claude agents --json دلوقتي مطابقة للوثائق",
        body: "موديول subagents ومحاكاة الترمينال والقوالب والكويز ومرجع الاختصارات وفهرس الميزات كلهم بيعرضوا الحقول الموثّقة pid وcwd وkind وstartedAt وsessionId وname وstatus بدل الأسماء القديمة id/state/project/last_activity.",
      },
      {
        tag: "العربية",
        heading: "محاذاة عربية للتغييرات الثلاثة",
        body: "موديول subagents العربي وموديول advanced-features العربي ومحاكاة الترمينال والقوالب والكويز ومرجع الاختصارات وفهرس الميزات كلهم بيعكسوا تصحيح أسماء الحقول وإضافة waitingFor وإضافة OTEL_RESOURCE_ATTRIBUTES.",
      },
    ],
  },
  {
    version: "v1.22.6",
    date: "٤ يونيو ٢٠٢٦",
    title: "تدقيق v2.1.162: إعادة تسمية Windsurf لـ Devin Desktop",
    summary:
      "Windsurf اتسمّى Devin Desktop عبر /ide و/terminal-setup و/scroll-speed من v2.1.162، وأُضيف Kiro كـ VS Code fork مدعوم ثانٍ.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "Kiro متذكر كـ VS Code fork مدعوم",
        body: "صفحة وثائق إضافة الـ VS Code الرسمية بتقول إن الإضافة بتتثبّت في فروع VS Code تانية زي Devin Desktop أو Kiro. موديول الـ getting-started وكويزه يضيفان Kiro جنب Cursor وDevin Desktop.",
      },
      {
        tag: "تم الإصلاح",
        heading: "Windsurf بقى اسمه Devin Desktop في واجهة Claude Code",
        body: "موديول الـ getting-started ما بقاش بيعرض Windsurf كاسم حالي — دلوقتي بيوصف Cursor وDevin Desktop (الاسم الجديد لـ Windsurf من v2.1.162) وKiro كفروع VS Code المدعومة. الفقرة بتنوّه إن /ide و/scroll-speed بقوا بيستخدموا اسم Devin Desktop الجديد.",
      },
      {
        tag: "العربية",
        heading: "محاذاة عربية لإعادة التسمية وإضافة Kiro",
        body: "موديول الـ getting-started بالعربي وكويزه يعكسان إعادة التسمية — Cursor وDevin Desktop (الاسم الجديد لـ Windsurf من v2.1.162) وKiro — بصياغة متّسقة.",
      },
    ],
  },
  {
    version: "v1.22.5",
    date: "٣ يونيو ٢٠٢٦",
    title: "الوضع التلقائي على Bedrock/Vertex/Foundry + تصحيح توافر workflows",
    summary:
      "توثيق توافر Auto Mode على Amazon Bedrock وGoogle Cloud Vertex AI وMicrosoft Foundry، وتصحيح توافر /ultrareview على هذه المنصات.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "توافر الوضع التلقائي على Bedrock وVertex AI وFoundry",
        body: "موديول advanced-features دلوقتي بيوثّق توافر الوضع التلقائي على المنصات: على Bedrock وVertex AI وFoundry (v2.1.158+) بيكون مقفول وراء CLAUDE_CODE_ENABLE_AUTO_MODE=1 وبس Opus 4.7 و4.8 مدعومين. خيار المسؤول permissions.disableAutoMode: \"disable\" متذكر كطريقة قفل الوضع نهائيًا.",
      },
      {
        tag: "تم الإصلاح",
        heading: "شيل التحفّظ غير المدعوم لـ /ultrareview في موديول workflows",
        body: "فقرة /ultrareview كانت بتقول إن الـ workflows ممكن يكون مقيدًا على Bedrock وVertex AI وFoundry. صفحة الوثائق الرسمية بتقول بوضوح إن الـ dynamic workflows متاحة على هذه المنصات من Claude Code v2.1.154+، فاتشال التحفّظ ده.",
      },
      {
        tag: "العربية",
        heading: "محاذاة عربية للتحديثين",
        body: "التغييران منعكسان في موديولات advanced-features و workflows بالعربي بصياغة متّسقة لتوافر المنصات وخيار التفعيل CLAUDE_CODE_ENABLE_AUTO_MODE.",
      },
    ],
  },
  {
    version: "v1.22.4",
    date: "٢ يونيو ٢٠٢٦",
    title: "تدقيق v2.1.160: إعادة تسمية ultracode وإزالة OPUS_4_6 override",
    summary:
      "ثلاث نتائج تدقيق على changelog الـ v2.1.160: إعادة تسمية مفعّل dynamic-workflow لـ ultracode، وإزالة CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE، وتصحيح إصدار /ultrareview.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "إعادة تسمية مفعّل dynamic-workflow لـ ultracode",
        body: "موديولات advanced-features و commands دلوقتي بتوثّق إعادة التسمية في v2.1.160 من workflow لـ ultracode. الكلمة الحرفية workflow ما بقتش بتفعّل run، لكن الطلبات بالصياغة الطبيعية لسه بتشتغل، و/effort ultracode بيفعّل dynamic workflows.",
      },
      {
        tag: "تم الإصلاح",
        heading: "CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE اتشال (no-op)",
        body: "اتشالت كل التعليمات اللي بتطلب ضبط المتغير ده: من قسم fast mode في موديول الـ commands، ومن قسم متغيرات البيئة والقوالب في advanced-features، ومن فهرس الميزات. السؤال Q23 في كويز advanced-features دلوقتي بيشرح إن المتغير اتشال في v2.1.160.",
      },
      {
        tag: "تم الإصلاح",
        heading: "/ultrareview ظهر في v2.1.86 مش v2.1.112",
        body: "موديول الـ workflows دلوقتي بيعكس الوثائق الرسمية — /ultrareview متاح من Claude Code v2.1.86 واتبرز في v2.1.112، بدل ما كان مكتوب جديد في v2.1.112 بس.",
      },
      {
        tag: "العربية",
        heading: "محاذاة عربية للتدقيقات الثلاثة",
        body: "كل تغيير منعكس في الموديولات العربية (advanced-features و commands و workflows) والقوالب وفهرس الميزات والكويزات.",
      },
    ],
  },
  {
    version: "v1.22.3",
    date: "١ يونيو ٢٠٢٦",
    title: "الوضع السريع بقى يغطّي Opus 4.8، وتصحيح ترتيب الإعدادات في quiz الـ project-setup",
    summary:
      "تحديث قسم Fast Mode في موديول الـ commands ليشمل Opus 4.8 و4.7 و4.6، وتصحيح شرح ترتيب الإعدادات في Q4 من quiz الـ project-setup.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "الوضع السريع بيغطّي Opus 4.8 و4.7 و4.6",
        body: "موديول الـ commands ما بقاش بيثبّت الوضع السريع على Opus 4.6 لوحده. Opus 4.8 هو الافتراضي للوضع السريع من v2.1.154+، مع Claude Platform on AWS وإضافة الـ VS Code في قائمة المنصات اللي الوضع السريع مش متاح عليها. الـ rate-limit pool مشترك بين Opus 4.8 و4.7 و4.6.",
      },
      {
        tag: "تم الإصلاح",
        heading: "شرح ترتيب الإعدادات في Q4 من project-setup quiz",
        body: "شرح الخيار B في Q4 من quiz الـ project-setup كان مقلوب: settings.local.json (مش إعدادات المشروع) هي اللي بتتغلّب على المشروع. الشرح المصحّح دلوقتي بيقول إن إعدادات المشروع بتتغلّب على إعدادات المستخدم، بس بتنتصر عليها الإعدادات المحلية وسياسة المنظمة وarguments سطر الأوامر.",
      },
      {
        tag: "العربية",
        heading: "محاذاة عربية للوضع السريع وquiz الـ project-setup",
        body: "كل تغيير منعكس في موديول الـ commands بالعربي وفي quiz الـ project-setup بالعربي، مع توحيد المصطلحات الخاصة بالـ deprecation وقائمة المنصات.",
      },
    ],
  },
  {
    version: "v1.22.2",
    date: "٣١ مايو ٢٠٢٦",
    title: "Plugin manifests: monitors وthemes اتحطّوا تحت experimental",
    summary:
      "تحديث إرشادات plugin manifest ليطابق المخطط الحالي — monitors وthemes لازم تتعرّف تحت مفتاح experimental في plugin.json.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "Plugin monitors تحت experimental",
        body: "موديول الـ plugins دلوقتي بيعرض monitors معرّفة تحت experimental.monitors في plugin.json، مع ملاحظة إن المستوى الأعلى لسه بيشتغل لكن claude plugin validate بيعرض warning. إدخال الـ feature catalog اتحدّث ليطابق.",
      },
      {
        tag: "تم الإصلاح",
        heading: "Project setup بيقول إن monitors/themes تجريبية",
        body: "موديول الـ project-setup دلوقتي بيقول للمتعلمين إن monitors وthemes مفاتيح plugin manifest تجريبية ولازم تتداخل تحت experimental: {}.",
      },
      {
        tag: "العربية",
        heading: "محاذاة عربية لإرشادات الـ plugin manifest",
        body: "منعكس في موديولات الـ plugins والـ project-setup بالعربي وفي feature catalog العربي، مع صياغة عربية أنظف للفقرة الجديدة في الـ project-setup.",
      },
    ],
  },
  {
    version: "v1.22.1",
    date: "٣٠ مايو ٢٠٢٦",
    title: "جولة تدقيق على الوثائق والكويزات في سبع موديولات",
    summary:
      "سبع نتائج تدقيق مستهدفة على الوثائق الرسمية وchangelog الـ Claude Code، منعكسة في صفحات الموديولات والكويزات بالإنجليزية والعربية.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "Cursor وWindsurf هما VS Code forks",
        body: "موديول الـ getting-started دلوقتي بيقول إن Cursor وWindsurf VS Code forks بيعيدوا استخدام إضافة الـ VS Code والـ integrated terminal، و/terminal-setup بيظبط GPU acceleration وscroll sensitivity تلقائيًا. الكويز اتحدّث ليطابق.",
      },
      {
        tag: "تم الإصلاح",
        heading: "DISABLE_UPDATES مقابل DISABLE_AUTOUPDATER",
        body: "موديول الـ project-setup دلوقتي بيفرّق بين DISABLE_UPDATES=1 (بيقفل كل مسارات التحديث بما فيها claude update اليدوي) وبين DISABLE_AUTOUPDATER (بيكتم إشعارات الـ package manager بس).",
      },
      {
        tag: "تم الإصلاح",
        heading: "ميزانية وصف الـ skill تقريبًا 2% من الـ context window",
        body: "موديول الـ skills والكويز اتحدّثوا من نسبة الـ ~1% القديمة لنسبة الـ ~2% الحالية، مع SLASH_COMMAND_TOOL_CHAR_BUDGET لرفع الحد.",
      },
      {
        tag: "العربية",
        heading: "محاذاة كاملة EN/AR لكل التصحيحات",
        body: "كل تصحيح منعكس في صفحات الموديولات بالعربي وفي الكويزات، بما في ذلك الـ cross-module link في memory.md ومحاذاة صياغة الـ 2% في كل شروحات q3 في الـ skills.",
      },
    ],
  },
  {
    version: "v1.22.0",
    date: "٢٩ مايو ٢٠٢٦",
    title: "الـ Dynamic workflows ومجموعة الـ skills المدمجة كاملة",
    summary:
      "إضافة قسم Dynamic Workflows في موديول الـ workflows، وتوسيع موديول الـ skills ليعرض كل الـ skills المدمجة، مع محاذاة كاملة EN/AR.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة الـ dynamic workflows",
        body: "موديول الـ workflows دلوقتي بيغطّي الـ dynamic workflows (v2.1.154+) — تنسيق من dozens لـ hundreds من الـ subagents من script بيكتبه Claude، والـ workflow المدمج /deep-research، و/effort ultracode، وحفظ run كـ /command، والتعطيل من /config أو بـ CLAUDE_CODE_DISABLE_WORKFLOWS=1.",
      },
      {
        tag: "تم الإطلاق",
        heading: "توسيع قائمة الـ skills المدمجة",
        body: "موديول الـ skills دلوقتي بيعرض المجموعة الكاملة للـ skills المدمجة المتاحة في كل جلسة — /code-review و/batch و/debug و/loop و/claude-api — جنب ثلاثي /run و/verify و/run-skill-generator (v2.1.145+). وأُضيف /claude-api لمحاكاة الترمينال.",
      },
      {
        tag: "تم الإصلاح",
        heading: "توضيح صياغة الـ research preview للقنوات",
        body: "موديول الـ MCP دلوقتي بيقول إن plugins قنوات Telegram وDiscord وiMessage 'مُضمّنة في' الـ research preview، مطابقة لصياغة الوثائق الرسمية.",
      },
      {
        tag: "العربية",
        heading: "محاذاة عربية لكل التغييرات",
        body: "ترجمة قسم الـ dynamic workflows وجدول الـ skills المدمجة وأسئلة الـ quiz الجديدة وإدخالات الـ feature catalog وصفوف الـ cheatsheet للعربية.",
      },
    ],
  },
  {
    version: "v1.21.1",
    date: "٢٨ مايو ٢٠٢٦",
    title: "تصحيح مستويات الجهد ومراجعة الكود السحابية وتوضيح PowerShell",
    summary:
      "تصحيح مستويات جهد التفكير عشان تشمل xhigh، وتوثيق مراجعة الكود العميقة في الـ cloud (/code-review ultra)، وتوضيح إعداد الـ shell لأداة PowerShell على Linux وmacOS.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "تصحيح مستويات جهد التفكير",
        body: "موديولات الـ hooks والـ subagents دلوقتي بتعرض مجموعة الجهد الكاملة — low وmedium وhigh وxhigh وmax وauto — مطابقة للوثائق الرسمية. xhigh اتضاف لـ Opus 4.7 بين high وmax.",
      },
      {
        tag: "تم الإصلاح",
        heading: "تصحيح ترتيب تبديل أوضاع الصلاحيات بالعربية",
        body: "موديول الأوامر (بالعربية) دلوقتي بيعرض تبديل Shift+Tab بترتيب default ← acceptEdits ← plan، مطابقًا للنسخة الإنجليزية وللوثائق الرسمية.",
      },
      {
        tag: "تم الإطلاق",
        heading: "توثيق مراجعة الكود السحابية",
        body: "موديول أوامر الـ slash وكتالوج الميزات والـ reference cheatsheet ومحاكي الترمينال دلوقتي بيغطّوا /code-review ultra (alias /ultrareview) — مراجعة كود عميقة متعددة الـ agents في الـ cloud.",
      },
      {
        tag: "العربية",
        heading: "ترجمة فئات كتالوج الميزات",
        body: "كتالوج الميزات بالعربية دلوقتي بيستخدم تسميات فئات عربية للإدخالات الجديدة، وكتل الكود بقى ليها language tags.",
      },
    ],
  },
  {
    version: "v1.21.0",
    date: "٢٧ مايو ٢٠٢٦",
    title: "ملخص الجلسة والبحث في تاريخ الأوامر وإشعارات الموبايل وقواعد Hard Deny للوضع التلقائي",
    summary:
      "إضافة تغطية لملخص الجلسة (/recap) والبحث العكسي Ctrl+R في تاريخ الأوامر وإشعارات الموبايل الفورية عبر Remote Control وقواعد hard_deny للوضع التلقائي وأوامر slash جديدة.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة ملخص الجلسة وتاريخ الأوامر",
        body: "موديول الأوامر دلوقتي بيغطي ملخصات الجلسة التلقائية لما ترجع للترمينال، وملخصات /recap حسب الطلب، والبحث العكسي Ctrl+R مع تبديل النطاق بـ Ctrl+S.",
      },
      {
        tag: "تم الإطلاق",
        heading: "إضافة إشعارات الموبايل الفورية",
        body: "موديول سير العمل دلوقتي بيوثّق الإشعارات الفورية عبر Remote Control — Claude بيبعت تنبيهات على الموبايل لما المهام تخلص أو تحتاج قرارك.",
      },
      {
        tag: "تم الإطلاق",
        heading: "توسيع ضبط الوضع التلقائي وأوامر slash جديدة",
        body: "موديول الميزات المتقدمة دلوقتي بيوثّق قواعد hard_deny والأولوية بأربع طبقات وأوامر claude auto-mode defaults/config/critique من الـ CLI. موديول أوامر الـ slash دلوقتي بيشمل /recap و/fewer-permission-prompts و/tui و/focus و/undo (alias لـ /rewind).",
      },
      {
        tag: "العربية",
        heading: "محاذاة كاملة EN/AR لكل التغييرات",
        body: "كل المحتوى الجديد متطابق بالعربية في الموديولات والكويزات وكتالوج الميزات والـ reference cheatsheet.",
      },
    ],
  },
  {
    version: "v1.20.0",
    date: "٢٦ مايو ٢٠٢٦",
    title: "أنماط الـ Output والقنوات واستخدام الكمبيوتر وتوسيع الـ Routines",
    summary:
      "إضافة تغطية لأنماط الـ output، وقنوات MCP (Telegram وDiscord وiMessage)، واستخدام الكمبيوتر (التحكم في GUI على macOS)، وتوسيع توثيق الـ routines مع API triggers وGitHub triggers.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة قسم أنماط الـ Output",
        body: "موديول الأوامر دلوقتي بيغطي أنماط الـ output المدمجة (Default وProactive وExplanatory وLearning) وإنشاء أنماط مخصصة بملفات Markdown وfrontmatter الـ keep-coding-instructions.",
      },
      {
        tag: "تم الإطلاق",
        heading: "إضافة قسم القنوات",
        body: "موديول MCP دلوقتي بيوثّق القنوات — MCP servers بتبعت أحداث (Telegram وDiscord وiMessage) لجلسات شغّالة. بيغطي flag الـ --channels والـ pairing والـ allowlists وأدوات التحكم المؤسسية.",
      },
      {
        tag: "تم الإطلاق",
        heading: "إضافة قسم استخدام الكمبيوتر وتوسيع الـ Routines",
        body: "موديول الميزات المتقدمة دلوقتي بيغطي MCP server الـ computer-use للتحكم في GUI على macOS. موديول سير العمل دلوقتي بيوثّق الـ routines بالكامل: API triggers وGitHub triggers وواجهة الويب وإدارة /schedule list/update/run من الـ CLI.",
      },
      {
        tag: "العربية",
        heading: "محاذاة كاملة EN/AR لكل التغييرات",
        body: "كل المحتوى الجديد متطابق بالعربية في الموديولات والكويزات وكتالوج الميزات والـ reference cheatsheet.",
      },
    ],
  },
  {
    version: "v1.19.0",
    date: "٢٥ مايو ٢٠٢٦",
    title: "Skills مدمجة ودقة التحديث التلقائي وتغطية التثبيت",
    summary:
      "إضافة /run و/verify و/run-skill-generator وskillOverrides لموديول الـ skills، وإصلاح معلومات التحديث التلقائي، وإضافة مديري حزم Linux وclaude doctor في getting-started.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة /run و/verify و/run-skill-generator وskillOverrides",
        body: "توثيق ثلاث skills مدمجة لتشغيل التطبيق والتحقق منه وتسجيل وصفات البناء، وإعداد skillOverrides للتحكم في ظهور الـ skills من settings.json، ومتغيرات الاستبدال النصية ${CLAUDE_SESSION_ID} و${CLAUDE_EFFORT} و${CLAUDE_SKILL_DIR}.",
      },
      {
        tag: "تم الإصلاح",
        heading: "إصلاح دقة توثيق التحديث التلقائي",
        body: "موديول project-setup دلوقتي بيوضح بشكل صحيح إن تثبيتات Homebrew/WinGet ممكن تفعّل التحديث التلقائي عن طريق CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE=1، مع إضافة إعداد autoUpdatesChannel ومتغير DISABLE_AUTOUPDATER. npm ما بقاش موصوف كـ deprecated.",
      },
      {
        tag: "تم الإطلاق",
        heading: "إضافة مديري حزم Linux وclaude doctor",
        body: "موديول getting-started دلوقتي بيوثّق طرق تثبيت apt وdnf وapk وأمر claude doctor للتحقق.",
      },
      {
        tag: "العربية",
        heading: "محاذاة كاملة EN/AR لكل التغييرات",
        body: "كل نصوص الموديولات وتصحيحات الكويزات ومحتوى التابات متطابقة بالعربية.",
      },
    ],
  },
  {
    version: "v1.18.1",
    date: "٢٤ مايو ٢٠٢٦",
    title: "سد فجوات التغطية وإصلاحات المراجعة ومحاذاة EN/AR",
    summary:
      "سد فجوات المحتوى المتحقق منها (updatedToolOutput، exec form، --add-dir، --mcp-config)، ودمج نتائج مراجعتين، ومحاذاة كل التغييرات بين الإنجليزية والعربية.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "إصلاح توفر CLAUDE_CODE_FORK_SUBAGENT ووصفه بالعربية",
        body: "الإنجليزي اتصحح من 'interactive mode only' لـ 'interactive sessions, non-interactive mode, and the Agent SDK'. العربي اتكتب من جديد عشان يطابق (كان بيوصف غلط إنه للـ external builds بس).",
      },
      {
        tag: "تم الإصلاح",
        heading: "تصحيح إصدار /less-permission-prompts",
        body: "الإصدار اتصحح من v2.1.112 لـ v2.1.111 (اتأكدنا من الـ CHANGELOG) في وحدة الـ skills بالإنجليزية والعربية.",
      },
      {
        tag: "تم الإطلاق",
        heading: "إضافة توثيق PostToolUse updatedToolOutput و--add-dir و--mcp-config",
        body: "hooks الـ PostToolUse ممكن تستبدل output الأداة بالكامل عبر hookSpecificOutput.updatedToolOutput (بيشتغل لكل الأدوات من v2.1.121). --add-dir بيدي صلاحيات Read/Edit لمجلدات إضافية؛ --mcp-config بيحمّل MCP servers من JSON خارجي للجلسة الحالية.",
      },
      {
        tag: "العربية",
        heading: "إضافة قسم exec form الناقص للـ hooks بالعربية",
        body: "وحدة الـ hooks الإنجليزية كانت فيها الـ exec form (مصفوفة args لتشغيل العمليات بدون shell) بس النسخة العربية كانت ناقصاها — أُضيفت الآن.",
      },
    ],
  },
  {
    version: "v1.18.0",
    date: "٢٢ مايو ٢٠٢٦",
    title: "تغطية v2.1.146 — الـ bundled skill /code-review",
    summary:
      "توثيق الأمر الجديد /code-review (كان اسمه /simplify، ولسه شغّال كـ alias) مُتحقَّق منه من المرجع الرسمي، منعكس على كل الأسطح بالإنجليزية والعربية.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة الأمر المدمج /code-review",
        body: "بيراجع الـ diff الحالي للـ correctness bugs ويعرض النتايج من غير ما يعدّل ملفات. بيقبل effort levels (low/medium/high/xhigh/max) و--comment لنشر inline comments على GitHub PR. الاسم اتغيّر من /simplify، ولسه شغّال كـ alias.",
      },
      {
        tag: "العربية",
        heading: "تكامل عربي كامل لـ /code-review",
        body: "منعكس على المحتوى العربي والاختبارات وخطوات الترمينال وملف terminal-commands.json والقوالب وفهرس الميزات وورقة المرجع.",
      },
    ],
  },
  {
    version: "v1.17.0",
    date: "٢٠ مايو ٢٠٢٦",
    title: "تغطية v2.1.144 / v2.1.145 — 5 ميزات متحقق منها",
    summary:
      "توثيق 5 ميزات تم التحقق منها من وثائق Claude Code الرسمية والـ CHANGELOG، منعكسة على المحتوى والاختبارات وخطوات الترمينال والقوالب وفهرس الميزات وورقة المرجع باللغتين.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة claude agents --json للبرمجة",
        body: "claude agents --json بيطبع قائمة الجلسات كمصفوفة JSON — id والحالة والاسم والمشروع وآخر نشاط — لسكربتات الإطلاق وأشرطة الحالة ومنتقيات الجلسات.",
      },
      {
        tag: "تم الإطلاق",
        heading: "إضافة حقول background_tasks وsession_crons للـ Stop/SubagentStop",
        body: "inputs الـ Stop والـ SubagentStop بقت تحتوي على background_tasks (الـ bash والـ subagents الشغّالة في الخلفية) وsession_crons (المهام المجدولة). hook الاكتمال يقدر يمنع لحد ما الـ arrays تفضي.",
      },
      {
        tag: "تم الإطلاق",
        heading: "إضافة معاينة /plugin Discover/Browse وإعادة تسمية /extra-usage",
        body: "شاشات /plugin Discover وBrowse بقت بتعرض commands وagents وskills وhooks وMCP/LSP servers بتاعة الـ plugin قبل التثبيت. v2.1.144 غيّرت اسم /extra-usage لـ /usage-credits؛ /extra-usage لسه شغّال كـ alias.",
      },
      {
        tag: "العربية",
        heading: "تكامل عربي كامل لـ v2.1.144 + v2.1.145",
        body: "الميزات الخمسة منعكسة على المحتوى العربي والاختبارات وخطوات الترمينال والقوالب وملف terminal-commands.json وفهرس الميزات وورقة المرجع.",
      },
    ],
  },
  {
    version: "v1.16.0",
    date: "١٦ مايو ٢٠٢٦",
    title: "تغطية v2.1.143 — أوامر plugin enable/disable وإصلاحات المراجعة",
    summary:
      "توثيق 5 ميزات من v2.1.143 تم التحقق منها من وثائق Claude Code الرسمية، مع تصحيحات مراجعة لوحدات الذاكرة وإعداد المشروع والـ hooks والـ plugins.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة أوامر claude plugin enable/disable وdetails وtag",
        body: "claude plugin enable/disable بتفعّل وتعطّل الـ plugins المثبّتة بدون ما تشيلها (بتقبل --scope للتحكم في مكان حفظ الإعداد). claude plugin details بيعرض مكونات الـ plugin وتكلفة الـ tokens لكل جلسة. claude plugin tag بيعمل release git tags مع التحقق من الإصدار.",
      },
      {
        tag: "تم الإطلاق",
        heading: "إضافة تكلفة الـ context المتوقعة في سوق الـ plugins",
        body: "شاشات Discover/Browse بقت بتعرض تكلفة الـ tokens المتوقعة لكل جلسة لكل plugin.",
      },
      {
        tag: "تم الإصلاح",
        heading: "تصحيحات المراجعة عبر 4 وحدات",
        body: "إصلاحات fact-check في وحدات الذاكرة وإعداد المشروع والـ hooks والـ plugins من خط المراجعة الآلي.",
      },
    ],
  },
  {
    version: "v1.15.0",
    date: "١٦ مايو ٢٠٢٦",
    title: "سجل تغييرات YAML المنسّق",
    summary:
      "استبدال سجل التغييرات المعتمد على GitHub بصيغة YAML منسّقة يدويًا. كل إصدار بقى فيه عنوان وملخص وإدخالات مصنّفة مع روابط الـ issues.",
    items: [
      {
        tag: "تم التحسين",
        heading: "ترحيل سجل التغييرات لصيغة YAML المنسّقة",
        body: "بيانات سجل التغييرات اتنقلت من GitHub API scraping لملف YAML منظم (changelog.yaml) مع إدخالات لكل إصدار وتصنيفات ومراجع issues.",
      },
    ],
  },
  {
    version: "v1.14.0",
    date: "١٥ مايو ٢٠٢٦",
    title: "تغطية v2.1.142 — الوكلاء، الأذونات، الهوية، والإضافات",
    summary:
      "توثيق 4 ميزات تم التحقق منها من وثائق Claude Code الرسمية، مع محتوى واختبارات وخطوات طرفية وقوالب وفهرس ميزات.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة agents --cwd وعلامة --permission-mode",
        body: "claude agents --cwd <path> يصفي عرض الوكلاء لعرض فقط الوكلاء العاملين في ذلك المجلد. --permission-mode <mode> مع القائمة الكاملة لأوضاع الأذونات المقبولة.",
      },
      {
        tag: "تم الإطلاق",
        heading: "إضافة ANTHROPIC_WORKSPACE_ID وCLAUDE_CODE_PLUGIN_PREFER_HTTPS",
        body: "توثيق ANTHROPIC_WORKSPACE_ID لـ Workload Identity Federation على منصات السحابة. CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1 يضمن استنساخ الإضافات عبر HTTPS في بيئات CI.",
      },
    ],
  },
  {
    version: "v1.13.0",
    date: "١٤ مايو ٢٠٢٦",
    title: "متغيرات v2.1.138/140 وإصلاح شريط جانبي",
    summary:
      "إضافة متغيرات البيئة الموثقة حديثًا وإصلاح مشكلة رؤية زر طي الشريط الجانبي.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة 3 متغيرات بيئة من v2.1.138/140",
        body: "CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE وCLAUDE_CODE_RESUME_PROMPT وCLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL عبر الوحدات وفهرس الميزات والاختبارات والقوالب.",
      },
      {
        tag: "تم التحسين",
        heading: "تحسين زر طي الشريط الجانبي",
        body: "نص أعلى تباينًا عند التوسيع مع لون text-primary كامل وخط أسمك عند الطي.",
      },
      {
        tag: "تم الإصلاح",
        heading: "تصحيح وصف CLAUDE_CODE_NATIVE_CURSOR",
        body: "تم تصحيح الوصف الخاطئ السابق لـ CLAUDE_CODE_NATIVE_CURSOR.",
      },
    ],
  },
  {
    version: "v1.12.1",
    date: "١٢ مايو ٢٠٢٦",
    title: "6 ميزات جديدة وتكافؤ كامل في الاختبارات العربية",
    summary:
      "إضافة محتوى لـ 6 ميزات، 12 سؤال اختبار، تكافؤ عربي كامل عبر كل الوحدات الـ 7، وملاحظة أمان لـ plugin URLs.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة 6 ميزات جديدة عبر 5 وحدات",
        body: "اكتشاف نموذج gateway، تبديل الشاشة البديلة، تلميح لصق الصور، علامة --plugin-url، تحديث تلقائي لمدير الحزم، ومتغير SESSION_ID.",
      },
      {
        tag: "تم الإصلاح",
        heading: "إضافة تحذير أمان لـ --plugin-url",
        body: "تمت إضافة ملاحظة أمان لـ --plugin-url في وثائق الإضافات الإنجليزية والعربية.",
      },
      {
        tag: "العربية",
        heading: "تكافؤ كامل في الاختبارات العربية عبر كل الوحدات",
        body: "15 سؤال اختبار عربي مفقود مضاف (getting-started q7-q8، hooks q9-q10، project-setup q6، advanced-features q13-q21) مع 4 خطوات طرفية و4 قوالب.",
      },
    ],
  },
  {
    version: "v1.12.0",
    date: "١٠ مايو ٢٠٢٦",
    title: "تغطية v2.1.138/139 — 7 ميزات",
    summary:
      "سد فجوات التغطية لـ 7 ميزات تم التحقق منها مقابل وثائق Claude Code الرسمية.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة 7 ميزات من v2.1.138/139",
        body: "محتوى الوحدات والاختبارات والقوالب وفهرس الميزات لـ 7 ميزات جديدة متحقق منها مقابل الوثائق الرسمية.",
      },
    ],
  },
  {
    version: "v1.11.0",
    date: "٧ مايو ٢٠٢٦",
    title: "تغطية v2.1.128–133 ومحتوى #122",
    summary:
      "سد فجوات التغطية عبر عدة مجالات، بناءً على ملاحظات المستخدمين.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة 5+ ميزات من v2.1.128–133",
        body: "محتوى الوحدات والاختبارات والقوالب لـ 5+ ميزات جديدة بناءً على الوثائق الرسمية وملاحظات المستخدمين.",
      },
    ],
  },
  {
    version: "v1.10.2",
    date: "٦ مايو ٢٠٢٦",
    title: "تصحيح ترتيب Shift+Tab في وضع الأذونات",
    summary:
      "يصحح ترتيب التنقل لـ Shift+Tab في وضع الأذونات الذي كان معطلاً.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "تصحيح ترتيب Shift+Tab",
        body: "Shift+Tab يمر الآن بشكل صحيح عبر أوضاع الأذونات بدلاً من تخطي الحالات.",
      },
    ],
  },
  {
    version: "v1.10.1",
    date: "٥ مايو ٢٠٢٦",
    title: "قالب ultrareview --timeout",
    summary:
      "إضافة قالب جديد وفهرس ميزات لـ ultrareview مع علامة timeout.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "قالب ultrareview --timeout جديد",
        body: "قالب workflow جديد يُنفذ ultrareview مع --timeout للبيئات حيث المراجعات الطويلة متقطعة.",
      },
    ],
  },
  {
    version: "v1.10.0",
    date: "٥ مايو ٢٠٢٦",
    title: "تغطية v2.1.119–126 — 7 ميزات",
    summary:
      "سد 7 فجوات تغطية لميزات تم التحقق منها مقابل الوثائق الرسمية.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة 7 ميزات من v2.1.119–126",
        body: "محتوى الوحدات والاختبارات والقوالب لـ 7 ميزات جديدة متحقق منها مقابل الوثائق الرسمية.",
      },
    ],
  },
  {
    version: "v1.9.0",
    date: "١ مايو ٢٠٢٦",
    title: "تغطية v2.1.118–123 — 10 ميزات",
    summary:
      "سد 10 فجوات تغطية عبر وحدات commands وplugins وMCP وadvanced-features.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة 10 ميزات من v2.1.118–123",
        body: "محتوى كامل واختبارات وقوالب لـ 10 ميزات جديدة عبر commands وplugins وMCP وadvanced-features.",
      },
    ],
  },
  {
    version: "v1.8.0",
    date: "٣٠ أبريل ٢٠٢٦",
    title: "وحدة بدء صديقة للمبتدئين",
    summary:
      "إضافة مقدمة صديقة للمبتدئين ومسرد مصطلحات في وحدة Getting Started بالعربية.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "مقدمة ومسرد للمبتدئين",
        body: "وحدة Getting Started تتضمن الآن دليلاً خطوة بخطوة للمبتدئين ومسرد مصطلحات.",
      },
    ],
  },
  {
    version: "v1.7.0",
    date: "٢٩ أبريل ٢٠٢٦",
    title: "تغطية كاملة لـ Advisor Tool",
    summary:
      "إضافة تغطية كاملة لـ Advisor Tool مع سؤال اختبار وخطوة طرفية بالعربية.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة كويز وخطوة طرفية لـ Advisor Tool",
        body: "سؤال اختبار وخطوة طرفية كاملان لـ Advisor Tool بالإنجليزية والعربية.",
      },
    ],
  },
  {
    version: "v1.6.0",
    date: "٢٨ أبريل ٢٠٢٦",
    title: "الوحدة 0 — Getting Started كاملة",
    summary:
      "إكمال وحدة Getting Started (الوحدة 0) مع التثبيت والمصادقة والطرفية وإعداد IDE بالعربية.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "وحدة Getting Started كاملة",
        body: "تغطية كاملة للوحدة 0 للتثبيت والمصادقة والطرفية وإعداد IDE بالإنجليزية والعربية.",
      },
    ],
  },
  {
    version: "v1.5.0",
    date: "٢٥ أبريل ٢٠٢٦",
    title: "تصحيح وصف Advisor Tool",
    summary:
      "تصحيح وصف Advisor Tool وإزالة المراجع لمتغيرات البيئة غير الموثقة.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "تصحيح وصف Advisor Tool",
        body: "وصف Advisor Tool الآن دقيق. تم إزالة متغيرات البيئة غير الموثقة من فهرس الميزات.",
      },
    ],
  },
  {
    version: "v1.4.5",
    date: "٢١ أبريل ٢٠٢٦",
    title: "تدقيق slash-commands واتساق الاختبارات",
    summary:
      "تصحيح أمر موثق لكن غير موجود، تصحيح أسئلة اختبار عربية غير متطابقة، واستبدال التقدم التلقائي بأزرار.",
    items: [
      {
        tag: "تم التحسين",
        heading: "الاختبار لا يتقدم تلقائيًا",
        body: "يمكن للمتعلم قراءة الشروحات قبل اختيار المتابعة. زر 'السؤال التالي' يحل محل التقدم التلقائي.",
      },
      {
        tag: "تم الإصلاح",
        heading: "إزالة /allowed-tools من أوامر Configuration",
        body: "/allowed-tools كان مدرجًا كأمر مدمج لكنه غير موجود في Claude Code. تمت إزالته.",
      },
      {
        tag: "تم الإصلاح",
        heading: "تصحيح 5 أسئلة اختبار عربية غير متطابقة",
        body: "أسئلة الاختبار العربية في memory وskills وslash-commands الآن تتطابق مع نظيراتها الإنجليزية.",
      },
    ],
  },
  {
    version: "v1.4.4",
    date: "٢١ أبريل ٢٠٢٦",
    title: "أقصى effort هو للجلسة فقط",
    summary:
      "تصحيح توثيق ذكر خطأً أن أقصى effort كان خاصًا بـ Opus.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "تصحيح نطاق effort max",
        body: "أقصى effort هو للجلسة بأكملها وليس لـ Opus فقط. تم التصحيح عبر 4 وحدات.",
      },
    ],
  },
  {
    version: "v1.4.3",
    date: "٢٠ أبريل ٢٠٢٦",
    title: "تغطية sandbox.network.deniedDomains",
    summary:
      "إضافة اختبارات وقالب لتغطية خيار الإعداد sandbox.network.deniedDomains.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "إضافة تغطية sandbox.network.deniedDomains",
        body: "توثيق sandbox.network.deniedDomains في advanced-features مع أسئلة اختبار وقوالب.",
      },
    ],
  },
  {
    version: "v1.4.2",
    date: "١٦ أبريل ٢٠٢٦",
    title: "فجوات تغطية v2.1.105",
    summary:
      "سد فجوات التغطية لـ v2.1.105 عبر وحدات commands وhooks وplugins وskills وsubagents.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "تغطية v2.1.105 عبر 5 وحدات",
        body: "تحديثات محتوى الوحدات لـ commands وhooks وplugins وskills وsubagents.",
      },
    ],
  },
  {
    version: "v1.4.1",
    date: "٨ أبريل ٢٠٢٦",
    title: "دقة وحدة Skills",
    summary:
      "تصحيح ميزانية السياق العربية وإضافة توثيق لحقول frontmatter مفقودة.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "تصحيح ميزانية السياق العربية",
        body: "تم تصحيح ميزانية وصف الـ skill من 2% / 16,000 حرف إلى 1% / 8,000 حرف.",
      },
      {
        tag: "تم الإطلاق",
        heading: "توثيق حقلي model وshell",
        body: "تمت إضافة توثيق لحقلي frontmatter model وshell في الـ skills module.",
      },
    ],
  },
  {
    version: "v1.4.0",
    date: "٤ أبريل ٢٠٢٦",
    title: "إصلاحات الطرفية والتحميل والقوالب",
    summary:
      "ثلاثة إصلاحات للطرفية وتجربة التحميل وشاشة القوالب.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "أمر /clear يمسح الطرفية",
        body: "أمر /clear في محاكي الطرفية يمسح الآن السجل المرئي بدلاً من طباعة نص.",
      },
      {
        tag: "تم الإصلاح",
        heading: "تحميل البطاقة يظهر خطأ عند الفشل",
        body: "عند فشل html2canvas، يظهر رسالة خطأ محلية تحت الزر بدلاً من الفشل بصمت.",
      },
      {
        tag: "تم الإصلاح",
        heading: "زر النسخ لا يتداخل مع النص",
        body: "كتل القوالب تدفع المحتوى أسفل زر النسخ لمنع ظهور النص تحته.",
      },
    ],
  },
  {
    version: "v1.3.2",
    date: "٢ أبريل ٢٠٢٦",
    title: "إصلاحات التخطيط العربي والتنقل والتقييم",
    summary:
      "الانتقال إلى خصائص CSS المنطقية، إضافة تنقل مباشر بلوحة المفاتيح في RTL، وتصحيح نطاق التقييم الذاتي.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "الانتقال إلى خصائص CSS المنطقية",
        body: "استبدال خصائص CSS الفيزيائية بما يعادلها المنطقي عبر 8 مكونات للدعم RTL السليم.",
      },
      {
        tag: "تم الإصلاح",
        heading: "تنقل مدرك لاتجاه RTL بلوحة المفاتيح",
        body: "إضافة تنقل بأزرار الأسهم واعٍ باتجاه RTL إلى BuildTabs وQuizBlock وInteractiveDiagram.",
      },
      {
        tag: "تم الإصلاح",
        heading: "تصحيح تقييم التقييم الذاتي العربي",
        body: "درجات التقييم الذاتي الآن تصل إلى 20 بشكل صحيح. المستخدمون المتقدمون لم يعودوا يُصنفون كمبتدئين.",
      },
      {
        tag: "العربية",
        heading: "دعم الإدخال متعدد اللغات في نموذج الملاحظات",
        body: "الحقول النصية تستخدم dir='auto' للمدخلات العربية/الإنجليزية المختلطة. حقول البريد الإلكتروني تستخدم dir='ltr'.",
      },
    ],
  },
  {
    version: "v1.3.1",
    date: "٣ أبريل ٢٠٢٦",
    title: "مهارات تدقيق جديدة لنزاهة المحتوى",
    summary:
      "إطلاق مهارات audit-quiz وaudit-terminal للفحص التلقائي لنزاهة المحتوى عبر كل الوحدات.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "مهارة audit-quiz الجديدة",
        body: "مهارة مؤتمتة لفحص سلامة بيانات الاختبار والاتساق الإنجليزي/العربي.",
      },
      {
        tag: "تم الإطلاق",
        heading: "مهارة audit-terminal الجديدة",
        body: "مهارة مؤتمتة للمقارنة المتبادلة بين محتوى الوحدات وملفات terminal-commands.json وterminal-steps.yaml.",
      },
      {
        tag: "تم الإطلاق",
        heading: "أمر /allowed-tools جديد",
        body: "محاكي الطرفية يدعم الآن /allowed-tools لإدارة الأدوات المسموح بها مع إضافة/إزالة ونمط wildcards.",
      },
    ],
  },
  {
    version: "v1.3.0",
    date: "٢ أبريل ٢٠٢٦",
    title: "سير عمل التدقيق GLM ودقة الوحدات",
    summary:
      "إضافة سير عمل تدقيق تلقائي وتصحيح التوثيق في وحدتي slash-commands وsubagents.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "سير عمل تدقيق GLM لوحدات التعلم",
        body: "سير عمل تدقيق مؤتمت مع وكلاء OpenCode وسكريبتات runner وقوالب تقارير ومزامنة tracker.",
      },
      {
        tag: "تم الإصلاح",
        heading: "تصحيح توثيق slash-commands وsubagents",
        body: "تصحيح اكتشاف الأوامر وأسماء النماذج وخيارات effort والتشخيصات وتوثيق Agent Teams.",
      },
    ],
  },
  {
    version: "v1.1.2",
    date: "٣١ مارس ٢٠٢٦",
    title: "تصحيح نطاقات تقييم التقييم الذاتي",
    summary:
      "التقييم الذاتي الآن يسجل بشكل صحيح حتى 20 نقطة مع نطاقات مستوى متناسبة.",
    items: [
      {
        tag: "تم الإصلاح",
        heading: "التقييم الذاتي يسجل بشكل صحيح حتى 20",
        body: "نطاقات النقاط هي مبتدئ 0-6، متوسط 7-14، متقدم 15-20. المستخدمون المتقدمون لم يعودوا يُصنفون كمبتدئين.",
      },
    ],
  },
  {
    version: "v1.1.0",
    date: "٢٨ مارس ٢٠٢٦",
    title: "إطلاق نظام الملاحظات العام والتنقل",
    summary:
      "إطلاق متتبع الملاحظات العام وصفحة changelog وروابط 'الإبلاغ عن مشكلة' لكل وحدة وإعادة تنظيم التنقل.",
    items: [
      {
        tag: "تم الإطلاق",
        heading: "متتبع ملاحظات عام",
        body: "صفحة /feedback جديدة تعرض الملاحظات النشطة مُنظمة حسب الحالة مع عدد العناصر ونموذج إرسال.",
      },
      {
        tag: "تم الإطلاق",
        heading: "صفحة changelog للعناصر المُصدَّرة",
        body: "صفحة /changelog جديدة تعرض ما تم شحنه وإصلاحه، مُرتبطة من التذييل.",
      },
      {
        tag: "تم الإطلاق",
        heading: "رابط الإبلاغ عن مشكلة في كل صفحة تعلم",
        body: "كل صفحة وحدة لديها رابط يفتح نموذج الملاحظات مع اسم الوحدة مملوء مسبقًا.",
      },
      {
        tag: "تم التحسين",
        heading: "إعادة تسمية التنقل للوضوح",
        body: "Build → Config Builder، Quick Reference → Cheat Sheet، Feature Catalog → Feature Index. Footer وsidebar مُعاد تنظيمهما.",
      },
    ],
  },
  {
    version: "v1.22.8",
    date: "٦ يونيو ٢٠٢٦",
    title:
      "جولة التحقق من الحقائق: مستويات effort في /code-review، انفصال /simplify، trigger ultracode، نطاق MAX_THINKING_TOKENS",
    summary:
      "أربع نتائج تدقيق مُتحقَّق منها مقابل الـ docs الرسمية لـ Claude Code وتُطبَّق على المحتوى الإنجليزي والعربي.",
    items: [
      {
        tag: "تم التحسين",
        heading: "مستويات effort في /code-review تشمل الآن ultra",
        body: "نطاق effort في /code-review يشمل الآن ultra (الذي يُشغّل مراجعة متعددة الوكلاء أعمق في السحابة)، مطابقًا التوقيع الموثَّق [low|medium|high|xhigh|max|ultra].",
      },
      {
        tag: "تم التحسين",
        heading: "/simplify لم يعد مجرد اسم بديل لـ /code-review",
        body: "من v2.1.154، /simplify يُشغّل مراجعة تنظيف منفصلة تُطبّق الإصلاحات دون البحث عن أخطاء. /code-review --fix هو مسار البحث عن الأخطاء مع الإصلاحات.",
      },
      {
        tag: "تم التحسين",
        heading: "كلمة trigger في الـ dynamic workflow أصبحت ultracode",
        body: "أُعيدت تسميتها من workflow في v2.1.160؛ الطلبات باللغة الطبيعية لا تزال تعمل. حُدّث في موديول الـ workflows والكويز والـ reference cheatsheet ومحاكاة التيرمنال.",
      },
      {
        tag: "تم الإصلاح",
        heading: "MAX_THINKING_TOKENS=0 يُعطّل التفكير فقط على نماذج معينة",
        body: "موديول advanced-features يوضّح أن MAX_THINKING_TOKENS=0 يُعطّل التفكير فقط على Opus 4.6 وSonnet 4.6 — على Opus 4.7 والأحدث، التفكير التكيّفي يُستخدم دائمًا والمتغير لا يُطبَّق.",
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
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${TAG_COLORS[tag]}`}
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
        {/* Right accent rail + dot (RTL: rail on the right) */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-10 mt-1 h-3 w-3 flex-shrink-0 rounded-full border-2 border-accent bg-card transition-all group-hover:scale-125 group-hover:bg-accent" />
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

export default function ArChangelogPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          eyebrow="المنصة"
          title="سجل التغييرات"
          lede="ما تم شحنه وإصلاحه على منصة تعلّم Claude Code."
        />

        {/* Stats bar */}
        <Reveal delay={80}>
          <div className="mb-10 flex flex-wrap gap-6 rounded-xl border border-border bg-card px-6 py-4 shadow-[var(--shadow-sm)]">
            <div className="flex flex-col">
              <span className="font-mono text-2xl font-bold text-accent">
                {ENTRIES.length}+
              </span>
              <span className="text-xs text-fg-subtle">إصدار موثَّق</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-2xl font-bold text-accent">
                {ENTRIES.reduce((s, e) => s + e.items.length, 0)}+
              </span>
              <span className="text-xs text-fg-subtle">تغيير فردي</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-2xl font-bold text-accent">
                {ENTRIES[0].version}
              </span>
              <span className="text-xs text-fg-subtle">الإصدار الحالي</span>
            </div>
          </div>
        </Reveal>

        {/* Info callout */}
        <Reveal delay={120}>
          <Callout tone="info" title="كيف يعمل هذا">
            كل إصدار هو جولة مراجعة: يُقارَن محتوى المنصة التعليمية تلقائيًا
            بـ docs الـ Claude Code الرسمية. النتائج المؤكَّدة تُشحن كمدخل
            موثَّق بإصدار؛ والـ PRs الأوتوماتيكية غير الدقيقة تُغلق مع شرح.
            كل تغيير يُشحن بالإنجليزية والعربية.
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
