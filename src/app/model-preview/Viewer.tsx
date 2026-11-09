"use client";

import { useState } from "react";
import { LampCanvas } from "@/components/LampCanvas";

export default function ModelPreview() {
  const [variant, setVariant] = useState<"lite" | "full">("lite");
  const [playing, setPlaying] = useState(true);
  const [wireframe, setWireframe] = useState(false);

  return (
    <main className="relative h-[100svh] min-h-[480px] overflow-hidden bg-[#101115] text-white">
      <div className="absolute inset-0">
        <LampCanvas variant={variant} playing={playing} wireframe={wireframe} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-4 p-5 md:p-8">
        <div className="pointer-events-auto">
          <a href="/" className="text-sm text-white/60 hover:text-white">← Portfolio</a>
          <h1 className="mt-3 text-xl font-medium">Lamp model preview</h1>
          <p className="mt-1 text-sm text-white/60">Drag to rotate · scroll or pinch to zoom</p>
        </div>
        <div className="pointer-events-auto flex flex-wrap gap-2 text-sm">
          <button type="button" onClick={() => setVariant(variant === "lite" ? "full" : "lite")} className="rounded-full border border-white/25 bg-black/60 px-4 py-2 hover:border-white/60">
            {variant === "lite" ? "Lite model" : "Full model"} ↔
          </button>
          <button type="button" onClick={() => setPlaying(!playing)} className="rounded-full border border-white/25 bg-black/60 px-4 py-2 hover:border-white/60">
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={() => setWireframe(!wireframe)} className="rounded-full border border-white/25 bg-black/60 px-4 py-2 hover:border-white/60">
            {wireframe ? "Solid" : "Wireframe"}
          </button>
        </div>
      </div>
      <p className="pointer-events-none absolute bottom-5 left-5 text-xs text-white/45 md:bottom-8 md:left-8">Geometry only. Chrome and refraction are on the homepage.</p>
    </main>
  );
}
