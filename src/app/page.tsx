"use client";

import { ProjectGrid } from "@/components/ui/card";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import { DEFAULT_CHROME_SETTINGS } from "@/components/ChromeNavBackground";
import { LampCanvas } from "@/components/LampCanvas";
import { HOMEPAGE_LAMP_APPEARANCE } from "@/lib/lamp-settings";
import { useState, useEffect, useRef } from "react";

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
  ...HOMEPAGE_LAMP_APPEARANCE,
  RIGHT_ROTATION:      90,
  ANIMATION_WIDTH_VW: 124,
  ANIMATION_MAX_PX: 1820,
  ANIMATION_GAP: 14,
  ANIMATION_X: -140,
  MODEL_ANCHOR_X: 42.5,
  MODEL_ZOOM: 1.05,
  RENDER_PIXEL_RATIO: 1.25,
  MESH_CYLINDER_008: true,
  MESH_PLANE: true,
  MESH_PLANE_014: true,
  MESH_PLANE_015: true,
  MESH_PLANE_016: true,
  MESH_PLANE_001: true,
  MESH_PLANE_002: true,
  MESH_PLANE_003: true,
  MESH_PLANE_017: true,
  MOBILE_ANIMATION_WIDTH_VW: 391,
  MOBILE_ANIMATION_MAX_PX: 1420,
  MOBILE_ANIMATION_GAP: 0,
  MOBILE_ANIMATION_X: -107,
  MOBILE_MODEL_ZOOM: 1.1,
  MOBILE_RENDER_PIXEL_RATIO: 2.75,
  MOBILE_REFRACTION_QUALITY: 1,
  MOBILE_MESH_CYLINDER_008: true,
  PARALLAX_SPEED:       0.66,
  IDLE_FPS:             19,
  SCROLL_SPEED:         0.35,
  SCRUB_LAG_MS:         190,
  // Text
  HERO_PT:              164,
  ARROW_X:              8,
  ARROW_BOTTOM:         2,
  TEXT_WIDTH_VW:        50,
  TEXT_MIN_PX:          592,
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
type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];
type NumericCfgKey = KeysMatching<Cfg, number>;
type BooleanCfgKey = KeysMatching<Cfg, boolean>;
const blend = (desktop: number, phone: number, phoneMix: number) => desktop + (phone - desktop) * phoneMix;

// Slider config for the dev panel
const SLIDERS: { key: NumericCfgKey; label: string; min: number; max: number; step: number; section?: string }[] = [
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
  { key: "MODEL_EMISSION", label: "Cylinder glow", min: 0, max: 5, step: 0.05, section: "Model light" },
  { key: "MODEL_LIGHT_STRENGTH", label: "Reflected light", min: 0, max: 5, step: 0.05 },
  { key: "MODEL_LIGHT_REACH", label: "Light reach", min: 0.1, max: 10, step: 0.1 },
  { key: "MODEL_LIGHT_DEPTH", label: "Light depth", min: -5, max: 5, step: 0.1 },
  { key: "MODEL_LIGHT_HUE", label: "Light hue", min: 0, max: 360, step: 1 },
  { key: "MODEL_LIGHT_SATURATION", label: "Light saturation", min: 0, max: 1, step: 0.01 },
  { key: "MODEL_REFLECTION_STRENGTH", label: "Chrome reflection", min: 0, max: 3, step: 0.05, section: "Model shader" },
  { key: "MODEL_HIGHLIGHT_SHARPNESS", label: "Highlight sharpness", min: 2, max: 80, step: 1 },
  { key: "MODEL_BAND_STRENGTH", label: "Chrome bands", min: 0, max: 3, step: 0.05 },
  { key: "MODEL_FRESNEL_STRENGTH", label: "Edge reflection", min: 0, max: 3, step: 0.05 },
  { key: "REFRACTION_IOR", label: "Index of refraction", min: 1, max: 2.4, step: 0.01, section: "Refraction experiment" },
  { key: "REFRACTION_AMOUNT", label: "Refraction bend", min: 0, max: 0.3, step: 0.005 },
  { key: "REFRACTION_DISPERSION", label: "Color separation", min: 0, max: 0.25, step: 0.005 },
  { key: "REFRACTION_MIX", label: "Refraction mix", min: 0, max: 1, step: 0.05 },
  { key: "REFRACTION_LAYER_GAP", label: "Layer separation", min: 0, max: 0.01, step: 0.0001 },
  { key: "RENDER_PIXEL_RATIO", label: "Desktop pixel density (max)", min: 1, max: 2, step: 0.25, section: "Desktop rendering" },
  { key: "REFRACTION_QUALITY", label: "Desktop refraction resolution", min: 0.25, max: 1, step: 0.05 },
  { key: "ANIMATION_WIDTH_VW", label: "Desktop width (% screen)", min: 50, max: 800, step: 1, section: "3D model below bio" },
  { key: "ANIMATION_MAX_PX", label: "Maximum width (px)", min: 600, max: 4000, step: 20 },
  { key: "ANIMATION_GAP", label: "Visible gap below bio (px)", min: -300, max: 500, step: 2 },
  { key: "MODEL_ANCHOR_X", label: "Model anchor X (%)", min: 0, max: 100, step: 0.5 },
  { key: "ANIMATION_X", label: "Desktop horizontal nudge (px)", min: -1200, max: 600, step: 1 },
  { key: "MODEL_ZOOM", label: "Desktop model crop / zoom", min: 0.5, max: 3, step: 0.05 },
  { key: "MOBILE_ANIMATION_WIDTH_VW", label: "Phone width (% screen)", min: 50, max: 800, step: 1, section: "Phone model layout" },
  { key: "MOBILE_ANIMATION_MAX_PX", label: "Phone maximum width (px)", min: 600, max: 4000, step: 20 },
  { key: "MOBILE_ANIMATION_GAP", label: "Phone visible gap (px)", min: -300, max: 500, step: 2 },
  { key: "MOBILE_ANIMATION_X", label: "Phone horizontal nudge (px)", min: -1200, max: 600, step: 1 },
  { key: "MOBILE_MODEL_ZOOM", label: "Phone model crop / zoom", min: 0.5, max: 3, step: 0.05 },
  { key: "MOBILE_RENDER_PIXEL_RATIO", label: "Phone pixel density (max)", min: 1, max: 3, step: 0.25 },
  { key: "MOBILE_REFRACTION_QUALITY", label: "Phone refraction resolution", min: 0.25, max: 1, step: 0.05 },
  { key: "RIGHT_ROTATION", label: "Rotation (degrees)", min: -180, max: 180, step: 1 },
  { key: "PARALLAX_SPEED",       label: "Scroll movement (1 = text)",    min: 0,      max: 2,     step: 0.01   },
  { key: "IDLE_FPS",             label: "Idle frames / sec",       min: 0,    max: 60,    step: 1      },
  { key: "SCROLL_SPEED",         label: "Scrub frames / px", min: 0,    max: 2,     step: 0.01   },
  { key: "SCRUB_LAG_MS", label: "Scrub lag (ms)", min: 0, max: 500, step: 10 },
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

const MODEL_MESH_TOGGLES: { key: BooleanCfgKey; label: string }[] = [
  { key: "MESH_CYLINDER_008", label: "Desktop cylinder (emitter)" },
  { key: "MOBILE_MESH_CYLINDER_008", label: "Phone cylinder (center emitter)" },
  { key: "MESH_PLANE", label: "Plane" },
  { key: "MESH_PLANE_014", label: "Plane.014" },
  { key: "MESH_PLANE_015", label: "Plane.015" },
  { key: "MESH_PLANE_016", label: "Plane.016" },
  { key: "MESH_PLANE_001", label: "Plane.001" },
  { key: "MESH_PLANE_002", label: "Plane.002" },
  { key: "MESH_PLANE_003", label: "Plane.003" },
  { key: "MESH_PLANE_017", label: "Plane.017" },
];

export default function Page() {
  const [cfg, setCfg] = useState<Cfg>(DEFAULTS);
  const [windowWidth, setWindowWidth] = useState(1920);
  const [compareLite, setCompareLite] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [tweakerOpen, setTweakerOpen] = useState(true);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const exportRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const typingDone = typedCount >= HEADING_FULL.length;

  const rightPanelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [animationTop, setAnimationTop] = useState(500);
  const [modelTopInset, setModelTopInset] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);

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
  }, []);

  // A native scroll timeline lets the compositor position the sculpture even
  // while the main thread is busy rendering its WebGL animation.
  useEffect(() => {
    const panel = rightPanelRef.current;
    if (!panel) return;
    const root = document.scrollingElement || document.documentElement;
    if (CSS.supports("animation-timeline", "scroll(root block)")) {
      const measure = () => {
        const scrollRange = Math.max(0, root.scrollHeight - root.clientHeight);
        panel.style.setProperty("--hero-scroll-end", `${-scrollRange * cfg.PARALLAX_SPEED}px`);
      };
      measure();
      panel.style.removeProperty("transform");
      panel.dataset.scrollPosition = "native";
      const observer = new ResizeObserver(measure);
      observer.observe(document.body);
      observer.observe(document.documentElement);
      window.addEventListener("resize", measure, { passive: true });
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", measure);
        delete panel.dataset.scrollPosition;
        panel.style.removeProperty("--hero-scroll-end");
      };
    }

    // Older browsers retain the existing coalesced scroll updates.
    let frame: number | null = null;
    const update = () => {
      frame = null;
      const scrollY = Math.max(0, Math.min(window.scrollY, root.scrollHeight - root.clientHeight));
      const offset = -scrollY * cfg.PARALLAX_SPEED;
      panel.style.transform = `translate3d(0, ${offset}px, 0)`;
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
      panel.style.removeProperty("transform");
    };
  }, [cfg.PARALLAX_SPEED]);

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
  const usePhoneRendering = isMobile || windowWidth <= 640;
  const modelZoom = blend(cfg.MODEL_ZOOM, cfg.MOBILE_MODEL_ZOOM, phoneMix);
  const modelOffsetX = blend(cfg.ANIMATION_X, cfg.MOBILE_ANIMATION_X, phoneMix);
  const cylinderVisible = phoneMix >= 0.5 ? cfg.MOBILE_MESH_CYLINDER_008 : cfg.MESH_CYLINDER_008;
  const responsiveWidth = cfg.ANIMATION_WIDTH_VW + (cfg.MOBILE_ANIMATION_WIDTH_VW - cfg.ANIMATION_WIDTH_VW) * phoneMix;
  const responsiveMaximum = cfg.ANIMATION_MAX_PX + (cfg.MOBILE_ANIMATION_MAX_PX - cfg.ANIMATION_MAX_PX) * phoneMix;
  const responsiveGap = cfg.ANIMATION_GAP + (cfg.MOBILE_ANIMATION_GAP - cfg.ANIMATION_GAP) * phoneMix;
  const animationWidth = Math.min(windowWidth * responsiveWidth / 100, responsiveMaximum);
  const animationHeight = animationWidth * 800 / 2778;

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;
    const update = () => setAnimationTop(text.getBoundingClientRect().bottom + window.scrollY + responsiveGap - modelTopInset);
    const observer = new ResizeObserver(update);
    observer.observe(text);
    update();
    window.addEventListener("resize", update);
    return () => { observer.disconnect(); window.removeEventListener("resize", update); };
  }, [cfg, windowWidth, responsiveGap, modelTopInset]);

  const bioText = "a designer and maker in NYC, specializing in fabrication and visual media.";

  // ── Dev tweaker helpers ───────────────────────────────────────────────────
  const set = <K extends keyof Cfg>(key: K, val: Cfg[K]) =>
    setCfg(c => ({ ...c, [key]: val }));

  const settingsExport = JSON.stringify({
    page: "Homepage hero",
    viewport: { width: windowWidth, height: typeof window === "undefined" ? null : window.innerHeight },
    rendering: compareLite ? "glb-lite" : "glb-compact",
    bloomRendering: "shader + css",
    refractionRendering: cfg.REFRACTION_ENABLED ? (cfg.REFRACTION_INTERMESH ? "depth peel + rgb dispersion" : "fbo + rgb dispersion") : "off",
    settings: cfg,
    effectiveAtViewport: {
      ANIMATION_WIDTH_VW: responsiveWidth,
      ANIMATION_MAX_PX: responsiveMaximum,
      ANIMATION_GAP: responsiveGap,
      ANIMATION_X: modelOffsetX,
      MODEL_ZOOM: modelZoom,
      RENDER_PIXEL_RATIO: usePhoneRendering ? cfg.MOBILE_RENDER_PIXEL_RATIO : cfg.RENDER_PIXEL_RATIO,
      REFRACTION_QUALITY: usePhoneRendering ? cfg.MOBILE_REFRACTION_QUALITY : cfg.REFRACTION_QUALITY,
      MODEL_LIGHT_STRENGTH: cfg.MODEL_LIGHT_STRENGTH,
      MODEL_REFLECTION_STRENGTH: cfg.MODEL_REFLECTION_STRENGTH,
      MODEL_HIGHLIGHT_SHARPNESS: cfg.MODEL_HIGHLIGHT_SHARPNESS,
      MODEL_BAND_STRENGTH: cfg.MODEL_BAND_STRENGTH,
      MODEL_FRESNEL_STRENGTH: cfg.MODEL_FRESNEL_STRENGTH,
      MESH_CYLINDER_008: cylinderVisible,
      BLOOM_AMOUNT: cfg.BLOOM_AMOUNT,
      BLOOM_SIZE: cfg.BLOOM_SIZE,
      IDLE_FPS: cfg.IDLE_FPS,
      SCROLL_SPEED: cfg.SCROLL_SPEED,
      SCRUB_LAG_MS: cfg.SCRUB_LAG_MS,
    },
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
      {/* Background panels */}
      <div className="fixed inset-0 z-0" style={{ opacity: heroVisible ? 1 : 0.04, transition: "opacity 0.6s ease" }}>

        {/* Right panel */}
        <div ref={rightPanelRef} className="hero-sculpture-position absolute left-1/2" style={{ top: animationTop, width: animationWidth, height: animationHeight, marginLeft: -animationWidth / 2, zIndex: 2, willChange: "transform" }}>
          <div className="h-full w-full" style={{ filter: cfg.BLOOM_AMOUNT > 0 && cfg.BLOOM_SIZE > 0 ? `drop-shadow(0 0 ${cfg.BLOOM_SIZE}px rgba(195,185,255,${Math.min(0.8, cfg.BLOOM_AMOUNT * 0.45)}))` : undefined }}>
            <LampCanvas
              hero
              variant={compareLite ? "lite" : "compact"}
              visible={heroVisible}
              mobile={usePhoneRendering}
              desktopPixelRatio={cfg.RENDER_PIXEL_RATIO}
              mobilePixelRatio={cfg.MOBILE_RENDER_PIXEL_RATIO}
              rotation={cfg.RIGHT_ROTATION}
              zoom={modelZoom}
              anchorX={cfg.MODEL_ANCHOR_X}
              offsetX={modelOffsetX}
              scrollSpeed={cfg.SCROLL_SPEED}
              idleFps={cfg.IDLE_FPS}
              scrubLagMs={cfg.SCRUB_LAG_MS}
              bloomAmount={cfg.BLOOM_AMOUNT}
              bloomThreshold={cfg.BLOOM_THRESHOLD}
              refraction={{
                enabled: cfg.REFRACTION_ENABLED,
                intermesh: cfg.REFRACTION_INTERMESH,
                ior: cfg.REFRACTION_IOR,
                amount: cfg.REFRACTION_AMOUNT,
                dispersion: cfg.REFRACTION_DISPERSION,
                mix: cfg.REFRACTION_MIX,
                quality: usePhoneRendering ? cfg.MOBILE_REFRACTION_QUALITY : cfg.REFRACTION_QUALITY,
                layerGap: cfg.REFRACTION_LAYER_GAP,
              }}
              modelShader={{
                emission: cfg.MODEL_EMISSION,
                lightStrength: cfg.MODEL_LIGHT_STRENGTH,
                lightReach: cfg.MODEL_LIGHT_REACH,
                lightDepth: cfg.MODEL_LIGHT_DEPTH,
                lightHue: cfg.MODEL_LIGHT_HUE,
                lightSaturation: cfg.MODEL_LIGHT_SATURATION,
                reflectionStrength: cfg.MODEL_REFLECTION_STRENGTH,
                highlightSharpness: cfg.MODEL_HIGHLIGHT_SHARPNESS,
                bandStrength: cfg.MODEL_BAND_STRENGTH,
                fresnelStrength: cfg.MODEL_FRESNEL_STRENGTH,
              }}
              meshVisibility={{
                Cylinder008: cylinderVisible,
                Plane: cfg.MESH_PLANE,
                Plane014: cfg.MESH_PLANE_014,
                Plane015: cfg.MESH_PLANE_015,
                Plane016: cfg.MESH_PLANE_016,
                Plane001: cfg.MESH_PLANE_001,
                Plane002: cfg.MESH_PLANE_002,
                Plane003: cfg.MESH_PLANE_003,
                Plane017: cfg.MESH_PLANE_017,
              }}
              onVisualTopInset={setModelTopInset}
            />
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
              {/* Window width readout + model comparison */}
              <div style={{ marginBottom: 8, color: "#666", fontSize: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>window: <span style={{ color: "#4ade80" }}>{windowWidth}px</span></span>
                <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={compareLite}
                    onChange={e => setCompareLite(e.target.checked)}
                    style={{ accentColor: "#4ade80", cursor: "pointer" }}
                  />
                  <span>compare 1.49 MB model</span>
                </label>
              </div>

              <label className="mb-2 flex items-center gap-2 text-xs text-white/70">
                <input type="checkbox" checked={cfg.REFRACTION_ENABLED}
                  onChange={e => set("REFRACTION_ENABLED", e.target.checked)} />
                Refraction + color separation
              </label>
              <label className="mb-2 flex items-center gap-2 text-xs text-white/70">
                <input type="checkbox" checked={cfg.REFRACTION_INTERMESH}
                  onChange={e => set("REFRACTION_INTERMESH", e.target.checked)} />
                Refract other model surfaces
              </label>

              <div style={{ padding: "0 10px 8px" }}>
                <div style={{ color: "#555", fontSize: 9, textTransform: "uppercase", letterSpacing: 1, margin: "10px 0 6px", borderTop: "1px solid #333", paddingTop: 8 }}>Model meshes</div>
                {MODEL_MESH_TOGGLES.map(({ key, label }) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", gap: 7, color: "#aaa", fontSize: 11, margin: "5px 0", cursor: "pointer" }}>
                    <input type="checkbox" checked={Boolean(cfg[key])} onChange={() => set(key, !Boolean(cfg[key]))} style={{ accentColor: "#4ade80" }} />
                    {label}
                  </label>
                ))}
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
                      <input type="number" aria-label={label + " value"} min={min} max={max} step={step} value={cfg[key]}
                        onChange={e => { if (e.target.value !== "" && Number.isFinite(e.target.valueAsNumber)) set(key, Math.max(min, Math.min(max, e.target.valueAsNumber))); }}
                        className="w-20 rounded bg-black text-right text-white" />
                    </div>
                    {key === "MODEL_ANCHOR_X" && <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>Chooses which part of the model sits at the crop center.</div>}
                    {key === "MODEL_EMISSION" && <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>Brightens the cylinder and the light it casts on the shapes.</div>}
                    {key === "MODEL_BAND_STRENGTH" && <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>Lower this to see more of the cylinder reflections.</div>}
                    {key === "REFRACTION_QUALITY" && <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>Higher quality sharpens the effect but uses more graphics power.</div>}
                    {key === "RENDER_PIXEL_RATIO" && <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>Lower values reduce rendering work. Desktop canvases are capped at 1.5 million pixels.</div>}
                    {key === "MOBILE_RENDER_PIXEL_RATIO" && <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>Limited by the device pixel density and a 2 million pixel canvas budget.</div>}
                    {key === "MOBILE_REFRACTION_QUALITY" && <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>1 renders the phone reflection passes at full canvas resolution.</div>}
                    {key === "REFRACTION_LAYER_GAP" && <div style={{ color: "#666", fontSize: 10, marginBottom: 4 }}>Skips the front surface to sample a layer behind it. Higher values skip nearby layers.</div>}
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
                <p className="mt-1 text-[10px] leading-relaxed text-white/50">Phone layout controls blend in below 1024 px. Lighting, shader, bloom, and motion controls apply at every size.</p>
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
