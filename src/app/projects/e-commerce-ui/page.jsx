import { ProjectPageView } from "@/components/portfolio/ProjectPageView";
import { projects } from "@/components/portfolio/projectsData";
import { projectMetadata } from "@/lib/seo";

const project = projects.find((item) => item.slug === "e-commerce-ui");

export const metadata = projectMetadata(project);

export default function EcommerceUiPage() {
  return <ProjectPageView project={project} />;
}
