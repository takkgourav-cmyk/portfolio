"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { scrollToHash } from "./Effects";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links.map((l) => l.href.replace("#", ""));
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const scrollToSection = (event, href) => {
    event.preventDefault();
    const didScroll = scrollToHash(href, { center: true, duration: 1200 });
    if (!didScroll) return;
    window.history.replaceState(null, "", href);
    setOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full px-6 md:px-12 flex justify-between items-center z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-black/10 dark:border-white/10 shadow-md"
          : "py-5 bg-transparent"
      } text-black dark:text-white`}
    >
      {/* Logo: <GOURAV TAKK_/> */}
      <div className="text-xl md:text-2xl font-bold tracking-wider font-mono">
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, "#home")}
          className="flex items-center text-black dark:text-white hover:text-[#00ff66] transition-colors"
        >
          <span className="text-[#00ff66] mr-1">&lt;</span>
          <span>GOURAV TAKK</span>
          <span className="animate-pulse ml-1 font-black text-[#00ff66]">_</span>
          <span className="text-[#00ff66] ml-1">/&gt;</span>
        </a>
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center gap-8 list-none font-inter">
        {links.map((l) => {
          const isActive = activeSection === l.href.replace("#", "");
          return (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => scrollToSection(e, l.href)}
                className={`nav-link group relative text-sm font-semibold uppercase tracking-widest transition-colors pb-1 ${
                  isActive
                    ? "text-black dark:text-[#00ff66]"
                    : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-[#00ff66]"
                }`}
              >
                <span className="relative inline-flex overflow-hidden">
                  {l.label.split("").map((letter, i) => (
                    <span key={i} className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5">
                      {letter}
                    </span>
                  ))}
                </span>
                <span
                  className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 transition-all duration-300 ${
                    isActive
                      ? "w-full bg-black dark:bg-[#00ff66]"
                      : "w-0 group-hover:w-full bg-black/60 dark:bg-[#00ff66]"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>

      {/* Mobile Nav Toggle */}
      <div className="md:hidden flex items-center gap-3">
        <button
          className="p-2 rounded-lg border border-black/10 dark:border-white/20 text-black dark:text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10 p-6 shadow-2xl flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => scrollToSection(e, l.href)}
              className="text-base font-bold uppercase tracking-wider py-2 text-black/80 dark:text-white/80 hover:text-[#00ff66]"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
