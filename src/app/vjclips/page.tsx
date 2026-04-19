"use client";
import { useEffect } from "react";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import VideoPlayer from "@/components/VideoPlayer";
import Script from "next/script";

const TITLE    = "Visual Works";
const SUBTITLE = "Real-time visual work made in Resolume, TouchDesigner, and Blender. This is where it all started.";

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

const INSTAGRAM_REELS: string[] = [
  "https://www.instagram.com/reel/DWPxoy1kdNF/?utm_source=ig_embed&utm_campaign=loading",
];

const navLinks = [
  { href: "/",          label: "Home",     colorClass: "text-white" },
  { href: "/#projects", label: "Projects", colorClass: "text-white" },
  { href: "/contact",   label: "Contact",  colorClass: "text-white" },
];

export default function VJClips() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, []);

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
              <VideoPlayer videoId={clip.videoId} />
            </div>
          ))}
          {INSTAGRAM_REELS.map((permalink) => (
            <blockquote
              key={permalink}
              className="instagram-media"
              data-instgrm-captioned
              data-instgrm-permalink={permalink}
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: "3px",
                boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                margin: 0,
                maxWidth: "540px",
                minWidth: "326px",
                padding: 0,
                width: "100%",
              }}
            />
          ))}
        </div>
      </section>

      <Script src="//www.instagram.com/embed.js" strategy="afterInteractive" />
    </div>
  );
}
