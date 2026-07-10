import { ProjectPageView } from "@/components/portfolio/ProjectPageView";
import { projects } from "@/components/portfolio/projectsData";
import { projectMetadata } from "@/lib/seo";

const project = projects.find((item) => item.slug === "task-manager-app");

export const metadata = projectMetadata(project);

export default function TaskManagerAppPage() {
  return <ProjectPageView project={project} />;
}
