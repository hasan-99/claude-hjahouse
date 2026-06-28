import { Container, PageHeader } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { Callout } from "@/components/content";
import PlaygroundClient from "./PlaygroundClient";

export const metadata = {
  title: "Playground",
  description:
    "Practice Claude Code commands in a dedicated full-size terminal sandbox. No setup, no API key.",
};

export default function PlaygroundPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          eyebrow="Sandbox"
          title="Playground"
          lede="Practice commands in a dedicated full-size terminal sandbox. No setup, no API key."
        />

        {/* Mode intro callout */}
        <Reveal delay={70}>
          <Callout tone="tip" title="Two modes available">
            <strong>Free Type</strong> — an open terminal where you type any command or natural language
            prompt and Claude responds. <strong>Guided</strong> — a step-by-step walkthrough of the most
            important Claude Code commands, perfect for beginners.
          </Callout>
        </Reveal>

        {/* Interactive terminal */}
        <Reveal delay={140} className="mt-6">
          <PlaygroundClient />
        </Reveal>
      </Container>
    </main>
  );
}
