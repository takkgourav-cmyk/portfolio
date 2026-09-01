import { Navbar } from "@/components/portfolio/Navbar";
import {
  Hero,
  About,
  Skills,
  Projects,
  Experience,
  Education,
  Services,
  Testimonials,
  Contact,
  Footer,
  RevealMount,
  NewsTicker,
  CustomCursor,
} from "@/components/portfolio/sections";
import { Toaster } from "@/components/ui/sonner";
import { ScrollProgress, BackToTop, SmoothAnchorScroll } from "@/components/portfolio/Effects";

export default function Home() {
  return (
    <div className="site-shell min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Custom dynamic cursor with particles */}
      <CustomCursor />

      <ScrollProgress />
      <SmoothAnchorScroll />
      <Navbar />
      <RevealMount />
      <main>
        <Hero />
        <NewsTicker />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <Toaster richColors position="top-right" />
    </div>
  );
}
