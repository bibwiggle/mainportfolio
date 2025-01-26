"use client";

import { BackgroundAnimation } from "@/components/lottie";
import { ProjectGrid } from "@/components/ui/card";
import { NameAnimation } from "@/components/NameAnimation";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import React, { useEffect, useState, useRef } from "react";

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
  const pageHeight = document.documentElement.scrollHeight;
  console.log(`The page height is ${pageHeight}px`);
  const [showProjects, setShowProjects] = useState(false);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setShowProjects(scrollPosition > windowHeight * 0.3);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <section 
            className="min-h-screen flex flex-col items-center justify-center relative"
        >
          {/* Projects Title */}
          <div className="py-[60vh]">
            <h2 className="text-emerald-200 text-4xl font-thin tracking-wider sm:text-6xl text-center">
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
  </div>
  
);

}

