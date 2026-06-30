import { Navbar } from "@/components/portfolio/Navbar";
import {
  Hero,
  About,
  Skills,
  Projects,
  Experience,
  Services,
  Testimonials,
  Contact,
  Footer,
  RevealMount,
} from "@/components/portfolio/sections";
import { Toaster } from "@/components/ui/sonner";
import {
  LoadingScreen,
  ScrollProgress,
  BackToTop,
} from "@/components/portfolio/Effects";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LoadingScreen />
      <ScrollProgress />
      <Navbar />
      <RevealMount />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
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
