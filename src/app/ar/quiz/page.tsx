import { Container, PageHeader } from "@/components/ui";
import Reveal from "@/components/Reveal";
import ArQuizClient from "./ArQuizClient";

export const metadata = {
  title: "اكتشف مستواك",
  description:
    "اختبار سريع لتحديد مستواك في Claude Code والحصول على خطة تعلّم مخصصة.",
};

export default function ArQuizPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          eyebrow="تقييم ذاتي"
          title="اعرف مستواك"
          lede="جاوب على ١٠ أسئلة سريعة عن تجربتك مع Claude Code واحصل على توصية تعلّم مخصصة."
        />

        <Reveal className="pb-20">
          <ArQuizClient />
        </Reveal>
      </Container>
    </main>
  );
}
