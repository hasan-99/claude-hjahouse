import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "./Reveal";
import { type Level, type Locale, levelLabel } from "@/lib/site";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

/** Standard sub-page header: small eyebrow, serif title, lede. */
export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <Reveal className="pb-10 pt-14">
      {eyebrow && (
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </div>
      )}
      <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
      {lede && (
        <p className="mt-4 max-w-2xl text-lg text-fg-subtle">{lede}</p>
      )}
    </Reveal>
  );
}

const levelStyles: Record<Level, string> = {
  beginner: "text-beginner",
  intermediate: "text-intermediate",
  advanced: "text-advanced",
};

export function LevelBadge({ level, locale = "en" }: { level: Level; locale?: Locale }) {
  return (
    <span className={`text-xs font-semibold capitalize ${levelStyles[level]}`}>
      {levelLabel[locale][level]}
    </span>
  );
}

export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 text-sm font-medium text-accent transition hover:text-accent-hover ${className}`}
    >
      {children}
      <svg
        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

/** Generic surface card. */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] ${className}`}
    >
      {children}
    </div>
  );
}
