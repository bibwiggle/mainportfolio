"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  lottieUrl: string;
  link: string;
}

function carouselStyle(offset: number): React.CSSProperties {
  const ease = "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease";

  if (offset === 0) return {
    transform: "translateZ(100px) scale(1)",
    opacity: 1,
    zIndex: 5,
    transition: ease,
  };

  const dir = Math.sign(offset);
  const abs = Math.abs(offset);

  if (abs === 1) return {
    transform: `translateX(${dir * 22}vw) rotateY(${-dir * 42}deg) scale(0.8)`,
    opacity: 1,
    zIndex: 3,
    transition: ease,
    cursor: "pointer",
  };

  // abs >= 2 — hidden off-stage
  return {
    transform: `translateX(${dir * 54}vw) rotateY(${-dir * 58}deg) scale(0.6)`,
    opacity: 0,
    zIndex: 1,
    transition: ease,
    pointerEvents: "none",
  };
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [current, setCurrent] = useState(0);
  const n = projects.length;
  const goTo = (i: number) => setCurrent(((i % n) + n) % n);

  return (
    <div className="relative w-full select-none" style={{ height: "85vh" }}>
      {/* 3D stage */}
      <div
        className="relative w-full h-full"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
      >
        {projects.map((project, i) => {
          let offset = (i - current + n) % n;
          if (offset > n / 2) offset -= n;
          const isCenter = offset === 0;
          const style = carouselStyle(offset);

          return (
            <div
              key={project.id}
              className="absolute overflow-hidden rounded-2xl"
              style={{
                width: "52vw",
                height: "70vh",
                top: "50%",
                left: "50%",
                marginLeft: "-26vw",
                marginTop: "-35vh",
                ...style,
                boxShadow: isCenter
                  ? "0 40px 100px rgba(0,0,0,0.8)"
                  : "0 20px 60px rgba(0,0,0,0.5)",
              }}
              onClick={!isCenter ? () => goTo(i) : undefined}
            >
              {isCenter ? (
                <Link href={project.link} className="group relative w-full h-full block">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    quality={85}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-10">
                    <h3 className="text-white text-3xl font-bold text-center drop-shadow-lg">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-white/85 text-base text-center max-w-md">
                        {project.description}
                      </p>
                    )}
                    <span className="mt-2 text-sm tracking-widest uppercase border border-white/50 text-white/80 px-5 py-2 rounded-full">
                      click to see more
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    quality={70}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-3 z-20">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to project ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current
                ? "rgba(255,255,255,0.9)"
                : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
