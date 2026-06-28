import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Quiz, Prose, type QuizQuestion } from "@/components/content";

/* ── مشهد: تثبيت plugin واستدعاء skill ── */
const installScript: Step[] = [
  { t: "print", text: "# ثبّت plugin من الـ marketplace الرسمي", tone: "muted" },
  { t: "type", text: "/plugin install pr-review", prompt: ">" },
  { t: "out", lines: [
    { text: "جارٍ جلب pr-review من claude-plugins-official…", tone: "muted" },
    { text: "✓  تم استلام الـ manifest  (v1.2.0)", tone: "green" },
    { text: "  Skills:    check-security, check-coverage, summarize-changes", tone: "blue" },
    { text: "  Agents:    review-specialist.md", tone: "blue" },
    { text: "  Hooks:     PostToolUse → bin/audit.js", tone: "blue" },
    { text: "  MCP:       (لا يوجد)", tone: "muted" },
  ], gap: 60 },
  { t: "wait", ms: 400 },
  { t: "print", text: "✓  تم تثبيت الـ plugin: pr-review@1.2.0", tone: "green" },
  { t: "wait", ms: 700 },
  { t: "type", text: "/pr-review:check-security", prompt: ">" },
  { t: "out", lines: [
    { text: "جارٍ فحص الأمان على 14 ملفًا متغيرًا…", tone: "amber" },
    { text: "✓  لا توجد مشاكل حرجة. 2 ملاحظات منخفضة الخطورة.", tone: "green" },
  ], gap: 80 },
  { t: "wait", ms: 900 },
  { t: "type", text: "claude plugin list", prompt: "$" },
  { t: "out", lines: [
    { text: "الـ PLUGINS المثبّتة", tone: "muted" },
    { text: "  pr-review  v1.2.0  (مفعّل)", tone: "green" },
  ], gap: 60 },
];

/* ── مشهد: تعطيل وتنظيف ── */
const manageScript: Step[] = [
  { t: "print", text: "# عطّل plugin على مستوى المشروع بدون حذفه", tone: "muted" },
  { t: "type", text: "claude plugin disable formatter --scope project", prompt: "$" },
  { t: "out", lines: [
    { text: "✓  تم تعطيل formatter (النطاق: project)", tone: "green" },
    { text: "  تم الكتابة في .claude/settings.json", tone: "muted" },
  ], gap: 70 },
  { t: "wait", ms: 600 },
  { t: "print", text: "# فعّله تاني من غير ما تمسّ التثبيت", tone: "muted" },
  { t: "type", text: "claude plugin enable formatter --scope project", prompt: "$" },
  { t: "out", lines: [
    { text: "✓  تم تفعيل formatter (النطاق: project)", tone: "green" },
  ], gap: 70 },
  { t: "wait", ms: 600 },
  { t: "print", text: "# احذف الـ dependencies اليتيمة غير المستخدمة", tone: "muted" },
  { t: "type", text: "claude plugin prune", prompt: "$" },
  { t: "out", lines: [
    { text: "جارٍ فحص شجرة الـ dependencies…", tone: "muted" },
    { text: "✓  تم حذف 2 auto-install يتيمة.", tone: "green" },
    { text: "  الـ plugins اللي ثبّتها بنفسك لم تُمسّ.", tone: "muted" },
  ], gap: 60 },
];

const quizQuestions: QuizQuestion[] = [
  {
    q: "ما هو الملف الوحيد المطلوب داخل مجلد الـ plugin؟",
    options: [
      "skills/SKILL.md",
      ".claude-plugin/plugin.json",
      "hooks/hooks.json",
      "settings.json",
    ],
    answer: 1,
    explanation:
      "الملف الوحيد المطلوب هو .claude-plugin/plugin.json — الـ manifest اللي بيعرّف هوية الـ plugin. كل المجلدات التانية (skills/ وagents/ وhooks/ إلخ) اختيارية وبتتبع conventions معروفة عند Claude Code.",
  },
  {
    q: "كيف يتم تجنب تعارض أوامر الـ plugins مع إعدادات المشروع؟",
    options: [
      "بإضافة علامة # قبل الأمر، مثل #pr-review:check",
      "بوضعها في ملف namespace منفصل",
      "باستخدام الصيغة plugin-name:command-name مثل /pr-review:check-security",
      "من خلال CLI فقط وليس عبر موجّه الـ /",
    ],
    answer: 2,
    explanation:
      "أوامر الـ plugins والـ skills المرتبطة بها تكون namespaced بصيغة plugin-name:command-name. تستدعيها بالاسم الكامل مثل /pr-review:check-security لتجنب أي تعارض مع إعدادات مستوى المشروع.",
  },
  {
    q: "ماذا يفعل الأمر `claude plugin prune` (المعروف أيضًا بـ autoremove)؟",
    options: [
      "يحذف جميع الـ plugins بما فيها التي ثبّتها بنفسك",
      "يحذف فقط الـ dependencies التي ثُبِّتت تلقائيًا ولا يحتاجها أي plugin آخر",
      "يتحقق من صحة جميع الـ manifests ويحذف غير الصالحة",
      "يمسح مجلد بيانات الـ plugin المخزّن في CLAUDE_PLUGIN_DATA",
    ],
    answer: 1,
    explanation:
      "claude plugin prune (جديد في v2.1.121، له الاسم البديل autoremove) يحذف الـ dependencies التي ثُبِّتت تلقائيًا ولا يحتاجها أي plugin مثبّت آخر. الـ plugins التي ثبّتها بنفسك لا تُمسّ أبدًا.",
  },
  {
    q: "ما هو متغير البيئة الذي يجبر الاستنساخ عبر HTTPS بدلًا من SSH عند تثبيت plugin من GitHub؟",
    options: [
      "CLAUDE_PLUGIN_GIT_HTTPS=true",
      "GIT_PROTOCOL=https",
      "CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1",
      "PLUGIN_CLONE_MODE=https",
    ],
    answer: 2,
    explanation:
      "اضبط CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1 لإجبار الاستنساخ عبر HTTPS لمصادر الـ plugin من GitHub بصيغة owner/repo. هذا ضروري في بيئات CI والـ containers التي لا تملك SSH key مضبوط لـ github.com.",
  },
];

export default function Content() {
  return (
    <Prose>
      {/* ── مقدمة ── */}
      <Reveal delay={0}>
        <p>
          الـ plugins هي أعلى مستوى من آليات التوسعة في Claude Code. تجمع skills
          و subagents و hooks و MCP servers وإعدادات LSP في حزمة واحدة قابلة
          للتثبيت. الفريق يثبّت plugin واحد وكل شيء يتضبط فورًا — لا setup يدوي
          لكل مكوّن. هذه الوحدة تغطي هيكل الـ plugin، صيغة الـ manifest، طرق
          التوزيع، وكيف تبني الـ plugin بنفسك.
        </p>
      </Reveal>

      {/* ── هيكل الـ Plugin ── */}
      <Reveal delay={70}>
        <h2>هيكل الـ Plugin</h2>
        <p>
          الـ plugin هو مجلد بهيكل محدد. الملف الوحيد المطلوب هو{" "}
          <code>.claude-plugin/plugin.json</code>، الـ manifest الذي يعرّف هوية
          الـ plugin. كل شيء آخر اختياري لكنه يتبع conventions تتعرف عليها Claude
          Code:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="my-plugin/ (هيكل المجلد)"
          lang="text"
          code={`my-plugin/
├── .claude-plugin/
│   └── plugin.json       # الـ manifest المطلوب
├── skills/               # ملفات SKILL.md
│   └── my-skill/
│       └── SKILL.md
├── agents/               # تعريفات الـ subagents
│   └── specialist.md
├── commands/             # ملفات الأوامر القديمة (تعمل كذلك)
│   └── my-command.md
├── hooks/
│   └── hooks.json        # hooks على مستوى الـ plugin
├── .mcp.json             # إعدادات خوادم MCP
├── .lsp.json             # إعدادات خوادم LSP
├── settings.json         # الإعدادات الافتراضية
└── bin/
    └── helper.sh`}
        />
      </Reveal>

      <Reveal delay={210}>
        <p>
          الـ plugin الذي يشحن skill واحدة فقط يمكنه وضع <code>SKILL.md</code>{" "}
          مباشرة في root الـ plugin بدلًا من إنشاء مجلد <code>skills/</code>.
          تحمّلها Claude Code كـ skill واحدة وتستخدم حقل <code>name</code> في
          الـ frontmatter كاسم للاستدعاء. استخدم هيكل <code>skills/</code> للـ
          plugins التي قد تكبر لأكثر من skill.
        </p>
        <p>الـ manifest يعرّف الـ plugin والـ metadata الخاصة به:</p>
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
        <Callout tone="info" title="أوامر مميّزة بالـ namespace">
          أوامر الـ plugin والـ skills التي يوفّرها تكون namespaced بصيغة{" "}
          <code>plugin-name:command-name</code> لتجنب التعارض مع إعدادات المشروع.
          شغّلها بالاسم الكامل مثل <code>/pr-review:check-security</code>.
        </Callout>
      </Reveal>

      {/* ── ميزات الـ Manifest ── */}
      <Reveal delay={0}>
        <h2>ميزات الـ Manifest</h2>
        <p>
          الـ manifest يدعم عدة خصائص قوية لضبط سلوك الـ plugin. خاصية{" "}
          <code>userConfig</code> تعلن عن خيارات قابلة للتخصيص من المستخدم.
          الحقول المعلّمة بـ <code>sensitive: true</code> تُخزَّن في الـ system
          keychain بدلًا من ملفات الإعدادات النصية:
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
          الـ plugins تحصل على مجلد بيانات دائم عبر{" "}
          <code>{"${CLAUDE_PLUGIN_DATA}"}</code> (من الإصدار v2.1.78). هذا يبقى
          موجودًا بين الجلسات، فمناسب للـ caches وملفات الحالة والـ databases.
          استخدم <code>{"${CLAUDE_PLUGIN_ROOT}"}</code> للإشارة إلى مسارات نسبية
          من مجلد تثبيت الـ plugin — ضروري للـ hooks وإعدادات MCP:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".claude-plugin/plugin.json — hooks مع CLAUDE_PLUGIN_ROOT"
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
        <h3>مراقبات الـ Plugin</h3>
        <p>
          المراقبات تحتاج Claude Code v2.1.105 أو أحدث. عرّفها تحت مفتاح{" "}
          <code>experimental</code> في الـ manifest (
          <code>experimental.monitors</code>) — الشكل top-level لا يزال يعمل لكن{" "}
          <code>claude plugin validate</code> سيعرض تحذيرًا، وإصدار قادم سيجعل
          الشكل المتداخل إلزاميًا. مفتاح <code>monitors</code> في الـ manifest
          يربط الـ plugin بأداة Monitor. ضع JSON file (أو الإعداد inline) وتتفعّل
          المراقبات الخلفية تلقائيًا عند تفعيل الـ plugin في بداية الجلسة، أو
          عند استدعاء أي skill من الـ plugin:
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
        <Callout tone="warn" title="مسار monitors مخصص">
          عندما يحدد الـ manifest مسار <code>monitors</code> مخصصًا، الموقع
          الافتراضي <code>monitors/monitors.json</code> لا يُفحص بعد الآن — أضفه
          صراحةً إذا أردت تحميله بجانب ملفك المخصص.
        </Callout>
      </Reveal>

      <Reveal delay={420}>
        <h3>دعم LSP</h3>
        <p>
          دعم LSP يضيف تكاملًا مع language server protocol في الوقت الفعلي. ضع
          ملف <code>.lsp.json</code> في root الـ plugin لضبط language servers
          توفّر تشخيصات فورية و go-to-definition وبحث عن symbols أثناء التعديل:
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

      {/* ── التوزيع والتطوير ── */}
      <Reveal delay={0}>
        <h2>التوزيع والتطوير</h2>
        <p>
          جرّب الـ plugin محليًا بـ flag الـ <code>--plugin-dir</code> قبل
          التوزيع. يحمّل الـ plugin للجلسة الحالية فقط — بدون تثبيت:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename="bash"
          lang="bash"
          code={`claude --plugin-dir ./my-plugin
# اختبر عدة plugins في نفس الوقت:
claude --plugin-dir ./my-plugin --plugin-dir ./another-plugin`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          للـ plugins المستضافة كأرشيفات <code>.zip</code>، يحمّلها{" "}
          <code>--plugin-url</code> ويثبّتها للجلسة الحالية فقط بدون تثبيت دائم.
          كرّر الـ flag لعدة plugins:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename="bash"
          lang="bash"
          code={`claude --plugin-url https://example.com/my-plugin.zip
claude --plugin-url https://example.com/a.zip --plugin-url https://example.com/b.zip`}
        />
        <Callout tone="warn" title="أمان — أرشيفات خارجية">
          استخدم <code>--plugin-url</code> فقط مع روابط موثوقة — تحميل أرشيفات
          من مصادر خارجية يشغّل كودًا تابعًا لطرف ثالث على جهازك.
        </Callout>
      </Reveal>

      <Reveal delay={280}>
        <p>
          استخدم <code>/reload-plugins</code> لإعادة تحميل ملفات الـ plugin أثناء
          التطوير دون إعادة تشغيل الجلسة. يعيد قراءة جميع الـ manifests والـ
          skills والـ agents والـ hooks وإعدادات MCP فورًا.
        </p>
        <p>
          شاشات <code>/plugin</code> بتاعت Discover و Browse تعرض inventory كامل
          لكل ما سيثبّته الـ plugin قبل اتخاذ القرار — commands وagents وskills
          وhooks وأي MCP أو LSP servers يشحنها. هذا يجعل تقييم plugin من الـ
          marketplace قرارًا في شاشة واحدة.
        </p>
      </Reveal>

      {/* ── التثبيت من الـ Marketplace ── */}
      <Reveal delay={0}>
        <h2>التثبيت من الـ Marketplace</h2>
        <p>
          توزيع الـ plugins يتبع نموذج marketplace. الـ marketplace الرسمي من
          Anthropic هو <code>claude-plugins-official</code>. أضف marketplaces
          إضافية بـ <code>/plugin marketplace add owner/repo-name</code>. ثبّت
          plugins بـ <code>/plugin install plugin-name</code> أو{" "}
          <code>claude plugin install plugin-name@marketplace</code>:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename="bash"
          lang="bash"
          code={`# ثبّت من الـ marketplace الرسمي
/plugin install pr-review

# ثبّت من GitHub
/plugin install github:username/my-plugin

# ثبّت من مسار محلي (للاختبار)
/plugin install ./path/to/plugin`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          عندما يكون مصدر الـ plugin اختصار GitHub بصيغة <code>owner/repo</code>،
          تستنسخه Claude Code افتراضيًا عبر SSH. هذا يتعطل في بيئات CI والـ
          containers أو أي بيئة بلا SSH key مضبوط لـ <code>github.com</code>.
          اضبط <code>CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1</code> لإجبار الاستنساخ
          عبر HTTPS:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename="bash"
          lang="bash"
          code={`# اجبر HTTPS في الـ CI عند تثبيت plugins
CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1 claude plugin install owner/repo`}
        />
      </Reveal>

      {/* ── عرض حي: التثبيت ── */}
      <Reveal delay={280}>
        <p className="mb-3 text-sm font-medium text-fg-muted">
          عرض تفاعلي — تثبيت plugin واستدعاء skill بالـ namespace:
        </p>
        <Terminal
          script={installScript}
          title="claude — plugin install"
          loop={true}
          loopDelay={3000}
        />
      </Reveal>

      {/* ── التفعيل والتعطيل والتنظيف ── */}
      <Reveal delay={0}>
        <h2>التفعيل والتعطيل والتنظيف</h2>
        <p>
          <code>claude plugin enable</code> و{" "}
          <code>claude plugin disable</code> يشغّلان ويوقفان plugin مثبّت دون
          حذفه. الاثنان يقبلان اسم <code>{"<plugin>"}</code> (أو{" "}
          <code>{"<plugin>@<marketplace>"}</code> للتمييز) و{" "}
          <code>--scope</code> بقيمة <code>user</code> أو <code>project</code> أو{" "}
          <code>local</code> (الافتراضي: <code>user</code>). التعطيل على نطاق{" "}
          <code>project</code> يكتب الخيار في <code>.claude/settings.json</code>{" "}
          ليستلمه الفريق بأكمله؛ نطاق <code>user</code> يبقيه شخصيًا:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename="bash"
          lang="bash"
          code={`# شخصي: عطّل plugin مزعج لك فقط
claude plugin disable formatter@anthropics/claude-plugins

# فريق: أبقِ الـ plugin في الإعدادات لكن عطّله على مستوى المشروع
claude plugin disable formatter --scope project

# فعّله لاحقًا دون المساس بالتثبيت أو الإصدار
claude plugin enable formatter --scope project`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          <code>claude plugin prune</code> (جديد في v2.1.121، له الاسم البديل{" "}
          <code>autoremove</code>) يحذف الـ dependencies التي ثُبِّتت تلقائيًا
          ولا يحتاجها أي plugin مثبّت آخر — الـ plugins التي ثبّتها بنفسك لا
          تُمسّ. لإلغاء تثبيت plugin وتنظيف dependencies بتاعته دفعة واحدة:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename="bash"
          lang="bash"
          code={`# ألغِ تثبيت plugin ونظّف الـ auto-installs اليتيمة
claude plugin uninstall my-plugin --prune

# أو نظّف فقط (أبقِ جميع الـ plugins التي ثبّتها مباشرة)
claude plugin prune`}
        />
      </Reveal>

      <Reveal delay={280}>
        <p className="mb-3 text-sm font-medium text-fg-muted">
          عرض تفاعلي — تعطيل على مستوى المشروع، إعادة التفعيل، ثم تنظيف اليتيمة:
        </p>
        <Terminal
          script={manageScript}
          title="claude — plugin manage"
          loop={true}
          loopDelay={3000}
        />
      </Reveal>

      {/* ── أوامر دورة الحياة ── */}
      <Reveal delay={0}>
        <h2>أوامر دورة الحياة</h2>
        <p>نظرة سريعة على أوامر دورة حياة الـ plugin المدمجة:</p>
      </Reveal>

      <Reveal delay={70}>
        <div className="my-5 overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-subtle">
                <th className="px-4 py-3 text-right font-semibold text-fg">الأمر</th>
                <th className="px-4 py-3 text-right font-semibold text-fg">الوظيفة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["claude plugin list", "عرض جميع الـ plugins المثبّتة"],
                ["claude plugin enable <name>", "تفعيل plugin مثبّت"],
                ["claude plugin disable <name>", "تعطيل دون إلغاء التثبيت"],
                ["claude plugin uninstall <name>", "حذف plugin نهائيًا"],
                ["claude plugin validate", "التحقق من الـ manifest والتحذير من الحقول المهجورة"],
                ["claude plugin prune / autoremove", "حذف الـ dependencies اليتيمة المثبّتة تلقائيًا"],
                ["claude plugin details <name>", "عرض skills وagents وhooks وMCP/LSP وتكلفة الـ tokens"],
                ["claude plugin tag", "إنشاء git tag للإصدار (v2.1.118+، مع التحقق من الإصدار)"],
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

      {/* ── الـ Plugins المضمّنة ── */}
      <Reveal delay={0}>
        <h2>الـ Plugins المضمّنة في الإعدادات</h2>
        <p>
          نمط الـ inline plugin (<code>source: &apos;settings&apos;</code> من
          الإصدار v2.1.80) يتيح تعريف plugin مباشرة في ملف إعدادات دون الحاجة
          لـ repository منفصل. مفيد للأدوات الداخلية الصغيرة التي لا تستحق
          إنشاء repo كامل:
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

      {/* ── ضوابط المؤسسات ── */}
      <Reveal delay={140}>
        <h2>ضوابط المؤسسات</h2>
        <p>
          في بيئات المؤسسات، يتحكم ملف <code>managed-mcp.json</code> في أي MCP
          servers يمكن للـ plugins استخدامها. إعدادات <code>enabledPlugins</code>{" "}
          و<code>extraKnownMarketplaces</code> و<code>strictKnownMarketplaces</code>{" "}
          و<code>blockedMarketplaces</code> في الـ managed policy تتحكم في أي
          plugins و marketplaces مسموح بها على مستوى المؤسسة.
        </p>
        <Callout tone="warn" title="قيود subagents الـ plugins">
          الـ subagents الخاصة بالـ plugins لها frontmatter محدود — لا يمكنها
          تعريف <code>hooks</code> أو <code>mcpServers</code> أو{" "}
          <code>permissionMode</code> لمنع privilege escalation.
        </Callout>
      </Reveal>

      {/* ── الاختبار ── */}
      <Reveal delay={0}>
        <Quiz questions={quizQuestions} title="اختبر نفسك — الـ Plugins" />
      </Reveal>
    </Prose>
  );
}
