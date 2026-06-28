import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Prose, Quiz, type QuizQuestion } from "@/components/content";

/* ─── Terminal demo script (Arabic labels) ─── */
const hookDemo: Step[] = [
  { t: "print", text: "# عرض نظام الـ hooks في Claude Code", tone: "muted" },
  { t: "wait", ms: 400 },
  { t: "type", text: "claude 'أضف ملف .env مع API_KEY=secret'", prompt: "$" },
  { t: "out", lines: [
    { text: "Claude: هجهز الملف .env بالمتغير المطلوب.", tone: "system" },
    { text: "[PreToolUse] matcher: Write — تشغيل security-check.sh …", tone: "amber" },
    { text: "⚠  Hook مانع: ملف .env يحتوي على سر محتمل (API_KEY)", tone: "error" },
    { text: "Claude: لا أستطيع كتابة ملفات .env تحتوي على أسرار.", tone: "system" },
  ], gap: 80 },
  { t: "wait", ms: 600 },
  { t: "type", text: "claude 'أعِد هيكلة utils.ts ونسّقها'", prompt: "$" },
  { t: "out", lines: [
    { text: "Claude: تعديل src/utils.ts …", tone: "system" },
    { text: "[PostToolUse] matcher: Write|Edit — تشغيل prettier …", tone: "amber" },
    { text: "src/utils.ts نُسّقت بنجاح ✓", tone: "green" },
    { text: "Claude: تم. الملف منسّق ومُودَع.", tone: "system" },
  ], gap: 80 },
  { t: "wait", ms: 600 },
  { t: "type", text: "claude 'شغّل كل الاختبارات وقدّم ملخصًا'", prompt: "$" },
  { t: "out", lines: [
    { text: "Claude: تشغيل الاختبارات …", tone: "system" },
    { text: "[Stop] prompt hook — التحقق من معايير الاكتمال …", tone: "amber" },
    { text: "✓ 47 اختبارًا ناجحًا. تم تحديث وصف الـ PR.", tone: "green" },
    { text: "Claude: المهمة اكتملت. كل الفحوصات نجحت.", tone: "system" },
  ], gap: 80 },
  { t: "wait", ms: 800 },
  { t: "clear" },
];

/* ─── Quiz questions ─── */
const questions: QuizQuestion[] = [
  {
    q: "ما الـ exit code الذي يجعل hook من نوع PreToolUse يمنع الأداة ويعرض خطأً لـ Claude؟",
    options: ["Exit code 0", "Exit code 1", "Exit code 2", "Exit code 3"],
    answer: 2,
    explanation:
      "Exit code 2 هو كود المنع. Claude يتوقف ويعرض رسالة الـ stderr الخاصة بك. Exit code 0 يعني نجاح، وأي كود آخر غير صفري هو تحذير غير مانع يظهر في verbose mode فقط.",
  },
  {
    q: "ما الغرض من حقل `matcher` في تعريف الـ hook؟",
    options: [
      "يحدد مترجم الـ shell المستخدم",
      "نمط regex يتطابق مع اسم الأداة لتحديد متى يشتغل الـ hook",
      "يضبط مهلة تنفيذ الـ hook بالثواني",
      "يختار جلسة المستخدم الذي ينطبق عليه الـ hook",
    ],
    answer: 1,
    explanation:
      "حقل `matcher` هو نمط regex يتطابق مع اسم الأداة. مثلًا، `\"Bash\"` يطابق بالضبط، `\"Write|Edit\"` يطابق أيًا منهما، و`\"mcp__github__.*\"` يطابق كل أدوات GitHub MCP.",
  },
  {
    q: "ماذا تفعل خاصية `once: true` في frontmatter الـ skill؟",
    options: [
      "تشغّل الـ hook مرة واحدة فقط في أول استدعاء للأداة المطابقة",
      "تشغّل الـ hook مرة واحدة فقط في الجلسة بدلًا من كل استخدام للأداة",
      "تمنع الـ hook من التشغيل أكثر من مرة لكل ملف",
      "تحدّ مهلة الـ hook بثانية واحدة",
    ],
    answer: 1,
    explanation:
      "خاصية `once: true` تشغّل الـ hook مرة واحدة فقط في الجلسة بدلًا من كل مرة تتطابق فيها الأداة. مفيد لفحوصات الإعداد التي تحتاج أن تحدث مرة واحدة فقط — كفحص بيانات الاعتماد في بداية skill النشر.",
  },
  {
    q: "أي حدث hook يمكنه منع Claude Code من ضغط المحادثة؟",
    options: ["PostCompact", "PreToolUse", "PreCompact", "UserPromptSubmit"],
    answer: 2,
    explanation:
      "PreCompact يعمل قبل أن يضغط Claude Code المحادثة. يمكنه منع الضغط بـ exit code 2 أو بإرجاع `{\"decision\": \"block\", \"reason\": \"...\"}`. PostCompact يشتغل بعد نجاح الضغط وهو المكان المناسب لإعادة الإرفاق أو التسجيل.",
  },
];

export default function Content() {
  return (
    <Prose>
      {/* ── مقدمة ── */}
      <Reveal delay={0}>
        <p>
          الـ hooks هي scripts بتشتغل تلقائيًا لما أحداث معينة تحصل خلال جلسة Claude Code.
          بتستقبل JSON input عبر stdin وبتتواصل عن طريق exit codes وJSON output.
          الـ command hooks deterministic، قابلة للاختبار، ومش مرتبطة بلغة معينة.
          أما الـ prompt hooks والـ agent hooks فبيستخدموا Claude model للتقييم، فسلوكهم غير
          deterministic. في الموديول ده، هنغطي نظام الـ hooks، الأحداث الأساسية، وإزاي تكتب
          hooks مفيدة.
        </p>
      </Reveal>

      {/* ── عرض حي ── */}
      <Reveal delay={70}>
        <Terminal
          script={hookDemo}
          title="عرض الـ hooks"
          loop
          showStatus
          className="my-8"
        />
      </Reveal>

      {/* ══════════════════════════════════════════════
          القسم 1 — هيكلة الـ Hooks وإعدادها
      ══════════════════════════════════════════════ */}
      <Reveal delay={0}>
        <h2>هيكلة الـ Hooks وإعدادها</h2>
        <p>
          الـ hooks بتتحدد في ملفات الإعدادات تحت مفتاح <code>hooks</code>. كل حدث (event)
          عنده مصفوفة من الـ matchers، وكل matcher عنده مصفوفة من تعريفات الـ hooks. الـ{" "}
          <code>matcher</code> field هو regex pattern بيتطبّق على اسم الأداة —{" "}
          <code>&quot;Bash&quot;</code> بيطابق بالظبط، <code>&quot;Write|Edit&quot;</code>{" "}
          بيطابق أي واحدة فيهم، <code>&quot;*&quot;</code> بيطابق كل الأدوات، و{" "}
          <code>&quot;mcp__github__.*&quot;</code> بيطابق كل أدوات GitHub MCP.
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename=".claude/settings.json"
          lang="json"
          code={`{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 \\"$CLAUDE_PROJECT_DIR/.claude/hooks/validate-bash.py\\"",
            "timeout": 10
          }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          الـ matchers كمان بتدعم خاصية <code>if</code> المشروطة (v2.1.85) اللي بتستخدم
          صيغة permission rules عشان تفلتر أكتر إمتى الـ hook يشتغل. الـ{" "}
          <code>matcher</code> بيختار الأداة بالاسم، لكن <code>if</code> بيحدد
          استدعاءات معينة من الأداة دي. ده مفيد لما تبقى عايز تعترض أوامر{" "}
          <code>git push</code> بس من غير ما تشغّل الـ hook على كل أمر Bash:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".claude/settings.json"
          lang="json"
          code={`{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "if": "Bash(git push*)",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/check-push.sh"
          }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      <Reveal delay={280}>
        <Callout tone="info" title="صيغة حقل if">
          الـ <code>if</code> pattern بيتبع نفس صيغة permission rules —{" "}
          <code>Bash(git *)</code> بيطابق أي أمر git، و{" "}
          <code>Write(src/**/test_*.py)</code> بيطابق كتابة ملفات الاختبار. الـ hook اللي
          عنده <code>if</code> مبيشتغلش غير لما الـ <code>matcher</code> والـ{" "}
          <code>if</code> الاتنين يتطابقوا.
        </Callout>
      </Reveal>

      {/* ── أحداث الـ Hook الـ 30 ── */}
      <Reveal delay={0}>
        <h3>الأحداث الـ 30 للـ Hook</h3>
        <p>
          Claude Code بيدعم 30 hook event. أكتر الأحداث فائدة في الشغل اليومي:
        </p>
        <ul>
          <li>
            <strong>PreToolUse</strong> — تحقق قبل ما الأداة تشتغل، ممكن يمنع.
          </li>
          <li>
            <strong>PostToolUse</strong> — راقب أو تفاعل بعد ما تخلص، ممكن يضيف سياق أو
            يستبدل الناتج.
          </li>
          <li>
            <strong>UserPromptSubmit</strong> — اعترض input المستخدم قبل ما Claude يعالجه.
          </li>
          <li>
            <strong>Stop</strong> — شغّل فحوصات لما Claude يخلّص رد.
          </li>
        </ul>
        <p>
          فيه كمان أحداث للتعامل مع الصلاحيات (<code>PermissionRequest</code>)،
          والإشعارات، ودورة حياة الـ subagent (<code>SubagentStart</code>،{" "}
          <code>SubagentStop</code>)، والأخطاء (<code>PostToolUseFailure</code>،{" "}
          <code>StopFailure</code>)، وتغييرات الإعدادات، ومراقبة الملفات (
          <code>FileChanged</code>)، وضغط السياق (<code>PreCompact</code>،{" "}
          <code>PostCompact</code>)، وإدارة الـ worktree.
        </p>
      </Reveal>

      {/* ── أحداث أحدث ── */}
      <Reveal delay={70}>
        <h3>أحداث دورة الحياة الأحدث</h3>
        <p>
          عدة أحداث أحدث بتوسّع ما يمكن للـ hooks أن ترد عليه:
        </p>
        <ul>
          <li>
            <strong>CwdChanged</strong> (v2.1.83) — بيشتغل لما الـ working directory يتغير،
            زي direnv بالظبط، ممكن تحمّل environment variables تلقائيًا لما Claude يدخل
            مجلد مشروع.
          </li>
          <li>
            <strong>TaskCreated</strong> (v2.1.84) — بيشتغل لما الأداة{" "}
            <code>TaskCreate</code> تتستخدم، عشان تقدر تسجّل أو تتحقق من المهام الجديدة
            فور إنشائها.
          </li>
          <li>
            <strong>WorktreeCreate</strong> (v2.1.84) — بيشتغل لما worktree agent يتعمل،
            وبيدعم <code>type: &quot;http&quot;</code> للإشعارات البعيدة.
          </li>
          <li>
            <strong>Elicitation</strong> (v2.1.76) — بيشتغل لما MCP server يطلب input
            منظم من المستخدم في نص المهمة عبر dialog تفاعلي. ممكن يعترض ويعدّل الـ
            elicitation قبل ما يتعرض على المستخدم.
          </li>
          <li>
            <strong>ElicitationResult</strong> (v2.1.76) — بيشتغل بعد ما المستخدم يرد على
            MCP elicitation. ممكن يعترض ويغيّر الرد قبل ما يترجع للـ MCP server.
          </li>
        </ul>
      </Reveal>

      {/* ── PreCompact / PostCompact ── */}
      <Reveal delay={140}>
        <h3>PreCompact وPostCompact</h3>
        <p>
          <code>PreCompact</code> بيشتغل قبل ما Claude Code يضغط المحادثة لتوفير context،
          ويقدر يمنع الضغط من إنه يحصل — مفيد لما تحب تاخد snapshot للحالة، أو تحذّر
          المستخدم، أو ترفض auto-compaction ممكن يرمي context مهم. الـ{" "}
          <code>matcher</code> بتاع الحدث بيفرّق بين السبب: <code>&quot;manual&quot;</code>{" "}
          لما المستخدم شغّل <code>/compact</code>، و<code>&quot;auto&quot;</code> لما Claude
          Code ضغط تلقائيًا لأن الـ context اتملى.
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".claude/settings.json"
          lang="json"
          code={`{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "auto",
        "hooks": [
          { "type": "command", "command": "./scripts/snapshot-context.sh" }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      <Reveal delay={280}>
        <Callout tone="note" title="منع ضغط السياق">
          رجّع{" "}
          <code>
            {`{"decision": "block", "reason": "مراجعة نشطة جارية"}`}
          </code>{" "}
          من السكريبت عشان تسيب المحادثة زي ما هي. <code>PostCompact</code> بيشتغل بعد
          ما الضغط ينجح — المكان المناسب لإعادة إرفاق notes أو إعادة استدعاء skill أو
          تسجيل ما اتحفظ.
        </Callout>
      </Reveal>

      {/* ── قراءة الـ JSON input ── */}
      <Reveal delay={0}>
        <h3>قراءة الـ Hook Input</h3>
        <p>
          سكريبتات الـ hook بتستقبل JSON عبر stdin وعندها وصول لعدة متغيرات بيئة Claude Code
          بيضبطها تلقائيًا. <code>CLAUDE_CODE_SESSION_ID</code> فيه معرّف الجلسة الفريد —
          استخدمه لربط سجلات الـ hook والـ telemetry الخارجية بجلسة معيّنة.
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename="hooks/read-input.py"
          lang="python"
          code={`import json, sys, os

data = json.load(sys.stdin)
tool_name  = data.get("tool_name", "")
tool_input = data.get("tool_input", {})
session_id = os.environ.get("CLAUDE_CODE_SESSION_ID", "")`}
        />
      </Reveal>

      <Reveal delay={140}>
        <p>
          Exit code <strong>0</strong> معناه نجاح (اقرأ JSON stdout للناتج). Exit code{" "}
          <strong>2</strong> معناه خطأ مانع — Claude بيوقف ويعرض رسالة الـ stderr بتاعتك.
          أي exit code تاني هو تحذير غير مانع بيظهر في verbose mode بس.
        </p>
        <p>
          الـ input بتاع الـ hook بيحتوي على object اسمه <code>effort</code> مع مستوى
          الجهد الحالي: <code>{`{ "effort": { "level": "medium" } }`}</code>. المستويات
          المتاحة هي <code>low</code> و<code>medium</code> و<code>high</code> و
          <code>xhigh</code> و<code>max</code> و<code>auto</code>. نفس القيمة متاحة
          كمتغير بيئة <code>$CLAUDE_EFFORT</code>:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename="hooks/read-effort.py"
          lang="python"
          code={`import json, os, sys

data = json.load(sys.stdin)
effort_level = data.get("effort", {}).get("level", "medium")  # من الـ JSON
effort_env   = os.environ.get("CLAUDE_EFFORT", "medium")       # من متغير البيئة`}
        />
      </Reveal>

      {/* ══════════════════════════════════════════════
          القسم 2 — أنواع الـ Hooks والأنماط
      ══════════════════════════════════════════════ */}
      <Reveal delay={0}>
        <h2>أنواع الـ Hooks الشائعة والأنماط</h2>

        <h3>Shell Form مقابل Exec Form</h3>
        <p>
          الـ command hooks بتدعم شكلين. <strong>Shell form</strong> (الافتراضي) بيمرّر
          الـ <code>command</code> string لـ shell عشان يعمل tokenization.{" "}
          <strong>Exec form</strong> بيحدد مصفوفة <code>args</code> جنب الـ{" "}
          <code>command</code>، وبيشغّل العملية مباشرة من غير shell — ده بيتجنّب مشاكل الـ
          shell escaping وأكتر أمانًا لأوامر فيها arguments من المستخدم:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename=".claude/settings.json"
          lang="json"
          code={`{
  "type": "command",
  "command": "node",
  "args": ["./scripts/validate.js", "--strict"]
}`}
        />
      </Reveal>

      {/* ── أنواع الـ hooks الخمسة ── */}
      <Reveal delay={140}>
        <h3>أنواع الـ Hooks الخمسة</h3>
        <p>الـ hooks بتشتغل بخمس طرق:</p>
        <ul>
          <li>
            <strong>command</strong> — تنفّذ أوامر shell محلية.
          </li>
          <li>
            <strong>prompt</strong> — تطلب من Claude يقيّم prompt معين، عادةً على أحداث{" "}
            <code>Stop</code> أو <code>SubagentStop</code>.
          </li>
          <li>
            <strong>agent</strong> — تشغّل subagent لعمل تحقق متعدد الخطوات (على عكس
            prompt hooks، ممكن تستخدم أدوات).
          </li>
          <li>
            <strong>http</strong> — تعمل POST لنفس الـ JSON payload على webhook endpoint —
            مفيدة للـ logging البعيد أو خدمات السياسات. الـ HTTP hooks بتدعم interpolation
            لمتغيرات البيئة في الـ headers.
          </li>
          <li>
            <strong>mcp_tool</strong> — تستدعي أداة MCP بشكل مباشر — مفيدة لما hook
            محتاج يتواصل مع خدمات خارجية (زي النشر على Slack أو إنشاء issue على GitHub)
            بدون استخدام الـ shell.
          </li>
        </ul>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".claude/settings.json — مثال mcp_tool"
          lang="json"
          code={`{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "mcp_tool",
            "server": "slack",
            "tool": "send_message",
            "input": { "channel": "#deploys", "text": "Claude أنهى المهمة" }
          }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      {/* ── duration_ms ── */}
      <Reveal delay={280}>
        <Callout tone="tip" title="حقل duration_ms">
          inputs الـ <code>PostToolUse</code> و<code>PostToolUseFailure</code> بتتضمّن
          خاصية <code>duration_ms</code> فيها وقت تنفيذ الأداة بالميلي ثانية (من غير وقت
          طلبات الصلاحيات وhooks الـ PreToolUse). استخدمها عشان تتتبّع الأدوات البطيئة أو
          تعمل تنبيهات لما أداة تتجاوز حد معين.
        </Callout>
      </Reveal>

      {/* ── Stop / SubagentStop background_tasks ── */}
      <Reveal delay={0}>
        <h3>Stop وSubagentStop — background_tasks وsession_crons</h3>
        <p>
          inputs الـ <code>Stop</code> و<code>SubagentStop</code> كمان بقت تحمل arrays
          اسمهم <code>background_tasks</code> و<code>session_crons</code>.{" "}
          <code>background_tasks</code> بيعرض أوامر الـ bash والـ subagents اللي لسه
          شغّالين في الخلفية وقت ما الدور انتهى؛ و<code>session_crons</code> بيعرض
          المهام المجدولة المرتبطة بالجلسة. hook completion-gate ممكن يستخدمهم عشان يخلّي
          Claude يكمّل لحد ما كل حاجة فعلًا تخلص:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename="hooks/completion-gate.py"
          lang="python"
          code={`import json, sys

data = json.load(sys.stdin)

pending_bg   = [t for t in data.get("background_tasks", [])
                if t.get("status") in ("running", "starting")]
pending_cron = data.get("session_crons", [])

if pending_bg or pending_cron:
    print(json.dumps({
        "decision": "block",
        "reason": (
            f"{len(pending_bg)} مهمة خلفية و"
            f"{len(pending_cron)} مهمة مجدولة لا تزال نشطة"
        )
    }))
    sys.exit(0)`}
        />
      </Reveal>

      {/* ── عرض ثانٍ: المنع والتنسيق ── */}
      <Reveal delay={140}>
        <Terminal
          script={[
            { t: "print", text: "# مثال على منع PreToolUse", tone: "muted" },
            { t: "wait", ms: 300 },
            { t: "type", text: "# Claude يحاول تشغيل rm -rf /tmp/deploy", prompt: "$" },
            { t: "out", lines: [
              { text: "[PreToolUse] Bash — تشغيل block-dangerous.py …", tone: "amber" },
              { text: "خطر: منع rm -rf /", tone: "error" },
              { text: "Hook خرج بكود 2 — تم منع الأداة.", tone: "error" },
              { text: "Claude: لا أستطيع تشغيل هذا الأمر. سأعيد النظر.", tone: "system" },
            ], gap: 90 },
            { t: "wait", ms: 700 },
            { t: "clear" },
            { t: "print", text: "# مثال على التنسيق التلقائي PostToolUse", tone: "muted" },
            { t: "wait", ms: 300 },
            { t: "type", text: "# Claude يكتب src/utils.ts", prompt: "$" },
            { t: "out", lines: [
              { text: "[PostToolUse] Write — تشغيل format-on-write.sh …", tone: "amber" },
              { text: "src/utils.ts 2.1kB نُسّقت بـ Prettier ✓", tone: "green" },
              { text: "Exit 0 — الـ hook نجح.", tone: "muted" },
            ], gap: 90 },
            { t: "wait", ms: 800 },
            { t: "clear" },
          ]}
          title="تنفيذ الـ hook"
          loop
          showStatus
          className="my-8"
        />
      </Reveal>

      {/* ══════════════════════════════════════════════
          القسم 3 — أنماط شائعة للـ Hooks
      ══════════════════════════════════════════════ */}
      <Reveal delay={0}>
        <h2>أنماط شائعة للـ Hooks</h2>

        <h3>تنسيق الملفات تلقائيًا بعد الحفظ</h3>
        <p>
          تنسيق الملفات تلقائيًا بعد الحفظ من أكتر الـ hooks فائدة. hook من نوع{" "}
          <code>PostToolUse</code> على <code>Write|Edit</code> بيشغّل الـ formatter
          بتاعك تلقائيًا، عشان output بتاع Claude يبقى دايمًا نظيف:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename=".claude/hooks/format-on-write.sh"
          lang="bash"
          code={`#!/bin/bash
INPUT=$(cat)
FILE=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))")

case "$FILE" in
  *.ts|*.tsx|*.js) prettier --write "$FILE" 2>/dev/null ;;
  *.py)            black "$FILE" 2>/dev/null ;;
  *.go)            gofmt -w "$FILE" 2>/dev/null ;;
esac

exit 0`}
        />
      </Reveal>

      {/* ── فحص الأمان ── */}
      <Reveal delay={140}>
        <h3>فحص الأمان عند الكتابة</h3>
        <p>
          فحص الأمان على الكتابة بيستخدم <code>PostToolUse</code> مع{" "}
          <code>additionalContext</code> output عشان ينبّه Claude لو كتب secrets محتملة:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".claude/hooks/security-scan.py"
          lang="python"
          code={`import json, re, sys

SECRET_PATTERNS = [
    (r"api[_-]?key\s*=\s*['\"][^'\"]+['\"]", "مفتاح API مُضمَّن محتمل"),
    (r"password\s*=\s*['\"][^'\"]+['\"]",     "كلمة مرور مُضمَّنة محتملة"),
]

data    = json.load(sys.stdin)
content = data.get("tool_result", "")
warnings = []

for pattern, message in SECRET_PATTERNS:
    if re.search(pattern, content, re.IGNORECASE):
        warnings.append(message)

if warnings:
    output = {
        "hookSpecificOutput": {
            "hookEventName": "PostToolUse",
            "additionalContext": f"تحذيرات أمان: {'; '.join(warnings)}"
        }
    }
    print(json.dumps(output))

sys.exit(0)`}
        />
      </Reveal>

      {/* ── استبدال ناتج الأداة ── */}
      <Reveal delay={280}>
        <h3>استبدال ناتج الأداة بـ updatedToolOutput</h3>
        <p>
          hooks الـ <code>PostToolUse</code> كمان ممكن تستبدل ناتج الأداة بالكامل عن
          طريق <code>updatedToolOutput</code>. Claude بيشوف المحتوى المستبدل بدل الأصلي.
          ده بيشتغل لكل الأدوات (مش بس MCP) من v2.1.121:
        </p>
      </Reveal>

      <Reveal delay={350}>
        <CodeBlock
          filename=".claude/hooks/sanitize-output.py"
          lang="python"
          code={`import json, sys

data      = json.load(sys.stdin)
original  = data.get("tool_result", "")
sanitized = original.replace("/home/user", "~")

output = {
    "hookSpecificOutput": {
        "updatedToolOutput": sanitized
    }
}
print(json.dumps(output))`}
        />
      </Reveal>

      {/* ── منع الأوامر الخطيرة ── */}
      <Reveal delay={0}>
        <h3>منع الأوامر الخطيرة</h3>
        <p>
          منع الأوامر الخطيرة بيستخدم <code>PreToolUse</code> مع regex check وexit code 2:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename=".claude/hooks/block-dangerous.py"
          lang="python"
          code={`import json, re, sys

data    = json.load(sys.stdin)
command = data.get("tool_input", {}).get("command", "")

BLOCKED = [
    (r"\brm\s+-rf\s+/",   "منع الأمر الخطير rm -rf /"),
    (r"\bdrop\s+table\b", "منع جملة DROP TABLE"),
]

for pattern, message in BLOCKED:
    if re.search(pattern, command, re.IGNORECASE):
        print(message, file=sys.stderr)
        sys.exit(2)  # exit 2 = خطأ مانع

sys.exit(0)`}
        />
      </Reveal>

      {/* ══════════════════════════════════════════════
          القسم 4 — الـ Prompt Hooks ونطاق المكونات
      ══════════════════════════════════════════════ */}
      <Reveal delay={0}>
        <h2>متقدم: الـ Prompt Hooks ونطاق المكونات</h2>

        <h3>الـ Prompt Hooks</h3>
        <p>
          لأحداث <code>Stop</code> و<code>SubagentStop</code>، نوع الـ hook{" "}
          <code>&quot;prompt&quot;</code> بيستخدم LLM عشان يقيّم اكتمال المهمة. الـ LLM
          بيقرأ المحادثة ويرجّع قرار منظم على ما إذا كان يسمح لـ Claude بالوقوف أو يكمّل
          شغل. ده قوي جدًا للمهام اللي عندها معايير اكتمال واضحة:
        </p>
      </Reveal>

      <Reveal delay={70}>
        <CodeBlock
          filename=".claude/settings.json"
          lang="json"
          code={`{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "تحقق: 1) هل تم تعديل كل الملفات؟ 2) هل الاختبارات ناجحة؟ 3) هل تم تحديث وصف الـ PR؟ إذا كان هناك شيء ناقص، اشرح ما هو.",
            "timeout": 30
          }
        ]
      }
    ]
  }
}`}
        />
      </Reveal>

      {/* ── Agent hooks ── */}
      <Reveal delay={140}>
        <h3>الـ Agent Hooks</h3>
        <p>
          نوع الـ hook <code>&quot;agent&quot;</code> بيشغّل subagent يعمل التقييم — على
          عكس الـ prompt hooks (دور واحد فقط)، الـ agent hooks ممكن تستخدم أدوات وتعمل
          تحليل متعدد الخطوات. استعمل ده لما الفحص محتاج قراءة ملفات أو تشغيل أوامر.
        </p>
      </Reveal>

      {/* ── hooks محدودة النطاق للـ Skills ── */}
      <Reveal delay={210}>
        <h3>الـ Hooks المحدودة بالـ Skills والـ Agents</h3>
        <p>
          الـ hooks كمان ممكن تتحدد لـ skills وagents معينة باستخدام الـ{" "}
          <code>hooks</code> frontmatter field. hook من نوع <code>PreToolUse</code> في
          frontmatter الـ skill مبيشتغلش غير وقت تنفيذ الـ skill دي:
        </p>
      </Reveal>

      <Reveal delay={280}>
        <CodeBlock
          filename=".claude/skills/production-deploy.md"
          lang="yaml"
          code={`---
name: production-deploy
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/production-safety-check.sh"
          once: true
---`}
        />
      </Reveal>

      <Reveal delay={350}>
        <Callout tone="tip" title="once: true">
          الـ flag <code>once: true</code> بيشغّل الـ hook مرة واحدة بس في كل session
          بدل ما يشتغل كل مرة الأداة تتطابق. مفيد لفحوصات الإعداد اللي محتاجة تحصل مرة
          واحدة بس — كفحص بيانات اعتماد الإنتاج في بداية skill النشر.
        </Callout>
      </Reveal>

      {/* ── continueOnBlock ── */}
      <Reveal delay={0}>
        <h3>continueOnBlock للـ PostToolUse</h3>
        <p>
          للـ hooks من نوع <code>PostToolUse</code>، خيار <code>continueOnBlock</code>{" "}
          بيرجّع سبب الرفض لـ Claude كـ context وبيكمّل الدور بدل ما ينهيه. من غير{" "}
          <code>continueOnBlock</code>، hook الـ <code>PostToolUse</code> اللي بيمنع
          بينهي الدور فورًا. معاه، Claude بيشوف السبب ويقدر يعدّل طريقته — مفيد لفحوصات
          الـ lint أو تطبيق الأنماط لما تعايز Claude يصلّح نفسه بدل ما يوقف.
        </p>
      </Reveal>

      <Reveal delay={70}>
        <h3>Terminal Sequences والإشعارات بدون Terminal</h3>
        <p>
          الـ hooks كمان بتدعم field اسمه <code>terminalSequence</code> في الـ JSON output
          بتاعها، اللي بيخلّي الـ hooks تطلع desktop notifications وعناوين النوافذ
          وأصوات تنبيه من غير ما تحتاج terminal متحكّم — مفيد للجلسات headless أو remote.
        </p>
      </Reveal>

      {/* ══════════════════════════════════════════════
          الاختبار
      ══════════════════════════════════════════════ */}
      <Reveal delay={0}>
        <Quiz questions={questions} title="الـ Hooks — اختبر نفسك" />
      </Reveal>
    </Prose>
  );
}
