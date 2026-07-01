const siteUrl = "https://gourav-takk-portfolio.vercel.app";

export default function sitemap() {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
