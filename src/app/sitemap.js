import { projects } from "@/components/portfolio/projectsData";
import { SITE_URL, projectUrl } from "@/lib/seo";

export default function sitemap() {
  const routes = [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const projectRoutes = projects.map((project) => ({
    url: projectUrl(project),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...routes, ...projectRoutes];
}
