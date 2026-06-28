import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Quiz, Prose, type QuizQuestion } from "@/components/content";

/* ---- Terminal demo scripts ---- */

const headlessScript: Step[] = [
  { t: "print", text: "# مراجعة الكود آليًا عبر claude -p", tone: "muted" },
  { t: "wait", ms: 400 },
  {
    t: "type",
    text: 'git diff HEAD~1 | claude -p "review for security issues" --output-format json --permission-mode bypassPermissions',
    tone: "user",
    prompt: "$",
  },
  { t: "wait", ms: 700 },
  {
    t: "out",
    lines: [
      { text: '{"findings":[', tone: "green" },
      { text: '  {"severity":"HIGH","file":"auth.ts","line":42,', tone: "green" },
      { text: '   "message":"User input passed to eval() without sanitization"},', tone: "green" },
      { text: '  {"severity":"LOW","file":"utils.ts","line":17,', tone: "green" },
      { text: '   "message":"console.log left in production code"}', tone: "green" },
      { text: "]}",  tone: "green" },
    ],
    gap: 55,
  },
  { t: "wait", ms: 800 },
  {
    t: "type",
    text: 'claude -p "generate JSDoc for all functions in $CHANGED_FILE" --print --no-session-persistence',
    tone: "user",
    prompt: "$",
  },
  { t: "wait", ms: 600 },
  { t: "out", lines: [{ text: "✓ JSDoc written to src/utils.ts", tone: "green" }] },
];

const autoModeScript: Step[] = [
  { t: "print", text: "# فحص قواعد الوضع التلقائي", tone: "muted" },
  { t: "wait", ms: 400 },
  { t: "type", text: "claude auto-mode defaults", tone: "user", prompt: "$" },
  { t: "wait", ms: 600 },
  {
    t: "out",
    lines: [
      { text: "Built-in hard_deny rules:", tone: "amber" },
      { text: "  • Never exfiltrate repo contents to 3rd-party APIs", tone: "default" },
      { text: "  • Never push to production branches without approval", tone: "default" },
      { text: "Built-in soft_deny rules:", tone: "amber" },
      { text: "  • Caution on force-push, DB drops, mass deletes", tone: "default" },
    ],
    gap: 65,
  },
  { t: "wait", ms: 500 },
  { t: "type", text: "claude auto-mode config", tone: "user", prompt: "$" },
  { t: "wait", ms: 500 },
  {
    t: "out",
    lines: [
      { text: "Effective merged config:", tone: "blue" },
      { text: '  allow:    ["$defaults", "Deploying to staging is allowed"]', tone: "green" },
      { text: '  soft_deny:["$defaults", "Never run migrations outside CLI"]', tone: "green" },
      { text: '  hard_deny:["$defaults", "Never send repo to 3rd-party APIs"]', tone: "green" },
    ],
    gap: 65,
  },
];

const sandboxScript: Step[] = [
  { t: "print", text: "# تشغيل sandbox مع التحليل البرمجي", tone: "muted" },
  { t: "wait", ms: 400 },
  {
    t: "type",
    text: 'claude -p "analyze the security of this codebase" --sandbox --permission-mode plan --output-format json',
    tone: "user",
    prompt: "$",
  },
  { t: "wait", ms: 700 },
  { t: "out", lines: [
    { text: "◆ sandbox enabled — OS-level isolation active", tone: "amber" },
    { text: "◆ network: github.com, *.npmjs.org  (uploads.github.com denied)", tone: "amber" },
  ]},
  { t: "out", lines: [
    { text: "Planning…", tone: "muted" },
    { text: "  [1/4] Scanning dependency tree", tone: "blue" },
    { text: "  [2/4] Checking for known CVEs", tone: "blue" },
    { text: "  [3/4] Auditing auth surface", tone: "blue" },
    { text: "  [4/4] Writing report", tone: "blue" },
    { text: '{"summary":"3 high, 1 critical issue found"}', tone: "green" },
  ], gap: 90 },
];

const purgeScript: Step[] = [
  { t: "print", text: "# معاينة ثم مسح بيانات المشروع", tone: "muted" },
  { t: "wait", ms: 400 },
  { t: "type", text: "claude project purge --dry-run", tone: "user", prompt: "$" },
  { t: "wait", ms: 600 },
  {
    t: "out",
    lines: [
      { text: "Would delete:", tone: "amber" },
      { text: "  ~/.claude/projects/my-app/transcripts/  (47 files)", tone: "default" },
      { text: "  ~/.claude/projects/my-app/tasks.json", tone: "default" },
      { text: "  ~/.claude/projects/my-app/history.db", tone: "default" },
    ],
    gap: 65,
  },
  { t: "wait", ms: 500 },
  { t: "type", text: "claude project purge --yes", tone: "user", prompt: "$" },
  { t: "wait", ms: 500 },
  { t: "out", lines: [{ text: "✓ Project state purged.", tone: "green" }] },
];

/* ---- Quiz ---- */
const questions: QuizQuestion[] = [
  {
    q: "أي flag يشغّل Claude Code بدون تفاعل ويرسل الـ output لـ stdout؟",
    options: [
      "--headless",
      "-p / --print",
      "--non-interactive",
      "--batch",
    ],
    answer: 1,
    explanation:
      'الأمر claude -p "prompt" (اختصار لـ --print) يعمل بدون تفاعل ويرسل الـ output لـ stdout، مما يتيح دمجه في pipelines الـ shell أو سكربتات CI.',
  },
  {
    q: "في الوضع التلقائي، أي طبقة من القواعد تمنع الأدوات بشكل غير مشروط حتى لو طلب المستخدم صراحة؟",
    options: ["allow", "soft_deny", "hard_deny", "environment"],
    answer: 2,
    explanation:
      "قواعد hard_deny غير مشروطة: لا نية المستخدم ولا استثناءات allow تستطيع تجاوزها. أما soft_deny فيمكن تجاوزه بنية صريحة من المستخدم أو قواعد allow.",
  },
  {
    q: "ما الذي يفعله تضمين \"$defaults\" في مصفوفات autoMode؟",
    options: [
      "يعيد المصفوفة للإعدادات الافتراضية",
      "يحافظ على القواعد المدمجة ويضيف القواعد المخصصة بجانبها",
      "يعطّل كل القواعد المدمجة لذلك المستوى",
      "يوجّه المصفوفة للإعدادات المُدارة فقط",
    ],
    answer: 1,
    explanation:
      'بدون "$defaults"، مصفوفتك تحلّ محل الافتراضيات بالكامل. تضمينها يدمجهم معًا، فقواعدك المخصصة تعمل بجانب قواعد الأمان الموجودة.',
  },
  {
    q: "أي إعداد يتحكم في مدة الاحتفاظ بملفات الجلسة قبل حذفها تلقائيًا عند بدء التشغيل؟",
    options: [
      "sessionRetentionDays",
      "transcriptTTL",
      "cleanupPeriodDays",
      "sessionMaxAge",
    ],
    answer: 2,
    explanation:
      "إعداد cleanupPeriodDays في settings.json يحدد مدة الاحتفاظ (الافتراضي 30، الحد الأدنى 1). يتحكم أيضًا في إزالة worktrees الوكلاء الفرعيين المهجورة عند بدء التشغيل.",
  },
];

/* ============================================================ */
export default function Content() {
  return (
    <Prose>
      {/* مقدمة */}
      <Reveal delay={0}>
        <p>
          Claude Code فيه مجموعة ميزات متقدمة المستخدمون المحترفون بيحتاجوها في الشغل المعقّد أو
          اللي فيه مخاطرة. وضع التخطيط، التفكير الموسّع، الوضع التلقائي، الـ sandboxing،
          والتشغيل البرمجي — كل واحد من دول بيغيّر طريقة شغل Claude بشكل جوهري. الموديول ده
          بيشرح كل واحد بالتفصيل.
        </p>
      </Reveal>

      {/* ── وضع التخطيط والتفكير الموسّع ── */}
      <Reveal delay={70}>
        <h2>وضع التخطيط والتفكير الموسّع</h2>
      </Reveal>
      <Reveal delay={140}>
        <p>
          وضع التخطيط بيفصل التفكير عن التنفيذ. لما تفعّله، Claude بيعمل بحث في الكود الأول
          ويعمل خطة تنفيذ مفصّلة. أنت بتراجع الخطة وممكن تعدّل عليها، وبعدين Claude ينفّذها.
          ده بيمنع المشكلة الشائعة إن Claude يبدأ يكتب كود قبل ما يفهم المشكلة كويس.
        </p>
        <p>
          فعّله بأمر <code>/plan &lt;description&gt;</code>، أو flag الـ{" "}
          <code>--permission-mode plan</code> في الـ CLI، أو <kbd>Shift+Tab</kbd> عشان تتنقل
          بين الأوضاع. استخدم <kbd>Ctrl+G</kbd> عشان تفتح الخطة الحالية في الـ editor الخارجي
          بتاعك وتعدّل عليها بالتفصيل قبل ما توافق. الـ alias{" "}
          <code>opusplan</code> بيوجّه التخطيط لـ Opus والتنفيذ لـ Sonnet:
        </p>
      </Reveal>
      <Reveal delay={210}>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`claude --model opusplan "redesign the database schema for multi-tenancy"`}
        />
      </Reveal>
      <Reveal delay={280}>
        <p>
          التفكير الموسّع بيدي Claude وقت أكتر يفكّر قبل ما يرد. فعّله وقفّله بـ{" "}
          <kbd>Option+T</kbd> (على macOS) أو <kbd>Alt+T</kbd>. أمر <code>/effort</code> بيحدد
          عمق التفكير: <code>low</code> أو <code>medium</code> أو <code>high</code> أو{" "}
          <code>xhigh</code> أو <code>max</code> (للجلسة الحالية بس). ضبطه للجلسة كلها بـ:
        </p>
      </Reveal>
      <Reveal delay={350}>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`export CLAUDE_CODE_EFFORT_LEVEL=high`}
        />
      </Reveal>
      <Reveal delay={420}>
        <p>
          لو عايز أعلى مستوى تفكير، اكتب كلمة <strong>ultrathink</strong> في الـ prompt — دي
          بتفعّل وضع التفكير العميق بغض النظر عن إعداد الـ effort الحالي. كلمة{" "}
          <strong>ultracode</strong> بتفعّل dynamic workflow run (اتسمّت من{" "}
          <code>workflow</code> لـ <code>ultracode</code> في v2.1.160).{" "}
          <code>MAX_THINKING_TOKENS=0</code> بيوقف التفكير على Opus 4.6 و Sonnet 4.6 بس؛ على
          Opus 4.7 والأحدث الـ adaptive reasoning دايمًا شغّال والمتغير ده مش بيأثر.
        </p>
        <p>
          الجمع بين وضع التخطيط ومستوى effort عالي مناسب للقرارات المعمارية الكبيرة:
        </p>
      </Reveal>
      <Reveal delay={490}>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`claude --permission-mode plan --effort high --model opusplan "migrate from REST to GraphQL"`}
        />
      </Reveal>

      {/* ── Ultraplan ── */}
      <Reveal delay={0}>
        <h2>Ultraplan: التخطيط في الـ Cloud</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          Ultraplan بيوسّع وضع التخطيط عن طريق إنه يبعت الخطة لجلسة Claude Code على الويب.
          Claude بيعمل draft للخطة في الـ cloud وأنت الـ terminal بتاعك فاضي. بعدين تفتحها في
          المتصفح وتعلّق على أجزاء معينة، تطلب تعديلات، وتختار فين تنفّذها.
        </p>
        <p>
          تلات طرق تشغّلها: أمر <code>/ultraplan &lt;prompt&gt;</code>، أو اكتب كلمة{" "}
          <strong>ultraplan</strong> في أي prompt عادي، أو اختار &ldquo;Refine with Ultraplan on
          the web&rdquo; من حوار خطة محلية خلصت.
        </p>
        <p>
          بعد ما تشغّلها، بيظهر مؤشر حالة عند الـ prompt: <code>◇ ultraplan</code> وهو
          بيحضّر، <code>◇ ultraplan needs your input</code> لما Claude عنده أسئلة، و{" "}
          <code>◆ ultraplan ready</code> لما الخطة جاهزة. افتح لينك الجلسة على claude.ai
          عشان تراجع — تقدر تعلّق inline على أقسام معينة وتطلب تعديلات قبل ما توافق.
        </p>
      </Reveal>
      <Reveal delay={140}>
        <p>لما توافق، عندك مسارين:</p>
        <ul>
          <li>
            <strong>نفّذ على الويب</strong> — Claude بينفّذ الخطة في الـ cloud، وأنت تراجع
            الـ diff وتفتح PR من المتصفح.
          </li>
          <li>
            <strong>ارجع للـ terminal</strong> — الخطة بتترحّل للـ CLI بتاعك عشان تنفّذها
            محلي مع كامل صلاحيات بيئتك.
          </li>
        </ul>
      </Reveal>
      <Reveal delay={210}>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`/ultraplan migrate the auth service from sessions to JWTs`}
        />
        <Callout tone="warn" title="مطلوب اشتراك">
          Ultraplan محتاج اشتراك claude.ai و GitHub repository متوصّل. مش متاح على Bedrock أو
          Vertex AI أو Foundry.
        </Callout>
      </Reveal>

      {/* ── الوضع التلقائي ── */}
      <Reveal delay={0}>
        <h2>الوضع التلقائي والتحكم في الصلاحيات</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          الوضع التلقائي (Auto Mode) هو وضع صلاحيات تجريبي بيستخدم classifier أمان في الخلفية
          عشان يقرر إذا كانت الأدوات آمنة تشتغل من غير ما يسألك. مصمّم للشغل اللي محتاج
          autonomy أعلى مع الحفاظ على حواجز الأمان.
        </p>
        <p>
          بتستخدمه زي أي وضع صلاحيات تاني: اختار <code>auto</code> في إعدادات الصلاحيات أو
          اتنقل ليه بـ <kbd>Shift+Tab</kbd>. لما الـ permission check يعلق، الـ spinner بيتحول
          للأحمر — ده بيخلّي واضح إن فيه check قيد التنفيذ مش أداة شغّالة.
        </p>
      </Reveal>
      <Reveal delay={140}>
        <h3>أولوية الـ classifier (أربع طبقات)</h3>
        <ul>
          <li>
            <strong>hard_deny</strong> — بيمنع بشكل غير مشروط؛ نية المستخدم واستثناءات allow
            مش بتطبّق.
          </li>
          <li>
            <strong>soft_deny</strong> — بيمنع في الأساس، بس نية المستخدم واستثناءات{" "}
            <code>allow</code> ممكن تتخطاه.
          </li>
          <li>
            <strong>allow</strong> — بيتخطى قواعد <code>soft_deny</code> المطابقة.
          </li>
          <li>
            <strong>نية المستخدم الصريحة</strong> — بتتخطى الـ soft blocks المتبقية. طلب{" "}
            &ldquo;force-push this branch&rdquo; يتخطى الـ soft block، بس طلب عام زي &ldquo;clean
            up the repo&rdquo; لأ.
          </li>
        </ul>
        <p>
          لو الـ classifier منع action تلات مرات متتالية أو عشرين مرة إجمالية، الـ auto mode
          بيتوقف و Claude Code بيرجع يسألك. الحدود دي مش قابلة للتعديل.
        </p>
      </Reveal>
      <Reveal delay={210}>
        <p>
          دايمًا ضمّن <code>&quot;$defaults&quot;</code> في مصفوفاتك المخصصة عشان تحافظ على
          القواعد المدمجة جنب إضافاتك. من غيرها، مصفوفتك بتحل محل الافتراضيات بالكامل:
        </p>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "autoMode": {
    "allow":      ["$defaults", "Deploying to staging is allowed"],
    "soft_deny":  ["$defaults", "Never run migrations outside the migrations CLI"],
    "hard_deny":  ["$defaults", "Never send repo contents to third-party APIs"],
    "environment":["$defaults", "Internal API: api.corp.example.com"]
  }
}`}
        />
      </Reveal>
      <Reveal delay={280}>
        <h3>طيف أوضاع الصلاحيات</h3>
        <p>
          أوضاع الصلاحيات بتتراوح من الأقل للأكتر حرية. <code>default</code> بيقرأ بحرية بس
          بيسألك قبل أي كتابة. <code>acceptEdits</code> بيوافق تلقائيًا على تعديلات الملفات.{" "}
          <code>plan</code> بيدخل وضع التخطيط الأول. <code>auto</code> بيستخدم الـ classifier.{" "}
          <code>dontAsk</code> بيشغّل بس الأدوات المعتمدة مسبقًا. <code>bypassPermissions</code>{" "}
          بيوافق على كل حاجة من غير ما يسألك — بما فيها المجلدات المحمية ابتداءً من v2.1.126.
        </p>
      </Reveal>
      <Reveal delay={350}>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`# ابدأ جلسة في وضع محدد
claude --permission-mode plan "draft the migration"
claude -p "audit dependencies" --permission-mode dontAsk

# اضبط افتراضي عشان أغلب الجلسات تبدأ في الوضع اللي عايزه
# settings.json:
# { "permissions": { "defaultMode": "acceptEdits" } }`}
        />
      </Reveal>
      <Reveal delay={420}>
        <p>توافر Auto Mode حسب المنصة:</p>
        <ul>
          <li>
            <strong>Anthropic API</strong> — متاح بشكل افتراضي طول ما حسابك مستوفي المتطلبات.
          </li>
          <li>
            <strong>Bedrock / Vertex AI / Foundry (v2.1.158+)</strong> — مقفول لحد ما تضبط{" "}
            <code>CLAUDE_CODE_ENABLE_AUTO_MODE=1</code>؛ بس Opus 4.7 و Opus 4.8 مدعومين.
          </li>
          <li>
            <strong>الموديلات الأقدم</strong> — Sonnet 4.5 و Opus 4.5 و Haiku و Claude 3
            مبتاخدوش Auto Mode على أي provider.
          </li>
        </ul>
        <p>
          المسؤولون يقدروا يقفلوا الوضع نهائيًا بـ{" "}
          <code>permissions.disableAutoMode: &quot;disable&quot;</code> في الـ managed settings.
        </p>
      </Reveal>
      <Reveal delay={490}>
        <Terminal
          script={autoModeScript}
          title="فحص الوضع التلقائي"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      {/* ── التشغيل البرمجي والـ Sandbox ── */}
      <Reveal delay={0}>
        <h2>التشغيل البرمجي والـ Sandboxing</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          لما تشغّل Claude برمجيًا بـ <code>claude -p &quot;your prompt&quot;</code> ده بيشغّله
          بدون تفاعل. الـ output بيروح لـ stdout، وده بيخلّيه قابل للتركيب مع pipelines الـ shell
          وأنظمة الأتمتة. ادمجه مع <code>--output-format json</code> عشان output منظّم.
          استخدم <code>--permission-mode bypassPermissions</code> للتشغيل الآلي الكامل في
          CI/CD. الـ hooks في الجلسات دي تاخد مستوى الـ effort من متغير{" "}
          <code>$CLAUDE_EFFORT</code>.
        </p>
        <p>
          أمر <code>/cd &lt;directory&gt;</code> بيحرك الجلسة لمجلد عمل جديد من غير ما يكسر
          الـ prompt cache في نص الجلسة.
        </p>
      </Reveal>
      <Reveal delay={140}>
        <Terminal
          script={headlessScript}
          title="التشغيل البرمجي / CI"
          loop={false}
          showStatus={true}
        />
      </Reveal>
      <Reveal delay={210}>
        <h3>الـ Sandboxing</h3>
        <p>
          الـ sandboxing بيوفّر عزل على مستوى نظام التشغيل لصلاحيات الملفات والشبكة. متاح على
          macOS و Linux و WSL2 — الـ native Windows مش مدعوم. فعّله بأمر <code>/sandbox</code>{" "}
          في الجلسة. في وضع الـ sandbox، Claude بيقدر يوصل بس للمسارات وقواعد الشبكة اللي أنت
          حددتها.
        </p>
        <p>
          ضبط عزل الشبكة بدقة من خلال <code>sandbox.network.allowedDomains</code> و{" "}
          <code>sandbox.network.deniedDomains</code>. <code>deniedDomains</code> دايمًا ليه
          الأولوية — حتى لو wildcard أوسع في <code>allowedDomains</code> كان هيسمح بيه.
          الاتنين بيدعموا wildcards زي <code>*.example.com</code>:
        </p>
      </Reveal>
      <Reveal delay={280}>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "sandbox": {
    "enabled": true,
    "network": {
      "allowedDomains": ["github.com", "*.npmjs.org"],
      "deniedDomains":  ["uploads.github.com"]
    }
  }
}`}
        />
        <Callout tone="info" title="قواعد الحظر دايمًا ليها الأولوية">
          في الإعدادات المُدارة، قائمة <code>deniedDomains</code> بتتدمج من{" "}
          <strong>كل</strong> مصادر الإعدادات (managed و user و project و local) بغض النظر عن{" "}
          <code>allowManagedDomainsOnly</code>. مفيش سياسة مؤسسية تقدر تسقط block اتحط على
          مستوى user.
        </Callout>
      </Reveal>
      <Reveal delay={350}>
        <p>
          على Linux و WSL، استخدم <code>sandbox.bwrapPath</code> و{" "}
          <code>sandbox.socatPath</code> عشان تحدد مسارات مخصصة لملفات bubblewrap و socat:
        </p>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "sandbox": {
    "bwrapPath": "/usr/local/bin/bwrap",
    "socatPath": "/usr/bin/socat"
  }
}`}
        />
      </Reveal>
      <Reveal delay={420}>
        <Terminal
          script={sandboxScript}
          title="Sandbox + تحليل برمجي"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      {/* ── أداة Advisor ── */}
      <Reveal delay={0}>
        <h2>أداة Advisor (تجريبية)</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          أداة Advisor هي ميزة تجريبية بتعتمد على نظام dual-model، بتخلّي model منفّذ أسرع
          وأقل تكلفة (زي Sonnet) يستشير model مستشار أذكى (زي Opus) أثناء الشغل للحصول على
          توجيهات استراتيجية. المستشار بيقرأ المحادثة كاملة وبيطلع خطة أو تصحيح مسار،
          وبعدين المنفّذ بيكمّل الشغل. النمط ده مناسب لشغل الـ agents الطويل اللي أغلب
          الخطوات فيه ميكانيكية بس مهم يكون في خطة ممتازة.
        </p>
        <p>
          فعّلها بأمر <code>/advisor</code>. لما تكون مفعّلة، الجلسات بتعرض label
          &ldquo;experimental&rdquo; وإشعار بدء. تتفعّل عن طريق متغير البيئة{" "}
          <code>CLAUDE_CODE_ENABLE_EXPERIMENTAL_ADVISOR_TOOL</code>.
        </p>
      </Reveal>

      {/* ── Glob وGrep الأصلية ── */}
      <Reveal delay={0}>
        <h2>Glob وGrep الأصلية على macOS/Linux</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          على الـ native macOS وLinux builds، أدوات <code>Glob</code> و<code>Grep</code>{" "}
          بتتعوّض بـ binaries مدمجة <code>bfs</code> و<code>ugrep</code> متاحة من خلال أداة
          Bash. النتيجة: بحث أسرع في الملفات من غير round-trip لأداة منفصلة — Claude بيستخدم
          أمر Bash واحد بدل ما يستدعي أداة مخصصة، وده بيقلل الـ latency على الـ codebases
          الكبيرة.
        </p>
        <p>
          Windows والـ npm-installed builds مش متأثرين. متغيرات البيئة{" "}
          <code>CLAUDE_CODE_GLOB_HIDDEN</code> و<code>CLAUDE_CODE_GLOB_NO_IGNORE</code> و{" "}
          <code>CLAUDE_CODE_GLOB_TIMEOUT_SECONDS</code> لسه بتنطبق على الأدوات الأصلية.
        </p>
      </Reveal>

      {/* ── تنظيف الجلسات ── */}
      <Reveal delay={0}>
        <h2>تنظيف الجلسات بـ cleanupPeriodDays</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          إعداد <code>cleanupPeriodDays</code> في <code>settings.json</code> بيتحكم في مدة
          الاحتفاظ ببيانات الجلسة قبل الحذف التلقائي عند بدء التشغيل. الافتراضي 30 يوم
          والحد الأدنى 1 — تعيينه لـ <code>0</code> بيترفض بخطأ validation. عملية التنظيف
          بتشمل الجلسات وworktrees الوكلاء الفرعيين المهجورة والـ background tasks وملفات
          الـ backup:
        </p>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "cleanupPeriodDays": 14
}`}
        />
        <p>
          عشان تمنع كتابة الـ transcripts خالص في الوضع غير التفاعلي، استخدم{" "}
          <code>--no-session-persistence</code>.
        </p>
      </Reveal>

      {/* ── مسح بيانات المشروع ── */}
      <Reveal delay={0}>
        <h2>مسح بيانات المشروع (Project Purge)</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          لما <code>cleanupPeriodDays</code> مش كفاية وعايز تمسح كل بيانات Claude Code لمشروع
          معين فورًا، استخدم <code>claude project purge</code>. الأمر ده بيمسح الـ transcripts،
          قوائم المهام، سجلات التشخيص، تاريخ تعديلات الملفات، تاريخ الـ prompts، وسجل المشروع
          نفسه:
        </p>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`# معاينة اللي هيتمسح من غير ما تمسح فعلًا
claude project purge --dry-run

# مسح بيانات المشروع الحالي
claude project purge

# تخطي سؤال التأكيد
claude project purge --yes

# اختيار تفاعلي للعناصر اللي عايز تمسحها
claude project purge --interactive

# مسح بيانات كل المشاريع مرة واحدة
claude project purge --all

# معاينة مسح كامل
claude project purge --all --dry-run`}
        />
      </Reveal>
      <Reveal delay={140}>
        <Terminal
          script={purgeScript}
          title="مسح بيانات المشروع"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      {/* ── متغيرات البيئة ── */}
      <Reveal delay={0}>
        <h2>متغيرات البيئة للتشخيص والمنصات</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          في شوية متغيرات بيئة بتفتح surfaces مش متاحة لسه كأوامر أو settings.
        </p>
        <ul>
          <li>
            <code>OTEL_LOG_RAW_API_BODIES=1</code> — بيبعت الـ API request و response bodies
            الكاملة كـ OpenTelemetry log events. خلي بالك لأن bodies الـ request ممكن يكون
            فيها secrets.
          </li>
          <li>
            <code>OTEL_RESOURCE_ATTRIBUTES</code> — بيضيف أزواج <code>key=value</code> مخصصة
            (مفصولة بفاصلة) كـ labels على كل metric datapoint. مفيد عشان تقسم الـ metrics حسب
            الفريق أو القسم.
          </li>
          <li>
            <code>CLAUDE_CODE_USE_POWERSHELL_TOOL=1</code> — بيفعّل PowerShell tool على Linux
            و macOS. على Windows مع تفعيل الأداة، PowerShell بيصبح الـ shell الأساسي.
          </li>
          <li>
            <code>DISABLE_UPDATES=1</code> — بيمنع كل مسارات التحديث، بما فيها{" "}
            <code>claude update</code> اليدوي. أشد من <code>DISABLE_AUTOUPDATER</code>.
          </li>
          <li>
            <code>CLAUDE_CODE_SAFE_MODE=1</code> أو <code>--safe-mode</code> — بيبدأ Claude
            Code من غير أي تخصيصات (CLAUDE.md والـ plugins والـ hooks وMCP servers).
          </li>
          <li>
            <code>CLAUDE_CODE_HIDE_CWD=1</code> — بيخفي مسار الـ working directory من شعار
            البداية. مفيد لتسجيلات الشاشة.
          </li>
          <li>
            <code>CLAUDE_CODE_NATIVE_CURSOR=1</code> — بيعرض مؤشر الـ terminal الأصلي عند
            خانة الإدخال، بيحترم إعدادات الـ blink والشكل.
          </li>
          <li>
            <code>CLAUDE_CODE_RESUME_PROMPT</code> — بيستبدل رسالة الاستكمال اللي Claude
            بيحقنها لما تستأنف جلسة وقفت في نص الـ turn. الافتراضي:{" "}
            <em>Continue from where you left off.</em>
          </li>
          <li>
            <code>ANTHROPIC_WORKSPACE_ID</code> — الـ workspace ID لـ workload identity
            federation. اضبطه لما قاعدة الفيدريشن بتاعتك متاحة لأكتر من workspace.
          </li>
        </ul>
      </Reveal>
      <Reveal delay={140}>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`# سجّل OTEL telemetry كاملة وأنت بتعيد إنتاج API bug
OTEL_LOG_RAW_API_BODIES=1 claude --print 'reproduce the failure'

# قسّم metrics حسب الفريق وcost center في OTEL backend
OTEL_RESOURCE_ATTRIBUTES="department=engineering,team.id=platform,cost_center=eng-123" \\
  claude

# فعّل PowerShell tool على macOS أو Linux
CLAUDE_CODE_USE_POWERSHELL_TOOL=1 claude

# امنع كل التحديثات على جهاز مقفول
DISABLE_UPDATES=1 claude

# اخفِ الـ working directory في شعار البداية
CLAUDE_CODE_HIDE_CWD=1 claude

# استخدم مؤشر الـ terminal الأصلي عند خانة الإدخال
CLAUDE_CODE_NATIVE_CURSOR=1 claude

# غيّر رسالة الاستكمال لسكربت إطلاق وكيل
CLAUDE_CODE_RESUME_PROMPT="Resume the migration and stop after the next test run." \\
  claude --resume

# وجّه استبيان جودة الجلسة لـ OTEL collector
CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 \\
  CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL=1 claude

# Workload identity federation مع قاعدة فيها أكتر من workspace
ANTHROPIC_WORKSPACE_ID=ws_01abcd... claude`}
        />
      </Reveal>

      {/* ── Claude Code على الويب ── */}
      <Reveal delay={0}>
        <h2>Claude Code على الويب ونقل الجلسات</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          Claude Code على الويب بيشغّل المهام على بنية تحتية سحابية مُدارة من Anthropic على
          claude.ai/code. الجلسات بتفضل شغّالة حتى لو قفلت المتصفح، وتقدر تتابعها من تطبيق
          Claude للموبايل.
        </p>
        <p>
          شغّل جلسة سحابية من الـ terminal بـ{" "}
          <code>claude --remote &quot;your task&quot;</code>. Claude بيعمل clone للريبو من
          GitHub (ادفع الـ commits المحلية الأول)، ينفّذ الـ prompt لوحده، ويقدر يفتح PRs لما
          يخلّص. استخدم عدة <code>--remote</code> عشان تشغّل مهام بالتوازي.
        </p>
        <ul>
          <li>
            <code>/teleport</code> (اختصار <code>/tp</code>) — بيجيب جلسة سحابية للـ terminal
            المحلي، بيجيب الـ branch وكامل تاريخ المحادثة.
          </li>
          <li>
            <code>/autofix-pr</code> — بيعمل جلسة سحابية بتراقب الـ PR بتاعك. لما CI يفشل
            أو reviewers يعلّقوا، Claude بيحقق ويدفع fix. محتاج Claude GitHub App متثبّت.
          </li>
        </ul>
      </Reveal>
      <Reveal delay={140}>
        <CodeBlock
          filename="shell"
          lang="bash"
          code={`# خطط محلي، نفّذ في الـ cloud
claude --permission-mode plan
# ... خلّص الخطة، commit، push ...
claude --remote "Execute the migration plan in docs/migration-plan.md"

# ارجع بالجلسة السحابية لما تخلص
/teleport`}
        />
        <Callout tone="note">
          الجلسات السحابية بتيجي بـ runtimes جاهزة (Node.js, Python, Go, Rust, Java, Ruby,
          Docker, PostgreSQL)، حتى 16 GB RAM، ومستويات network access قابلة للتعديل. إعدادات
          الريبو (CLAUDE.md, settings, MCP servers, skills) بتتنقل تلقائي. إعدادات
          المستخدم (~/.claude/) مبتتنقلش — حط إعدادات المشروع في الريبو.
        </Callout>
      </Reveal>

      {/* ── تخصيص رابط الـ PR والـ Worktrees ── */}
      <Reveal delay={0}>
        <h2>تخصيص رابط الـ PR وإعدادات الـ Worktree</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          إعداد <code>prUrlTemplate</code> في <code>settings.json</code> بيوجّه شارة الـ PR في
          الـ footer لرابط code-review مخصص بدل رابط GitHub الافتراضي. مفيد للفرق اللي
          بتستخدم GitLab أو Bitbucket أو أداة مراجعة داخلية:
        </p>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "prUrlTemplate": "https://gitlab.example.com/org/repo/-/merge_requests/{{pr_number}}"
}`}
        />
      </Reveal>
      <Reveal delay={140}>
        <p>
          الـ Git worktrees بتخلّيك تعمل checkout لـ branches كتير في نفس الوقت من غير ما
          تعمل stash. <code>claude --worktree &lt;name&gt;</code> بيعمل worktree جديد مرتبط
          بـ <code>&lt;name&gt;/</code>. إعداد <code>worktree.baseRef</code> (جديد في
          v2.1.133) بيتحكم في مين اللي هي branched من عنده:
        </p>
        <ul>
          <li>
            <strong>fresh</strong> (الافتراضي) — بيتفرّع من <code>origin/&lt;default&gt;</code>،
            tree نضيف مطابق للـ remote.
          </li>
          <li>
            <strong>head</strong> — بيتفرّع من الـ <code>HEAD</code> المحلي بتاعك، بيحافظ
            على commits unpushed في worktrees الجديدة.
          </li>
        </ul>
        <CodeBlock
          filename="settings.json"
          lang="json"
          code={`{
  "worktree": {
    "baseRef": "head"
  }
}`}
        />
      </Reveal>

      {/* ── استخدام الكمبيوتر ── */}
      <Reveal delay={0}>
        <h2>استخدام الكمبيوتر (Computer Use) — معاينة بحثية</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          استخدام الكمبيوتر بيخلّي Claude يفتح تطبيقات ويتحكم في شاشتك ويتفاعل مع واجهات
          المستخدم على macOS — يبني تطبيق Swift ويشغّله ويضغط على كل زر ويعمل screenshot
          للنتيجة، كل ده في نفس المحادثة. بيعالج المهام اللي محتاجة GUI: التحقق من بناء
          تطبيقات macOS الأصلية، اختبار UI شامل من غير test harness، تصحيح مشاكل layout
          المرئية، والتحكم في أدوات GUI-only.
        </p>
        <p>
          Claude بيجرب أدوات أدق الأول: MCP servers أو Bash أو تكامل Chrome. استخدام الكمبيوتر
          هو الخيار الاحتياطي للحاجات اللي مفيش أداة تانية تقدر توصلها — التطبيقات الأصلية
          والمحاكيات والأدوات اللي مفيهاش API.
        </p>
        <p>
          فعّله بتشغيل <code>/mcp</code> في جلسة، ودوّر على server الـ <code>computer-use</code>،
          واختار <strong>Enable</strong>. الإعداد بيتحفظ لكل مشروع. أول مرة تستخدمه، macOS
          هيطلب صلاحيات Accessibility وScreen Recording. اضغط <kbd>Esc</kbd> في أي مكان
          أو <kbd>Ctrl+C</kbd> عشان توقف فورًا.
        </p>
        <Callout tone="warn" title="المتطلبات">
          استخدام الكمبيوتر محتاج اشتراك Pro أو Max، macOS، Claude Code v2.1.85+، وجلسة
          تفاعلية (مش متاح مع <code>-p</code>). مش متاح على Team أو Enterprise أو Bedrock أو
          Vertex AI أو Foundry.
        </Callout>
      </Reveal>

      {/* ── ميزات متقدمة إضافية ── */}
      <Reveal delay={0}>
        <h2>ميزات متقدمة إضافية</h2>
      </Reveal>
      <Reveal delay={70}>
        <p>
          أدوات Claude Code المتقدمة أكتر من كده. المهام في الخلفية بتخلّي الشغل الطويل يكمّل
          وأنت بتكمّل محادثتك. المهام المجدولة بتدعم <code>/loop</code> للفحوصات المتكررة
          داخل الجلسة و<code>/schedule</code> للمهام المجدولة في الـ cloud. أدوات الجلسة زي{" "}
          <code>/resume</code> و<code>/rename</code> و<code>/teleport</code> بتسهّل التنقل
          بين الـ CLI المحلي، المتصفح، والـ desktop app.
        </p>
        <p>
          كمان فيه ميزات منصة للاستخدام اليومي: الإملاء الصوتي بـ <code>/voice</code>، تكامل
          Chrome بـ <code>--chrome</code>، التحكم عن بعد بـ <code>/remote-control</code>، دروس{" "}
          <code>/powerup</code> التفاعلية لاكتشاف الميزات، قوائم المهام، وسير عمل git worktree
          بـ <code>claude --worktree</code>. كل دول بيشتركوا في نفس نظام الصلاحيات، فالاستخدام
          المتقدم في الغالب هو إنك تدمج الوضع المناسب مع السطح المناسب.
        </p>
      </Reveal>

      {/* ── اختبار ── */}
      <Reveal delay={0}>
        <Quiz questions={questions} title="اختبار سريع — الميزات المتقدمة" />
      </Reveal>
    </Prose>
  );
}
