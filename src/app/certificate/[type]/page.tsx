import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { MODULES, SITE } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Static params: only "complete" and "halfway" are valid             */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return [{ type: "complete" }, { type: "halfway" }];
}

/* ------------------------------------------------------------------ */
/*  Per-type config                                                     */
/* ------------------------------------------------------------------ */

const TOTAL = MODULES.length; // 12

const CONFIG = {
  complete: {
    emoji: "🏆",
    title: "Course Complete!",
    subtitle: `All ${TOTAL} modules completed`,
    body: `You've mastered all ${TOTAL} Claude Code modules.`,
    description: `You've mastered all ${TOTAL} Claude Code modules.`,
    shareLabel: "Course Complete! - Claude Code Learning",
    borderColor: "border-accent/40",
    badgeRing: "bg-accent-soft text-accent",
  },
  halfway: {
    emoji: "⭐",
    title: "Halfway There!",
    subtitle: `${Math.ceil(TOTAL / 2)} of ${TOTAL} modules completed`,
    body: "You've completed half of the Claude Code learning path.",
    description: "You've completed half of the Claude Code learning path.",
    shareLabel: "Halfway There! - Claude Code Learning",
    borderColor: "border-intermediate/40",
    badgeRing: "bg-intermediate/10 text-intermediate",
  },
} as const;

type CertType = keyof typeof CONFIG;

/* ------------------------------------------------------------------ */
/*  Metadata                                                            */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  if (!(type in CONFIG)) return {};
  const cfg = CONFIG[type as CertType];
  return {
    title: `${cfg.title}`,
    description: cfg.description,
    openGraph: {
      title: cfg.title,
      description: cfg.description,
      siteName: `claude${SITE.domain}`,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: cfg.title,
      description: cfg.description,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!(type in CONFIG)) notFound();
  const cfg = CONFIG[type as CertType];

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main id="main-content" className="min-h-[calc(100vh-4rem)] py-16 sm:py-24">
      <Container className="flex flex-col items-center">

        {/* Navigate eyebrow (mirrors original) */}
        <Reveal className="mb-12 w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-subtle">
            Navigate
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            Jump to learning, practice, or reference tools.
          </p>
        </Reveal>

        {/* ---- Certificate card ---- */}
        <Reveal delay={70} className="w-full max-w-2xl">
          <div
            className={`
              relative overflow-hidden rounded-2xl border-2 ${cfg.borderColor}
              bg-card shadow-[var(--shadow-lg)]
              print:shadow-none print:border-2
            `}
          >
            {/* Decorative corner ornaments */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3 text-[28px] opacity-20 select-none"
            >
              ✦
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-3 text-[28px] opacity-20 select-none"
            >
              ✦
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 left-3 text-[28px] opacity-20 select-none"
            >
              ✦
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 right-3 text-[28px] opacity-20 select-none"
            >
              ✦
            </span>

            {/* Top decorative band */}
            <div className="h-1.5 w-full bg-accent/30" />

            <div className="px-8 py-10 sm:px-14 sm:py-14 text-center">

              {/* Brand label */}
              <Reveal delay={100}>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fg-subtle mb-6">
                  Claude Code Learning Certificate
                </p>
              </Reveal>

              {/* Main emoji */}
              <Reveal delay={160}>
                <div className="mb-5 flex justify-center">
                  <span
                    className="text-6xl sm:text-7xl animate-fade-in leading-none"
                    role="img"
                    aria-label={type === "complete" ? "Trophy" : "Star"}
                  >
                    {cfg.emoji}
                  </span>
                </div>
              </Reveal>

              {/* Title */}
              <Reveal delay={220}>
                <h1 className="font-serif text-4xl font-semibold text-fg sm:text-5xl mb-3">
                  {cfg.title}
                </h1>
              </Reveal>

              {/* Subtitle / progress badge */}
              <Reveal delay={280}>
                <div className="mb-6 flex justify-center">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${cfg.badgeRing}`}
                  >
                    {cfg.subtitle}
                  </span>
                </div>
              </Reveal>

              {/* Body text */}
              <Reveal delay={340}>
                <p className="mx-auto max-w-sm text-base text-fg-muted leading-relaxed mb-10">
                  {cfg.body}
                </p>
              </Reveal>

              {/* Divider */}
              <Reveal delay={380}>
                <div className="my-8 flex items-center gap-4">
                  <div className="flex-1 border-t border-border" />
                  <span className="font-serif text-lg text-fg-subtle/60">❧</span>
                  <div className="flex-1 border-t border-border" />
                </div>
              </Reveal>

              {/* Brand mark */}
              <Reveal delay={420}>
                <div className="mb-1 font-serif text-2xl font-semibold text-accent tracking-wide">
                  claude<span className="text-fg-subtle">.hjahouse.me</span>
                </div>
                <p className="text-xs text-fg-subtle mt-0.5">
                  An interactive Claude Code learning platform
                </p>
              </Reveal>

              {/* Date */}
              <Reveal delay={460}>
                <p className="mt-4 font-mono text-xs text-fg-faint">{today}</p>
              </Reveal>
            </div>

            {/* Bottom decorative band */}
            <div className="h-1.5 w-full bg-accent/30" />
          </div>
        </Reveal>

        {/* ---- Actions ---- */}
        <Reveal delay={520} className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          {/* Share button (client-side — see below, but we keep SSR-safe via aria-label) */}
          <ShareButton label={cfg.shareLabel} title={cfg.title} />

          {/* Start / back to learn */}
          <Link
            href="/learn"
            className="inline-flex min-h-[44px] items-center rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium text-fg-muted transition hover:border-accent/40 hover:text-fg hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"
          >
            Start Your Own Journey
          </Link>
        </Reveal>

        {/* Print tip */}
        <Reveal delay={580}>
          <p className="mt-8 text-xs text-fg-faint">
            Press <kbd className="rounded border border-border-strong bg-bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">Ctrl P</kbd> to save or print this certificate.
          </p>
        </Reveal>

      </Container>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Share button — needs client for navigator.share / clipboard        */
/* ------------------------------------------------------------------ */

import ShareButton from "./ShareButton";
