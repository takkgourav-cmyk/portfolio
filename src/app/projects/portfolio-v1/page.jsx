import { ProjectPageView } from "@/components/portfolio/ProjectPageView";
import { projects } from "@/components/portfolio/projectsData";
import { projectMetadata } from "@/lib/seo";

const project = projects.find((item) => item.slug === "portfolio-v1");

export const metadata = projectMetadata(project);

export default function PortfolioV1Page() {
  return <ProjectPageView project={project} />;
}
