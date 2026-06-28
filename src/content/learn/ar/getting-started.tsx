import Reveal from "@/components/Reveal";
import Terminal, { type Step } from "@/components/Terminal";
import CodeBlock from "@/components/CodeBlock";
import { Callout, Kbd, Quiz, Prose, type QuizQuestion } from "@/components/content";

/* ── محاكاة الترمينال: أول جلسة ─────────────────────────────────────────── */
const firstSessionScript: Step[] = [
  { t: "print", text: "~ انتقل إلى مجلد المشروع", tone: "system" },
  { t: "type", text: "cd my-project", tone: "user", prompt: "$" },
  { t: "print", text: "", tone: "default" },
  { t: "type", text: "claude", tone: "user", prompt: "$" },
  { t: "wait", ms: 400 },
  { t: "out", lines: [
    { text: "╭──────────────────────────────────────────╮", tone: "muted" },
    { text: "│  مرحبًا بك في Claude Code  v1.24.12     │", tone: "green" },
    { text: "│  اكتب /help لعرض الأوامر المتاحة        │", tone: "muted" },
    { text: "╰──────────────────────────────────────────╯", tone: "muted" },
  ], gap: 55 },
  { t: "wait", ms: 300 },
  { t: "type", text: "What files are in this project and what does it do?", tone: "user", prompt: ">" },
  { t: "wait", ms: 500 },
  { t: "out", lines: [
    { text: "جاري قراءة بنية المشروع…", tone: "system" },
    { text: "", tone: "default" },
    { text: "هذا تطبيق Next.js 14 بـ TypeScript.", tone: "green" },
    { text: "الملفات الرئيسية:", tone: "green" },
    { text: "  • src/app/page.tsx — الصفحة الرئيسية", tone: "default" },
    { text: "  • src/lib/api.ts   — دوال الجلب", tone: "default" },
    { text: "  • package.json     — Node 18, React 18", tone: "default" },
  ], gap: 60 },
];

/* ── محاكاة الترمينال: أمر /help ─────────────────────────────────────────── */
const helpScript: Step[] = [
  { t: "type", text: "/help", tone: "user", prompt: ">" },
  { t: "wait", ms: 300 },
  { t: "out", lines: [
    { text: "الأوامر المتاحة:", tone: "system" },
    { text: "", tone: "default" },
    { text: "  /help            عرض رسالة المساعدة هذه", tone: "green" },
    { text: "  /config          فتح لوحة الإعدادات", tone: "green" },
    { text: "  /clear           مسح سجل المحادثة", tone: "green" },
    { text: "  /memory          عرض أو تعديل ملفات الذاكرة", tone: "green" },
    { text: "  /doctor          فحص صحة التثبيت", tone: "amber" },
    { text: "  /logout          تسجيل الخروج من Claude Code", tone: "amber" },
    { text: "  /terminal-setup  إعداد اختصارات لوحة المفاتيح", tone: "blue" },
    { text: "", tone: "default" },
    { text: "  اكتب أي طلب بلغة طبيعية للبدء.", tone: "muted" },
  ], gap: 55 },
];

/* ── أسئلة الاختبار ───────────────────────────────────────────────────────── */
const questions: QuizQuestion[] = [
  {
    q: "ما هي طريقة التثبيت الموصى بها لـ Claude Code التي توفر تحديثات تلقائية؟",
    options: [
      "npm install -g @anthropic-ai/claude-code",
      "brew install --cask claude-code",
      "المثبّت النيتيف عبر curl أو PowerShell",
      "winget install Anthropic.ClaudeCode",
    ],
    answer: 2,
    explanation:
      "المثبّت النيتيف (curl -fsSL https://claude.ai/install.sh | bash على macOS/Linux، أو ما يعادله على Windows) هو الطريقة الموصى بها لأنه يحدّث نفسه تلقائيًا في الخلفية فتحصل دائمًا على أحدث إصدار.",
  },
  {
    q: "أين يخزّن Claude Code بيانات اعتمادك على Linux وWindows؟",
    options: [
      "في macOS Keychain",
      "في ~/.claude/.credentials.json (mode 0600)",
      "في كوكي متصفح",
      "في متغير بيئة في ملف الـ shell profile",
    ],
    answer: 1,
    explanation:
      "على Linux وWindows، يخزّن Claude Code بيانات الاعتماد في ~/.claude/.credentials.json بصلاحية 0600 (قابلة للقراءة فقط بواسطة مستخدمك). على macOS يستخدم Keychain النيتيف بدلًا من ذلك.",
  },
  {
    q: "أي slash command يفحص صحة تثبيت Claude Code وخوادم MCP والإعدادات؟",
    options: ["/help", "/config", "/doctor", "/terminal-setup"],
    answer: 2,
    explanation:
      "تشغيل claude doctor (أو /doctor) يُجري فحصًا شاملًا لإعداداتك يشمل خوادم MCP والإعدادات — أكثر دقةً من مجرد تشغيل claude --version.",
  },
  {
    q: "ما هو الحد الأدنى لإصدار Node.js المطلوب لطريقة التثبيت عبر npm؟",
    options: ["Node.js 14+", "Node.js 16+", "Node.js 18+", "Node.js 20+"],
    answer: 2,
    explanation:
      "طريقة npm (npm install -g @anthropic-ai/claude-code) تتطلب Node.js 18 أو أحدث. المثبّت النيتيف يحتوي على runtime خاص به لذا ليس لديه متطلب لـ Node.js.",
  },
];

export default function Content() {
  return (
    <Prose>
      {/* ── مقدمة ──────────────────────────────────────────────────────────── */}
      <Reveal delay={0}>
        <p>
          Claude Code هو <strong>مساعد ذكاء اصطناعي للبرمجة</strong> يشتغل في{" "}
          <strong>الترمينال</strong> بتاعك — النافذة النصية اللي المطورين بيكتبوا فيها
          الأوامر. بدل ما تدوس على أزرار في تطبيق، بتكتب اللي عايزه بكلام عادي، وClaude
          بيقرأ الكود بتاعك، بيقترح إصلاحات، بيكتب features جديدة، بيشغّل tests، وحتى
          بيدير الملفات — كل ده عن طريق فهم مشروعك مباشرة على جهازك.
        </p>
      </Reveal>

      {/* ── إيه هو Claude Code ───────────────────────────────────────────────── */}
      <Reveal delay={70}>
        <h2>إيه هو Claude Code؟</h2>
        <p>
          قبل ما تقدر تستخدم أي slash command أو تبني workflow، لازم Claude Code يكون
          شغّال على جهازك. الموديول ده هياخدك خطوة بخطوة في التثبيت، المصادقة، اختيار
          الترمينال والـ IDE المناسب، وتشغيل أول جلسة ليك.
        </p>
      </Reveal>

      {/* ── شرح المصطلحات ─────────────────────────────────────────────────────── */}
      <Reveal delay={140}>
        <Callout tone="info" title="أول مرة تستخدم الترمينال؟ — شرح المصطلحات الأساسية">
          <ul className="mt-1 space-y-1.5">
            <li>
              <strong>الترمينال</strong> (Terminal، أو الكونسول أو سطر الأوامر): نافذة
              نصية بتكتب فيها أوامر بدل ما تدوس على أيقونات. على macOS اسمه Terminal.app،
              وعلى Windows اسمه Windows Terminal أو PowerShell.
            </li>
            <li>
              <strong>CLI</strong> (واجهة سطر الأوامر): برنامج بتتحكم فيه عن طريق كتابة
              أوامر بدل واجهة رسومية. Claude Code هو أداة CLI.
            </li>
            <li>
              <strong>Slash command</strong>: اختصار بيبدأ بعلامة{" "}
              <Kbd>/</Kbd> (زي <Kbd>/help</Kbd> أو <Kbd>/config</Kbd>) بيشغّل إجراء معين
              جوه Claude Code.
            </li>
            <li>
              <strong>OAuth</strong>: طريقة تسجيل دخول آمنة بتفتح المتصفح عشان تسجّل
              دخولك من غير ما تلصق باسوردات في الترمينال.
            </li>
            <li>
              <strong>API key</strong> (مفتاح الـ API): كود سري بيخلّي البرنامج يتحقق من
              هويته مع الخدمة. بيُستخدم كبديل للـ OAuth لما بتوصّل Claude Code.
            </li>
            <li>
              <strong>IDE</strong> (بيئة التطوير المتكاملة): محرر كود فيه أدوات مدمجة —
              زي VS Code وIntelliJ IDEA وPyCharm.
            </li>
          </ul>
        </Callout>
      </Reveal>

      {/* ── المتطلبات الأساسية ─────────────────────────────────────────────────── */}
      <Reveal delay={210}>
        <h2>المتطلبات الأساسية</h2>
        <p>
          Claude Code بيشتغل على <strong>macOS 13+</strong>،{" "}
          <strong>Ubuntu 20.04+</strong> (وتوزيعات Linux الحديثة التانية)،
          و<strong>Windows 10 1809+</strong> (نيتيف أو WSL). محتاج على الأقل 4 جيجا
          رام — 8 جيجا أفضل عشان تشتغل براحة. لازم يكون عندك اتصال إنترنت نشط طول الوقت.
        </p>
        <p>
          كمان محتاج حساب Anthropic مؤهَّل — حساب Pro أو Max أو Team أو Enterprise أو
          Console. الخطة المجانية في Claude.ai <em>مش</em> بتتضمن Claude Code. بدلًا من
          كده، تقدر تستخدم API key من Anthropic Console أو تتصل عبر Amazon Bedrock أو
          Google Vertex AI أو Microsoft Foundry.
        </p>
      </Reveal>

      <Reveal delay={280}>
        <Callout tone="note">
          لما Git for Windows يتثبّت، Claude Code بيستخدم Git Bash لأداة Bash. الـ
          PowerShell tool بيتطرح بشكل تدريجي — حط{" "}
          <code>CLAUDE_CODE_USE_POWERSHELL_TOOL=1</code> عشان تفعّله أو{" "}
          <code>0</code> عشان توقفه.
        </Callout>
      </Reveal>

      {/* ── تثبيت الـ CLI ────────────────────────────────────────────────────── */}
      <Reveal delay={350}>
        <h2>تثبيت الـ CLI</h2>
        <p>
          الطريقة الموصى بيها لتثبيت Claude Code هي الـ{" "}
          <strong>native installer</strong>. بيعمل تحديث تلقائي في الخلفية فدايمًا
          عندك آخر إصدار.
        </p>
      </Reveal>

      <Reveal delay={420}>
        <h3>على macOS أو Linux (بما فيهم WSL)</h3>
        <CodeBlock
          lang="bash"
          filename="Terminal"
          code={`curl -fsSL https://claude.ai/install.sh | bash`}
        />
      </Reveal>

      <Reveal delay={490}>
        <h3>على Windows عن طريق PowerShell</h3>
        <CodeBlock
          lang="powershell"
          filename="PowerShell"
          code={`irm https://claude.ai/install.ps1 | iex`}
        />
      </Reveal>

      <Reveal delay={560}>
        <h3>على Windows عن طريق CMD</h3>
        <CodeBlock
          lang="cmd"
          filename="Command Prompt"
          code={`curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd`}
        />
      </Reveal>

      <Reveal delay={630}>
        <h3>طرق تثبيت بديلة</h3>
        <p>
          هذه الطرق البديلة تحتاج تحديث يدوي:
        </p>
        <CodeBlock
          lang="bash"
          filename="طرق بديلة"
          code={`# Homebrew (قناة stable)
brew install --cask claude-code

# Homebrew (أحدث إصدار)
brew install --cask claude-code@latest

# WinGet (Windows)
winget install Anthropic.ClaudeCode

# npm (يحتاج Node.js 18+)
npm install -g @anthropic-ai/claude-code

# مديري الحزم على Linux
sudo apt install claude-code        # Debian/Ubuntu
sudo dnf install claude-code        # Fedora/RHEL
apk add claude-code                 # Alpine`}
        />
      </Reveal>

      <Reveal delay={700}>
        <h3>التحقق من التثبيت</h3>
        <p>بعد التثبيت، اتأكد إنه اشتغل:</p>
        <CodeBlock
          lang="bash"
          filename="Terminal"
          code={`claude --version`}
        />
        <p>
          لفحص أعمق للتثبيت والإعدادات، شغّل <code>claude doctor</code> — بيتحقق من
          الـ setup والـ MCP servers والإعدادات. تقدر كمان تتحكم في قناة التحديثات عن
          طريق <Kbd>/config</Kbd> — اختار بين <code>latest</code> (أحدث المزايا)
          و<code>stable</code> (إصدارات مُختبرة، متأخرة حوالي أسبوع).
        </p>
      </Reveal>

      {/* ── المصادقة ────────────────────────────────────────────────────────── */}
      <Reveal delay={770}>
        <h2>المصادقة</h2>
        <p>
          لما بتشغّل <code>claude</code> لأول مرة، بيفتح المتصفح تلقائيًا للـ OAuth
          authentication. سجّل دخولك بحساب Anthropic بتاعك وخلاص كده.
        </p>
        <p>لو بتستخدم API key بدلًا من كده، عيّن الـ environment variable قبل ما تشغّل:</p>
        <CodeBlock
          lang="bash"
          filename="Terminal"
          code={`export ANTHROPIC_API_KEY=sk-ant-...
claude`}
        />
      </Reveal>

      <Reveal delay={840}>
        <h3>إعدادات الشركات وCloud Providers</h3>
        <p>استخدم الـ environment variables المناسبة لكل cloud provider:</p>
        <CodeBlock
          lang="bash"
          filename="Terminal"
          code={`# Amazon Bedrock
CLAUDE_CODE_USE_BEDROCK=1

# Google Vertex AI
CLAUDE_CODE_USE_VERTEX=1

# Microsoft Foundry
CLAUDE_CODE_USE_FOUNDRY=1`}
        />
      </Reveal>

      <Reveal delay={910}>
        <p>
          بيانات اعتمادك بتتخزن بشكل آمن — في <strong>macOS Keychain</strong> على Mac،
          أو في <code>~/.claude/.credentials.json</code> (mode 0600) على Linux وWindows.
        </p>
        <p>
          عشان تبدّل حسابات أو تعيد المصادقة في أي وقت، استخدم{" "}
          <Kbd>/logout</Kbd>. كمان تقدر تشغّل المصادقة صراحة بـ{" "}
          <code>claude auth login</code> — بيفتح المتصفح لـ OAuth، أو لو المتصفح ما
          فتحش بيطبعلك لينك تلصقه في أي متصفح. خيارات إضافية:
        </p>
        <ul>
          <li>
            <code>claude auth login --email</code> — لملء الإيميل مسبقًا
          </li>
          <li>
            <code>claude auth login --sso</code> — للمؤسسات اللي عندها SSO
          </li>
          <li>
            <code>claude auth login --console</code> — للمصادقة بـ API key عبر Anthropic Console
          </li>
        </ul>
      </Reveal>

      {/* ── الترمينال الموصى بيه ──────────────────────────────────────────────── */}
      <Reveal delay={980}>
        <h2>الترمينال بتاعك: Warp موصى بيه</h2>
        <p>
          Claude Code بيشتغل في أي ترمينال — Terminal.app، iTerm2، Windows Terminal،
          Alacritty، Kitty، Ghostty، وغيرهم. بس لأفضل تجربة، بننصح بـ{" "}
          <strong>Warp</strong>.
        </p>
        <p>
          Warp عنده plugin رسمي لـ Claude Code بيوفّر إشعارات نيتيف لسطح المكتب لما
          Claude يخلّص مهمة، يحتاج input منك، أو يطلب صلاحيات. ده مفيد جدًا للعمليات
          الطويلة لما بتنقل لنافذة تانية.
        </p>
        <p>عشان تثبّت الـ Warp plugin، شغّل الأوامر دي جوه Claude Code بعد التثبيت:</p>
        <CodeBlock
          lang="bash"
          filename="Claude Code prompt"
          code={`/plugin marketplace add warpdotdev/claude-code-warp
/plugin install warp@claude-code-warp`}
        />
      </Reveal>

      <Reveal delay={1050}>
        <Callout tone="tip">
          بشكل افتراضي، Claude Code بيبعت إشعارات نيتيف بس في Ghostty وKitty وiTerm2.
          في أي ترمينال تاني، اضبط <code>preferredNotifChannel</code> على{" "}
          <code>&quot;terminal_bell&quot;</code> عشان يرنّ جرس الترمينال بدلًا منها، أو
          اعمل Notification hook لصوت مخصص.
          <br />
          <br />
          بشكل افتراضي، Claude Code بيستخدم الـ alternate screen بتاع الترمينال لتجربة
          عرض ملء الشاشة. اضبط{" "}
          <code>CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1</code> قبل ما تشغّل لو بتفضّل الـ
          scrollback الطبيعي (مفيد لقارئات الشاشة أو terminal multiplexers).
        </Callout>
      </Reveal>

      {/* ── إضافات الـ IDE ────────────────────────────────────────────────────── */}
      <Reveal delay={1120}>
        <h2>إضافات الـ IDE</h2>
        <p>
          Claude Code بدأ كأداة CLI، بس دلوقتي عنده إضافات رسمية للمحررات الرئيسية.
          تقدر تستخدم الاتنين — الـ CLI للشغل الثقيل في الترمينال والإضافة للراحة جوه
          المحرر.
        </p>
      </Reveal>

      <Reveal delay={1190}>
        <h3>VS Code</h3>
        <p>
          الإضافة الأنضج والأكثر اكتمالًا. ثبّتها من VS Code Marketplace أو شغّل:
        </p>
        <CodeBlock
          lang="bash"
          filename="Terminal"
          code={`code --install-extension Anthropic.claude-code`}
        />
        <p>
          بتوفّر واجهة رسومية نيتيف، مراجعة diff بصرية، مراجع للملفات، تاريخ
          المحادثات، والقدرة على تشغيل محادثات متعددة في tabs.
        </p>
      </Reveal>

      <Reveal delay={1260}>
        <h3>JetBrains</h3>
        <p>
          عنده plugin رسمي في مرحلة beta، متاح في JetBrains Marketplace لـ IntelliJ
          IDEA وWebStorm وPyCharm وباقي IDEs بتاعة JetBrains. بينسّق الـ CLI مع diff
          viewer بتاع الـ IDE لتجربة سلسة.
        </p>
      </Reveal>

      <Reveal delay={1330}>
        <Callout tone="info" title="أبعد من إضافات الـ IDE">
          فيه كمان <strong>Desktop App</strong> لـ macOS وWindows (مش متاح على Linux —
          استخدم الـ CLI بدلًا منه) بيوفّر diffs بصرية، معاينة حية للتطبيق، وagents
          مستقلة في الخلفية — من غير ترمينال. وكمان{" "}
          <strong>Claude Code على الويب</strong> (claude.ai/code) هو research preview
          بيشتغل على cloud VMs، فتقدر تشتغل من أي متصفح من غير أي إعداد محلي.
        </Callout>
      </Reveal>

      {/* ── أول جلسة ─────────────────────────────────────────────────────────── */}
      <Reveal delay={1400}>
        <h2>أول جلسة ليك</h2>
        <p>
          روح لأي مجلد مشروع وشغّل Claude Code:
        </p>
        <CodeBlock
          lang="bash"
          filename="Terminal"
          code={`cd my-project
claude`}
        />
        <p>
          هتشوف رسالة ترحيب وprompt. اكتب اللي عايزه Claude يعمله بكلام عادي. كمان
          تقدر تلصق صور بـ <Kbd>Ctrl</Kbd>+<Kbd>V</Kbd> — بيظهر تلميح &quot;Pasting…&quot;
          في الفوتر وهو بيقرأ الصورة من الـ clipboard:
        </p>
        <CodeBlock
          lang="text"
          filename="أول طلب ليك"
          code={`What files are in this project and what does it do?`}
        />
        <p>
          Claude هيقرأ ملفاتك، يحلل البنية، ويديك ملخص. من هنا، تقدر تطلب منه يعمل
          تغييرات، يصلّح bugs، يشغّل tests، أو يشرح كود. لما Claude يحتاج يعمل إجراءات
          زي تعديل ملفات أو تشغيل أوامر، هيطلب إذنك الأول.
        </p>
      </Reveal>

      {/* ── محاكاة أول جلسة ──────────────────────────────────────────────────── */}
      <Reveal delay={1470}>
        <Terminal
          script={firstSessionScript}
          title="أول جلسة مع Claude Code"
          loop={true}
          showStatus={true}
          className="my-6"
        />
      </Reveal>

      {/* ── عرض /help ─────────────────────────────────────────────────────────── */}
      <Reveal delay={1540}>
        <h2>طلب المساعدة: ‎/help</h2>
        <p>
          بمجرد ما تكون داخل جلسة Claude Code، اكتب <Kbd>/help</Kbd> في أي وقت عشان
          تشوف كل slash commands المتاحة. ده أسرع طريقة تكتشف بيها إمكانيات Claude Code
          من غير ما تخرج من الترمينال.
        </p>
        <Terminal
          script={helpScript}
          title="Claude Code — /help"
          loop={false}
          showStatus={true}
          className="my-6"
        />
      </Reveal>

      <Reveal delay={1610}>
        <Callout tone="tip" title="شغّل /doctor أول حاجة">
          بعد أول تسجيل دخول ناجح، شغّل <Kbd>/doctor</Kbd> (أو{" "}
          <code>claude doctor</code>) عشان تتحقق من الـ setup الكامل: المصادقة، إصدار
          Node، اتصالات خوادم MCP، والإعدادات. ده أسرع طريقة تكتشف أي مشاكل في
          الإعدادات قبل ما تبدأ الشغل.
        </Callout>
      </Reveal>

      {/* ── اختبار سريع ───────────────────────────────────────────────────────── */}
      <Reveal delay={1680}>
        <Quiz questions={questions} title="اختبار سريع — البداية" />
      </Reveal>
    </Prose>
  );
}
