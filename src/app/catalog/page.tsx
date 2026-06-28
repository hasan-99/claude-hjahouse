import { Container, PageHeader, ArrowLink } from "@/components/ui";
import Reveal from "@/components/Reveal";
import CatalogClient from "./CatalogClient";

export const metadata = {
  title: "Feature Index",
  description:
    "Search the full Claude Code feature index across commands, hooks, skills, tools, settings, and files.",
};

export default function CatalogPage() {
  return (
    <main id="main-content">
      <Container>
        {/* Navigate eyebrow — mirrors original */}
        <Reveal className="pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-subtle">
            Navigate
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            Jump to learning, practice, or reference tools.
          </p>
        </Reveal>

        <PageHeader
          title="Feature Index"
          lede="Search the full Claude Code feature list when you need to find where a command, hook, tool, or setting lives."
        />

        {/* Cheat-sheet nudge — mirrors original */}
        <Reveal delay={80} className="mb-10 -mt-4">
          <p className="text-sm text-fg-muted">
            Need the short printable version instead?{" "}
            <ArrowLink href="/reference">Open the cheat sheet</ArrowLink>
          </p>
        </Reveal>

        {/* Searchable, filterable catalog */}
        <CatalogClient />
      </Container>
    </main>
  );
}
