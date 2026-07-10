import { ProjectPageView } from "@/components/portfolio/ProjectPageView";
import { projects } from "@/components/portfolio/projectsData";
import { projectMetadata } from "@/lib/seo";

const project = projects.find((item) => item.slug === "saas-landing-page");

export const metadata = projectMetadata(project);

export default function SaasLandingPage() {
  return <ProjectPageView project={project} />;
}
