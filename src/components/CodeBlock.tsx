"use client";

import { useState } from "react";

/* Code block with optional filename bar + copy button.
   `tone="terminal"` renders a darker, terminal-flavoured surface. */
export default function CodeBlock({
  code,
  filename,
  lang = "bash",
  tone = "default",
  className = "",
}: {
  code: string;
  filename?: string;
  lang?: string;
  tone?: "default" | "terminal";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const dark = tone === "terminal";

  return (
    <div
      dir="ltr"
      className={`group my-5 overflow-hidden rounded-lg border text-left ${
        dark ? "border-term-border bg-term-bg" : "border-border bg-bg-muted"
      } ${className}`}
    >
      <div
        className={`flex items-center justify-between border-b px-4 py-2 ${
          dark ? "border-term-sep" : "border-border"
        }`}
      >
        <span
          className={`font-mono text-xs ${
            dark ? "text-term-muted" : "text-fg-subtle"
          }`}
        >
          {filename ?? lang}
        </span>
        <button
          onClick={copy}
          className={`flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[11px] transition ${
            dark
              ? "text-term-muted hover:text-term-fg"
              : "text-fg-subtle hover:text-fg"
          }`}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5 text-term-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre
        className={`term-scroll overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed ${
          dark ? "text-term-fg" : "text-fg"
        }`}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
