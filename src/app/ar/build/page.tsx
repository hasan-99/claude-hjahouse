import { Container, PageHeader } from "@/components/ui";
import Reveal from "@/components/Reveal";
import BuilderClient from "@/app/build/BuilderClient";

export const metadata = {
  title: "بناء الإعدادات",
  description: "أنشئ ملفات إعدادات Claude Code باستخدام أدوات بناء مستقلة",
};

export default function ArBuildPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          eyebrow="توليد"
          title="منشئ الإعدادات"
          lede="أنشئ ملفات إعدادات Claude Code باستخدام أدوات بناء مستقلة — من CLAUDE.md والـ Hooks والمهارات وخوادم MCP وحزم الإضافات — وانسخها مباشرةً إلى مشروعك."
        />

        <Reveal delay={70}>
          <BuilderClient locale="ar" />
        </Reveal>

        <div className="h-20" />
      </Container>
    </main>
  );
}
