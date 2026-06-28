import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MODULES, moduleBySlug } from "@/lib/site";
import ModuleScaffold from "@/components/ModuleScaffold";
import { MODULE_BODIES_AR } from "@/content/learn/registry-ar";

export function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = moduleBySlug(slug);
  if (!meta) return {};
  return { title: meta.titleAr };
}

export default async function ArabicModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = moduleBySlug(slug);
  const Body = MODULE_BODIES_AR[slug];
  if (!meta || !Body) notFound();

  return (
    <ModuleScaffold slug={slug} locale="ar">
      <Body />
    </ModuleScaffold>
  );
}
