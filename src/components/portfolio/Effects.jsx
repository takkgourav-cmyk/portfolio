"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* =================== Loading Screen =================== */
export function LoadingScreen() {
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setTimeout(() => setDone(true), 400),
    });
    tl.to(".loader-bar", { width: "100%", duration: 1.3, ease: "power2.inOut" })
      .to(".loader-logo", { scale: 1.15, duration: 0.4, ease: "power2.out" }, "-=0.6")
      .to(ref.current, { y: "-100%", duration: 0.8, ease: "power3.inOut" }, "+=0.1");
    return () => { tl.kill(); };
  }, []);

  if (done) return null;
  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
      style={{ background: "var(--gradient-hero), var(--color-background)" }}
    >
      <div className="loader-logo text-4xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <span className="gradient-text">Gourav</span>
        <span className="text-foreground">.dev</span>
      </div>
      <div className="w-56 h-1 rounded-full bg-muted overflow-hidden">
        <div className="loader-bar h-full w-0 gradient-bg" />
      </div>
      <div className="mt-3 text-xs text-muted-foreground tracking-[0.3em] uppercase">Loading</div>
    </div>
  );
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

/* =================== Custom Cursor + Click Ripple =================== */
export function CursorEffects() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: pos.x, y: pos.y });

    const onMove = (e) => {
      pos.x = e.clientX; pos.y = e.clientY;
      gsap.to(dot, { x: pos.x, y: pos.y, duration: 0.15, ease: "power2.out" });
    };

    let raf = 0;
    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onOver = (e) => {
      const target = e.target;
      const interactive = target.closest("a, button, [role='button'], input, textarea, select, label, .cursor-hover");
      gsap.to(ring, {
        scale: interactive ? 1.8 : 1,
        borderColor: interactive ? "var(--color-primary)" : "var(--color-foreground)",
        duration: 0.25,
      });
    };

    const onClick = (e) => {
      const r = document.createElement("span");
      r.className = "click-ripple";
      r.style.left = `${e.clientX}px`;
      r.style.top = `${e.clientY}px`;
      document.body.appendChild(r);
      gsap.fromTo(
        r,
        { scale: 0, opacity: 0.7 },
        { scale: 6, opacity: 0, duration: 0.7, ease: "power2.out", onComplete: () => r.remove() }
      );
      gsap.fromTo(ring, { scale: 0.6 }, { scale: 1.4, duration: 0.4, ease: "power2.out", yoyo: true, repeat: 1 });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </>
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
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 size-12 rounded-full gradient-bg text-primary-foreground shadow-glow flex items-center justify-center hover:scale-110 transition-transform animate-fade-in"
    >
      ↑
    </button>
  );
}
