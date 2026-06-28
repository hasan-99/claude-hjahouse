import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Quiz, Prose, type QuizQuestion } from "@/components/content";

/* ------------------------------------------------------------------ */
/* Terminal demo — skill auto-discovery + invocation                   */
/* ------------------------------------------------------------------ */
const demoScript: Step[] = [
  { t: "print", text: "# Claude Code — اكتشاف الـ Skills وتفعيلها", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/skills", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "الـ Skills المحمّلة:", tone: "muted" },
    { text: "  • code-review      فحص الكود بحثًا عن ثغرات أمنية...", tone: "green" },
    { text: "  • pr-summary       تلخيص تغييرات الـ pull request...", tone: "green" },
    { text: "  • api-generator    توليد REST API endpoints من الـ schema...", tone: "green" },
    { text: "  • deep-analysis    تحليل شامل للكودبيس...", tone: "green" },
    { text: "", tone: "muted" },
    { text: "الميزانية المستخدمة: 1,240 / 8,192 حرف (15%)", tone: "amber" },
  ], gap: 60 },
  { t: "wait", ms: 700 },
  { t: "type", text: "/review-pr 456 high", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "تفعيل الـ skill: review-pr", tone: "system" },
    { text: "  args: $0=456, $1=high", tone: "muted" },
    { text: "  allowed-tools: Bash(gh *), Read, Grep, Glob", tone: "muted" },
    { text: "", tone: "muted" },
    { text: "جاري جلب الـ PR رقم #456...", tone: "blue" },
    { text: "gh pr view 456 --json title,body,files", tone: "muted" },
    { text: "جاري تشغيل مراجعة الأمان والأداء...", tone: "green" },
  ], gap: 70 },
  { t: "wait", ms: 500 },
  { t: "print", text: "✓ اكتملت الـ skill — تمت مراجعة PR رقم #456 (الأولوية: عالية)", tone: "green" },
  { t: "wait", ms: 1200 },
  { t: "clear" },
];

/* ------------------------------------------------------------------ */
/* Quiz questions                                                       */
/* ------------------------------------------------------------------ */
const questions: QuizQuestion[] = [
  {
    q: "متى يحمّل Claude محتوى SKILL.md الكامل؟",
    options: [
      "عند بدء التشغيل، لكل skill في ~/.claude/skills/",
      "فقط لما الـ skill تتفعّل فعلًا",
      "عندما يفتح المستخدم قائمة /",
      "فقط للـ skills الخاصة بالمشروع، وليس الشخصية",
    ],
    answer: 1,
    explanation:
      "الـ descriptions بتتحمّل عشان Claude يعرف الإمكانيات المتاحة، لكن محتوى SKILL.md الكامل بيتحمّل بشكل lazy — فقط لما Claude يقرر يفعّل الـ skill. ده بيخلّي الـ context window خفيف حتى لو عندك skills كتير.",
  },
  {
    q: "أي حقل في الـ frontmatter بيمنع Claude من تفعيل الـ skill تلقائيًا مع إتاحة تفعيلها عبر /skill-name؟",
    options: [
      "user-invocable: false",
      "paths: []",
      "disable-model-invocation: true",
      "effort: low",
    ],
    answer: 2,
    explanation:
      "`disable-model-invocation: true` بتوقف Claude من تشغيل الـ skill تلقائيًا، لكن المستخدم لسه يقدر يفعّلها من قائمة الـ slash. استعمل ده للـ skills اللي ليها side effects زي الـ deploys أو الـ pushes.",
  },
  {
    q: "إيه اللي بيعمله `context: fork` في الـ frontmatter بتاع الـ skill؟",
    options: [
      "بينسخ الـ skill لمستودع GitHub آخر",
      "بيشغّل الـ skill في subagent معزول بـ context window خاص بيه",
      "بيعمل fork للـ terminal session الحالية في tab جديد",
      "بيعمل نسخة مؤقتة من SKILL.md وقت التشغيل",
    ],
    answer: 1,
    explanation:
      "`context: fork` بيشغّل الـ skill في subagent معزول عشان الـ context window للمحادثة الأساسية يفضل نظيف. بتقرنه مع حقل `agent` (Explore أو Plan أو general-purpose) لتحديد نوع الـ subagent.",
  },
  {
    q: "إيه ترتيب الأولوية لما يكون عندك skills بنفس الاسم؟",
    options: [
      "project > personal > enterprise",
      "personal > project > enterprise",
      "enterprise > personal > project",
      "حسب الترتيب الأبجدي لمسار الملف",
    ],
    answer: 2,
    explanation:
      "إعدادات enterprise بتاخد الأولوية الأعلى، ثم الشخصية (~/.claude/skills/)، ثم المشروع (.claude/skills/). الـ plugin skills بتستخدم namespace (plugin-name:skill-name) عشان ما تتعارضش مع الـ skills الأخرى.",
  },
];

/* ------------------------------------------------------------------ */
/* Content                                                              */
/* ------------------------------------------------------------------ */
export default function Content() {
  return (
    <Prose>
      {/* Intro */}
      <Reveal delay={0}>
        <p>
          الـ skills هي قدرات قابلة لإعادة الاستخدام، Claude بيكتشفها ويستعملها تلقائيًا بناءً على
          السياق. مش مجرد أوامر بسيطة — الـ skills بتدعم progressive loading عشان تفضل خفيفة، وحقن
          dynamic context من الـ shell، وعزل التنفيذ عبر subagents، والتحكم في طريقة الاستدعاء. في
          الموديول ده، هنتعلم إزاي تصمّم وتبني skills فعّالة.
        </p>
      </Reveal>

      {/* ── إزاي الـ Skills بتتحمّل ── */}
      <Reveal delay={70}>
        <h2>إزاي الـ Skills بتتحمّل</h2>
        <p>
          Claude بيحمّل الـ skills بطريقة خفيفة. الـ descriptions بتتحمّل عشان Claude يبقى عارف إيه
          الإمكانيات المتاحة. محتوى <code>SKILL.md</code> الكامل مبيتحمّلش غير لما الـ skill
          تتفعّل فعلًا، والملفات المساعدة مبتتقراش غير لما يحتاجها.
        </p>
        <p>
          يعني تقدر تثبّت skills كتير من غير ما تزحم الـ context window. Claude بيعرف إنها موجودة
          من الـ descriptions، وبعدين يحمّل التعليمات الفعلية بس للـ skills اللي قرر يستعملها.
        </p>
        <p>
          الـ skills بتتخزن في <code>.claude/skills/&lt;name&gt;/SKILL.md</code> لنطاق المشروع
          (بتتعمل لها commit في git) أو{" "}
          <code>~/.claude/skills/&lt;name&gt;/SKILL.md</code> للنطاق الشخصي. الـ plugin skills
          بتستخدم namespace بالشكل <code>plugin-name:skill-name</code> عشان ما تتعارضش مع الـ
          skills التانية. لو فيه skills بنفس الاسم مش plugins، ترتيب الأولوية بيكون:{" "}
          enterprise &gt; personal &gt; project.
        </p>
        <p>
          كمان، Claude بيكتشف الـ skills تلقائيًا من مجلدات{" "}
          <code>.claude/skills/</code> المتداخلة في subdirectories جوة الـ project root. مثلًا،
          لو بتشتغل جوه <code>packages/frontend/</code>، Claude هيلاقي كمان الـ skills اللي موجودة
          في <code>packages/frontend/.claude/skills/</code>. ده بيخلّي الـ skills تتوزّع جنب الـ
          packages أو الـ services في الـ monorepo setups.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename=".claude/skills/code-review/"
          lang="bash"
          code={`.claude/skills/code-review/
├── SKILL.md              # التعليمات (مطلوب)
├── templates/
│   └── review-checklist.md
└── scripts/
    └── analyze-metrics.py`}
        />
      </Reveal>

      {/* ── كتابة Descriptions فعّالة ── */}
      <Reveal delay={70}>
        <h2>كتابة Descriptions فعّالة</h2>
        <p>
          الـ description هو أهم جزء في الـ skill. هو اللي بيتحكم إمتى Claude يفعّل الـ skill
          تلقائيًا، ولازم يكون فيه إشارات كافية عشان Claude يقدر يربطها بطلبات المستخدم الحقيقية.
          description غامض زي &ldquo;helps with code&rdquo; مش هيشتغل أبدًا. لكن description
          محدد فيه trigger terms واضحة — ده اللي بيفرق:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="SKILL.md — description بسيط"
          lang="yaml"
          code={`---
name: security-review
description: Scan code for security vulnerabilities including injection flaws, authentication issues, and data exposure. Use when reviewing code changes, preparing a PR, or when the user mentions security, vulnerabilities, or audit.
---`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          حط نوع المهمة (&ldquo;scan&rdquo;، &ldquo;generate&rdquo;، &ldquo;analyze&rdquo;)،
          والمجال (&ldquo;security&rdquo;، &ldquo;API&rdquo;، &ldquo;database&rdquo;)، وعبارات
          trigger صريحة (&ldquo;when the user mentions&rdquo;، &ldquo;use when&rdquo;). قائمة الـ
          skills بتقطع النص المجمّع من <code>description</code> مع <code>when_to_use</code> عند
          1,536 حرف لكل entry، فحط الـ use case الأساسي في الأول وخلّي عبارات الـ trigger
          الإضافية في <code>when_to_use</code>:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="SKILL.md — description + when_to_use منفصلَين"
          lang="yaml"
          code={`---
name: security-review
description: Scan code for security vulnerabilities including injection flaws, authentication issues, and data exposure.
when_to_use: When reviewing code changes, preparing a PR, or when the user mentions security, vulnerabilities, or audit.
---`}
        />
      </Reveal>

      <Reveal delay={140}>
        <Callout tone="info" title="ميزانية قائمة الـ Skills">
          Claude بيخصص حوالي 1% من الـ context window بتاع الـ model لمجموع أوصاف الـ skills
          بشكل افتراضي. ترفع الحد بإعداد <code>skillListingBudgetFraction</code> (مثلًا{" "}
          <code>0.02</code> = 2%) أو بمتغيّر البيئة{" "}
          <code>SLASH_COMMAND_TOOL_CHAR_BUDGET</code> لعدد حروف ثابت. شغّل{" "}
          <code>/doctor</code> عشان تتأكد إن الميزانية مش بتطفح وإن مفيش skills بتتشال من القائمة.
        </Callout>
      </Reveal>

      <Reveal delay={140}>
        <p>
          الملفات المساعدة بتوسّع الـ skill من غير ما تنفخ الـ Level 2 context. اعمل لها
          reference من <code>SKILL.md</code> بمسارات نسبية:
        </p>
        <CodeBlock
          filename="SKILL.md — مرجع لملف مساعد"
          lang="markdown"
          code={`For the full review checklist, see [templates/review-checklist.md](templates/review-checklist.md).`}
        />
        <p>
          Claude بيقرأ الملفات المساعدة عبر bash لما يحتاجها. خلّي{" "}
          <code>SKILL.md</code> تحت 500 سطر، وحط المراجع التفصيلية في ملفات منفصلة.
        </p>
      </Reveal>

      {/* ── الـ Dynamic Context والتحكم في الاستدعاء ── */}
      <Reveal delay={70}>
        <h2>الـ Dynamic Context والتحكم في الاستدعاء</h2>
        <p>
          صيغة <code>!command</code> بتنفّذ أوامر shell قبل ما محتوى الـ skill يوصل لـ Claude.
          الناتج بيتحقن مباشرة — Claude بيشوف النتيجة بس، مش الأمر. بالطريقة دي بتدي الـ skills
          سياق حي:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="SKILL.md — pr-summary مع سياق shell حي"
          lang="yaml"
          code={`---
name: pr-summary
description: Summarize pull request changes. Use when asked to review or summarize a PR.
context: fork
agent: Explore
---

## PR context
- Diff: !\`gh pr diff\`
- Comments: !\`gh pr view --comments\`
- Changed files: !\`gh pr diff --name-only\`

Summarize the intent and key changes in this pull request.`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          حقل <code>shell</code> بيحدد الـ shell اللي هيتستخدم في كتل{" "}
          <code>!command</code>. حطه <code>powershell</code> بدل الـ <code>bash</code> الافتراضي
          لما الـ PowerShell tool تكون مفعّلة بـ{" "}
          <code>CLAUDE_CODE_USE_POWERSHELL_TOOL=1</code>. على Linux وmacOS، تفعيلها كمان محتاج{" "}
          <code>pwsh</code> يكون على PATH:
        </p>
        <CodeBlock
          filename="SKILL.md — shell: powershell"
          lang="yaml"
          code={`---
name: windows-helper
description: Manage Windows services and configurations
shell: powershell
---`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          فيه خاصيتين في الـ frontmatter بيتحكموا في مين يقدر يفعّل الـ skill.{" "}
          <code>disable-model-invocation: true</code> معناها إن المستخدم بس يقدر يفعّلها عبر{" "}
          <code>/skill-name</code> — Claude مش هيشغّلها تلقائيًا أبدًا. استعمل ده لأي skill ليها
          side effects (زي deploy أو push أو إرسال رسائل).{" "}
          <code>user-invocable: false</code> بتخفي الـ skill من قائمة <code>/</code> بس تسيب
          Claude يشغّلها تلقائيًا — مفيدة للـ skills اللي بتشتغل كمعرفة خلفية مش كأوامر.
        </p>
        <p>
          <code>paths:</code> بتاخد قائمة YAML من الـ globs اللي بتحدد إمتى الـ skill تنطبق.
          لما تحطها، الـ skill مبتتحمّلش غير لما الـ working directory يطابق واحد من الـ globs.
          ده بيمنع الـ skills الخاصة بمشروع معين من التداخل مع sessions تانية:
        </p>
        <CodeBlock
          filename="SKILL.md — skill محددة بمسار"
          lang="yaml"
          code={`---
name: api-generator
description: Generate REST API endpoints from schema definitions.
paths: ["src/**/*.ts", "tests/**"]
---`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          <code>effort</code> بيتحكم في عمق التحليل للـ skill. القيم المتاحة:{" "}
          <code>low</code> للبحث السريع أو توليد boilerplate، و<code>medium</code> لأغلب المهام،
          و<code>high</code> للتحليل العميق اللي محتاج تفكير دقيق:
        </p>
        <CodeBlock
          filename="SKILL.md — effort: high"
          lang="yaml"
          code={`---
name: security-review
description: Scan code for security vulnerabilities.
effort: high
---`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          <code>context: fork</code> بيشغّل الـ skill في subagent معزول بـ context window خاص
          بيه. الـ <code>agent</code> field بيحدد نوع الـ agent: <code>Explore</code> للبحث
          والقراءة فقط، <code>Plan</code> للتخطيط، <code>general-purpose</code> لأي حاجة محتاجة
          كل الأدوات. المحادثة الأساسية بتفضل نضيفة والـ subagent هو اللي بيشيل الحمل التقيل.
        </p>
        <p>
          حقل <code>model</code> بيحدد الـ model اللي هيتستخدم لما الـ skill تتفعّل. ده مفيد لما
          المهمة بتستفيد من نقاط قوة model معين (مثلاً، <code>opus</code> للاستدلال المعقد،{" "}
          <code>sonnet</code> للتنفيذ السريع):
        </p>
        <CodeBlock
          filename="SKILL.md — subagent معزول مع اختيار model"
          lang="yaml"
          code={`---
name: deep-analysis
description: Thoroughly analyze the codebase for a specific pattern or issue
context: fork
agent: Explore
model: opus
disable-model-invocation: true
---

Analyze $ARGUMENTS across the entire codebase:
1. Use Glob and Grep to find all occurrences
2. Read each file and understand context
3. Summarize patterns, inconsistencies, and recommendations`}
        />
      </Reveal>

      {/* ── Terminal demo ── */}
      <Reveal delay={70}>
        <Terminal
          script={demoScript}
          title="Skills — اكتشاف تلقائي وتفعيل"
          loop
          showStatus
        />
      </Reveal>

      {/* ── الـ Arguments والوصول للأدوات ── */}
      <Reveal delay={70}>
        <h2>الـ Arguments والوصول للأدوات</h2>
        <p>
          الـ skills بتقبل arguments بطريقتين. <code>$ARGUMENTS</code> بيمسك كل حاجة بعد اسم
          الأمر كـ string واحد. <code>$0</code>، <code>$1</code>، <code>$2</code> بيمسكوا الـ
          arguments الفردية المفصولة بمسافات. كمان تقدر تعرّف arguments بالاسم عن طريق حقل{" "}
          <code>arguments</code> في الـ frontmatter — الأسماء بتتربط بالترتيب، يعني{" "}
          <code>$issue</code> بتتوسّع للـ argument الأول و<code>$branch</code> للتاني. كل
          الاستبدالات بتحصل قبل ما الـ prompt يوصل لـ Claude. <code>argument-hint</code> بيحسّن
          الـ autocomplete في قائمة الـ slash عن طريق عرض الـ arguments المتوقعة:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="SKILL.md — review-pr مع positional args"
          lang="yaml"
          code={`---
name: review-pr
description: Review a GitHub PR by number
argument-hint: "<pr-number> <priority>"
allowed-tools: Bash(gh *), Read, Grep, Glob
---

Review PR #$0 with priority $1. Focus on security and performance.

Reference our standards in [standards/code-review.md](standards/code-review.md).`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          الاستخدام: <code>/review-pr 456 high</code> — <code>$0</code> بتبقى <code>456</code>،
          و<code>$1</code> بتبقى <code>high</code>.
        </p>
        <p>
          <code>allowed-tools</code> بيمنح صلاحية للأدوات المذكورة وقت ما الـ skill تكون فعّالة
          — مش بيقيّد الأدوات المتاحة. إعدادات الصلاحيات بتاعتك لسه بتتحكم في الأدوات المش
          مذكورة.
        </p>
        <p>
          بجانب الـ positional arguments، الـ skills بتدعم متغيرات استبدال مدمجة:{" "}
          <code>{"${CLAUDE_SESSION_ID}"}</code> لمعرف الجلسة الحالية (مفيد للتسجيل)،{" "}
          <code>{"${CLAUDE_EFFORT}"}</code> لمستوى الـ effort الفعّال، و
          <code>{"${CLAUDE_SKILL_DIR}"}</code> لمجلد ملف <code>SKILL.md</code> بتاع الـ skill
          (استخدمه للإشارة لـ scripts مربوطة بالـ skill بصرف النظر عن الـ working directory).
        </p>
        <p>
          ملفات الأوامر القديمة في <code>.claude/commands/*.md</code> لسه شغّالة بس الـ skills
          هي الصيغة المنصوح بيها. لو الاتنين موجودين بنفس الاسم، الـ skill بتاخد الأولوية.
        </p>
      </Reveal>

      {/* ── التحكم في ظهور الـ Skills ── */}
      <Reveal delay={70}>
        <h2>التحكم في ظهور الـ Skills</h2>
        <p>
          إعداد <code>skillOverrides</code> في <code>settings.json</code> بيتحكم في ظهور الـ
          skills من غير ما تعدّل الـ frontmatter بتاع الـ skill نفسها. ده مفيد للـ skills
          المشتركة في المشروع أو اللي جاية من plugins ومش تقدر تعدّلها. قائمة{" "}
          <code>/skills</code> بتخلّيك تغيّر الحالات بشكل تفاعلي — ظلّل الـ skill، اضغط{" "}
          <code>Space</code> للتنقل بين الحالات، و<code>Enter</code> للحفظ في{" "}
          <code>.claude/settings.local.json</code>:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename=".claude/settings.json — skillOverrides"
          lang="json"
          code={`{
  "skillOverrides": {
    "legacy-context": "name-only",
    "deploy": "off"
  }
}`}
        />
        <p>
          القيم المتاحة: <code>&quot;on&quot;</code> (الافتراضي — ظهور كامل)،{" "}
          <code>&quot;name-only&quot;</code> (الاسم ظاهر بس الـ description مخفي)،{" "}
          <code>&quot;user-invocable-only&quot;</code> (مخفي من Claude بس موجود في قائمة{" "}
          <code>/</code>)، <code>&quot;off&quot;</code> (مخفي تمامًا).
        </p>
      </Reveal>

      {/* ── الـ Skills المدمجة ── */}
      <Reveal delay={70}>
        <h2>الـ Skills المدمجة</h2>
        <p>
          Claude Code بييجي معاه مجموعة skills مدمجة متاحة في كل جلسة، منها{" "}
          <code>/code-review</code> و<code>/batch</code> و<code>/debug</code> و<code>/loop</code>{" "}
          و<code>/claude-api</code>. تلات skills مدمجة إضافية —{" "}
          <code>/run</code> و<code>/verify</code> و<code>/run-skill-generator</code> — محتاجين
          v2.1.145+ وبيشتغلوا مع بعض عشان يشغّلوا التطبيق بتاعك ويتأكدوا من التغييرات على
          التطبيق الشغّال مش بس الـ tests:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <div className="my-5 overflow-x-auto rounded-lg border border-border bg-bg-muted">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-right font-semibold text-fg">الـ Skill</th>
                <th className="px-4 py-3 text-right font-semibold text-fg">الغرض</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["/code-review", "يراجع الـ diff الحالي لأخطاء الصحة ويبلّغ بالـ findings"],
                ["/batch", "ينفّذ مهام متعددة بشكل متوازي على ملفات مختلفة في worktrees معزولة"],
                ["/debug", "يحقّق ويشخّص المشاكل من الـ errors أو الـ logs"],
                ["/loop", "يشغّل مهمة على فترات متكررة جوه جلستك"],
                ["/claude-api", "يبني ويصحّح ويحسّن تطبيقات Claude API / Anthropic SDK"],
                ["/run", "شغّل التطبيق بتاعك وشوف التغيير شغّال"],
                ["/verify", "ابني وشغّل التطبيق عشان تتأكد إن التغيير بيعمل اللي المفروض"],
                ["/run-skill-generator", "علّم /run و/verify إزاي يبنوا ويشغّلوا المشروع بتاعك"],
              ].map(([skill, purpose], i) => (
                <tr key={i} className="transition hover:bg-card-hover">
                  <td className="px-4 py-3 font-mono text-xs text-accent">{skill}</td>
                  <td className="px-4 py-3 text-fg-muted">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <p>
          <code>/run</code> و<code>/verify</code> بيستنتجوا طريقة التشغيل من نوع المشروع (CLI،
          server، TUI، browser-driven) ومن <code>package.json</code> أو <code>Makefile</code> أو
          الـ README. للمشاريع اللي محتاجة حاجة أكتر من تشغيل عادي — database أو env file أو
          بناء متعدد الخطوات — شغّل <code>/run-skill-generator</code> مرة واحدة. هو بيشغّل
          التطبيق من بيئة نظيفة، ويسجّل اللي نجح، ويعمله commit كـ skill خاصة بالمشروع في{" "}
          <code>.claude/skills/run-&lt;name&gt;/</code>. بعد كده <code>/run</code> و
          <code>/verify</code> بيتبعوا الـ recipe المسجّلة بدل ما يخمّنوا.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <Callout tone="tip" title="/fewer-permission-prompts">
          <code>/fewer-permission-prompts</code> بيعمل scan للـ transcripts من محادثاتك ويقترح
          قائمة allowlist مُرتبة حسب الأولوية لـ <code>.claude/settings.json</code> بناءً على
          أوامر Bash و MCP اللي بتستخدمها بشكل متكرر. شغّله بعد كم جلسة عشان يولّد إعدادات
          صلاحيات مخصصة للـ workflow بتاعك:
          <CodeBlock
            lang="bash"
            code={`/fewer-permission-prompts`}
            className="mt-3"
          />
        </Callout>
      </Reveal>

      {/* ── Quiz ── */}
      <Reveal delay={70}>
        <Quiz questions={questions} title="اختبر معلوماتك — الـ Agent Skills" />
      </Reveal>
    </Prose>
  );
}
