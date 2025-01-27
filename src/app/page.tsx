"use client";

import { BackgroundAnimation } from "@/components/lottie";
import { ProjectGrid } from "@/components/ui/card";
import { NameAnimation } from "@/components/NameAnimation";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import React from "react";
import { nabla } from "@/fonts";

const projects = [
  {
    id: "1",
    title: "Dancing Dancheong (단청)",
    description:
      "A digital art installation inspired by traditional Korean decorative techniques.",
    imageUrl: "/thesisv3.png",
    lottieUrl: "/lotties/DDlottie.json",
    link: "/dancingdancheong",
  },
  {
    id: "2",
    title: "Beat Bowl",
    description:
      "An interactive music experience that combines rhythm and visual elements.",
    imageUrl: "/DownscaleBB.jpg",
    lottieUrl: "/lotties/beatbowl.json",
    link: "/beatbowl",
  },
  {
    id: "3",
    title: "VJ clips",
    description:
      "A collection of visually stunning video clips for live performances and events.",
    imageUrl: "/VJtn.jpg",
    lottieUrl: "/lotties/VJclips.json",
    link: "/vjclips",
  },
];

export default function Page() {
  const homePageLinks = [
    { href: "#projects", label: "Projects", colorClass: "text-rose-300" },
    { href: "/about", label: "About", colorClass: "text-cyan-400" },
    { href: "/contact", label: "Contact", colorClass: "text-emerald-200" },
  ];


  return (
    <div className="relative min-h-screen no-scrollbar">
      <div className="relative z-10 min-h-screen flex flex-col">
        <AnimatedHeader navLinks={homePageLinks} />  
        <div className="fixed inset-0 z-0">
          <BackgroundAnimation />
        </div>

        <main className="relative z-10">
          {/* Name Section - Full screen */}
          <section className="h-screen flex items-center justify-center">
            <div className="container px-4 md:px-5 mx-auto h-full flex flex-col justify-center items-center">
              <NameAnimation />
            </div>
          </section>

          {/* Projects Section - Full screen with centered title */}
          <section className="min-h-screen flex flex-col items-center justify-center relative">
            {/* Projects Title */}
            <div className="py-[60vh]">
              <h2 className={`${nabla.className} antialiased text-4xl tracking-wider sm:text-5xl md:text-6xl text-center max-w-4xl mx-auto px-4 custom-nabla-color-projects`}>
                Projects Below
              </h2>
            </div>

            {/* Project Grid */}
            <div className="flex-1 w-full bg-black" id="projects">
              <ProjectGrid projects={projects}/>
            </div>
          </section>
        </main>
      </div>
      <style jsx global>{`
        :root {
          --nabla-color-name: #C7E9DE;
          --nabla-color-projects: #FFD700;
        }
        .custom-nabla-color-name {
          filter: url(#nabla-color-filter-name);
        }
        .custom-nabla-color-projects {
          filter: url(#nabla-color-filter-projects);
        }
        @supports not (filter: url(#nabla-color-filter-name)) {
          .custom-nabla-color-name {
            color: var(--nabla-color-name);
          }
        }
        @supports not (filter: url(#nabla-color-filter-projects)) {
          .custom-nabla-color-projects {
            color: var(--nabla-color-projects);
          }
        }
      `}</style>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="nabla-color-filter-name">
            <feColorMatrix
              type="matrix"
              values="1.780 0 0 0 0
                      1 0.914 0 0 0
                      1 0 0.871 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="nabla-color-filter-projects">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0.843 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}