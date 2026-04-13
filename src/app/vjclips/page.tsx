"use client";
import VideoPlayer from "@/components/VideoPlayer";
import { AnimatedHeader } from "@/components/AnimatedHeader";

interface Clip {
  id: number;
  videoId: string;
  aspectRatio: string;
}

const clips: Clip[] = [
  { id: 1, videoId: "J2KjAoztyIA", aspectRatio: "17/30" },
  { id: 2, videoId: "-Kx1qlzHYl4", aspectRatio: "17/30" },
];

export default function VJClips() {
  const navLinks = [
    { href: "/", label: "Home", colorClass: "text-white" },
    { href: "/#projects", label: "Projects", colorClass: "text-white" },
    { href: "/about", label: "About", colorClass: "text-white" },
    { href: "/contact", label: "Contact", colorClass: "text-white" },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <AnimatedHeader navLinks={navLinks} />

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        <section>
          <h1 className="text-white text-6xl font-thin tracking-tight">VJ Clips</h1>
          <p className="mt-5 text-xl text-white/80">
            A collection of real-time visual clips for projection, DJ sets, or live performance—most made using TouchDesigner, Blender, and Resolume. Designed to be looped, remixed, and layered for unique visuals in any context.
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clips.map((clip) => (
              <div key={clip.id} className="bg-white/5 rounded-xl shadow-lg p-3 flex flex-col">
                <div className="relative w-full mb-3" style={{ aspectRatio: clip.aspectRatio }}>
                  <VideoPlayer videoId={clip.videoId} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <a href="/#projects" className="inline-block mt-8 text-white underline hover:text-white/70 transition">
            ← Back to Projects
          </a>
        </section>
      </main>
    </div>
  );
}
