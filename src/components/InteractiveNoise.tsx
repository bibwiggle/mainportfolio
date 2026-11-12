"use client";

import { useEffect, useRef } from "react";

export type NoiseSettings = {
  density: number;
  size: number;
  brightness: number;
  speed: number;
  movement: number;
  horizontal: number;
  vertical: number;
  flowScale: number;
  variation: number;
  trails: number;
  trailHueA: number;
  trailHueB: number;
  trailSaturation: number;
  trailIntensity: number;
  trailSeparation: number;
  radius: number;
  strength: number;
};

// A quiet field of moving points that parts around the pointer.
export function InteractiveNoise({ settings }: { settings: NoiseSettings }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef(settings);
  const redrawRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    settingsRef.current = settings;
    redrawRef.current?.();
  }, [settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !card || !context) return;
    const trailCanvas = document.createElement("canvas");
    const trailContext = trailCanvas.getContext("2d");
    if (!trailContext) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastDraw = 0;
    let visible = false;
    let pointer: { x: number; y: number } | null = null;
    let particles: { x: number; y: number; phase: number; size: number; shade: number }[] = [];
    let positions = new Float32Array(0);

    const resize = () => {
      const rect = card.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      trailCanvas.width = canvas.width;
      trailCanvas.height = canvas.height;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      trailContext.setTransform(scale, 0, 0, scale, 0, 0);
      context.fillStyle = "#050505";
      context.fillRect(0, 0, width, height);
      // Generate enough points for the full density range without reshuffling on each adjustment.
      const count = Math.min(9000, Math.max(900, Math.round(width * height / 250 * 3)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        phase: Math.random() * Math.PI * 2,
        size: 0.5 + Math.random() * 1.1,
        shade: 0.22 + Math.random() * 0.55,
      }));
      positions = new Float32Array(count * 2);
      if (motionPreference.matches) draw(0);
    };

    const draw = (time: number) => {
      const { density, size, brightness, speed, movement, horizontal, vertical, flowScale, variation, trails, trailHueA, trailHueB, trailSaturation, trailIntensity, trailSeparation, radius: radiusPercent, strength } = settingsRef.current;
      const t = motionPreference.matches ? 0 : time * 0.00025 * speed;
      const radius = Math.min(width, height) * radiusPercent / 100;
      const count = Math.min(particles.length, Math.max(0, Math.round(width * height / 250 * density)));

      trailContext.globalCompositeOperation = "destination-out";
      trailContext.fillStyle = `rgba(0, 0, 0, ${motionPreference.matches ? 1 : 1 - trails})`;
      trailContext.fillRect(0, 0, width, height);
      trailContext.globalCompositeOperation = "source-over";
      for (let i = 0; i < count; i++) {
        const particle = particles[i];
        const phase = particle.phase * variation;
        let x = particle.x + Math.sin(particle.y * 0.012 * flowScale + phase + t) * movement * horizontal;
        let y = particle.y + Math.cos(particle.x * 0.01 * flowScale + phase - t) * movement * vertical;
        if (pointer) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < radius && distance > 0.01) {
            const displacement = (1 - distance / radius) * radius * strength;
            x += (dx / distance) * displacement;
            y += (dy / distance) * displacement;
          }
        }
        positions[i * 2] = x;
        positions[i * 2 + 1] = y;
      }
      if (trails > 0 && !motionPreference.matches) {
        // Offset the two colors in opposite directions, then draw white particle heads on top.
        for (const [hue, offset] of [[trailHueA, -trailSeparation], [trailHueB, trailSeparation]]) {
          trailContext.fillStyle = `hsl(${hue}, ${trailSaturation}%, 65%)`;
          for (let i = 0; i < count; i++) {
            const particle = particles[i];
            trailContext.globalAlpha = Math.min(1, particle.shade * trailIntensity);
            trailContext.fillRect(positions[i * 2] + offset, positions[i * 2 + 1], particle.size * size, particle.size * size);
          }
        }
      }
      trailContext.globalAlpha = 1;
      context.fillStyle = "#050505";
      context.fillRect(0, 0, width, height);
      context.drawImage(trailCanvas, 0, 0, width, height);
      for (let i = 0; i < count; i++) {
        const particle = particles[i];
        context.fillStyle = `rgba(218, 224, 237, ${Math.min(1, particle.shade * brightness)})`;
        context.fillRect(positions[i * 2], positions[i * 2 + 1], particle.size * size, particle.size * size);
      }
    };

    const tick = (time: number) => {
      if (time - lastDraw >= 1000 / 30) {
        draw(time);
        lastDraw = time;
      }
      if (visible && !motionPreference.matches) frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (motionPreference.matches) draw(0);
    };
    const leave = () => {
      pointer = null;
      if (motionPreference.matches) draw(0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(card);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(frame);
    });
    visibilityObserver.observe(card);
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerdown", move);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("pointerup", leave);
    card.addEventListener("pointercancel", leave);
    motionPreference.addEventListener("change", start);
    redrawRef.current = () => draw(performance.now());
    resize();

    return () => {
      cancelAnimationFrame(frame);
      redrawRef.current = null;
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerdown", move);
      card.removeEventListener("pointerleave", leave);
      card.removeEventListener("pointerup", leave);
      card.removeEventListener("pointercancel", leave);
      motionPreference.removeEventListener("change", start);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full pointer-events-none bg-black" />;
}
