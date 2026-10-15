"use client";

import { useEffect, useRef } from "react";
import { loadThree } from "@/lib/load-three";

export default function ThreeContactBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    // The contact background is decorative and hidden on mobile.
    if (!window.matchMedia("(min-width: 768px)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let animId;
    let renderer, scene, camera, mesh;
    let isDisposed = false;
    let removeListeners;
    let isVisible = false;
    let started = false;
    let mouse = { x: 0, y: 0 };

    const init = (THREE) => {
      if (!containerRef.current || isDisposed) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(55, w / h, 1, 1000);
      camera.position.set(0, 180, 420);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      containerRef.current.appendChild(renderer.domElement);

      const SEPARATION = 30, AMOUNTX = 45, AMOUNTY = 45;
      const numParticles = AMOUNTX * AMOUNTY;
      const positions = new Float32Array(numParticles * 3);
      const scales = new Float32Array(numParticles);

      let i = 0, j = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
          positions[i + 1] = 0;
          positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
          scales[j] = 1;
          i += 3;
          j++;
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

      const material = new THREE.PointsMaterial({
        color: 0x00ff66,
        size: 2.2,
        transparent: true,
        opacity: 0.5,
      });

      mesh = new THREE.Points(geometry, material);
      scene.add(mesh);

      const onMouseMove = (e) => {
        mouse.x = (e.clientX - window.innerWidth / 2) * 0.2;
        mouse.y = (e.clientY - window.innerHeight / 2) * 0.2;
      };
      window.addEventListener("mousemove", onMouseMove);

      const onResize = () => {
        if (!containerRef.current || !renderer || !camera) return;
        const width = containerRef.current.clientWidth || window.innerWidth;
        const height = containerRef.current.clientHeight || window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener("resize", onResize);

      let count = 0;
      const animate = () => {
        if (isDisposed) return;
        animId = requestAnimationFrame(animate);
        if (document.hidden || !isVisible) return;

        camera.position.x += (mouse.x - camera.position.x) * 0.05;
        camera.position.y += (-mouse.y + 180 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        const positionAttr = geometry.attributes.position;
        let index = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            const yVal = Math.sin((ix + count) * 0.3) * 35 + Math.sin((iy + count) * 0.5) * 35;
            positionAttr.setY(index, yVal);
            index++;
          }
        }
        positionAttr.needsUpdate = true;
        count += 0.06;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
      };
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (!isVisible || started) return;
      started = true;
      loadThree().then((THREE) => {
        if (!isDisposed) removeListeners = init(THREE);
      }).catch(() => {
        // Keep the contact links usable if WebGL or the CDN is unavailable.
      });
    }, { rootMargin: "200px" });
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      isDisposed = true;
      observer.disconnect();
      removeListeners?.();
      if (animId) cancelAnimationFrame(animId);
      scene?.traverse((object) => {
        object.geometry?.dispose();
        object.material?.dispose();
      });
      renderer?.dispose();
      if (renderer && renderer.domElement && containerRef.current) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full pointer-events-none" />;
}
