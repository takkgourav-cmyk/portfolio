"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

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

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out ${
        scrolled ? "py-2" : "py-5"
      }`}
    >
      <nav
        className={`mx-auto flex items-center justify-between rounded-2xl transition-all duration-500 ease-out ${
          scrolled
            ? "max-w-4xl glass shadow-elegant backdrop-blur-2xl border border-border/40 px-4 py-2 scale-[0.98]"
            : "max-w-6xl px-4 sm:px-6 py-3"
        }`}
      >
        <a href="#home" className={`font-bold transition-all duration-500 ${scrolled ? "text-base" : "text-lg"}`}>
          <span className="gradient-text">Gourav</span>.dev
        </a>
        <ul className="hidden md:flex items-center gap-7 text-sm font-medium">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="md:hidden glass rounded-full p-2.5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="md:hidden mx-4 mt-2 glass rounded-2xl p-4 shadow-elegant animate-fade-in">
          <ul className="flex flex-col gap-3 text-sm font-medium">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 hover:text-primary"
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
