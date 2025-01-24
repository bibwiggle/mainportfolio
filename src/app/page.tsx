"use client";

import { BackgroundAnimation } from "@/components/lottie";
import { ProjectGrid } from "@/components/ui/card";
import { NameAnimation } from "@/components/NameAnimation";
import { AnimatedHeader } from "@/components/AnimatedHeader";

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
        <main className="flex-1" style={{ height: "200vh" }}>
          <div className="absolute inset-0 z-0">
            <BackgroundAnimation />
          </div>
          <section
            className="w-full items-center justify-center content-center"
            style={{ height: "calc(100vh)" }}
          >
            <div className="container px-4 md:px-5 mx-auto h-full flex flex-col justify-center items-center">
              <div className="space-y-0 text-center">
                <div className="relative inline">
                  <NameAnimation />
                </div>
              </div> 
            </div>
          </section>

          <section id="projects" className="w-full">
            <div className="py-4 backdrop-blur-sm shadow">
              <h2 className="text-emerald-200 text-3xl font-thin tracking-normal sm:text-5xl text-center">
                Projects
              </h2>
            </div>
            <ProjectGrid projects={projects} />
          </section>
        </main>
      </div>
    </div>
  );
}