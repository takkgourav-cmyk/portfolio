"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { scrollToHash } from "./Effects";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (event, href) => {
    event.preventDefault();
    const didScroll = scrollToHash(href, { center: true, duration: 1350 });
    if (!didScroll) return;
    window.history.replaceState(null, "", href);
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[padding] duration-300 ease-out ${
        scrolled ? "py-2" : "py-5"
      }`}
    >
      <nav
        className={`mx-auto flex items-center justify-between border transition-[max-width,padding,border-radius,background-color,border-color] duration-300 ease-out ${
          scrolled
            ? "max-w-5xl rounded-2xl glass shadow-elegant border-border px-4 py-2"
            : "max-w-6xl rounded-none border-border/70 bg-background/95 px-4 py-3 shadow-sm sm:px-6 md:rounded-2xl"
        }`}
      >
        <a href="#home" onClick={(event) => scrollToSection(event, "#home")} className="flex items-center gap-2 text-lg font-bold transition-colors duration-300">
          <Image
            src="/gourav-logo.png"
            alt="Gourav Takk logo"
            width={40}
            height={40}
            priority
            className="size-10 rounded-xl object-cover"
          />
          <span>Gourav <span className="text-primary">Takk</span></span>
        </a>
        <ul className="hidden md:flex items-center gap-7 text-sm font-medium">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(event) => scrollToSection(event, l.href)}
                className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#contact"
            onClick={(event) => scrollToSection(event, "#contact")}
            className="hidden items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:bg-accent-hover sm:flex"
          >
            Let&apos;s Talk <ArrowRight className="size-4" />
          </a>
          <button
            className="md:hidden glass rounded-full p-2.5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-navigation" className="md:hidden mx-4 mt-2 glass rounded-2xl p-3 shadow-elegant animate-fade-in">
          <ul className="flex flex-col gap-3 text-sm font-medium">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(event) => scrollToSection(event, l.href)}
                  className="block rounded-xl px-3 py-2.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
