import { Prose, Callout, Quiz, type QuizQuestion } from "@/components/content";
import { Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import CodeBlock from "@/components/CodeBlock";
import Terminal, { type Step } from "@/components/Terminal";

/* ---------------------------------------------------------------------------
   الـ Subagents — نسخة عربية أمينة من https://claude.hjahouse.me/ar/learn/subagents
--------------------------------------------------------------------------- */

const agentFileCode = `---
name: security-reviewer
description: Security-focused code reviewer. Use proactively after writing authentication, authorization, or data handling code.
tools: Read, Grep, Glob
---

You are a senior security engineer specializing in application security.

Review priorities:
1. Authentication and authorization flaws
2. Injection vulnerabilities (SQL, XSS, command)
3. Data exposure and sensitive information handling
4. Cryptographic weaknesses
5. Insecure direct object references

For each finding, provide: severity (Critical/High/Medium/Low), location (file:line), description, and a concrete fix with code example.

When invoked: use Grep and Read to inspect recently changed files.`;

const researcherAgentCode = `---
name: researcher
memory: user
description: Long-running research assistant with persistent notes
---
You are a research assistant. Check your MEMORY.md at session start to recall previous findings. Update it with new discoveries.`;

const addDirCode = `claude --add-dir ~/projects/shared-types --add-dir ~/projects/design-tokens
claude --mcp-config ./ci-servers.json`;

const explicitInvocationCode = `Use the security-reviewer agent to audit the new auth module.
Have the test-engineer agent write integration tests for the payment service.
Ask the debugger agent to investigate the memory leak in src/workers/queue.ts.`;

const agentViewFilterCode = `# اعرض بس جلسات الـ agents اللي بدأت تحت ~/work/api
claude agents --cwd ~/work/api`;

const agentViewJsonCode = `# صحّي بس الجلسات اللي مستنية إذن صلاحية
claude agents --json \\
  | jq -r '.[] | select(.status == "waiting" and .waitingFor == "permission prompt") | .sessionId' \\
  | xargs -I {} claude respawn {}`;

const chainingCode = `First use the code-analyzer agent to find performance bottlenecks, then use the optimizer agent to fix them.`;

const forkSubagentCode = `CLAUDE_CODE_FORK_SUBAGENT=1 claude`;

const terminalScript: Step[] = [
  { t: "print", text: "# إنشاء وتشغيل جلسة subagent", tone: "system" },
  { t: "wait", ms: 400 },
  { t: "type", text: "ls .claude/agents/", prompt: "$", tone: "user" },
  {
    t: "out",
    lines: [
      { text: "security-reviewer.md", tone: "green" },
      { text: "test-engineer.md", tone: "green" },
      { text: "code-analyzer.md", tone: "green" },
    ],
    gap: 60,
  },
  { t: "wait", ms: 500 },
  { t: "type", text: "claude agents", prompt: "$", tone: "user" },
  {
    t: "out",
    lines: [
      { text: "Agent Roster", tone: "blue" },
      { text: "────────────────────────────────────────────", tone: "muted" },
      { text: "PID    NAME               STATUS     LAST ACTIVITY", tone: "muted" },
      { text: "1234   security-reviewer  working    2s ago", tone: "green" },
      { text: "1235   test-engineer      waiting    5s ago", tone: "amber" },
      { text: "1236   code-analyzer      completed  1m ago", tone: "muted" },
    ],
    gap: 70,
  },
  { t: "wait", ms: 600 },
  { t: "type", text: "Use the security-reviewer agent to audit src/auth/", prompt: ">", tone: "user" },
  {
    t: "out",
    lines: [
      { text: "Delegating to security-reviewer agent...", tone: "system" },
      { text: "Running: git diff HEAD -- src/auth/", tone: "muted" },
      { text: "Scanning authentication module...", tone: "blue" },
      { text: "", tone: "default" },
      { text: "FINDINGS:", tone: "amber" },
      { text: "  [HIGH]  src/auth/login.ts:42 — JWT secret hardcoded", tone: "error" },
      { text: "  [MED]   src/auth/session.ts:18 — Missing httpOnly flag", tone: "amber" },
      { text: "  [LOW]   src/auth/utils.ts:7  — Weak hash rounds (8)", tone: "muted" },
    ],
    gap: 80,
  },
  { t: "wait", ms: 400 },
  { t: "print", text: "اكتمل فحص الأمان. ٣ نتائج.", tone: "green" },
];

const questions: QuizQuestion[] = [
  {
    q: "فين تحط ملفات الـ agent markdown عشان تكون متاحة لكل مشاريعك الشخصية؟",
    options: [
      "‎.claude/agents/ في جذر المشروع",
      "‎~/.claude/agents/ في المجلد الرئيسي",
      "‎/etc/claude/agents/ على مستوى النظام",
      "مررها بـ ‎--agent-file عند التشغيل",
    ],
    answer: 1,
    explanation:
      "‎~/.claude/agents/ هو النطاق الشخصي (للمستخدم). الملفات في ‎.claude/agents/ بتنطبق بس على المشروع الحالي. الـ plugins ممكن تجمّع agents أيضًا، لكن ‎~/.claude/agents/ هي الإجابة الصح لكل المشاريع الشخصية.",
  },
  {
    q: "إيه اللي بيعمله خيار ‎`isolation: worktree` في الـ frontmatter؟",
    options: [
      "بيشغّل الـ agent في Docker container",
      "بيدّي الـ agent git worktree وbranch خاصين بيه عشان التغييرات ما تلمسش الـ working tree الأساسي",
      "بيمنع الـ agent من الوصول للإنترنت",
      "بيقيّد الـ agent على ملف واحد فقط",
    ],
    answer: 1,
    explanation:
      "‎isolation: worktree بينشئ git worktree منفصل للـ agent. لما يخلّص، بيرجّع مسار الـ worktree واسم الـ branch عشان تراجعه. لو ما عملش أي تغييرات، الـ worktree بيتمسح تلقائيًا.",
  },
  {
    q: "أي built-in subagent بيستخدم Haiku للتحليل السريع للكود (قراءة فقط)؟",
    options: ["general-purpose", "Plan", "Explore", "claude-code-guide"],
    answer: 2,
    explanation:
      "‎Explore بيستخدم Haiku للتحليل السريع والـ read-only للكود. خلّي بالك: كل من Explore وPlan بيتخطوا ملفات CLAUDE.md والـ git status عشان البحث يفضل سريع وغير مكلف.",
  },
  {
    q: "إيه اللي بيغيّره ‎`CLAUDE_CODE_FORK_SUBAGENT=1` في طريقة تشغيل الـ subagents؟",
    options: [
      "الـ agents بتشتغل بالترتيب بدل التوازي",
      "الـ agents بتورث الـ conversation context الكامل من الجلسة الرئيسية بدل ما تبدأ من الصفر",
      "الـ agents بتتعطل كليًا",
      "الـ agents بتاخد تلقائيًا صلاحية الكتابة لكل الملفات",
    ],
    answer: 1,
    explanation:
      "لما ‎CLAUDE_CODE_FORK_SUBAGENT=1 يتفعّل، الـ forked subagents بتورث الـ conversation context الكامل من الجلسة الرئيسية. ده بيخلّي ‎/fork ينشئ forked subagent بدل ما يكون alias لـ ‎/branch، وكل الـ subagent spawns بتشتغل في الخلفية.",
  },
];

export default function Content() {
  return (
    <Prose>
      {/* مقدمة */}
      <Reveal delay={0}>
        <p>
          الـ subagents بتخلّي Claude يفوّض الشغل لمساعدين AI متخصصين، كل واحد بـ context window
          خاص بيه وأدوات وsystem prompt. بيمنعوا تلوث السياق في المهام الطويلة، وبيسمحوا
          بالتنفيذ المتوازي، وبيخلوك تحوّل الخبرة التقنية لـ agents قابلين لإعادة الاستخدام.
          في الموديول ده، هنغطي إزاي تعمل وتضبط وتستخدم الـ subagents بفعالية.
        </p>
      </Reveal>

      {/* ------------------------------------------------------------------ */}
      {/* إنشاء Subagents                                                     */}
      {/* ------------------------------------------------------------------ */}
      <Reveal delay={70}>
        <h2>إنشاء Subagents</h2>
      </Reveal>

      <Reveal delay={140}>
        <p>
          الـ subagents هي ملفات markdown بـ YAML frontmatter. ممكن تعرّفها بالـ flag{" "}
          <code>--agents</code> في الـ CLI لجلسة واحدة، أو تحطها في{" "}
          <code>.claude/agents/</code> لنطاق المشروع (بتتعمل لها commit في git)، أو{" "}
          <code>~/.claude/agents/</code> للنطاق الشخصي (كل المشاريع). الـ plugins كمان ممكن
          تجمّع agents. الأولوية: managed &gt; CLI flag &gt; project &gt; user &gt; plugin. الـ
          built-in agents دايمًا متاحة ومش جزء من نظام أولوية تسمية الـ agents. أمر{" "}
          <code>/agents</code> بيديك قائمة تفاعلية لإنشاء وتعديل وإدارة الـ agents.
        </p>
        <p>
          الـ frontmatter بيعرّف هوية الـ agent. محتوى الـ markdown هو الـ system prompt بتاعه
          — اكتبه كأنك بتعمل briefing لمتخصص:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".claude/agents/security-reviewer.md"
          lang="markdown"
          code={agentFileCode}
        />
      </Reveal>

      <Reveal delay={280}>
        <p>
          الـ <code>tools</code> field بيحدد الأدوات اللي الـ agent يقدر يستعملها. security
          reviewer محتاج <code>Read</code> و<code>Grep</code> و<code>Glob</code> بس — مفيش
          وصول للكتابة. implementation agent محتاج كل الأدوات. تقييد الأدوات بيخلّي الـ agent
          أكتر أمانًا وسلوكه أكتر قابلية للتوقع. لو حذفت <code>tools</code>، الـ agent بيورث
          كل الأدوات المتاحة.
        </p>
      </Reveal>

      {/* ------------------------------------------------------------------ */}
      {/* خيارات الإعداد                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Reveal delay={0}>
        <h2>خيارات الإعداد</h2>
      </Reveal>

      <Reveal delay={70}>
        <p>
          بجانب الوصول الأساسي للأدوات، الـ frontmatter بيدعم خيارات قوية.{" "}
          <code>model</code> بيحدد الموديل اللي الـ agent بيستخدمه —{" "}
          <code>haiku</code> للمهام السريعة والخفيفة، <code>sonnet</code> للشغل المتوازن، أو{" "}
          <code>opus</code> للتفكير المعقد. كمان ممكن تستخدم <code>inherit</code> عشان يورث
          موديل الـ parent. <code>effort</code> بيتحكم في عمق التحليل على الموديلات المدعومة،
          بقيم <code>low</code> و<code>medium</code> و<code>high</code> و<code>xhigh</code>{" "}
          و<code>max</code> و<code>auto</code>. <code>maxTurns</code> بيحدد كم دور الـ agent
          يقدر يشتغل. <code>permissionMode</code> بيضبط مستوى الصلاحيات. من الحقول المفيدة
          كمان: <code>disallowedTools</code> و<code>skills</code> لتحميل skills مختارة مسبقًا،
          و<code>mcpServers</code> لوصول MCP خاص بالـ agent، و<code>initialPrompt</code>{" "}
          لإرسال أول دور تلقائيًا.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <p>
          <code>memory</code> بيدي الـ agent تخزين دائم عبر الجلسات. أول 200 سطر من ملف{" "}
          <code>MEMORY.md</code> في مجلد الذاكرة بتاع الـ agent بتتحمّل في الـ system prompt
          تلقائيًا — Claude بيكتب في الملف ده لما يتعلم حاجات جديدة:
        </p>
      </Reveal>

      <Reveal delay={210}>
        <CodeBlock
          filename=".claude/agents/researcher.md"
          lang="markdown"
          code={researcherAgentCode}
        />
      </Reveal>

      <Reveal delay={280}>
        <p>
          <code>isolation: worktree</code> بيدي الـ agent git worktree خاص بيه وbranch منفصل
          يعمل فيه تغييرات من غير ما يلمس الـ working tree الأساسي. لما يخلّص، بيرجّع مسار
          الـ worktree واسم الـ branch عشان تراجعه وتعمل merge. لو ما عملش أي تغييرات، الـ
          worktree بيتمسح تلقائيًا. وطول ما الـ agent شغّال، Claude بيعمل lock للـ worktree
          عشان عملية التنظيف ما تشيلهوش، وبيفك الـ lock لما الـ agent يخلّص. الـ worktree
          بيتفرّع من الـ default branch بتاع الـ repo (<code>origin/HEAD</code>) إلا لو ظبطت{" "}
          <code>worktree.baseRef</code> على <code>head</code> في الـ settings، وساعتها الـ
          agents المعزولة بتبدأ من الـ <code>HEAD</code> المحلي وبتشيل معاها الشغل اللي لسه
          ما اتـpushتش.
        </p>
      </Reveal>

      <Reveal delay={350}>
        <Callout tone="tip" title="background: true">
          <code>background: true</code> في الـ frontmatter بيخلّي الـ agent يشتغل دايمًا كـ
          background task، عشان المحادثة الأساسية تفضل حرة. كمان تقدر تضغط{" "}
          <code>Ctrl+B</code> عشان تحوّل agent شغّال حاليًا للخلفية.
        </Callout>
      </Reveal>

      <Reveal delay={420}>
        <p>
          فيه CLI flags بتوسّع اللي الجلسة تقدر توصله.{" "}
          <code>--add-dir &lt;path&gt;</code> بيدّي صلاحيات Read/Edit لمجلدات إضافية غير مجلد
          العمل الأساسي — مفيد لما الكود بتاعك بيشير لـ shared libraries أو packages في
          مجلدات مجاورة في monorepo. الـ skills في <code>.claude/skills/</code> في المجلدات
          المضافة بتتحمّل تلقائيًا. اضبطها بشكل دائم بـ{" "}
          <code>permissions.additionalDirectories</code> في الإعدادات.{" "}
          <code>--mcp-config &lt;path&gt;</code> بيحمّل تعريفات MCP servers من ملف JSON واحد
          أو أكتر للجلسة الحالية بس، وبيتدمج مع مصادر الـ MCP بتاعت المستخدم/المشروع. ضيف{" "}
          <code>--strict-mcp-config</code> عشان تتجاهل مصادر المستخدم/المشروع وتستخدم بس
          الملفات اللي حددتها:
        </p>
      </Reveal>

      <Reveal delay={490}>
        <CodeBlock filename="terminal" lang="bash" code={addDirCode} tone="terminal" />
      </Reveal>

      {/* ------------------------------------------------------------------ */}
      {/* استخدام وتسلسل الـ Subagents                                        */}
      {/* ------------------------------------------------------------------ */}
      <Reveal delay={0}>
        <h2>استخدام وتسلسل الـ Subagents</h2>
      </Reveal>

      <Reveal delay={70}>
        <p>
          Claude بيشغّل الـ agents تلقائيًا لما وصف المهمة يطابق الـ <code>description</code>{" "}
          field بتاع الـ agent. عبارات زي &quot;use proactively&quot; ممكن تشجّع التفويض، بس
          الاستدعاء الصريح هو الطريقة المضمونة لما تحتاج agent معين. استخدم صيغة{" "}
          <code>@&quot;agent-name (agent)&quot;</code> عشان تضمن استخدام agent بعينه،
          وتتخطى المطابقة التلقائية.
        </p>
        <p>الاستدعاء الصريح بلغة طبيعية كمان بيشتغل:</p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock
          filename="أمثلة على الاستدعاء الصريح"
          lang="text"
          code={explicitInvocationCode}
        />
      </Reveal>

      <Reveal delay={210}>
        <p>
          الـ agents ممكن يتسلسلوا ورا بعض، بحيث output واحد يغذّي اللي بعده. شغّل{" "}
          <code>claude agents</code> من الـ terminal عشان تفتح <strong>واجهة الـ Agent</strong>{" "}
          — قائمة بكل جلسات Claude Code بتوضّح حالتها (working, waiting, completed, failed,
          idle, stopped) وآخر نشاط. ده مفيد لمتابعة agents كتير شغّالين بالتوازي. مرّر{" "}
          <code>--cwd &lt;path&gt;</code> عشان تفلتر الـ roster على الجلسات اللي اتفتحت تحت
          المسار ده — مفيد لما تكون شغّال على أكتر من repo وعايز تشوف بس الجلسات بتاعت
          المشروع الحالي. اضبط <code>CLAUDE_CODE_DISABLE_AGENT_VIEW=1</code> عشان تعطّلها.
          كمان تقدر تشغّل session كاملة مع agent معين بـ <code>claude --agent &lt;name&gt;</code>،
          وتقيّد الـ agents اللي coordinator يقدر يشغّلها بـ{" "}
          <code>Agent(...)</code> tool allowlists.
        </p>
      </Reveal>

      <Reveal delay={280}>
        <CodeBlock filename="terminal" lang="bash" code={agentViewFilterCode} tone="terminal" />
      </Reveal>

      {/* عرض Terminal */}
      <Reveal delay={350}>
        <Terminal
          script={terminalScript}
          title="claude agents"
          loop={true}
          showStatus={true}
          className="my-6"
        />
      </Reveal>

      <Reveal delay={420}>
        <p>
          للسكربتات اللي محتاجة تستهلك الـ roster — boot scripts على شكل tmux-resurrect، أو
          status bars مخصصة، أو session pickers — مرّر <code>--json</code> لـ{" "}
          <code>claude agents</code> عشان تاخد نفس البيانات كـ array بصيغة قابلة للقراءة آليًا
          بدل العرض التفاعلي. كل عنصر بيتضمن <code>pid</code> و<code>cwd</code> و
          <code>kind</code> و<code>startedAt</code>، وكمان <code>sessionId</code> و
          <code>name</code> و<code>status</code> لما يكونوا متضبطين. لما <code>status</code>{" "}
          يبقى <code>waiting</code>، الحقل <code>waitingFor</code> بيقولك الجلسة مستنية إيه
          بالظبط — زي <code>permission prompt</code> أو <code>input needed</code> — فالسكربت
          يقدر يوجّه كل حالة لإجراء مختلف:
        </p>
      </Reveal>

      <Reveal delay={490}>
        <CodeBlock
          filename="إعادة تشغيل الـ agents المنتظرة للإذن"
          lang="bash"
          code={agentViewJsonCode}
          tone="terminal"
        />
      </Reveal>

      <Reveal delay={560}>
        <CodeBlock
          filename="مثال على تسلسل الـ agents"
          lang="text"
          code={chainingCode}
        />
      </Reveal>

      {/* الـ Built-in Agents */}
      <Reveal delay={0}>
        <h3>الـ Built-in Agents</h3>
      </Reveal>

      <Reveal delay={70}>
        <p>
          Claude Code جاي معاه عدة agents جاهزة مش محتاج تعملها:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <div className="my-5 grid gap-3 sm:grid-cols-2">
          {[
            {
              name: "general-purpose",
              desc: "بيتعامل مع المهام العامة متعددة الخطوات في أي مجال.",
            },
            {
              name: "Explore",
              desc: "بيستخدم Haiku للتحليل السريع للكود (قراءة فقط). بيتخطى CLAUDE.md والـ git status للسرعة.",
            },
            {
              name: "Plan",
              desc: "بيبحث في الكود قبل ما يقدّم خطط تنفيذ. كمان بيتخطى CLAUDE.md والـ git status.",
            },
            {
              name: "claude-code-guide",
              desc: "بيجاوب على الأسئلة عن مميزات وإمكانيات Claude Code.",
            },
          ].map((agent, i) => (
            <Reveal key={agent.name} delay={i * 70}>
              <Card className="transition hover:-translate-y-0.5 hover:border-accent/40">
                <div className="mb-1 font-mono text-sm font-semibold text-accent">
                  {agent.name}
                </div>
                <p className="text-sm text-fg-muted">{agent.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal delay={350}>
        <Callout tone="note" title="CLAUDE.md في الـ built-in agents">
          <code>Explore</code> و<code>Plan</code> بيتخطوا ملفات CLAUDE.md والـ git status
          بتاعك عشان البحث يفضل سريع وغير مكلف. كل الـ built-in agents التانية والـ custom
          subagents بتحمّل الاتنين. الـ agents كمان ممكن يكونوا resumable — يعني Claude يقدر
          يكمّل محادثة سابقة لـ agent بالـ ID بتاعه لما الـ workflow بيمتد على أكتر من دور.
        </Callout>
      </Reveal>

      {/* الـ Forked Subagents */}
      <Reveal delay={0}>
        <h3>الـ Forked Subagents</h3>
      </Reveal>

      <Reveal delay={70}>
        <p>
          اضبط <code>CLAUDE_CODE_FORK_SUBAGENT=1</code> عشان تفعّل الـ forked subagents.
          الـ forked subagent بيورث الـ conversation context الكامل من الجلسة الرئيسية بدل ما
          يبدأ من الصفر. لما يتفعّل، <code>/fork</code> بيشغّل forked subagent بدل ما يكون
          alias لـ <code>/branch</code>، وكل الـ subagent spawns بتشتغل في الخلفية. ده
          بيشتغل في الـ interactive sessions والـ non-interactive mode والـ Agent SDK، وعلى
          الـ external builds:
        </p>
      </Reveal>

      <Reveal delay={140}>
        <CodeBlock filename="terminal" lang="bash" code={forkSubagentCode} tone="terminal" />
      </Reveal>

      {/* فرق الـ Agents */}
      <Reveal delay={0}>
        <h3>فرق الـ Agents — تجريبي</h3>
      </Reveal>

      <Reveal delay={70}>
        <p>
          خاصية Agent Teams التجريبية (محتاجة{" "}
          <code>CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1</code> أو{" "}
          <code>--agent-teams</code> CLI flag) بتنسّق بين عدة Claude instances بيشتغلوا
          بالتوازي عبر قائمة مهام وصندوق رسائل مشترك. ده للمشاريع الكبيرة متعددة الملفات
          اللي agents مستقلين يقدروا يشتغلوا على أجزاء مختلفة في نفس الوقت من غير ما
          يتداخلوا. <code>SendMessage</code> بيعمل resume تلقائي للـ agents المتوقفين لما
          ترسل لهم رسالة، فمش محتاج تعمل resume يدوي قبل ما تتواصل معاهم.
        </p>
        <p>
          بدءًا من v2.1.178، أداتا <code>TeamCreate</code> و<code>TeamDelete</code> اتشالت:
          مع تفعيل الـ flag، كل جلسة عندها بالفعل team ضمني واحد، فبتعمل spawn للزملاء
          مباشرة عن طريق parameter الـ <code>name</code> في أداة Agent — من غير خطوة setup —
          والتنظيف بيتم تلقائيًا لما الجلسة تخلص.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <Callout tone="warn" title="خاصية تجريبية">
          Agent Teams تجريبية والـ API ممكن يتغير. استخدمها في مشاريع تقدر تتحمّل فيها
          تغييرات بين إصدارات Claude Code.
        </Callout>
      </Reveal>

      {/* اختبار */}
      <Reveal delay={0}>
        <Quiz questions={questions} title="اختبار سريع — الـ Subagents" />
      </Reveal>
    </Prose>
  );
}
