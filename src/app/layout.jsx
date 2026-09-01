import { Inter, Space_Grotesk, Montserrat } from "next/font/google";
import { absoluteUrl, defaultKeywords, OWNER_EMAIL, OWNER_NAME, OWNER_PHONE, SITE_NAME, SITE_URL } from "@/lib/seo";
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

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gourav Takk — Frontend Developer | Jodhpur",
    template: `%s | ${OWNER_NAME}`,
  },
  description:
    "Gourav Takk is a frontend web developer from Jodhpur, India building responsive websites, React apps, Next.js portfolios, landing pages, and clean UI experiences.",
  keywords: defaultKeywords,
  authors: [{ name: OWNER_NAME, url: SITE_URL }],
  creator: OWNER_NAME,
  publisher: OWNER_NAME,
  category: "portfolio",
  applicationName: SITE_NAME,
  icons: {
    icon: [
      { url: "/icon.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: "/icon.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "XCqtJFC5Xb5uvBChrgIj6R9QhBx6sJ8EnyXTcvmEd9s",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Gourav Takk — Frontend Developer Portfolio",
    description:
      "Frontend developer crafting premium digital experiences with React, Next.js, and modern web technologies. Based in Jodhpur, India.",
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    images: [
      {
        url: "/icon.png",
        width: 1024,
        height: 1024,
        alt: "Gourav Takk developer portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gourav Takk — Frontend Developer Portfolio",
    description:
      "Frontend developer crafting premium digital experiences with React, Next.js, and Tailwind CSS.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({ children }) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: OWNER_NAME,
    alternateName: "Gourav",
    url: SITE_URL,
    jobTitle: "Frontend Web Developer",
    description:
      "Frontend web developer and BCA student from Jodhpur, India specializing in React, Next.js, Tailwind CSS and GSAP.",
    email: `mailto:${OWNER_EMAIL}`,
    telephone: OWNER_PHONE,
    image: absoluteUrl("/icon.png"),
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
      "https://github.com/takkgourav-cmyk",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    author: { "@type": "Person", name: OWNER_NAME },
    inLanguage: "en-US",
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  );
}
