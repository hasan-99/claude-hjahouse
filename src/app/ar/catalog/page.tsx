import { Container, PageHeader, ArrowLink } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { localize } from "@/lib/site";
import CatalogClient from "@/app/catalog/CatalogClient";

export const metadata = {
  title: "دليل الميزات",
  description:
    "ابحث في دليل ميزات Claude Code الكامل عبر الأوامر والـ hooks والـ skills والأدوات والإعدادات والملفات.",
};

export default function ArCatalogPage() {
  return (
    <main id="main-content">
      <Container>
        {/* Navigate eyebrow — matches the original Arabic */}
        <Reveal className="pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-subtle">
            التنقل
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            انتقل للتعلّم أو التجربة أو المراجع.
          </p>
        </Reveal>

        <PageHeader
          title="دليل الميزات"
          lede="ابحث في قائمة ميزات Claude Code الكاملة لما تحتاج تلاقي مكان أمر أو hook أو أداة أو إعداد."
        />

        {/* Cheat-sheet nudge — mirrors original Arabic */}
        <Reveal delay={80} className="mb-10 -mt-4">
          <p className="text-sm text-fg-muted">
            محتاج النسخة القصيرة القابلة للطباعة؟{" "}
            <ArrowLink href={localize("/reference", "ar")}>
              افتح المرجع السريع
            </ArrowLink>
          </p>
        </Reveal>

        {/* Searchable, filterable catalog — reuse the English interactive component with AR locale */}
        <CatalogClient locale="ar" />
      </Container>
    </main>
  );
}
