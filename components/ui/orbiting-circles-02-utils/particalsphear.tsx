"use client";

import React, { useEffect, useRef } from "react";

export default function ParticleSphereAnimation() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Simple placeholder: animated radial gradient using CSS
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.borderRadius = "50%";
    el.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), rgba(139,195,74,0.35) 35%, rgba(30,86,49,0.15) 65%, rgba(30,86,49,0.05) 85%)`;
    el.style.boxShadow = "0 8px 40px rgba(30,86,49,0.18) inset";
    el.style.animation = "pulse 6s ease-in-out infinite";

    // Add keyframes to document head if not present
    const id = "particle-sphere-anim";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.innerHTML = `@keyframes pulse { 0% { transform: scale(0.98); opacity: 0.95 } 50% { transform: scale(1.02); opacity: 1 } 100% { transform: scale(0.98); opacity: 0.95 } }`;
      document.head.appendChild(style);
    }
  }, []);

  return <div ref={ref} aria-hidden="true" />;
}
