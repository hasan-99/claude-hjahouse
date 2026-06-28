import Link from "next/link";
import { Container, PageHeader, LevelBadge } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { MODULES, localize } from "@/lib/site";

export const metadata = {
  title: "تعلّم Claude Code",
  description:
    "12 وحدة تفاعلية من المبتدئ للمتقدم. ابدأ رحلتك مع Claude Code.",
};

/* Arabic summaries per module (localized, faithful to original) */
const summariesAr: Record<string, string> = {
  "getting-started":
    "ما هو Claude Code، كيف تثبّته، وأول جلسة لك في الطرفية.",
  "slash-commands":
    "اكتب / في سطر الأوامر للوصول إلى الأوامر المدمجة. فلترها، شغّلها، وسلسلها معاً.",
  memory:
    "كيف يتذكر Claude Code السياق بين الجلسات عبر ملفات CLAUDE.md والذاكرة التلقائية.",
  "project-setup":
    "هيّئ Claude Code لمشروع جديد أو قائم باستخدام CLAUDE.md والصلاحيات والإعدادات.",
  commands:
    "مستوى التفكير، الوضع المطوّل، اختيار النموذج، والأوامر التي تستخدمها يومياً.",
  skills:
    "قدرات قابلة لإعادة الاستخدام يكتشفها Claude ويستخدمها تلقائياً بحسب السياق.",
  hooks:
    "شغّل أوامر shell عند أحداث دورة الحياة — المطابقات، صيغة exec، وبوابات التحقق.",
  mcp:
    "بروتوكول Model Context يمنح Claude وصولاً مباشراً للخدمات الخارجية في الوقت الفعلي.",
  subagents:
    "فوّض المهام إلى وكلاء متخصصين لديهم سياقاتهم الخاصة ونطاقات أدواتهم.",
  "advanced-features":
    "شغّل Claude Code برمجياً عبر claude -p، البيئات المعزولة، الصلاحيات، والإعدادات.",
  workflows:
    "ابنِ تكاملات CI/CD، مهام مجدولة، وتدفقات أتمتة متعددة الخطوات.",
  plugins:
    "حزّم الأوامر والـ hooks والمهارات والوكلاء في إضافات قابلة للتثبيت.",
};

export default function ArLearnPage() {
  return (
    <main id="main-content">
      <Container>
        {/* Navigate intro line — mirrors original Arabic */}
        <Reveal className="pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-subtle">
            التنقل
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            انتقل للتعلّم أو التجربة أو المراجع.
          </p>
        </Reveal>

        <PageHeader
          title="وحدات التعلّم"
          lede="12 وحدة تأخذك من أول أمر slash لبناء plugins جاهزة للإنتاج. كل وحدة فيها terminals تفاعلية ومُنشئ إعدادات واختبارات."
        />

        {/* Module grid */}
        <div className="pb-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, i) => (
            <Reveal key={m.slug} delay={i * 60}>
              <Link
                href={localize(`/learn/${m.slug}`, "ar")}
                className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-md)]"
              >
                {/* Big faint index number — left side in RTL */}
                <span
                  aria-hidden="true"
                  className="absolute left-5 top-4 font-serif text-6xl font-bold leading-none text-fg-faint select-none"
                >
                  {m.index}
                </span>

                {/* Title */}
                <h2 className="mt-2 pl-10 text-xl font-semibold leading-snug text-fg transition group-hover:text-accent">
                  {m.titleAr}
                </h2>

                {/* Arabic summary */}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
                  {summariesAr[m.slug] ?? m.summary}
                </p>

                {/* Footer row */}
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <LevelBadge level={m.level} locale="ar" />
                  <span className="font-mono text-xs text-fg-subtle">
                    {m.durationAr}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </main>
  );
}
