import { Container, PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { Callout } from "@/components/content";
import {
  FeedbackBoard,
  SubmitForm,
  type FeedbackItem,
  type FilterTabLabels,
  type SubmitFormStrings,
  type FeedbackStatus,
} from "@/app/feedback/Client";

/* ---------------------------------------------------------------------------
   Arabic Feedback page — آراء المجتمع
   Mirrors https://claude.hjahouse.me/ar/feedback faithfully.
   Reuses the English interactive Client components (FeedbackBoard, SubmitForm)
   for identical behaviour; only page-level copy is translated to Arabic.
--------------------------------------------------------------------------- */

const ITEMS: FeedbackItem[] = [
  // قيد المراجعة
  {
    id: 93,
    status: "Reviewing",
    title: "اضافة بسيطة",
    preview:
      "أنا نفسي الموقع يكون فيه اضافتين: يكون مبسط أكثر وأكثر، ويكون جواه تعريف بإيه ده وإيه ده. واعتبر إن في ناس كتير محتاجين شرح أبسط.",
    upvotes: 3,
  },
  {
    id: 32,
    status: "Reviewing",
    title: "These slash commands do not work in Claude Code",
    preview:
      "The slash commands listed in the module don't actually work when typed into Claude Code — they're unrecognized or produce no output.",
    upvotes: 5,
  },
  {
    id: 29,
    status: "Reviewing",
    title: "Typo: extra quote mark",
    preview:
      'There\'s an extra quote mark here: "Dynamic Context and Invocation Control — The ! command" syntax.',
    upvotes: 2,
  },
  {
    id: 24,
    status: "Reviewing",
    tag: "Feature",
    title: "وصف الـ slash command ترتيبه غير مناسب",
    preview:
      "اجعل /command في بداية كل سطر ثم انتقل إلى الوصف. اجعل دائماً /command أول شيء في السطر لسهولة القراءة.",
    upvotes: 4,
  },

  // قيد البناء
  {
    id: 162,
    status: "Building",
    tag: "Bug",
    title: "Left-side nav arrow button",
    preview:
      "When the left side nav is collapsed, the arrow to expand it at the top is not very visible due to the dim/dark theme of the sidebar.",
    upvotes: 8,
  },
  {
    id: 87,
    status: "Building",
    title: "Module header UI bug in /learn/getting-started/",
    preview:
      "Header styling for the `getting-started` module doesn't match the other modules — font sizes and spacing are off.",
    upvotes: 6,
  },

  // تم الإطلاق
  {
    id: 25,
    status: "Shipped",
    tag: "Bug",
    title: "Some issues in the Slash Commands module",
    preview:
      "In the \"Try it yourself\" area, if possible it would be great if the command actually works, or at least shows a clear message that it's a simulation.",
    upvotes: 11,
  },
  {
    id: 22,
    status: "Shipped",
    tag: "Bug",
    title: "Command not recognized. Try /help to see available commands.",
    preview:
      'Got "Command not recognized. Try /help to see available commands." after inputting "/allowed-tools" in the playground.',
    upvotes: 9,
  },
  {
    id: 21,
    status: "Shipped",
    tag: "Bug",
    title: "ملاحظة بخصوص العربي",
    preview:
      "الجزء الخاص بـ «اختبر فهمك» بيجيب أسئلة غير متعلقة بالوحدة اللي إحنا فيها في اللغة العربية، في حين لما بحوله للإنجليزي بيبقى صح.",
    upvotes: 7,
  },
  {
    id: 20,
    status: "Shipped",
    tag: "Feature",
    title: "Let user determine when to move to next question on quiz",
    preview:
      "The explanation once the answer is given is useful to read, but I don't get to finish reading it before it auto-advances.",
    upvotes: 14,
  },
  {
    id: 18,
    status: "Shipped",
    tag: "Bug",
    title: "RTL Layout Issues in Arabic Version",
    preview:
      "There is a structural issue with the RTL (right-to-left) layout implementation in the Arabic version of the site — elements overlap and padding is mirrored incorrectly.",
    upvotes: 12,
  },
  {
    id: 17,
    status: "Shipped",
    title: "Jatin — Language is messed up for this module",
    preview:
      "Language is messed up for this module, not in English. The module content appears in the wrong language on reload.",
    upvotes: 5,
  },
  {
    id: 14,
    status: "Shipped",
    tag: "Bug",
    title: "Path to local scope claude.json is wrong",
    preview:
      "MCP configurations have three scopes. Local scope (~/.claude.json under your project…) — the path listed is incorrect.",
    upvotes: 10,
  },
  {
    id: 9,
    status: "Shipped",
    tag: "Bug",
    title: "Tests for modules contain questions not covered",
    preview:
      "This module's knowledge-check test starts asking questions about '#' which is not covered in the read-through at all.",
    upvotes: 16,
  },
];

const STATUS_ORDER = ["Reviewing", "Planned", "Building", "Shipped"] as const;

/** Arabic labels/descriptions for each pipeline status */
const statusMeta: Record<
  string,
  { label: string; description: string; color: string; icon: string }
> = {
  Reviewing: {
    label: "قيد المراجعة",
    description: "تقارير نحن بصدد دراستها بنشاط.",
    color: "text-accent",
    icon: "◎",
  },
  Planned: {
    label: "مخطط له",
    description: "مؤكد ومُدرج في إصدار مستقبلي.",
    color: "text-intermediate",
    icon: "◈",
  },
  Building: {
    label: "قيد البناء",
    description: "بدأ العمل — الإصلاح أو الميزة في تقدم.",
    color: "text-beginner",
    icon: "◉",
  },
  Shipped: {
    label: "تم الإطلاق",
    description: "صدر ومتاح الآن على الموقع.",
    color: "text-fg-muted",
    icon: "✓",
  },
};

const AR_FILTER_LABELS: FilterTabLabels = {
  All: "الكل",
  Reviewing: "قيد المراجعة",
  Planned: "مخطط له",
  Building: "قيد البناء",
  Shipped: "تم الإطلاق",
};

const AR_STATUS_LABELS: Partial<Record<FeedbackStatus, string>> = {
  Reviewing: "قيد المراجعة",
  Planned: "مخطط له",
  Building: "قيد البناء",
  Shipped: "تم الإطلاق",
};

const AR_FORM_STRINGS: SubmitFormStrings = {
  titleLabel: "العنوان",
  titlePlaceholder: "ملخص موجز لملاحظتك…",
  messageLabel: "الرسالة",
  messagePlaceholder: "صف المشكلة أو طلب الميزة بالتفصيل…",
  emailLabel: "البريد الإلكتروني",
  emailOptional: "(اختياري)",
  submitButton: "إرسال الملاحظات",
  successMessage: "شكراً على ملاحظاتك! سنراجعها قريباً.",
};

export const metadata = {
  title: "آراء المجتمع",
  description:
    "خارطة طريق عامة ومتتبع ملاحظات لمنصة تعلّم Claude Code.",
};

export default function ArFeedbackPage() {
  const countByStatus = STATUS_ORDER.reduce<Record<string, number>>((acc, s) => {
    acc[s] = ITEMS.filter((i) => i.status === s).length;
    return acc;
  }, {});

  return (
    <main id="main-content" className="pb-24">
      <Container>
        {/* رأس الصفحة */}
        <PageHeader
          eyebrow="المجتمع"
          title="آراء المجتمع"
          lede="تابع الملاحظات والخطط والميزات قيد البناء والتي تم إطلاقها."
        />

        {/* صف الإحصاءات */}
        <Reveal delay={70}>
          <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATUS_ORDER.map((status, i) => {
              const meta = statusMeta[status];
              const count = countByStatus[status] ?? 0;
              return (
                <Reveal key={status} delay={i * 70}>
                  <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
                    <span className={`text-lg font-semibold ${meta.color}`}>
                      {meta.icon} {count}
                    </span>
                    <span className="text-xs font-semibold text-fg">
                      {meta.label}
                    </span>
                    <span className="text-[11px] text-fg-subtle leading-snug">
                      {meta.description}
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* يسار — لوحة الملاحظات */}
          <Reveal delay={140}>
            <section aria-label="عناصر الملاحظات">
              <FeedbackBoard
                items={ITEMS}
                filterLabels={AR_FILTER_LABELS}
                statusLabels={AR_STATUS_LABELS}
                emptyText="لا توجد عناصر في هذه الفئة بعد."
              />
            </section>
          </Reveal>

          {/* يمين — نموذج الإرسال + معلومات */}
          <div className="space-y-6">
            <Reveal delay={210}>
              <Card>
                <h2 className="mb-1 text-base font-semibold text-fg">
                  أرسل ملاحظاتك
                </h2>
                <p className="mb-5 text-sm text-fg-muted">
                  وجدت خللاً، لديك فكرة ميزة، أو لاحظت شيئاً غير صحيح؟
                  أخبرنا وسنراجعها.
                </p>
                <SubmitForm strings={AR_FORM_STRINGS} />
              </Card>
            </Reveal>

            <Reveal delay={280}>
              <Callout tone="info" title="كيف يعمل هذا">
                تُراجَع المقترحات يدويًا. تنتقل العناصر من{" "}
                <strong>قيد المراجعة</strong> ← <strong>مخطط له</strong> ←{" "}
                <strong>قيد البناء</strong> ← <strong>تم الإطلاق</strong> مع
                تقدم العمل. صوّت لصالح العناصر الأكثر أهمية لك.
              </Callout>
            </Reveal>

            <Reveal delay={350}>
              <Card className="space-y-3">
                <h2 className="text-sm font-semibold text-fg">دليل الحالات</h2>
                <dl className="space-y-2.5">
                  {STATUS_ORDER.map((status) => {
                    const meta = statusMeta[status];
                    return (
                      <div key={status} className="flex items-start gap-2.5">
                        <span className={`mt-0.5 text-sm ${meta.color}`}>
                          {meta.icon}
                        </span>
                        <div>
                          <dt className="text-xs font-semibold text-fg">
                            {meta.label}
                          </dt>
                          <dd className="text-xs text-fg-subtle">
                            {meta.description}
                          </dd>
                        </div>
                      </div>
                    );
                  })}
                </dl>
              </Card>
            </Reveal>
          </div>
        </div>
      </Container>
    </main>
  );
}
