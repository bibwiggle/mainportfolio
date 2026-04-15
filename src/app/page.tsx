"use client";

import { ProjectGrid } from "@/components/ui/card";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import { useState, useEffect, useRef } from "react";
import type { LottieRefCurrentProps } from "lottie-react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const LOTTIE_RENDERER_SETTINGS = {
  preserveAspectRatio: "xMidYMid meet",
  progressiveLoad: true,
};

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

// ─── TWEAK THESE (edit defaults here once you've dialled them in) ─────────────
const DEFAULTS = {
  PANEL_PX:             590,
  LEFT_SCALE:           0.58,
  LEFT_SCALE_RATE:     -0.0013,
  LEFT_TRANSLATE_X:    -53,
  LEFT_TRANSLATE_RATE: -0.027,
  LEFT_Y:               0,
  RIGHT_SCALE:         -0.72,
  RIGHT_SCALE_RATE:     0.0005,
  RIGHT_TRANSLATE_X:    66,
  RIGHT_TRANSLATE_RATE: 0.04,
  RIGHT_Y:             1,
  PARALLAX_SPEED:       0.3,
  PARALLAX_OVERFLOW:    60,
  ANIM_SPEED:           2.4,
  SCROLL_SPEED:         0.31,
  LERP:                 0.3,
  // Text
  HERO_PT:              188,
  ARROW_X:              41,
  ARROW_BOTTOM:         2,
  TEXT_WIDTH_VW:        40,
  TEXT_Y:               -15,
  HEADING_MIN:          44,
  HEADING_VW:           8.2,
  HEADING_MAX:          83,
  BIO_MIN:              19,
  BIO_VW:               2.1,
  BIO_MAX:              27,
// textAlign: "right"
};

// ─────────────────────────────────────────────────────────────────────────────

const HERO_PROJECTS_GAP = "40vh";

const HEADING_TEXT = <>Hello,<br />I&apos;m Junu!</>;

type Cfg = typeof DEFAULTS;

// Slider config for the dev panel
const SLIDERS: { key: keyof Cfg; label: string; min: number; max: number; step: number; section?: string }[] = [
  { key: "PANEL_PX",             label: "Panel Width",       min: 100,    max: 1500,  step: 10     },
  { key: "LEFT_SCALE",           label: "L Scale",           min: 0,      max: 5,     step: 0.01   },
  { key: "LEFT_SCALE_RATE",      label: "L Scale Rate",      min: -0.005, max: 0.005, step: 0.0001 },
  { key: "LEFT_TRANSLATE_X",     label: "L Translate X",     min: -300,   max: 300,   step: 1      },
  { key: "LEFT_TRANSLATE_RATE",  label: "L Translate Rate",  min: -0.3,   max: 0.3,   step: 0.001  },
  { key: "LEFT_Y",               label: "L Y",               min: -100,   max: 100,   step: 1      },
  { key: "RIGHT_SCALE",          label: "R Scale",           min: -3,     max: 3,     step: 0.01   },
  { key: "RIGHT_SCALE_RATE",     label: "R Scale Rate",      min: -0.005, max: 0.005, step: 0.0001 },
  { key: "RIGHT_TRANSLATE_X",    label: "R Translate X",     min: -300,   max: 300,   step: 1      },
  { key: "RIGHT_TRANSLATE_RATE", label: "R Translate Rate",  min: -0.3,   max: 0.3,   step: 0.001  },
  { key: "RIGHT_Y",              label: "R Y",               min: -100,   max: 100,   step: 1      },
  { key: "PARALLAX_SPEED",       label: "Parallax Speed",    min: 0,      max: 2,     step: 0.01   },
  { key: "PARALLAX_OVERFLOW",    label: "Parallax Overflow", min: 0,      max: 500,   step: 10     },
  { key: "ANIM_SPEED",           label: "Anim Speed",        min: 0,      max: 10,    step: 0.1    },
  { key: "SCROLL_SPEED",         label: "Scroll Speed",      min: 0,      max: 2,     step: 0.01   },
  { key: "LERP",                 label: "Scroll Lerp",       min: 0.01,   max: 1,     step: 0.01   },
  { key: "HERO_PT",               label: "Hero Top Pad (px)", min: 0,      max: 300,   step: 2,     section: "── text ──" },
  { key: "ARROW_X",              label: "Arrow X",           min: -200,   max: 200,   step: 1      },
  { key: "ARROW_BOTTOM",         label: "Arrow Bottom",      min: 0,      max: 200,   step: 2      },
  { key: "TEXT_WIDTH_VW",        label: "Text Width",        min: 5,      max: 100,   step: 1      },
  { key: "TEXT_Y",               label: "Text Y (vh)",       min: -50,    max: 50,    step: 1      },
  { key: "HEADING_MIN",          label: "H Min px",          min: 10,     max: 100,   step: 1      },
  { key: "HEADING_VW",           label: "H vw",              min: 0,      max: 20,    step: 0.1    },
  { key: "HEADING_MAX",          label: "H Max px",          min: 20,     max: 200,   step: 1      },
  { key: "BIO_MIN",              label: "Bio Min px",        min: 8,      max: 48,    step: 1      },
  { key: "BIO_VW",               label: "Bio vw",            min: 0,      max: 10,    step: 0.1    },
  { key: "BIO_MAX",              label: "Bio Max px",        min: 12,     max: 72,    step: 1      },
];

export default function Page() {
  const [cfg, setCfg] = useState<Cfg>(DEFAULTS);
  const [windowWidth, setWindowWidth] = useState(1920);
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [dsddAnim, setDsddAnim] = useState<object | null>(null);
  const [dspfAnim, setDspfAnim] = useState<object | null>(null);
  const [tweakerOpen, setTweakerOpen] = useState(true);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("right");
  const [copied, setCopied] = useState(false);

  const dsddRef     = useRef<LottieRefCurrentProps>(null);
  const dspfRef     = useRef<LottieRefCurrentProps>(null);
  const leftPanelRef  = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const videoLeftRef  = useRef<HTMLVideoElement>(null);
  const videoRightRef = useRef<HTMLVideoElement>(null);
  const cfgRef  = useRef(cfg);
  const arrowRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLElement>(null);
  const updateArrowPos = useRef<() => void>(() => {});
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
    const lowMemory = ("deviceMemory" in navigator) && (navigator as { deviceMemory: number }).deviceMemory < 4;
    setIsLowEnd(reducedMotion || lowCores || lowMemory);
  }, []);

  useEffect(() => {
    if (isLowEnd) return;
    fetch("/lotties/dsdd.json").then(r => r.json()).then(setDsddAnim);
    fetch("/lotties/dspf.json").then(r => r.json()).then(setDspfAnim);
  }, [isLowEnd]);

  // Apply idle speed whenever cfg.ANIM_SPEED changes (polls until items are ready on first load)
  useEffect(() => {
    let tries = 0;
    const apply = () => {
      const d = dsddRef.current?.animationItem;
      const p = dspfRef.current?.animationItem;
      if (d) d.setSpeed(cfg.ANIM_SPEED);
      if (p) p.setSpeed(cfg.ANIM_SPEED);
      if ((!d || !p) && ++tries < 30) setTimeout(apply, 100);
    };
    apply();
  }, [cfg.ANIM_SPEED]);

  // Scrub dsdd while playing (lerp-smoothed)
  useEffect(() => {
    if (isLowEnd) return;
    let lastY = window.scrollY;
    let scrollTarget = 0;
    let scrollCurrent = 0;
    let rafId: number;

    const handleScroll = () => {
      const delta = window.scrollY - lastY;
      lastY = window.scrollY;
      scrollTarget += Math.abs(delta) * cfgRef.current.SCROLL_SPEED;
    };

    const tick = () => {
      const anim = dsddRef.current?.animationItem;
      if (anim) {
        const prev = scrollCurrent;
        scrollCurrent += (scrollTarget - scrollCurrent) * cfgRef.current.LERP;
        const nudge = scrollCurrent - prev;
        if (Math.abs(nudge) > 0.01) {
          const total = anim.totalFrames;
          const next = ((anim.currentFrame + nudge) % total + total) % total;
          anim.goToAndPlay(next, true);
        }
        // Reset once converged to avoid float drift
        if (Math.abs(scrollTarget - scrollCurrent) < 0.001) {
          scrollTarget = 0;
          scrollCurrent = 0;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isLowEnd]);

  // Scrub dspf while playing (lerp-smoothed)
  useEffect(() => {
    if (isLowEnd) return;
    let lastY = window.scrollY;
    let scrollTarget = 0;
    let scrollCurrent = 0;
    let rafId: number;

    const handleScroll = () => {
      const delta = window.scrollY - lastY;
      lastY = window.scrollY;
      scrollTarget += Math.abs(delta) * cfgRef.current.SCROLL_SPEED;
    };

    const tick = () => {
      const anim = dspfRef.current?.animationItem;
      if (anim) {
        const prev = scrollCurrent;
        scrollCurrent += (scrollTarget - scrollCurrent) * cfgRef.current.LERP;
        const nudge = scrollCurrent - prev;
        if (Math.abs(nudge) > 0.01) {
          const total = anim.totalFrames;
          const next = ((anim.currentFrame + nudge) % total + total) % total;
          anim.goToAndPlay(next, true);
        }
        if (Math.abs(scrollTarget - scrollCurrent) < 0.001) {
          scrollTarget = 0;
          scrollCurrent = 0;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isLowEnd]);

  // Parallax — direct DOM mutation, zero React re-renders
  useEffect(() => {
    const handleScroll = () => {
      const offset = -window.scrollY * cfgRef.current.PARALLAX_SPEED;
      if (leftPanelRef.current)  leftPanelRef.current.style.transform  = `translateY(${offset}px)`;
      if (rightPanelRef.current) rightPanelRef.current.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Force-play videos on low-end (bypasses iOS low-power-mode autoplay block)
  useEffect(() => {
    if (!isLowEnd) return;
    const tryPlay = () => {
      videoLeftRef.current?.play().catch(() => {});
      videoRightRef.current?.play().catch(() => {});
    };
    tryPlay();
    // Retry on first user gesture — the only reliable unlock on iOS low-power mode
    const onGesture = () => {
      tryPlay();
      document.removeEventListener("touchstart", onGesture);
      document.removeEventListener("click", onGesture);
    };
    document.addEventListener("touchstart", onGesture, { passive: true });
    document.addEventListener("click", onGesture);
    return () => {
      document.removeEventListener("touchstart", onGesture);
      document.removeEventListener("click", onGesture);
    };
  }, [isLowEnd]);

  // On low-end: pause animations during scroll so the main thread stays free
  useEffect(() => {
    if (!isLowEnd) return;
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      dsddRef.current?.animationItem?.pause();
      dspfRef.current?.animationItem?.pause();
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        dsddRef.current?.animationItem?.play();
        dspfRef.current?.animationItem?.play();
      }, 200);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (resumeTimer) clearTimeout(resumeTimer);
    };
  }, [isLowEnd]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Arrow scroll — fixed to viewport bottom, stops at projects section top
  useEffect(() => {
    let rafId: number;
    const update = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const arrow = arrowRef.current;
        if (!arrow) return;
        const { ARROW_X, ARROW_BOTTOM } = cfgRef.current;
        const projects = projectsSectionRef.current;
        let lift = ARROW_BOTTOM;
        if (projects) {
          const projectsTop = projects.getBoundingClientRect().top;
          const arrowH = arrow.offsetHeight || 60;
          // Stop the arrow just above the projects section
          const clamp = window.innerHeight - projectsTop - arrowH + 56;
          lift = Math.max(ARROW_BOTTOM, clamp);
          // Hide once projects section has scrolled fully past
          arrow.style.opacity = projectsTop < -arrowH ? "0" : "1";
        }
        // Only update transform — never layout-triggering bottom
        arrow.style.transform = `translateX(calc(-50% + ${ARROW_X}px)) translateY(-${lift}px)`;
      });
    };
    updateArrowPos.current = update;
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Re-apply arrow position when ARROW_X / ARROW_BOTTOM change from tweaker
  useEffect(() => { updateArrowPos.current(); }, [cfg.ARROW_X, cfg.ARROW_BOTTOM]);

  // ── Computed transforms ───────────────────────────────────────────────────
  const leftScale       = cfg.LEFT_SCALE      - windowWidth * cfg.LEFT_SCALE_RATE;
  const rightScale      = cfg.RIGHT_SCALE     - windowWidth * cfg.RIGHT_SCALE_RATE;
  const leftTranslateX  = cfg.LEFT_TRANSLATE_X  - windowWidth * cfg.LEFT_TRANSLATE_RATE;
  const rightTranslateX = cfg.RIGHT_TRANSLATE_X - windowWidth * cfg.RIGHT_TRANSLATE_RATE;

  // ── Responsive bio text ───────────────────────────────────────────────────
  const bioText =
    windowWidth < 640 ? (
      <>a designer and maker in NYC.</>
    ) : windowWidth < 1024 ? (
      <>a designer and maker in NYC,<br />working across digital and physical design.</>
    ) : (
      <>
        a designer and maker based in NYC.
        I work across digital and physical design,
        translating concepts into interactive
        installations, 3D visuals, and fabricated prototypes.
      </>
    );

  // ── Dev tweaker helpers ───────────────────────────────────────────────────
  const set = (key: keyof Cfg, val: number) =>
    setCfg(c => ({ ...c, [key]: val }));

  const copyToCode = () => {
    const lines = [
      `  PANEL_PX:             ${cfg.PANEL_PX},`,
      `  LEFT_SCALE:           ${cfg.LEFT_SCALE},`,
      `  LEFT_SCALE_RATE:     ${cfg.LEFT_SCALE_RATE},`,
      `  LEFT_TRANSLATE_X:    ${cfg.LEFT_TRANSLATE_X},`,
      `  LEFT_TRANSLATE_RATE: ${cfg.LEFT_TRANSLATE_RATE},`,
      `  LEFT_Y:               ${cfg.LEFT_Y},`,
      `  RIGHT_SCALE:         ${cfg.RIGHT_SCALE},`,
      `  RIGHT_SCALE_RATE:     ${cfg.RIGHT_SCALE_RATE},`,
      `  RIGHT_TRANSLATE_X:    ${cfg.RIGHT_TRANSLATE_X},`,
      `  RIGHT_TRANSLATE_RATE: ${cfg.RIGHT_TRANSLATE_RATE},`,
      `  RIGHT_Y:             ${cfg.RIGHT_Y},`,
      `  PARALLAX_SPEED:       ${cfg.PARALLAX_SPEED},`,
      `  PARALLAX_OVERFLOW:    ${cfg.PARALLAX_OVERFLOW},`,
      `  ANIM_SPEED:           ${cfg.ANIM_SPEED},`,
      `  SCROLL_SPEED:         ${cfg.SCROLL_SPEED},`,
      `  LERP:                 ${cfg.LERP},`,
      `  // Text`,
      `  HERO_PT:              ${cfg.HERO_PT},`,
      `  ARROW_X:              ${cfg.ARROW_X},`,
      `  ARROW_BOTTOM:         ${cfg.ARROW_BOTTOM},`,
      `  TEXT_WIDTH_VW:        ${cfg.TEXT_WIDTH_VW},`,
      `  TEXT_Y:               ${cfg.TEXT_Y},`,
      `  HEADING_MIN:          ${cfg.HEADING_MIN},`,
      `  HEADING_VW:           ${cfg.HEADING_VW},`,
      `  HEADING_MAX:          ${cfg.HEADING_MAX},`,
      `  BIO_MIN:              ${cfg.BIO_MIN},`,
      `  BIO_VW:               ${cfg.BIO_VW},`,
      `  BIO_MAX:              ${cfg.BIO_MAX},`,
      `// textAlign: "${textAlign}"`,
    ].join("\n");
    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isDev = process.env.NODE_ENV === "development";

  const homePageLinks = [
    { href: "#projects", label: "Projects", colorClass: "text-white" },
    { href: "/about",    label: "About",    colorClass: "text-white" },
    { href: "/contact",  label: "Contact",  colorClass: "text-white" },
  ];

  return (
    <div className="relative min-h-screen no-scrollbar">

      {/* Background panels */}
      <div className="fixed inset-0 z-0">

        {/* Left panel — wrapper ref'd for scroll-driven translateY only */}
        <div ref={leftPanelRef} className="absolute top-0 left-0 h-full" style={{ width: `${cfg.PANEL_PX}px`, zIndex: 1, willChange: "transform" }}>
          {/* React controls translateX + scale — separate div so scroll handler never clobbers it */}
          <div style={{ width: "100%", height: "100%", transform: `translateX(${leftTranslateX}%) scale(${leftScale})` }}>
            <div style={{ position: "absolute", top: -cfg.PARALLAX_OVERFLOW, bottom: -cfg.PARALLAX_OVERFLOW, left: 0, right: 0,
              transform: `translateX(-10%) translateY(${cfg.LEFT_Y}%)`,
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {isLowEnd
                ? <video ref={videoLeftRef} autoPlay muted loop playsInline preload="auto" style={{ width: "100%", height: "100%", objectFit: "contain" }}><source src="/mp4/Lottie_web.mp4" type="video/mp4" /></video>
                : dsddAnim && <Lottie lottieRef={dsddRef} animationData={dsddAnim} loop autoplay
                    rendererSettings={LOTTIE_RENDERER_SETTINGS}
                    style={{ width: "100%", height: "100%" }} />}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div ref={rightPanelRef} className="absolute top-0 right-0 h-full" style={{ width: `${cfg.PANEL_PX}px`, zIndex: 2, willChange: "transform" }}>
          <div style={{ width: "100%", height: "100%", transform: `translateX(${rightTranslateX}%) scale(${rightScale})` }}>
            <div style={{ position: "absolute", top: -cfg.PARALLAX_OVERFLOW, bottom: -cfg.PARALLAX_OVERFLOW, left: 0, right: 0,
              transform: `translateX(10%) translateY(${cfg.RIGHT_Y}%)`,
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {isLowEnd
                ? <video ref={videoRightRef} autoPlay muted loop playsInline preload="auto" style={{ width: "100%", height: "100%", objectFit: "contain" }}><source src="/mp4/Comp_1_web.mp4" type="video/mp4" /></video>
                : dspfAnim && <Lottie lottieRef={dspfRef} animationData={dspfAnim} loop autoplay
                    rendererSettings={LOTTIE_RENDERER_SETTINGS}
                    style={{ width: "100%", height: "100%" }} />}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <AnimatedHeader navLinks={homePageLinks} />
        <main className="relative z-10">
          {/* Hero */}
          <section className="relative min-h-screen h-screen flex items-center justify-center pb-8 md:pb-0" style={{ paddingTop: cfg.HERO_PT }}>
            <div className="px-8" style={{
              width: `${cfg.TEXT_WIDTH_VW}vw`,
              textAlign,
              transform: `translateY(${cfg.TEXT_Y}vh)`,
            }}>
              <h1 className="text-white font-bold leading-tight mb-2 md:mb-6" style={{ fontSize: `clamp(${cfg.HEADING_MIN}px, min(${cfg.HEADING_VW}vw, 12vh), ${cfg.HEADING_MAX}px)` }}>
                {HEADING_TEXT}
              </h1>
              <p className="text-white/80 leading-relaxed" style={{ fontSize: `clamp(${cfg.BIO_MIN}px, min(${cfg.BIO_VW}vw, 4vh), ${cfg.BIO_MAX}px)` }}>
                {bioText}
              </p>
            </div>

          </section>

          <div style={{ height: HERO_PROJECTS_GAP }} />

          {/* Projects */}
          <section ref={projectsSectionRef} className="min-h-screen flex flex-col items-center justify-center relative">
            <div className="flex-1 w-full bg-black" id="projects">
              <ProjectGrid projects={projects} />
            </div>
          </section>
        </main>
      </div>

      {/* ── Projects arrow — fixed, scroll-driven ────────────────────────── */}
      <div
        ref={arrowRef}
        style={{ position: "fixed", left: "50%", bottom: 0, zIndex: 20,
          transform: `translateX(calc(-50% + ${cfg.ARROW_X}px)) translateY(-${cfg.ARROW_BOTTOM}px)`,
          willChange: "transform" }}
      >
        <a href="#projects" className="text-white flex flex-col items-center gap-1 opacity-0 animate-fadeInBounce">
          <span className="text-sm tracking-widest uppercase">Projects</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </div>

      {/* ── Dev Tweaker Panel (dev mode only) ─────────────────────────────── */}
      {isDev && (
        <div
          className="fixed top-4 right-4 z-50 select-none"
          style={{ fontFamily: "monospace" }}
        >
          {/* Toggle button */}
          <button
            onClick={() => setTweakerOpen(o => !o)}
            className="mb-1 ml-auto flex items-center gap-1 rounded px-2 py-1 text-xs"
            style={{ background: "rgba(0,0,0,0.75)", color: "#aaa", border: "1px solid #333" }}
          >
            <span style={{ color: "#4ade80" }}>⚙</span>
            {tweakerOpen ? "hide tweaker" : "show tweaker"}
          </button>

          {tweakerOpen && (
            <div
              className="rounded-lg overflow-y-auto"
              style={{
                width: 240,
                maxHeight: "calc(100vh - 80px)",
                background: "rgba(0,0,0,0.85)",
                border: "1px solid #333",
                padding: "10px 12px",
                color: "#ccc",
                fontSize: 11,
              }}
            >
              {/* Window width readout + low-end toggle */}
              <div style={{ marginBottom: 8, color: "#666", fontSize: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>window: <span style={{ color: "#4ade80" }}>{windowWidth}px</span></span>
                <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isLowEnd}
                    onChange={e => setIsLowEnd(e.target.checked)}
                    style={{ accentColor: "#4ade80", cursor: "pointer" }}
                  />
                  <span>low-end</span>
                </label>
              </div>

              {SLIDERS.map(({ key, label, min, max, step, section }) => (
                <div key={key}>
                  {section && (
                    <div style={{ color: "#555", fontSize: 9, textTransform: "uppercase", letterSpacing: 1, margin: "10px 0 6px", borderTop: "1px solid #333", paddingTop: 8 }}>
                      {section}
                    </div>
                  )}
                  {key === "TEXT_WIDTH_VW" && (
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ color: "#888", marginBottom: 4, fontSize: 11 }}>Align</div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {(["left", "center", "right"] as const).map(a => (
                          <button
                            key={a}
                            onClick={() => setTextAlign(a)}
                            style={{
                              flex: 1, padding: "3px 0", fontSize: 10, borderRadius: 4, cursor: "pointer",
                              background: textAlign === a ? "#14532d" : "#1a1a1a",
                              border: `1px solid ${textAlign === a ? "#4ade80" : "#444"}`,
                              color: textAlign === a ? "#4ade80" : "#aaa",
                            }}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ color: "#888" }}>{label}</span>
                      <span style={{ color: "#fff" }}>{cfg[key]}</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={cfg[key]}
                      onChange={e => set(key, parseFloat(e.target.value))}
                      style={{ width: "100%", accentColor: "#4ade80", cursor: "pointer" }}
                    />
                  </div>
                </div>
              ))}

              {/* Reset + Copy */}
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <button
                  onClick={() => setCfg(DEFAULTS)}
                  style={{
                    flex: 1, padding: "4px 0", fontSize: 10, borderRadius: 4,
                    background: "#1a1a1a", border: "1px solid #444", color: "#aaa", cursor: "pointer",
                  }}
                >
                  reset
                </button>
                <button
                  onClick={copyToCode}
                  style={{
                    flex: 2, padding: "4px 0", fontSize: 10, borderRadius: 4,
                    background: copied ? "#14532d" : "#1a1a1a",
                    border: `1px solid ${copied ? "#4ade80" : "#444"}`,
                    color: copied ? "#4ade80" : "#aaa", cursor: "pointer",
                    transition: "background 0.2s, border-color 0.2s, color 0.2s",
                  }}
                >
                  {copied ? "copied!" : "copy to code"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
