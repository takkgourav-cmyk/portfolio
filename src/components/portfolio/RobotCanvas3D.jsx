"use client";

import { useEffect, useRef } from "react";

export default function RobotCanvas3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    let animId;
    let renderer, scene, camera;
    let robotRoot, headGroup, chestGroup, coreGroup, leftEye, rightEye, hudRing;
    let leftAntennaLight, rightAntennaLight;
    let particleSystem;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isDisposed = false;

    const init = (THREE) => {
      if (!containerRef.current || isDisposed) return;
      const width = containerRef.current.clientWidth || window.innerWidth;
      const height = containerRef.current.clientHeight || window.innerHeight;

      // 1. Scene & Camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      camera.position.set(0, 0.4, 6.8);

      // 2. Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;

      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      containerRef.current.appendChild(renderer.domElement);

      // 3. Studio Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const keyNeonLight = new THREE.DirectionalLight(0x00ff66, 3.2);
      keyNeonLight.position.set(4, 5, 4);
      scene.add(keyNeonLight);

      const cyanRimLight = new THREE.DirectionalLight(0x00e5ff, 2.5);
      cyanRimLight.position.set(-4, 3, -3);
      scene.add(cyanRimLight);

      const bottomGlow = new THREE.PointLight(0x00ff66, 3, 15);
      bottomGlow.position.set(0, -2, 2.5);
      scene.add(bottomGlow);

      const corePointLight = new THREE.PointLight(0x00ff88, 4, 8);
      corePointLight.position.set(0, -1.2, 1.2);
      scene.add(corePointLight);

      // 4. Materials
      const darkArmorMat = new THREE.MeshStandardMaterial({
        color: 0x121316,
        metalness: 0.85,
        roughness: 0.2,
      });

      const chromePistonMat = new THREE.MeshStandardMaterial({
        color: 0x3a3f47,
        metalness: 0.95,
        roughness: 0.1,
      });

      const neonGreenMat = new THREE.MeshBasicMaterial({
        color: 0x00ff66,
      });

      const neonCyanMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
      });

      const visorGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x05080a,
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.85,
        transparent: true,
        opacity: 0.9,
      });

      // 5. Robot Hierarchy
      robotRoot = new THREE.Group();
      robotRoot.position.set(0, -0.3, 0);
      scene.add(robotRoot);

      // ==================== CHEST & TORSO ====================
      chestGroup = new THREE.Group();
      robotRoot.add(chestGroup);

      // Main Chest Armor
      const chestGeo = new THREE.BoxGeometry(2.4, 1.8, 1.4);
      const chestArmor = new THREE.Mesh(chestGeo, darkArmorMat);
      chestArmor.position.set(0, -1.5, 0);
      chestGroup.add(chestArmor);

      // Chest Collar Plating
      const collarGeo = new THREE.CylinderGeometry(1.1, 1.3, 0.4, 6);
      const collarMesh = new THREE.Mesh(collarGeo, darkArmorMat);
      collarMesh.position.set(0, -0.5, 0);
      chestGroup.add(collarMesh);

      // Arc Reactor Core
      coreGroup = new THREE.Group();
      coreGroup.position.set(0, -1.3, 0.72);
      chestGroup.add(coreGroup);

      const coreRingGeo = new THREE.TorusGeometry(0.35, 0.05, 12, 32);
      const coreRing = new THREE.Mesh(coreRingGeo, chromePistonMat);
      coreGroup.add(coreRing);

      const coreInnerGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.1, 24);
      coreInnerGeo.rotateX(Math.PI / 2);
      const coreInner = new THREE.Mesh(coreInnerGeo, neonGreenMat);
      coreGroup.add(coreInner);

      const coreOuterGlowGeo = new THREE.TorusGeometry(0.48, 0.025, 8, 32);
      const coreOuterGlow = new THREE.Mesh(coreOuterGlowGeo, neonCyanMat);
      coreGroup.add(coreOuterGlow);

      // Shoulder Pauldrons
      [-1.4, 1.4].forEach((xSide) => {
        const shoulderGeo = new THREE.SphereGeometry(0.55, 16, 16);
        shoulderGeo.scale(1, 0.8, 1.2);
        const shoulder = new THREE.Mesh(shoulderGeo, darkArmorMat);
        shoulder.position.set(xSide, -0.9, 0);
        chestGroup.add(shoulder);

        const shoulderRingGeo = new THREE.TorusGeometry(0.4, 0.03, 8, 24);
        shoulderRingGeo.rotateY(Math.PI / 2);
        const sRing = new THREE.Mesh(shoulderRingGeo, neonGreenMat);
        sRing.position.set(xSide > 0 ? xSide + 0.35 : xSide - 0.35, -0.9, 0);
        chestGroup.add(sRing);
      });

      // ==================== HEAD GROUP ====================
      headGroup = new THREE.Group();
      headGroup.position.set(0, 0.2, 0);
      robotRoot.add(headGroup);

      // Neck Hydraulic Pistons
      const neckBaseGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.8, 16);
      const neckBase = new THREE.Mesh(neckBaseGeo, chromePistonMat);
      neckBase.position.set(0, -0.4, 0);
      headGroup.add(neckBase);

      // Main Cranium / Skull
      const craniumGeo = new THREE.BoxGeometry(1.85, 1.75, 1.85);
      const cranium = new THREE.Mesh(craniumGeo, darkArmorMat);
      cranium.position.set(0, 0.45, 0);
      headGroup.add(cranium);

      // Top Dome
      const topPlateGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.25, 8);
      const topPlate = new THREE.Mesh(topPlateGeo, chromePistonMat);
      topPlate.position.set(0, 1.35, 0);
      headGroup.add(topPlate);

      // Cyber Visor
      const visorGeo = new THREE.BoxGeometry(1.7, 0.6, 0.45);
      const visor = new THREE.Mesh(visorGeo, visorGlassMat);
      visor.position.set(0, 0.55, 0.82);
      headGroup.add(visor);

      // Glowing Eyes
      const eyeGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16);
      eyeGeo.rotateX(Math.PI / 2);

      leftEye = new THREE.Mesh(eyeGeo, neonGreenMat);
      leftEye.position.set(-0.42, 0.55, 0.8);
      headGroup.add(leftEye);

      rightEye = new THREE.Mesh(eyeGeo, neonGreenMat);
      rightEye.position.set(0.42, 0.55, 0.8);
      headGroup.add(rightEye);

      // Eye HUD Ring
      const hudGeo = new THREE.TorusGeometry(0.25, 0.025, 8, 24);
      const lHud = new THREE.Mesh(hudGeo, neonCyanMat);
      lHud.position.set(-0.42, 0.55, 0.85);
      headGroup.add(lHud);

      const rHud = new THREE.Mesh(hudGeo, neonCyanMat);
      rHud.position.set(0.42, 0.55, 0.85);
      headGroup.add(rHud);

      // Side Audio Ear Pods & Antennas
      [-1.02, 1.02].forEach((xSide) => {
        const earPodGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.3, 16);
        earPodGeo.rotateZ(Math.PI / 2);
        const earPod = new THREE.Mesh(earPodGeo, chromePistonMat);
        earPod.position.set(xSide, 0.45, 0);
        headGroup.add(earPod);

        const earGlowGeo = new THREE.TorusGeometry(0.4, 0.03, 8, 24);
        earGlowGeo.rotateY(Math.PI / 2);
        const earGlow = new THREE.Mesh(earGlowGeo, neonCyanMat);
        earGlow.position.set(xSide > 0 ? xSide + 0.15 : xSide - 0.15, 0.45, 0);
        headGroup.add(earGlow);

        // Antenna Stalk
        const stalkGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.9, 8);
        const stalk = new THREE.Mesh(stalkGeo, chromePistonMat);
        stalk.position.set(xSide > 0 ? xSide + 0.2 : xSide - 0.2, 1.0, -0.1);
        stalk.rotation.z = xSide > 0 ? -0.25 : 0.25;
        headGroup.add(stalk);

        // Antenna Tip Glowing LED
        const tipGeo = new THREE.SphereGeometry(0.08, 12, 12);
        const tip = new THREE.Mesh(tipGeo, neonGreenMat);
        tip.position.set(xSide > 0 ? xSide + 0.32 : xSide - 0.32, 1.45, -0.1);
        headGroup.add(tip);
      });

      // Cyber Jaw & Grill
      const jawBaseGeo = new THREE.BoxGeometry(1.35, 0.45, 1.15);
      const jawBase = new THREE.Mesh(jawBaseGeo, darkArmorMat);
      jawBase.position.set(0, -0.3, 0.2);
      headGroup.add(jawBase);

      for (let i = -2; i <= 2; i++) {
        const ventGeo = new THREE.BoxGeometry(0.07, 0.22, 0.04);
        const vent = new THREE.Mesh(ventGeo, neonCyanMat);
        vent.position.set(i * 0.2, -0.3, 0.78);
        headGroup.add(vent);
      }

      // Floating Holographic Halo Ring
      const haloGeo = new THREE.TorusGeometry(1.7, 0.03, 16, 64);
      haloGeo.rotateX(Math.PI / 2.3);
      hudRing = new THREE.Mesh(haloGeo, neonGreenMat);
      hudRing.position.set(0, 0.6, 0);
      robotRoot.add(hudRing);

      // Floating Ambient Cyber Dust Particles
      const pCount = 140;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount * 3; i += 3) {
        pPos[i] = (Math.random() - 0.5) * 14;
        pPos[i + 1] = (Math.random() - 0.5) * 10;
        pPos[i + 2] = (Math.random() - 0.5) * 10;
      }
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        size: 0.07,
        color: 0x00ff66,
        transparent: true,
        opacity: 0.65,
      });
      particleSystem = new THREE.Points(pGeo, pMat);
      scene.add(particleSystem);

      // Mouse tracking
      const onMouseMove = (e) => {
        const rx = (e.clientX / window.innerWidth) * 2 - 1;
        const ry = -(e.clientY / window.innerHeight) * 2 + 1;
        mouse.targetX = rx;
        mouse.targetY = ry;
      };
      window.addEventListener("mousemove", onMouseMove);

      const onResize = () => {
        if (!containerRef.current || !renderer || !camera) return;
        const w = containerRef.current.clientWidth || window.innerWidth;
        const h = containerRef.current.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      // Animation Loop
      let clock = new THREE.Clock();
      const animate = () => {
        if (isDisposed) return;
        animId = requestAnimationFrame(animate);

        const t = clock.getElapsedTime();

        // Lerp Mouse Look-Around
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        // Head tracking
        if (headGroup) {
          headGroup.rotation.y = mouse.x * 0.85 + Math.sin(t * 0.9) * 0.04;
          headGroup.rotation.x = -mouse.y * 0.5 + Math.cos(t * 1.3) * 0.03;
          headGroup.rotation.z = -mouse.x * 0.2;
          headGroup.position.y = 0.2 + Math.sin(t * 1.6) * 0.06;
        }

        // Torso follows slightly
        if (chestGroup) {
          chestGroup.rotation.y = mouse.x * 0.25;
          chestGroup.rotation.x = -mouse.y * 0.12;
          chestGroup.position.y = Math.sin(t * 1.6) * 0.04;
        }

        // Core Pulse & Rotation
        if (coreGroup) {
          coreGroup.rotation.z = t * 0.8;
          const corePulse = (Math.sin(t * 3.5) + 1) * 0.12 + 0.95;
          coreGroup.scale.set(corePulse, corePulse, 1);
        }

        // Halo Ring Spin
        if (hudRing) {
          hudRing.rotation.z = t * 0.5;
          hudRing.rotation.y = Math.sin(t * 0.6) * 0.25;
        }

        // Particles
        if (particleSystem) {
          particleSystem.rotation.y = t * 0.05;
          particleSystem.rotation.x = Math.sin(t * 0.03) * 0.1;
        }

        // Eye Pulse
        const eyePulse = (Math.sin(t * 5) + 1) * 0.1 + 0.95;
        if (leftEye && rightEye) {
          leftEye.scale.set(eyePulse, eyePulse, 1);
          rightEye.scale.set(eyePulse, eyePulse, 1);
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
      };
    };

    if (typeof window !== "undefined") {
      if (window.THREE) {
        init(window.THREE);
      } else {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
        script.async = true;
        script.onload = () => {
          if (window.THREE) init(window.THREE);
        };
        document.head.appendChild(script);
      }
    }

    return () => {
      isDisposed = true;
      if (animId) cancelAnimationFrame(animId);
      if (renderer && renderer.domElement && containerRef.current) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
    />
  );
}
