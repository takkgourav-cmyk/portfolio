import { notFound } from "next/navigation";
import { ProjectPageView } from "@/components/portfolio/ProjectPageView";
import { projects } from "@/components/portfolio/projectsData";
import { projectMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return {
      title: "Project - Gourav Takk",
    };
  }

  return projectMetadata(project);
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return <ProjectPageView project={project} />;
}
