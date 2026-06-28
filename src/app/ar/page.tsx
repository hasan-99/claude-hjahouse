import Link from "next/link";
import Terminal, { type Step } from "@/components/Terminal";
import Reveal from "@/components/Reveal";
import { Container, ArrowLink, LevelBadge } from "@/components/ui";
import { MODULES, localize } from "@/lib/site";

const HERO_SCRIPT: Step[] = [
  { t: "print", text: "أهلاً بك في Claude Code! اكتب أمراً أو /help للبدء.", tone: "system" },
  { t: "wait", ms: 500 },
  { t: "type", text: "/help", tone: "user" },
  {
    t: "out",
    lines: [
      { text: "Available commands:", tone: "muted" },
      { text: "  /help        Show available commands", tone: "blue" },
      { text: "  /clear       Clear conversation history", tone: "blue" },
      { text: "  /model       Switch the active model", tone: "blue" },
      { text: "  /review      Review code changes", tone: "blue" },
      { text: "  /init        Generate a CLAUDE.md file", tone: "blue" },
    ],
  },
  { t: "wait", ms: 900 },
  { t: "type", text: "أنشئ مكوّن React لقائمة مهام", tone: "user" },
  {
    t: "out",
    lines: [
      { text: "✦ جاري التفكير…", tone: "amber" },
      { text: "● تم إنشاء TodoList.tsx مع إضافة وتبديل وحذف", tone: "green" },
      { text: "  + 42 سطراً · useState · checkboxes متاحة", tone: "muted" },
      { text: "تم — جاهز للإضافة إلى تطبيقك.", tone: "default" },
    ],
    gap: 120,
  },
  { t: "wait", ms: 1600 },
];

const FEATURES = [
  {
    title: "جرّب قبل ما تثبّت",
    body: "تدرّب على الـ slash commands والـ hooks والـ skills في terminal simulator في المتصفح. من غير setup ولا API key.",
  },
  {
    title: "ابنِ إعدادات حقيقية",
    body: "نماذج تفاعلية تولّد CLAUDE.md والـ hooks وإعدادات الـ plugins — جاهزة تنسخها لمشروعك مباشرة.",
  },
  {
    title: "تأكد إنك فاهم",
    body: "كل وحدة بتنتهي باختبار. لو غلطت بتاخد الشرح، مش بس الإجابة.",
  },
];

const EXPLORE = [
  {
    title: "الساحة التجريبية",
    href: localize("/playground", "ar"),
    body: "تدرّب على الأوامر في بيئة terminal كاملة ومخصصة.",
  },
  {
    title: "منشئ الإعدادات",
    href: localize("/build", "ar"),
    body: "أنشئ CLAUDE.md والمهارات والوكلاء والـ hooks وخوادم MCP والإضافات.",
  },
  {
    title: "الورقة المرجعية",
    href: localize("/reference", "ar"),
    body: "قائمة مختصرة قابلة للطباعة بالأوامر والاختصارات والملفات الأكثر استخداماً.",
  },
  {
    title: "فهرس الميزات",
    href: localize("/catalog", "ar"),
    body: "ابحث في قائمة ميزات Claude Code الكاملة حسب النوع والمستوى والفئة.",
  },
  {
    title: "المصادر",
    href: localize("/resources", "ar"),
    body: "حزم قوالب وأدلة خارجية وروابط من المجتمع.",
  },
];

export default function ArabicHome() {
  const basics = MODULES.slice(0, 5);

  return (
    <Container className="pb-10">
      {/* Hero */}
      <section className="grid items-center gap-10 py-14 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:py-20">
        <Reveal>
          <h1 className="text-[2.6rem] font-semibold leading-[1.12] sm:text-[3.4rem]">
            تعلّم Claude Code
            <br />
            <span className="text-fg-subtle">بالممارسة، مش القراءة.</span>
          </h1>
          <p className="mt-4 text-sm font-medium text-fg-faint">بواسطة حسن الجاهوش</p>
          <p className="mt-5 max-w-md text-lg text-fg-muted">
            12 وحدة تفاعلية مع terminal simulators ومُنشئ إعدادات واختبارات. من
            غير أي إعداد.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={localize("/quiz", "ar")}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-[var(--shadow-md)] transition hover:bg-accent-hover"
            >
              اكتشف مستواك
            </Link>
            <Link
              href={localize("/learn/slash-commands", "ar")}
              className="rounded-lg border border-border-strong bg-bg-subtle px-5 py-2.5 text-sm font-semibold text-fg-muted transition hover:border-accent/40 hover:text-fg"
            >
              يلا نبدأ
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <Terminal
            script={HERO_SCRIPT}
            ariaLabel="عرض تجريبي تلقائي لـ Claude Code"
          />
        </Reveal>
      </section>

      {/* Feature row */}
      <section className="grid gap-8 border-t border-border py-12 sm:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 90}>
            <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-md bg-accent-soft text-accent-soft-fg">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-lg">{f.title}</h3>
            <p className="mt-2 text-sm text-fg-subtle">{f.body}</p>
          </Reveal>
        ))}
      </section>

      {/* ابدأ بالأساسيات */}
      <section className="border-t border-border py-14">
        <Reveal>
          <h2 className="text-2xl">ابدأ بالأساسيات</h2>
          <p className="mt-2 text-fg-subtle">
            12 وحدة من المبتدئ للمتقدم. أغلب الناس بتبدأ من هنا.
          </p>
        </Reveal>
        <div className="mt-8 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {basics.map((m, i) => (
            <Reveal key={m.slug} delay={i * 60}>
              <Link
                href={localize(`/learn/${m.slug}`, "ar")}
                className="group flex items-center gap-4 px-5 py-4 transition hover:bg-card-hover"
              >
                <span className="font-mono text-sm text-fg-faint">{m.index}</span>
                <span className="flex-1">
                  <span className="font-medium text-fg">{m.titleAr}</span>
                  <span className="mr-2 text-sm text-fg-faint">{m.durationAr}</span>
                </span>
                <LevelBadge level={m.level} locale="ar" />
                {/* RTL: arrow points left */}
                <svg
                  className="h-4 w-4 rotate-180 text-fg-faint transition-transform group-hover:-translate-x-0.5 group-hover:text-accent"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-6">
          <ArrowLink href={localize("/learn", "ar")}>عرض كل الوحدات الـ 12</ArrowLink>
        </div>
      </section>

      {/* استكشف */}
      <section className="border-t border-border py-14">
        <Reveal>
          <h2 className="text-2xl">استكشف</h2>
          <p className="mt-2 text-fg-subtle">
            أدوات للتدرب والمراجعة وتعميق الفهم.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE.map((c, i) => (
            <Reveal key={c.href} delay={i * 70}>
              <Link
                href={c.href}
                className="group block h-full rounded-xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-lg)]"
              >
                <h3 className="flex items-center justify-between text-lg">
                  {c.title}
                  {/* RTL: arrow points left/up */}
                  <svg
                    className="h-4 w-4 text-fg-faint transition group-hover:-translate-x-0.5 group-hover:text-accent"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 7 7 17M17 7H7v10" />
                  </svg>
                </h3>
                <p className="mt-2 text-sm text-fg-subtle">{c.body}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </Container>
  );
}
