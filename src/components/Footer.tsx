"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOOTER_COLUMNS, SITE, STRINGS, localize, localeFromPath } from "@/lib/site";

export default function Footer() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const ar = locale === "ar";
  const t = STRINGS[locale];

  return (
    <footer className="mt-24 border-t border-border bg-bg-subtle" dir={ar ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href={localize("/", locale)} className="font-serif text-lg font-semibold text-fg">
              {SITE.name}
              {SITE.domain}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-fg-subtle">
              {t.tagline}{" "}
              <a href={SITE.parentUrl} className="text-accent underline-offset-2 hover:underline">
                hjahouse.me
              </a>
              .
            </p>
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-faint">
                  {ar ? col.titleAr : col.title}
                </div>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={localize(l.href, locale)}
                        className="text-sm text-fg-muted transition hover:text-accent"
                      >
                        {ar ? l.labelAr : l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-fg-faint sm:flex-row sm:items-center" dir="ltr">
          <span>
            © {SITE.year} {SITE.name}
            {SITE.domain} · {SITE.version}
          </span>
          <span>
            Inspired by{" "}
            <a href={SITE.inspiredBy.url} className="underline-offset-2 hover:text-accent hover:underline">
              {SITE.inspiredBy.label}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
