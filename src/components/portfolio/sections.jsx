"use client";

import * as React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase, Code2, CodeXml, Download, Github, Instagram, GraduationCap,
  Layout, Linkedin, Mail, MapPin, Palette, Phone, Server, ExternalLink,
  Send, Award, Building2, Cpu, ArrowRight, Database, Eye, CornerDownRight, School, Backpack
} from "lucide-react";
import profile from "@/assets/profile-developer.webp";
import { toast } from "sonner";
import RobotCanvas3D from "./RobotCanvas3D";
import ThreeContactBackground from "./ThreeContactBackground";
import { ThemeToggle } from "./ThemeToggle";
import { projects as portfolioProjects } from "./projectsData";

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   CUSTOM CURSOR (Particle Spark Trail & Magnetic Ring)
   ================================================================ */
export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const canvasRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const trail = useRef([]);

  useEffect(() => {
    const dot = dotRef.current;
    const ringEl = ringRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ringEl || !canvas) return;

    const ctx = canvas.getContext("2d");
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.04, ease: "none" });

      trail.current.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 3 + 2,
        alpha: 0.8,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
      });
      if (trail.current.length > 20) trail.current.shift();
    };

    let raf;
    const animLoop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.15;
      ring.current.y += (pos.current.y - ring.current.y) * 0.15;
      gsap.set(ringEl, { x: ring.current.x, y: ring.current.y });

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < trail.current.length; i++) {
        const p = trail.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha *= 0.92;
        p.size *= 0.95;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.size, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 102, ${p.alpha})`;
        ctx.fill();
      }
      trail.current = trail.current.filter((p) => p.alpha > 0.05);

      raf = requestAnimationFrame(animLoop);
    };
    raf = requestAnimationFrame(animLoop);

    const onEnterHoverable = (e) => {
      if (!(e.target instanceof Element)) return;
      const el = e.target.closest("a,button,[data-cursor-hover],input,textarea");
      if (el) {
        gsap.to(dot, { scale: 0, duration: 0.2 });
        gsap.to(ringEl, { scale: 2.2, borderColor: "#00ff66", backgroundColor: "rgba(0,255,102,0.12)", duration: 0.3 });
      }
    };
    const onLeaveHoverable = (e) => {
      if (!(e.target instanceof Element)) return;
      const el = e.target.closest("a,button,[data-cursor-hover],input,textarea");
      if (el) {
        gsap.to(dot, { scale: 1, duration: 0.2 });
        gsap.to(ringEl, { scale: 1, borderColor: "#00ff66", backgroundColor: "transparent", duration: 0.3 });
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onEnterHoverable, true);
    document.addEventListener("mouseleave", onLeaveHoverable, true);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mouseenter", onEnterHoverable, true);
      document.removeEventListener("mouseleave", onLeaveHoverable, true);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[99997]" />
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}

/* ================================================================
   PARTICLE CANVAS (Hero Background)
   ================================================================ */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.5 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,102,${p.a})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx*dx + dy*dy);
        if (d < 100) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,255,102,${0.05 * (1 - d / 100)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />;
}

/* ================================================================
   HERO — 3D Spline Interactive Robot + Giant Outline Background Text
   ================================================================ */
export function Hero() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    const ctx = gsap.context(() => {
      const heroLines = root.querySelectorAll(".hero-text-line");
      gsap.fromTo(heroLines,
        { y: "40%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex items-start justify-center pt-20 md:pt-24 bg-white dark:bg-[#020202] transition-colors duration-500"
    >
      {/* Background Particles */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-[1] overflow-hidden">
        <ParticleCanvas />
      </div>

      {/* Giant outlined background text */}
      <div
        className="hero-wrapper opacity-0 absolute inset-0 z-0 flex flex-col items-center justify-center text-center pointer-events-none overflow-hidden"
        style={{ opacity: 1 }}
      >
        <h1
          className="text-[3.5rem] sm:text-[6rem] md:text-[9rem] lg:text-[13rem] leading-[0.78] tracking-tighter flex flex-col items-center opacity-60 dark:opacity-20 select-none"
          style={{ fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 900 }}
        >
          <span className="relative block">
            <span
              className="hero-text-line block text-transparent [-webkit-text-stroke:2px_#000000] sm:[-webkit-text-stroke:3px_#000000] md:[-webkit-text-stroke:4px_#000000] dark:[-webkit-text-stroke:2px_#ffffff] md:dark:[-webkit-text-stroke:4px_#ffffff] transition-colors duration-500"
            >
              WELCOME
            </span>
          </span>
          <span className="relative block">
            <span
              className="hero-text-line block text-transparent [-webkit-text-stroke:2px_#000000] sm:[-webkit-text-stroke:3px_#000000] md:[-webkit-text-stroke:4px_#000000] dark:[-webkit-text-stroke:2px_#ffffff] md:dark:[-webkit-text-stroke:4px_#ffffff] transition-colors duration-500"
            >
              TO <span className="inline-block ml-[0.8em] sm:ml-[1.2em]">MY</span>
            </span>
          </span>
          <span className="relative block">
            <span
              className="hero-text-line block text-transparent [-webkit-text-stroke:2px_#00ff66] sm:[-webkit-text-stroke:3px_#00ff66] md:[-webkit-text-stroke:4px_#00ff66] transition-colors duration-500"
            >
              PORTFOLIO
            </span>
          </span>
        </h1>
      </div>

      {/* 3D Spline Interactive Robot Character */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto">
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
          <RobotCanvas3D />
        </div>
      </div>

      {/* Bottom Floating Info Badge */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/15 text-[11px] sm:text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
          <span className="size-2 rounded-full bg-[#00ff66] animate-pulse" />
          Frontend Web Developer • Jodhpur, Rajasthan
        </div>
        <div className="w-[1px] h-6 bg-gradient-to-b from-[#00ff66] to-transparent animate-pulse" />
      </div>
    </section>
  );
}

/* ================================================================
   NEWS TICKER
   ================================================================ */
const tickerItems = [
  "Available for Opportunities", "Frontend Web Developer", "OSSC College BCA Student",
  "React.js & Next.js", "Tailwind CSS", "JavaScript & HTML/CSS", "GSAP Animations", "Clean UI/UX Design",
];

export function NewsTicker() {
  const content = tickerItems.map((item, i) => (
    <React.Fragment key={i}>
      <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400">{item}</span>
      <span aria-hidden="true" className="text-sm sm:text-base font-bold text-[#00ff66]">●</span>
    </React.Fragment>
  ));
  return (
    <aside className="ticker py-3 border-y border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-[#050505] transition-colors duration-500" aria-label="Availability">
      <div className="ticker-track">
        <div className="ticker-group">{content}</div>
        <div className="ticker-group" aria-hidden="true">{content}</div>
      </div>
    </aside>
  );
}

/* ================================================================
   ABOUT — Resume Information + 3D Tilt Card + Mini Cars
   ================================================================ */
export function About() {
  const ref = useRef(null);
  const cardRef = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    const card = cardRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(root.querySelectorAll(".about-title"), { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });

      const subh = root.querySelector(".about-subheading");
      if (subh) {
        const words = subh.querySelectorAll(".word-inner");
        gsap.fromTo(words, { y: "120%", rotateX: -20, opacity: 0 }, {
          y: "0%", rotateX: 0, opacity: 1, duration: 0.65, stagger: 0.04, ease: "power3.out",
          scrollTrigger: { trigger: subh, start: "top 85%", once: true },
        });
      }

      gsap.fromTo(root.querySelectorAll(".about-para, .about-stat-card"), { x: 60, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
    }, root);

    if (!card) return;
    const onTilt = (e) => {
      const b = card.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width - 0.5;
      const y = (e.clientY - b.top) / b.height - 0.5;
      gsap.to(card, { rotateY: x * 16, rotateX: -y * 16, transformPerspective: 1000, duration: 0.3, ease: "power2.out" });
    };
    const onLeave = () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
    card.addEventListener("mousemove", onTilt);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      card.removeEventListener("mousemove", onTilt);
      card.removeEventListener("mouseleave", onLeave);
      ctx.revert();
    };
  }, []);

  const statsCards = [
    { icon: Building2, label: "Current Education", value: "BCA @ OSSC College (2024 - Present)", color: "#ffcc00" },
    { icon: CodeXml, label: "Role", value: "Frontend Web Developer", color: "#00ff66" },
    { icon: Cpu, label: "Certification", value: "WsCube Tech (Web Dev 2024)", color: "#ff00ff" },
    { icon: MapPin, label: "Location", value: "Jodhpur, Rajasthan, India", color: "#00ffff" },
  ];

  const headingWords = ["Crafting", "clean,", "responsive", "interfaces", "and", "delightful", "user", "experiences."];

  return (
    <section
      id="about"
      ref={ref}
      className="pt-10 pb-20 md:pt-14 md:pb-28 w-full text-black dark:text-white bg-white dark:bg-[#020202] transition-colors duration-500 border-t border-black/10 dark:border-white/10 overflow-hidden relative"
    >
      <div className="w-full px-6 md:px-12 relative z-10">
        <div className="about-title mb-10 md:mb-14">
          <h2 className="text-3xl md:text-5xl font-bold font-montserrat mt-2 tracking-tight text-black dark:text-white">
            ABOUT ME
          </h2>
          <div className="h-[2px] w-20 mt-4 bg-zinc-900 dark:bg-[#00ff66]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Profile Card */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start xl:items-center gap-6" style={{ perspective: "1000px" }}>
            <div
              ref={cardRef}
              className="about-image-card relative w-full max-w-[320px] sm:max-w-[340px] aspect-[4/5] overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900 cursor-pointer select-none shadow-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image src={profile} alt="Gourav Takk" fill className="object-cover pointer-events-none" sizes="(max-width: 768px) 100vw, 340px" priority />
              <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-white/70 dark:bg-black/70 backdrop-blur-md border-t border-black/10 dark:border-white/10 flex items-center justify-center pointer-events-none">
                <span className="text-lg md:text-xl font-black text-transparent font-montserrat tracking-widest uppercase text-center [-webkit-text-stroke:1px_black] dark:[-webkit-text-stroke:1px_white]">
                  GOURAV TAKK
                </span>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-[#00ff66]/40 z-30 shadow-[inset_0_0_15px_rgba(0,255,102,0.2)]" />
            </div>

            {/* Resume Action Buttons */}
            <div className="flex gap-3 w-full max-w-[340px] justify-center mt-2">
              <a
                href="mailto:takkgourav@gmail.com?subject=Hello%20Gourav&body=Hello%20Gourav,"
                onClick={(e) => {
                  window.open(
                    "https://mail.google.com/mail/?view=cm&fs=1&to=takkgourav@gmail.com&su=Hello%20Gourav&body=Hello%20Gourav,",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="flex items-center justify-center flex-1 gap-1.5 px-3 py-2.5 rounded-full bg-transparent hover:bg-white/10 text-xs md:text-sm font-semibold transition-transform active:scale-95 border border-white/30 whitespace-nowrap cursor-pointer text-white"
              >
                <Mail className="size-4 text-[#00ff66]" />Email Me
              </a>
              <a
                href="/Gourav_Takk_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center flex-1 gap-1.5 px-3 py-2.5 rounded-full bg-[#00ff66] hover:bg-[#00cc52] text-black text-xs md:text-sm font-semibold transition-transform active:scale-95 whitespace-nowrap cursor-pointer shadow-md"
              >
                <ExternalLink className="size-4" />Resume
              </a>
            </div>
          </div>

          {/* About Text & Statistics */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            <h3 className="about-subheading text-2xl lg:text-3xl xl:text-[34px] font-black font-montserrat tracking-tight mb-6 text-transparent [-webkit-text-stroke:1px_black] dark:[-webkit-text-stroke:1px_#00ff66] leading-snug">
              {headingWords.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.3em] pb-[0.1em]">
                  <span className="word-inner inline-block origin-bottom">{word}</span>
                </span>
              ))}
            </h3>

            {/* Resume Paragraphs */}
            <div className="space-y-4 font-inter leading-relaxed text-sm md:text-base">
              <p className="about-para block text-zinc-700 dark:text-zinc-300">
                <span className="inline-block text-base font-medium text-black/80 dark:text-white/80">
                  I&apos;m <strong className="text-black dark:text-white font-bold">Gourav Takk</strong>, a motivated BCA student from Jodhpur with a strong interest in web development and modern frontend technologies. I love crafting clean, responsive interfaces and translating ideas into delightful user experiences.
                </span>
              </p>
              <p className="about-para block text-zinc-700 dark:text-zinc-300">
                <span className="inline-block text-base font-medium text-black/80 dark:text-white/80">
                  <strong className="text-black dark:text-white font-bold">Career Objective:</strong> Seeking opportunities to enhance my technical skills and gain practical experience by contributing to real-world projects using <span className="text-[#00ff66] font-semibold">React.js, Next.js, and Tailwind CSS</span>.
                </span>
              </p>
            </div>

            {/* Racing Mini Cars */}
            <div className="relative h-8 mt-10 mb-2 overflow-hidden border-t border-black/10 dark:border-white/10">
              {[
                { delay: "0s", color: "#00ff66" },
                { delay: "2.5s", color: "#3758f9" },
                { delay: "6s", color: "#ff00ff" },
                { delay: "9s", color: "#ffcc00" },
              ].map((car, i) => (
                <div
                  key={i}
                  className="absolute bottom-0"
                  style={{ animation: `drive-car 12s linear infinite`, animationDelay: car.delay, left: 0 }}
                >
                  <MiniCar color={car.color} />
                </div>
              ))}
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {statsCards.map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="about-stat-card rounded-xl border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900 p-4 flex flex-col justify-between h-full relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ "--glow-color": color }}
                >
                  <div className="absolute top-0 right-0 opacity-20 group-hover:opacity-40 group-hover:scale-110 duration-500 pointer-events-none hidden md:block p-3" style={{ color }}>
                    <Icon size={40} strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="size-4" style={{ color }} />
                    <span className="block text-xs font-mono text-black/60 dark:text-white/60 uppercase tracking-wider font-bold">{label}</span>
                  </div>
                  <span className="block text-sm md:text-base font-semibold font-montserrat text-black dark:text-white leading-tight">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniCar({ color = "#00ff66" }) {
  return (
    <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
      <rect x="2" y="7" width="44" height="9" rx="3" fill={color} opacity="0.9" />
      <rect x="8" y="3" width="28" height="9" rx="2" fill={color} />
      <circle cx="12" cy="16" r="3.5" fill="#111" stroke={color} strokeWidth="1.5" />
      <circle cx="36" cy="16" r="3.5" fill="#111" stroke={color} strokeWidth="1.5" />
      <rect x="14" y="4" width="18" height="6" rx="1.5" fill="rgba(255,255,255,0.7)" />
      <ellipse cx="-4" cy="15" rx="3" ry="2" fill="rgba(0,255,102,0.3)" />
    </svg>
  );
}

/* ================================================================
   SKILLS — VS Code IDE with Mouse Hover Tech Icon Flower-Burst
   ================================================================ */
const ALL_SKILLS = [
  { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
  { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "React.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original-wordmark.svg", invert: true },
  { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
  { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg", invert: true },
  { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" },
];

const SKILL_TABS = [
  {
    id: "frontend.js", icon: CodeXml, iconColor: "#38bdf8", label: "frontend.js",
    desc: "Building responsive, animated, and pixel-perfect user interfaces.",
    skills: ["HTML5", "CSS3", "JavaScript", "React.js", "Next.js", "Tailwind CSS"],
  },
  {
    id: "backend.js", icon: Server, iconColor: "#4ade80", label: "backend.js",
    desc: "Server integrations, REST APIs, and Node.js fundamentals.",
    skills: ["Node.js", "Python", "REST APIs", "Express Basics"],
  },
  {
    id: "tools.js", icon: Database, iconColor: "#fb923c", label: "tools.js",
    desc: "Developer tools, Git version control, and GitHub workflows.",
    skills: ["Git", "GitHub", "VS Code", "Vite", "Bootstrap"],
  },
  {
    id: "ai.js", icon: Cpu, iconColor: "#f472b6", label: "ai.js",
    desc: "Agentic AI integrations, prompt engineering, and intelligent features.",
    skills: ["Agentic AI", "OpenAI API", "Gemini API", "UI Foundations"],
  },
];

export function Skills() {
  const [activeTab, setActiveTab] = useState("frontend.js");
  const activeData = SKILL_TABS.find(t => t.id === activeTab) || SKILL_TABS[0];
  const [burstParticles, setBurstParticles] = useState([]);
  const ideRef = useRef(null);

  // Mouse hover flower-burst effect
  const handleIdeMouseMove = (e) => {
    if (!ideRef.current) return;
    if (Math.random() > 0.35) return; // throttle rate
    const rect = ideRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const randomSkill = ALL_SKILLS[Math.floor(Math.random() * ALL_SKILLS.length)];
    const newP = {
      id: Math.random(),
      x,
      y,
      icon: randomSkill.icon,
      vx: (Math.random() - 0.5) * 120,
      vy: -Math.random() * 80 - 40,
      rotate: (Math.random() - 0.5) * 60,
      scale: Math.random() * 0.4 + 0.6,
    };

    setBurstParticles((prev) => [...prev.slice(-18), newP]);
    setTimeout(() => {
      setBurstParticles((prev) => prev.filter((p) => p.id !== newP.id));
    }, 1200);
  };

  const handleRunCode = () => {
    // Generate flower burst across IDE
    const newItems = Array.from({ length: 12 }, (_, idx) => {
      const randomSkill = ALL_SKILLS[idx % ALL_SKILLS.length];
      return {
        id: Math.random(),
        x: Math.random() * 600 + 50,
        y: Math.random() * 250 + 50,
        icon: randomSkill.icon,
        vx: (Math.random() - 0.5) * 200,
        vy: -Math.random() * 120 - 40,
        rotate: (Math.random() - 0.5) * 90,
        scale: 0.9,
      };
    });
    setBurstParticles((prev) => [...prev, ...newItems]);
    toast.success(`Executed ${activeData.label} — Stack loaded!`);
    setTimeout(() => {
      setBurstParticles([]);
    }, 1600);
  };

  return (
    <section id="skills" className="pt-8 pb-20 md:pt-12 md:pb-28 w-full bg-white dark:bg-[#020202] text-black dark:text-white transition-colors duration-500 border-t border-black/10 dark:border-white/10 relative overflow-hidden">
      <div className="w-full px-6 md:px-12 relative z-[1]">
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-montserrat mt-2 tracking-tight text-black dark:text-white">
            MY TECH STACK
          </h2>
          <div className="h-[2px] w-20 mt-4 bg-zinc-900 dark:bg-[#00ff66]" />
        </div>

        {/* VS Code Simulator with Mouse Flower-Burst */}
        <div
          ref={ideRef}
          onMouseMove={handleIdeMouseMove}
          className="w-full mx-auto rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black shadow-2xl transition-all duration-300 relative"
        >
          {/* Flower-burst floating icons */}
          {burstParticles.map((p) => (
            <div
              key={p.id}
              className="absolute pointer-events-none z-50 transition-all duration-1000 ease-out"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                transform: `translate(${p.vx}px, ${p.vy}px) rotate(${p.rotate}deg) scale(${p.scale})`,
                opacity: 0,
                animation: "fade-burst 1.2s ease-out forwards",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.icon} alt="" className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-xl" />
            </div>
          ))}

          <div className="flex items-center justify-between px-4 py-3 bg-zinc-100 dark:bg-[#0a0a0a] border-b border-zinc-200 dark:border-zinc-800 select-none">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" />
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors" />
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors" />
            </div>
            <div className="flex-1 text-center text-xs font-mono text-zinc-500 dark:text-zinc-400 hidden sm:block">
              gourav-portfolio — Visual Studio Code
            </div>
            <button
              onClick={handleRunCode}
              className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all bg-[#00ff66]/10 text-[#00ff66] hover:bg-[#00ff66]/20 hover:scale-105 shadow-[0_0_10px_rgba(0,255,102,0.1)] cursor-pointer"
            >
              ▶ Run Code
            </button>
          </div>

          <div className="flex flex-col md:flex-row h-auto md:h-[430px]">
            {/* Sidebar Explorer */}
            <div className="md:w-56 bg-zinc-50 dark:bg-[#0a0a0a] border-r border-zinc-200 dark:border-zinc-800 flex md:flex-col overflow-x-auto select-none">
              <div className="px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider hidden md:block mt-2">
                Explorer
              </div>
              <div className="flex md:flex-col w-full">
                {SKILL_TABS.map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 md:py-2 text-sm font-mono whitespace-nowrap transition-colors outline-none cursor-pointer ${active ? "bg-white dark:bg-black text-black dark:text-white md:border-l-2 md:border-[#00ff66] border-b-2 md:border-b-0 border-[#00ff66]" : "text-zinc-500 hover:text-black dark:hover:text-white"}`}
                    >
                      <tab.icon className="size-4" style={{ color: tab.iconColor }} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Code View */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto font-mono text-xs sm:text-sm md:text-base leading-relaxed relative bg-white dark:bg-black">
              <div className="flex relative z-10">
                <div className="flex flex-col text-right pr-4 md:pr-6 select-none text-zinc-400 border-r border-zinc-200 dark:border-zinc-700 mr-4 md:mr-6">
                  {Array.from({ length: 8 }, (_, i) => (
                    <span key={i} className="leading-relaxed">{i + 1}</span>
                  ))}
                </div>
                <div className="flex-1 overflow-x-auto text-black dark:text-zinc-100">
                  <pre className="whitespace-pre-wrap break-words leading-relaxed font-semibold">
                    <span className="text-pink-600 dark:text-pink-400 font-bold">export const </span>
                    <span className="text-amber-600 dark:text-yellow-200 font-bold">{activeData.id.split(".")[0]}</span>
                    <span className="text-zinc-500 dark:text-white/60 font-bold">: </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">TechStack</span>
                    <span className="text-zinc-500 dark:text-white/60 font-bold"> = &#123;</span>{"\n"}
                    <span className="text-zinc-500 dark:text-white/60 font-bold">  </span>
                    <span className="text-blue-600 dark:text-blue-300 font-bold">description</span>
                    <span className="text-zinc-500 dark:text-white/60 font-bold">: </span>
                    <span className="text-orange-600 dark:text-orange-300 font-bold">&quot;{activeData.desc}&quot;</span>
                    <span className="text-zinc-500 dark:text-white/60 font-bold">,</span>{"\n"}
                    <span className="text-zinc-500 dark:text-white/60 font-bold">  </span>
                    <span className="text-blue-600 dark:text-blue-300 font-bold">skills</span>
                    <span className="text-zinc-500 dark:text-white/60 font-bold">: [</span>{"\n"}
                    {activeData.skills.map((s, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-zinc-500 dark:text-white/60 font-bold">    </span>
                        <span className="text-orange-600 dark:text-orange-300 font-bold">&quot;{s}&quot;</span>
                        {idx < activeData.skills.length - 1 && <span className="text-zinc-500 dark:text-white/60 font-bold">,</span>}
                        {"\n"}
                      </React.Fragment>
                    ))}
                    <span className="text-zinc-500 dark:text-white/60 font-bold">  ]</span>{"\n"}
                    <span className="text-zinc-500 dark:text-white/60 font-bold">&#125;;</span>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Edge-to-Edge Big Wave Logo Marquee */}
        <div className="mt-16 -mx-6 md:-mx-12 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] overflow-hidden relative py-12">
          <div
            className="flex w-max items-center gap-2 sm:gap-4 md:gap-6 animate-logo-marquee hover:[animation-play-state:paused]"
            style={{ animation: "skills-marquee 22s linear infinite" }}
          >
            {[...ALL_SKILLS, ...ALL_SKILLS, ...ALL_SKILLS, ...ALL_SKILLS].map((skill, i) => (
              <div
                key={i}
                className="group cursor-pointer origin-center relative flex flex-col items-center justify-center p-1 sm:p-2"
                style={{
                  animationName: "big-wave",
                  animationDuration: "3.5s",
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${-(i * 0.2) % 3.5}s`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain drop-shadow-2xl transition-all duration-300 group-hover:scale-125"
                  style={{ filter: skill.invert ? "invert(1)" : undefined }}
                />
                <span className="absolute -bottom-6 text-xs sm:text-sm font-bold font-mono text-white whitespace-nowrap bg-black/95 px-3 py-1 rounded-md shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-20 border border-[#00ff66]/30">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   PROJECTS — 3D Hover Preview & Archive Rows
   ================================================================ */
const PROJECT_IMAGES = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop",
];

const PROJECT_COLORS = ["#00ff66", "#38bdf8", "#a855f7", "#facc15"];

const PROJECT_SHOWCASE = portfolioProjects.map((project, index) => ({
  ...project,
  desc: project.description,
  tags: project.tech,
  image: PROJECT_IMAGES[index % PROJECT_IMAGES.length],
  color: PROJECT_COLORS[index % PROJECT_COLORS.length],
  number: String(index + 1).padStart(2, "0"),
}));

export function Projects() {
  const ref = useRef(null);
  const previewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = PROJECT_SHOWCASE[activeIndex] ?? PROJECT_SHOWCASE[0];
  const ActiveIcon = activeProject.icon;

  useLayoutEffect(() => {
    if (!ref.current) return undefined;
    const root = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll(".projects-kicker, .projects-title, .projects-copy, .projects-action"),
        { y: 38, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 72%", once: true },
        }
      );

      gsap.fromTo(
        root.querySelectorAll(".project-switcher-item"),
        { y: 70, opacity: 0, rotateX: -12 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.querySelector(".project-scroll-stage"), start: "top 78%", once: true },
        }
      );

      gsap.to(root.querySelector(".project-scan-plane"), {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      });

      root.querySelectorAll(".project-switcher-item").forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!previewRef.current) return;
    gsap.fromTo(
      previewRef.current.querySelectorAll(".active-project-anim"),
      { y: 18, opacity: 0, filter: "blur(8px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.45, stagger: 0.045, ease: "power2.out" }
    );
  }, [activeIndex]);

  const handlePreviewMove = (event) => {
    const panel = previewRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(panel, {
      rotateY: x * 8,
      rotateX: -y * 8,
      transformPerspective: 1200,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const resetPreviewTilt = () => {
    if (!previewRef.current) return;
    gsap.to(previewRef.current, { rotateX: 0, rotateY: 0, duration: 0.55, ease: "power3.out" });
  };

  return (
    <section
      id="projects"
      ref={ref}
      className="reference-projects min-h-screen w-full overflow-hidden border-t border-black/10 bg-white py-14 text-black transition-colors duration-500 dark:border-white/10 dark:bg-[#050505] dark:text-white sm:py-20"
    >
      <div className="project-scan-plane pointer-events-none absolute inset-x-0 top-0 h-[130%]" />

      <div className="relative z-10 w-full px-4 sm:px-6 md:px-12">
        <div className="mb-8 flex flex-col gap-5 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="projects-kicker mb-3 text-[11px] font-black uppercase tracking-[0.32em] text-[#00ff66] sm:text-xs">
              Selected work
            </p>
            <h2 className="projects-title text-[clamp(2.85rem,14vw,4.8rem)] font-black uppercase leading-[0.82] tracking-tight text-black dark:text-white sm:text-6xl lg:text-7xl">
              PROJECTS
            </h2>
            <p className="projects-copy mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
              A layered project wall with live previews, sharp archive cards, and a mobile-first showcase frame.
            </p>
          </div>
          <Link
            href="/projects/saas-landing-page"
            className="projects-action inline-flex w-fit items-center gap-2 rounded-full border border-black/15 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:border-[#00ff66] hover:text-[#00ff66] dark:border-white/15 dark:text-white"
          >
            View All Projects <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="project-tab-rail sticky top-[72px] z-30 -mx-4 mb-5 flex h-14 items-end gap-1 overflow-x-auto border-y border-black/10 bg-white/90 px-4 pt-2 backdrop-blur-xl dark:border-white/10 dark:bg-[#050505]/90 sm:mx-0 sm:mb-8 sm:rounded-t-2xl sm:border sm:border-b-0 sm:bg-zinc-100 sm:px-3 dark:sm:bg-[#151515] lg:static lg:z-auto no-scrollbar">
          {PROJECT_SHOWCASE.map((project, index) => (
            <button
              key={project.slug}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative flex h-[42px] min-w-[152px] flex-1 items-center justify-center rounded-t-xl px-3 text-[10px] font-black uppercase tracking-[0.12em] transition sm:h-[38px] sm:text-[11px] ${
                activeIndex === index
                  ? "bg-black text-white shadow-sm dark:bg-white dark:text-black sm:bg-white sm:text-black dark:sm:bg-[#050505] dark:sm:text-white"
                  : "bg-zinc-100 text-black/55 hover:bg-zinc-200 dark:bg-white/5 dark:text-white/55 dark:hover:bg-white/10 sm:bg-zinc-200 sm:hover:bg-zinc-300 dark:sm:bg-[#2a2a2a] dark:sm:hover:bg-[#353535]"
              }`}
              data-cursor-hover
            >
              <span className="mr-2 size-2.5 rounded-full" style={{ backgroundColor: project.color }} />
              <span className="truncate">{project.title}</span>
            </button>
          ))}
        </div>

        <div className="project-scroll-stage grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div
            ref={previewRef}
            onMouseMove={handlePreviewMove}
            onMouseLeave={resetPreviewTilt}
            className="project-preview-shell relative overflow-hidden rounded-[1.8rem] border border-black/10 bg-white/90 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0a]/95 sm:p-5 lg:sticky lg:top-24"
            style={{ boxShadow: `0 26px 80px -42px ${activeProject.color}` }}
          >
            <div className="active-project-anim mb-3 flex items-center justify-between gap-3 sm:mb-4 sm:gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="grid size-11 place-items-center rounded-2xl border border-black/10 bg-black text-white shadow-lg dark:border-white/10 sm:size-12"
                  style={{ boxShadow: `0 0 24px ${activeProject.color}50` }}
                >
                  <ActiveIcon className="size-5 sm:size-6" style={{ color: activeProject.color }} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">Featured</p>
                  <p className="text-xs font-black uppercase tracking-[0.16em] sm:text-sm" style={{ color: activeProject.color }}>
                    {activeProject.category}
                  </p>
                </div>
              </div>
              <span className="font-mono text-2xl font-black text-zinc-200 dark:text-zinc-800 sm:text-3xl">
                {activeProject.number}
              </span>
            </div>

            <div className="active-project-anim project-preview-media relative mb-5 aspect-[4/5] overflow-hidden rounded-[1.45rem] border border-black/10 dark:border-white/10 sm:aspect-video sm:rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeProject.image} alt={activeProject.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
                {activeProject.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <h3 className="active-project-anim text-[clamp(1.8rem,9vw,3rem)] font-black uppercase leading-[0.92] tracking-tight sm:text-4xl">
              {activeProject.title}
            </h3>
            <p className="active-project-anim mt-4 text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
              {activeProject.overview || activeProject.desc}
            </p>

            <div className="active-project-anim mt-6 grid grid-cols-3 gap-1.5 sm:gap-2">
              {(activeProject.metrics || []).slice(0, 3).map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-black/10 bg-zinc-50 p-2.5 dark:border-white/10 dark:bg-white/5 sm:p-3">
                  <p className="text-base font-black sm:text-lg" style={{ color: activeProject.color }}>{metric.value}</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500 sm:text-[10px] sm:tracking-[0.12em]">{metric.label}</p>
                </div>
              ))}
            </div>

            <div className="active-project-anim mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <a
                href={activeProject.live}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00ff66] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-[#00cc52]"
              >
                <Eye className="size-4" /> View Live
              </a>
              <Link
                href={`/projects/${activeProject.slug}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/15 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] transition hover:border-[#00ff66] hover:text-[#00ff66] dark:border-white/15"
              >
                Details <ExternalLink className="size-4" />
              </Link>
            </div>
          </div>

          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 lg:mx-0 lg:block lg:space-y-4 lg:overflow-visible lg:px-0 lg:pb-0 no-scrollbar">
            {PROJECT_SHOWCASE.map((project, index) => (
              <button
                key={project.slug}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`project-switcher-item group relative min-w-[82vw] snap-center overflow-hidden rounded-[1.35rem] border p-4 text-left transition duration-500 sm:min-w-[58vw] sm:p-7 lg:w-full lg:min-w-0 ${
                  activeIndex === index
                    ? "border-[#00ff66]/70 bg-[#00ff66]/5 shadow-[0_20px_65px_-45px_rgba(0,255,102,0.95)]"
                    : "border-black/10 bg-zinc-50 hover:border-black/25 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/25"
                }`}
                data-cursor-hover
              >
                <div className="mb-4 aspect-[16/10] overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 lg:hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-zinc-500">{project.number}</span>
                      <span className="h-px w-10 bg-zinc-300 dark:bg-zinc-700" />
                      <span className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: project.color }}>
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black uppercase leading-[0.9] tracking-tight text-black transition group-hover:text-[#00ff66] dark:text-white sm:text-4xl lg:text-5xl">
                      {project.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {project.desc}
                    </p>
                  </div>
                  <div
                    className="grid size-12 shrink-0 place-items-center rounded-full border border-black/10 bg-white transition group-hover:rotate-[-10deg] group-hover:scale-110 dark:border-white/10 dark:bg-black"
                    style={{ color: project.color }}
                  >
                    <ArrowRight className="size-5" />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-black/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-zinc-600 dark:border-white/10 dark:text-zinc-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   EXPERIENCE — Folder Extraction Cards
   ================================================================ */
const EXPERIENCES = [
  {
    period: "2024 - Present",
    role: "Freelance Frontend Web Developer",
    company: "Client & Practice Projects",
    bullets: [
      "Built multiple responsive websites and developed practical Git/GitHub workflow experience.",
      "Delivered pixel-perfect React & Next.js user interfaces with smooth GSAP animations and Tailwind styling.",
      "Ensured mobile responsiveness, fast performance, clean modular code, and cross-browser support.",
    ],
    tags: ["React.js", "Next.js", "Tailwind CSS", "Git/GitHub", "JavaScript"],
    color: "#00ff66",
    icon: Briefcase,
  },
  {
    period: "2024",
    role: "Web Development Trainee",
    company: "WsCube Tech",
    bullets: [
      "Completed hands-on web development training across HTML, CSS, JavaScript, and React fundamentals.",
      "Practiced responsive layouts, reusable UI patterns, and clean frontend implementation.",
      "Built a strong foundation for modern React and Next.js project workflows.",
    ],
    tags: ["HTML5", "CSS3", "JavaScript", "React", "Responsive UI"],
    color: "#38bdf8",
    icon: Award,
  },
  {
    period: "2024 - Present",
    role: "React & Next.js Project Builder",
    company: "Personal Product Lab",
    bullets: [
      "Created portfolio, landing page, e-commerce, and productivity UI projects to sharpen production-ready frontend skills.",
      "Used animation, component-driven design, SEO basics, and accessible responsive patterns across projects.",
      "Focused on performance, visual polish, and converting static ideas into interactive browser experiences.",
    ],
    tags: ["Next.js", "GSAP", "UI/UX", "SEO", "Performance"],
    color: "#a855f7",
    icon: Code2,
  },
];

export function Experience() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return undefined;
    const root = ref.current;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll(".experience-title-part"),
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 72%", once: true },
        }
      );

      gsap.fromTo(
        root.querySelectorAll(".experience-panel"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root.querySelector(".experience-track"), start: "top 82%", once: true },
        }
      );
    }, root);

    mm.add("(min-width: 1024px)", () => {
      const viewport = root.querySelector(".experience-viewport");
      const track = root.querySelector(".experience-track");
      if (!viewport || !track) return undefined;

      const tween = gsap.to(track, {
        x: () => -Math.max(0, track.scrollWidth - viewport.clientWidth),
        ease: "none",
        scrollTrigger: {
          trigger: root.querySelector(".experience-pin"),
          start: "top top",
          end: () => `+=${Math.max(900, track.scrollWidth - viewport.clientWidth + window.innerHeight * 0.55)}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="experience"
      ref={ref}
      className="reference-experience relative w-full overflow-hidden border-t border-black/10 bg-zinc-50 text-black transition-colors duration-500 dark:border-white/10 dark:bg-[#020202] dark:text-white"
    >
      <div className="experience-pin px-6 py-16 sm:py-20 md:px-12">
        <div className="mb-10 flex flex-col gap-4 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="experience-title-part mb-3 text-xs font-black uppercase tracking-[0.32em] text-[#00ff66]">
              Scroll to view
            </p>
            <h2 className="experience-title-part text-4xl font-black uppercase leading-none tracking-tight text-black dark:text-white sm:text-6xl lg:text-7xl">
              EXPERIENCE
            </h2>
            <p className="experience-title-part mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
              A timeline-style track for practical development, training, and project-building work.
            </p>
          </div>
          <div className="experience-title-part inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            <span className="size-2 rounded-full bg-[#00ff66]" />
            Scroll / drag
          </div>
        </div>

        <div className="experience-viewport overflow-hidden">
          <div className="experience-track flex flex-col gap-5 lg:w-max lg:flex-row lg:gap-6">
            {EXPERIENCES.map((exp, idx) => {
              const Icon = exp.icon;
              return (
                <article
                  key={exp.role}
                  className="experience-panel relative min-h-[470px] w-full overflow-hidden rounded-[1.6rem] border border-black/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0a0a0a] sm:p-8 lg:w-[min(76vw,760px)]"
                  style={{ boxShadow: `0 24px 80px -52px ${exp.color}` }}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1" style={{ backgroundColor: exp.color }} />
                  <div className="mb-8 flex items-start justify-between gap-6 border-b border-black/10 pb-6 dark:border-white/10">
                    <div>
                      <span className="rounded-full bg-black px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white dark:bg-white dark:text-black">
                        {exp.period}
                      </span>
                      <h3 className="mt-5 text-3xl font-black uppercase leading-none tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                        {exp.role}
                      </h3>
                      <p className="mt-2 text-lg font-black uppercase tracking-[0.12em]" style={{ color: exp.color }}>
                        {exp.company}
                      </p>
                    </div>
                    <div
                      className="grid size-14 shrink-0 place-items-center rounded-2xl border border-black/10 bg-zinc-50 dark:border-white/10 dark:bg-white/5"
                      style={{ color: exp.color, boxShadow: `0 0 24px ${exp.color}35` }}
                    >
                      <Icon className="size-7" />
                    </div>
                  </div>

                  <ul className="mb-8 space-y-4">
                    {exp.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <CornerDownRight className="mt-0.5 size-5 shrink-0" style={{ color: exp.color }} />
                        <span className="text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap gap-2 border-t border-black/10 pt-6 dark:border-white/10">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"
                        style={{ borderColor: `${exp.color}55`, color: exp.color, backgroundColor: `${exp.color}10` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   EDUCATION — Hanging ID Badges / Lanyard Cards
   ================================================================ */
const EDUCATIONS = [
  {
    institution: "OSSC College",
    degree: "Bachelor of Computer Applications (BCA)",
    meta: "2024 - Present - 2nd Semester",
    desc: "Core focus on Computer Applications, Web Programming, Data Structures, and Software Development. Location: Jodhpur, Rajasthan.",
    color: "#00ff66",
    icon: GraduationCap,
    cordHeight: 120,
  },
  {
    institution: "WsCube Tech",
    degree: "Web Development Certification",
    meta: "2024 - Certified",
    desc: "Completed full web development course covering HTML, CSS, JavaScript, React, and modern UI engineering standards.",
    color: "#38bdf8",
    icon: Award,
    cordHeight: 150,
  },
  {
    institution: "Self Learning Lab",
    degree: "React & Next.js Practice",
    meta: "2024 - Present",
    desc: "Continuous project-based learning across responsive UI, animation, deployment, SEO, and frontend performance.",
    color: "#facc15",
    icon: School,
    cordHeight: 132,
  },
];

export function Education() {
  const ref = useRef(null);
  const dragStartRef = useRef(null);
  const [sway, setSway] = useState(() => EDUCATIONS.map(() => 0));
  const [drag, setDrag] = useState({ index: null, x: 0, y: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return undefined;
    const root = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll(".education-title-part"),
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 72%", once: true },
        }
      );

      gsap.fromTo(
        root.querySelectorAll(".education-card"),
        { y: 72, opacity: 0, rotate: -4 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "elastic.out(1, 0.72)",
          scrollTrigger: { trigger: root.querySelector(".education-card-grid"), start: "top 78%", once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const handleCardHover = (index) => {
    setSway((prev) => {
      const next = [...prev];
      next[index] = next[index] === 0 ? 8 : -next[index];
      return next;
    });
    setTimeout(() => {
      setSway((prev) => {
        const next = [...prev];
        next[index] = 0;
        return next;
      });
    }, 1200);
  };

  const startDrag = (event, index) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragStartRef.current = {
      index,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
    setDrag({ index, x: 0, y: 0 });
  };

  const moveDrag = (event, index) => {
    const start = dragStartRef.current;
    if (!start || start.index !== index) return;
    const x = Math.max(-46, Math.min(46, event.clientX - start.startX));
    const y = Math.max(-18, Math.min(28, event.clientY - start.startY));
    if (Math.abs(x) + Math.abs(y) > 4) start.moved = true;
    setDrag({ index, x, y });
  };

  const endDrag = (event, index) => {
    const start = dragStartRef.current;
    if (!start || start.index !== index) return;
    event.currentTarget.releasePointerCapture?.(start.pointerId);
    dragStartRef.current = null;
    setDrag({ index: null, x: 0, y: 0 });
    handleCardHover(index);
  };

  return (
    <section
      id="education"
      ref={ref}
      className="reference-education relative flex min-h-screen w-full flex-col overflow-hidden border-t border-black/10 bg-white pt-16 text-black transition-colors duration-500 dark:border-white/5 dark:bg-[#020202] dark:text-white sm:pt-20"
    >
      <div className="relative z-10 w-full px-6 md:px-12">
        <div className="mb-10 flex flex-col gap-4 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="education-title-part mb-3 text-xs font-black uppercase tracking-[0.32em] text-[#00ff66]">
              Drag or click card
            </p>
            <h2 className="education-title-part text-4xl font-black uppercase leading-none tracking-tight text-black dark:text-white sm:text-6xl lg:text-7xl">
            EDUCATION &amp; CERTIFICATION
            </h2>
            <p className="education-title-part mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
              Hanging lanyard cards with drag/click swing interactions, adapted for mobile and desktop.
            </p>
          </div>
          <div className="education-title-part inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-zinc-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            <Backpack className="size-4 text-[#00ff66]" />
            Learning Track
          </div>
        </div>
      </div>

      <div className="education-card-grid relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-10 px-6 pb-16 md:px-12 lg:flex-row lg:items-start lg:gap-8 xl:gap-12">
        {EDUCATIONS.map((item, idx) => {
          const isDragging = drag.index === idx;
          const cardTransform = isDragging
            ? `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${drag.x / 13}deg)`
            : `rotate(${sway[idx]}deg)`;

          return (
            <div
              key={item.degree}
              className="education-card flex w-full max-w-[360px] touch-none select-none flex-col items-center lg:w-[32%]"
              onPointerDown={(event) => startDrag(event, idx)}
              onPointerMove={(event) => moveDrag(event, idx)}
              onPointerUp={(event) => endDrag(event, idx)}
              onPointerCancel={(event) => endDrag(event, idx)}
              onMouseEnter={() => handleCardHover(idx)}
              data-cursor-hover
            >
              <div className="relative z-10 size-3 rounded-full shadow-md" style={{ background: item.color, boxShadow: `0 0 18px ${item.color}` }} />

              <div
                className="flex w-full flex-col items-center transition-transform duration-700 ease-out"
                style={{
                  transform: cardTransform,
                  transformOrigin: "top center",
                  marginTop: "-6px",
                  cursor: isDragging ? "grabbing" : "grab",
                }}
              >
                <svg width="34" height={item.cordHeight} viewBox={`0 0 34 ${item.cordHeight}`} style={{ display: "block", margin: "0 auto", overflow: "visible" }}>
                  <circle cx="17" cy="0" r="5" fill="#27272a" />
                  <path d={`M 15 0 L 10 ${item.cordHeight}`} stroke="#27272a" strokeWidth="5" opacity="0.9" />
                  <path d={`M 19 0 L 24 ${item.cordHeight}`} stroke="#27272a" strokeWidth="5" opacity="0.9" />
                  <rect x="11" y={item.cordHeight - 7} width="12" height="9" rx="2" fill="#94a3b8" />
                  <circle cx="17" cy={item.cordHeight + 2} r="3" fill="#e2e8f0" />
                </svg>

                <div
                  className="relative mt-[-2px] w-full overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/95 shadow-2xl backdrop-blur-xl transition hover:scale-[1.025] dark:border-white/10 dark:bg-[#0a0a0a]/95"
                  style={{ boxShadow: `0 24px 62px -28px ${item.color}80` }}
                >
                  <div className="absolute inset-x-0 top-0 h-1" style={{ background: item.color }} />
                  <div className="relative z-10 flex flex-col items-center gap-3 px-5 py-7 sm:px-6 sm:py-8">
                    <div
                      className="grid size-20 place-items-center rounded-2xl border border-black/10 bg-zinc-50 shadow-xl dark:border-white/10 dark:bg-black/20"
                      style={{ boxShadow: `0 0 24px ${item.color}40` }}
                    >
                      <item.icon className="size-10" style={{ color: item.color }} />
                    </div>
                    <p className="text-center text-xs font-black uppercase tracking-[0.18em] text-zinc-900 dark:text-white sm:text-sm">
                      {item.institution}
                    </p>
                  </div>

                  <div className="relative z-10 flex flex-1 flex-col items-center gap-2 px-5 pb-6 sm:px-7">
                    <p className="text-center text-lg font-black uppercase leading-tight sm:text-xl" style={{ color: item.color }}>
                      {item.degree}
                    </p>
                    <p className="text-center text-xs font-black uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                      {item.meta}
                    </p>
                    <p className="mt-3 border-t border-zinc-200 px-2 pt-4 text-center text-xs font-medium leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                      {item.desc}
                    </p>

                    <div className="my-3 w-full border-t border-dashed border-zinc-300 dark:border-zinc-800" />
                    <div className="flex h-6 items-end gap-[3px] opacity-30">
                      {[50, 80, 65, 30, 90, 45, 75, 60, 20, 85, 40, 70, 95, 35, 55, 78, 62].map((height, i) => (
                        <div key={i} className="rounded-[1px] bg-black dark:bg-white" style={{ width: "3px", height: `${height}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ================================================================
   CONTACT — Three.js Wave Background + 2 Buttons + Social Orbit
   ================================================================ */
const SOCIAL_ORBITS = [
  { name: "Email", icon: Mail, color: "#f43f5e", radius: 50, speed: 22, href: "mailto:takkgourav@gmail.com" },
  { name: "Phone", icon: Phone, color: "#22c55e", radius: 80, speed: 28, href: "tel:+916377093772" },
  { name: "LinkedIn", icon: Linkedin, color: "#0077b5", radius: 110, speed: 34, href: "https://www.linkedin.com/in/gourav-takk-674abb367" },
  { name: "GitHub", icon: Github, color: "#a855f7", radius: 140, speed: 40, href: "https://github.com/takkgourav-cmyk" },
  { name: "Direct Message", icon: Send, color: "#00ff66", radius: 170, speed: 46, href: "https://mail.google.com/mail/?view=cm&fs=1&to=takkgourav@gmail.com" },
];

export function Contact() {
  return (
    <section id="contact" className="min-h-screen w-full flex flex-col pt-16 sm:pt-20 pb-20 border-t border-black/10 dark:border-white/5 relative overflow-hidden bg-white dark:bg-[#020202] transition-colors duration-500">
      {/* 3D Three.js Background Canvas */}
      <div className="absolute inset-0 z-0 hidden md:block pointer-events-none opacity-60 dark:opacity-80">
        <ThreeContactBackground />
      </div>

      <div className="w-full px-6 md:px-12 z-10 relative">
        <div className="mb-10 sm:mb-14">
          <h2 className="text-3xl md:text-5xl font-bold font-montserrat mt-2 tracking-tight text-black dark:text-white">
            CONTACT
          </h2>
          <div className="h-[2px] w-20 mt-4 bg-zinc-900 dark:bg-[#00ff66]" />
        </div>
      </div>

      <div className="flex-1 w-full px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 pt-0 pb-12 z-10 relative">
        {/* Left: Heading & 2 Clean Action Buttons */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl text-center lg:text-left">
          <h3 className="text-4xl md:text-6xl font-black mb-6 uppercase leading-tight text-black dark:text-white font-montserrat">
            Let&apos;s Connect
          </h3>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed font-medium">
            I am always open to discussing new tech, web development opportunities, or collaborative projects. Feel free to send me a message directly or connect through my <span className="text-[#00ff66] font-bold">Social Orbit!</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <a
              href="mailto:takkgourav@gmail.com?subject=Message%20from%20Portfolio&body=Hello%20Gourav,"
              onClick={(e) => {
                // Open Gmail Web Compose directly in a new tab
                window.open(
                  "https://mail.google.com/mail/?view=cm&fs=1&to=takkgourav@gmail.com&su=Message%20from%20Portfolio&body=Hello%20Gourav,",
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-[#00ff66] text-white dark:text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 shadow-xl transition-all cursor-pointer select-none"
            >
              <Send className="size-5" />Send Message
            </a>
            <a
              href="/Gourav_Takk_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-black/20 dark:border-white/20 text-black dark:text-white font-bold uppercase tracking-widest rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer select-none"
            >
              <ExternalLink className="size-5" />Resume
            </a>
          </div>
        </div>

        {/* Right: Social Orbit with Concentric Rings */}
        <div className="flex-1 flex justify-center items-center w-full mt-6 lg:mt-0">
          <div className="scale-75 sm:scale-90 md:scale-100 xl:scale-105 origin-center transition-transform duration-500">
            <div className="relative w-[400px] h-[400px] flex items-center justify-center">
              {[100, 160, 220, 280, 340].map((diameter, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-dashed pointer-events-none border-black/30 dark:border-white/20"
                  style={{
                    width: `${diameter}px`,
                    height: `${diameter}px`,
                    borderWidth: i % 2 === 0 ? "1px" : "1.5px",
                  }}
                />
              ))}

              {/* Central Glowing Cyber Core */}
              <div className="z-20 relative grid place-content-center p-3.5 rounded-full bg-black/90 backdrop-blur-md shadow-[0_0_25px_rgba(0,255,102,0.4)] border border-[#00ff66]/40">
                <CodeXml className="size-6 text-[#00ff66] animate-pulse" />
              </div>

              {/* Orbiting Planetary Social Icons */}
              {SOCIAL_ORBITS.map((item) => (
                <div
                  key={item.name}
                  className="absolute pointer-events-none"
                  style={{
                    width: `${item.radius * 2}px`,
                    height: `${item.radius * 2}px`,
                    animation: `spin ${item.speed}s linear infinite`,
                  }}
                >
                  <div
                    className="absolute pointer-events-auto cursor-pointer"
                    style={{
                      top: "0",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="group size-12 rounded-full border-2 shadow-lg flex items-center justify-center bg-white dark:bg-black relative transition-transform hover:scale-125"
                      style={{
                        borderColor: item.color,
                        boxShadow: `0 0 12px ${item.color}40`,
                        animation: `counter-spin ${item.speed}s linear infinite`,
                      }}
                      title={item.name}
                    >
                      <item.icon className="size-5" style={{ color: item.color }} />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/90 text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                        {item.name}
                      </span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SERVICES
   ================================================================ */
export function Services() {
  const items = [
    { icon: Code2, title: "Web Development", desc: "End-to-end websites with modern stacks, responsive layouts and industry best practices.", color: "#00ff66" },
    { icon: Layout, title: "Frontend Development", desc: "Pixel-perfect React & Next.js interfaces with high-performance animations and full responsiveness.", color: "#00ffff" },
    { icon: Server, title: "Backend Development", desc: "REST APIs and server integrations using Node.js and database fundamentals.", color: "#ff00ff" },
    { icon: Palette, title: "Website Design", desc: "Clean, modern UI design with careful attention to typography, micro-animations and spacing.", color: "#ffcc00" },
  ];

  return (
    <section id="services" className="pt-12 pb-20 md:pt-14 md:pb-28 px-6 md:px-12 border-t border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-[#020202] text-black dark:text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 sm:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold font-montserrat tracking-tight text-black dark:text-white">
            SERVICES
          </h2>
          <div className="h-[2px] w-20 mt-4 bg-zinc-900 dark:bg-[#00ff66]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((s) => (
            <div key={s.title} className="service-card group rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 hover:-translate-y-2 transition-all duration-300 shadow-md">
              <div className="size-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                <s.icon className="size-6" style={{ color: s.color }} />
              </div>
              <h3 className="font-black text-lg mb-2 text-black dark:text-white font-montserrat">{s.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   FOOTER
   ================================================================ */
export function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 py-10 px-6 md:px-12 bg-white dark:bg-[#020202] text-black dark:text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="text-center md:text-left">
          <div className="font-black text-lg font-mono">
            <span className="text-[#00ff66]">&lt;</span>
            <span>GOURAV TAKK</span>
            <span className="mx-1 animate-pulse text-[#00ff66]">_</span>
            <span className="text-[#00ff66]">/&gt;</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">© {new Date().getFullYear()} Gourav Takk. All Rights Reserved. (+91 63770 93772 | takkgourav@gmail.com)</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-500">
          {["home", "about", "skills", "projects", "experience", "education", "contact"].map((s) => (
            <a key={s} href={`#${s}`} className="hover:text-[#00ff66] transition-colors">{s}</a>
          ))}
        </nav>

        <div className="flex gap-3">
          {[
            { icon: Github, href: "https://github.com/takkgourav-cmyk" },
            { icon: Linkedin, href: "https://www.linkedin.com/in/gourav-takk-674abb367" },
            { icon: Mail, href: "mailto:takkgourav@gmail.com" },
            { icon: Phone, href: "tel:+916377093772" },
          ].map(({ icon: Icon, href }, i) => (
            <a
              key={i} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
              className="p-2.5 rounded-full border border-black/10 dark:border-white/10 hover:border-[#00ff66] hover:text-[#00ff66] transition-all shadow-sm"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function RevealMount() {
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);
    return () => clearTimeout(timer);
  }, []);
  return null;
}
