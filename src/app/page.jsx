import { Navbar } from "@/components/portfolio/Navbar";
import {
  Hero,
  About,
  Skills,
  Projects,
  Experience,
  Education,
  Services,
  Contact,
  Footer,
  RevealMount,
  NewsTicker,
  CustomCursor,
} from "@/components/portfolio/sections";
import { Toaster } from "@/components/ui/sonner";
import { ScrollProgress, BackToTop } from "@/components/portfolio/Effects";
import { HelloIntro } from "@/components/portfolio/HelloIntro";
import { HOME_TITLE, HOME_DESCRIPTION } from "@/lib/seo";

export const metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
};

export default function Home() {
  return (
    <>
      <HelloIntro />
      <div className="site-shell min-h-screen bg-background text-foreground transition-colors duration-500">
        {/* Custom dynamic cursor with particles */}
        <CustomCursor />

        <ScrollProgress />
        <Navbar />
        <RevealMount />
        <main id="main-content" tabIndex={-1}>
          <Hero />
          <NewsTicker />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Education />
          <Services />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
        <Toaster richColors position="top-right" />
      </div>
    </>
  );
}
