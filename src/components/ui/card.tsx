import Image from "next/image";
import Link from "next/link";
import { InteractiveNoise, type NoiseSettings } from "@/components/InteractiveNoise";
import { HelmetScrub } from "@/components/HelmetScrub";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  visualEffect?: "noise" | "helmet-scrub";
  lottieUrl: string;
  link: string;
}

type CardVignette = { opacity: number; width: number; height: number; feather: number; hoverDarkness: number };

export function ProjectGrid({ projects, fullHeight = false, noiseSettings, helmetScale = 1, vignette }: { projects: Project[]; fullHeight?: boolean; noiseSettings?: NoiseSettings; helmetScale?: number; vignette?: CardVignette }) {
  return (
    <div className="grid gap-0 md:grid-cols-2 m-0">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={project.link}
          draggable={project.visualEffect === "helmet-scrub" ? false : undefined}
          style={project.visualEffect === "helmet-scrub" ? { touchAction: "pan-y" } : undefined}
          className={`group relative w-full ${fullHeight ? "h-screen" : "h-[85vh]"} block overflow-hidden`}
        >
          {project.visualEffect === "noise" && noiseSettings ? (
            <InteractiveNoise settings={noiseSettings} />
          ) : project.visualEffect === "helmet-scrub" ? (
            <HelmetScrub poster={project.imageUrl} scale={helmetScale} />
          ) : project.videoUrl ? (
            <video
              aria-hidden="true"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={project.imageUrl}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            >
              <source src={project.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={project.imageUrl}
              alt={project.title}
              quality={85}
              sizes="(min-width: 768px) 50vw, 100vw"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {vignette ? (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                style={{ backgroundColor: `rgba(0, 0, 0, ${vignette.hoverDarkness})` }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0"
                style={{ background: `radial-gradient(ellipse ${vignette.width}% ${vignette.height}% at 80px calc(100% - 80px), rgba(0, 0, 0, ${vignette.opacity}) 0%, rgba(0, 0, 0, ${vignette.opacity}) ${100 - vignette.feather}%, transparent 100%)` }}
              />
              <div className="pointer-events-none absolute bottom-16 left-8 right-8 flex max-w-xs flex-col items-start">
                <h3 className="text-left text-2xl font-bold text-white drop-shadow-lg">{project.title}</h3>
                <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100">
                  <div className="overflow-hidden">
                    <div className="flex flex-col items-start gap-4 pt-4">
                      {project.description && <p className="text-left text-sm leading-relaxed text-white/85">{project.description}</p>}
                      <span className="mt-1 text-xs uppercase tracking-widest text-white/60">click to see more</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400 px-8">
                <h3 className="text-white text-2xl font-bold text-center drop-shadow-lg">{project.title}</h3>
                {project.description && <p className="text-white/85 text-sm text-center max-w-xs leading-relaxed">{project.description}</p>}
                <span className="mt-1 text-xs tracking-widest uppercase text-white/60">click to see more</span>
              </div>
            </>
          )}
        </Link>
      ))}
    </div>
  );
}
