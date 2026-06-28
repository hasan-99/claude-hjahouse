"use client";

import { useState, useCallback } from "react";
import CodeBlock from "@/components/CodeBlock";
import type { Locale } from "@/lib/site";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-fg-muted">
      {children}
      {required && <span className="ml-0.5 text-accent">*</span>}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full min-h-[40px] rounded-lg border border-border bg-bg-subtle px-3 py-2 text-sm text-fg placeholder:text-fg-faint focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/30 transition"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-border bg-bg-subtle px-3 py-2 text-sm text-fg placeholder:text-fg-faint focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/30 transition resize-y"
    />
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-h-[40px] rounded-lg border border-border bg-bg-subtle px-3 py-2 text-sm text-fg focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/30 transition appearance-none"
    >
      {children}
    </select>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

function CopyButton({
  text,
  onDownload,
  onReset,
  locale = "en",
}: {
  text: string;
  onDownload?: () => void;
  onReset: () => void;
  locale?: Locale;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const labelCopy = locale === "ar" ? "نسخ" : "Copy";
  const labelCopied = locale === "ar" ? "تم النسخ" : "Copied";
  const labelDownload = locale === "ar" ? "تحميل" : "Download";
  const labelReset = locale === "ar" ? "إعادة تعيين" : "Reset";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={copy}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-bg-subtle px-3 py-1.5 text-xs font-medium text-fg-muted transition hover:border-accent/40 hover:text-accent min-h-[32px]"
      >
        {copied ? (
          <>
            <svg className="h-3.5 w-3.5 text-beginner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {labelCopied}
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {labelCopy}
          </>
        )}
      </button>
      {onDownload && (
        <button
          onClick={onDownload}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-bg-subtle px-3 py-1.5 text-xs font-medium text-fg-muted transition hover:border-accent/40 hover:text-accent min-h-[32px]"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {labelDownload}
        </button>
      )}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-bg-subtle px-3 py-1.5 text-xs font-medium text-fg-muted transition hover:border-accent/40 hover:text-accent min-h-[32px]"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
        </svg>
        {labelReset}
      </button>
    </div>
  );
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────────
   Preview row helper
───────────────────────────────────────────── */

function PreviewHeader({
  locale,
  previewLabel,
  updatedLabel,
  copyText,
  onDownload,
  onReset,
}: {
  locale: Locale;
  previewLabel: string;
  updatedLabel: string;
  copyText: string;
  onDownload?: () => void;
  onReset: () => void;
}) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">{previewLabel}</span>
        <CopyButton text={copyText} onDownload={onDownload} onReset={onReset} locale={locale} />
      </div>
      <p className="mb-2 text-xs text-fg-faint">{updatedLabel}</p>
    </>
  );
}

/* ─────────────────────────────────────────────
   CLAUDE.md Builder
───────────────────────────────────────────── */

const CLAUDE_DEFAULTS = {
  projectName: "",
  stack: "",
  testCmd: "",
  buildCmd: "",
  lintCmd: "",
  conventions: "",
  instructions: "",
};

function generateClaudeMd(f: typeof CLAUDE_DEFAULTS): string {
  const name = f.projectName || "Project";
  const lines: string[] = [`# ${name} — CLAUDE.md`, ""];

  const cmds: string[] = [];
  if (f.testCmd) cmds.push(`- **Test:** \`${f.testCmd}\``);
  if (f.buildCmd) cmds.push(`- **Build:** \`${f.buildCmd}\``);
  if (f.lintCmd) cmds.push(`- **Lint:** \`${f.lintCmd}\``);

  if (cmds.length) {
    lines.push("## Commands", "", ...cmds, "");
  } else {
    lines.push("## Commands", "");
  }

  if (f.stack) {
    lines.push("## Tech Stack", "", f.stack, "");
  }

  if (f.conventions) {
    lines.push("## Code Conventions", "", f.conventions, "");
  }

  if (f.instructions) {
    lines.push("## Instructions", "", f.instructions, "");
  }

  return lines.join("\n");
}

function ClaudeMdBuilder({ locale = "en" }: { locale?: Locale }) {
  const [fields, setFields] = useState(CLAUDE_DEFAULTS);
  const set = (k: keyof typeof CLAUDE_DEFAULTS) => (v: string) =>
    setFields((f) => ({ ...f, [k]: v }));

  const code = generateClaudeMd(fields);

  const isAr = locale === "ar";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <FieldRow>
          <Label required>{isAr ? "اسم المشروع" : "Project Name"}</Label>
          <Input value={fields.projectName} onChange={set("projectName")} placeholder="my-app" />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "المكدس التقني" : "Tech Stack"}</Label>
          <Textarea value={fields.stack} onChange={set("stack")} placeholder="Next.js 15, TypeScript, Tailwind, Supabase" rows={2} />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "أمر الاختبار" : "Test Command"}</Label>
          <Input value={fields.testCmd} onChange={set("testCmd")} placeholder="npm test" />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "أمر البناء" : "Build Command"}</Label>
          <Input value={fields.buildCmd} onChange={set("buildCmd")} placeholder="npm run build" />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "أمر الفحص" : "Lint Command"}</Label>
          <Input value={fields.lintCmd} onChange={set("lintCmd")} placeholder="npm run lint" />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "اصطلاحات الكود" : "Code Conventions"}</Label>
          <Textarea value={fields.conventions} onChange={set("conventions")} placeholder="Use functional components. Prefer named exports. Keep files under 300 lines." rows={3} />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "تعليمات مخصصة" : "Custom Instructions"}</Label>
          <Textarea value={fields.instructions} onChange={set("instructions")} placeholder="Additional context or instructions for Claude…" rows={3} />
        </FieldRow>
      </div>
      <div>
        <PreviewHeader
          locale={locale}
          previewLabel={isAr ? "معاينة مباشرة" : "Live preview"}
          updatedLabel={isAr ? "تم تحديث المعاينة" : "Configuration preview updated"}
          copyText={code}
          onDownload={() => download("CLAUDE.md", code)}
          onReset={() => setFields(CLAUDE_DEFAULTS)}
        />
        <CodeBlock code={code} filename="CLAUDE.md" lang="markdown" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Skill Builder
───────────────────────────────────────────── */

const SKILL_DEFAULTS = {
  name: "",
  description: "",
  instructions: "",
  userInvocable: "true",
};

function generateSkillMd(f: typeof SKILL_DEFAULTS): string {
  const name = f.name || "my-skill";
  const lines: string[] = [
    "---",
    `user-invocable: ${f.userInvocable}`,
    "---",
    "",
    `# ${name}`,
  ];
  if (f.description) {
    lines.push("", f.description);
  }
  if (f.instructions) {
    lines.push("", "## Instructions", "", f.instructions);
  }
  return lines.join("\n");
}

function SkillBuilder({ locale = "en" }: { locale?: Locale }) {
  const [fields, setFields] = useState(SKILL_DEFAULTS);
  const set = (k: keyof typeof SKILL_DEFAULTS) => (v: string) =>
    setFields((f) => ({ ...f, [k]: v }));

  const code = generateSkillMd(fields);
  const isAr = locale === "ar";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <FieldRow>
          <Label required>{isAr ? "اسم المهارة" : "Skill Name"}</Label>
          <Input value={fields.name} onChange={set("name")} placeholder="my-skill" />
        </FieldRow>
        <FieldRow>
          <Label required>{isAr ? "الوصف (للتفعيل)" : "Description (for triggering)"}</Label>
          <Textarea value={fields.description} onChange={set("description")} placeholder="Describe when Claude should use this skill…" rows={2} />
        </FieldRow>
        <FieldRow>
          <Label required>{isAr ? "التعليمات" : "Instructions"}</Label>
          <Textarea value={fields.instructions} onChange={set("instructions")} placeholder="Step-by-step instructions for Claude to follow…" rows={5} />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "قابل للاستدعاء" : "User Invocable"}</Label>
          <Select value={fields.userInvocable} onChange={set("userInvocable")}>
            <option value="">{isAr ? "اختر…" : "Select…"}</option>
            <option value="true">{isAr ? "نعم — متاح كـ /skill-name" : "Yes — available as /skill-name"}</option>
            <option value="false">{isAr ? "لا — يُفعَّل تلقائيًا فقط" : "No — only triggered automatically"}</option>
          </Select>
        </FieldRow>
      </div>
      <div>
        <PreviewHeader
          locale={locale}
          previewLabel={isAr ? "معاينة مباشرة" : "Live preview"}
          updatedLabel={isAr ? "تم تحديث المعاينة" : "Configuration preview updated"}
          copyText={code}
          onDownload={() => download(`${fields.name || "my-skill"}.md`, code)}
          onReset={() => setFields(SKILL_DEFAULTS)}
        />
        <CodeBlock code={code} filename={`${fields.name || "my-skill"}.md`} lang="markdown" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Agent Builder
───────────────────────────────────────────── */

const AGENT_DEFAULTS = {
  name: "",
  description: "",
  model: "",
  tools: "",
  instructions: "",
};

function generateAgentMd(f: typeof AGENT_DEFAULTS): string {
  const name = f.name || "my-agent";
  const frontmatter: string[] = ["---"];
  if (f.model) frontmatter.push(`model: ${f.model}`);
  if (f.tools) {
    const toolList = f.tools.split(",").map((t) => t.trim()).filter(Boolean);
    frontmatter.push(`tools: [${toolList.join(", ")}]`);
  }
  frontmatter.push("---");
  const lines: string[] = [...frontmatter, "", `# ${name}`];
  if (f.description) lines.push("", f.description);
  if (f.instructions) lines.push("", "## Instructions", "", f.instructions);
  return lines.join("\n");
}

function AgentBuilder({ locale = "en" }: { locale?: Locale }) {
  const [fields, setFields] = useState(AGENT_DEFAULTS);
  const set = (k: keyof typeof AGENT_DEFAULTS) => (v: string) =>
    setFields((f) => ({ ...f, [k]: v }));

  const code = generateAgentMd(fields);
  const isAr = locale === "ar";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <FieldRow>
          <Label required>{isAr ? "اسم الوكيل" : "Agent Name"}</Label>
          <Input value={fields.name} onChange={set("name")} placeholder="my-agent" />
        </FieldRow>
        <FieldRow>
          <Label required>{isAr ? "الوصف" : "Description"}</Label>
          <Textarea value={fields.description} onChange={set("description")} placeholder="What this agent does…" rows={2} />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "النموذج" : "Model"}</Label>
          <Select value={fields.model} onChange={set("model")}>
            <option value="">{isAr ? "الافتراضي (يرث من الأصل)" : "Default (inherit from parent)"}</option>
            <option value="claude-sonnet-4-5">{isAr ? "Sonnet (سريع)" : "Sonnet (fast)"}</option>
            <option value="claude-opus-4-5">{isAr ? "Opus (قادر)" : "Opus (capable)"}</option>
            <option value="claude-haiku-3-5">{isAr ? "Haiku (خفيف)" : "Haiku (light)"}</option>
          </Select>
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "الأدوات المسموح بها" : "Allowed Tools"}</Label>
          <Input value={fields.tools} onChange={set("tools")} placeholder="Read, Grep, Bash" />
        </FieldRow>
        <FieldRow>
          <Label required>{isAr ? "تعليمات الوكيل" : "Agent Instructions"}</Label>
          <Textarea value={fields.instructions} onChange={set("instructions")} placeholder="Detailed instructions for the agent…" rows={5} />
        </FieldRow>
      </div>
      <div>
        <PreviewHeader
          locale={locale}
          previewLabel={isAr ? "معاينة مباشرة" : "Live preview"}
          updatedLabel={isAr ? "تم تحديث المعاينة" : "Configuration preview updated"}
          copyText={code}
          onDownload={() => download(`${fields.name || "my-agent"}.md`, code)}
          onReset={() => setFields(AGENT_DEFAULTS)}
        />
        <CodeBlock code={code} filename={`${fields.name || "my-agent"}.md`} lang="markdown" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Hook Builder
───────────────────────────────────────────── */

const HOOK_DEFAULTS = {
  event: "",
  matcher: "",
  command: "",
  timeout: "",
};

function generateHookJson(f: typeof HOOK_DEFAULTS): string {
  const event = f.event || "PostToolUse";
  const hookEntry: Record<string, unknown> = {
    type: "command",
    command: f.command || "echo 'hook triggered'",
  };
  if (f.matcher) hookEntry.matcher = f.matcher;
  if (f.timeout) hookEntry.timeout = Number(f.timeout);

  const obj = {
    hooks: {
      [event]: [hookEntry],
    },
  };
  return JSON.stringify(obj, null, 2);
}

function HookBuilder({ locale = "en" }: { locale?: Locale }) {
  const [fields, setFields] = useState(HOOK_DEFAULTS);
  const set = (k: keyof typeof HOOK_DEFAULTS) => (v: string) =>
    setFields((f) => ({ ...f, [k]: v }));

  const code = generateHookJson(fields);
  const isAr = locale === "ar";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <FieldRow>
          <Label required>{isAr ? "الحدث" : "Event"}</Label>
          <Select value={fields.event} onChange={set("event")}>
            <option value="">{isAr ? "اختر…" : "Select…"}</option>
            <option value="PreToolUse">{isAr ? "PreToolUse — قبل تشغيل الأداة" : "PreToolUse — before a tool runs"}</option>
            <option value="PostToolUse">{isAr ? "PostToolUse — بعد تشغيل الأداة" : "PostToolUse — after a tool runs"}</option>
            <option value="Notification">{isAr ? "Notification — عند تحديثات الحالة" : "Notification — on status updates"}</option>
            <option value="Stop">{isAr ? "Stop — عند انتهاء Claude من الرد" : "Stop — when Claude finishes a response"}</option>
            <option value="SubagentStop">{isAr ? "SubagentStop — عند انتهاء الوكيل الفرعي" : "SubagentStop — when a subagent finishes"}</option>
          </Select>
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "مطابق الأداة (regex)" : "Tool Matcher (regex)"}</Label>
          <Input value={fields.matcher} onChange={set("matcher")} placeholder="Bash|Write" />
        </FieldRow>
        <FieldRow>
          <Label required>{isAr ? "الأمر" : "Command"}</Label>
          <Input value={fields.command} onChange={set("command")} placeholder="./scripts/lint.sh" />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "المهلة (مللي ثانية)" : "Timeout (ms)"}</Label>
          <Input value={fields.timeout} onChange={set("timeout")} placeholder="5000" />
        </FieldRow>
      </div>
      <div>
        <PreviewHeader
          locale={locale}
          previewLabel={isAr ? "معاينة مباشرة" : "Live preview"}
          updatedLabel={isAr ? "تم تحديث المعاينة" : "Configuration preview updated"}
          copyText={code}
          onDownload={() => download("settings.json", code)}
          onReset={() => setFields(HOOK_DEFAULTS)}
        />
        <CodeBlock code={code} filename="settings.json" lang="json" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MCP Server Builder
───────────────────────────────────────────── */

const MCP_DEFAULTS = {
  name: "",
  command: "",
  args: "",
  envVars: "",
  scope: "project",
};

function generateMcpJson(f: typeof MCP_DEFAULTS): string {
  const name = f.name || "my-server";
  const argList = f.args
    ? f.args.split(",").map((a) => a.trim()).filter(Boolean)
    : [];

  const serverEntry: Record<string, unknown> = {
    command: f.command || "npx",
    args: argList,
  };

  if (f.envVars) {
    const envObj: Record<string, string> = {};
    f.envVars.split("\n").forEach((line) => {
      const [k, ...rest] = line.split("=");
      if (k?.trim()) envObj[k.trim()] = rest.join("=").trim();
    });
    if (Object.keys(envObj).length) serverEntry.env = envObj;
  }

  const obj = {
    mcpServers: {
      [name]: serverEntry,
    },
  };
  return JSON.stringify(obj, null, 2);
}

function McpBuilder({ locale = "en" }: { locale?: Locale }) {
  const [fields, setFields] = useState(MCP_DEFAULTS);
  const set = (k: keyof typeof MCP_DEFAULTS) => (v: string) =>
    setFields((f) => ({ ...f, [k]: v }));

  const code = generateMcpJson(fields);
  const filename = fields.scope === "user" ? "~/.claude/settings.json" : ".claude/settings.json";
  const isAr = locale === "ar";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <FieldRow>
          <Label required>{isAr ? "اسم الخادم" : "Server Name"}</Label>
          <Input value={fields.name} onChange={set("name")} placeholder="my-server" />
        </FieldRow>
        <FieldRow>
          <Label required>{isAr ? "الأمر" : "Command"}</Label>
          <Input value={fields.command} onChange={set("command")} placeholder="npx" />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "الوسائط (مفصولة بفاصلة)" : "Arguments (comma-separated)"}</Label>
          <Input value={fields.args} onChange={set("args")} placeholder="-y, @modelcontextprotocol/server-filesystem" />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "متغيرات البيئة" : "Environment Variables"}</Label>
          <Textarea
            value={fields.envVars}
            onChange={set("envVars")}
            placeholder={"API_KEY=your_key_here\nBASE_URL=https://api.example.com"}
            rows={3}
          />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "النطاق" : "Scope"}</Label>
          <Select value={fields.scope} onChange={set("scope")}>
            <option value="project">{isAr ? "المشروع (.claude/settings.json)" : "Project (.claude/settings.json)"}</option>
            <option value="user">{isAr ? "المستخدم (~/.claude/settings.json)" : "User (~/.claude/settings.json)"}</option>
          </Select>
        </FieldRow>
      </div>
      <div>
        <PreviewHeader
          locale={locale}
          previewLabel={isAr ? "معاينة مباشرة" : "Live preview"}
          updatedLabel={isAr ? "تم تحديث المعاينة" : "Configuration preview updated"}
          copyText={code}
          onDownload={() => download("settings.json", code)}
          onReset={() => setFields(MCP_DEFAULTS)}
        />
        <CodeBlock code={code} filename={filename} lang="json" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Plugin Builder
───────────────────────────────────────────── */

const PLUGIN_DEFAULTS = {
  name: "",
  description: "",
  version: "0.1.0",
  commands: "",
  hookEvents: "",
};

function generatePluginJson(f: typeof PLUGIN_DEFAULTS): string {
  const name = f.name || "my-tool";
  const cmdList = f.commands
    ? f.commands.split(",").map((c) => c.trim()).filter(Boolean)
    : [];
  const hookList = f.hookEvents
    ? f.hookEvents.split(",").map((h) => h.trim()).filter(Boolean)
    : [];

  const claudePlugin: Record<string, unknown> = { version: 1 };
  if (cmdList.length) claudePlugin.commands = cmdList;
  if (hookList.length) claudePlugin.hooks = hookList;

  const obj: Record<string, unknown> = {
    name: `claude-plugin-${name}`,
    version: f.version || "0.1.0",
    description: f.description,
    type: "module",
    main: "index.js",
    claudePlugin,
  };
  return JSON.stringify(obj, null, 2);
}

function PluginBuilder({ locale = "en" }: { locale?: Locale }) {
  const [fields, setFields] = useState(PLUGIN_DEFAULTS);
  const set = (k: keyof typeof PLUGIN_DEFAULTS) => (v: string) =>
    setFields((f) => ({ ...f, [k]: v }));

  const code = generatePluginJson(fields);
  const isAr = locale === "ar";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <FieldRow>
          <Label required>{isAr ? "اسم الإضافة" : "Plugin Name"}</Label>
          <Input value={fields.name} onChange={set("name")} placeholder="my-tool" />
        </FieldRow>
        <FieldRow>
          <Label required>{isAr ? "الوصف" : "Description"}</Label>
          <Textarea value={fields.description} onChange={set("description")} placeholder="What this plugin provides…" rows={2} />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "الإصدار" : "Version"}</Label>
          <Input value={fields.version} onChange={set("version")} placeholder="0.1.0" />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "أوامر السلاش (مفصولة بفاصلة)" : "Slash Commands (comma-separated)"}</Label>
          <Input value={fields.commands} onChange={set("commands")} placeholder="deploy, lint, test" />
        </FieldRow>
        <FieldRow>
          <Label>{isAr ? "أحداث Hook (مفصولة بفاصلة)" : "Hook Events (comma-separated)"}</Label>
          <Input value={fields.hookEvents} onChange={set("hookEvents")} placeholder="PostToolUse, Stop" />
        </FieldRow>
      </div>
      <div>
        <PreviewHeader
          locale={locale}
          previewLabel={isAr ? "معاينة مباشرة" : "Live preview"}
          updatedLabel={isAr ? "تم تحديث المعاينة" : "Configuration preview updated"}
          copyText={code}
          onDownload={() => download("package.json", code)}
          onReset={() => setFields(PLUGIN_DEFAULTS)}
        />
        <CodeBlock code={code} filename="package.json" lang="json" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab definitions
───────────────────────────────────────────── */

type TabKey = "claude" | "skill" | "agent" | "hook" | "mcp" | "plugin";

interface TabDef {
  key: TabKey;
  label: string;
  labelAr: string;
  heading: string;
  headingAr: string;
  lede: string;
  ledeAr: string;
}

const TABS: TabDef[] = [
  {
    key: "claude",
    label: "CLAUDE.md",
    labelAr: "CLAUDE.md",
    heading: "CLAUDE.md Builder",
    headingAr: "منشئ CLAUDE.md",
    lede: "Generate a project CLAUDE.md file with conventions and instructions",
    ledeAr: "أنشئ ملف CLAUDE.md للمشروع مع الاصطلاحات والتعليمات",
  },
  {
    key: "skill",
    label: "Skill",
    labelAr: "مهارة",
    heading: "Skill Builder",
    headingAr: "منشئ المهارات",
    lede: "Create a custom slash command skill",
    ledeAr: "أنشئ مهارة أوامر سلاش مخصصة",
  },
  {
    key: "agent",
    label: "Agent",
    labelAr: "وكيل",
    heading: "Agent Builder",
    headingAr: "منشئ الوكلاء",
    lede: "Define a custom subagent for Claude Code",
    ledeAr: "عرِّف وكيلًا فرعيًا مخصصًا لـ Claude Code",
  },
  {
    key: "hook",
    label: "Hook",
    labelAr: "خطّاف",
    heading: "Hook Builder",
    headingAr: "منشئ الخطّافات",
    lede: "Create a hook that runs on Claude Code events",
    ledeAr: "أنشئ خطّافًا يعمل عند أحداث Claude Code",
  },
  {
    key: "mcp",
    label: "MCP Server",
    labelAr: "خادم MCP",
    heading: "MCP Server Builder",
    headingAr: "منشئ خوادم MCP",
    lede: "Configure a Model Context Protocol server connection",
    ledeAr: "اضبط اتصال خادم بروتوكول سياق النموذج",
  },
  {
    key: "plugin",
    label: "Plugin",
    labelAr: "إضافة",
    heading: "Plugin Builder",
    headingAr: "منشئ الإضافات",
    lede: "Scaffold a Claude Code plugin package",
    ledeAr: "أنشئ هيكل حزمة إضافة لـ Claude Code",
  },
];

/* ─────────────────────────────────────────────
   Main exported client component
───────────────────────────────────────────── */

export default function BuilderClient({ locale = "en" }: { locale?: Locale }) {
  const [active, setActive] = useState<TabKey>("claude");

  const tab = TABS.find((t) => t.key === active)!;
  const isAr = locale === "ar";

  const BUILDERS: Record<TabKey, React.ComponentType<{ locale?: Locale }>> = {
    claude: ClaudeMdBuilder,
    skill: SkillBuilder,
    agent: AgentBuilder,
    hook: HookBuilder,
    mcp: McpBuilder,
    plugin: PluginBuilder,
  };

  const ActiveBuilder = BUILDERS[active];

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-8 flex flex-wrap gap-1.5 rounded-xl border border-border bg-bg-subtle p-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`min-h-[40px] rounded-lg px-4 py-2 text-sm font-medium transition ${
              active === t.key
                ? "bg-card border border-border shadow-[var(--shadow-sm)] text-fg"
                : "text-fg-muted hover:text-fg hover:bg-card/50"
            }`}
          >
            {isAr ? t.labelAr : t.label}
          </button>
        ))}
      </div>

      {/* Active builder card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-fg">{isAr ? tab.headingAr : tab.heading}</h2>
          <p className="mt-1 text-sm text-fg-muted">{isAr ? tab.ledeAr : tab.lede}</p>
        </div>
        <ActiveBuilder locale={locale} />
      </div>
    </div>
  );
}
