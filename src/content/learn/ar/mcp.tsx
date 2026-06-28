import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Quiz, Prose, type QuizQuestion } from "@/components/content";

/* --------------------------------------------------------------------------
   خوادم MCP — محتوى الوحدة بالعربية
   ترجمة أمينة لـ claude.hjahouse.me/ar/learn/mcp
-------------------------------------------------------------------------- */

const addServerScript: Step[] = [
  { t: "print", text: "# إضافة خادم HTTP بعيد", tone: "muted" },
  {
    t: "type",
    text: "claude mcp add --transport http notion https://mcp.notion.com/mcp",
    tone: "user",
    prompt: "$",
  },
  {
    t: "out",
    lines: [
      { text: "✓ تمت إضافة خادم MCP: notion", tone: "green" },
      { text: "  النقل: http", tone: "muted" },
      { text: "  الرابط: https://mcp.notion.com/mcp", tone: "muted" },
    ],
    gap: 60,
  },
  { t: "wait", ms: 800 },
  { t: "print", text: "# إضافة خادم Node.js محلي عبر stdio", tone: "muted" },
  {
    t: "type",
    text: "claude mcp add --transport stdio github -- npx @modelcontextprotocol/server-github",
    tone: "user",
    prompt: "$",
  },
  {
    t: "out",
    lines: [
      { text: "✓ تمت إضافة خادم MCP: github", tone: "green" },
      { text: "  النقل: stdio", tone: "muted" },
      { text: "  الأمر: npx @modelcontextprotocol/server-github", tone: "muted" },
    ],
    gap: 60,
  },
  { t: "wait", ms: 800 },
  {
    t: "type",
    text: "claude mcp list",
    tone: "user",
    prompt: "$",
  },
  {
    t: "out",
    lines: [
      { text: "خوادم MCP النشطة:", tone: "system" },
      { text: "  notion     http  https://mcp.notion.com/mcp", tone: "green" },
      { text: "  github     stdio npx @modelcontextprotocol/server-github", tone: "green" },
    ],
    gap: 70,
  },
];

const toolSearchScript: Step[] = [
  {
    t: "print",
    text: "# البحث عن الأدوات يؤجّل تعريفات MCP حتى الحاجة",
    tone: "muted",
  },
  {
    t: "type",
    text: "اعرض كل الـ PRs المفتوحة اللي مالقتش مراجعة من أكتر من 3 أيام.",
    tone: "user",
    prompt: ">",
  },
  {
    t: "out",
    lines: [
      { text: "⟳ البحث عن أدوات: github pull requests…", tone: "amber" },
      { text: "✓ وُجدت: github__list_pull_requests", tone: "green" },
      { text: "⟳ جارٍ استدعاء github__list_pull_requests…", tone: "amber" },
    ],
    gap: 80,
  },
  {
    t: "out",
    lines: [
      { text: "PRs مفتوحة بدون مراجعة (>3 أيام):", tone: "blue" },
      { text: "  #142  إصلاح تجديد رمز المصادقة     4 أيام  @alice", tone: "default" },
      { text: "  #137  إضافة الوضع الداكن           6 أيام  @bob", tone: "default" },
      { text: "  #129  الترقية إلى Node 22           9 أيام  @carol", tone: "default" },
    ],
    gap: 65,
  },
];

const channelScript: Step[] = [
  {
    t: "print",
    text: "# تثبيت إضافة قناة Telegram",
    tone: "muted",
  },
  {
    t: "type",
    text: "/plugin install telegram@claude-plugins-official",
    tone: "user",
    prompt: ">",
  },
  {
    t: "out",
    lines: [
      { text: "✓ تمت تثبيت الإضافة: telegram@claude-plugins-official", tone: "green" },
      { text: "  اضبطها بـ: /telegram:configure <token>", tone: "muted" },
    ],
    gap: 70,
  },
  { t: "wait", ms: 700 },
  {
    t: "type",
    text: "claude --channels plugin:telegram@claude-plugins-official",
    tone: "user",
    prompt: "$",
  },
  {
    t: "out",
    lines: [
      { text: "⟳ جارٍ الاتصال بالقناة: telegram…", tone: "amber" },
      { text: "✓ القناة نشطة — ستصل الأحداث في هذه الجلسة", tone: "green" },
      { text: "  في انتظار الرسائل…", tone: "muted" },
    ],
    gap: 75,
  },
  { t: "wait", ms: 900 },
  {
    t: "out",
    lines: [
      { text: "[Telegram] @alice: ما حالة النشر؟", tone: "purple" },
      { text: "⟳ جارٍ المعالجة…", tone: "amber" },
      { text: "[Telegram → @alice] اجتاز البناء ✓ — نُشر على production منذ 4 دقائق.", tone: "green" },
    ],
    gap: 80,
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    q: "ما الأمر الصحيح لإضافة خادم MCP بعيد عبر HTTP باسم 'notion'؟",
    options: [
      "claude mcp add notion --url https://mcp.notion.com/mcp",
      "claude mcp add --transport http notion https://mcp.notion.com/mcp",
      "claude mcp connect http notion https://mcp.notion.com/mcp",
      "claude mcp add --type remote notion https://mcp.notion.com/mcp",
    ],
    answer: 1,
    explanation:
      "الصيغة الصحيحة هي `claude mcp add --transport http <الاسم> <الرابط>`. الـ flag الخاص بـ --transport يحدد نوع الاتصال (http أو stdio أو sse)، يليه اسم الخادم ثم الرابط.",
  },
  {
    q: "أين توضع إعدادات MCP المشتركة مع الفريق عبر git؟",
    options: [
      "~/.claude.json على مستوى المستخدم العام",
      ".mcp.json في جذر المشروع",
      "claude.settings.json بجانب package.json",
      "CLAUDE.md تحت عنوان [mcp]",
    ],
    answer: 1,
    explanation:
      "ملف .mcp.json يعيش في جذر المشروع، يُضاف إلى git، ويطلب موافقة الزملاء عند الاستخدام لأول مرة. أما ~/.claude.json فيخزّن الإعدادات المحلية أو الخاصة بالمستخدم التي لا تُشارك.",
  },
  {
    q: "ماذا تفعل `alwaysLoad: true` في إعدادات خادم MCP؟",
    options: [
      "تجبر الخادم على إعادة الاتصال عند كل بدء تشغيل",
      "ترفع الحد الأقصى لرموز الإخراج لهذا الخادم",
      "تتخطى تأجيل البحث عن الأدوات فتجعلها متاحة دائمًا في السياق",
      "تحمّل الخادم قبل غيره من الخوادم عند بدء التشغيل",
    ],
    answer: 2,
    explanation:
      "افتراضيًا، البحث عن الأدوات يؤجّل تعريفات الأدوات ويكتشفها عند الطلب. إضافة alwaysLoad: true تلغي هذا السلوك فتصبح كل أدوات الخادم متاحة فورًا دون المرور بخطوة الاكتشاف.",
  },
  {
    q: "أي flag يجعل Claude Code يستخدم فقط الخوادم الواردة في ملف JSON محدد متجاهلًا كل إعدادات MCP الأخرى؟",
    options: [
      "--mcp-config ./file.json",
      "--strict-mcp-config --mcp-config ./file.json",
      "--mcp-only ./file.json",
      "--no-mcp --mcp-config ./file.json",
    ],
    answer: 1,
    explanation:
      "--strict-mcp-config يأمر Claude Code بتجاهل كل مصادر MCP الأخرى (إعدادات المستخدم، إعدادات المشروع) للجلسة الحالية، ويحمّل فقط ما هو موجود في الملف الممرر لـ --mcp-config. مثالي لإعادة إنتاج الأخطاء بمجموعة خوادم محددة.",
  },
];

export default function Content() {
  return (
    <Prose>
      {/* ── مقدمة ─────────────────────────────────────────────────────── */}
      <Reveal delay={0}>
        <p>
          الـ MCP (Model Context Protocol) بيدي Claude وصول مباشر لخدمات خارجية في
          الوقت الفعلي. على عكس ملفات الذاكرة اللي بتخزّن context ثابت، اتصالات
          الـ MCP بتخلّي Claude يجيب{" "}
          <em>بيانات حيّة</em> — الـ GitHub issues بتاعتك، قاعدة بيانات الـ
          production، قنوات Slack، أو أي خدمة عندها MCP server. في الموديول ده،
          هنغطي إزاي تضيف servers، وتفهم الـ scopes، وتستخدم أدوات الـ MCP بفعالية.
        </p>
      </Reveal>

      {/* ── القسم 1: إضافة MCP Servers ────────────────────────────────── */}
      <Reveal delay={70}>
        <h2>إضافة MCP Servers</h2>
      </Reveal>

      <Reveal delay={140}>
        <p>
          أسرع طريقة لإضافة server هي أمر{" "}
          <code>claude mcp add</code>. اختار الـ transport المناسب لنوع الـ server:{" "}
          <code>http</code> للـ servers البعيدة،{" "}
          <code>stdio</code> للـ processes اللي بتشتغل محليًا، و<code>sse</code>{" "}
          للـ servers البعيدة القديمة اللي لسه ما اتنقلتش لـ HTTP.
        </p>
      </Reveal>

      <Reveal delay={210}>
        <Callout tone="warn" title="الـ SSE متوقف">
          الـ SSE transport متوقف — استخدم HTTP servers بدله حيثما كان متاحًا.
          على Windows الأصلي، غالبًا هتحتاج{" "}
          <code>cmd /c</code> لما تشغّل stdio servers بتستخدم <code>npx</code>.
        </Callout>
      </Reveal>

      <Reveal delay={280}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`# Add a remote HTTP server
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Add a local Node.js server via stdio
claude mcp add --transport stdio github -- npx @modelcontextprotocol/server-github

# Add with an auth header
claude mcp add --transport http my-api https://api.example.com/mcp \\
  --header "Authorization: Bearer $MY_TOKEN"`}
        />
      </Reveal>

      <Reveal delay={350}>
        <Terminal
          script={addServerScript}
          title="claude mcp add"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      <Reveal delay={420}>
        <p>
          أدر الـ servers بتاعتك بأوامر <code>claude mcp list</code> و
          <code>claude mcp get &lt;name&gt;</code> و
          <code>claude mcp remove &lt;name&gt;</code>. أمر <code>/mcp</code> جوه
          الـ session بيعرض الاتصالات النشطة وبيفعّل OAuth flows للـ servers اللي
          محتاجة authentication عبر المتصفح. من الأوامر المفيدة كمان:{" "}
          <code>claude mcp reset-project-choices</code> و
          <code>claude mcp add-from-claude-desktop</code> و
          <code>claude mcp serve</code> لما تحب Claude Code نفسه يشتغل كـ MCP server.
        </p>
      </Reveal>

      {/* ── .mcp.json ─────────────────────────────────────────────────── */}
      <Reveal delay={490}>
        <h3>إعدادات المشروع بملف .mcp.json</h3>
      </Reveal>

      <Reveal delay={560}>
        <p>
          إعدادات الـ MCP بتتخزن في <code>~/.claude.json</code> (ملف إعداداتك
          المحلي) أو <code>.mcp.json</code> في جذر المشروع (مشترك مع الفريق).
          ملف <code>.mcp.json</code> بيتعمل له commit في git وبيطلب موافقة
          زملائك أول مرة يستعملوه. توسيع الـ environment variables بيشتغل في
          كل حقول الإعدادات — استخدم <code>{"${VAR:-default}"}</code> كـ fallback:
        </p>
      </Reveal>

      <Reveal delay={630}>
        <CodeBlock
          filename=".mcp.json"
          lang="json"
          code={`{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "\${GITHUB_TOKEN}"
      }
    }
  }
}`}
        />
      </Reveal>

      {/* ── --mcp-config ──────────────────────────────────────────────── */}
      <Reveal delay={700}>
        <h3>إعدادات الجلسة الواحدة بـ --mcp-config</h3>
      </Reveal>

      <Reveal delay={770}>
        <p>
          للجلسات السريعة — تجارب مؤقتة أو CI runs أو محاولة إعادة إنتاج باق في
          بيئة معزولة — <code>--mcp-config</code> بيحمّل MCP servers من ملفات
          JSON من غير ما تلمس إعداداتك المحفوظة. الـ flag بياخد ملف واحد أو
          أكتر (مفصولين بمسافة). مع <code>--strict-mcp-config</code> بيتجاهل
          أي مصدر MCP تاني للجلسة دي — وده أنضف طريقة لإعادة إنتاج باق على
          مجموعة servers محددة:
        </p>
      </Reveal>

      <Reveal delay={840}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`# حمّل ملف إعدادات واحد للجلسة دي بس
claude --mcp-config ./ci-servers.json

# اجمع أكتر من ملف (مفصولين بمسافة)
claude --mcp-config "./shared-servers.json ./local-overrides.json"

# أعد إنتاج باق على server واحد بالظبط، متجاهلًا إعدادات user/project
claude --strict-mcp-config --mcp-config ./repro.json`}
        />
      </Reveal>

      {/* ── الاتصال المتزامن والـ Timeouts ────────────────────────────── */}
      <Reveal delay={910}>
        <h3>الاتصال المتزامن والـ timeouts</h3>
      </Reveal>

      <Reveal delay={980}>
        <p>
          الـ MCP servers دلوقتي بتتوصّل بشكل متزامن (concurrent) بشكل افتراضي.
          لما يكون عندك عدة servers متعرّفة — stdio servers محلية وremote connectors
          — بتتهيأ كلها بالتوازي عند بدء التشغيل بدل ما تشتغل واحد ورا التاني.
          ده بيقلل وقت بدء التشغيل بشكل ملحوظ للمشاريع اللي فيها تكاملات MCP كتيرة.
        </p>
        <p>
          في نوعين من الـ timeout بيتحكموا في سلوك الـ MCP. اضبط{" "}
          <strong>timeout بدء تشغيل الـ server</strong> باستخدام متغير البيئة{" "}
          <code>MCP_TIMEOUT</code> (مثلًا، <code>MCP_TIMEOUT=10000 claude</code>{" "}
          بيحط timeout بـ 10 ثواني). أما{" "}
          <strong>تنفيذ الأدوات</strong> فله حد منفصل: ضيف حقل{" "}
          <code>timeout</code> بالميلي ثانية في إعداد الـ server داخل{" "}
          <code>.mcp.json</code> — مثلًا <code>&quot;timeout&quot;: 600000</code>{" "}
          لعشر دقائق — عشان تحدد أقصى مدة لأي tool call واحد.
        </p>
      </Reveal>

      <Reveal delay={1050}>
        <Callout tone="info" title="الـ timeout على مستوى الخادم هو الأولوية">
          قيمة <code>timeout</code> في <code>.mcp.json</code> بتتجاوز متغير
          البيئة <code>MCP_TOOL_TIMEOUT</code> لهذا الـ server فقط. هي حد
          زمني صارم لا تمدّده إشعارات التقدّم، والقيم الأقل من 1000 ميلي ثانية
          بيتم تجاهلها.
        </Callout>
      </Reveal>

      {/* ── القسم 2: الـ Scopes واكتشاف الأدوات ──────────────────────── */}
      <Reveal delay={0}>
        <h2>الـ Scopes واكتشاف الأدوات</h2>
      </Reveal>

      <Reveal delay={70}>
        <p>
          إعدادات الـ MCP ليها ثلاث scopes.{" "}
          <strong>الـ Local scope</strong> (بيتخزن في <code>~/.claude.json</code>{" "}
          تحت مفتاح المشروع) خاص — أنت بس، في المشروع ده بس.{" "}
          <strong>الـ Project scope</strong> (<code>.mcp.json</code>) مشترك مع
          الفريق عبر git.{" "}
          <strong>الـ User scope</strong> (<code>~/.claude.json</code> بشكل عام)
          بيتطبق على كل مشاريعك.
        </p>
        <p>
          لما نفس الـ server يتعرّف في أكتر من scope، الـ local configuration
          بيكسب. ده بيخليك تعدّل إعدادات server مشترك مع الفريق بنسخة محلية
          للاختبار من غير ما تأثر على أي حد تاني.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <h3>الـ MCP prompts والـ resources</h3>
      </Reveal>

      <Reveal delay={210}>
        <p>
          الـ MCP prompts بتظهر كـ slash commands بالنمط{" "}
          <code>/mcp__servername__promptname</code>. الـ MCP resources ممكن
          تتعامل معاها inline بالصيغة{" "}
          <code>@server:protocol://resource/path</code>.
        </p>
      </Reveal>

      <Reveal delay={280}>
        <h3>تأجيل البحث عن الأدوات (Tool Search Deferral)</h3>
      </Reveal>

      <Reveal delay={350}>
        <p>
          الـ Tool Search مفعّل بشكل افتراضي — تعريفات أدوات MCP بتتأجّل
          وتُكتشف عند الطلب، فبس الأدوات اللي Claude يستخدمها فعلًا في المهمة
          بتدخل الـ context. مبيتقفلش افتراضيًا غير على Vertex AI ولما{" "}
          <code>ANTHROPIC_BASE_URL</code> بيشاور على proxy مش first-party.
          تقدر تتحكم فيه بمتغير البيئة <code>ENABLE_TOOL_SEARCH</code>:
        </p>
        <ul>
          <li>
            <code>true</code> — يفعّله دايمًا
          </li>
          <li>
            <code>false</code> — يحمّل كل التعريفات مقدمًا في كل turn
          </li>
          <li>
            <code>auto</code> — يفعّله بس لما التعريفات تتعدى 10% من الـ context window
          </li>
          <li>
            <code>auto:N</code> — يحدد نسبة مخصصة
          </li>
        </ul>
      </Reveal>

      <Reveal delay={420}>
        <Callout tone="tip" title="alwaysLoad: true">
          عشان تلغي الـ deferral لـ server معين، ضيف{" "}
          <code>alwaysLoad: true</code> في الـ config بتاعه — كل الأدوات من
          الـ server ده هتتخطى الـ tool-search deferral وتكون دايمًا متاحة في
          الجلسة. كل description لأداة MCP وتعليمات الـ server محدودة بـ 2KB
          عشان ما تستهلكش servers اللي بتولّد OpenAPI context زيادة.
        </Callout>
      </Reveal>

      <Reveal delay={490}>
        <CodeBlock
          filename=".mcp.json"
          lang="json"
          code={`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
      "alwaysLoad": true,
      "timeout": 30000
    }
  }
}`}
        />
      </Reveal>

      <Reveal delay={560}>
        <p>
          تحذير بيظهر لما output أداة MCP يتعدى 10,000 token. عشان تزيد الـ
          limit، اضبط متغير البيئة <code>MAX_MCP_OUTPUT_TOKENS</code>{" "}
          (الافتراضي 25,000).
        </p>
      </Reveal>

      <Reveal delay={630}>
        <Terminal
          script={toolSearchScript}
          title="البحث عن الأدوات في العمل"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      {/* ── MCP على مستوى الـ Subagent ────────────────────────────────── */}
      <Reveal delay={700}>
        <h3>MCP Servers على مستوى الـ Subagent</h3>
      </Reveal>

      <Reveal delay={770}>
        <p>
          الـ subagent-scoped MCP بيخليك تدي agents معينة وصول لـ servers لا
          يحتاجها باقي الجلسة. عرّف الـ servers مباشرة في front-matter الخاص
          بالـ agent:
        </p>
      </Reveal>

      <Reveal delay={840}>
        <CodeBlock
          filename="agents/data-analyst.md"
          lang="yaml"
          code={`---
name: data-analyst
description: Analyze production data
mcpServers:
  - database
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
---`}
        />
      </Reveal>

      {/* ── القسم 3: أنماط الاستخدام العملية ─────────────────────────── */}
      <Reveal delay={0}>
        <h2>أنماط استخدام عملية</h2>
      </Reveal>

      <Reveal delay={70}>
        <h3>GitHub MCP: الـ PRs والـ issues والـ commits</h3>
      </Reveal>

      <Reveal delay={140}>
        <p>
          لما يكون GitHub MCP متوصل، تقدر تتعامل مع الـ PRs والـ issues
          والـ commits بلغة طبيعية. Claude بيسأل الـ server، يجيب بيانات
          حيّة، ويرد:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename="claude prompt"
          lang="text"
          code={`List all open PRs that haven't been reviewed in more than 3 days.
Create an issue for the login timeout bug with medium priority.
/mcp__github__pr_review 456`}
        />
      </Reveal>

      <Reveal delay={280}>
        <h3>Database MCP: استعلامات بلغة طبيعية</h3>
      </Reveal>

      <Reveal delay={350}>
        <p>
          الـ database MCP بيخليك تعمل queries بلغة طبيعية من غير ما تكتب
          SQL بنفسك:
        </p>
      </Reveal>

      <Reveal delay={420}>
        <CodeBlock
          filename="claude prompt"
          lang="text"
          code={`Find all users who placed more than 5 orders in the last 30 days.
What's the average order value by country for Q1 2026?`}
        />
      </Reveal>

      <Reveal delay={490}>
        <h3>تركيب أكثر من server مع بعض</h3>
      </Reveal>

      <Reveal delay={560}>
        <p>
          للـ workflows المعقدة، أكتر من MCP server بيشتغلوا مع بعض بشكل
          طبيعي. workflow يومي ممكن: يجيب PR metrics من GitHub MCP، ويعمل
          query لبيانات المبيعات من database MCP، ويكتب تقرير عبر filesystem
          MCP، وينشره عبر Slack MCP — كل ده في session واحدة.
        </p>
      </Reveal>

      {/* ── MCP Elicitation ───────────────────────────────────────────── */}
      <Reveal delay={630}>
        <h3>الـ MCP Elicitation</h3>
      </Reveal>

      <Reveal delay={700}>
        <p>
          الـ MCP elicitation بتسمح لـ server يوقف الـ workflow ويطلب input
          منظم من المستخدم. لما server يحتاج معلومة مش قادر يجيبها لوحده —
          تصريح OAuth، أو تأكيد قبل عملية خطيرة، أو form بـ parameters خاصة
          بالمشروع — بيعمل dialog تفاعلي. المستخدم بيشوف حقول form أو URL
          للمتصفح، بيدي الرد، والـ server بيكمّل من حيث ما وقف. الـ hooks{" "}
          <code>Elicitation</code> و<code>ElicitationResult</code> بيخلوك
          تعترض أو تعدّل الحوارات دي برمجيًا.
        </p>
      </Reveal>

      {/* ── أفضل ممارسات الأمان ───────────────────────────────────────── */}
      <Reveal delay={770}>
        <h3>أفضل ممارسات الأمان</h3>
      </Reveal>

      <Reveal delay={840}>
        <ul>
          <li>استخدم دايمًا environment variables للـ credentials</li>
          <li>ما تعملش commit لـ tokens في git أبدًا</li>
          <li>استخدم read-only tokens لما تحتاج تقرأ بيانات بس</li>
          <li>حدد وصول الـ server للحد الأدنى المطلوب</li>
          <li>
            للمؤسسات، <code>managed-mcp.json</code> بيخلّي المسؤولين يفرضوا
            allowlist من الـ servers المسموح بيها على مستوى المنظمة
          </li>
        </ul>
      </Reveal>

      {/* ── إعادة الاتصال والتحديثات الديناميكية ─────────────────────── */}
      <Reveal delay={910}>
        <h3>إعادة الاتصال والتحديثات الديناميكية للأدوات</h3>
      </Reveal>

      <Reveal delay={980}>
        <p>
          الـ MCP servers ممكن تبعت إشعارات <code>list_changed</code> عشان
          تحدّث الأدوات والـ prompts والـ resources المتاحة ديناميكيًا من غير
          ما تحتاج تعمل reconnect. لو HTTP server أو SSE server انقطع في نص
          الجلسة، Claude Code بيعمل reconnect تلقائيًا بـ exponential backoff —
          لحد خمس محاولات، بتبدأ بتأخير ثانية وبتتضاعف كل مرة. للتوصيلات
          الأولية عند بدء التشغيل، نفس الـ backoff بيتطبّق بس لحد تلات محاولات
          في حالة أخطاء مؤقتة زي استجابة 5xx، أو رفض الاتصال، أو timeout.
        </p>
      </Reveal>

      {/* ── القسم 4: القنوات ──────────────────────────────────────────── */}
      <Reveal delay={0}>
        <h2>القنوات (Channels): بعت أحداث لجلسة شغّالة</h2>
      </Reveal>

      <Reveal delay={70}>
        <p>
          القنوات هي MCP servers بتبعت أحداث لجلستك الشغّالة عشان Claude
          يتفاعل وأنت مش قدام الـ terminal. على عكس MCP servers العادية اللي
          Claude بيسألها عند الحاجة، القناة بتوصّل رسائل بشكل استباقي — جسر
          محادثة من Telegram، أو webhook من CI، أو تنبيه مراقبة. الأحداث
          بتوصل بس والجلسة مفتوحة.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <Callout tone="warn" title="في مرحلة البحث التجريبي">
          القنوات في research preview ومحتاجة Claude Code v2.1.80 أو أحدث.
          التلات plugins دي مُضمّنة:{" "}
          <strong>Telegram</strong> و<strong>Discord</strong> و
          <strong>iMessage</strong>. القنوات محتاجة Anthropic authentication
          (claude.ai أو Console API key) و<strong>مش</strong> متاحة على
          Bedrock أو Vertex AI أو Foundry.
        </Callout>
      </Reveal>

      <Reveal delay={210}>
        <p>
          ثبّت plugin قناة بـ{" "}
          <code>/plugin install telegram@claude-plugins-official</code>، اضبطه
          بأمر <code>/telegram:configure &lt;token&gt;</code>، وبعدين أعد
          التشغيل بـ flag الـ <code>--channels</code> عشان تفعّله:
        </p>
      </Reveal>

      <Reveal delay={280}>
        <CodeBlock
          filename="terminal"
          lang="bash"
          tone="terminal"
          code={`claude --channels plugin:telegram@claude-plugins-official`}
        />
      </Reveal>

      <Reveal delay={350}>
        <p>
          كل قناة عندها allowlist للمُرسلين — بس الـ IDs اللي ضفتها تقدر
          تبعت رسائل. Telegram وDiscord بيستخدموا pairing flow: ابعت رسالة
          للبوت بتاعك، استلم كود، واقبله في Claude Code بـ{" "}
          <code>/telegram:access pair &lt;code&gt;</code> وقفّل الوصول بـ{" "}
          <code>/telegram:access policy allowlist</code>. iMessage بيتخطى
          الـ pairing لما تبعت لنفسك وبيخلّيك تضيف جهات اتصال بالـ handle.
        </p>
      </Reveal>

      <Reveal delay={420}>
        <Terminal
          script={channelScript}
          title="عرض القنوات"
          loop={false}
          showStatus={true}
        />
      </Reveal>

      <Reveal delay={490}>
        <p>
          مؤسسات Team وEnterprise لازم تفعّل القنوات عن طريق{" "}
          <code>channelsEnabled</code> في الإعدادات المُدارة — مقفولة
          افتراضيًا. مستخدمي Pro وMax يقدروا يستخدموا القنوات مباشرة
          بالاشتراك بـ <code>--channels</code> في كل جلسة. المسؤولين كمان
          يقدروا يحددوا الـ plugins المسموح بيها عبر إعداد{" "}
          <code>allowedChannelPlugins</code> المُدار.
        </p>
        <p>
          لما Claude يرد عبر قناة، الرد بيظهر على المنصة الخارجية (Telegram،
          Discord، إلخ) — الـ terminal بتاعك بيعرض الـ tool call والتأكيد
          بس مش نص الرد نفسه.
        </p>
      </Reveal>

      {/* ── اختبار سريع ───────────────────────────────────────────────── */}
      <Reveal delay={0}>
        <Quiz questions={quizQuestions} title="اختبر نفسك — خوادم MCP" />
      </Reveal>
    </Prose>
  );
}
