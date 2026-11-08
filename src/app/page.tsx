"use client";

import { ProjectGrid } from "@/components/ui/card";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import { DEFAULT_CHROME_SETTINGS } from "@/components/ChromeNavBackground";
import { CompatibleBloom } from "@/components/CompatibleBloom";
import { useState, useEffect, useRef, useId } from "react";
import type { LottieRefCurrentProps } from "lottie-react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const LOTTIE_RENDERER_SETTINGS = {
  preserveAspectRatio: "xMidYMid meet",
  progressiveLoad: true,
};

const projects = [
  {
    id: "fabrication",
    title: "Fabrication",
    description: "Kinetic sculpture, physical computing, mechanisms, and cosplay.",
    imageUrl: "/assets/DDthumb2.png",
    lottieUrl: "/lotties/DDlottie.json",
    link: "/fabrication",
  },
  {
    id: "visual-works",
    title: "Visual Works",
    description: "VJing, projection mapping, camera work, and moving images.",
    imageUrl: "/VJtn.jpg",
    lottieUrl: "/lotties/VJclips.json",
    link: "/vjclips",
  },
];

// ─── TWEAK THESE (edit defaults here once you've dialled them in) ─────────────
const DEFAULTS = {
  ...DEFAULT_CHROME_SETTINGS,
  PANEL_PX:             590,
  RIGHT_SCALE:         -1.06,
  RIGHT_SCALE_RATE:     0.0005,
  RIGHT_TRANSLATE_X:    -3,
  RIGHT_TRANSLATE_RATE: 0.001,
  RIGHT_Y:             26,
  RIGHT_ROTATION:      90,
  PARALLAX_SPEED:       0.69,
  BLOOM_AMOUNT:        1.5,
  BLOOM_THRESHOLD:     0.01,
  BLOOM_SIZE:          4,
  PARALLAX_OVERFLOW:    60,
  IDLE_FPS:             60,
  SCROLL_SPEED:         0.5,
  LERP:                 0.3,
  // Text
  HERO_PT:              164,
  ARROW_X:              8,
  ARROW_BOTTOM:         2,
  TEXT_WIDTH_VW:        50,
  TEXT_Y:               -24,
  MOBILE_TEXT_Y:        -20,
  HEADING_MIN:          45,
  HEADING_VW:           8.2,
  HEADING_MAX:          76,
  BIO_MIN:              18,
  BIO_VW:               1.6,
  BIO_MAX:              26,
// textAlign: "center"
};

// ─────────────────────────────────────────────────────────────────────────────

const HERO_PROJECTS_GAP = "40vh";

const HEADING_FULL = "Hello,\nI'm Junu";

type Cfg = typeof DEFAULTS;

// Slider config for the dev panel
const SLIDERS: { key: keyof Cfg; label: string; min: number; max: number; step: number; section?: string }[] = [
  { key: "CHROME_REFLECTION", label: "Reflection strength", min: 0, max: 2, step: 0.05, section: "Navigation chrome" },
  { key: "CHROME_SCALE", label: "Pattern size", min: 0.25, max: 4, step: 0.05 },
  { key: "CHROME_SPEED", label: "Movement speed", min: 0, max: 5, step: 0.05 },
  { key: "CHROME_DISTORTION", label: "Surface distortion", min: 0, max: 5, step: 0.05 },
  { key: "CHROME_SHARPNESS", label: "Reflection sharpness", min: 1, max: 64, step: 1 },
  { key: "CHROME_DARKNESS", label: "Background darkness", min: 0, max: 0.95, step: 0.01 },
  { key: "CHROME_PIXEL_SIZE", label: "Pixel size (px)", min: 1, max: 48, step: 1, section: "Chrome pixels" },
  { key: "CHROME_PIXEL_AMOUNT", label: "Pixel amount", min: 0, max: 1, step: 0.05 },
  { key: "CHROME_NOISE_AMOUNT", label: "Noise amount", min: 0, max: 2, step: 0.05, section: "Chrome noise" },
  { key: "CHROME_NOISE_HARMONICS", label: "Noise harmonics", min: 1, max: 6, step: 1 },
  { key: "CHROME_NOISE_PERIOD", label: "Noise period / size", min: 0.5, max: 8, step: 0.1 },
  { key: "CHROME_NOISE_ROUGHNESS", label: "Noise roughness", min: 0, max: 0.9, step: 0.05 },
  { key: "CHROME_NOISE_LACUNARITY", label: "Noise lacunarity", min: 1.2, max: 2.5, step: 0.05 },
  { key: "CHROME_NOISE_SPEED", label: "Noise evolution speed", min: 0, max: 3, step: 0.05 },
  { key: "CHROME_NOISE_SEED", label: "Noise seed", min: 0, max: 100, step: 1 },
  { key: "BLOOM_AMOUNT", label: "Bloom amount", min: 0, max: 3, step: 0.05, section: "Bloom" },
  { key: "BLOOM_THRESHOLD", label: "Bloom threshold", min: 0, max: 0.99, step: 0.01 },
  { key: "BLOOM_SIZE", label: "Bloom size (px)", min: 0, max: 60, step: 1 },
  { key: "PANEL_PX",             label: "Panel Width",       min: 100,    max: 1500,  step: 10     },
  { key: "RIGHT_SCALE",          label: "Animation Scale",           min: -3,     max: 3,     step: 0.01   },
  { key: "RIGHT_SCALE_RATE",     label: "Animation Scale Rate",      min: -0.005, max: 0.005, step: 0.0001 },
  { key: "RIGHT_TRANSLATE_X",    label: "Animation Translate X",     min: -300,   max: 300,   step: 1      },
  { key: "RIGHT_TRANSLATE_RATE", label: "Animation Y Rate",  min: -0.3,   max: 0.3,   step: 0.001  },
  { key: "RIGHT_ROTATION", label: "Rotation (degrees)", min: -180, max: 180, step: 1 },
  { key: "RIGHT_Y",              label: "Animation Y",               min: -100,   max: 100,   step: 1      },
  { key: "PARALLAX_SPEED",       label: "Scroll movement (1 = text)",    min: 0,      max: 2,     step: 0.01   },
  { key: "PARALLAX_OVERFLOW",    label: "Parallax Overflow", min: 0,      max: 500,   step: 10     },
  { key: "IDLE_FPS",             label: "Idle FPS",          min: 0,      max: 60,    step: 1      },
  { key: "SCROLL_SPEED",         label: "Scrub frames / px",      min: 0,      max: 2,     step: 0.01   },
  { key: "LERP",                 label: "Scrub smoothing",       min: 0.01,   max: 1,     step: 0.01   },
  { key: "HERO_PT",               label: "Hero Top Pad (px)", min: 0,      max: 300,   step: 2,     section: "── text ──" },
  { key: "ARROW_X",              label: "Arrow X",           min: -200,   max: 200,   step: 1      },
  { key: "ARROW_BOTTOM",         label: "Arrow Bottom",      min: 0,      max: 200,   step: 2      },
  { key: "TEXT_WIDTH_VW",        label: "Text Width",        min: 5,      max: 100,   step: 1      },
  { key: "TEXT_Y",               label: "Desktop Text Y (vh)", min: -50, max: 50, step: 1 },
  { key: "MOBILE_TEXT_Y",        label: "Mobile Text Y (vh)", min: -50, max: 50, step: 1 },
  { key: "HEADING_MIN",          label: "H Min px",          min: 10,     max: 100,   step: 1      },
  { key: "HEADING_VW",           label: "H vw",              min: 0,      max: 20,    step: 0.1    },
  { key: "HEADING_MAX",          label: "H Max px",          min: 20,     max: 200,   step: 1      },
  { key: "BIO_MIN",              label: "Bio Min px",        min: 8,      max: 48,    step: 1      },
  { key: "BIO_VW",               label: "Bio vw",            min: 0,      max: 10,    step: 0.1    },
  { key: "BIO_MAX",              label: "Bio Max px",        min: 12,     max: 72,    step: 1      },
];

export default function Page() {
  const bloomId = useId();
  const [cfg, setCfg] = useState<Cfg>(DEFAULTS);
  const [windowWidth, setWindowWidth] = useState(1920);
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [useCompatibleBloom, setUseCompatibleBloom] = useState(false);
  const [dspfAnim, setDspfAnim] = useState<object | null>(null);
  const [tweakerOpen, setTweakerOpen] = useState(true);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const exportRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const typingDone = typedCount >= HEADING_FULL.length;

  const dspfRef     = useRef<LottieRefCurrentProps>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const videoRightRef = useRef<HTMLVideoElement>(null);
  const animationSourceRef = useRef<HTMLDivElement>(null);
  const cfgRef  = useRef(cfg);
  const heroRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setHeroVisible(visible);
        if (visible) {
          videoRightRef.current?.play();
          dspfRef.current?.play();
        } else {
          videoRightRef.current?.pause();
          dspfRef.current?.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
    const lowMemory = ("deviceMemory" in navigator) && (navigator as { deviceMemory: number }).deviceMemory < 4;
    setIsLowEnd(reducedMotion || lowCores || lowMemory);
    // WebKit can drop SVG URL filters on accelerated media layers.
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const safari = /Safari/.test(navigator.userAgent)
      && !/Chrome|Chromium|Android|Edg|OPR/.test(navigator.userAgent);
    setUseCompatibleBloom(ios || safari);
  }, []);

  useEffect(() => {
    if (isLowEnd || dspfAnim) return;
    fetch("/lotties/dspf.json").then(r => r.json()).then(setDspfAnim);
  }, [isLowEnd, dspfAnim]);

  // Scrub source frames with scroll distance while idle playback continues slowly.
  useEffect(() => {
    if (isLowEnd || !heroVisible) return;
    const readScrollY = () => Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight));
    let lastY = readScrollY();
    let pendingFrames = 0;
    let lastTime = performance.now();
    let lastIdleSpeed = -1;
    let rafId: number;

    const handleScroll = () => {
      const y = readScrollY();
      const anim = dspfRef.current?.animationItem;
      // Preserve the original forward scrubbing in either scroll direction.
      // Limit queued travel so a fast fling cannot leave a long catch-up tail.
      if (anim && anim.totalFrames > 0) {
        pendingFrames = Math.min(
          pendingFrames + Math.abs(y - lastY) * cfgRef.current.SCROLL_SPEED,
          anim.totalFrames / 2
        );
      }
      lastY = y;
    };

    const tick = (now: number) => {
      const elapsed = Math.max(1, now - lastTime);
      lastTime = now;
      const anim = dspfRef.current?.animationItem;
      if (anim) {
        const { IDLE_FPS, LERP } = cfgRef.current;
        const idleSpeed = IDLE_FPS / (anim.frameRate || 30);
        if (idleSpeed !== lastIdleSpeed) {
          anim.setSpeed(idleSpeed);
          lastIdleSpeed = idleSpeed;
        }
        if (elapsed > 100) pendingFrames = 0;
        const smoothing = 1 - Math.pow(1 - LERP, Math.min(elapsed, 100) / (1000 / 60));
        const nudge = pendingFrames * smoothing;
        if (nudge > 0.01 && anim.totalFrames > 0) {
          pendingFrames -= nudge;
          anim.goToAndPlay((anim.currentFrame + nudge) % anim.totalFrames, true);
        } else {
          pendingFrames = 0;
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
  }, [isLowEnd, heroVisible]);

  // Keep one pending update so rapid scroll events cannot postpone a paint.
  useEffect(() => {
    let frame: number | null = null;
    const update = () => {
      frame = null;
      const scrollY = Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight));
      const offset = -scrollY * cfg.PARALLAX_SPEED;
      if (rightPanelRef.current) {
        rightPanelRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    };
    const handleScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [cfg.PARALLAX_SPEED]);

  // Force-play videos on low-end (bypasses iOS low-power-mode autoplay block)
  useEffect(() => {
    if (!isLowEnd) return;
    const tryPlay = () => {
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
      dspfRef.current?.animationItem?.pause();
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
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

  // Typewriter effect for heading
  useEffect(() => {
    if (typedCount >= HEADING_FULL.length) return;
    const id = setTimeout(() => setTypedCount(c => c + 1), 75);
    return () => clearTimeout(id);
  }, [typedCount]);

  // ── Computed transforms ───────────────────────────────────────────────────
  const rightScale      = cfg.RIGHT_SCALE     - windowWidth * cfg.RIGHT_SCALE_RATE;
  const rightTranslateX = cfg.RIGHT_TRANSLATE_X;
  const rightTranslateY = cfg.RIGHT_Y - windowWidth * cfg.RIGHT_TRANSLATE_RATE;

  const bioText = "a designer and maker in NYC, specializing in fabrication and visual media.";

  // ── Dev tweaker helpers ───────────────────────────────────────────────────
  const set = (key: keyof Cfg, val: number) =>
    setCfg(c => ({ ...c, [key]: val }));

  const settingsExport = JSON.stringify({
    page: "Homepage hero",
    viewport: { width: windowWidth, height: typeof window === "undefined" ? null : window.innerHeight },
    rendering: isLowEnd ? "video" : "lottie",
    bloomRendering: useCompatibleBloom ? "compatible" : "svg",
    settings: cfg,
    textAlign,
  }, null, 2);

  const copyToCode = async () => {
    try {
      await navigator.clipboard.writeText(settingsExport);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      exportRef.current?.focus();
      exportRef.current?.select();
    }
  };

  const isDev = process.env.NODE_ENV === "development";

  const homePageLinks = [
    { href: "/fabrication", label: "Fabrication", colorClass: "text-white" },
    { href: "/vjclips", label: "Visual Works", colorClass: "text-white" },
    { href: "/contact",  label: "Contact",  colorClass: "text-white" },
  ];

  return (
    <div className="relative min-h-screen no-scrollbar">
      <svg aria-hidden="true" width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <filter id={bloomId} x="-100%" y="-100%" width="300%" height="300%" colorInterpolationFilters="sRGB">
            {/* Build a soft brightness mask so only highlights produce bloom. */}
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.2126 0.7152 0.0722 0 0" result="brightness" />
            <feComponentTransfer in="brightness" result="highlights">
              <feFuncA type="linear" slope={1 / (1 - cfg.BLOOM_THRESHOLD)} intercept={-cfg.BLOOM_THRESHOLD / (1 - cfg.BLOOM_THRESHOLD)} />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="highlights" operator="in" result="brightPixels" />
            <feGaussianBlur in="brightPixels" stdDeviation={cfg.BLOOM_SIZE} result="glow" />
            <feComponentTransfer in="glow" result="bloom">
              <feFuncA type="linear" slope={cfg.BLOOM_AMOUNT} />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="bloom" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* Background panels */}
      <div className="fixed inset-0 z-0" style={{ opacity: heroVisible ? 1 : 0, transition: "opacity 0.6s ease" }}>

        {/* Right panel */}
        <div ref={rightPanelRef} className="absolute top-0 left-1/2 h-full" style={{ width: `${cfg.PANEL_PX}px`, marginLeft: -cfg.PANEL_PX / 2, zIndex: 2, willChange: "transform" }}>
          <div data-bloom-renderer={useCompatibleBloom ? "compatible" : "svg"} style={{ width: "100%", height: "100%", filter: !useCompatibleBloom && cfg.BLOOM_AMOUNT > 0 ? `url(#${bloomId})` : undefined, transform: `translateX(${rightTranslateX}%) translateY(${rightTranslateY}%) scale(${rightScale}) rotate(${cfg.RIGHT_ROTATION}deg)` }}>
            <div style={{ position: "absolute", top: -cfg.PARALLAX_OVERFLOW, bottom: -cfg.PARALLAX_OVERFLOW, left: 0, right: 0,
              display: "flex", alignItems: "center", justifyContent: "center", isolation: "isolate" }}>
              <div ref={animationSourceRef} style={{ width: "100%", height: "100%" }}>
                {isLowEnd
                  ? <video ref={videoRightRef} autoPlay muted loop playsInline preload="auto" style={{ width: "100%", height: "100%", objectFit: "contain" }}><source src="/mp4/Comp_1_web2.mp4" type="video/mp4" /></video>
                  : dspfAnim && <Lottie lottieRef={dspfRef} animationData={dspfAnim} loop autoplay
                      rendererSettings={LOTTIE_RENDERER_SETTINGS}
                      style={{ width: "100%", height: "100%" }} />}
              </div>
              {useCompatibleBloom && (
                <CompatibleBloom sourceRef={animationSourceRef} videoRef={videoRightRef}
                  mode={isLowEnd ? "video" : "svg"} active={heroVisible}
                  amount={cfg.BLOOM_AMOUNT} threshold={cfg.BLOOM_THRESHOLD} size={cfg.BLOOM_SIZE} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <AnimatedHeader navLinks={homePageLinks} chromeSettings={cfg} />
        <main className="relative z-10">
          <div className="relative">
          {/* Hero */}
          <section ref={heroRef} className="relative min-h-screen h-screen flex items-center justify-center pb-8 md:pb-0" style={{ paddingTop: cfg.HERO_PT }}>
            <div className="px-8" style={{
              width: `${cfg.TEXT_WIDTH_VW}vw`,
              textAlign,
              transform: `translateY(${windowWidth < 640 ? cfg.MOBILE_TEXT_Y : cfg.TEXT_Y}vh)`,
            }}>
              <h1 className="text-white font-bold leading-tight mb-2 md:mb-6" style={{ fontSize: `clamp(${cfg.HEADING_MIN}px, min(${cfg.HEADING_VW}vw, 12vh), ${cfg.HEADING_MAX}px)` }}>
                {HEADING_FULL.slice(0, typedCount).split("\n").map((line, i, lines) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {i === lines.length - 1 ? (
                      <>
                        {line.slice(0, -1)}
                        <span className="relative whitespace-nowrap">
                          {line.slice(-1)}
                          <span aria-hidden="true" className="animate-blink absolute" style={{ left: "100%", bottom: "0.05em", width: 2, height: "0.85em", background: "white", marginLeft: 2 }} />
                        </span>
                      </>
                    ) : line}
                  </span>
                ))}
              </h1>
              <p className="text-white/80 leading-relaxed transition-opacity duration-700"
                style={{
                  fontSize: `clamp(${cfg.BIO_MIN}px, min(${cfg.BIO_VW}vw, 4vh), ${cfg.BIO_MAX}px)`,
                  opacity: typingDone ? 1 : 0,
                }}>
                {bioText}
              </p>
            </div>

          </section>

          <div style={{ height: HERO_PROJECTS_GAP }} />

          {/* Native sticky positioning keeps the arrow in sync with browser scrolling. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-2 z-20">
            <div className="sticky mx-auto h-12 w-fit" style={{
              top: `calc(100dvh - 48px - ${cfg.ARROW_BOTTOM}px)`,
              transform: `translateX(${cfg.ARROW_X}px)`,
            }}>
              <a href="#projects" className="pointer-events-auto text-white flex flex-col items-center gap-1 opacity-0 animate-fadeInBounce">
                <span className="text-sm tracking-widest uppercase">Projects</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </a>
            </div>
          </div>
          </div>

          {/* Projects */}
          <section className="min-h-screen flex flex-col items-center justify-center relative">
            <div className="flex-1 w-full bg-black" id="projects">
              <ProjectGrid projects={projects} fullHeight />
            </div>
          </section>
        </main>
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

              <label className="mb-4 flex items-center gap-2 text-xs text-white/60">
                <input type="checkbox" checked={useCompatibleBloom}
                  onChange={e => setUseCompatibleBloom(e.target.checked)} />
                Safari glow preview
              </label>

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
                      <input type="number" aria-label={label + " value"} min={min} max={max} step={step} value={cfg[key]}
                        onChange={e => { if (e.target.value !== "" && Number.isFinite(e.target.valueAsNumber)) set(key, Math.max(min, Math.min(max, e.target.valueAsNumber))); }}
                        className="w-20 rounded bg-black text-right text-white" />
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

              <p className="mb-3 text-xs leading-relaxed text-white/60">
                Adjust controls, copy settings, and paste them into chat to make them permanent.
              </p>
              <details className="mb-3" open>
                <summary className="cursor-pointer">Settings to share</summary>
                <textarea ref={exportRef} readOnly value={settingsExport} aria-label="Settings to share in chat" className="mt-2 h-40 w-full select-text rounded bg-black p-2 text-xs" />
              </details>
              {/* Reset + Copy */}
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <button
                  onClick={() => { setCfg(DEFAULTS); setTextAlign("center"); }}
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
                  {copied ? "copied!" : "copy settings"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
