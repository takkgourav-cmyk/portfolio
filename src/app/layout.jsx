import { Inter, Space_Grotesk } from "next/font/google";
import "../styles.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata = {
  title: "Gourav Takk - Web Developer & Frontend Designer Portfolio",
  description:
    "Gourav Takk - Frontend developer & BCA student from Jodhpur, India. Building modern, responsive websites with React, Next.js, Tailwind CSS, and GSAP.",
  keywords: [
    "Gourav Takk",
    "web developer Jodhpur",
    "frontend developer India",
    "React developer",
    "Next.js developer",
    "Tailwind CSS",
    "freelance web developer",
  ],
  authors: [{ name: "Gourav Takk" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Gourav Takk - Web Developer Portfolio",
    description:
      "Frontend developer crafting modern, responsive websites with React, Next.js, Tailwind CSS & GSAP. Based in Jodhpur, India.",
    type: "website",
    url: "https://gourav-takk-portfolio.vercel.app/",
    siteName: "Gourav Takk Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Gourav Takk - Web Developer Portfolio",
    description:
      "Frontend developer crafting modern, responsive websites with React, Next.js & Tailwind CSS.",
  },
};

export default function RootLayout({ children }) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Gourav Takk",
    alternateName: "Gourav",
    url: "https://gourav-takk-portfolio.vercel.app/",
    jobTitle: "Frontend Web Developer",
    description:
      "Frontend web developer and BCA student from Jodhpur, India specializing in React, Next.js, Tailwind CSS and GSAP.",
    email: "mailto:takkgourav@gmail.com",
    telephone: "+91-6377093772",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jodhpur",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    knowsAbout: [
      "Web Development",
      "Frontend Development",
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "JavaScript",
      "UI/UX Design",
      "GSAP Animations",
    ],
    sameAs: [
      "https://www.linkedin.com/in/gourav-takk-674abb367",
      "https://github.com/",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Gourav Takk Portfolio",
    url: "https://gourav-takk-portfolio.vercel.app/",
    author: { "@type": "Person", name: "Gourav Takk" },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>{children}</body>
    </html>
  );
}
