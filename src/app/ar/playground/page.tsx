import { Container, PageHeader } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { Callout } from "@/components/content";
import PlaygroundClient from "@/app/playground/PlaygroundClient";

export const metadata = {
  title: "ساحة التجربة",
  description:
    "تدرّب على أوامر Claude Code في terminal sandbox مخصصة بالحجم الكامل. لا إعداد مسبق، لا مفتاح API.",
};

export default function ArPlaygroundPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          eyebrow="ساحة تجريبية"
          title="تدريب في الـ Terminal"
          lede="جرّب أوامر Claude Code بالكتابة الحرة أو تابع التسلسل الموجّه من غير ما تسيب الـ sandbox."
        />

        {/* وضع التشغيل */}
        <Reveal delay={70}>
          <Callout tone="tip" title="وضعان متاحان">
            <strong>كتابة حرة</strong> — terminal مفتوح تكتب فيه أي أمر أو استفسار بلغة طبيعية ويرد عليك Claude.{" "}
            <strong>موجَّه</strong> — جولة خطوة بخطوة تأخذك عبر أهم أوامر Claude Code، مثالية للمبتدئين.
          </Callout>
        </Reveal>

        {/* الـ Terminal التفاعلي */}
        <Reveal delay={140} className="mt-6">
          <PlaygroundClient locale="ar" />
        </Reveal>
      </Container>
    </main>
  );
}
