"use client";

import { useEffect, useRef } from "react";

const FRAMES_PER_ROW = 4;
const FRAME_COUNT = 16;
const SPRITE = "/doki assets/helmet-opening-sprite.webp";

export function HelmetScrub({ poster, scale = 1 }: { poster: string; scale?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sprite = spriteRef.current;
    const card = containerRef.current?.parentElement;
    if (!sprite || !card) return;

    let pointerStart: { x: number; y: number } | null = null;
    let dragged = false;
    const seek = (clientX: number) => {
      const rect = card.getBoundingClientRect();
      if (!rect.width) return;
      const progress = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const frame = Math.round(progress * (FRAME_COUNT - 1));
      const column = frame % FRAMES_PER_ROW;
      const row = Math.floor(frame / FRAMES_PER_ROW);
      sprite.style.backgroundPosition = `${column * 100 / (FRAMES_PER_ROW - 1)}% ${row * 100 / (FRAMES_PER_ROW - 1)}%, center`;
    };
    const pointerDown = (event: PointerEvent) => {
      dragged = false;
      pointerStart = { x: event.clientX, y: event.clientY };
      if (event.pointerType === "touch") seek(event.clientX);
    };
    const pointerMove = (event: PointerEvent) => {
      if (pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 8) dragged = true;
      if (event.pointerType === "mouse" || pointerStart) seek(event.clientX);
    };
    const pointerEnd = () => { pointerStart = null; };
    const cancelDragClick = (event: MouseEvent) => {
      if (dragged) {
        event.preventDefault();
        event.stopPropagation();
      }
      pointerStart = null;
      dragged = false;
    };

    card.addEventListener("pointerdown", pointerDown);
    card.addEventListener("pointermove", pointerMove);
    card.addEventListener("pointerup", pointerEnd);
    card.addEventListener("pointercancel", pointerEnd);
    card.addEventListener("click", cancelDragClick, true);
    return () => {
      card.removeEventListener("pointerdown", pointerDown);
      card.removeEventListener("pointermove", pointerMove);
      card.removeEventListener("pointerup", pointerEnd);
      card.removeEventListener("pointercancel", pointerEnd);
      card.removeEventListener("click", cancelDragClick, true);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black"
    >
      <div
        ref={spriteRef}
        className="aspect-square max-h-full max-w-full"
        style={{
          width: "min(100%, 100vh)",
          transform: `scale(${scale})`,
          backgroundImage: `url("${SPRITE}"), url("${poster}")`,
          backgroundSize: "400% 400%, contain",
          backgroundPosition: "0% 0%, center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
