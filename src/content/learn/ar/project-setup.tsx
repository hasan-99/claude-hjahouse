import { Prose, Callout, Quiz, type QuizQuestion } from "@/components/content";
import CodeBlock from "@/components/CodeBlock";
import Terminal, { type Step } from "@/components/Terminal";
import Reveal from "@/components/Reveal";

/* ── Terminal scripts ─────────────────────────────────────────────────── */

const initScript: Step[] = [
  { t: "print", text: "# جارٍ تهيئة ذاكرة المشروع…", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/init", tone: "user", prompt: ">" },
  { t: "wait", ms: 300 },
  { t: "out", lines: [
    { text: "جارٍ فحص قاعدة الكود…", tone: "muted" },
    { text: "  ✔  package.json — Node.js 20, TypeScript 5", tone: "green" },
    { text: "  ✔  tsconfig.json — strict mode", tone: "green" },
    { text: "  ✔  .eslintrc — ESLint + Prettier", tone: "green" },
    { text: "  ✔  src/  — Express API, Prisma ORM", tone: "green" },
    { text: "  ✔  jest.config.ts — إطار الاختبار", tone: "green" },
  ], gap: 80 },
  { t: "wait", ms: 400 },
  { t: "out", lines: [
    { text: "جارٍ إنشاء CLAUDE.md…", tone: "muted" },
    { text: "  تم إنشاء CLAUDE.md (٤٧ سطرًا)", tone: "green" },
    { text: "", tone: "muted" },
    { text: "✦  اعمل commit لـ CLAUDE.md في git حتى يحصل الفريق كله على نفس الـ context.", tone: "amber" },
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
  { t: "print", text: "# ضبط الصلاحيات المسبقة للمشروع", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/permissions", tone: "user", prompt: ">" },
  { t: "wait", ms: 300 },
  { t: "out", lines: [
    { text: "الصلاحيات الحالية (.claude/settings.json):", tone: "muted" },
    { text: "  allow: Bash(git *)          ✔  عمليات git", tone: "green" },
    { text: "  allow: Bash(npm *)          ✔  سكريبتات npm", tone: "green" },
    { text: "  allow: Bash(npx *)          ✔  أدوات npx", tone: "green" },
    { text: "  allow: Read(**/*)", tone: "green" },
    { text: "  allow: Write(src/**/*)", tone: "green" },
    { text: "  allow: Edit(src/**/*)", tone: "green" },
  ], gap: 80 },
  { t: "wait", ms: 400 },
  { t: "type", text: "claude --add-dir ../shared-types", tone: "user", prompt: "$", speed: 35 },
  { t: "wait", ms: 300 },
  { t: "out", lines: [
    { text: "تمت إضافة المجلد: ../shared-types", tone: "green" },
    { text: "  يمكن لـ Claude الآن قراءة وتعديل الملفات في هذا المسار للجلسة الحالية.", tone: "muted" },
  ], gap: 90 },
];

/* ── Quiz questions ───────────────────────────────────────────────────── */

const questions: QuizQuestion[] = [
  {
    q: "ما الأمر الذي يولّد ملف CLAUDE.md الأولي من خلال فحص قاعدة الكود؟",
    options: ["/setup", "/init", "/memory", "/scaffold"],
    answer: 1,
    explanation:
      "يأمر /init كلود بقراءة package.json والوثائق الموجودة وهيكل المجلدات، ثم كتابة CLAUDE.md الذي يحتوي على الـ stack والأوامر والـ conventions.",
  },
  {
    q: "أي ملف إعدادات يُودَع في git حتى يتشارك الفريق كله نفس الصلاحيات؟",
    options: [
      ".claude/settings.local.json",
      "~/.claude/settings.json",
      ".claude/settings.json",
      "CLAUDE.md",
    ],
    answer: 2,
    explanation:
      ".claude/settings.json هو الملف على مستوى المشروع الذي يُحفظ في source control. أما .claude/settings.local.json فيُضاف إلى .gitignore للتعديلات الشخصية، و~/.claude/settings.json يخص كل مستخدم.",
  },
  {
    q: "أي إعداد يتمتع بأولوية أعلى من arguments سطر الأوامر ولا يمكن تجاوزه بأي شيء آخر؟",
    options: [
      "إعدادات المشروع (.claude/settings.json)",
      "إعدادات المستخدم (~/.claude/settings.json)",
      "الإعدادات المحلية (.claude/settings.local.json)",
      "الإعدادات المُدارة (Managed settings)",
    ],
    answer: 3,
    explanation:
      "الإعدادات المُدارة تقع في أعلى سلسلة الأولوية: Managed > CLI args > Local (.local.json) > Project (settings.json) > User. مخصصة لنشرات المؤسسات والسياسات.",
  },
  {
    q: "ماذا يفعل --add-dir عند تشغيل Claude Code؟",
    options: [
      "يضيف مجلدًا بشكل دائم إلى المسارات المسموح بها للمشروع",
      "ينشئ مجلدًا فرعيًا جديدًا داخل المشروع",
      "يمنح صلاحية قراءة وتعديل مجلد خارج root المشروع للجلسة الحالية فقط",
      "ينسخ قواعد CLAUDE.md من مجلد إلى المشروع الحالي",
    ],
    answer: 2,
    explanation:
      "--add-dir منح مؤقت للجلسة الحالية يتيح لكلود قراءة وتعديل ملفات في مجلد مجاور (مثل ../shared-types). للمنح الدائم عبر كل الجلسات، استخدم permissions.additionalDirectories في settings.json.",
  },
];

/* ── Page body ────────────────────────────────────────────────────────── */

export default function Content() {
  return (
    <Prose>
      {/* ── مقدمة ────────────────────────────────────────────────────── */}
      <Reveal>
        <p>
          إعداد Claude Code لمشروع بياخد حوالي عشر دقايق. المقابل إن Claude
          هيفهم الـ conventions بتاعتك من أول رسالة، هيكون عنده الصلاحيات
          المناسبة يعمل شغل مفيد، وهيتصرف بشكل متّسق لكل واحد في الفريق.
          الموديول ده بيمشيك على خطوات الإعداد بالترتيب.
        </p>
      </Reveal>

      {/* ── ١. تهيئة ذاكرة المشروع ───────────────────────────────────── */}
      <Reveal delay={70}>
        <h2>تهيئة ذاكرة المشروع</h2>
        <p>
          ابدأ بأمر <code>/init</code>. Claude هيعمل scan للكود بتاعك — هيقرأ{" "}
          <code>package.json</code>، الـ docs الموجودة، وهيكلة المجلدات —
          وبعدين يولّد ملف <code>CLAUDE.md</code> فيه الـ tech stack، الأوامر
          المهمة، والـ conventions الأساسية. اعمل commit للملف ده في git
          فورًا عشان زملائك ياخدوا نفس الـ context.
        </p>
        <p>
          ملف <code>CLAUDE.md</code> الكويس بيكون مختصر ومحدد. استهدف أقل من
          200 سطر لكل ملف. كل سطر لازم يكون مفيد في تقريبًا كل جلسة — لو
          حاجة بتهم feature واحد بس، حطّها في ملف rules مخصص بالمسار بدلًا من
          كده. أهم الأقسام هي:
        </p>
        <ul>
          <li>الـ tech stack والـ versions</li>
          <li>أوامر التطوير (install، test، build، lint)</li>
          <li>الـ naming conventions اللي مش واضحة من الكود</li>
          <li>الـ gotchas المعروفة اللي ممكن تلخبط مطور جديد</li>
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
        <Callout tone="tip" title="اعمل commit لـ CLAUDE.md فورًا">
          تعامل مع <code>CLAUDE.md</code> زي أي ملف source عادي. الـ commit
          الفوري بيدي كل زميل في الفريق — بشري أو AI — نفس الـ context عند
          أي clone أو pull.
        </Callout>
      </Reveal>

      {/* ── ٢. ضبط الصلاحيات ─────────────────────────────────────────── */}
      <Reveal delay={70}>
        <h2>ضبط الصلاحيات</h2>
        <p>
          Claude Code بيشتغل ضمن نظام صلاحيات بيتحكم في الأدوات اللي يقدر
          يستخدمها من غير ما يسألك. الوضع الافتراضي بيطلب موافقة لمعظم عمليات
          الكتابة وكل أوامر الـ bash. للتطوير النشط، هتحتاج تعتمد العمليات
          الشائعة مسبقًا.
        </p>
        <p>
          افتح مدير الصلاحيات بـ <code>/permissions</code>. ضيف patterns
          للأوامر اللي Claude هيستخدمها بشكل متكرر. استخدم{" "}
          <code>Bash(git *)</code> عشان تسمح بكل أوامر git،{" "}
          <code>Bash(npm *)</code> لأوامر npm، أو{" "}
          <code>Bash(npx jest *)</code> لأداة محددة. عمليات الملفات ممكن
          تتحدد بمسارات معينة.
        </p>
        <p>
          ملفات الإعدادات بتتحكم في الصلاحيات على مستوى المشروع والمستخدم.{" "}
          <code>.claude/settings.json</code> بيتعمل له commit في git للفريق.{" "}
          <code>.claude/settings.local.json</code> بيتعمل له git-ignore
          للتعديلات الشخصية:
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
        <Callout tone="warn" title="العمليات الحساسة">
          للعمليات الحساسة زي الـ production deploys، سيبها تطلب موافقة أو
          استخدم <code>disable-model-invocation: true</code> على الـ skills
          عشان Claude ما يقدرش يشغّلها تلقائيًا أبدًا.
        </Callout>
      </Reveal>

      {/* ── ٣. توسيع المجلدات بـ --add-dir ──────────────────────────── */}
      <Reveal delay={70}>
        <h3>توسيع المجلدات بـ --add-dir</h3>
        <p>
          لما المهمة تحتاج ملفات بره الـ project root — مكتبة جنب المشروع، أو
          حزمة types مشتركة، أو bundle متولّد — استخدم <code>--add-dir</code>{" "}
          عند تشغيل الجلسة (أو <code>/add-dir</code> في النص) عشان توسّع الـ
          working directories للجلسة دي. كل مسار لازم يبقى موجود كـ directory،
          والـ flag بيدي وصول للملفات بس، مش باقي إعدادات الـ{" "}
          <code>.claude/</code> اللي في الشجرة دي:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`# ابدأ جلسة بصلاحية قراءة وتعديل في directoryين جنب المشروع
claude --add-dir ../shared-types --add-dir ../design-tokens`}
        />
      </Reveal>

      <Reveal delay={210}>
        <p>
          عشان تثبّت الـ directories دي لكل جلسات المشروع بدل ما تكتبها كل
          مرة، اضبط <code>permissions.additionalDirectories</code> في{" "}
          <code>.claude/settings.json</code>. <code>--add-dir</code> هو الشكل
          المؤقت لكل جلسة لنفس الصلاحية.
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

      {/* ── ٤. الأمان — قيود الـ Marketplace ───────────────────────── */}
      <Reveal delay={70}>
        <h2>الأمان — قيود الـ Marketplace</h2>
        <p>
          استخدم <code>blockedMarketplaces</code> عشان تحصر الـ marketplaces
          اللي تقدر تستخدمها. الـ entries بتدعم <code>hostPattern</code>{" "}
          للتحكم بالمجال (مثلاً <code>&quot;*.example.com&quot;</code>) و
          <code>pathPattern</code> للتحكم بمسار الـ repository (مثلاً{" "}
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
          ده بيتنفّذ على مستوى السياسة — المستخدمين ما يقدروش يغيّروه
          بالإعدادات المحلية. متاح في managed policy لـ enterprise deployments.
        </p>
        <p>
          لما تكتب plugin manifests لمشروعك، اعرف إن <code>monitors</code> و
          <code>themes</code> ميزات تجريبية، ولازم تتكتب تحت{" "}
          <code>experimental: {"{}"}</code> بدل ما تكون في المستوى الأعلى من{" "}
          <code>plugin.json</code>. الشكل top-level لسه بيشتغل، لكن{" "}
          <code>claude plugin validate</code> هيعرض warning، وفي إصدار قادم
          هيبقى الشكل المتداخل إلزامي.
        </p>
      </Reveal>

      {/* ── ٥. الإعدادات والبيئة ────────────────────────────────────── */}
      <Reveal delay={70}>
        <h2>الإعدادات والبيئة</h2>
        <p>الإعدادات بتمشي بهالسلسلة من الأولويات من الأعلى للأدنى:</p>
        <ol>
          <li>
            <strong>الإعدادات المُدارة (Managed settings)</strong> — أعلى
            مستوى، لا يمكن تجاوزها حتى بـ arguments سطر الأوامر
          </li>
          <li>
            <strong>Arguments سطر الأوامر</strong>
          </li>
          <li>
            <strong>الإعدادات المحلية</strong> (
            <code>.claude/settings.local.json</code>) — تغلب على إعدادات
            المشروع والمستخدم
          </li>
          <li>
            <strong>إعدادات المشروع</strong> (<code>.claude/settings.json</code>
            )
          </li>
          <li>
            <strong>إعدادات المستخدم</strong> (
            <code>~/.claude/settings.json</code>)
          </li>
        </ol>
        <p>
          الإعدادات المحلية بتغلب على إعدادات المشروع، مش العكس. التوصيل
          المُدار ممكن يستخدم ملفات سياسة المنصة أو مجلدات إعدادات مُدارة،
          لكن دي تفاصيل تنفيذ للطبقة المُدارة العليا مش نطاقات يومية منفصلة.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <h3>التحديثات التلقائية</h3>
        <p>
          الـ native installer بيعمل auto-update في الخلفية بشكل افتراضي.
          تثبيتات Homebrew وWinGet مش بتعمل auto-update بشكل افتراضي — عشان
          تفعّلها، اضبط{" "}
          <code>CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE=1</code>. Claude Code
          هيشغّل أمر ترقية الـ package manager في الخلفية لما إصدار جديد يبقى
          متاح، ويطلب منك تعيد التشغيل بعد النجاح. للترقية يدويًا، شغّل{" "}
          <code>brew upgrade claude-code</code> أو{" "}
          <code>winget upgrade Anthropic.ClaudeCode</code>.
        </p>
        <p>
          تقدر تتحكم في قناة الإصدار بإعداد <code>autoUpdatesChannel</code>:
        </p>
        <ul>
          <li>
            <code>&quot;latest&quot;</code> (الافتراضي) — بتجيب الميزات
            الجديدة فورًا
          </li>
          <li>
            <code>&quot;stable&quot;</code> — بتستخدم إصدار عمره حوالي أسبوع
            وبتتخطى الإصدارات اللي فيها مشاكل كبيرة
          </li>
        </ul>
        <p>
          لإيقاف التحديثات التلقائية نهائيًا، اضبط <code>DISABLE_UPDATES</code>{" "}
          على <code>&quot;1&quot;</code> في بلوك الـ <code>env</code> في
          الإعدادات — ده بيعطّل كل طرق التحديث بما فيهم <code>claude update</code>{" "}
          اليدوي. لو عايز خيار أقل صرامة، <code>DISABLE_AUTOUPDATER</code> بس
          بيوقف إشعارات تحديثات الـ package manager.
        </p>
      </Reveal>

      <Reveal delay={210}>
        <h3>إعدادات البيئة والنموذج</h3>
        <p>
          بجانب الصلاحيات، إعدادات مفيدة تانية تشمل <code>env</code>{" "}
          لمتغيرات البيئة اللي لازم تكون موجودة في كل جلسة، <code>agent</code>{" "}
          عشان تحدد agent افتراضي مخصص، و<code>claudeMdExcludes</code>{" "}
          لفلترة ملفات الذاكرة اللي مش ليها علاقة في الـ monorepos. كمان تقدر
          تحدد الموديل الافتراضي ومستوى الـ effort:
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
        <Callout tone="info" title="ما تشاركه مع الفريق">
          ضيف <code>.claude/settings.local.json</code> في{" "}
          <code>.gitignore</code> عشان التعديلات الشخصية تفضل شخصية. شارك{" "}
          <code>.claude/settings.json</code>، <code>CLAUDE.md</code>،{" "}
          <code>.claude/rules/</code>، <code>.claude/skills/</code>،
          واختياريًا <code>.claude/agents/</code> مع الفريق عن طريق git.
          كده زملائك هياخدوا نفس تعليمات المشروع والـ extensions المشتركة،
          بينما الإعدادات الشخصية والذاكرة التلقائية تفضل محلية على كل جهاز.
        </Callout>
      </Reveal>

      {/* ── اختبر نفسك ───────────────────────────────────────────────── */}
      <Reveal delay={70}>
        <Quiz questions={questions} title="اختبر نفسك — إعداد المشروع" />
      </Reveal>
    </Prose>
  );
}
