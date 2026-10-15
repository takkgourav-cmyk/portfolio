export const SITE_URL = "https://portfolio-olive-tau-93.vercel.app";
export const SITE_NAME = "Gourav Takk Portfolio";
export const OWNER_NAME = "Gourav Takk";
export const OWNER_EMAIL = "takkgourav@gmail.com";
export const OWNER_PHONE = "+91-6377093772";
export const HOME_TITLE = "Web Developer in Jodhpur, Rajasthan | Gourav Takk";
export const HOME_DESCRIPTION =
  "Gourav Takk, freelance web developer in Jodhpur, Rajasthan. Website design, responsive business websites and React/Next.js frontend development. View projects.";
export const indexableRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const defaultKeywords = [
  "Gourav Takk",
  "Jodhpur web developer",
  "web developer in Jodhpur",
  "website developer in Jodhpur",
  "freelance web developer Jodhpur",
  "website development services in Jodhpur, Rajasthan",
  "frontend developer India",
  "React developer",
  "Next.js developer",
  "Tailwind CSS developer",
  "freelance web developer",
  "portfolio website developer",
  "responsive website developer",
];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function projectUrl(project) {
  return absoluteUrl(`/projects/${project.slug}`);
}

export function projectMetadata(project) {
  const title = `${project.title} Project`;
  const socialTitle = `${project.title} Project - ${OWNER_NAME}`;
  const description = project.seoDescription ?? project.overview ?? project.description;
  const url = projectUrl(project);
  const keywords = [
    ...defaultKeywords,
    project.title,
    project.category,
    ...project.tech,
    ...project.features.slice(0, 3),
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: socialTitle,
      description,
      url,
      type: "article",
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [
        {
          url: "/icon.png",
          width: 1024,
          height: 1024,
          alt: `${OWNER_NAME} portfolio logo`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description,
      images: ["/icon.png"],
    },
    robots: indexableRobots,
  };
}

export function projectJsonLd(project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    "@id": `${projectUrl(project)}#project`,
    description: project.overview,
    url: projectUrl(project),
    creator: {
      "@type": "Person",
      "@id": absoluteUrl("/#person"),
      name: OWNER_NAME,
      url: SITE_URL,
    },
    keywords: project.tech.join(", "),
    about: project.category,
  };
}

// Escape markup characters as recommended for JSON-LD embedded in HTML.
export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
