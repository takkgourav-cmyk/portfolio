"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

let scrollFrame = 0;

function easeInOutCubic(progress) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

export function smoothScrollTo(top, duration = 1250) {
  cancelAnimationFrame(scrollFrame);
  const start = window.scrollY;
  const distance = Math.max(0, top) - start;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, start + distance * easeInOutCubic(progress));
    if (progress < 1) scrollFrame = requestAnimationFrame(tick);
  };

  scrollFrame = requestAnimationFrame(tick);
}

export function scrollToHash(hash, { center = false, duration = 1250 } = {}) {
  if (hash === "#home") {
    smoothScrollTo(0, duration);
    return true;
  }

  let section;
  try {
    section = document.querySelector(hash);
  } catch {
    return false;
  }
  if (!section) return false;

  const target = center ? section.querySelector("h2") ?? section : section;
  const bounds = target.getBoundingClientRect();
  const top = center
    ? bounds.top + window.scrollY + bounds.height / 2 - window.innerHeight / 2
    : bounds.top + window.scrollY - 88;

  smoothScrollTo(top, duration);
  return true;
}

export function SmoothAnchorScroll() {
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const didScroll = scrollToHash(hash, { duration: 1350 });
      if (!didScroll) return;
      event.preventDefault();
      window.history.replaceState(null, "", hash);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(scrollFrame);
    };
  }, []);

  return null;
}

/* =================== Scroll Progress Bar =================== */
export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      if (ref.current) ref.current.style.width = `${pct}%`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none">
      <div ref={ref} className="h-full gradient-bg shadow-glow" style={{ width: "0%" }} />
    </div>
  );
}


/* =================== Magnetic Wrapper =================== */
export function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      gsap.to(el, { x, y, duration: 0.4, ease: "power3.out" });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);
  return <div ref={ref} className="inline-block">{children}</div>;
}

/* =================== Back To Top =================== */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => smoothScrollTo(0, 1200)}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 size-12 rounded-full gradient-bg text-primary-foreground shadow-glow flex items-center justify-center hover:scale-110 transition-transform animate-fade-in"
    >
      ↑
    </button>
  );
}
