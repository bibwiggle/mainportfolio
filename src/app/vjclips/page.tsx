"use client";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import VideoPlayer from "@/components/VideoPlayer";
import LocalVideoPlayer from "@/components/LocalVideoPlayer";

const TITLE    = "Visual Works";
const SUBTITLE = "Video work spanning live visual performance, editing, and original footage. Made with Resolume, TouchDesigner, Blender, and a camera.";

const SKILLS: string[] = [
  "TouchDesigner",
  "Blender",
  "Resolume",
];

type Clip =
  | { id: number; type: "youtube"; videoId: string; aspectRatio: string }
  | { id: number; type: "local";   src: string; poster?: string; aspectRatio: string };

const clips: Clip[] = [
  { id: 8, type: "youtube", videoId: "rG-gCH8Vhus",                        aspectRatio: "17/30" },
  { id: 5, type: "youtube", videoId: "vlvMBKK9rqE",                        aspectRatio: "17/30" },
  { id: 4, type: "youtube", videoId: "Dxh-egyEjxM",                        aspectRatio: "17/30" },
  { id: 3, type: "youtube", videoId: "v8VdSTnSmL4",                        aspectRatio: "17/30" },
  { id: 2, type: "youtube", videoId: "-Kx1qlzHYl4",                        aspectRatio: "17/30" },
  { id: 6, type: "local",   src: "/mp4/v09044ce0000bu2k28rrspql4e61ee10.mp4", poster: "/mp4/v09044ce0000bu2k28rrspql4e61ee10_thumb.jpg", aspectRatio: "17/30" },
  { id: 7, type: "local",   src: "/mp4/export_1730350545125.mp4",           poster: "/mp4/export_1730350545125_thumb.jpg",           aspectRatio: "17/30" },
  { id: 1, type: "youtube", videoId: "J2KjAoztyIA",                        aspectRatio: "17/30" },
];

const navLinks = [
  { href: "/",          label: "Home",     colorClass: "text-white" },
  { href: "/#projects", label: "Projects", colorClass: "text-white" },
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
          {clips.map((clip) => (
            <div key={clip.id} className="w-full rounded-lg overflow-hidden" style={{ aspectRatio: clip.aspectRatio }}>
              {clip.type === "youtube"
                ? <VideoPlayer videoId={clip.videoId} />
                : <LocalVideoPlayer src={clip.src} poster={clip.poster} />}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
