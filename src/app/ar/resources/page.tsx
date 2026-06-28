import Link from "next/link";
import { Container, PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { Callout } from "@/components/content";
import CodeBlock from "@/components/CodeBlock";
import { localize } from "@/lib/site";

/* ─── data ─────────────────────────────────────────────────────────────── */

const templatePacks = [
  {
    id: "starter",
    badge: "أساسي",
    title: "حزمة القوالب الأساسية",
    subtitle: "الملفات الأساسية لإعداد Claude Code بسرعة في مشروع جديد.",
    size: "~1 KB",
    files: [
      { icon: "📄", name: "CLAUDE.md", desc: "قواعد المشروع وتوقعات المراجعة" },
      { icon: "⚓", name: "pre-commit hook", desc: "مثال إعداد hook للتحقق قبل الـ commit" },
      { icon: "⚡", name: "skill-starter.md", desc: "بداية تعريف skill لسير عمل قابل للتكرار" },
      { icon: "📘", name: "README.md", desc: "ملف README بإرشادات الإعداد" },
    ],
    href: "https://claude.hjahouse.me/downloads/claude-code-starter-templates.zip",
    accent: "bg-accent-soft",
  },
  {
    id: "advanced",
    badge: "متقدم",
    title: "حزمة القوالب المتقدمة",
    subtitle: "قوالب موسّعة لسير عمل متعدد الأدوات وتكاملات MCP واتفاقيات الفريق.",
    size: "~1.1 KB",
    files: [
      { icon: "🔌", name: "mcp-config.json", desc: "مثال إعداد MCP server" },
      { icon: "📦", name: "plugin/index.ts", desc: "هيكل plugin بنقطة دخول TypeScript" },
      { icon: "🤖", name: "agent.md", desc: "إعداد agent للأتمتة المتخصصة" },
      { icon: "🔗", name: "multi-hook.json", desc: "مثال pipeline متعدد الـ hooks" },
    ],
    href: "https://claude.hjahouse.me/downloads/claude-code-advanced-templates.zip",
    accent: "bg-bg-subtle",
  },
];

const officialLinks = [
  {
    href: "https://docs.anthropic.com/en/docs/claude-code",
    title: "توثيق Claude Code",
    desc: "التوثيق الرسمي من Anthropic للتثبيت وسير العمل واستخدام الأدوات.",
    tag: "docs.anthropic.com",
  },
  {
    href: "https://docs.anthropic.com/",
    title: "توثيق Anthropic API",
    desc: "مرجع لبناء أدوات وتكاملات تعمل بـ Claude.",
    tag: "docs.anthropic.com",
  },
  {
    href: "https://github.com/anthropics/claude-code",
    title: "Claude Code على GitHub",
    desc: "تابع الـ issues والإصدارات وتفاصيل التنفيذ في الـ repo العام.",
    tag: "github.com",
  },
];

const toolLinks = [
  {
    href: "https://modelcontextprotocol.io/",
    title: "Model Context Protocol",
    desc: "توثيق البروتوكول وأمثلة لربط Claude بأدوات وبيانات خارجية.",
    tag: "modelcontextprotocol.io",
  },
];

const communityLinks = [
  {
    href: "https://discord.gg/anthropic",
    title: "Anthropic Discord",
    desc: "نقاشات مجتمعية ودعم وأمثلة من مطورين آخرين يستخدمون Claude.",
    tag: "discord.gg",
  },
  {
    href: "https://github.com/hesreallyhim/awesome-claude-code",
    title: "Awesome Claude Code",
    desc: "قائمة منسّقة من موارد المجتمع والـ prompts والتكاملات.",
    tag: "github.com",
  },
];

const claudeMdSample = `# قواعد المشروع

## توقعات المراجعة
- اقرأ الملف دائماً قبل التعديل
- افضّل التعديلات الدقيقة على إعادة الكتابة الكاملة
- اشرح السبب وراء الخيارات غير الواضحة

## الصلاحيات
- Bash: git, npm, tsc, eslint
- Read: **/*
- Write: src/**

## سياق المشروع
Stack: Next.js App Router, TypeScript, Tailwind
Database: Supabase (RLS على كل جدول)`.trim();

/* ─── sub-components ──────────────────────────────────────────────────── */

function ExternalLink({
  href,
  title,
  desc,
  tag,
}: {
  href: string;
  title: string;
  desc: string;
  tag: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-md)]"
    >
      {/* سهم خارجي */}
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-subtle text-fg-subtle transition group-hover:border-accent/40 group-hover:text-accent">
        <svg
          className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-medium text-fg transition group-hover:text-accent">
            {title}
          </span>
          <span className="font-mono text-[11px] text-fg-faint">{tag}</span>
        </div>
        <p className="mt-1 text-sm text-fg-subtle">{desc}</p>
      </div>
    </Link>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-2xl font-semibold text-fg sm:text-3xl">{children}</h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-base font-semibold uppercase tracking-wider text-fg-muted">
      {children}
    </h3>
  );
}

/* ─── page ────────────────────────────────────────────────────────────── */

export default function ArResourcesPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          eyebrow="الموارد"
          title="مصادر"
          lede="حمّل ملفات بداية جاهزة للاستخدام، ثم تابع الاستكشاف مع أفضل المراجع الرسمية ومراجع المجتمع لـ Claude Code."
        />

        {/* ── حزم القوالب ─────────────────────────────────────────────── */}
        <section className="mb-20">
          <Reveal>
            <SectionHeading>حزم القوالب</SectionHeading>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {templatePacks.map((pack, i) => (
              <Reveal key={pack.id} delay={i * 70}>
                <Card className="flex h-full flex-col transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-md)]">
                  {/* رأس البطاقة */}
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <span
                        className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent ${pack.accent}`}
                      >
                        {pack.badge}
                      </span>
                      <h3 className="text-lg font-semibold text-fg">{pack.title}</h3>
                      <p className="mt-1 text-sm text-fg-subtle">{pack.subtitle}</p>
                    </div>
                    <span className="shrink-0 rounded border border-border px-2 py-0.5 font-mono text-xs text-fg-faint">
                      {pack.size}
                    </span>
                  </div>

                  {/* قائمة الملفات */}
                  <ul className="mb-6 space-y-2.5">
                    {pack.files.map((f) => (
                      <li key={f.name} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 text-base leading-none">{f.icon}</span>
                        <div>
                          <span className="font-mono text-[13px] font-medium text-fg">
                            {f.name}
                          </span>
                          <span className="mr-2 text-fg-subtle">{f.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* زر التحميل */}
                  <div className="mt-auto">
                    <Link
                      href={pack.href}
                      className="group inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:bg-accent-hover"
                    >
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      تحميل الحزمة
                    </Link>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* معاينة CLAUDE.md */}
          <Reveal delay={140}>
            <div className="mt-8">
              <Callout tone="tip" title="ما الذي يحتويه CLAUDE.md؟">
                كل حزمة تتضمن ملف{" "}
                <code className="rounded bg-bg-muted px-1 font-mono text-xs text-fg">
                  CLAUDE.md
                </code>{" "}
                جاهز للتعديل يقرأه Claude عند بدء الجلسة. خصّص قسم القواعد لفريقك قبل الـ commit.
              </Callout>
              <CodeBlock
                code={claudeMdSample}
                filename="CLAUDE.md"
                lang="markdown"
                className="mt-4"
              />
            </div>
          </Reveal>
        </section>

        {/* ── المصادر الخارجية ─────────────────────────────────────────── */}
        <section className="mb-20">
          <Reveal>
            <SectionHeading>مصادر خارجية</SectionHeading>
          </Reveal>

          {/* التوثيق الرسمي */}
          <Reveal delay={0}>
            <SubHeading>التوثيق الرسمي</SubHeading>
          </Reveal>
          <div className="mb-10 grid gap-4">
            {officialLinks.map((link, i) => (
              <Reveal key={link.href} delay={i * 70}>
                <ExternalLink {...link} />
              </Reveal>
            ))}
          </div>

          {/* الأدوات */}
          <Reveal delay={0}>
            <SubHeading>الأدوات</SubHeading>
          </Reveal>
          <div className="mb-10 grid gap-4">
            {toolLinks.map((link, i) => (
              <Reveal key={link.href} delay={i * 70}>
                <ExternalLink {...link} />
              </Reveal>
            ))}
          </div>

          {/* المجتمع */}
          <Reveal delay={0}>
            <SubHeading>المجتمع</SubHeading>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {communityLinks.map((link, i) => (
              <Reveal key={link.href} delay={i * 70}>
                <ExternalLink {...link} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── شريط الدعوة للبدء ──────────────────────────────────────── */}
        <Reveal>
          <div className="mb-16 flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-fg">هل أنت مستعد للبناء؟</p>
              <p className="mt-0.5 text-sm text-fg-subtle">
                حمّل حزمة البداية، ضعها في مشروعك، ثم شغّل{" "}
                <code className="rounded bg-bg-muted px-1 font-mono text-[12px] text-fg">
                  claude
                </code>{" "}
                لتبدأ.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={localize("/learn", "ar")}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg transition hover:border-accent/40 hover:text-accent"
              >
                تصفّح الوحدات
              </Link>
              <Link
                href={localize("/playground", "ar")}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:bg-accent-hover"
              >
                افتح الساحة
                <svg
                  className="h-3.5 w-3.5 rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
