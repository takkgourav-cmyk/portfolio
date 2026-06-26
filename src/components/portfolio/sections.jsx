"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  ArrowDown,
  Briefcase,
  Code2,
  Download,
  Github,
  GraduationCap,
  Layout,
  Linkedin,
  Mail,
  MapPin,
  Palette,
  Phone,
  Server,
  Sparkles,
  Star,
  ExternalLink,
  Send,
  Award,
} from "lucide-react";
import profile from "@/assets/profile.jpg";
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

function CountUp({ end, suffix, label }) {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const duration = 1500;
            const startTime = performance.now();
            const tick = (now) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(eased * end);
              setCount(current);
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref}>
      <div className="text-2xl font-bold gradient-text">
        {count}{suffix}
      </div>
      {label && <div className="text-muted-foreground">{label}</div>}
    </div>
  );
}

export function Hero() {
  const ref = useRef(null);
  const faceRef = useRef(null);
  const { t } = useContent();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-anim", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
      });
      gsap.from(".hero-img", {
        scale: 0.85,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
      });
      gsap.to(".float", {
        y: -14,
        duration: 2.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      /* Parallax on hero image while scrolling */
      gsap.to(".hero-img", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-bg-orb", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-anim", {
        opacity: 0.25,
        y: -50,
        ease: "none",
        stagger: 0.02,
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom 30%", scrub: true },
      });
      gsap.to(".hero-img", {
        scale: 0.82,
        rotate: -5,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, ref);

    const onMouseMove = (e) => {
      const face = faceRef.current;
      if (!face) return;
      const r = face.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      gsap.to(face, {
        rotateY: dx * 24,
        rotateX: -dy * 24,
        transformPerspective: 900,
        transformOrigin: "center",
        duration: 0.6,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className="hero-bg relative min-h-screen flex items-center pt-28 pb-16 px-4 sm:px-6 overflow-hidden"
    >
      <div className="hero-bg-orb absolute inset-0 -z-10 opacity-30 [background:radial-gradient(circle_at_50%_50%,var(--color-primary),transparent_60%)]" />
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center w-full">
        <div>
          <span className="hero-anim inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium mb-6">
            <Sparkles className="size-3 text-primary" /> {t("hero.badge")}
          </span>
          <h1 className="hero-anim text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t("hero.title.hi")} <span className="gradient-text">Gourav Takk</span>
          </h1>
          <p className="hero-anim text-lg sm:text-xl text-muted-foreground mb-3 font-medium">
            {t("hero.role")}
          </p>
          <p className="hero-anim text-base sm:text-lg font-semibold mb-3 min-h-[1.6em]">
            <Typewriter keys={["typing.1","typing.2","typing.3","typing.4","typing.5"]} className="gradient-text" />
          </p>
          <p className="hero-anim text-muted-foreground max-w-xl mb-8">
            {t("hero.intro")}
          </p>
          <div className="hero-anim flex flex-wrap gap-3">
            <Magnetic>
              <Button asChild size="lg" className="gradient-bg text-primary-foreground border-0 shadow-elegant hover:scale-105 transition-transform">
                <a href="#contact"><Send className="mr-1" /> {t("hero.hire")}</a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild size="lg" variant="outline" className="glass">
                <a href="/Gourav_Takk_Resume.pdf" download><Download className="mr-1" /> {t("hero.resume")}</a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild size="lg" variant="ghost">
                <a href="#contact"><Mail className="mr-1" /> {t("hero.contact")}</a>
              </Button>
            </Magnetic>
          </div>
          <div className="hero-anim mt-10 flex gap-8 text-sm">
            <div><CountUp end={10} suffix="+" label={t("hero.stat.projects")} /></div>
            <div><CountUp end={9} suffix="+" label={t("hero.stat.skills")} /></div>
            <div><CountUp end={1} suffix="+" label={t("hero.stat.years")} /></div>
          </div>
        </div>
        <div className="hero-img relative mx-auto">
          <div ref={faceRef} className="float relative cursor-hover will-change-transform" style={{ transformStyle: "preserve-3d" }} onClick={(e) => {
            const el = e.currentTarget;
            gsap.fromTo(el, { rotate: 0 }, { rotate: 360, duration: 1.2, ease: "power2.inOut" });
          }}>
            <div className="absolute -inset-6 gradient-bg rounded-full blur-3xl opacity-40" />
            <div className="relative size-64 sm:size-80 lg:size-96 rounded-full p-1.5 gradient-bg shadow-glow">
              <Image
                src={profile}
                alt="Gourav Takk"
                width={768}
                height={768}
                priority
                className="rounded-full size-full object-cover bg-background"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 glass rounded-2xl px-4 py-2 text-xs font-medium shadow-elegant">
              <Code2 className="inline size-3 mr-1 text-primary" /> {t("hero.badge.react")}
            </div>
            <div className="absolute -top-2 -left-2 glass rounded-2xl px-4 py-2 text-xs font-medium shadow-elegant">
              <Palette className="inline size-3 mr-1 text-accent" /> {t("hero.badge.ui")}
            </div>
          </div>
        </div>
      </div>
      <a href="#about" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce" aria-label="Scroll down">
        <ArrowDown className="size-5" />
      </a>
    </section>
  );
}

function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-14 reveal">
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
    const els = gsap.utils.toArray(".reveal");
    els.forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });
    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, []);
}

export function About() {
  const { t } = useContent();
  const aboutCards = [
    { icon: GraduationCap, label: t("about.card.education"), value: "BCA - OSSC College" },
    { icon: MapPin, label: t("about.card.location"), value: "Jodhpur, Rajasthan" },
    { icon: Award, label: t("about.card.certified"), value: "WsCube Tech" },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow={t("about.eyebrow")} title={t("about.title")} />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="reveal glass rounded-2xl p-6 shadow-elegant md:col-span-2">
            <h3 className="font-semibold text-lg mb-3">{t("about.who.title")}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t("about.who.body")}
            </p>
            <h3 className="font-semibold text-lg mb-3">{t("about.goal.title")}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("about.goal.body")}
            </p>
          </div>
          <div className="reveal grid gap-4">
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
  { name: "HTML", level: 95 },
  { name: "CSS", level: 90 },
  { name: "JavaScript", level: 85 },
  { name: "React.js", level: 82 },
  { name: "Next.js", level: 75 },
  { name: "Tailwind CSS", level: 90 },
  { name: "Node.js", level: 65 },
  { name: "Python", level: 60 },
  { name: "UI/UX Design", level: 78 },
];

export function Skills() {
  const ref = useRef(null);
  const { t } = useContent();
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".bar-fill").forEach((el) => {
        const target = el.dataset.level || "0";
        gsap.fromTo(
          el,
          { width: "0%" },
          {
            width: `${target}%`,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section id="skills" className="py-24 px-4 sm:px-6 bg-secondary/40">
      <div className="mx-auto max-w-6xl" ref={ref}>
        <SectionTitle eyebrow={t("skills.eyebrow")} title={t("skills.title")} sub={t("skills.sub")} />
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
          {skills.map((s) => (
            <div key={s.name} className="reveal">
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span>{s.name}</span>
                <span className="text-muted-foreground">{s.level}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="bar-fill h-full rounded-full gradient-bg" data-level={s.level} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const projects = [
  {
    titleKey: "project.1.title",
    descKey: "project.1.desc",
    tech: ["Next.js", "Tailwind", "GSAP"],
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    titleKey: "project.2.title",
    descKey: "project.2.desc",
    tech: ["React", "Tailwind", "Vite"],
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    titleKey: "project.3.title",
    descKey: "project.3.desc",
    tech: ["HTML", "CSS", "Bootstrap"],
    gradient: "from-amber-500 to-rose-500",
  },
  {
    titleKey: "project.4.title",
    descKey: "project.4.desc",
    tech: ["React", "TypeScript"],
    gradient: "from-emerald-500 to-teal-500",
  },
];

export function Projects() {
  const { t } = useContent();
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".project-card").forEach((card, i) => {
        gsap.from(card, {
          y: 80, opacity: 0, duration: 0.9, ease: "power3.out", delay: i * 0.08,
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, { rotateY: x * 10, rotateX: -y * 10, transformPerspective: 800, duration: 0.4, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out" });
        });
        card.addEventListener("click", () => {
          gsap.fromTo(card, { scale: 1 }, { scale: 0.97, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" });
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section id="projects" className="py-24 px-4 sm:px-6" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow={t("projects.eyebrow")} title={t("projects.title")} sub={t("projects.sub")} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.map((p) => (
            <article key={p.titleKey} className="project-card tilt-card cursor-hover group glass rounded-3xl overflow-hidden shadow-elegant">
              <div className={`h-48 bg-gradient-to-br ${p.gradient} relative flex items-center justify-center`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white,transparent_60%)] opacity-20" />
                <Code2 className="size-16 text-white/80 group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{t(p.titleKey)}</h3>
                <p className="text-muted-foreground text-sm mb-4">{t(p.descKey)}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.tech.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="gradient-bg text-primary-foreground border-0">
                    <ExternalLink className="mr-1 size-3.5" /> {t("project.live")}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Github className="mr-1 size-3.5" /> {t("project.github")}
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
    <section id="experience" className="py-24 px-4 sm:px-6 bg-secondary/40">
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
    <section id="services" className="py-24 px-4 sm:px-6">
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
    <section className="py-24 px-4 sm:px-6 bg-secondary/40">
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
          phone,
          _subject: `[Portfolio] ${subject}`,
          message,
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!res.ok) throw new Error("Failed");
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
    <section id="contact" className="py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow={t("contact.eyebrow")} title={t("contact.title")} sub={t("contact.sub")} />
        <div className="grid md:grid-cols-2 gap-8">
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


