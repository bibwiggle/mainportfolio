"use client";

import { AnimatedHeader } from "@/components/AnimatedHeader";
import VideoPlayer from "@/components/VideoPlayer";
import LocalVideoPlayer from "@/components/LocalVideoPlayer";

const TITLE = "Visual Works";
const SUBTITLE = "Video work spanning live visual performance, editing, and original footage. Made with Resolume, TouchDesigner, Blender, and a adobe suite.";

const SKILLS = ["TouchDesigner", "Blender", "Resolume", "Video Editing", "Camera Work"];

type VisualClip =
  | { id: string; title: string; type: "youtube"; videoId: string }
  | { id: string; title: string; type: "local"; src: string; poster: string };

const clips: VisualClip[] = [
  { id: "vj-1", type: "youtube", videoId: "kThJ-WOY3SI", title: "Visual Work" },
  { id: "vj-2", type: "youtube", videoId: "3YqU2R2awY0", title: "Visual Work" },
  { id: "vj-3", type: "youtube", videoId: "VeDs-DxPeUk", title: "Visual Work" },
  { id: "vj-4", type: "youtube", videoId: "rG-gCH8Vhus", title: "Visual Work" },
  { id: "vj-5", type: "youtube", videoId: "vlvMBKK9rqE", title: "Visual Work" },
  { id: "vj-6", type: "youtube", videoId: "Dxh-egyEjxM", title: "Visual Work" },
  { id: "vj-7", type: "youtube", videoId: "v8VdSTnSmL4", title: "Visual Work" },
  { id: "vj-8", type: "youtube", videoId: "-Kx1qlzHYl4", title: "Visual Work" },
  { id: "vj-9", type: "youtube", videoId: "J2KjAoztyIA", title: "Visual Work" },
  { id: "techwear-1", type: "local", src: "/mp4/v09044ce0000bu2k28rrspql4e61ee10.mp4", poster: "/mp4/v09044ce0000bu2k28rrspql4e61ee10_thumb.jpg", title: "Techwear video collaboration" },
  { id: "techwear-2", type: "local", src: "/mp4/export_1730350545125.mp4", poster: "/mp4/export_1730350545125_thumb.jpg", title: "Techwear video collaboration" },
  { id: "anime-rave", type: "youtube", videoId: "ckRolrJ5SKI", title: "Anime Rave — Live VJ Set" },
];

const navLinks = [
  { href: "/", label: "Home", colorClass: "text-white" },
  { href: "/fabrication", label: "Fabrication", colorClass: "text-white" },
  { href: "/vjclips", label: "Visual Works", colorClass: "text-white" },
  { href: "/contact", label: "Contact", colorClass: "text-white" },
];

export default function VJClips() {
  return (
    <div className="bg-black text-white min-h-screen">
      <AnimatedHeader navLinks={navLinks} />

      <section className="pt-32 pb-12 px-8">
        <h1 className="text-5xl font-bold tracking-tight mb-6">{TITLE}</h1>
        <p className="text-white/50 text-lg leading-relaxed max-w-2xl">{SUBTITLE}</p>
        <div className="mt-8 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-white/40">Tools &amp; Tech</h2>
          <div className="flex flex-wrap gap-3">
            {SKILLS.map((skill) => (
              <span key={skill} className="px-4 py-2 border border-white/20 rounded-full text-sm text-white/80">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 pb-16" aria-label="Visual work collections">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {clips.map((clip) => (
            <article key={clip.id}>
              <div className="overflow-hidden rounded-lg bg-white/5" style={{ aspectRatio: "9 / 16" }}>
                {clip.type === "youtube"
                  ? <VideoPlayer videoId={clip.videoId} />
                  : <LocalVideoPlayer src={clip.src} poster={clip.poster} />}
              </div>
              {clip.title !== "Visual Work" && <h2 className="mt-3 text-base font-medium">{clip.title}</h2>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
