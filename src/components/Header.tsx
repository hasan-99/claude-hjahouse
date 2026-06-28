"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, SITE, localize, localeFromPath } from "@/lib/site";
import { useTheme, useCommandPalette } from "./Providers";

export default function Header() {
  const pathname = usePathname();
  const { theme, mounted, toggle } = useTheme();
  const { setOpen } = useCommandPalette();
  const [scrolled, setScrolled] = useState(false);

  const locale = localeFromPath(pathname);
  const ar = locale === "ar";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    const target = localize(href, locale);
    return target === "/" || target === "/ar"
      ? pathname === target
      : pathname.startsWith(target);
  };

  const enHref = ar ? pathname.replace(/^\/ar(?=\/|$)/, "") || "/" : pathname;
  const arHref = ar ? pathname : pathname === "/" ? "/ar" : `/ar${pathname}`;

  return (
    <header
      aria-label="Site header"
      dir={ar ? "rtl" : "ltr"}
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-border bg-bg/85 backdrop-blur-md"
          : "border-transparent bg-bg/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href={localize("/", locale)} dir="ltr" className="group flex items-baseline font-serif text-[17px] font-semibold">
          <span className="text-fg">{SITE.name}</span>
          <span className="text-accent transition-colors group-hover:text-accent-hover">
            {SITE.domain}
          </span>
        </Link>

        <nav aria-label="Main navigation" className="mx-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={localize(item.href, locale)}
              className={`rounded-md px-3 py-1.5 text-[13.5px] font-medium transition-colors ${
                isActive(item.href)
                  ? "text-accent"
                  : "text-fg-muted hover:bg-bg-muted hover:text-fg"
              }`}
            >
              {ar ? item.labelAr : item.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            aria-label="Search (Ctrl+K)"
            className="flex items-center gap-2 rounded-md border border-border-strong bg-bg-subtle px-2.5 py-1.5 text-fg-subtle transition hover:border-accent/40 hover:text-fg"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <kbd className="hidden font-mono text-[11px] sm:inline">Ctrl K</kbd>
          </button>

          <nav aria-label="Language" className="hidden items-center gap-1 text-[12px] font-medium sm:flex" dir="ltr">
            <Link href={enHref} className={`rounded px-1.5 py-0.5 transition ${ar ? "text-fg-subtle hover:text-fg" : "text-accent"}`}>
              EN
            </Link>
            <Link href={arHref} className={`rounded px-1.5 py-0.5 transition ${ar ? "text-accent" : "text-fg-subtle hover:text-fg"}`}>
              عربي
            </Link>
          </nav>

          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border-strong bg-bg-subtle text-fg-muted transition hover:text-fg"
          >
            {mounted && theme === "dark" ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
