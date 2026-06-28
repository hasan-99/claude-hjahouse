import { Container, PageHeader } from "@/components/ui";
import RoadmapClient from "@/app/roadmap/Client";

export const metadata = {
  title: "خارطة التعلّم",
  description:
    "تتبع تقدمك عبر 12 وحدة تعليمية لـ Claude Code من المبتدئ للمتقدم.",
};

export default function ArRoadmapPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          eyebrow="رحلتك التعليمية"
          title="خارطة التعلّم"
          lede="تتبع تقدمك عبر 12 وحدة تعليمية لـ Claude Code — من التثبيت الأول وصولًا إلى الـ plugins الاحترافية."
        />
        <RoadmapClient locale="ar" />
      </Container>
    </main>
  );
}
