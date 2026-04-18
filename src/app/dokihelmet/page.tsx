"use client";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import VideoPlayer from "@/components/VideoPlayer";
import Image from "next/image";
import { useState } from "react";

// ─── EDIT THESE ───────────────────────────────────────────────────────────────
const TITLE    = "Doki Helmet";
const SUBTITLE = "The Doki Helmet is a cyberpunk-inspired wearable with fully mechanical articulation, designed to open and close for a dramatic face reveal. Rooted in Korean folklore and engineered with the precision of sci-fi mecha design, it bridges myth and mechanism.";

const CONCEPT = `The Dokkaebi, a mischievous and powerful figure from Korean folk tradition, gets reimagined as wearable future-tech. The helmet filters the creature's iconic horned silhouette through the design language of Titanfall, Iron Man, and Power Rangers Dino Thunder, three franchises that have defined what it means for armor to feel alive.

The visor follows the Power Rangers tradition of using the creature's mouth as the primary lens, making the face of the Dokkaebi the literal window to the wearer's own. The mechanical movements take their cues from Iron Man's layered panel articulation and Titanfall's signature visor-lift mechanism. At the heart of it is a four-bar linkage system that drives the cheek panels outward in a smooth, controlled motion, chosen not just for its function but for the drama it creates in motion.`;

const SKILLS: string[] = [
  "Fusion 360",
  "3D Printing",
  "Mechanical Design",
  "Fabrication",
  "Arduino",
];

const LOCAL_VIDEOS: { src: string; label?: string }[] = [
  { src: "/mp4/rendered rotation_web.mp4" },
  { src: "/mp4/Rendered video_web.mp4" },
];

const PROOF_OF_CONCEPT = { src: "/mp4/proof of concept doki helmet_web.mp4", label: "Proof of concept — 3D printed lower half" };

const CONCEPT_MEDIA: { src: string; label?: string; type: "video" | "image" }[] = [
  { src: "/mp4/4bar_web.mp4", label: "Four-bar linkage - cheaks open/close mechanism", type: "video" },
  { src: "/mp4/Bevel gear.png", label: "Bevel gear — chin open/close mechanism", type: "image" },
];

const YOUTUBE_VIDEOS: string[] = [];

// ─── VIDEO LAYOUT DEFAULTS (tweak live with 🎛 button) ───────────────────────
const DEFAULT_GAP       = 0;
const DEFAULT_ASPECT    = 0.71;
const DEFAULT_MAX_WIDTH = 100;
// ─────────────────────────────────────────────────────────────────────────────

const navLinks = [
  { href: "/",          label: "Home",     colorClass: "text-white" },
  { href: "/#projects", label: "Projects", colorClass: "text-white" },
  { href: "/about",     label: "About",    colorClass: "text-white" },
  { href: "/contact",   label: "Contact",  colorClass: "text-white" },
];

interface VideoDebug { gap: number; aspect: number; maxWidth: number; }

function VideoDebugPanel({ values, onChange, onClose }: { values: VideoDebug; onChange: (v: VideoDebug) => void; onClose: () => void }) {
  const set = (key: keyof VideoDebug, val: number) => onChange({ ...values, [key]: val });
  const copy = () => {
    navigator.clipboard.writeText(
      `const DEFAULT_GAP       = ${values.gap};\nconst DEFAULT_ASPECT    = ${values.aspect.toFixed(2)};\nconst DEFAULT_MAX_WIDTH = ${values.maxWidth};`
    );
  };
  const sliders: { label: string; key: keyof VideoDebug; min: number; max: number; step: number }[] = [
    { label: "Gap (px)",       key: "gap",      min: 0,   max: 80,  step: 1    },
    { label: "Aspect ratio",   key: "aspect",   min: 0.3, max: 2.5, step: 0.01 },
    { label: "Max width (%)",  key: "maxWidth", min: 20,  max: 100, step: 1    },
  ];
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 260,
      background: "rgba(0,0,0,0.88)", color: "#fff", padding: "16px 14px",
      overflowY: "auto", zIndex: 9999, fontFamily: "monospace", fontSize: 12,
      borderLeft: "1px solid rgba(255,255,255,0.1)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontWeight: "bold", fontSize: 13 }}>🎛 VIDEO</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, opacity: 0.6, padding: 0 }}>✕</button>
      </div>
      {sliders.map(({ label, key, min, max, step }) => (
        <div key={key} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ opacity: 0.7 }}>{label}</span>
            <span>{values[key].toFixed(step < 1 ? 2 : 0)}</span>
          </div>
          <input type="range" min={min} max={max} step={step} value={values[key]}
            onChange={e => set(key, parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "#a78bfa" }} />
        </div>
      ))}
      <button onClick={copy} style={{
        marginTop: 8, width: "100%", padding: "8px 0", background: "#7c3aed",
        border: "none", borderRadius: 6, color: "#fff", cursor: "pointer",
        fontSize: 12, fontFamily: "monospace",
      }}>Copy constants</button>
    </div>
  );
}

export default function DokiHelmet() {
  const [debugOpen, setDebugOpen] = useState(false);
  const [cfg, setCfg] = useState<VideoDebug>({
    gap: DEFAULT_GAP, aspect: DEFAULT_ASPECT, maxWidth: DEFAULT_MAX_WIDTH,
  });

  return (
    <div className="bg-black text-white min-h-screen">
      {debugOpen && <VideoDebugPanel values={cfg} onChange={setCfg} onClose={() => setDebugOpen(false)} />}
      <button
        onClick={() => setDebugOpen(o => !o)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9998,
          background: "rgba(124,58,237,0.85)", border: "none", borderRadius: 8,
          color: "#fff", padding: "8px 14px", cursor: "pointer",
          fontFamily: "monospace", fontSize: 12, backdropFilter: "blur(6px)",
        }}
      >
        🎛 tweak
      </button>
      <AnimatedHeader navLinks={navLinks} />

      {/* Title + renders */}
      <section className="pt-32 pb-16 px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* LEFT: title, subtitle, concept, 4bar + bevel gear */}
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-6">{TITLE}</h1>
          {SUBTITLE && <p className="text-white/50 text-lg leading-relaxed">{SUBTITLE}</p>}
          {CONCEPT && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-white/40">Concept</h2>
              {CONCEPT.split("\n\n").map((p, i) => (
                <p key={i} className="text-white/60 text-sm leading-relaxed">{p}</p>
              ))}
            </div>
          )}

          {/* 4bar video + bevel gear image side by side */}
          <div className="mt-8 flex gap-4">
            {CONCEPT_MEDIA.map(({ src, label, type }) => (
              <div key={src} style={{ width: "48%" }}>
                {type === "video" ? (
                  <video src={src} autoPlay muted loop playsInline
                    className="w-full rounded-lg" style={{ display: "block" }} />
                ) : (
                  <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: "1424 / 1552" }}>
                    <Image src={src} alt={label ?? ""} fill className="object-cover" />
                  </div>
                )}
                {label && <p className="mt-2 text-xs text-white/30 uppercase tracking-widest">{label}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: renders + proof of concept below */}
        <div>
          <div style={{ display: "flex", gap: cfg.gap }}>
            {LOCAL_VIDEOS.map(({ src, label }) => (
              <div key={src} style={{ width: `${cfg.maxWidth / LOCAL_VIDEOS.length}%`, flexShrink: 0 }}>
                <div style={{ width: "100%", aspectRatio: `${cfg.aspect}`, overflow: "hidden", borderRadius: 8 }}>
                  <video src={src} autoPlay muted loop playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                {label && <p className="mt-2 text-xs text-white/30 uppercase tracking-widest">{label}</p>}
              </div>
            ))}
          </div>

          {/* Proof of concept below renders, centered */}
          <div className="mt-8 flex justify-center">
            <div style={{ width: "60%" }}>
              <video src={PROOF_OF_CONCEPT.src} autoPlay muted loop playsInline
                className="w-full rounded-lg" style={{ display: "block" }} />
              {PROOF_OF_CONCEPT.label && (
                <p className="mt-2 text-xs text-white/30 uppercase tracking-widest text-center">{PROOF_OF_CONCEPT.label}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {YOUTUBE_VIDEOS.map((id) => (
        <section key={id} className="w-full aspect-video">
          <VideoPlayer videoId={id} />
        </section>
      ))}

      <section className="px-8 py-16">
        <h2 className="text-xs uppercase tracking-widest text-white/40 mb-6">Skills Used</h2>
        <div className="flex flex-wrap gap-3">
          {SKILLS.map((s) => (
            <span key={s} className="px-4 py-2 border border-white/20 rounded-full text-sm text-white/80">{s}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
