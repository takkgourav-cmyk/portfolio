"use client";

import * as React from "react";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  Briefcase,
  Code2,
  Download,
  Github,
  Instagram,
  GraduationCap,
  Layout,
  Linkedin,
  Mail,
  MapPin,
  Palette,
  Phone,
  Server,
  Star,
  ExternalLink,
  Send,
  Award,
} from "lucide-react";
import profile from "@/assets/profile-developer.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useContent } from "./content";
import { Magnetic } from "./Effects";

gsap.registerPlugin(ScrollTrigger);

/* ============= Typewriter (sequence of messages) ============= */
export function Typewriter({ keys, className }) {
  const { t } = useContent();
  const [text, setText] = React.useState("");
  const idxRef = useRef(0);
  const charRef = useRef(0);
  const phaseRef = useRef("type");

  useEffect(() => {
    idxRef.current = 0;
    charRef.current = 0;
    phaseRef.current = "type";
    setText("");
    let timer;
    const tick = () => {
      const messages = keys.map((k) => t(k));
      const current = messages[idxRef.current % messages.length];
      if (phaseRef.current === "type") {
        charRef.current++;
        setText(current.slice(0, charRef.current));
        if (charRef.current >= current.length) {
          phaseRef.current = "hold";
          timer = setTimeout(tick, 1400);
          return;
        }
        timer = setTimeout(tick, 55 + Math.random() * 50);
      } else if (phaseRef.current === "hold") {
        phaseRef.current = "delete";
        timer = setTimeout(tick, 200);
      } else {
        charRef.current--;
        setText(current.slice(0, Math.max(charRef.current, 0)));
        if (charRef.current <= 0) {
          phaseRef.current = "type";
          idxRef.current++;
          timer = setTimeout(tick, 300);
          return;
        }
        timer = setTimeout(tick, 28);
      }
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.join("|")]);

  return (
    <span className={className}>
      {text}
      <span className="typing-caret" />
    </span>
  );
}

function CountNumber({ end, suffix = "", className = "", duration = 1500 }) {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    let frame;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const startTime = performance.now();
            const tick = (now) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(eased * end);
              setCount(current);
              if (progress < 1) frame = requestAnimationFrame(tick);
            };
            frame = requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [duration, end]);

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
}

function CountUp({ end, suffix, label }) {
  return (
    <div>
      <div className="text-2xl font-bold gradient-text">
        <CountNumber end={end} suffix={suffix} />
      </div>
      {label && <div className="text-muted-foreground">{label}</div>}
    </div>
  );
}

export function Hero() {
  const ref = useRef(null);
  const floatRef = useRef(null);
  const faceRef = useRef(null);
  const { t } = useContent();

  useLayoutEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    let frame;
    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray(".hero-anim");
      const heroImage = root.querySelector(".hero-img");
      gsap.set([...heroItems, heroImage], { opacity: 1, visibility: "visible" });
      gsap.fromTo(
        heroItems,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.09, clearProps: "transform,opacity,visibility" }
      );
      gsap.fromTo(
        heroImage,
        { x: 70, y: 18, scale: 0.9, rotate: 3, opacity: 0 },
        {
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 1.05,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            once: true,
          },
        }
      );
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      gsap.to(floatRef.current, {
        y: -9,
        duration: 3.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".hero-bg-orb", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    const heroImage = root.querySelector(".hero-img");
    const face = faceRef.current;
    const finePointer = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;
    let onParallax;
    let onTilt;
    let onTiltLeave;

    if (finePointer && heroImage && face) {
      onParallax = (event) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 14;
        const y = (event.clientY / window.innerHeight - 0.5) * 10;
        gsap.to(heroImage, { x, y, duration: 0.8, ease: "power2.out", overwrite: "auto" });
      };
      onTilt = (event) => {
        const bounds = face.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        gsap.to(face, {
          rotateY: x * 9,
          rotateX: -y * 9,
          transformPerspective: 1100,
          transformOrigin: "center",
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      onTiltLeave = () => {
        gsap.to(face, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          ease: "power3.out",
          overwrite: "auto",
        });
      };
      root.addEventListener("mousemove", onParallax);
      face.addEventListener("mousemove", onTilt);
      face.addEventListener("mouseleave", onTiltLeave);
    }

    return () => {
      if (onParallax) root.removeEventListener("mousemove", onParallax);
      if (onTilt) face.removeEventListener("mousemove", onTilt);
      if (onTiltLeave) face.removeEventListener("mouseleave", onTiltLeave);
      cancelAnimationFrame(frame);
      gsap.set(root.querySelectorAll(".hero-anim, .hero-img"), {
        clearProps: "transform,opacity,visibility",
      });
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className="hero-premium relative min-h-screen overflow-hidden px-4 pb-16 pt-20 sm:px-6 sm:pt-24"
    >
      <div className="hero-bg-orb absolute inset-0 -z-10 opacity-20 [background:radial-gradient(circle_at_70%_40%,var(--color-primary),transparent_48%)]" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="hero-anim mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
            <span aria-hidden="true">👋</span> {t("hero.title.hi")}
          </span>
          <h1 className="hero-anim mb-5 text-5xl font-bold tracking-[-0.055em] leading-[0.9] sm:text-6xl lg:text-7xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="block">Gourav</span>
            <span className="block text-primary">Takk</span>
          </h1>
          <p className="hero-anim mb-5 min-h-[1.6em] text-lg font-medium sm:text-xl">
            <Typewriter keys={["typing.1","typing.2","typing.3","typing.4","typing.5"]} className="text-primary" />
          </p>
          <p className="hero-anim mb-8 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
            {t("hero.intro")}
          </p>
          <div className="hero-anim flex flex-wrap gap-3">
            <Magnetic>
              <Button asChild size="lg" className="gradient-bg text-primary-foreground border-0 shadow-elegant hover:scale-105 transition-transform">
                <a href="/Gourav_Takk_Resume.pdf" download><Download className="mr-1" /> Download CV</a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild size="lg" variant="outline" className="glass">
                <a href="#projects">View My Work <ExternalLink className="ml-1" /></a>
              </Button>
            </Magnetic>
          </div>
          <div className="hero-anim mt-8 flex gap-3">
            {[
              { icon: Github, href: "https://github.com/takkgourav-cmyk", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/gourav-takk-674abb367", label: "LinkedIn" },
              { icon: Instagram, href: "https://www.instagram.com/", label: "Instagram" },
              { icon: Mail, href: "mailto:takkgourav@gmail.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" aria-label={label} className="flex size-11 items-center justify-center rounded-full border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary hover:text-primary">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="hero-img relative mx-auto mt-6 w-full max-w-[270px] sm:mt-8 sm:max-w-[350px] lg:mt-10 lg:max-w-[430px]">
          <div ref={floatRef} className="relative will-change-transform">
            <div ref={faceRef} className="profile-tilt relative cursor-hover will-change-transform" style={{ transformStyle: "preserve-3d" }}>
            <div className="profile-frame relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-card p-2 sm:p-3">
              <Image
                src={profile}
                alt="Gourav Takk, frontend and React developer"
                width={768}
                height={960}
                priority
                quality={95}
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 400px"
                onLoad={() => ScrollTrigger.refresh()}
                className="size-full rounded-[1.25rem] object-cover object-top bg-background contrast-[1.04] brightness-[1.03] saturate-[1.02]"
              />
            </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-anim mx-auto mt-10 grid max-w-7xl grid-cols-2 overflow-hidden rounded-[1.5rem] border border-primary/20 bg-card shadow-elegant md:grid-cols-4">
        {[
          { icon: Code2, end: 10, label: "Projects Completed" },
          { icon: Layout, end: 9, label: "Technologies" },
          { icon: Award, end: 1, label: "Year of Coding" },
          { icon: Star, end: 5, label: "Happy Clients" },
        ].map(({ icon: Icon, end, label }) => (
          <div key={label} className="border-border p-6 text-center even:border-l md:border-l md:first:border-l-0">
            <Icon className="mx-auto mb-2 size-6 text-primary" />
            <CountUp end={end} suffix="+" label={label} />
          </div>
        ))}
      </div>
    </section>
  );
}

const tickerItems = [
  "Available for Freelance Projects",
  "Frontend Developer",
  "React Developer",
  "Open to Work",
  "Building Modern Websites",
  "Clean Code",
];

export function NewsTicker() {
  const content = tickerItems.map((item) => (
    <React.Fragment key={item}>
      <span>{item}</span>
      <span aria-hidden="true" className="text-primary">•</span>
    </React.Fragment>
  ));

  return (
    <aside className="ticker border-y border-border bg-card py-3" aria-label="Current availability">
      <div className="ticker-track text-sm font-medium text-muted-foreground">
        <div className="ticker-group">{content}</div>
        <div className="ticker-group" aria-hidden="true">{content}</div>
      </div>
    </aside>
  );
}

function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-8 reveal">
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">{eyebrow}</span>
      <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {title}
      </h2>
      {sub && <p className="text-muted-foreground">{sub}</p>}
    </div>
  );
}

function useReveal() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray(".reveal");
      gsap.set(els, { opacity: 1, visibility: "visible" });
      els.forEach((el) => {
        gsap.fromTo(el, { y: 28, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => ctx.revert();
  }, []);
}

export function About() {
  const ref = useRef(null);
  const { t } = useContent();
  const aboutCards = [
    { icon: GraduationCap, label: t("about.card.education"), value: "BCA - OSSC College" },
    { icon: MapPin, label: t("about.card.location"), value: "Jodhpur, Rajasthan" },
    { icon: Award, label: t("about.card.certified"), value: "WsCube Tech" },
  ];

  useLayoutEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    const leftPanel = root.querySelector(".about-left");
    const rightPanel = root.querySelector(".about-right");
    const distance = window.innerWidth < 768 ? 70 : 170;

    const ctx = gsap.context(() => {
      gsap.set([leftPanel, rightPanel], { opacity: 1, visibility: "visible" });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 95%",
          end: "bottom 5%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(
          leftPanel,
          { x: -distance, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
          0
        )
        .fromTo(
          rightPanel,
          { x: distance, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
          0
        )
        .to([leftPanel, rightPanel], { opacity: 1, duration: 0.65 })
        .to(leftPanel, { x: -distance, opacity: 0, duration: 1, ease: "power2.in" })
        .to(rightPanel, { x: distance, opacity: 0, duration: 1, ease: "power2.in" }, "<");

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={ref} className="overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow={t("about.eyebrow")} title={t("about.title")} />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="about-left glass rounded-2xl p-6 shadow-elegant md:col-span-2">
            <h3 className="font-semibold text-lg mb-3">{t("about.who.title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t("about.who.body")}
            </p>
            <h3 className="font-semibold text-lg mb-3">{t("about.goal.title")}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("about.goal.body")}
            </p>
          </div>
          <div className="about-right grid gap-4">
            {aboutCards.map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass rounded-2xl p-5 shadow-elegant hover:-translate-y-1 transition-transform">
                <Icon className="size-5 text-primary mb-2" />
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
                <div className="font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const skills = [
  { name: "HTML", category: "Structure", level: 95, icon: Code2 },
  { name: "CSS", category: "Styling", level: 90, icon: Palette },
  { name: "JavaScript", category: "Language", level: 85, icon: Code2 },
  { name: "React.js", category: "Frontend", level: 82, icon: Layout },
  { name: "Next.js", category: "Framework", level: 75, icon: Layout },
  { name: "Tailwind CSS", category: "Styling", level: 90, icon: Palette },
  { name: "Node.js", category: "Backend", level: 65, icon: Server },
  { name: "Python", category: "Language", level: 60, icon: Code2 },
  { name: "UI/UX Design", category: "Design", level: 78, icon: Palette },
];

export function Skills() {
  const ref = useRef(null);
  const { t } = useContent();

  useLayoutEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll(".skill-card"),
        {
          x: (index) => (index % 2 === 0 ? -48 : 48),
          y: 30,
          rotateY: (index) => (index % 2 === 0 ? -7 : 7),
          opacity: 0,
          scale: 0.96,
        },
        {
          x: 0,
          y: 0,
          rotateY: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "back.out(1.2)",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            once: true,
          },
        }
      );
      gsap.utils.toArray(".skill-icon").forEach((icon, index) => {
        gsap.to(icon, {
          y: -4,
          rotate: index % 2 === 0 ? -3 : 3,
          duration: 1.7 + (index % 3) * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
      gsap.fromTo(
        root.querySelectorAll(".skill-meter-fill"),
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          stagger: 0.06,
          ease: "power3.out",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true,
          },
        }
      );
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={ref} className="skills-premium px-4 py-10 sm:px-6 sm:py-14">
      <header className="relative z-10 mx-auto mb-8 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {t("skills.eyebrow")}
        </span>
        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{t("skills.title")}</h2>
        <p className="mt-3 text-muted-foreground">{t("skills.sub")}</p>
      </header>
      <div className="relative z-10 mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Technical skills">
        {skills.map((skill, index) => {
          const Icon = skill.icon;
          return (
            <div
              key={skill.name}
              className="skill-card group relative min-h-56 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-md"
              role="listitem"
            >
              <div className="skill-card-head flex items-center justify-between">
                <span className="skill-icon flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="skill-number text-3xl font-bold">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="mt-6">
                <p className="skill-category">{skill.category}</p>
                <h3 className="mt-1 text-xl font-bold">{skill.name}</h3>
              </div>
              <div className="skill-card-foot mt-7 flex items-center justify-between text-xs text-muted-foreground">
                <span>Proficiency</span>
                <strong className="text-primary">
                  <CountNumber end={skill.level} suffix="%" />
                </strong>
              </div>
              <div className="skill-meter mt-2 h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                <div className="skill-meter-fill h-full rounded-full bg-primary" style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const projects = [
  {
    titleKey: "project.1.title",
    descKey: "project.1.desc",
    tech: ["Next.js", "Tailwind", "GSAP"],
    live: "https://gourav-takk-portfolio.vercel.app/",
    github: "https://github.com/takkgourav-cmyk/portfolio",
  },
  {
    titleKey: "project.2.title",
    descKey: "project.2.desc",
    tech: ["React", "Tailwind", "Vite"],
    github: "https://github.com/takkgourav-cmyk",
  },
  {
    titleKey: "project.3.title",
    descKey: "project.3.desc",
    tech: ["HTML", "CSS", "Bootstrap"],
    github: "https://github.com/takkgourav-cmyk/portfolio",
  },
  {
    titleKey: "project.4.title",
    descKey: "project.4.desc",
    tech: ["React", "TypeScript"],
    github: "https://github.com/takkgourav-cmyk",
  },
];

export function Projects() {
  const { t } = useContent();
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    const cleanups = [];
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".project-card");
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          once: true,
        },
      });

      timeline
        .fromTo(
          cards,
          { y: 70, opacity: 0, scale: 0.94, rotateX: 8 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 0.85,
            ease: "back.out(1.15)",
            stagger: 0.12,
            clearProps: "opacity",
          }
        )
        .fromTo(
          ".project-tech",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power2.out", stagger: 0.035 },
          "-=0.35"
        );

      gsap.to(".project-orb", {
        x: 18,
        y: -12,
        scale: 1.12,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });

      cards.forEach((card) => {
        const icon = card.querySelector(".project-preview-icon");
        const onMove = (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateY: x * 8,
            rotateX: -y * 8,
            y: -8,
            transformPerspective: 900,
            transformOrigin: "center",
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
          if (icon) {
            gsap.to(icon, {
              x: x * 16,
              y: y * 16,
              rotate: x * 16,
              scale: 1.08,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        };
        const onLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            overwrite: "auto",
          });
          if (icon) {
            gsap.to(icon, {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              duration: 0.55,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);
    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);
  return (
    <section id="projects" className="px-4 py-10 sm:px-6 sm:py-14" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow={t("projects.eyebrow")} title={t("projects.title")} sub={t("projects.sub")} />
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <article key={p.titleKey} className="project-card tilt-card cursor-hover group glass rounded-3xl overflow-hidden shadow-elegant">
              <div className="h-48 bg-secondary border-b border-border relative flex items-center justify-center overflow-hidden">
                <div className="project-orb absolute -right-10 -top-10 size-36 rounded-full bg-primary/10" />
                <Code2 className="project-preview-icon size-14 text-primary" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{t(p.titleKey)}</h3>
                <p className="text-muted-foreground text-sm mb-4">{t(p.descKey)}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.tech.map((t) => (
                    <span key={t} className="project-tech text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {p.live && (
                    <Button asChild size="sm" className="gradient-bg text-primary-foreground border-0 shadow-sm transition-transform hover:-translate-y-0.5">
                      <a href={p.live} target="_blank" rel="noreferrer" aria-label={`${t(p.titleKey)} live demo`}>
                        <ExternalLink className="mr-1 size-3.5" /> {t("project.live")}
                      </a>
                    </Button>
                  )}
                  <Button asChild size="sm" variant="outline">
                    <a href={p.github} target="_blank" rel="noreferrer" aria-label={`${t(p.titleKey)} source code on GitHub`}>
                      <Github className="mr-1 size-3.5" /> {t("project.github")}
                    </a>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const timelineItems = [
  { yearKey: "timeline.1.year", titleKey: "timeline.1.title", descKey: "timeline.1.desc", icon: GraduationCap },
  { yearKey: "timeline.2.year", titleKey: "timeline.2.title", descKey: "timeline.2.desc", icon: Award },
  { yearKey: "timeline.3.year", titleKey: "timeline.3.title", descKey: "timeline.3.desc", icon: Briefcase },
];

export function Experience() {
  const { t } = useContent();
  return (
    <section id="experience" className="bg-secondary/40 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <SectionTitle eyebrow={t("exp.eyebrow")} title={t("exp.title")} />
        <div className="relative pl-8 sm:pl-12">
          <div className="absolute left-3 sm:left-5 top-0 bottom-0 w-px gradient-bg" />
          {timelineItems.map((item) => (
            <div key={item.titleKey} className="reveal relative mb-10 last:mb-0">
              <div className="absolute -left-[26px] sm:-left-[34px] top-1 size-7 rounded-full gradient-bg flex items-center justify-center shadow-elegant">
                <item.icon className="size-3.5 text-primary-foreground" />
              </div>
              <div className="glass rounded-2xl p-5 shadow-elegant">
                <div className="text-xs font-semibold text-primary mb-1">{t(item.yearKey)}</div>
                <h3 className="font-bold text-lg">{t(item.titleKey)}</h3>
                <p className="text-muted-foreground text-sm mt-1">{t(item.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const serviceItems = [
  { icon: Code2, titleKey: "service.1.title", descKey: "service.1.desc" },
  { icon: Layout, titleKey: "service.2.title", descKey: "service.2.desc" },
  { icon: Server, titleKey: "service.3.title", descKey: "service.3.desc" },
  { icon: Palette, titleKey: "service.4.title", descKey: "service.4.desc" },
];

export function Services() {
  const { t } = useContent();
  return (
    <section id="services" className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow={t("services.eyebrow")} title={t("services.title")} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceItems.map((s) => (
            <div key={s.titleKey} className="reveal glass rounded-2xl p-6 shadow-elegant hover:-translate-y-2 hover:shadow-glow transition-all group">
              <div className="size-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <s.icon className="size-6 text-primary-foreground" />
              </div>
              <h3 className="font-bold mb-2">{t(s.titleKey)}</h3>
              <p className="text-sm text-muted-foreground">{t(s.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonialItems = [
  { name: "Aarav Sharma", roleKey: "test.role.1", textKey: "test.1.text" },
  { name: "Priya Mehta", roleKey: "test.role.2", textKey: "test.2.text" },
  { name: "Rohit Verma", roleKey: "test.role.3", textKey: "test.3.text" },
];

export function Testimonials() {
  const { t } = useContent();
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const total = testimonialItems.length;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 4500);
    return () => clearInterval(id);
  }, [paused, total]);

  return (
    <section className="bg-secondary/40 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow={t("test.eyebrow")} title={t("test.title")} />
        <div
          className="reveal relative max-w-3xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {testimonialItems.map((tm) => (
                <figure
                  key={tm.name}
                  className="shrink-0 w-full glass p-8 sm:p-10 shadow-elegant text-center"
                >
                  <div className="flex justify-center gap-0.5 mb-4 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-base sm:text-lg text-foreground/90 leading-relaxed mb-5 italic">
                    "{t(tm.textKey)}"
                  </blockquote>
                  <figcaption>
                    <div className="font-semibold">{tm.name}</div>
                    <div className="text-xs text-muted-foreground">{t(tm.roleKey)}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonialItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 gradient-bg" : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { t } = useContent();
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = React.useState({});

  const validate = () => {
    const e = {};
    const name = values.name.trim();
    const email = values.email.trim();
    const phone = values.phone.trim();
    const subject = values.subject.trim();
    const message = values.message.trim();

    if (!name) e.name = t("contact.error.name.required");
    else if (!/^[A-Za-z\s]+$/.test(name))
      e.name = t("contact.error.name.letters");

    if (!email) e.email = t("contact.error.email.required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = t("contact.error.email.valid");

    if (!phone) e.phone = t("contact.error.phone.required");
    else if (!/^\d{7,15}$/.test(phone))
      e.phone = t("contact.error.phone.valid");

    if (!subject) e.subject = t("contact.error.subject.required");
    if (!message) e.message = t("contact.error.message.required");

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (ev) => {
    let v = ev.target.value;
    if (field === "phone") v = v.replace(/[^\d]/g, "");
    if (field === "name") v = v.replace(/[^A-Za-z\s]/g, "");
    setValues((s) => ({ ...s, [field]: v }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error(t("contact.error.fix"));
      return;
    }
    const { name, email, phone, subject, message } = values;

    setSubmitting(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/takkgourav@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          _replyto: email,
          phone,
          _subject: `[Portfolio] ${subject}`,
          message,
          _template: "table",
          _captcha: "false",
        }),
      });
      const result = await res.json();
      if (!res.ok || result.success === false || result.success === "false") {
        throw new Error(result.message || "Failed");
      }
      toast.success(t("contact.success"));
      setValues({ name: "", email: "", phone: "", subject: "", message: "" });
      setErrors({});
    } catch {
      toast.error(t("contact.fail"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow={t("contact.eyebrow")} title={t("contact.title")} sub={t("contact.sub")} />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="reveal space-y-4">
            {[
              { icon: Mail, label: t("contact.label.email"), value: "takkgourav@gmail.com", href: "mailto:takkgourav@gmail.com" },
              { icon: Phone, label: t("contact.label.phone"), value: "+91 63770 93772", href: "tel:+916377093772" },
              { icon: MapPin, label: t("contact.label.location"), value: "Jodhpur, Rajasthan, India" },
              { icon: Linkedin, label: "LinkedIn", value: "gourav-takk", href: "https://www.linkedin.com/in/gourav-takk-674abb367" },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href ?? "#"}
                target={c.href?.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-center gap-4 glass rounded-2xl p-4 shadow-elegant hover:-translate-y-1 transition-transform"
              >
                <div className="size-11 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                  <c.icon className="size-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                  <div className="font-semibold">{c.value}</div>
                </div>
              </a>
            ))}
          </div>
          <form onSubmit={onSubmit} noValidate className="reveal glass rounded-2xl p-6 shadow-elegant space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Input
                  value={values.name}
                  onChange={handleChange("name")}
                  placeholder={t("contact.placeholder.name")}
                  maxLength={80}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-1">
                <Input
                  value={values.email}
                  onChange={handleChange("email")}
                  type="email"
                  placeholder={t("contact.placeholder.email")}
                  maxLength={120}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <Input
                value={values.phone}
                onChange={handleChange("phone")}
                inputMode="numeric"
                placeholder={t("contact.placeholder.phone")}
                maxLength={15}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div className="space-y-1">
              <Input
                value={values.subject}
                onChange={handleChange("subject")}
                placeholder={t("contact.placeholder.subject")}
                maxLength={120}
                aria-invalid={!!errors.subject}
              />
              {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
            </div>
            <div className="space-y-1">
              <Textarea
                value={values.message}
                onChange={handleChange("message")}
                placeholder={t("contact.placeholder.message")}
                rows={5}
                maxLength={1000}
                aria-invalid={!!errors.message}
                className="resize-none"
              />
              {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="w-full gradient-bg text-primary-foreground border-0 shadow-elegant hover:scale-[1.02] transition-transform">
              <Send className="mr-1 size-4" /> {submitting ? t("contact.sending") : t("contact.send")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useContent();

  return (
    <footer className="border-t border-border py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="text-center md:text-left">
          <div className="font-bold text-lg"><span className="gradient-text">Gourav</span>.dev</div>
          <p className="text-sm text-muted-foreground mt-1">© {new Date().getFullYear()} Gourav Takk. {t("footer.rights")}</p>
        </div>
        <nav className="flex gap-5 text-sm text-muted-foreground">
          <a href="#about" className="hover:text-primary">{t("nav.about")}</a>
          <a href="#projects" className="hover:text-primary">{t("nav.projects")}</a>
          <a href="#services" className="hover:text-primary">{t("nav.services")}</a>
          <a href="#contact" className="hover:text-primary">{t("nav.contact")}</a>
        </nav>
        <div className="flex gap-2">
          {[
            { icon: Github, href: "https://github.com" },
            { icon: Linkedin, href: "https://www.linkedin.com/in/gourav-takk-674abb367" },
            { icon: Mail, href: "mailto:takkgourav@gmail.com" },
          ].map(({ icon: Icon, href }, i) => (
            <a key={i} href={href} target="_blank" rel="noreferrer" className="glass rounded-full p-2.5 hover:scale-110 transition-transform">
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function RevealMount() {
  useReveal();
  return null;
}


