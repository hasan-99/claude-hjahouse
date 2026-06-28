import { Container, PageHeader } from "@/components/ui";
import Reveal from "@/components/Reveal";
import BuilderClient from "./BuilderClient";

export const metadata = {
  title: "Config Builder",
  description: "Create Claude Code configuration files with standalone builders",
};

export default function BuildPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          eyebrow="Generate"
          title="Config Builder"
          lede="Interactive forms generate CLAUDE.md, hooks, skills, MCP servers, and plugin configs you can copy straight into your project."
        />

        <Reveal delay={70}>
          <BuilderClient />
        </Reveal>

        <div className="h-20" />
      </Container>
    </main>
  );
}
