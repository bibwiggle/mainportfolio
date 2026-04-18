"use client";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import VideoPlayer from "@/components/VideoPlayer";

const TITLE    = "Visual Works";
const SUBTITLE = "A collection of real-time visual clips made using TouchDesigner and Resolume.";

const SKILLS: string[] = [
  "TouchDesigner",
  "Blender",
  "Resolume",
];

interface Clip { id: number; videoId: string; aspectRatio: string; }

const clips: Clip[] = [
  { id: 1, videoId: "J2KjAoztyIA", aspectRatio: "17/30" },
  { id: 2, videoId: "-Kx1qlzHYl4", aspectRatio: "17/30" },
];

const navLinks = [
  { href: "/",          label: "Home",     colorClass: "text-white" },
  { href: "/#projects", label: "Projects", colorClass: "text-white" },
  { href: "/about",     label: "About",    colorClass: "text-white" },
  { href: "/contact",   label: "Contact",  colorClass: "text-white" },
];

export default function VJClips() {
  return (
    <div className="bg-black text-white min-h-screen">
      <AnimatedHeader navLinks={navLinks} />

      {/* Header */}
      <section className="pt-32 pb-12 px-8">
        <h1 className="text-5xl font-bold tracking-tight mb-6">{TITLE}</h1>
        <p className="text-white/50 text-lg leading-relaxed max-w-2xl">{SUBTITLE}</p>

        <div className="mt-8 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-white/40">Tools & Tech</h2>
          <div className="flex flex-wrap gap-3">
            {SKILLS.map((s) => (
              <span key={s} className="px-4 py-2 border border-white/20 rounded-full text-sm text-white/80">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Video grid */}
      <section className="px-8 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {clips.map((clip) => (
            <div key={clip.id} className="w-full rounded-lg overflow-hidden" style={{ aspectRatio: clip.aspectRatio }}>
              <VideoPlayer videoId={clip.videoId} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
