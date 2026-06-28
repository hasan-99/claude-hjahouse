import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Quiz, Prose, type QuizQuestion } from "@/components/content";
import { localize } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Terminal demo — يعرض تحميل الذاكرة وقبول طلب التذكر              */
/* ------------------------------------------------------------------ */
const memoryScript: Step[] = [
  { t: "print", text: "# تشغيل Claude Code في مجلد المشروع", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "claude", prompt: "$" },
  { t: "out", lines: [
    { text: "✓ تم تحميل ~/.claude/CLAUDE.md (ذاكرة المستخدم)", tone: "green" },
    { text: "✓ تم تحميل ./CLAUDE.md (ذاكرة المشروع)", tone: "green" },
    { text: "  لا توجد ذاكرة تلقائية — بدء من جديد", tone: "muted" },
    { text: "", tone: "default" },
    { text: "Claude Code جاهز. اكتب طلبك أو / للأوامر.", tone: "system" },
  ], gap: 70 },
  { t: "wait", ms: 600 },
  { t: "type", text: "remember that all API tests require Redis to be running", prompt: ">" },
  { t: "out", lines: [
    { text: "", tone: "default" },
    { text: "تمام. هضيف ده في CLAUDE.md الخاص بالمشروع عشان", tone: "default" },
    { text: "يكون متاح في كل الجلسات الجاية.", tone: "default" },
    { text: "", tone: "default" },
    { text: "تم تحديث CLAUDE.md:", tone: "amber" },
    { text: "  ## Testing", tone: "muted" },
    { text: "  All API tests require Redis to be running (`redis-server`).", tone: "green" },
  ], gap: 65 },
  { t: "wait", ms: 800 },
  { t: "type", text: "/memory", prompt: ">" },
  { t: "out", lines: [
    { text: "", tone: "default" },
    { text: "جارٍ فتح ملفات الذاكرة في المحرر…", tone: "system" },
    { text: "  [1] ~/.claude/CLAUDE.md         (مستخدم — عالمي)", tone: "blue" },
    { text: "  [2] ./CLAUDE.md                 (مشروع — مشترك)", tone: "blue" },
    { text: "  [3] ./CLAUDE.local.md           (محلي — مُتجاهَل بـ git)", tone: "blue" },
    { text: "  [4] ~/.claude/projects/.../MEMORY.md  (ذاكرة تلقائية)", tone: "purple" },
  ], gap: 60 },
  { t: "wait", ms: 700 },
  { t: "clear" },
  { t: "print", text: "# تعطيل الذاكرة التلقائية لجلسة واحدة", tone: "system" },
  { t: "wait", ms: 300 },
  { t: "type", text: "CLAUDE_CODE_DISABLE_AUTO_MEMORY=1 claude", prompt: "$" },
  { t: "out", lines: [
    { text: "✓ تم تحميل ~/.claude/CLAUDE.md", tone: "green" },
    { text: "✓ تم تحميل ./CLAUDE.md", tone: "green" },
    { text: "  الذاكرة التلقائية معطّلة لهذه الجلسة.", tone: "amber" },
  ], gap: 70 },
];

/* ------------------------------------------------------------------ */
/*  أسئلة الاختبار                                                     */
/* ------------------------------------------------------------------ */
const questions: QuizQuestion[] = [
  {
    q: "أي موقع من ملفات CLAUDE.md مُتجاهَل بواسطة git وهو مخصص للإعدادات الشخصية للمشروع؟",
    options: [
      "~/.claude/CLAUDE.md",
      "./CLAUDE.md",
      "./.claude/CLAUDE.md",
      "./CLAUDE.local.md",
    ],
    answer: 3,
    explanation:
      "CLAUDE.local.md هو الملف الشخصي الخاص بالمشروع. يُتجاهل بواسطة git بالاتفاقية، لذا تظل الـ aliases المخصصة والاختصارات المحلية خاصة ولا تُشارَك مع الفريق.",
  },
  {
    q: "ماذا يُستخدم أول 200 سطر أو 25 كيلوبايت من ~/.claude/projects/<project>/memory/MEMORY.md؟",
    options: [
      "لتخزين تجاوزات CLAUDE.md على مستوى المشروع",
      "الذاكرة التلقائية — تُحمَّل تلقائيًا في بداية كل جلسة",
      "الـ system prompt الذي يرسله Claude للـ API",
      "بيانات اعتماد خوادم MCP",
    ],
    answer: 1,
    explanation:
      "الذاكرة التلقائية مجلد يكتب فيه Claude ملاحظاته. أول 200 سطر أو 25 كيلوبايت من MEMORY.md تُحمَّل تلقائيًا في بداية كل جلسة. ملفات المواضيع الإضافية مثل debugging.md تُحمَّل عند الطلب.",
  },
  {
    q: "كيف تعمل الـ rules المخصصة للمسارات في .claude/rules/*.md؟",
    options: [
      "تنطبق على جميع الملفات في المشروع بشكل عالمي",
      "تتفعّل فقط عندما يعمل Claude على ملفات مطابقة لنمط الـ frontmatter",
      "تستبدل CLAUDE.md بالكامل للمسارات المطابقة",
      "يجب تحميلها يدويًا بـ /memory قبل كل جلسة",
    ],
    answer: 1,
    explanation:
      "rule بـ 'paths: src/api/**/*.ts' في الـ frontmatter يتفعّل فقط عندما يقرأ Claude ملفات مطابقة لهذا النمط. الـ rules بدون حقل paths تُحمَّل عند بدء التشغيل بنفس أولوية .claude/CLAUDE.md.",
  },
  {
    q: "أين يجب ضبط autoMemoryDirectory لو أردت نقل الذاكرة التلقائية لمسار مخصص؟",
    options: [
      "في إعدادات المشروع (./claude/settings.json)",
      "في CLAUDE.local.md",
      "في إعدادات المستخدم (~/.claude/settings.json)",
      "كمتغير بيئة CLAUDE_AUTO_MEMORY_DIR",
    ],
    answer: 2,
    explanation:
      "يجب ضبط autoMemoryDirectory في إعدادات المستخدم، وليس إعدادات المشروع أو المحلية. إعدادات المشروع والمحلية يمكنها توجيه الكتابة لأماكن حساسة وبالتالي غير مقبولة لهذا الخيار.",
  },
];

/* ------------------------------------------------------------------ */
/*  جسم الوحدة                                                         */
/* ------------------------------------------------------------------ */
export default function Content() {
  return (
    <Prose>
      {/* مقدمة */}
      <Reveal delay={0}>
        <p>
          الذاكرة في Claude Code معناها إن فيه context بيفضل موجود حتى بعد ما تقفل
          الجلسة وتفتح واحدة جديدة. يعني مش زي نافذة المحادثة العادية اللي بتتمسح
          — ملفات الذاكرة بتتحمّل تلقائيًا كل مرة تشغّل فيها Claude Code. الموديول
          ده بيشرح ترتيب ملفات الذاكرة، إزاي تعملها وتحدّثها، وإزاي الذاكرة
          التلقائية بتشتغل في الخلفية.
        </p>
      </Reveal>

      {/* ── القسم الأول: تسلسل الذاكرة ──────────────────────────────── */}
      <Reveal delay={70}>
        <h2>تسلسل الذاكرة</h2>
        <p>
          Claude Code عنده نظامين أساسيين للذاكرة: ملفات <code>CLAUDE.md</code> اللي
          بتكتبها <em>أنت</em>، والذاكرة التلقائية اللي <em>Claude</em> بيكتبها
          لنفسه. المواقع الرسمية لملفات <code>CLAUDE.md</code>، من الأعلى للأكثر
          تخصيصًا، هي:
        </p>
        <ul>
          <li>
            <strong>سياسة المؤسسة (Managed policy)</strong> — إعدادات على مستوى
            المنظمة يدفعها المدير
          </li>
          <li>
            <strong>تعليمات المشروع</strong> — <code>CLAUDE.md</code> أو{" "}
            <code>.claude/CLAUDE.md</code> في جذر المشروع، محفوظة في git
          </li>
          <li>
            <strong>تعليمات المستخدم</strong> — <code>~/.claude/CLAUDE.md</code>،
            تفضيلاتك الشخصية العالمية
          </li>
          <li>
            <strong>التعليمات المحلية</strong> — <code>./CLAUDE.local.md</code>،
            إعدادات شخصية خاصة بالمشروع ومُتجاهَلة بواسطة git
          </li>
        </ul>
      </Reveal>

      <Reveal delay={140}>
        <p>
          <strong>ذاكرة المشروع</strong> هي اللي هتستخدمها أكتر حاجة. دي ملف
          markdown بيتعمل له commit في git وبيتشارك مع الفريق. حط فيها الـ tech
          stack، الـ naming conventions، الأوامر الشائعة، والحاجات الغير واضحة
          اللي ممكن تلخبط حد جديد.{" "}
          <strong>ذاكرة المستخدم</strong> هي للتفضيلات الشخصية اللي بتنطبق على كل
          مشاريعك — الـ patterns اللي بتفضّلها، إزاي تحب الكود يتشرح، الأدوات اللي
          بتستخدمها دايمًا.
        </p>
        <Callout tone="tip" title="قاعدة عملية">
          استخدم ذاكرة المشروع لكل حاجة زميلك محتاج يفهمها عن الـ codebase — خطوات
          الـ setup، أوامر الـ testing، قرارات الـ architecture. استخدم ذاكرة
          المستخدم للي بتحب تشتغل بيها أنت شخصيًا، مش اللي المشروع بيعمله. لو أي
          entry في ذاكرة المشروع ليها علاقة بيك أنت بس (مثلًا، alias مخصص أو
          shortcut محلي)، حطها في <code>CLAUDE.local.md</code> بدلًا عشان تفضل
          خاصة.
        </Callout>
      </Reveal>

      {/* الـ rules المخصصة للمسارات */}
      <Reveal delay={210}>
        <h3>الـ Rules المخصصة للمسارات</h3>
        <p>
          للمشاريع الكبيرة، قسّم التعليمات في ملفات{" "}
          <code>.claude/rules/*.md</code>. الـ rules ممكن تكون عامة على المشروع كله
          أو مخصصة لمسارات معينة باستخدام الـ frontmatter. rule بـ{" "}
          <code>paths: src/api/**/*.ts</code> بيتفعّل بس لما Claude يشتغل على ملفات
          مطابقة:
        </p>
      </Reveal>

      <Reveal delay={280}>
        <CodeBlock
          filename=".claude/rules/api-validation.md"
          lang="markdown"
          code={`---
paths: src/api/**/*.ts
---
All API endpoints must validate input with Zod. Return 400 with field-level errors on validation failure.`}
        />
        <p>
          الـ rules المخصصة للمسارات بتتفعّل لما Claude يقرأ ملفات مطابقة للـ
          pattern، مش مع كل استخدام للأداة. الـ rules من غير حقل <code>paths</code>{" "}
          بيتحمّل عند بدء التشغيل بنفس أولوية <code>.claude/CLAUDE.md</code>. الـ
          circular symlinks بتُنشأ وتُدار بشكل آمن.
        </p>
      </Reveal>

      {/* ── القسم الثاني: إنشاء وتحديث الذاكرة ─────────────────────── */}
      <Reveal delay={350}>
        <h2>إنشاء وتحديث الذاكرة</h2>
        <p>
          أسرع طريقة تبدأ بيها هي <code>/init</code>. شغّله في مجلد المشروع بتاعك
          وClaude هيحلل الكود ويولّد ملف <code>CLAUDE.md</code> كبداية. استخدم{" "}
          <code>CLAUDE_CODE_NEW_INIT=1 claude</code> لو عايز تجربة إعداد تفاعلية
          متعددة المراحل.
        </p>
        <p>
          للتعديلات الأكبر، <code>/memory</code> بيفتح ملفات الذاكرة بتاعتك في الـ
          editor بتاعك. عدّل، احفظ، وClaude هيحمّلها تلقائيًا. لو عايز Claude يفتكر
          حاجة تلقائيًا، قوله بشكل طبيعي، زي{" "}
          <em>&ldquo;remember that the API tests require Redis.&rdquo;</em> لو عايز
          الحاجة تتكتب في <code>CLAUDE.md</code>، قول لـ Claude صراحة يضيفها هناك.
        </p>
      </Reveal>

      {/* اختصار # */}
      <Reveal delay={420}>
        <h3>اختصار #</h3>
        <p>
          ابدأ أي رسالة بـ <code>#</code> عشان تقول لـ Claude يحفظ الملاحظة دي في
          الذاكرة فورًا بدون ما يعمل أي حاجة تانية:
        </p>
      </Reveal>

      <Reveal delay={490}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`> # all API tests require Redis to be running
# Saved to CLAUDE.md under ## Testing.`}
        />
      </Reveal>

      {/* صيغة @import */}
      <Reveal delay={560}>
        <h3>صيغة @import</h3>
        <p>
          الـ syntax بتاع <code>@path/to/file</code> بيخلّيك تشير لملفات
          documentation موجودة بدل ما تنسخها. Claude بيقرأ الملفات المشار إليها
          وبيدمجها في الـ context بتاعه عند بداية الجلسة:
        </p>
      </Reveal>

      <Reveal delay={630}>
        <CodeBlock
          filename="CLAUDE.md"
          lang="markdown"
          code={`# Project Standards

@README.md
@docs/architecture.md
@package.json`}
        />
        <Callout tone="note">
          الـ imports بتدعم أقصى عمق من أربعة hops. أول مرة تستورد ملف من مسار
          خارجي، هيظهر لك dialog للموافقة قبل ما Claude يقرأ الملف.
        </Callout>
      </Reveal>

      {/* ── القسم الثالث: الذاكرة التلقائية ────────────────────────── */}
      <Reveal delay={700}>
        <h2>الذاكرة التلقائية</h2>
        <p>
          الذاكرة التلقائية هي مجلد Claude بيكتب فيه ملاحظاته خلال الجلسات —
          patterns اكتشفها، سلوكيات خاصة بالمشروع، insights من الـ debugging. أول{" "}
          <strong>200 سطر</strong> أو <strong>25 كيلوبايت</strong> من{" "}
          <code>~/.claude/projects/&lt;project&gt;/memory/MEMORY.md</code>، أيهما
          أقل، بيتحمّلوا تلقائيًا في بداية كل جلسة. ملفات المواضيع الإضافية زي{" "}
          <code>debugging.md</code> و<code>api-conventions.md</code> بتتحمّل عند
          الطلب.
        </p>
        <p>
          الـ subagents كمان تقدر تحافظ على الذاكرة التلقائية الخاصة بيها. شوف{" "}
          <a href={localize("/learn/subagents", "ar")}>إعدادات الـ subagents</a>{" "}
          للتفاصيل.
        </p>
      </Reveal>

      <Reveal delay={770}>
        <p>
          مش محتاج تدير الذاكرة التلقائية يدويًا — Claude بيتولّى الكتابة بنفسه.
          تقدر تقرأ الملفات وتعدّلها لو حبيت تصحّح أو تضيف على ملاحظات Claude.
          تقدر تتحكم فيها من <code>/memory</code>، أو تعطّلها لجلسة واحدة بـ{" "}
          <code>CLAUDE_CODE_DISABLE_AUTO_MEMORY=1 claude</code>، أو تظبط{" "}
          <code>autoMemoryEnabled</code> في الإعدادات.
        </p>
        <p>
          لو عايز تنقل المجلد لمكان متزامن أو مسار مخصص، اظبط{" "}
          <code>autoMemoryDirectory</code> في <strong>إعدادات المستخدم</strong> (مش
          إعدادات المشروع أو المحلية — إعدادات المشروع والمحلية ممكن توجّه الكتابة
          لمكان غير آمن وبالتالي مش مقبولة):
        </p>
      </Reveal>

      <Reveal delay={840}>
        <CodeBlock
          filename="~/.claude/settings.json"
          lang="json"
          code={`{
  "autoMemoryEnabled": true,
  "autoMemoryDirectory": "/path/to/shared/memory"
}`}
        />
      </Reveal>

      {/* استثناء الملفات في الـ monorepos */}
      <Reveal delay={910}>
        <h3>استثناء الملفات في الـ Monorepos</h3>
        <p>
          في الـ monorepos الكبيرة اللي فيها ملفات <code>CLAUDE.md</code> كتير،
          استخدم <code>claudeMdExcludes</code> في الإعدادات عشان تتخطّى الملفات اللي
          مش محتاجها:
        </p>
      </Reveal>

      <Reveal delay={980}>
        <CodeBlock
          filename="~/.claude/settings.json"
          lang="json"
          code={`{
  "claudeMdExcludes": [
    "packages/legacy-app/CLAUDE.md",
    "vendors/**/CLAUDE.md"
  ]
}`}
        />
        <p>
          Claude كمان بيحمّل ملفات <code>CLAUDE.md</code> اللي يلاقيها <em>فوق</em>{" "}
          مجلد العمل الحالي، وبيحمّل ملفات <code>CLAUDE.md</code> اللي في المجلدات
          الفرعية عند الطلب لما Claude يقرأ ملفات فيها. في الـ monorepos،{" "}
          <code>claudeMdExcludes</code> بيساعدك تبعد التعليمات اللي مش ليها علاقة
          من الـ context.
        </p>
      </Reveal>

      {/* ── عرض توضيحي بالطرفية ───────────────────────────────────── */}
      <Reveal delay={1050}>
        <h2>مشاهدة الذاكرة عملياً</h2>
        <p>
          العرض التالي يبيّن Claude وهو بيحمّل الذاكرة عند بدء التشغيل، وبيستجيب
          لطلب &ldquo;remember&rdquo; بشكل طبيعي، وأمر <code>/memory</code> وهو
          بيعرض ملفات الذاكرة المتاحة.
        </p>
      </Reveal>

      <Reveal delay={1120}>
        <Terminal
          script={memoryScript}
          title="عرض الذاكرة و CLAUDE.md"
          loop={true}
          loopDelay={3000}
          showStatus={true}
        />
      </Reveal>

      {/* ── القسم الرابع: كتابة تعليمات فعّالة ──────────────────────── */}
      <Reveal delay={1190}>
        <h2>كتابة تعليمات فعّالة</h2>
        <p>
          الـ context window visualization بيعرض مكان تحميل الـ{" "}
          <code>CLAUDE.md</code> بالنسبة لباقي سياق بدء التشغيل. استخدمه عشان
          تفهم قد إيه المساحة اللي بتستهلكها تعليماتك.
        </p>
        <ul>
          <li>
            استهدف <strong>أقل من 200 سطر</strong> لكل ملف <code>CLAUDE.md</code>{" "}
            — الملفات الأطول بتاخد مساحة أكبر من الـ context وبتقلل الالتزام.
          </li>
          <li>
            لو التعليمات بتكبر، استخدم الـ path-scoped rules عشان التعليمات
            تتحمّل بس لما Claude يشتغل على ملفات مطابقة.
          </li>
          <li>
            فضّل استخدام مراجع <code>@import</code> للـ docs الفعلية للمشروع عوضًا
            عن نسخ المحتوى داخل <code>CLAUDE.md</code>.
          </li>
          <li>
            حافظ على ذاكرة المستخدم (<code>~/.claude/CLAUDE.md</code>) مركّزة على
            أسلوب عملك الشخصي، مش الحقائق الخاصة بالمشروع.
          </li>
        </ul>
      </Reveal>

      <Reveal delay={1260}>
        <Callout tone="warn" title="ميزانية الـ Context">
          كل سطر في <code>CLAUDE.md</code> بتاعك بياكل من الـ context في كل
          turn. ملف من 2000 سطر بيسيب مساحة أقل بكتير للكود الفعلي ومخرجات
          الأدوات والمحادثة. خلّيه مضغوطًا واستخدم الـ path-scoped rules عشان
          تحمّل التعليمات بس لما تحتاجها.
        </Callout>
      </Reveal>

      {/* ── الاختبار ─────────────────────────────────────────────────── */}
      <Reveal delay={1330}>
        <Quiz questions={questions} title="الذاكرة و CLAUDE.md — اختبر نفسك" />
      </Reveal>
    </Prose>
  );
}
