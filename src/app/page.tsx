"use client";

import { BackgroundAnimation } from "@/components/lottie";
import { ProjectGrid } from "@/components/ui/card";
// import { NameAnimation } from "@/components/NameAnimation";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import React from "react";
import { exo } from "@/fonts";

const projects = [
  {
    id: "1",
    title: "Dancing Dancheong (단청)",
    description:
      "A digital art installation inspired by traditional Korean decorative techniques.",
    imageUrl: "/assets/thesisv3.png",
    lottieUrl: "/lotties/DDlottie.json",
    link: "/dancingdancheong",
  },
  {
    id: "2",
    title: "Beat Bowl",
    description:
      "An interactive music experience that combines rhythm and visual elements.",
    imageUrl: "/assets/DownscaleBB.jpg",
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
    <h1
      className={`
        text-white
        font-extrabold
        text-6xl md:text-8xl lg:text-9xl
        tracking-tight
        drop-shadow-[0_5px_7px_rgba(0,255,180,1)]
        leading-none
        ${exo.className}
      `}
      style={{ letterSpacing: "0.05em" }}
    >
      Junu
    </h1>
    <span
      className="
        block
        mt-0.1
        text-2xl text-white tracking-wider
        drop-shadow-[0_2px_2px_rgba(0,210,255,1)]
        font-semibold
        text-center
        px-2
      "
    >
      designer • artist • technologist
    </span>
  </div>
  
</section>
<h2 className={`
          ${exo.className} 
          antialiased 
          text-5xl tracking-wider sm:text-3xl md:text-5xl 
          text-center max-w-4xl mx-auto px-4 
          font-bold
          text-white
          custom-nabla-color-projects
          drop-shadow-[0_5px_7px_rgba(255,100,100,1)]
        `}>
                ↓
              </h2>

          {/* Projects Section - Full screen with centered title */}
          <section className="min-h-screen flex flex-col items-center justify-center relative">
            {/* Projects Title */}
            <div className="py-[20vh]">

            </div>

            {/* Project Grid */}
            <div className="flex-1 w-full bg-black" id="projects">
              <ProjectGrid projects={projects}/>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}