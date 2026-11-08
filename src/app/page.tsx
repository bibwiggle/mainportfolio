"use client";

import { ProjectGrid } from "@/components/ui/card";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import { DEFAULT_CHROME_SETTINGS } from "@/components/ChromeNavBackground";
import { CompatibleBloom } from "@/components/CompatibleBloom";
import { useState, useEffect, useRef, useId, type ComponentType } from "react";
import type { LottieComponentProps, LottieRefCurrentProps } from "lottie-react";
import dynamic from "next/dynamic";

// lottie-react's component type defaults to SVG, but its runtime supports Canvas.
type HeroLottieProps = Omit<LottieComponentProps, "renderer"> & { renderer: "svg" | "canvas" };
const Lottie = dynamic(() => import("lottie-react"), { ssr: false }) as ComponentType<HeroLottieProps>;

const LOTTIE_RENDERER_SETTINGS = {
  preserveAspectRatio: "xMidYMid meet",
  progressiveLoad: true,
};
const HERO_FRAME_STEP = 3;
const HERO_TIMELINE_FPS = 30;
const HERO_TIMELINE_FRAMES = 191;
const MOBILE_FRAME_COUNT = 64;
const wrapFrame = (frame: number, length: number) => ((frame % length) + length) % length;

const mobileFrameSrc = (frame: number) =>
  `/frames/dspf-mobile/frame_${String(frame + 1).padStart(2, "0")}.webp`;

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    || window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

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
  RIGHT_ROTATION:      90,
  ANIMATION_WIDTH_VW: 250,
  ANIMATION_MAX_PX: 1940,
  ANIMATION_GAP: -64,
  ANIMATION_X: 0,
  MOBILE_ANIMATION_WIDTH_VW: 376,
  MOBILE_ANIMATION_MAX_PX: 1940,
  MOBILE_ANIMATION_GAP: -62,
  PARALLAX_SPEED:       0.78,
  BLOOM_AMOUNT:        1.2,
  BLOOM_THRESHOLD:     0.19,
  BLOOM_SIZE:          12,
  IDLE_FPS:             60,
  SCROLL_SPEED:         0.39,
  MOBILE_SCRUB_LAG_MS:  110,
  // Text
  HERO_PT:              164,
  ARROW_X:              8,
  ARROW_BOTTOM:         2,
  TEXT_WIDTH_VW:        50,
  TEXT_MIN_PX:          576,
  TEXT_Y:               -24,
  MOBILE_TEXT_Y:        -20,
  HEADING_MIN:          33,
  HEADING_VW:           12.1,
  HEADING_MAX:          76,
  BIO_MIN:              29,
  BIO_VW:               2,
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
  { key: "ANIMATION_WIDTH_VW", label: "Desktop width (% screen)", min: 50, max: 800, step: 1, section: "Animation below bio" },
  { key: "ANIMATION_MAX_PX", label: "Maximum width (px)", min: 600, max: 4000, step: 20 },
  { key: "ANIMATION_GAP", label: "Gap below bio (px)", min: -300, max: 300, step: 2 },
  { key: "ANIMATION_X", label: "Horizontal offset (px)", min: -300, max: 300, step: 1 },
  { key: "MOBILE_ANIMATION_WIDTH_VW", label: "Phone width (% screen)", min: 50, max: 800, step: 1, section: "Phone animation (blends into desktop)" },
  { key: "MOBILE_ANIMATION_MAX_PX", label: "Phone maximum width (px)", min: 600, max: 4000, step: 20 },
  { key: "MOBILE_ANIMATION_GAP", label: "Phone gap below bio (px)", min: -300, max: 500, step: 2 },
  { key: "RIGHT_ROTATION", label: "Rotation (degrees)", min: -180, max: 180, step: 1 },
  { key: "PARALLAX_SPEED",       label: "Scroll movement (1 = text)",    min: 0,      max: 2,     step: 0.01   },
  { key: "IDLE_FPS",             label: "Lottie idle FPS",       min: 0,    max: 60,    step: 1      },
  { key: "SCROLL_SPEED",         label: "Scroll scrub frames / px", min: 0,    max: 2,     step: 0.01   },
  { key: "MOBILE_SCRUB_LAG_MS", label: "Phone scrub lag (ms)", min: 0, max: 250, step: 10 },
  { key: "HERO_PT",               label: "Hero Top Pad (px)", min: 0,      max: 300,   step: 2,     section: "── text ──" },
  { key: "ARROW_X",              label: "Arrow X",           min: -200,   max: 200,   step: 1      },
  { key: "ARROW_BOTTOM",         label: "Arrow Bottom",      min: 0,      max: 200,   step: 2      },
  { key: "TEXT_WIDTH_VW",        label: "Text Width",        min: 5,      max: 100,   step: 1      },
  { key: "TEXT_MIN_PX",          label: "Text minimum width (px)", min: 240, max: 900, step: 8 },
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
  const [isMobile, setIsMobile] = useState(false);
  const [mobileFrame, setMobileFrame] = useState(0);
  const [useCompatibleBloom, setUseCompatibleBloom] = useState(false);
  const [useCanvasRenderer, setUseCanvasRenderer] = useState(false);
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
  const mobileFrameRef = useRef(0);
  const mobileTargetRef = useRef(0);
  const mobileDisplayRef = useRef(0);
  const mobileFrameCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const animationSourceRef = useRef<HTMLDivElement>(null);
  const cfgRef  = useRef(cfg);
  const textRef = useRef<HTMLDivElement>(null);
  const [animationTop, setAnimationTop] = useState(500);
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

      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
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
    setUseCanvasRenderer(!mobile && !safari);
  }, []);

  useEffect(() => {
    if (isLowEnd || dspfAnim) return;
    fetch("/lotties/dspf_10fps.json").then(r => r.json()).then(setDspfAnim);
  }, [isLowEnd, dspfAnim]);

  // Desktop combines idle playback and scroll scrubbing; phones draw only on scroll.
  useEffect(() => {
    if (isLowEnd) return;
    const readScrollY = () => Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight));
    let lastY = readScrollY();
    let pendingFrames = 0;
    let playhead = 0;
    let lastDrawnFrame = -1;
    let lastTime = 0;
    let lastScrollAt = -Infinity;
    let initRaf = 0;
    let tickRaf = 0;

    const handleScroll = () => {
      const y = readScrollY();
      const anim = dspfRef.current?.animationItem;
      if (anim && anim.totalFrames > 0) {
        pendingFrames += (y - lastY) * cfg.SCROLL_SPEED;
        if (y !== lastY) lastScrollAt = performance.now();
        if (isMobile && !tickRaf) tickRaf = requestAnimationFrame(tick);
      }
      lastY = y;
    };

    const tick = (now: number) => {
      tickRaf = 0;
      const elapsed = Math.min(100, Math.max(0, now - lastTime));
      lastTime = now;
      const anim = dspfRef.current?.animationItem;
      if (anim && anim.totalFrames > 0) {
        const idleFrames = !isMobile && now - lastScrollAt >= 180 ? cfg.IDLE_FPS * elapsed / 1000 : 0;
        playhead = wrapFrame(playhead + idleFrames + pendingFrames, anim.totalFrames);
        pendingFrames = 0;
        const frame = Math.floor(playhead / HERO_FRAME_STEP) * HERO_FRAME_STEP;
        if (frame !== lastDrawnFrame) {
          anim.goToAndStop(frame, true);
          lastDrawnFrame = frame;
        }
      }
      if (!isMobile) tickRaf = requestAnimationFrame(tick);
    };

    const initialize = () => {
      const anim = dspfRef.current?.animationItem;
      if (!anim) {
        initRaf = requestAnimationFrame(initialize);
        return;
      }
      anim.setSubframe(false);
      anim.pause();
      playhead = anim.currentFrame;
      lastTime = performance.now();
      if (!isMobile) tickRaf = requestAnimationFrame(tick);
    };

    if (heroVisible) window.addEventListener("scroll", handleScroll, { passive: true });
    initRaf = requestAnimationFrame(initialize);
    return () => {
      if (heroVisible) window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(initRaf);
      cancelAnimationFrame(tickRaf);
    };
  }, [isLowEnd, isMobile, heroVisible, useCanvasRenderer, useCompatibleBloom, cfg.IDLE_FPS, cfg.SCROLL_SPEED]);

  // The lightweight phone renderer displays one of 64 stills only when scrolled.
  useEffect(() => {
    if (!isLowEnd || !isMobile || !heroVisible) return;
    const readScrollY = () => Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight));
    let lastY = readScrollY();
    let rafId = 0;
    let requestId = 0;
    let requestedFrame = mobileFrameRef.current;
    let lastTime = 0;
    let active = true;
    const cache = mobileFrameCacheRef.current;
    const getImage = (frame: number) => {
      const index = frame % MOBILE_FRAME_COUNT;
      let image = cache.get(index);
      if (!image) {
        image = new Image();
        image.decoding = "async";
        image.src = mobileFrameSrc(index);
        cache.set(index, image);
        if (cache.size > 12) cache.delete(cache.keys().next().value!);
      }
      return image;
    };
    getImage(0);
    getImage(1);
    getImage(2);

    const requestFrame = (next: number) => {
      if (next === requestedFrame) return;
      requestedFrame = next;
      const currentRequest = ++requestId;
      if (next === mobileFrameRef.current) return;

      const image = getImage(next);
      const show = () => {
        if (!active || currentRequest !== requestId || !image.naturalWidth) return;
        mobileFrameRef.current = next;
        setMobileFrame(next);
        getImage(next + 1);
        getImage(next + 2);
      };
      if (image.complete) show();
      else image.decode().then(show, () => image.addEventListener("load", show, { once: true }));
    };
    const updateFrame = (now: number) => {
      rafId = 0;
      const elapsed = lastTime ? Math.min(64, now - lastTime) : 16;
      lastTime = now;
      const lag = cfg.MOBILE_SCRUB_LAG_MS;
      const alpha = lag === 0 ? 1 : 1 - Math.exp(-elapsed / lag);
      mobileDisplayRef.current += (mobileTargetRef.current - mobileDisplayRef.current) * alpha;
      if (Math.abs(mobileTargetRef.current - mobileDisplayRef.current) < 0.25) {
        mobileDisplayRef.current = mobileTargetRef.current;
      }
      const position = wrapFrame(mobileDisplayRef.current, HERO_TIMELINE_FRAMES);
      requestFrame(Math.min(MOBILE_FRAME_COUNT - 1, Math.floor(position / HERO_FRAME_STEP)));
      if (mobileDisplayRef.current !== mobileTargetRef.current) rafId = requestAnimationFrame(updateFrame);
    };
    const handleScroll = () => {
      const y = readScrollY();
      mobileTargetRef.current += (y - lastY) * cfg.SCROLL_SPEED;
      lastY = y;
      if (!rafId) rafId = requestAnimationFrame(updateFrame);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    if (mobileTargetRef.current !== mobileDisplayRef.current) rafId = requestAnimationFrame(updateFrame);
    return () => {
      active = false;
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isLowEnd, isMobile, heroVisible, cfg.SCROLL_SPEED, cfg.MOBILE_SCRUB_LAG_MS]);

  // Each scroll adds the same timeline travel as Lottie. Coalesce video seeks
  // so touch-scroll events don't queue them up.
  useEffect(() => {
    if (!isLowEnd || isMobile || !heroVisible) return;
    const video = videoRightRef.current;
    if (!video) return;
    const readScrollY = () => Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight));
    let lastY = readScrollY();
    let pendingSeconds = 0;
    let rafId = 0;

    const flush = () => {
      rafId = 0;
      if (video.seeking || !Number.isFinite(video.duration) || video.duration <= 0) return;
      if (Math.abs(pendingSeconds) < 1 / 60) return;
      video.currentTime = wrapFrame(video.currentTime + pendingSeconds, video.duration);
      pendingSeconds = 0;
    };
    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(flush);
    };
    const handleScroll = () => {
      const y = readScrollY();
      pendingSeconds += (y - lastY) * cfg.SCROLL_SPEED / HERO_TIMELINE_FPS;
      lastY = y;
      schedule();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    video.addEventListener("loadedmetadata", schedule);
    video.addEventListener("seeked", schedule);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      video.removeEventListener("loadedmetadata", schedule);
      video.removeEventListener("seeked", schedule);
      cancelAnimationFrame(rafId);
    };
  }, [isLowEnd, isMobile, heroVisible, cfg.SCROLL_SPEED]);

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

  // Keep the video playing so Safari has decoded frames ready for scroll seeks.
  useEffect(() => {
    if (!isLowEnd || isMobile) return;
    const video = videoRightRef.current;
    if (!video) return;
    const tryPlay = () => {
      video.play().catch(() => {});
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
  }, [isLowEnd, isMobile]);

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
  const compactWindow = windowWidth > 640 && windowWidth <= 1366;
  const headingFontSize = compactWindow
    ? `clamp(${cfg.HEADING_MIN * 0.8}px, min(${cfg.HEADING_VW * 0.7}vw, 9vh), ${Math.min(cfg.HEADING_MAX * 0.8, 61)}px)`
    : `clamp(${cfg.HEADING_MIN}px, min(${cfg.HEADING_VW}vw, 12vh), ${cfg.HEADING_MAX}px)`;
  const bioFontSize = compactWindow
    ? `clamp(${cfg.BIO_MIN * 0.9}px, min(${cfg.BIO_VW * 0.8}vw, 3.2vh), ${Math.min(cfg.BIO_MAX * 0.8, 21)}px)`
    : `clamp(${cfg.BIO_MIN}px, min(${cfg.BIO_VW}vw, 4vh), ${cfg.BIO_MAX}px)`;
  const phoneHeadingFontSize = `clamp(${Math.min(cfg.HEADING_MIN * 0.62, 28)}px, min(${cfg.HEADING_VW * 0.8}vw, 5.5vh), ${Math.min(cfg.HEADING_MAX * 0.5, 38)}px)`;
  const phoneBioFontSize = `clamp(${Math.min(cfg.BIO_MIN * 0.8, 14)}px, min(${cfg.BIO_VW * 2.2}vw, 3.2vh), ${Math.min(cfg.BIO_MAX * 0.65, 18)}px)`;

  // Full phone settings below 640px, smoothly blending to desktop at 1024px.
  const phoneMix = Math.max(0, Math.min(1, (1024 - windowWidth) / 384));
  const responsiveWidth = cfg.ANIMATION_WIDTH_VW + (cfg.MOBILE_ANIMATION_WIDTH_VW - cfg.ANIMATION_WIDTH_VW) * phoneMix;
  const responsiveMaximum = cfg.ANIMATION_MAX_PX + (cfg.MOBILE_ANIMATION_MAX_PX - cfg.ANIMATION_MAX_PX) * phoneMix;
  const responsiveGap = cfg.ANIMATION_GAP + (cfg.MOBILE_ANIMATION_GAP - cfg.ANIMATION_GAP) * phoneMix;
  const animationWidth = Math.min(windowWidth * responsiveWidth / 100, responsiveMaximum);
  const animationHeight = animationWidth * 800 / 2778;

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;
    const update = () => setAnimationTop(text.getBoundingClientRect().bottom + window.scrollY + responsiveGap);
    const observer = new ResizeObserver(update);
    observer.observe(text);
    update();
    window.addEventListener("resize", update);
    return () => { observer.disconnect(); window.removeEventListener("resize", update); };
  }, [cfg, windowWidth, responsiveGap]);

  const bioText = "a designer and maker in NYC, specializing in fabrication and visual media.";

  // ── Dev tweaker helpers ───────────────────────────────────────────────────
  const set = (key: keyof Cfg, val: number) =>
    setCfg(c => ({ ...c, [key]: val }));

  const settingsExport = JSON.stringify({
    page: "Homepage hero",
    viewport: { width: windowWidth, height: typeof window === "undefined" ? null : window.innerHeight },
    rendering: isLowEnd ? (isMobile ? "frames" : "video") : "lottie",
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
      <div className="fixed inset-0 z-0" style={{ opacity: heroVisible ? 1 : 0.04, transition: "opacity 0.6s ease" }}>

        {/* Right panel */}
        <div ref={rightPanelRef} className="absolute left-1/2" style={{ top: animationTop, width: animationWidth, height: animationHeight, marginLeft: -animationWidth / 2 + cfg.ANIMATION_X, zIndex: 2, willChange: "transform" }}>
          <div data-bloom-renderer={useCompatibleBloom ? "compatible" : "svg"} style={{ position: "absolute", left: "50%", top: "50%", width: animationHeight, height: animationWidth, filter: !useCompatibleBloom && cfg.BLOOM_AMOUNT > 0 ? `url(#${bloomId})` : undefined, transform: `translate(-50%, -50%) rotate(${cfg.RIGHT_ROTATION}deg) scale(-1)` }}>
            <div style={{ position: "relative", width: "100%", height: "100%", isolation: "isolate" }}>
              <div ref={animationSourceRef} style={{ width: "100%", height: "100%" }}>
                {isLowEnd
                  ? isMobile
                    ? <img src={mobileFrameSrc(mobileFrame)} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    : <video ref={videoRightRef} autoPlay muted loop playsInline preload="auto" style={{ width: "100%", height: "100%", objectFit: "contain" }}><source src="/mp4/Comp_1_mobile_576_60.mp4" type="video/mp4" /></video>
                  : dspfAnim && <Lottie key={useCanvasRenderer && !useCompatibleBloom ? "canvas" : "svg"}
                      lottieRef={dspfRef} animationData={dspfAnim} loop autoplay={!isMobile}
                      renderer={useCanvasRenderer && !useCompatibleBloom ? "canvas" : "svg"}
                      rendererSettings={LOTTIE_RENDERER_SETTINGS}
                      style={{ width: "100%", height: "100%" }} />}
              </div>
              {useCompatibleBloom && (
                <CompatibleBloom sourceRef={animationSourceRef} videoRef={videoRightRef}
                  mode={isLowEnd ? (isMobile ? "image" : "video") : "svg"}
                  imageSrc={isLowEnd && isMobile ? mobileFrameSrc(mobileFrame) : undefined} active={true}
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
            <div ref={textRef} className="px-6 sm:px-8" style={{
              width: `min(100%, max(${cfg.TEXT_MIN_PX}px, ${cfg.TEXT_WIDTH_VW}vw))`,
              textAlign,
              transform: `translateY(${windowWidth < 640 ? cfg.MOBILE_TEXT_Y : cfg.TEXT_Y}vh)`,
            }}>
              <h1 className="text-white font-bold leading-tight mb-2 md:mb-6" style={{ fontSize: windowWidth <= 640 ? phoneHeadingFontSize : headingFontSize }}>
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
              <p className="text-white/80 leading-relaxed text-balance transition-opacity duration-700"
                style={{
                  fontSize: windowWidth <= 640 ? phoneBioFontSize : bioFontSize,
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
                  <span>lightweight {isMobile ? "frames" : "video"}</span>
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
