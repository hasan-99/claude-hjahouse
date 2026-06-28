"use client";

import { useState } from "react";

export default function ShareButton({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${label} — ${url}`;

    // Try Web Share API first (mobile)
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // user dismissed — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard not available — silent fail
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] active:translate-y-0"
    >
      {copied ? (
        <>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Link Copied!
        </>
      ) : (
        <>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share {label.split(" - ")[0]}
        </>
      )}
    </button>
  );
}
