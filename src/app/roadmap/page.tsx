import { Container, PageHeader } from "@/components/ui";
import RoadmapClient from "./Client";

export const metadata = {
  title: "Learning Roadmap",
  description:
    "Track your progress through 12 Claude Code learning modules from beginner to advanced.",
};

export default function RoadmapPage() {
  return (
    <main id="main-content">
      <Container>
        <PageHeader
          eyebrow="Your Learning Journey"
          title="Learning Roadmap"
          lede="Track your progress through 12 Claude Code learning modules — from first install to production plugins."
        />
        <RoadmapClient />
      </Container>
    </main>
  );
}
