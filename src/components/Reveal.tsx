"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
} from "react";

/* Fade-and-rise a section into view when it enters the viewport.
   Robust: reveals immediately if already on-screen at mount, observes
   otherwise, and has a safety fallback so content never stays hidden.
   Use `delay` (ms) to stagger siblings. */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already within (or near) the viewport at mount → reveal now.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);

    // Safety net: never leave content invisible.
    const t = setTimeout(() => setVisible(true), 1800);

    return () => {
      obs.disconnect();
      clearTimeout(t);
    };
  }, []);

  const Comp: ElementType = as || "div";
  return (
    <Comp
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Comp>
  );
}
