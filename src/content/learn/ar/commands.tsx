import { Prose, Callout, Kbd, Quiz, type QuizQuestion } from "@/components/content";
import CodeBlock from "@/components/CodeBlock";
import Terminal, { type Step } from "@/components/Terminal";
import Reveal from "@/components/Reveal";

/* ── Terminal scripts ─────────────────────────────────────────────── */

const contextScript: Step[] = [
  { t: "print", text: "# إدارة الجلسات والـ context", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/context", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "استخدام نافذة الـ context:", tone: "green" },
    { text: "████████████░░░░░░░░  ٦٢% مستخدم  (49,800 / 80,000 رمز)", tone: "amber" },
  ], gap: 60 },
  { t: "wait", ms: 700 },
  { t: "type", text: "/compact focus on the auth refactor", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "✓ تم ضغط المحادثة. محفوظ: خطة إعادة هيكلة المصادقة، المهام المفتوحة.", tone: "green" },
  ], gap: 60 },
  { t: "wait", ms: 700 },
  { t: "type", text: "/rename auth-refactor-v2", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "✓ الجلسة محفوظة باسم \"auth-refactor-v2\"", tone: "green" },
  ], gap: 60 },
  { t: "wait", ms: 600 },
  { t: "type", text: "/export auth-refactor-v2.md", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "✓ تم كتابة النص في auth-refactor-v2.md", tone: "green" },
  ], gap: 60 },
  { t: "wait", ms: 1200 },
  { t: "clear" },
];

const fastModeScript: Step[] = [
  { t: "print", text: "# الوضع السريع ومستوى الـ effort", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/fast", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "↯  تم تفعيل الوضع السريع — تم التبديل إلى Opus 4.8", tone: "amber" },
    { text: "الردود أسرع بـ 2.5x مقابل تكلفة tokens أعلى.", tone: "muted" },
  ], gap: 70 },
  { t: "wait", ms: 700 },
  { t: "type", text: "/effort low", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "مستوى الـ effort: low  (وقت تفكير أقل)", tone: "blue" },
    { text: "نصيحة: ادمجه مع /fast لأقصى سرعة في المهام البسيطة.", tone: "muted" },
  ], gap: 70 },
  { t: "wait", ms: 700 },
  { t: "type", text: "refactor this function to async/await", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "↯ [fast+low]  جارٍ إعادة الهيكلة…", tone: "green" },
    { text: "✓ تم في 0.8 ثانية", tone: "green" },
  ], gap: 60 },
  { t: "wait", ms: 1400 },
  { t: "clear" },
];

const skillsScript: Step[] = [
  { t: "print", text: "# عرض الـ skills المدمجة", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "/code-review high --comment", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "يعمل مراجعة متعددة الـ agents (high effort)…", tone: "muted" },
    { text: "CRITICAL  src/auth/session.ts:42  مفتاح service_role مكشوف على جانب العميل", tone: "error" },
    { text: "HIGH      src/api/users.ts:17     لا يوجد معالجة للأخطاء على DELETE endpoint", tone: "amber" },
    { text: "MEDIUM    src/components/Form.tsx:88  حالة التحميل مفقودة", tone: "blue" },
    { text: "✓ تم نشر النتايج كـ inline comments على PR #24", tone: "green" },
  ], gap: 80 },
  { t: "wait", ms: 700 },
  { t: "type", text: "/batch add JSDoc to all public functions in src/", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "يخطط العملية على 18 ملف…", tone: "muted" },
    { text: "يستخدم git worktrees معزولة. اضغط Ctrl+B للخلفية.", tone: "muted" },
    { text: "التقدم: [████████░░░░░░░░]  8/18 ملفات", tone: "blue" },
  ], gap: 80 },
  { t: "wait", ms: 1200 },
  { t: "clear" },
];

const shortcutsScript: Step[] = [
  { t: "print", text: "# اختصارات الكيبورد", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "print", text: "  Shift+Tab   →  تبديل وضع الصلاحيات", tone: "muted" },
  { t: "print", text: "  Option+T    →  تفعيل/إيقاف التفكير المعمّق", tone: "muted" },
  { t: "print", text: "  Ctrl+O      →  الوضع التفصيلي (tool calls)", tone: "muted" },
  { t: "print", text: "  Ctrl+R      →  البحث في تاريخ الأوامر", tone: "muted" },
  { t: "print", text: "  Ctrl+B      →  إرسال الـ agent للخلفية", tone: "muted" },
  { t: "print", text: "  Ctrl+U      →  مسح الإدخال", tone: "muted" },
  { t: "print", text: "  Ctrl+Y      →  استعادة الإدخال الممسوح", tone: "muted" },
  { t: "wait", ms: 600 },
  { t: "type", text: "/effort high", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "مستوى الـ effort: high  (تفكير عميق مفعّل)", tone: "blue" },
  ], gap: 60 },
  { t: "wait", ms: 600 },
  { t: "type", text: "/btw what's the difference between async and defer?", tone: "user", prompt: ">" },
  { t: "out", lines: [
    { text: "[سؤال جانبي — لم يُضَف للـ context]", tone: "system" },
    { text: "async: تحميل وتنفيذ فوري، يوقف التحليل عند التنفيذ.", tone: "default" },
    { text: "defer: تحميل موازي، تنفيذ بعد اكتمال التحليل.", tone: "default" },
  ], gap: 70 },
  { t: "wait", ms: 1200 },
  { t: "clear" },
];

/* ── Quiz ─────────────────────────────────────────────────────────── */

const quizQuestions: QuizQuestion[] = [
  {
    q: "أي أمر يضغط تاريخ المحادثة مع إمكانية تحديد ما تريد الاحتفاظ به؟",
    options: ["/context", "/compact focus on …", "/rewind", "/clear"],
    answer: 1,
    explanation: "/compact يقلل استهلاك الـ tokens مع الحفاظ على أهم السياق. يمكنك تمرير تلميح تركيز مثل '/compact focus on the database migration plan' ليعرف Claude ما يجب حفظه.",
  },
  {
    q: "ماذا يفعل تفعيل الوضع السريع (fast mode)؟",
    options: [
      "يقلل جودة الردود لتوفير الـ tokens",
      "يتحول لموديل أصغر وأرخص",
      "يوفر نفس جودة Opus بسرعة أعلى تصل لـ 2.5x مقابل تكلفة tokens أعلى",
      "يوقف التفكير المعمّق نهائيًا",
    ],
    answer: 2,
    explanation: "الوضع السريع هو configuration عالي السرعة لـ Opus. يحافظ على نفس جودة الموديل لكن بسرعة استجابة أعلى — مقابل تكلفة tokens أعلى. لا يغير الموديل، فقط طريقة تقديمه.",
  },
  {
    q: "كيف تسأل سؤالًا جانبيًا دون إضافته لتاريخ المحادثة؟",
    options: ["Ctrl+Q", "/btw", "Ctrl+B", "Shift+Tab"],
    answer: 1,
    explanation: "/btw سؤالك يطرح سؤالًا جانبيًا خارج نافذة الـ context الرئيسية — مفيد للتحقق السريع من syntax أو حقيقة ما دون إثقال المحادثة.",
  },
  {
    q: "ما الفرق بين /code-review و /simplify من الإصدار v2.1.154؟",
    options: [
      "هما aliases متطابقة لنفس الأمر",
      "/code-review يعدّل الملفات؛ /simplify يبلّغ فقط",
      "/code-review يبلّغ عن النتايج دون تعديل الملفات؛ /simplify يطبّق إصلاحات الـ cleanup",
      "/simplify أُزيل في v2.1.154",
    ],
    answer: 2,
    explanation: "من v2.1.154، /code-review يراجع الـ diff ويبلّغ عن النتايج دون تعديل الملفات. /simplify يشغّل مراجعة منفصلة للـ cleanup فقط وتطبّق الإصلاحات — لم يعد alias بسيط.",
  },
];

/* ── Component ────────────────────────────────────────────────────── */

export default function Content() {
  return (
    <Prose>
      {/* ── Intro ── */}
      <Reveal delay={0}>
        <p>
          شفت الـ slash commands الأساسية. الوحدة دي بتغطي الأوامر اللي المستخدمين المتمرسين
          بيعتمدوا عليها بعد ما يكون الـ workflow الأولي شغّال — إدارة الـ context، أدوات
          الجلسات، الـ skills المدمجة، واختصارات الكيبورد اللي بتسرّع كل حاجة.
        </p>
      </Reveal>

      {/* ── Context & Session Management ── */}
      <Reveal delay={70}>
        <h2>إدارة الـ Context والجلسات</h2>
        <p>
          كل جلسة Claude Code عندها context window. أمر <code>/context</code> بيعرضه كـ grid
          ملوّن — أخضر لما فيه مساحة، أصفر لما قرّب يتملي، أحمر لما كاد ينتهي. لما الـ context
          يطول، <code>/compact</code> بيضغط المحادثة. مرّر تعليمات تركيز عشان تحافظ على اللي
          يهمّك:
        </p>
        <CodeBlock
          filename="session-management.sh"
          lang="bash"
          code={`/compact focus on the database migration plan`}
        />
        <p>
          أمر <code>/branch</code> بيعمل محادثة موازية من النقطة الحالية، يعني تقدر تستكشف
          طريقتين جنب بعض. <code>/rewind</code> بيرجعك لنقطة أبكر — مفيد لما Claude مشي في
          اتجاه غلط. كمان ممكن يرجع التغييرات في الملفات، يعني بيشتغل كـ undo للمحادثة
          والكود مع بعض.
        </p>
        <p>
          استئناف الجلسات بيخلّي الشغل الطويل ممكن. <code>/rename my-feature</code> بيحفظ
          الجلسة الحالية باسم واضح. <code>/resume my-feature</code> بيرجعك ليها بعدين بالـ
          context كامل. اعمل export للجلسة في ملف أو الـ clipboard بـ <code>/export</code>{" "}
          للمشاركة أو الأرشفة.
        </p>
        <CodeBlock
          filename="session-commands.sh"
          lang="bash"
          code={`/context
/compact focus on the auth refactor
/branch
/rename auth-refactor-v2
/export auth-refactor-v2.md`}
        />
      </Reveal>

      <Reveal delay={140}>
        <Terminal
          script={contextScript}
          title="إدارة الجلسات"
          loop
          showStatus
        />
      </Reveal>

      {/* ── Bundled Skills ── */}
      <Reveal delay={0}>
        <h2>الـ Skills المدمجة</h2>
        <p>
          Claude Code بييجي معاه skills مدمجة بتشتغل زي الأوامر. دي متاحة دايمًا من غير ما
          تحتاج تعمل install لأي حاجة.
        </p>
        <p>
          أمر <code>/code-review</code> (اتغيّر اسمه من <code>/simplify</code> في v2.1.147)
          بيراجع الـ diff الحالي عشان يلاقي bugs في الصحة (correctness bugs) ويعرض النتايج
          من غير ما يعدّل ملفات. الـ effort levels الأقل (<code>/code-review low</code>)
          بترجّع نتايج أقل بثقة أعلى؛ من <code>high</code> لـ <code>max</code> بتدّي تغطية
          أوسع، و<code>/code-review ultra</code> بيشغّل مراجعة أعمق متعددة الـ agents في
          الـ cloud. من v2.1.154، <code>/simplify</code> بيشتغل كمراجعة منفصلة للـ cleanup
          بس اللي بتطبّق إصلاحات من غير ما تبحث عن bugs — مش alias بسيط لـ{" "}
          <code>/code-review</code>. مرّر <code>--comment</code> عشان يعلّق النتايج كـ inline
          comments على الـ GitHub PR الحالي.
        </p>
        <p>
          <code>/batch &lt;instruction&gt;</code> مخصص للتغييرات الكبيرة على ملفات كتير —
          بيخطّط الشغل، بيستخدم git worktrees معزولة، ويقدر ينسّق التحقق والمتابعة على مستوى
          الـ PR. <code>/loop 5m check deploy status</code> بيشغّل prompt بشكل متكرر على
          فترات، مفيد لمتابعة العمليات الطويلة. <code>/proactive</code> هو alias لـ{" "}
          <code>/loop</code> — نفس السلوك بالظبط، بس الاسم بيقرأ أحسن لما الفكرة هي "فضل
          راقب وتصرّف على اللي بتشوفه". كلمة <code>ultracode</code> بتفعّل dynamic workflow
          run — الكلمة اللي بتفعّله اتسمّت من <code>workflow</code> لـ <code>ultracode</code>{" "}
          في v2.1.160.
        </p>
        <p>
          أمر <code>/debug</code> بيفعّل الـ verbose logging عشان يساعدك تشخّص مشاكل في سلوك
          Claude أو استخدام الأدوات. <code>/claude-api</code> بيحمّل مرجع الـ Anthropic SDK
          للغة المشروع — بيتفعّل تلقائيًا لما يكتشف imports من{" "}
          <code>@anthropic-ai/sdk</code> أو package الـ <code>anthropic</code> في Python.
        </p>
        <CodeBlock
          filename="bundled-skills.sh"
          lang="bash"
          code={`/code-review
/code-review high --comment
/batch add JSDoc comments to all public functions in src/
/loop 2m check if the build finished
/debug`}
        />
      </Reveal>

      <Reveal delay={70}>
        <Terminal
          script={skillsScript}
          title="الـ Skills المدمجة"
          loop
          showStatus
        />
      </Reveal>

      {/* ── Fast Mode ── */}
      <Reveal delay={0}>
        <h2>الوضع السريع (Fast Mode)</h2>
        <p>
          الوضع السريع هو configuration عالي السرعة لـ Opus بيدّيك نفس جودة الموديل بسرعة أعلى
          تصل لـ 2.5x، مقابل تكلفة tokens أعلى. متاح على Opus 4.8 (هو الافتراضي من v2.1.154)
          وOpus 4.7 وOpus 4.6 — بس fast mode على Opus 4.6 معاد إيقافه (deprecated) وهيتشال بعد
          إطلاق Opus 4.8 بحوالي 30 يوم. متاح عن طريق <code>/fast</code> أو عن طريق ضبط{" "}
          <code>fastMode: true</code> في إعدادات المستخدم. لما يتفعّل، أيقونة <code>↯</code>{" "}
          بتظهر جنب الـ prompt.
        </p>
        <CodeBlock
          filename="fast-mode.sh"
          lang="bash"
          code={`/fast          # فعّل/اقفل
/fast on       # فعّل صراحة
/fast off      # اقفل صراحة`}
        />
        <p>
          الوضع السريع بيحوّلك لـ Opus تلقائي لو على model تاني — Opus 4.8 بشكل افتراضي. لما
          تقفل الوضع السريع، بتفضل على Opus — استخدم <code>/model</code> عشان تغيّر.
        </p>
        <p>
          لو بتستخدم LLM gateway مخصص، اضبط{" "}
          <code>CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1</code> عشان يملي الـ{" "}
          <code>/model</code> picker من endpoint الـ <code>/v1/models</code> بتاع الـ gateway
          تلقائيًا.
        </p>
      </Reveal>

      <Reveal delay={70}>
        <Callout tone="info" title="الوضع السريع مقابل مستوى الـ effort">
          الوضع السريع ومستوى الـ effort حاجتين منفصلتين لتسريع الأداء.{" "}
          <code>/fast</code> بيقلل الـ latency من غير ما يأثر على الجودة.{" "}
          <code>/effort low</code> بيقلل وقت التفكير، واللي ممكن يقلل الجودة في المهام
          المعقدة. ادمجهم مع بعض لأقصى سرعة في الشغل البسيط:
          <CodeBlock
            filename="speed-combo.sh"
            lang="bash"
            code={`/fast
/effort low`}
          />
        </Callout>
      </Reveal>

      <Reveal delay={140}>
        <Terminal
          script={fastModeScript}
          title="الوضع السريع + Effort"
          loop
          showStatus
        />
      </Reveal>

      <Reveal delay={0}>
        <p>
          لما rate limit الوضع السريع يخلص، بيرجع تلقائي لسرعة Opus العادية (أيقونة{" "}
          <code>↯</code> بتبقى رمادية) وبيرجع يتفعّل لما الـ cooldown يخلص. الـ rate-limit
          pool بتاع الوضع السريع مشترك بين Opus 4.8 و4.7 و4.6. الوضع السريع محتاج usage
          credits يكون متفعّل على حسابك — أدِرهم بـ <code>/usage-credits</code> (الاسم الجديد
          من v2.1.144، اتغيّر من <code>/extra-usage</code>، والاسم القديم لسه شغّال) — ومش
          متاح على Bedrock أو Vertex AI أو Foundry أو Claude Platform on AWS، ولا على إضافة
          الـ VS Code.
        </p>
      </Reveal>

      {/* ── Keyboard Shortcuts ── */}
      <Reveal delay={0}>
        <h2>اختصارات الكيبورد والـ Power Features</h2>
        <p>
          <Kbd>Shift+Tab</Kbd> بيتنقل بين أوضاع الصلاحيات. الترتيب الرسمي هو{" "}
          <code>default</code>، <code>acceptEdits</code>، <code>plan</code>، وبعدين أوضاع
          اختيارية زي <code>auto</code> أو <code>bypassPermissions</code> لو متفعّلة عندك.
          دي أسرع طريقة تتحوّل لوضع plan لمهمة معقدة وترجع بعدها.
        </p>
        <p>
          <Kbd>Option+T</Kbd> (macOS) أو <Kbd>Alt+T</Kbd> بيفعّل الـ extended thinking —
          Claude بياخد وقت أطول في التفكير قبل ما يرد. استخدم <code>/effort</code> عشان تحدد
          عمق التفكير: <code>auto</code>، <code>low</code>، <code>medium</code>،{" "}
          <code>high</code>، <code>xhigh</code>، أو <code>max</code> لما يكون متاح.{" "}
          <code>max</code> بيتطبّق على الجلسة الحالية بس. <Kbd>Ctrl+O</Kbd> بيفعّل الـ verbose
          mode عشان تشوف الـ tool calls وخطوات التفكير وهي بتحصل.
        </p>
        <p>
          <code>/btw your question</code> بيسأل سؤال جانبي من غير ما يتضاف لتاريخ المحادثة —
          مفيد عشان تتأكد من حاجة أو تسأل عن syntax من غير ما تزحّم الـ context.{" "}
          <Kbd>Ctrl+B</Kbd> بيحط bash commands وagents شغّالة في الخلفية عشان تقدر تدي Claude
          تعليمات تانية وهي لسه شغّالة. لو عايز توقف كل الـ background agents، الاختصار
          الرسمي هو <Kbd>Ctrl+X Ctrl+K</Kbd>.
        </p>
        <p>
          <Kbd>Ctrl+U</Kbd> بيمسح الـ input buffer كله، و<Kbd>Ctrl+Y</Kbd> بيرجّع اللي لسه
          مسحته — مفيد لما تكون كتبت prompt طويل وعايز تبدأ من جديد من غير ما تفقده.{" "}
          <Kbd>Ctrl+L</Kbd> بيعمل full screen redraw بالإضافة لمسح الـ prompt input، مفيد لما
          الـ terminal يعمل drift أو tearing. في footer عارض الـ transcript، <Kbd>[</Kbd>{" "}
          بيصدّر الـ transcript لـ scrollback و<Kbd>v</Kbd> بيفتحه في الـ{" "}
          <code>$EDITOR</code> بتاعك.
        </p>
        <p>
          أمر <code>/diff</code> بيفتح عارض diff تفاعلي للتغييرات اللي لسه ما اتعملش لها
          commit — أحسن من قراءة output الـ git الخام لما تحب تراجع اللي Claude عمله قبل ما
          تعمل commit. <code>/insights</code> بيولّد تقرير تحليل الجلسة بإحصائيات عن اللي
          اتحقق.
        </p>
        <CodeBlock
          filename="shortcuts-demo.sh"
          lang="bash"
          code={`# التبديل لوضع plan والرجوع
Shift+Tab
Shift+Tab

/effort high
/btw what's the difference between async and defer on script tags?`}
        />
      </Reveal>

      <Reveal delay={70}>
        <Terminal
          script={shortcutsScript}
          title="اختصارات الكيبورد"
          loop
          showStatus
        />
      </Reveal>

      {/* ── Vim Visual Mode ── */}
      <Reveal delay={0}>
        <h2>وضع Vim المرئي (Visual Mode)</h2>
        <p>
          مستخدمي Vim بيحصلوا على visual selection في محرر الإدخال. اضغط <Kbd>v</Kbd> للتحديد
          بالحروف و<Kbd>V</Kbd> للتحديد بالأسطر. بمجرد ما تكون في الـ visual mode، مفاتيح
          التنقل (<Kbd>h</Kbd> <Kbd>j</Kbd> <Kbd>k</Kbd> <Kbd>l</Kbd> <Kbd>w</Kbd>{" "}
          <Kbd>e</Kbd> <Kbd>b</Kbd> <Kbd>f</Kbd> <Kbd>F</Kbd> <Kbd>t</Kbd> <Kbd>T</Kbd>)
          بتمدد التحديد. بعدين طبّق operator:
        </p>
        <p>
          <Kbd>d</Kbd>/<Kbd>x</Kbd> بيحذف، <Kbd>y</Kbd> بينسخ، <Kbd>c</Kbd>/<Kbd>s</Kbd>{" "}
          بيغيّر، <Kbd>p</Kbd> بيستبدل بمحتويات الـ register، <Kbd>r&#123;char&#125;</Kbd>{" "}
          بيستبدل كل حرف محدد، <Kbd>~</Kbd>/<Kbd>u</Kbd>/<Kbd>U</Kbd> بيبدّل أو يفرض حالة
          الأحرف، <Kbd>&gt;</Kbd>/<Kbd>&lt;</Kbd> بيعمل indent أو dedent، <Kbd>J</Kbd> بيدمج
          الأسطر، و<Kbd>o</Kbd> بيبدّل بين الـ cursor والـ anchor. الـ text objects زي{" "}
          <Kbd>iw</Kbd>، <Kbd>aw</Kbd>، <Kbd>i&quot;</Kbd>، <Kbd>a&quot;</Kbd>، <Kbd>i(</Kbd>،{" "}
          <Kbd>a(</Kbd> بتشتغل للتحديد الدقيق. الـ block-wise visual mode (<Kbd>Ctrl+V</Kbd>)
          مش مدعوم.
        </p>
      </Reveal>

      {/* ── Partial View ── */}
      <Reveal delay={0}>
        <h2>قراءة ملفات ضخمة — الـ Partial View</h2>
        <p>
          أداة Read بقت بترجّع صفحة أولى مقتطعة مع إشعار <code>PARTIAL view</code> بدل ما
          ترمي خطأ مانع لما قراءة الملف كامل تتجاوز حد الـ tokens. قبل كده، طلب من Claude يقرأ
          JSON dump حجمه 500 كيلوبايت أو bundle متولّد كان بيفشل تمامًا؛ دلوقتي بيرجّع الصفحة
          الأولى مع علامة واضحة إن فيه محتوى إضافي، ويقدر يستدعي Read تاني بـ{" "}
          <code>offset</code>/<code>limit</code> عشان يتنقّل في الباقي. ميزانية الـ tokens لكل
          قراءة بتتحكم فيها <code>CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS</code> — ارفعها
          للجلسات اللي محتاجة قراءات أكبر فعلًا، وقللها في البيئات المحدودة.
        </p>
        <Callout tone="tip" title="مش محتاج تعمل حاجة">
          لما Claude يشوف إشعار الـ partial view، بيعرف إنه إما يضيّق بـ <code>grep</code>{" "}
          الأول أو يقسّم القراءة بـ offset لحد ما يجمع اللي محتاجه. السلوك ده مهم بالذات في
          الـ migrations، logs الكبيرة، وأدوات زي <code>/init</code> اللي بتمسح ملفات كتير.
        </Callout>
      </Reveal>

      {/* ── /usage ── */}
      <Reveal delay={0}>
        <h2>/usage — إحصائيات الجلسة الموحّدة</h2>
        <p>
          أمر <code>/usage</code> بيعرض لوحة موحّدة بتحلّ محلّ اللي كان <code>/cost</code>{" "}
          و<code>/stats</code> بيعرضوه كل واحد لوحده — تقدير التكلفة الإجمالية، ومدة الـ API
          والـ wall-clock، والأسطر اللي اتضافت أو اتشالت. من v2.1.149، كمان بيعرض breakdown
          حسب الفئة بيوضّح اللي بيستهلك من حدودك: الـ skills والـ subagents والـ plugins وتكلفة
          كل MCP server على حدة. لمستخدمي الـ API بيعرض إحصائيات tokens مفصّلة؛ للمشتركين
          بيعرض شريط استخدام الخطة والنشاط. <code>/cost</code> و<code>/stats</code> لسه
          شغّالين كاختصارات بتفتح التاب المناسب. الأرقام بالدولار تقديرات محسوبة محليًا —
          راجع الـ Claude Console للفوترة الرسمية.
        </p>
      </Reveal>

      {/* ── /goal ── */}
      <Reveal delay={0}>
        <h2>/goal — الجلسات الموجّهة بهدف</h2>
        <p>
          أمر <code>/goal</code> بيحدد شرط إتمام Claude بيشتغل عليه عبر عدة أدوار. لما الهدف
          يبقى نشط، Claude بيفضل يشتغل بشكل مستقل لحد ما الشرط يتحقق. overlay حية بتعرض
          الوقت المنقضي وعدد الأدوار واستهلاك الـ tokens عشان تتابع التقدم من غير ما تقاطعه.
        </p>
        <CodeBlock
          filename="goal-examples.sh"
          lang="bash"
          code={`/goal migrate all API endpoints from REST to GraphQL
/goal all tests pass and coverage is above 80%`}
        />
        <p>
          الأهداف بتتماشي كويس مع <code>/effort high</code> للمهام المعقدة متعددة الخطوات.
          عشان تحدد عدد الأدوار اللي Claude ياخدها، اضبط{" "}
          <code>CLAUDE_CODE_MAX_TURNS</code> كمتغير بيئة:
        </p>
        <CodeBlock
          filename="max-turns.sh"
          lang="bash"
          code={`export CLAUDE_CODE_MAX_TURNS=50`}
        />
      </Reveal>

      {/* ── Session Recap ── */}
      <Reveal delay={0}>
        <h2>ملخص الجلسة (Session Recap)</h2>
        <p>
          لما ترجع للتيرمنال بعد ما تبعد شوية، Claude Code بيعرض ملخص من سطر واحد عن اللي
          حصل وأنت مش موجود. الملخص بيتولّد في الخلفية بعد ما يمر على الأقل تلات دقايق من
          آخر دور مكتمل والتيرمنال مش متركّز عليه، يعني بيكون جاهز لما ترجع. الملخصات بتظهر
          بس لما الجلسة فيها على الأقل تلات أدوار، ومش بتتكرر مرتين ورا بعض.
        </p>
        <p>
          شغّل <code>/recap</code> عشان تولّد ملخص في أي وقت. عشان تقفل الملخصات التلقائية،
          افتح <code>/config</code> واقفل <strong>Session recap</strong>. الملخص التلقائي
          مفعّل بشكل افتراضي على كل الخطط والـ providers. بيتم تخطيه دايمًا في الوضع غير
          التفاعلي.
        </p>
      </Reveal>

      {/* ── Command History ── */}
      <Reveal delay={0}>
        <h2>تاريخ الأوامر والبحث العكسي</h2>
        <p>
          Claude Code بيحفظ تاريخ الإدخال حسب مجلد العمل. إرسال نفس الـ prompt مرتين ورا بعض
          بيسجّل إدخال واحد بس، يعني الضغط على <Kbd>↑</Kbd> بيروح للـ prompt المختلف السابق.
          التاريخ بيتنضّف لما تشغّل <code>/clear</code>، بس محادثة الجلسة السابقة محفوظة
          لـ <code>/resume</code>.
        </p>
        <p>
          اضغط <Kbd>Ctrl+R</Kbd> عشان تبحث تفاعليًا في تاريخ الأوامر. اكتب نص البحث واضغط{" "}
          <Kbd>Ctrl+R</Kbd> تاني عشان تتنقل في النتايج الأقدم. البحث بيبدأ بشكل افتراضي في
          prompts من كل المشاريع — اضغط <Kbd>Ctrl+S</Kbd> عشان تتنقل بين نطاق الجلسة الحالية،
          المشروع الحالي، وكل المشاريع. اضغط <Kbd>Tab</Kbd> أو <Kbd>Esc</Kbd> عشان تقبل
          النتيجة وتكمل تعديل، <Kbd>Enter</Kbd> عشان تقبل وتنفّذ فورًا، أو{" "}
          <Kbd>Ctrl+C</Kbd> عشان تلغي.
        </p>
        <CodeBlock
          filename="history-search.sh"
          lang="bash"
          code={`Ctrl+R → اكتب "migration" → Ctrl+R (نتايج أقدم) → Tab (قبول)`}
        />
      </Reveal>

      {/* ── Custom Themes ── */}
      <Reveal delay={0}>
        <h2>الـ Themes المخصصة</h2>
        <p>
          أمر <code>/theme</code> بيخلّيك تنشئ وتتنقل بين themes ألوان مسمّاة. الـ themes
          بتتخزن كملفات JSON في <code>~/.claude/themes/</code> وممكن تعدّلها يدويًا. الـ plugins
          كمان ممكن توفّر themes عن طريق مجلد <code>themes/</code> في حزمة الـ plugin.
        </p>
      </Reveal>

      {/* ── Output Styles ── */}
      <Reveal delay={0}>
        <h2>أنماط الـ Output</h2>
        <p>
          أنماط الـ Output بتغيّر طريقة رد Claude من غير ما تغيّر اللي يعرفه. بتعدّل الـ system
          prompt عشان تحدد الدور والنبرة والصيغة. أربع أنماط مدمجة متاحة:
        </p>
        <ul>
          <li>
            <strong>Default</strong> — مساعد هندسة برمجيات عادي.
          </li>
          <li>
            <strong>Proactive</strong> — بينفّذ فورًا وبياخد قرارات معقولة بدل ما يوقف.
            توجيه أقوى من auto mode، بيشتغل مستقل عن وضع الصلاحيات.
          </li>
          <li>
            <strong>Explanatory</strong> — بيضيف &quot;Insights&quot; تعليمية بين خطوات الكود.
          </li>
          <li>
            <strong>Learning</strong> — وضع تعاوني Claude بيحط علامات{" "}
            <code>TODO(human)</code> على أجزاء استراتيجية عشان أنت تنفّذها.
          </li>
        </ul>
        <p>
          غيّر الأنماط من <code>/config</code> → <strong>Output style</strong>. الاختيار
          بيتحفظ في <code>.claude/settings.local.json</code>. التغييرات بتتطبق بعد{" "}
          <code>/clear</code> أو جلسة جديدة لأن نمط الـ output جزء من الـ system prompt.
        </p>
        <p>
          أنماط الـ output المخصصة هي ملفات Markdown بـ frontmatter. احفظها في{" "}
          <code>~/.claude/output-styles/</code> (user)، أو{" "}
          <code>.claude/output-styles/</code> (project)، أو مجلد الإعدادات المُدارة (policy).
          اسم الملف بيبقى اسم النمط إلا لو حددت <code>name:</code> في الـ frontmatter. اضبط{" "}
          <code>keep-coding-instructions: true</code> عشان تحافظ على تعليمات هندسة البرمجيات
          المدمجة جنب تعليماتك — سيبها من غير ما تحطها لما Claude مش بيعمل هندسة برمجيات
          خالص، زي مساعد كتابة أو محلل بيانات:
        </p>
        <CodeBlock
          filename="output-style.md"
          lang="markdown"
          code={`---
name: Diagrams first
description: Lead every explanation with a diagram
keep-coding-instructions: true
---

When explaining code, architecture, or data flow, start with a Mermaid diagram showing the structure, then explain in prose.`}
        />
        <Callout tone="note" title="أنماط output للـ plugins">
          الـ plugins ممكن توفّر output styles في مجلد <code>output-styles/</code>، وأنماط
          الـ plugin ممكن تضبط <code>force-for-plugin: true</code> عشان تتطبق تلقائيًا لما
          الـ plugin يتفعّل.
        </Callout>
      </Reveal>

      {/* ── Quiz ── */}
      <Reveal delay={0}>
        <Quiz questions={quizQuestions} title="الأوامر بالتفصيل — اختبر نفسك" />
      </Reveal>
    </Prose>
  );
}
