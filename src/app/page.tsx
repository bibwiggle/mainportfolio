"use client";

import { ProjectGrid } from "@/components/ui/card";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import { useState, useEffect } from "react";
import Image from "next/image";

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

// ─── TWEAK THESE ─────────────────────────────────────────────────────────────
const PANEL_PX = 600;  // width of each panel in pixels — gap in middle grows as window widens

const LEFT_SCALE       = 1.8;
const LEFT_SCALE_RATE  = -0.0005;
const LEFT_TRANSLATE_X    = -80;
const LEFT_TRANSLATE_RATE = -0.05;
const LEFT_Y              = 0;

const RIGHT_SCALE          = -.5;
const RIGHT_SCALE_RATE     = 0.0005;
const RIGHT_TRANSLATE_X    = 80;
const RIGHT_TRANSLATE_RATE = 0.04;
const RIGHT_Y              = 0;

const PARALLAX_SPEED    = 0.3;
const PARALLAX_OVERFLOW = 150;

const HERO_PROJECTS_GAP = "40vh";

// Text
const HEADING_TEXT = <>Hello,<br />I&apos;m Junu!</>;
const BIO_TEXT = (
  <>
    a designer and maker based in NYC.
    I work across digital and physical design,
    translating concepts into interactive
    installations, 3D visuals, and fabricated prototypes.
  </>
);
// font size: clamp(min, preferred_vw, max)
const HEADING_FONT = "clamp(24px, 6vw, 72px)";
const BIO_FONT     = "clamp(18px, 1.5vw, 24px)";

const TEXT_WIDTH = "40vw";
// ─────────────────────────────────────────────────────────────────────────────

export default function Page() {
  const [scrollY, setScrollY] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1920);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => { setWindowWidth(window.innerWidth); };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const panOffset  = -scrollY * PARALLAX_SPEED;
  const leftScale      = LEFT_SCALE      - windowWidth * LEFT_SCALE_RATE;
  const rightScale     = RIGHT_SCALE     - windowWidth * RIGHT_SCALE_RATE;
  const leftTranslateX = LEFT_TRANSLATE_X  - windowWidth * LEFT_TRANSLATE_RATE;
  const rightTranslateX = RIGHT_TRANSLATE_X - windowWidth * RIGHT_TRANSLATE_RATE;


  const homePageLinks = [
    { href: "#projects", label: "Projects", colorClass: "text-rose-300" },
    { href: "/about",    label: "About",    colorClass: "text-cyan-400" },
    { href: "/contact",  label: "Contact",  colorClass: "text-emerald-200" },
  ];

  return (
    <div className="relative min-h-screen no-scrollbar">

      {/* Background panels — outside z-10 so they sit behind everything */}
      <div className="fixed inset-0 z-0">

        {/* Left panel */}
        <div className="absolute top-0 left-0 h-full" style={{ width: `${PANEL_PX}px`, zIndex: 1,
          transform: `translateY(${panOffset}px) translateX(${leftTranslateX}%) scale(${leftScale})` }}>
          <div style={{ position: "absolute", top: -PARALLAX_OVERFLOW, bottom: -PARALLAX_OVERFLOW, left: 0, right: 0 }}>
            <Image src="/assets/Dancheong.png" alt="" fill className="object-contain"
              style={{ transform: `translateX(-10%) translateY(${LEFT_Y}%)` }} />
          </div>
        </div>

        {/* Right panel */}
        <div className="absolute top-0 right-0 h-full" style={{ width: `${PANEL_PX}px`,
          transform: `translateY(${panOffset}px) translateX(${rightTranslateX}%) scale(${rightScale})` }}>
          <div style={{ position: "absolute", top: -PARALLAX_OVERFLOW, bottom: -PARALLAX_OVERFLOW, left: 0, right: 0 }}>
            <Image src="/assets/SpiritualM.png" alt="" fill className="object-contain"
              style={{ transform: `translateX(10%) translateY(${RIGHT_Y}%)` }} />
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <AnimatedHeader navLinks={homePageLinks} />
        <main className="relative z-10">
          {/* Hero */}
          <section className="h-screen flex items-center justify-center">
            <div className="px-8 text-center" style={{ width: TEXT_WIDTH }}>
              <h1 className="text-white font-bold leading-tight mb-6" style={{ fontSize: HEADING_FONT }}>
                {HEADING_TEXT}
              </h1>
              <p className="text-white/80 leading-relaxed" style={{ fontSize: BIO_FONT }}>
                {BIO_TEXT}
              </p>
            </div>
          </section>

          {/* Down arrow */}
          <div className="flex justify-center -mt-16">
            <a href="#projects" className="text-white flex flex-col items-center gap-1 opacity-0 animate-fadeInBounce">
              <span className="text-sm tracking-widest uppercase">Projects</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </div>

          <div style={{ height: HERO_PROJECTS_GAP }} />

          {/* Projects */}
          <section className="min-h-screen flex flex-col items-center justify-center relative">
            <div className="flex-1 w-full bg-black" id="projects">
              <ProjectGrid projects={projects} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
