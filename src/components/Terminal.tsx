"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ---------------------------------------------------------------------------
   Animated terminal simulator with character-by-character typing.
   Reused by the home hero, the Playground, and learn-module demos.
--------------------------------------------------------------------------- */

export type Tone =
  | "system"
  | "user"
  | "green"
  | "amber"
  | "blue"
  | "purple"
  | "muted"
  | "error"
  | "default";

export type Step =
  | { t: "print"; text: string; tone?: Tone }
  | { t: "type"; text: string; tone?: Tone; prompt?: string; speed?: number }
  | { t: "out"; lines: { text: string; tone?: Tone }[]; gap?: number }
  | { t: "wait"; ms: number }
  | { t: "clear" };

interface RenderedLine {
  id: number;
  text: string;
  tone: Tone;
  prompt?: string;
}

const toneClass: Record<Tone, string> = {
  system: "text-term-muted",
  user: "text-term-fg",
  green: "text-term-green",
  amber: "text-term-amber",
  blue: "text-term-blue",
  purple: "text-term-purple",
  muted: "text-term-muted/70",
  error: "text-term-error",
  default: "text-term-fg",
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

interface TerminalProps {
  script: Step[];
  title?: string;
  loop?: boolean;
  loopDelay?: number;
  startDelay?: number;
  className?: string;
  bodyClassName?: string;
  /** Show the "Auto-playing… / Paused" status + click-to-pause behaviour. */
  showStatus?: boolean;
  ariaLabel?: string;
}

export default function Terminal({
  script,
  title = "Claude Code",
  loop = true,
  loopDelay = 2600,
  startDelay = 500,
  className = "",
  bodyClassName = "",
  showStatus = true,
  ariaLabel,
}: TerminalProps) {
  const [rendered, setRendered] = useState<RenderedLine[]>([]);
  const [typing, setTyping] = useState<{ text: string; tone: Tone; prompt?: string } | null>(null);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);

  const pausedRef = useRef(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const nextId = () => ++idRef.current;

  const togglePause = useCallback(() => {
    if (done) return;
    setPaused((p) => {
      pausedRef.current = !p;
      return !p;
    });
  }, [done]);

  useEffect(() => {
    const signal = { cancelled: false };

    const waitWhilePaused = async () => {
      while (pausedRef.current && !signal.cancelled) await sleep(80);
    };

    const run = async () => {
      await sleep(startDelay);
      do {
        idRef.current = 0;
        setRendered([]);
        setTyping(null);
        for (const step of script) {
          if (signal.cancelled) return;
          await waitWhilePaused();

          if (step.t === "wait") {
            await sleep(step.ms);
          } else if (step.t === "clear") {
            setRendered([]);
            setTyping(null);
            await sleep(160);
          } else if (step.t === "print") {
            setRendered((r) => [
              ...r,
              { id: nextId(), text: step.text, tone: step.tone ?? "default" },
            ]);
            await sleep(90);
          } else if (step.t === "out") {
            for (const ln of step.lines) {
              if (signal.cancelled) return;
              await waitWhilePaused();
              setRendered((r) => [
                ...r,
                { id: nextId(), text: ln.text, tone: ln.tone ?? "default" },
              ]);
              await sleep(step.gap ?? 70);
            }
          } else if (step.t === "type") {
            const tone = step.tone ?? "user";
            const speed = step.speed ?? 42;
            setTyping({ text: "", tone, prompt: step.prompt ?? ">" });
            let shown = "";
            for (const ch of step.text) {
              if (signal.cancelled) return;
              await waitWhilePaused();
              shown += ch;
              setTyping({ text: shown, tone, prompt: step.prompt ?? ">" });
              await sleep(speed + (ch === " " ? 30 : Math.random() * 45));
            }
            await sleep(360);
            setTyping(null);
            setRendered((r) => [
              ...r,
              { id: nextId(), text: step.text, tone, prompt: step.prompt ?? ">" },
            ]);
          }
        }
        if (loop) await sleep(loopDelay);
      } while (loop && !signal.cancelled);
      if (!signal.cancelled) setDone(true);
    };

    run();
    return () => {
      signal.cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep scrolled to the latest line
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rendered, typing]);

  return (
    <div
      dir="ltr"
      className={`group overflow-hidden rounded-xl border border-term-border bg-term-bg text-left shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] ${className}`}
      role="application"
      aria-label={ariaLabel ?? `${title} terminal demo`}
    >
      {/* title bar */}
      <div className="flex items-center gap-3 border-b border-term-sep bg-term-bar px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-xs text-term-muted">{title}</span>
        {showStatus && (
          <button
            onClick={togglePause}
            className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-term-muted transition hover:text-term-fg"
            aria-label={paused ? "Resume" : "Pause"}
          >
            {done ? (
              <span>Done</span>
            ) : paused ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-term-amber" />
                Paused — click to resume
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-term-green" />
                Auto-playing…
              </>
            )}
          </button>
        )}
      </div>

      {/* body */}
      <div
        ref={bodyRef}
        onClick={showStatus ? togglePause : undefined}
        className={`term-scroll h-[300px] overflow-y-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed ${
          showStatus ? "cursor-pointer" : ""
        } ${bodyClassName}`}
      >
        {rendered.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap break-words">
            {line.prompt && <span className="mr-2 text-accent">{line.prompt}</span>}
            <span className={toneClass[line.tone]}>{line.text}</span>
          </div>
        ))}
        {typing && (
          <div className="whitespace-pre-wrap break-words">
            {typing.prompt && <span className="mr-2 text-accent">{typing.prompt}</span>}
            <span className={toneClass[typing.tone]}>{typing.text}</span>
            <span className="ml-0.5 inline-block h-[1.05em] w-[7px] -translate-y-[1px] animate-blink bg-term-green align-middle" />
          </div>
        )}
        {!typing && !done && (
          <div className="whitespace-pre-wrap">
            <span className="mr-2 text-accent">{">"}</span>
            <span className="inline-block h-[1.05em] w-[7px] -translate-y-[1px] animate-blink bg-term-green align-middle" />
          </div>
        )}
      </div>
    </div>
  );
}
