import { Inter, Space_Grotesk, Montserrat } from "next/font/google";
import {
  absoluteUrl,
  defaultKeywords,
  HOME_DESCRIPTION,
  HOME_TITLE,
  indexableRobots,
  OWNER_EMAIL,
  OWNER_NAME,
  OWNER_PHONE,
  serializeJsonLd,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
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
    default: HOME_TITLE,
    template: `%s | ${OWNER_NAME}`,
  },
  description: HOME_DESCRIPTION,
  keywords: defaultKeywords,
  authors: [{ name: OWNER_NAME, url: SITE_URL }],
  creator: OWNER_NAME,
  publisher: OWNER_NAME,
  category: "portfolio",
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: "/icon.png", sizes: "1024x1024", type: "image/png" }],
    apple: "/icon.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "XCqtJFC5Xb5uvBChrgIj6R9QhBx6sJ8EnyXTcvmEd9s",
  },
  robots: indexableRobots,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    type: "website",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    locale: "en_IN",
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
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/icon.png"],
  },
};

export default function RootLayout({ children }) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: OWNER_NAME,
    alternateName: "Gourav",
    url: SITE_URL,
    jobTitle: "Frontend Web Developer",
    description:
      "Frontend web developer and BCA student from Jodhpur, India specializing in React, Next.js, Tailwind CSS and GSAP.",
    email: OWNER_EMAIL,
    telephone: OWNER_PHONE,
    image: absoluteUrl("/icon.png"),
    homeLocation: {
      "@type": "Place",
      name: "Jodhpur, Rajasthan, India",
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
    "@id": absoluteUrl("/#website"),
    name: SITE_NAME,
    url: SITE_URL,
    author: { "@id": absoluteUrl("/#person") },
    inLanguage: "en-IN",
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${montserrat.variable}`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
