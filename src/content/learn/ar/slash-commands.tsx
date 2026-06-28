import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Kbd, Quiz, Prose, type QuizQuestion } from "@/components/content";
import { Card } from "@/components/ui";

/* --------------------------------------------------------------------------
   Terminal demo: اكتشاف أوامر السلاش
-------------------------------------------------------------------------- */
const discoveryScript: Step[] = [
  { t: "print", text: "# اكتب / لفتح قائمة الأوامر", tone: "system" },
  { t: "wait", ms: 500 },
  { t: "type", text: "/", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "  /clear          ابدأ جلسة جديدة", tone: "green" },
    { text: "  /compact        اضغط تاريخ المحادثة", tone: "green" },
    { text: "  /config         افتح قائمة الإعدادات", tone: "green" },
    { text: "  /context        اعرض شبكة استهلاك الـ context", tone: "green" },
    { text: "  /cost           اعرض تكلفة الجلسة واستهلاك الـ tokens", tone: "green" },
    { text: "  /model          غيّر الموديل النشط", tone: "green" },
    { text: "  /status         اعرض الإصدار ومعلومات الحساب", tone: "green" },
    { text: "  ... (اكتب عشان تفلتر)", tone: "muted" },
  ], gap: 55 },
  { t: "wait", ms: 800 },
  { t: "clear" },
  { t: "print", text: "# فلتر عن طريق الكتابة", tone: "system" },
  { t: "type", text: "/co", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "  /compact        اضغط تاريخ المحادثة", tone: "green" },
    { text: "  /config         افتح قائمة الإعدادات", tone: "green" },
    { text: "  /context        اعرض شبكة استهلاك الـ context", tone: "green" },
    { text: "  /cost           اعرض تكلفة الجلسة واستهلاك الـ tokens", tone: "green" },
  ], gap: 60 },
  { t: "wait", ms: 700 },
  { t: "clear" },
  { t: "print", text: "# اضغط Enter لتشغيل /context", tone: "system" },
  { t: "type", text: "/context", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "استهلاك الـ Context", tone: "blue" },
    { text: "████████████░░░░░░░░  ٦٢٪  من ٢٠٠ ألف token", tone: "amber" },
    { text: "عدد الجولات      : ٢٤", tone: "muted" },
    { text: "الملفات في الـ context : ٧", tone: "muted" },
  ], gap: 70 },
  { t: "wait", ms: 1200 },
];

/* --------------------------------------------------------------------------
   Terminal demo: سير عمل compact + تغيير الموديل
-------------------------------------------------------------------------- */
const workflowScript: Step[] = [
  { t: "print", text: "# ضغط الـ context مع تعليمة مخصصة", tone: "system" },
  { t: "type", text: "/compact keep the auth refactor plan, drop the debug logs", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "✔ ضغط ٢٤ جولة → ملخص", tone: "green" },
    { text: "✔ تم الاحتفاظ بخطة إعادة هيكلة Auth", tone: "green" },
    { text: "✔ حذف سجلات التصحيح", tone: "muted" },
    { text: "تم تحرير الـ context: ~٣٨ ألف token", tone: "blue" },
  ], gap: 80 },
  { t: "wait", ms: 700 },
  { t: "clear" },
  { t: "print", text: "# انتقل لـ Opus لمسألة صعبة", tone: "system" },
  { t: "type", text: "/model opus", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "الموديل → claude-opus-4-5  ✔", tone: "green" },
  ], gap: 80 },
  { t: "wait", ms: 500 },
  { t: "type", text: "/effort high", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "عمق التفكير → high  ✔", tone: "green" },
  ], gap: 80 },
  { t: "wait", ms: 500 },
  { t: "type", text: "/cost", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "تكلفة الجلسة : $0.14", tone: "amber" },
    { text: "المدة         : ١٨ دقيقة", tone: "muted" },
    { text: "Tokens الداخلة: ٦٢٤٨١", tone: "muted" },
    { text: "Tokens الخارجة: ٨٢٠٤", tone: "muted" },
    { text: "تغييرات الكود : +١٤٢ / -٣٧ سطر", tone: "green" },
  ], gap: 75 },
  { t: "wait", ms: 1400 },
];

/* --------------------------------------------------------------------------
   أسئلة الاختبار
-------------------------------------------------------------------------- */
const questions: QuizQuestion[] = [
  {
    q: "إيه اللي بيحصل لما تكتب / في الـ prompt بتاع Claude Code؟",
    options: [
      "Claude Code بيبحث على الإنترنت",
      "بتظهر قائمة قابلة للفلترة بكل الأوامر المتاحة",
      "الجلسة بتتمسح فورًا",
      "ملف جديد بيتنشأ",
    ],
    answer: 1,
    explanation:
      "كتابة / بتفتح قائمة الأوامر اللي بتعرض كل أوامر الـ slash المتاحة. بعدين تقدر تكتب حروف إضافية عشان تفلتر القائمة — مثلًا /co بتضيّقها على /compact و/config و/context و/cost.",
  },
  {
    q: "أنهي أمر بيضغط المحادثة مع إمكانية الاحتفاظ بأجزاء معينة؟",
    options: ["/clear", "/context", "/compact", "/export"],
    answer: 2,
    explanation:
      "/compact بيلخّص تاريخ المحادثة عشان يحرّر مساحة في نافذة الـ context. تقدر تمرّر تعليمة زي '/compact keep the migration plan, drop the debugging' عشان تتحكم في إيه اللي بيتحفظ.",
  },
  {
    q: "إزاي تعرف قد إيه من نافذة الـ context بتاعتك اتاستخدم؟",
    options: [
      "/cost",
      "/context",
      "/status",
      "/usage-credits",
    ],
    answer: 1,
    explanation:
      "/context بيعرض شبكة بصرية بتوضّح استهلاك الـ context — كام token اتملى وعدد الجولات والملفات في الـ context. /cost بيعرض تكلفة الجلسة وعدد الـ tokens بس مش الشبكة البصرية.",
  },
  {
    q: "إيه اللي بيعمله /effort high؟",
    options: [
      "بيرفع مستوى الفوترة عند Anthropic",
      "بيحدد عمق التفكير الموسّع للجلسة الحالية",
      "بيغيّر الموديل لـ Opus",
      "بيكبّر حجم نافذة الـ context",
    ],
    answer: 1,
    explanation:
      "/effort بيحدد عمق التفكير للجلسة الحالية. القيم المتاحة: low، medium، high، xhigh، max، وauto. مش بيغيّر الموديل أو مستوى الفوترة — استخدم /model عشان تغيّر الموديل.",
  },
];

/* --------------------------------------------------------------------------
   محتوى الصفحة (Server Component)
-------------------------------------------------------------------------- */
export default function Content() {
  return (
    <Prose>
      {/* مقدمة */}
      <Reveal>
        <p>
          أوامر الـ slash commands هي أسرع طريقة تتحكم بيها في سلوك Claude Code
          خلال جلسة تفاعلية. اكتب <Kbd>/</Kbd> في أي وقت وهتظهر لك قائمة بكل
          الأوامر المتاحة، أو اكتب أول كام حرف عشان تفلتر النتايج. الوحدة دي
          بتغطي الأوامر المدمجة اللي هتستخدمها كل يوم.
        </p>
      </Reveal>

      {/* ── اكتشاف الأوامر ── */}
      <Reveal delay={70}>
        <h2>اكتشاف الأوامر</h2>
        <p>
          اكتب <Kbd>/</Kbd> في الـ prompt وهتظهر قائمة بكل الأوامر المتاحة. ابدأ
          تكتب عشان تفلتر — <Kbd>/co</Kbd> هتوصّلك لـ <code>/compact</code>،{" "}
          <code>/color</code>، <code>/config</code>، <code>/context</code>،{" "}
          <code>/cost</code>، <code>/copy</code>. استخدم الأسهم للتنقل، وـ{" "}
          <Kbd>Enter</Kbd> للاختيار. الأوامر اللي مش متاحة في الإعداد الحالي
          بتاعك بتتخفى تلقائيًا، يعني هتشوف بس اللي شغّال معاك.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <Terminal
          script={discoveryScript}
          title="قائمة أوامر الـ slash"
          loop
          loopDelay={2000}
        />
      </Reveal>

      <Reveal delay={210}>
        <Callout tone="tip" title="جديد على Claude Code؟">
          جرّب <code>/powerup</code> — بيشغّل دروس تفاعلية مع animated demos
          بتعرّفك على الميزات الأساسية جوه الـ CLI مباشرة.
        </Callout>
      </Reveal>

      <Reveal delay={280}>
        <p>
          بعض الأوامر بتقبل arguments مباشرة:{" "}
          <code>/compact focus on the API layer</code>، <code>/model opus</code>،{" "}
          <code>/effort high</code>، <code>/rename auth-refactor</code>. وأوامر
          تانية زي <code>/context</code>، <code>/cost</code>، و
          <code>/status</code> بتشتغل فورًا من غير arguments.
        </p>
        <CodeBlock
          filename="مثال"
          lang="text"
          code={`/compact focus on the payment service`}
        />
      </Reveal>

      {/* ── تصنيفات الأوامر ── */}
      <Reveal delay={70}>
        <h2>تصنيفات الأوامر</h2>
        <p>
          الأوامر المدمجة بتتقسّم لكام مجموعة. لما تعرف التصنيفات، هتلاقي
          الأمر الصح بسرعة من غير ما تحفظ كل حاجة.
        </p>
      </Reveal>

      {/* إدارة الـ Context */}
      <Reveal delay={140}>
        <h3>إدارة الـ Context</h3>
        <p>بتتحكم في قد إيه Claude شايف من المحادثة.</p>
        <div className="my-4 grid gap-3 sm:grid-cols-1">
          {[
            { cmd: "/context", desc: "بيعرض grid بصري بيوضّح استهلاك الـ context بتاعك." },
            { cmd: "/compact [تعليمة]", desc: "بيضغط المحادثة. ممكن تمرّر تعليمات تحدد إيه يتحفظ: /compact keep the migration plan, drop the debugging" },
            { cmd: "/clear", desc: "بيبدأ جلسة جديدة تمامًا — بيمسح تاريخ المحادثة كله." },
          ].map((item) => (
            <Card
              key={item.cmd}
              className="transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <code className="text-sm font-semibold text-accent">{item.cmd}</code>
              <p className="mt-1 text-sm text-fg-muted">{item.desc}</p>
            </Card>
          ))}
        </div>
        <CodeBlock
          filename="إدارة الـ context"
          lang="text"
          code={`/context
/compact keep the auth refactor plan, drop the debugging
/clear`}
        />
      </Reveal>

      {/* أدوات الجلسة */}
      <Reveal delay={140}>
        <h3>أدوات الجلسة</h3>
        <p>بتخلّيك تدير شغلك وترجع له عبر الجلسات.</p>
        <div className="my-4 grid gap-3 sm:grid-cols-1">
          {[
            { cmd: "/rename my-feature", desc: "بيدي الجلسة اسم واضح للرجوع إليها بسهولة." },
            { cmd: "/resume", desc: "بيرجعك لجلسة قديمة مُسمّاة." },
            { cmd: "/branch", desc: "بيعمل محادثة موازية تقدر تستكشف فيها بديل من غير ما تفقد الحالة الحالية." },
            { cmd: "/rewind (alias: /undo)", desc: "بيرجعك لنقطة أبكر في المحادثة." },
            { cmd: "/export", desc: "بيحفظ الجلسة في ملف أو الـ clipboard." },
            { cmd: "/recap", desc: "بيولّد ملخص من سطر واحد عن اللي حصل. كمان بيشتغل تلقائيًا لما ترجع للتيرمنال." },
          ].map((item) => (
            <Card
              key={item.cmd}
              className="transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <code className="text-sm font-semibold text-accent">{item.cmd}</code>
              <p className="mt-1 text-sm text-fg-muted">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* أوامر الإعدادات */}
      <Reveal delay={140}>
        <h3>أوامر الإعدادات</h3>
        <p>بتغيّر سلوك Claude في نص الجلسة من غير ما تخرج من التيرمنال.</p>
        <div className="my-4 grid gap-3 sm:grid-cols-1">
          {[
            { cmd: "/model", desc: "بيتنقل بين الموديلات المتاحة زي Sonnet و Opus و Haiku، و aliases تانية زي best أو opusplan." },
            { cmd: "/effort low|medium|high|xhigh|max|auto", desc: "بيحدد عمق التفكير للجلسة الحالية." },
            { cmd: "/permissions", desc: "بيتحكّم في إيه Claude يقدر يعمله من غير ما يسألك." },
            { cmd: "/config", desc: "بيفتح قائمة الإعدادات." },
            { cmd: "/theme (جديد في v2.1.118)", desc: "بيعمّل وبيتنقل بين custom themes مُسمّاة. الـ themes بتتخزّن كملفات JSON في ~/.claude/themes/." },
            { cmd: "/tui", desc: "بيتنقل بين الـ rendering الكلاسيكي والـ fullscreen الخالي من الـ flicker وسط المحادثة." },
            { cmd: "/focus", desc: "بيفعّل ويقفل وضع التركيز للإدخال بدون تشتيت." },
            { cmd: "/fewer-permission-prompts", desc: "بيمسح الـ transcripts الأخيرة ويقترح allowlist لـ .claude/settings.json عشان تقلل permission prompts." },
          ].map((item) => (
            <Card
              key={item.cmd}
              className="transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <code className="text-sm font-semibold text-accent">{item.cmd}</code>
              <p className="mt-1 text-sm text-fg-muted">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* التشخيصات */}
      <Reveal delay={140}>
        <h3>التشخيصات</h3>
        <p>بتساعدك لما حاجة مش شغّالة.</p>
        <div className="my-4 grid gap-3 sm:grid-cols-1">
          {[
            { cmd: "/cost", desc: "بيوضّح تكلفة الجلسة، المدة، تغييرات الكود، واستهلاك الـ tokens." },
            { cmd: "/usage-credits (جديد في v2.1.144)", desc: "اعرض وأدِر الـ usage credits على حسابك. الاسم القديم /extra-usage لسه شغّال." },
            { cmd: "/status", desc: "بيعرض الـ version، الـ model، ومعلومات الحساب." },
            { cmd: "/doctor", desc: "بيعمل فحص على سلامة التثبيت." },
            { cmd: "/diff", desc: "بيفتح عارض تفاعلي للتغييرات اللي لسه ما اتعملش لها commit — مفيد لما تبص على اللي Claude عمله قبل الـ commit." },
          ].map((item) => (
            <Card
              key={item.cmd}
              className="transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <code className="text-sm font-semibold text-accent">{item.cmd}</code>
              <p className="mt-1 text-sm text-fg-muted">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* مراجعات ما قبل الـ ship */}
      <Reveal delay={140}>
        <h3>مراجعات ما قبل الـ Ship</h3>
        <p>افحص شغلك قبل ما يخرج من الـ branch بتاعك.</p>
        <div className="my-4 grid gap-3 sm:grid-cols-1">
          {[
            { cmd: "/code-review [effort] [--comment] [--fix]", desc: "بيراجع الـ diff الحالي عشان يلاقي correctness bugs. بيقبل effort level (/code-review high للتغطية الأوسع) و--comment لنشر النتايج كـ inline PR comments و--fix لتطبيق الإصلاحات." },
            { cmd: "/code-review ultra [رقم PR]", desc: "مراجعة عميقة متعددة الـ agents في الـ cloud بتحليل متوازٍ. من غير arguments بيراجع الـ branch الحالي؛ مرّر رقم PR لمراجعة GitHub PR. /ultrareview هو alias." },
            { cmd: "/review", desc: "قراءة معمّقة read-only للتغييرات." },
            { cmd: "/security-review", desc: "مراجعة بتركيز أمني للتغييرات المعلّقة." },
          ].map((item) => (
            <Card
              key={item.cmd}
              className="transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <code className="text-sm font-semibold text-accent">{item.cmd}</code>
              <p className="mt-1 text-sm text-fg-muted">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* ── ديمو سير العمل ── */}
      <Reveal delay={70}>
        <h2>الأوامر في سير عمل حقيقي</h2>
        <p>
          إليك تسلسل نموذجي: ضغط الـ context لتحرير المساحة، الانتقال لموديل
          أقوى لمهمة صعبة، ثم مراجعة التكلفة قبل الانتهاء.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <Terminal
          script={workflowScript}
          title="ديمو سير العمل"
          loop
          loopDelay={2200}
        />
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename="تسلسل أوامر شائع"
          lang="text"
          code={`/context
/compact keep the auth refactor plan
/model opus
/effort high
/cost
/code-review high
/code-review --comment`}
        />
      </Reveal>

      {/* Callout: أنماط الـ arguments */}
      <Reveal delay={280}>
        <Callout tone="info" title="أنماط الـ Arguments">
          الأوامر اللي بتقبل نص حر (<code>/compact</code>،{" "}
          <code>/rename</code>) بتاخد كل حاجة بعد اسم الأمر كـ argument — من
          غير ما تحتاج علامات تنصيص. الأوامر اللي بتقبل flags (
          <code>/code-review --fix</code>، <code>/code-review high</code>)
          بتتبع اتفاقيات الـ CLI العادية.
        </Callout>
      </Reveal>

      {/* ── أوامر Slash مخصصة ── */}
      <Reveal delay={70}>
        <h2>أوامر Slash مخصصة</h2>
        <p>
          بعيدًا عن الأوامر المدمجة، تقدر تعرّف أوامر slash خاصة بيك عن طريق{" "}
          <strong>Skills</strong>. الـ skill هو ملف Markdown بتحطّه في{" "}
          <code>~/.claude/skills/</code> (للمستخدم عمومًا) أو{" "}
          <code>.claude/skills/</code> (للمشروع). Claude بيكتشف الملف ويعرضه
          كـ <code>/filename</code> في القائمة.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="~/.claude/skills/deploy.md"
          lang="markdown"
          code={`# deploy

شغّل الـ pre-flight checks وانشر الـ branch الحالي على staging.

## Steps
1. شغّل \`npm test\` — وقف لو الـ tests فشلت
2. شغّل \`npm run build\` — وقف لو في أخطاء build
3. شغّل \`vercel --prod\` وأطبع رابط الـ deployment
4. أرسل رابط الـ deployment في قناة #deploys على Slack`}
        />
        <p className="mt-3 text-sm text-fg-muted">
          بعد حفظ الملف ده، اكتب <code>/deploy</code> في أي prompt في Claude
          Code والـ skill هيشتغل تلقائيًا. الـ Skills تقدر تتضمن acceptance
          criteria ومراجعة الـ context وخطوات action مفصّلة — شوف وحدة{" "}
          <strong>المهارات</strong> عشان تعرف الصيغة الكاملة.
        </p>
      </Reveal>

      <Reveal delay={210}>
        <Callout tone="warn" title="Skills المشروع مقابل skills المستخدم">
          الـ Skills في <code>.claude/skills/</code> (على مستوى المشروع) بتتغلّب
          على الـ skills بنفس الاسم في <code>~/.claude/skills/</code> (على
          مستوى المستخدم). حافظ على الأوامر العامة على مستوى المستخدم والأوامر
          الخاصة بالمشروع في الـ repo عشان الفريق يشاركها عبر الـ version
          control.
        </Callout>
      </Reveal>

      {/* ── الاختبار ── */}
      <Reveal delay={70}>
        <Quiz questions={questions} title="تحقّق من فهمك" />
      </Reveal>
    </Prose>
  );
}
