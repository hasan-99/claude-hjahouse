import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageHeader, LevelBadge, ArrowLink } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { MODULES, type Level, localize } from "@/lib/site";

/* ---------------------------------------------------------------------------
   صفحات نتائج الاختبار العربية — /ar/quiz/result/beginner|intermediate|advanced
--------------------------------------------------------------------------- */

type Params = Promise<{ level: string }>;

export function generateStaticParams() {
  return [
    { level: "beginner" },
    { level: "intermediate" },
    { level: "advanced" },
  ];
}

export async function generateMetadata({ params }: { params: Params }) {
  const { level } = await params;
  const levelLabels: Record<string, string> = {
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
  };
  const label = levelLabels[level] ?? level;
  return {
    title: `حصلت على مستوى ${label} في تقييم Claude Code`,
    description: `نتيجتك في تقييم Claude Code: مستوى ${label}. إليك خطة التعلّم المخصصة لك.`,
  };
}

/* ── محتوى كل مستوى ── */
const LEVEL_META: Record<
  Level,
  {
    emoji: string;
    headline: string;
    summary: string;
    encouragement: string;
    color: string;
    badgeCls: string;
    modules: string[];
    scoreRange: string;
  }
> = {
  beginner: {
    emoji: "🌱",
    headline: "لسه في البداية — الوقت المثالي لبناء أساسات قوية",
    summary:
      "Claude Code عنده الكتير اللي يقدمه — وأحسن طريقة هي إنك تبدأ من الأساسيات. الوحدات دي هتاخدك من التثبيت لأول مشروع حقيقي في حوالي ساعتين.",
    encouragement:
      "كلنا بدأنا من هنا. الأساسيات اللي هتتعلمها دلوقتي هتخلّي كل حاجة تانية أوضح وأسرع.",
    color: "text-beginner",
    badgeCls: "bg-beginner/10 border-beginner/30",
    modules: ["getting-started", "slash-commands", "memory", "project-setup", "commands"],
    scoreRange: "٠ – ٦",
  },
  intermediate: {
    emoji: "💪",
    headline: "عارف الأساسيات — جاهز تكتشف إمكانيات Claude Code الأعمق",
    summary:
      "Claude Code شتغّله وفاهم التدفق الأساسي. الخطوة الجاية هي التخصيص: المهارات تساعدك تبني أوامر قابلة للإعادة، والـ hooks تؤتمت بوابات الجودة، والـ MCP يربط Claude بكل stack-ك.",
    encouragement:
      "المستوى المتوسط هو المكان اللي Claude Code يبدأ يتحوّل لقوة حقيقية فيه. وحدات المهارات والـ hooks مغيّرة للعبة.",
    color: "text-intermediate",
    badgeCls: "bg-intermediate/10 border-intermediate/30",
    modules: ["skills", "hooks", "mcp", "subagents"],
    scoreRange: "٧ – ١٤",
  },
  advanced: {
    emoji: "🚀",
    headline: "أنت power user — حان الوقت تتقن الميزات المتقدمة وتبني plugins",
    summary:
      "واضح إنك عارف طريقك في Claude Code. تعمّق في المحتوى المتقدم: الاستخدام الـ headless/CI، تأليف الـ plugins، وتنسيق سير العمل الإنتاجي على نطاق واسع.",
    encouragement:
      "الوحدات المتقدمة بتغطي حاجات معظم مستخدمي Claude Code ما لمسوهاش. أنت في المكان الصح.",
    color: "text-advanced",
    badgeCls: "bg-advanced/10 border-advanced/30",
    modules: ["advanced-features", "workflows", "plugins"],
    scoreRange: "١٥ – ٢٠",
  },
};

export default async function ArResultPage({ params }: { params: Params }) {
  const { level } = await params;

  if (!["beginner", "intermediate", "advanced"].includes(level)) {
    notFound();
  }

  const meta = LEVEL_META[level as Level];
  const recommended = MODULES.filter((m) => meta.modules.includes(m.slug));

  return (
    <main id="main-content">
      <Container>
        <PageHeader
          eyebrow="نتيجتك"
          title="اعرف مستواك"
          lede="إليك خطة التعلّم المخصصة لك في Claude Code."
        />

        {/* بطاقة النتيجة الرئيسية */}
        <Reveal className="mb-10">
          <div className={`rounded-2xl border p-8 ${meta.badgeCls}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-card text-4xl shadow-[var(--shadow-sm)]">
                {meta.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <span className={`text-2xl font-bold ${meta.color}`}>
                    {level === "beginner" ? "مبتدئ" : level === "intermediate" ? "متوسط" : "متقدم"}
                  </span>
                  <LevelBadge level={level as Level} locale="ar" />
                </div>
                <h2 className="text-xl font-semibold text-fg">
                  حصلت على مستوى{" "}
                  <span className={meta.color}>
                    {level === "beginner" ? "مبتدئ" : level === "intermediate" ? "متوسط" : "متقدم"}
                  </span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{meta.summary}</p>
              </div>
            </div>

            {/* نطاق الدرجات */}
            <div className="mt-5 rounded-lg border border-border bg-card/60 px-4 py-3">
              <p className="text-sm text-fg-muted">
                <span className="font-medium text-fg">نطاق درجات هذا المستوى: </span>
                <span className="font-mono text-accent">{meta.scoreRange}</span>
                {" "}نقطة من أصل ٢٠.
              </p>
            </div>
          </div>
        </Reveal>

        {/* رسالة تشجيعية */}
        <Reveal delay={70} className="mb-10">
          <div className="rounded-xl border border-border-strong bg-bg-subtle px-5 py-4 text-sm text-fg-muted">
            <span className="ml-2 text-accent">✦</span>
            {meta.encouragement}
          </div>
        </Reveal>

        {/* الوحدات الموصى بها */}
        <Reveal delay={140} className="mb-4">
          <h3 className="text-xl font-semibold text-fg">الوحدات الموصى بها لك</h3>
          <p className="mt-1 text-sm text-fg-muted">
            ابدأ بهذه الوحدات — مرتّبة لتبني كل واحدة على السابقة.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-6">
          {recommended.map((m, i) => (
            <Reveal key={m.slug} delay={210 + i * 70}>
              <Link
                href={localize(`/learn/${m.slug}`, "ar")}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-mono text-xs text-fg-subtle">
                    {String(m.index).padStart(2, "0")}
                  </span>
                  <LevelBadge level={m.level} locale="ar" />
                </div>
                <h4 className="mb-2 text-base font-semibold text-fg transition group-hover:text-accent">
                  {m.titleAr}
                </h4>
                <p className="flex-1 text-sm leading-relaxed text-fg-muted">{m.summary}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="font-mono text-xs text-fg-subtle">{m.durationAr}</span>
                  <svg
                    className="h-4 w-4 rotate-180 text-fg-subtle transition-transform group-hover:-translate-x-0.5 group-hover:text-accent"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* روابط الإجراءات */}
        <Reveal
          delay={350}
          className="mb-20 flex flex-col items-start gap-4 sm:flex-row sm:items-center pt-4 border-t border-border"
        >
          <ArrowLink href={localize("/learn", "ar")}>تصفّح جميع الوحدات</ArrowLink>
          <ArrowLink href={localize("/roadmap", "ar")}>عرض خارطة التعلّم ←</ArrowLink>
          <Link
            href={localize("/quiz", "ar")}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg-muted transition hover:border-border-strong hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            أعِد الاختبار
          </Link>
        </Reveal>
      </Container>
    </main>
  );
}
