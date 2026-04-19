"use client";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import VideoPlayer from "@/components/VideoPlayer";
import Image from "next/image";

// ─── EDIT THESE ───────────────────────────────────────────────────────────────
const TITLE    = "Doki Helmet";
const SUBTITLE = "A fully mechanical helmet built around the Dokkaebi of Korean folklore, filtered through the design language of Iron Man, Power Rangers, and Titanfall.";

const CONCEPT = `The Dokkaebi is a mischievous, powerful figure from Korean folk tradition. This helmet takes that creature and runs it through the visual logic of Titanfall, Iron Man, and Power Rangers Dino Thunder, three franchises that defined what it means for armor to feel alive.

The visor follows the Power Rangers approach of using the creature's mouth as the primary lens, making the face of the Dokkaebi the literal window to the wearer's own. The mechanical movements reference Iron Man's layered panel articulation and Titanfall's visor-lift. At the center is a four-bar linkage system that drives the cheek panels outward in a controlled arc, chosen as much for the drama it creates in motion as for what it does mechanically.`;

const SKILLS: string[] = [
  "Fusion 360",
  "3D Printing",
  "Mechanical Design",
  "Fabrication",
  "Arduino",
];

const LOCAL_VIDEOS: { src: string; label?: string }[] = [
  { src: "/doki assets/rendered rotation_web.mp4" },
  { src: "/doki assets/Rendered video_web.mp4" },
];

const PROOF_OF_CONCEPT = { src: "/doki assets/proof of concept doki helmet_web.mp4", label: "Proof of concept — 3D printed lower half" };

const CONCEPT_MEDIA: { src: string; label?: string; type: "video" | "image" }[] = [
  { src: "/doki assets/4bar_web.mp4", label: "Four-bar linkage - cheeks open/close mechanism", type: "video" },
  { src: "/doki assets/Bevel gear.png", label: "Bevel gear — chin open/close mechanism", type: "image" },
];

const YOUTUBE_VIDEOS: string[] = [];
// ─────────────────────────────────────────────────────────────────────────────

const navLinks = [
  { href: "/",          label: "Home",     colorClass: "text-white" },
  { href: "/#projects", label: "Projects", colorClass: "text-white" },
  { href: "/contact",   label: "Contact",  colorClass: "text-white" },
];

export default function DokiHelmet() {
  return (
    <div className="bg-black text-white min-h-screen">
      <AnimatedHeader navLinks={navLinks} />

      <section className="pt-32 pb-16 px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* LEFT: title, subtitle, concept, tools, 4bar + bevel gear */}
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

          <div className="mt-8 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-white/40">Tools & Tech</h2>
            <div className="flex flex-wrap gap-3">
              {SKILLS.map((s) => (
                <span key={s} className="px-4 py-2 border border-white/20 rounded-full text-sm text-white/80">{s}</span>
              ))}
            </div>
          </div>

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
          <div style={{ display: "flex", gap: 0 }}>
            {LOCAL_VIDEOS.map(({ src, label }) => (
              <div key={src} style={{ width: `${100 / LOCAL_VIDEOS.length}%`, flexShrink: 0 }}>
                <div style={{ width: "100%", aspectRatio: "0.71", overflow: "hidden", borderRadius: 8 }}>
                  <video src={src} autoPlay muted loop playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                {label && <p className="mt-2 text-xs text-white/30 uppercase tracking-widest">{label}</p>}
              </div>
            ))}
          </div>

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
    </div>
  );
}
