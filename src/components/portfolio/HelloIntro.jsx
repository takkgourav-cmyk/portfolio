"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const INTRO_DURATION = 4800;

export function HelloIntro() {
  const [visible, setVisible] = useState(true);
  const introRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const wordRef = useRef(null);
  const flareRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const site = introRef.current?.nextElementSibling;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (site && !reducedMotion) {
      gsap.set(site, { opacity: 0.35, scale: 0.96, y: 28, filter: "blur(10px)" });
    }

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        document.body.style.overflow = previousOverflow;
        if (site) gsap.set(site, { clearProps: "opacity,scale,y,filter" });
        setVisible(false);
      },
    });

    if (reducedMotion) {
      timeline.to({}, { duration: INTRO_DURATION / 1000 });
    } else {
      timeline
        .to(wordRef.current, { scale: 1.08, opacity: 0, y: -12, duration: 0.42, ease: "power2.in" }, 3.15)
        .fromTo(flareRef.current, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.28, ease: "power3.out" }, 3.12)
        .to(flareRef.current, { scaleX: 18, opacity: 0, duration: 0.72, ease: "power3.inOut" }, 3.36)
        .to(leftPanelRef.current, { xPercent: -102, rotate: -2, duration: 1.15, ease: "power4.inOut" }, 3.3)
        .to(rightPanelRef.current, { xPercent: 102, rotate: 2, duration: 1.15, ease: "power4.inOut" }, 3.3);

      if (site) {
        timeline.to(site, { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "power3.out" }, 3.42);
      }
    }

    return () => {
      timeline.kill();
      if (site) gsap.set(site, { clearProps: "opacity,scale,y,filter" });
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={introRef}
      aria-label="hello"
      role="status"
      className="hello-intro-screen fixed inset-0 z-[100000] flex items-center justify-center overflow-hidden text-white"
    >
      <div ref={leftPanelRef} className="hello-intro-panel hello-intro-panel-left" />
      <div ref={rightPanelRef} className="hello-intro-panel hello-intro-panel-right" />
      <div className="hello-intro-light hello-intro-light-one" />
      <div className="hello-intro-light hello-intro-light-two" />
      <div className="hello-intro-light hello-intro-light-three" />

      <div className="relative flex w-full items-center justify-center px-6">
        <div ref={wordRef} className="hello-intro-word" aria-hidden="true">
          hello
        </div>
      </div>
      <div ref={flareRef} className="hello-intro-flare" />

      <style>{`
        .hello-intro-screen {
          background: transparent;
          perspective: 1200px;
        }

        .hello-intro-panel {
          position: absolute;
          top: -3%;
          bottom: -3%;
          width: 51%;
          background:
            radial-gradient(circle at 50% 52%, rgba(11, 255, 141, 0.2), transparent 34%),
            linear-gradient(135deg, #061c24 0%, #123d44 34%, #125b4a 66%, #08241f 100%);
        }

        .hello-intro-panel-left { left: 0; transform-origin: left center; }
        .hello-intro-panel-right { right: 0; transform-origin: right center; }

        .hello-intro-screen::after {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          content: "";
          mask-image: radial-gradient(circle at center, black, transparent 76%);
        }

        .hello-intro-light {
          position: absolute;
          border-radius: 999px;
          filter: blur(70px);
          opacity: 0.42;
          animation: hello-intro-float 4s ease-in-out infinite alternate;
          pointer-events: none;
        }

        .hello-intro-light-one {
          top: 10%;
          left: 8%;
          width: 34vw;
          height: 34vw;
          background: #0b8fac;
        }

        .hello-intro-light-two {
          right: 4%;
          bottom: 5%;
          width: 38vw;
          height: 38vw;
          background: #0abf71;
          animation-delay: -1.3s;
        }

        .hello-intro-light-three {
          right: 18%;
          top: 2%;
          width: 24vw;
          height: 24vw;
          background: #ff8a2b;
          opacity: 0.25;
          animation-delay: -2.1s;
        }

        .hello-intro-word {
          padding: 0.18em 0.2em 0.3em;
          color: #fff;
          font-family: "Segoe Script", "Brush Script MT", cursive;
          font-size: clamp(5.5rem, 20vw, 13rem);
          font-weight: 600;
          line-height: 1;
          letter-spacing: 0;
          text-shadow: 0 0 22px rgba(255,255,255,0.18), 0 12px 36px rgba(0,0,0,0.28);
          transform: rotate(-8deg);
          clip-path: inset(0 100% 0 0);
          animation: hello-intro-write 2.8s cubic-bezier(0.62, 0, 0.25, 1) 0.25s forwards;
          white-space: nowrap;
          will-change: transform, opacity, clip-path;
        }

        .hello-intro-flare {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          z-index: 5;
          width: 3px;
          background: #baffd3;
          box-shadow: 0 0 18px #00ff66, 0 0 55px #00ff66, 0 0 110px rgba(0,255,102,0.8);
          opacity: 0;
          transform-origin: center;
          will-change: transform, opacity;
        }

        @keyframes hello-intro-write {
          0% { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 -8% 0 0); }
        }

        @keyframes hello-intro-float {
          from { transform: translate3d(-2%, -2%, 0) scale(0.95); }
          to { transform: translate3d(3%, 3%, 0) scale(1.08); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hello-intro-word,
          .hello-intro-light {
            animation: none;
          }

          .hello-intro-word {
            clip-path: none;
          }
        }
      `}</style>
    </div>
  );
}
