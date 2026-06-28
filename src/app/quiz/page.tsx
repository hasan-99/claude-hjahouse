import { Container, PageHeader } from "@/components/ui";
import Reveal from "@/components/Reveal";
import QuizClient from "./QuizClient";

export const metadata = {
  title: "Find Your Level",
  description:
    "Take a quick self-assessment to discover your Claude Code skill level and get a personalized learning path.",
};

export default function QuizPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          eyebrow="Self-assessment"
          title="Find Your Level"
          lede="Answer 10 quick questions about your Claude Code experience and get a personalized learning recommendation."
        />

        <Reveal className="pb-20">
          <QuizClient />
        </Reveal>
      </Container>
    </main>
  );
}
