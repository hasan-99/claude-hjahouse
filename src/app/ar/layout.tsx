import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "تعلّم Claude Code بشكل تفاعلي — claude.hjahouse.me" },
  description:
    "منصّة تعلّم تفاعلية لـ Claude Code. أتقن أوامر السلاش والمهارات والـ hooks وخوادم MCP وأكثر من خلال دروس عملية.",
};

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" lang="ar">
      {children}
    </div>
  );
}
