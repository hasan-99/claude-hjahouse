import { Prose, Callout, Quiz, type QuizQuestion } from "@/components/content";
import CodeBlock from "@/components/CodeBlock";
import Terminal, { type Step } from "@/components/Terminal";
import Reveal from "@/components/Reveal";

/* --------------------------------------------------------------------------
   Terminal demo: تكامل CI/CD — تشغيل claude -p في GitHub Actions
-------------------------------------------------------------------------- */
const ciScript: Step[] = [
  { t: "print", text: "# خطوة GitHub Actions — مراجعة الـ PR تلقائيًا", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "DIFF=$(git diff origin/main...HEAD)", tone: "user", prompt: "$" },
  { t: "wait", ms: 300 },
  { t: "type",
    text: 'REVIEW=$(echo "$DIFF" | claude -p "راجع هذه التغييرات. أخرج JSON بالحقول: summary, critical_issues, suggestions" --output-format json --permission-mode bypassPermissions)',
    tone: "user", prompt: "$", speed: 20 },
  { t: "wait", ms: 600 },
  { t: "print", text: "جارٍ تشغيل تحليل Claude Code…", tone: "amber" },
  { t: "wait", ms: 800 },
  { t: "out", lines: [
    { text: '{', tone: "green" },
    { text: '  "summary": "يضيف middleware للـ rate-limiting على /api/auth/login",', tone: "green" },
    { text: '  "critical_issues": [],', tone: "green" },
    { text: '  "suggestions": ["فكّر في إضافة unit tests للـ limiter", "سجّل الـ IPs المحجوبة في سجل التدقيق"]', tone: "green" },
    { text: '}', tone: "green" },
  ], gap: 55 },
  { t: "wait", ms: 500 },
  { t: "type", text: 'echo "$REVIEW" | jq \'.critical_issues[]\' >> $GITHUB_STEP_SUMMARY', tone: "user", prompt: "$" },
  { t: "wait", ms: 400 },
  { t: "print", text: "✓ تمّ نشر المراجعة في ملخص الخطوة", tone: "green" },
];

/* --------------------------------------------------------------------------
   Terminal demo: إنشاء Routine سحابي مجدول
-------------------------------------------------------------------------- */
const scheduleScript: Step[] = [
  { t: "print", text: "# إنشاء routine سحابي مجدول", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/schedule daily PR review at 9am", tone: "user", prompt: ">" },
  { t: "wait", ms: 600 },
  { t: "out", lines: [
    { text: "✓ تمّ إنشاء الـ routine: \"مراجعة يومية للـ PR الساعة 9 صباحًا\"", tone: "green" },
    { text: "  المشغّل: مجدول — كل يوم عمل الساعة 09:00", tone: "muted" },
    { text: "  المستودعات: org/repo (الحالي)", tone: "muted" },
    { text: "  موصّلات MCP: 3 مضمّنة", tone: "muted" },
  ], gap: 70 },
  { t: "wait", ms: 500 },
  { t: "type", text: "/schedule list", tone: "user", prompt: ">" },
  { t: "wait", ms: 500 },
  { t: "out", lines: [
    { text: "المعرف   الاسم                             التشغيل القادم", tone: "muted" },
    { text: "────────────────────────────────────────────────────────", tone: "muted" },
    { text: "r1   مراجعة يومية للـ PR الساعة 9 صباحًا   الاثنين 09:00", tone: "green" },
    { text: "r2   تدقيق أمني أسبوعي                    الأحد 02:00", tone: "green" },
  ], gap: 60 },
  { t: "wait", ms: 400 },
  { t: "type", text: "/schedule run r2", tone: "user", prompt: ">" },
  { t: "wait", ms: 600 },
  { t: "print", text: "✓ تمّ تشغيل الـ routine r2 فورًا", tone: "green" },
];

/* --------------------------------------------------------------------------
   Terminal demo: ultrareview + dynamic workflows
-------------------------------------------------------------------------- */
const workflowScript: Step[] = [
  { t: "print", text: "# تشغيل مراجعة شاملة للكود", tone: "system" },
  { t: "wait", ms: 300 },
  { t: "type", text: "/ultrareview", tone: "user", prompt: ">" },
  { t: "wait", ms: 800 },
  { t: "out", lines: [
    { text: "✦ جارٍ تشغيل جلسة المراجعة السحابية…", tone: "blue" },
    { text: "  جلب diff الـ branch (main..feature/auth-refactor)", tone: "muted" },
    { text: "  تشغيل agents المراجعة المتوازية:", tone: "muted" },
    { text: "    ▸ security-agent", tone: "purple" },
    { text: "    ▸ performance-agent", tone: "purple" },
    { text: "    ▸ coverage-agent", tone: "purple" },
  ], gap: 65 },
  { t: "wait", ms: 600 },
  { t: "print", text: "  تابع التقدم بـ /tasks", tone: "amber" },
  { t: "wait", ms: 1000 },
  { t: "print", text: "# تفعيل effort ultracode للـ orchestration التلقائي", tone: "system" },
  { t: "wait", ms: 300 },
  { t: "type", text: "/effort ultracode", tone: "user", prompt: ">" },
  { t: "wait", ms: 500 },
  { t: "print", text: "✓ مستوى الجهد: ultracode (xhigh + orchestration تلقائي للـ workflows)", tone: "green" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/deep-research ما الذي تغيّر في نموذج صلاحيات Node.js بين v20 و v22؟", tone: "user", prompt: ">" },
  { t: "wait", ms: 700 },
  { t: "out", lines: [
    { text: "⟳ نشر عمليات البحث عبر 8 زوايا مختلفة…", tone: "blue" },
    { text: "  جلب والتحقق من 24 مصدرًا…", tone: "muted" },
    { text: "  التصويت على 47 ادعاءً…", tone: "muted" },
    { text: "✓ التقرير جاهز — 12 نتيجة مُحالة بـ citations، تمّ تصفية 3 ادعاءات", tone: "green" },
  ], gap: 70 },
];

const quizQuestions: QuizQuestion[] = [
  {
    q: "أيّ flag يجعل claude -p يعمل بدون أي موافقات، مناسبًا لبيئات CI المؤتمتة بالكامل؟",
    options: [
      "--no-session-persistence",
      "--permission-mode bypassPermissions",
      "--bare",
      "--output-format json",
    ],
    answer: 1,
    explanation:
      "--permission-mode bypassPermissions يعطّل جميع طلبات الإذن حتى يستطيع Claude العمل بدون تدخل في pipelines الـ CI. --no-session-persistence يمنع حفظ الجلسة، و--bare يعطي output أنظف، لكن لا شيء منهما يتحكم في الصلاحيات.",
  },
  {
    q: "ماذا يفعل الـ flag --from-pr عند بدء جلسة Claude Code؟",
    options: [
      "يدمج الـ pull request تلقائيًا بعد المراجعة",
      "يبدأ جلسة بـ diff الـ PR ووصفه وتعليقات المراجعة",
      "يفتح نافذة المتصفح على رابط الـ pull request",
      "يُفعّل إشعارات push لحالة CI في الـ PR",
    ],
    answer: 1,
    explanation:
      "--from-pr يجلب الـ diff والوصف وتعليقات المراجعة حتى يستطيع Claude البدء فورًا في إصلاح أو توسيع ملاحظات الـ PR. يقبل روابط GitHub وGitLab وBitbucket اعتبارًا من v2.1.119.",
  },
  {
    q: "ما الفرق بين /ultrareview والمراجعة التفاعلية العادية مع Claude؟",
    options: [
      "يراجع الملفات المفتوحة في المحرر فقط",
      "يشغّل تحليلًا بـ agent واحد ويعيد تعليقات داخلية",
      "يشغّل مراجعة سحابية شاملة باستخدام تحليل multi-agent متوازٍ ونقدي",
      "يشترط تفعيل Zero Data Retention على الحساب",
    ],
    answer: 2,
    explanation:
      "/ultrareview يستخدم تحليلًا multi-agent متوازيًا على بنية Claude Code السحابية. حسابات Pro/Max تحصل على 3 runs مجانية لمرة واحدة؛ ما بعدها تكلف كل مراجعة تقريبًا $5–$20 كـ extra usage.",
  },
  {
    q: "ما الفرق بين /loop والـ Routine عند جدولة المهام المتكررة؟",
    options: [
      "/loop تستمر عبر جلسات الطرفية؛ الـ Routines تعمل فقط أثناء تشغيل Claude Code",
      "/loop مرتبطة بالجلسة وتتوقف حين يُغلق Claude Code؛ الـ Routines سحابية ومستقلة",
      "كلاهما سحابي، لكن /loop تدعم GitHub triggers بينما الـ Routines تدعم الجدولة الزمنية فقط",
      "الـ Routines تحتاج API trigger؛ /loop تستخدم cron expressions",
    ],
    answer: 1,
    explanation:
      "/loop تُنشئ فحوصات متكررة مرتبطة بالجلسة — تتوقف عند إغلاق Claude Code. الـ Routines مهام مجدولة سحابية تستمر على بنية Anthropic التحتية المُدارة بمستقلة عن جلسة الطرفية المحلية.",
  },
];

export default function Content() {
  return (
    <Prose>
      {/* ── مقدمة ── */}
      <Reveal delay={0}>
        <p>
          Claude Code بيتحوّل من مساعد تفاعلي لعضو فعلي في الفريق لما توصّله ببنية الأتمتة
          بتاعتك. الموديول ده بيغطي تكامل CI/CD، المهام المجدولة، تكامل GitHub Actions،
          وأنماط بناء سير عمل أتمتة موثوقة متعددة الخطوات.
        </p>
      </Reveal>

      {/* ── القسم الأول: تكامل CI/CD ── */}
      <Reveal delay={70}>
        <h2>تكامل CI/CD مع التشغيل البرمجي</h2>
      </Reveal>

      <Reveal delay={140}>
        <p>
          الـ flag <code>claude -p</code> هو أساس تكامل CI/CD. بيشغّل Claude بدون تفاعل،
          بيبعت prompt، وبيرجّع النتيجة على stdout. ادمجه مع{" "}
          <code>--output-format json</code> عشان output منظّم قابل للتحليل، و{" "}
          <code>--permission-mode bypassPermissions</code> للتشغيل الآلي الكامل بدون أي طلبات
          موافقة، و<code>--max-turns</code> عشان تحدد وقت التنفيذ.
        </p>
        <p>
          نمط شائع هو تشغيل Claude كجزء من عملية مراجعة الـ PR. ضبطه كخطوة في GitHub Actions:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".github/workflows/review.yml"
          lang="yaml"
          code={`- name: Claude Code Review
  run: |
    DIFF=$(git diff origin/main...HEAD)
    REVIEW=$(echo "$DIFF" | claude -p "Review these changes. Output JSON with fields: summary, critical_issues, suggestions" \\
      --output-format json \\
      --permission-mode bypassPermissions)
    echo "$REVIEW" | jq '.critical_issues[]' >> $GITHUB_STEP_SUMMARY`}
        />
      </Reveal>

      <Reveal delay={280}>
        <p>
          الـ flag <code>--from-pr</code> بيبدأ جلسة من pull request موجود. بيجيب الـ diff
          والوصف وتعليقات المراجعة عشان Claude يقدر يبدأ في إصلاح أو توسيع ملاحظات الـ PR
          فورًا. من v2.1.119، <code>--from-pr</code> بيقبل روابط من GitHub و GitHub
          Enterprise و GitLab merge requests و Bitbucket pull requests:
        </p>
      </Reveal>

      <Reveal delay={350}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`claude --from-pr https://github.com/org/repo/pull/123
claude --from-pr https://gitlab.com/org/repo/-/merge_requests/456
claude --from-pr https://bitbucket.org/org/repo/pull-requests/789`}
        />
      </Reveal>

      <Reveal delay={420}>
        <p>
          للأتمتة اللي بتستخدمها مرة واحدة، Claude يقدر يولّد tests لكود جديد، يحدّث
          الـ documentation لما الـ APIs تتغيّر، يشغّل linters ويصلّح المشاكل تلقائيًا،
          أو يفحص ثغرات أمنية. استخدم <code>--no-session-persistence</code> عشان ما يحفظش
          جلسة، واستخدم <code>--bare</code> لما تحتاج أنظف output ممكن في الـ scripts.
        </p>
        <p>
          استخدم <code>prUrlTemplate</code> (جديد في v2.1.119) عشان توجّه الـ footer PR
          badge لرابط مراجعة كود مخصص بدل رابط github.com الافتراضي — مفيد لـ enterprise
          deployments اللي عندها GitHub داخلي أو أدوات مراجعة مخصصة:
        </p>
      </Reveal>

      <Reveal delay={490}>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "prUrlTemplate": "https://review.example.internal/pr/{number}"
}`}
        />
      </Reveal>

      <Reveal delay={560}>
        <p>
          أمر <code>/install-github-app</code> بيعمل setup للتكامل الرسمي مع GitHub، واللي
          بيخلّي Claude يرد على منشنات <code>@claude</code> في تعليقات الـ PR والـ issues.
        </p>
      </Reveal>

      <Reveal delay={630}>
        <Terminal
          script={ciScript}
          title="GitHub Actions — claude -p review"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      {/* ── الإشعارات والمراقبة التلقائية ── */}
      <Reveal delay={700}>
        <h3>الإشعارات الفورية على الموبايل</h3>
        <p>
          لما الـ Remote Control مفعّل، Claude يقدر يبعت إشعارات فورية على موبايلك. Claude
          بيقرر إمتى يبعت — عادةً لما مهمة طويلة تخلص أو لما يحتاج قرار منك عشان يكمّل.
          كمان ممكن تطلب واحد في الـ prompt:{" "}
          <em>notify me when the tests finish</em>. الإعداد محتاج تطبيق Claude على الموبايل
          (iOS أو Android)، مسجّل بنفس الحساب، و <strong>Push when Claude decides</strong>{" "}
          مفعّل في <code>/config</code>. محتاج Claude Code v2.1.110+.
        </p>
      </Reveal>

      <Reveal delay={770}>
        <p>
          لمراقبة الـ PRs التلقائية، <code>/autofix-pr</code> بيعمل جلسة Claude Code على
          الويب بتراقب PR الـ branch الحالي. لما CI يفشل أو reviewer يعلّق، Claude بيحقق
          ويدفع fix. حدد النطاق بـ prompt:{" "}
          <code>/autofix-pr only fix lint and type errors</code>. محتاج Claude GitHub App
          يكون متثبّت على الريبو وaccess لـ Claude Code على الويب، ومش متاح للمؤسسات اللي
          فعّلوا Zero Data Retention.
        </p>
      </Reveal>

      <Reveal delay={840}>
        <Callout tone="info" title="/ultrareview — مراجعة multi-agent متوازية">
          <code>/ultrareview</code> (جديد في v2.1.86، تمّ إبرازه في v2.1.112) بيعمل مراجعة
          شاملة للكود في cloud باستخدام analysis وcritique من multi-agent متوازية. محتاج
          تسجيل دخول بـ Claude.ai — لو مسجّل بـ API key بس، شغّل <code>/login</code> الأول.
          استدعيه من غير arguments عشان تراجع الـ branch الحالي، أو{" "}
          <code>/ultrareview &lt;PR#&gt;</code> عشان تجيب وتراجع PR محدد من GitHub.
          Pro/Max بياخدوا ٣ runs مجانية لمرة واحدة (مبتتجددش)؛ بعدين كل مراجعة بتكلف
          تقريبًا $5–$20 كـ extra usage. Team/Enterprise مفيش ليهم runs مجانية.
        </Callout>
      </Reveal>

      <Reveal delay={910}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`/ultrareview           # راجع الـ branch الحالي
/ultrareview 456       # راجع PR #456 من GitHub`}
        />
      </Reveal>

      {/* ── القسم الثاني: الجدولة والـ Routines ── */}
      <Reveal delay={0}>
        <h2>المهام المجدولة والـ Routines والأتمتة في الخلفية</h2>
      </Reveal>

      <Reveal delay={70}>
        <p>
          Claude Code بيدعم طبقات جدولة متعددة. <code>/loop</code> بيعمل فحوصات متكررة
          داخل الجلسة طول ما Claude Code شغّال. الـ Routines هي مهام مجدولة في الـ cloud
          بتفضل شغّالة مستقلة عن الـ terminal المحلي — كل run بيعمل clone جديد للريبو،
          يشتغل لوحده، ويقدر يعمل push لـ branches أو يفتح PRs.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`# فحص حالة البناء كل 5 دقائق (داخل الجلسة)
/loop 5m check if the build succeeded and summarize any failures

# إنشاء routine سحابي من الـ CLI
/schedule "run a full security audit at 2am"
/schedule daily PR review at 9am`}
        />
      </Reveal>

      <Reveal delay={210}>
        <h3>الـ Routines</h3>
        <p>
          الـ routine هو إعداد Claude Code محفوظ — prompt وريبو واحد أو أكتر ومجموعة
          connectors — بيتحزم مرة واحدة ويشتغل تلقائيًا على بنية Anthropic التحتية المُدارة.
          أنشئهم وأدِرهم من الويب على <code>claude.ai/code/routines</code>، أو من الـ Desktop
          app، أو عبر <code>/schedule</code> في الـ CLI. استخدم <code>/schedule list</code>{" "}
          لعرض كل الـ routines، و<code>/schedule update</code> لتعديل واحد، و{" "}
          <code>/schedule run</code> لتشغيل واحد فورًا.
        </p>
        <p>كل routine ممكن يكون عنده أكتر من trigger مع بعض:</p>
        <ul>
          <li>
            <strong>مجدول</strong> — تكرار دوري (كل ساعة، يومي، أيام العمل، أسبوعي) أو
            تشغيل لمرة واحدة في وقت محدد. التشغيل لمرة واحدة مش بيتحسب من الحد اليومي.
            cron expressions مخصصة متاحة عبر <code>/schedule update</code> (أقل فاصل: ساعة).
          </li>
          <li>
            <strong>API</strong> — endpoint HTTP مخصص لكل routine. ابعت POST بـ bearer token
            عشان تشغّل run، مع إمكانية تمرير سياق في حقل <code>text</code>. وصّله بأنظمة
            التنبيه أو pipelines النشر أو الأدوات الداخلية.
          </li>
          <li>
            <strong>GitHub</strong> — بيتفاعل مع أحداث الريبو زي pull requests أو releases.
            الفلاتر بتخلّيك تضيّق حسب المؤلف والعنوان والـ labels والـ base/head branch وحالة
            الـ draft وغيرها. محتاج Claude GitHub App متثبّت على الريبو.
          </li>
        </ul>
      </Reveal>

      <Reveal delay={280}>
        <Callout tone="note" title="صلاحيات الـ Routines">
          الـ Routines بتشتغل كجلسات Claude Code سحابية كاملة من غير أي permission prompts.
          بتقدر تستخدم الـ MCP connectors المتوصلة بتاعتك (مضافة افتراضيًا — شيل اللي مش
          محتاجها). افتراضيًا، Claude بيقدر يعمل push بس لـ branches بتبدأ بـ{" "}
          <code>claude/</code>؛ فعّل <strong>Allow unrestricted branch pushes</strong> لكل
          ريبو لو محتاج. الـ Routines متاحة على خطط Pro وMax وTeam وEnterprise.
        </Callout>
      </Reveal>

      <Reveal delay={350}>
        <Terminal
          script={scheduleScript}
          title="الـ Routines — /schedule"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      <Reveal delay={420}>
        <h3>الأتمتة في الخلفية</h3>
        <p>
          الـ subagents في الخلفية بـ <code>background: true</code> في الـ frontmatter
          بتاعهم بيشتغلوا من غير ما يعطّلوا المحادثة الرئيسية. ده بيخلّيك تبدأ تحليل طويل،
          تكمّل شغل تاني، وتتبلّغ لما يخلص. استخدم أحداث الـ hook الموثّقة في سياقاتها
          الصحيحة: <code>TaskCompleted</code> لتغييرات حالة المهمة و{" "}
          <code>TeammateIdle</code> لما عضو في فريق الـ agents على وشك يبقى idle.
        </p>
      </Reveal>

      <Reveal delay={490}>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "hooks": {
    "TaskCompleted": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "curl -X POST $SLACK_WEBHOOK -d '{\"text\": \"Task completed: $TASK_NAME\"}'"
          }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      <Reveal delay={560}>
        <p>
          للأبحاث الطويلة اللي بتمتد على جلسات متعددة، الـ agents القابلة للاستئناف وسير
          عمل الذاكرة العادي هي النموذج الأأمن: خلّي الـ agent يكتب نتائجه في الذاكرة أو
          ملفات المشروع، وبعدين استأنف الـ agent أو الجلسة لاحقًا لما تحتاج.
        </p>
      </Reveal>

      {/* ── القسم الثالث: Dynamic Workflows ── */}
      <Reveal delay={0}>
        <h2>الـ Dynamic Workflows</h2>
      </Reveal>

      <Reveal delay={70}>
        <p>
          بعد patterns الجلسات المفردة، Claude Code بيدعم{" "}
          <strong>dynamic workflows</strong> — ميزة في الـ research preview اتضافت في
          v2.1.154 بتخلّيك تنسّق من dozens لـ hundreds من subagents من script بلغة JavaScript
          بيكتبه Claude. على عكس <code>/loop</code> أو <code>/batch</code> اللي بيشتغلوا
          جوه محادثة واحدة، الـ workflow بينقل الخطة لـ script: الـ script هو اللي ماسك
          الـ loop والـ branching والنتائج الوسيطة، فـ context بتاع Claude يفضل فيه الإجابة
          النهائية بس.
        </p>
        <p>
          عشان تشغّل workflow، حُط كلمة <code>ultracode</code> في أي مكان في الـ prompt
          (الكلمة اتسمّت من <code>workflow</code> لـ <code>ultracode</code> في v2.1.160؛
          لو طلبت workflow بصياغتك الطبيعية لسه شغّال)، أو فعّل{" "}
          <code>/effort ultracode</code> عشان Claude يخطّط واحد لكل مهمة أساسية. Claude
          بيكتب orchestration script متفصّل على هدفك، وبعدين runtime بينفّذه في الخلفية
          والجلسة بتاعتك فاضلة شغّالة. الـ dynamic workflows بتنفع للـ audits على مستوى
          الـ codebase كله، والـ migrations الكبيرة، والبحث المُتحقّق منه، وأي مهمة محتاجة
          agents أكتر مما تقدر جلسة واحدة تنسّقه.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <p>
          الـ workflow المدمج <code>/deep-research &lt;question&gt;</code> بيعمل أتمتة للبحث
          من مصادر متعددة: بينشر web searches على زوايا مختلفة، يجيب المصادر ويتحقق منها
          مع بعض، يعمل vote على كل claim، ويرجّع تقرير بـ citations مع شطب الـ claims اللي
          ما عدّتش التحقّق. محتاج الـ WebSearch tool يكون متاح:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`/deep-research What changed in the Node.js permission model between v20 and v22?`}
        />
      </Reveal>

      <Reveal delay={280}>
        <p>
          شغّل <code>/workflows</code> عشان تشوف الـ workflows الشغّالة والمكتملة وتفتح
          progress view بيعرض لكل phase عدد الـ agents وإجمالي الـ tokens والوقت المنقضي.
          لما run يعمل اللي إنت عايزه، اختاره في الـ <code>/workflows</code> view واضغط{" "}
          <kbd>s</kbd> عشان تحفظ الـ script بتاعه كـ command — وبعدين بيشتغل كـ{" "}
          <code>/&lt;name&gt;</code> في الجلسات الجاية. إعادة الاستخدام بتفيد في الشغل
          المتكرر زي مراجعة كود أسبوعية أو checklist إصدار.
        </p>
        <p>
          للحصول على أقصى عمق استدلال، <code>/effort ultracode</code> بيجمع بين effort نوع{" "}
          <code>xhigh</code> وorchestration workflow تلقائي — Claude بيحدد إمتى المهمة
          محتاجة workflow وبينسّق الـ agents من غير ما حد يطلب منه. بيفضل شغّال للجلسة
          الحالية؛ ارجع لـ <code>/effort high</code> للشغل الروتيني.
        </p>
      </Reveal>

      <Reveal delay={350}>
        <Callout tone="warn" title="متطلبات الـ Dynamic Workflows">
          الـ dynamic workflows محتاجة Claude Code v2.1.154+ ومتاحة على كل الخطط المدفوعة
          (Pro وMax وTeam وEnterprise). على Pro، فعّلها من صف Dynamic workflows في{" "}
          <code>/config</code>. عشان تعطّلها، اقفل Dynamic workflows من <code>/config</code>،
          أو اضبط <code>&quot;disableWorkflows&quot;: true</code> في الإعدادات، أو اضبط{" "}
          <code>CLAUDE_CODE_DISABLE_WORKFLOWS=1</code>. الـ dynamic workflows متاحة كمان
          على Amazon Bedrock وGoogle Cloud Vertex AI وMicrosoft Foundry (Claude Code v2.1.154+).
        </Callout>
      </Reveal>

      <Reveal delay={420}>
        <Terminal
          script={workflowScript}
          title="ultrareview + dynamic workflows"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      {/* ── القسم الرابع: أنماط سير العمل متعدد الخطوات ── */}
      <Reveal delay={0}>
        <h2>أنماط سير العمل متعدد الخطوات</h2>
      </Reveal>

      <Reveal delay={70}>
        <p>
          أكتر سير عمل موثوق بيدمج skills و hooks و subagents في pipeline كل خطوة فيها
          عندها inputs واضحة، outputs، ومعالجة أخطاء.
        </p>
        <p>
          نمط <strong>&quot;طوّر وتحقق&quot;</strong> (develop and verify) بيربط prompt hook
          من نوع <code>Stop</code> بيفحص معايير الإكمال مع skill التنفيذ. لما Claude يوقف،
          الـ hook بيقيّم لو كل المتطلبات اتحققت. لو لأ، بيقول لـ Claude إيه الناقص
          وClaude بيكمّل:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Check: 1) Were all files in the spec modified? 2) Do tests pass? 3) Is the implementation complete per the requirements? If anything is incomplete, explain what remains.",
            "timeout": 30
          }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      <Reveal delay={210}>
        <p>
          نمط <strong>&quot;المراجعة المتوازية&quot;</strong> (parallel review) بيستخدم
          Agent Teams (تجريبي، مقفول افتراضيًا — محتاج{" "}
          <code>CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1</code>) عشان متخصصين مختلفين
          يراجعوا في نفس الوقت. agent بيفحص الأمان، واحد تاني بيفحص الأداء، وواحد تالت
          بيفحص تغطية الـ tests. قائد الفريق بيجمّع نتائجهم في تقرير واحد. الـ Agent Teams
          عندها قيود معروفة حول استئناف الجلسات وتنسيق المهام وسلوك الإيقاف.
        </p>
      </Reveal>

      <Reveal delay={280}>
        <p>
          للمهام اللي بتعدّل ملفات كتيرة عبر الكود، <code>/batch &lt;instruction&gt;</code>{" "}
          بيخطط الشغل، بيقسّمه على agents في الخلفية في git worktrees منعزلة، ومصمّم
          للـ refactors الكبيرة أو التغييرات المتكررة. حسب سير العمل، ممكن كمان يشغّل
          خطوات تحقق ويساعد يفتح PRs للنتائج.
        </p>
        <p>
          الـ git worktrees (<code>isolation: worktree</code> على الـ subagents) مفيدة كمان
          للشغل التجريبي. الـ agent بيعمل التغييرات في branch منعزل، بيرجّع مسار الـ
          worktree لما يخلص، وأنت بتراجع أو تلغي من غير ما تأثر على الـ working tree بتاعك.
        </p>
      </Reveal>

      <Reveal delay={350}>
        <Callout tone="tip" title="استراتيجية تركيب سير العمل">
          ادمج هذه الأنماط: استخدم Routine عشان تشغّل دوريًا، خلّيه ينشئ dynamic workflow
          ينسّق subagents في worktrees، وربّط hook من نوع <code>TaskCompleted</code> عشان
          يبعت إشعار Slack لما كل agent يخلص. كل طبقة بتضيف موثوقية من غير ما تعقّد أي
          جزء لوحده.
        </Callout>
      </Reveal>

      {/* ── اختبار قصير ── */}
      <Reveal delay={420}>
        <Quiz questions={quizQuestions} title="سير العمل — اختبار سريع" />
      </Reveal>
    </Prose>
  );
}
