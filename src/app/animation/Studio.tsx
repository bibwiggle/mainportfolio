"use client";

import { useEffect, useRef, useState } from "react";
import { LampCanvas } from "@/components/LampCanvas";
import { DEFAULT_LAMP_APPEARANCE } from "@/lib/lamp-settings";

const DEFAULTS = {
  ...DEFAULT_LAMP_APPEARANCE,
  REFRACTION_AMOUNT: 0.1,
  REFRACTION_DISPERSION: 0.005,
  REFRACTION_MIX: 0.7,
  REFRACTION_LAYER_GAP: 0.0066,
  RENDER_RESOLUTION: 100,
  SIZE: 71,
  POSITION_X: 0,
  POSITION_Y: 0,
  ROTATION_X: 0,
  ROTATION_Y: -24,
  ROTATION_Z: 0,
  IDLE_FPS: 15,
  POINTER_STRENGTH: 1.1,
  POINTER_DRAG: 2.5,
};
type Settings = typeof DEFAULTS;
type NumberKey = { [K in keyof Settings]: Settings[K] extends number ? K : never }[keyof Settings];
type Control = { key: NumberKey; label: string; min: number; max: number; step: number };

const GROUPS: { label: string; controls: Control[] }[] = [
  { label: "Composition", controls: [
    { key: "SIZE", label: "Size (%)", min: 10, max: 600, step: 1 },
    { key: "POSITION_X", label: "Horizontal position (%)", min: -100, max: 100, step: 1 },
    { key: "POSITION_Y", label: "Vertical position (%)", min: -100, max: 100, step: 1 },
    { key: "ROTATION_X", label: "Rotation X (degrees)", min: -180, max: 180, step: 1 },
    { key: "ROTATION_Y", label: "Rotation Y (degrees)", min: -180, max: 180, step: 1 },
    { key: "ROTATION_Z", label: "Rotation Z (degrees)", min: -180, max: 180, step: 1 },
  ] },
  { label: "Quality", controls: [
    { key: "RENDER_RESOLUTION", label: "Canvas resolution (%)", min: 50, max: 200, step: 5 },
    { key: "REFRACTION_QUALITY", label: "Refraction resolution", min: 0.25, max: 1, step: 0.05 },
  ] },
  { label: "Motion", controls: [
    { key: "IDLE_FPS", label: "Idle speed", min: 0, max: 60, step: 1 },
    { key: "POINTER_STRENGTH", label: "Mouse push", min: 0, max: 3, step: 0.05 },
    { key: "POINTER_DRAG", label: "Spin drag", min: 0.5, max: 8, step: 0.1 },
  ] },
  { label: "Light", controls: [
    { key: "MODEL_EMISSION", label: "Cylinder glow", min: 0, max: 5, step: 0.05 },
    { key: "MODEL_LIGHT_STRENGTH", label: "Reflected light", min: 0, max: 5, step: 0.05 },
    { key: "MODEL_LIGHT_REACH", label: "Light reach", min: 0.1, max: 10, step: 0.1 },
    { key: "MODEL_LIGHT_DEPTH", label: "Light depth", min: -5, max: 5, step: 0.1 },
    { key: "MODEL_LIGHT_HUE", label: "Light hue", min: 0, max: 360, step: 1 },
    { key: "MODEL_LIGHT_SATURATION", label: "Light saturation", min: 0, max: 1, step: 0.01 },
  ] },
  { label: "Chrome", controls: [
    { key: "MODEL_REFLECTION_STRENGTH", label: "Reflection", min: 0, max: 3, step: 0.05 },
    { key: "MODEL_HIGHLIGHT_SHARPNESS", label: "Highlight sharpness", min: 2, max: 80, step: 1 },
    { key: "MODEL_BAND_STRENGTH", label: "Chrome bands", min: 0, max: 3, step: 0.05 },
    { key: "MODEL_FRESNEL_STRENGTH", label: "Edge reflection", min: 0, max: 3, step: 0.05 },
  ] },
  { label: "Refraction", controls: [
    { key: "REFRACTION_IOR", label: "Index of refraction", min: 1, max: 2.4, step: 0.01 },
    { key: "REFRACTION_AMOUNT", label: "Refraction bend", min: 0, max: 0.3, step: 0.005 },
    { key: "REFRACTION_DISPERSION", label: "Color separation", min: 0, max: 0.25, step: 0.005 },
    { key: "REFRACTION_MIX", label: "Refraction mix", min: 0, max: 1, step: 0.05 },
    { key: "REFRACTION_LAYER_GAP", label: "Layer separation", min: 0, max: 0.01, step: 0.0001 },
  ] },
  { label: "Bloom", controls: [
    { key: "BLOOM_AMOUNT", label: "Bloom amount", min: 0, max: 3, step: 0.05 },
    { key: "BLOOM_THRESHOLD", label: "Bloom threshold", min: 0, max: 0.99, step: 0.01 },
    { key: "BLOOM_SIZE", label: "Bloom size", min: 0, max: 60, step: 1 },
  ] },
];

export default function AnimationStudio() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [width, setWidth] = useState(1707);
  const [height, setHeight] = useState(898);
  const [mobile, setMobile] = useState(false);
  const [clean, setClean] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [renderSize, setRenderSize] = useState({ width: 0, height: 0 });
  const exportRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const resize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      setMobile(/Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent)
        || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
        || window.matchMedia("(hover: none) and (pointer: coarse)").matches);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setClean(false);
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, button, select")) return;
      if (event.key.toLowerCase() === "h") setClean(value => !value);
    };
    window.addEventListener("keydown", keydown);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", keydown);
    };
  }, []);

  const setNumber = (key: NumberKey, value: number) => setSettings(current => ({ ...current, [key]: value }));
  const settingsExport = JSON.stringify({ page: "Animation studio", interaction: "pointer momentum", settings }, null, 2);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(settingsExport);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setExportOpen(true);
      requestAnimationFrame(() => { exportRef.current?.focus(); exportRef.current?.select(); });
    }
  };

  return (
    <main aria-label="Interactive lamp animation" className={`fixed inset-0 overflow-hidden bg-black text-white ${clean ? "cursor-none" : ""}`}>
      <style jsx global>{`nextjs-portal { display: none; }`}</style>
      <div className="absolute inset-0">
        <div className="h-full w-full" style={{ filter: settings.BLOOM_AMOUNT > 0 && settings.BLOOM_SIZE > 0
          ? `drop-shadow(0 0 ${settings.BLOOM_SIZE}px rgba(195,185,255,${Math.min(0.8, settings.BLOOM_AMOUNT * 0.45)}))` : undefined }}>
          <LampCanvas
            hero
            variant="compact"
            interaction="pointer"
            mobile={mobile || width <= 640}
            desktopPixelRatio={1.25}
            mobilePixelRatio={2.75}
            renderScale={settings.RENDER_RESOLUTION / 100}
            onRenderSize={(renderWidth, renderHeight) => setRenderSize(current => current.width === renderWidth && current.height === renderHeight ? current : { width: renderWidth, height: renderHeight })}
            fixedFraming
            rotation={settings.ROTATION_Z}
            rotationX={settings.ROTATION_X}
            rotationY={settings.ROTATION_Y}
            zoom={settings.SIZE / 100}
            anchorX={50}
            offsetX={width * settings.POSITION_X / 100}
            offsetY={height * settings.POSITION_Y / 100}
            idleFps={settings.IDLE_FPS}
            scrubLagMs={90}
            pointerStrength={settings.POINTER_STRENGTH}
            pointerDrag={settings.POINTER_DRAG}
            bloomAmount={settings.BLOOM_AMOUNT}
            bloomThreshold={settings.BLOOM_THRESHOLD}
            refraction={{
              enabled: settings.REFRACTION_ENABLED, intermesh: settings.REFRACTION_INTERMESH,
              ior: settings.REFRACTION_IOR, amount: settings.REFRACTION_AMOUNT,
              dispersion: settings.REFRACTION_DISPERSION, mix: settings.REFRACTION_MIX,
              quality: settings.REFRACTION_QUALITY, layerGap: settings.REFRACTION_LAYER_GAP,
            }}
            modelShader={{
              emission: settings.MODEL_EMISSION, lightStrength: settings.MODEL_LIGHT_STRENGTH,
              lightReach: settings.MODEL_LIGHT_REACH, lightDepth: settings.MODEL_LIGHT_DEPTH,
              lightHue: settings.MODEL_LIGHT_HUE, lightSaturation: settings.MODEL_LIGHT_SATURATION,
              reflectionStrength: settings.MODEL_REFLECTION_STRENGTH,
              highlightSharpness: settings.MODEL_HIGHLIGHT_SHARPNESS,
              bandStrength: settings.MODEL_BAND_STRENGTH, fresnelStrength: settings.MODEL_FRESNEL_STRENGTH,
            }}
          />
        </div>
      </div>

      {clean ? (
        <button type="button" aria-label="Show controls" title="Show controls (H / Esc)" onClick={() => setClean(false)}
          className="absolute right-0 top-0 h-16 w-16 cursor-default opacity-0 focus-visible:opacity-100">Controls</button>
      ) : (
        <aside aria-label="Animation controls" className="absolute bottom-4 right-4 top-4 w-[300px] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-white/15 bg-black/85 p-5 shadow-2xl backdrop-blur-md">
          <h1 className="text-lg font-medium">Animation studio</h1>
          <p className="mt-2 text-xs leading-relaxed text-white/60">Brush across the sculpture to spin it. Faster strokes add momentum; reverse your stroke to reverse the spin. Touch swipes work too.</p>
          <button type="button" onClick={() => { setClean(true); if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); }}
            className="mt-4 w-full rounded-md bg-white px-3 py-2 text-sm font-medium text-black">Clean view · H</button>
          <p className="mt-2 text-[11px] leading-relaxed text-white/45">H or Esc restores controls. On touch, tap the top-right corner.</p>
          {GROUPS.map(group => (
            <fieldset key={group.label} className="mt-5 border-t border-white/15 pt-3">
              <legend className="px-1 text-xs uppercase tracking-widest text-white/50">{group.label}</legend>
              {group.label === "Composition" && <>
                <p className="mb-3 text-[11px] leading-relaxed text-white/45">Size stays constant as you rotate. Positive positions move right and down. Z turns it upright; X and Y tilt it in 3D.</p>
                <button type="button" onClick={() => setSettings(current => ({ ...current, SIZE: DEFAULTS.SIZE, POSITION_X: DEFAULTS.POSITION_X, POSITION_Y: DEFAULTS.POSITION_Y, ROTATION_X: DEFAULTS.ROTATION_X, ROTATION_Y: DEFAULTS.ROTATION_Y, ROTATION_Z: DEFAULTS.ROTATION_Z }))}
                  className="mb-3 rounded border border-white/20 px-2 py-1 text-[11px] text-white/60">Reset composition</button>
              </>}
              {group.label === "Quality" && <div className="mb-3 text-[11px] leading-relaxed text-white/45">
                <p>100% uses the current device preset. Higher canvas resolution adds detail and uses more graphics power. Refraction at 1 uses full canvas resolution.</p>
                <p className="mt-1 tabular-nums" aria-live="polite">Rendering {renderSize.width} × {renderSize.height} px</p>
              </div>}
              {group.label === "Motion" && <p className="mb-3 text-[11px] leading-relaxed text-white/45">Set idle speed to 0 for mouse-only motion. More spin drag stops the spin sooner.</p>}
              {group.label === "Refraction" && <div className="mb-3 space-y-2 text-xs text-white/70">
                <label className="flex items-center gap-2"><input type="checkbox" checked={settings.REFRACTION_ENABLED} onChange={event => setSettings(current => ({ ...current, REFRACTION_ENABLED: event.target.checked }))} />Refraction</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={settings.REFRACTION_INTERMESH} onChange={event => setSettings(current => ({ ...current, REFRACTION_INTERMESH: event.target.checked }))} />Refract other surfaces</label>
              </div>}
              {group.controls.map(control => (
                <div key={control.key} className="mb-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <label htmlFor={control.key} className="text-xs text-white/70">{control.label}</label>
                    <input type="number" aria-label={`${control.label} value`} min={control.min} max={control.max} step={control.step} value={settings[control.key]}
                      onChange={event => { if (event.target.value !== "" && Number.isFinite(event.target.valueAsNumber)) setNumber(control.key, Math.max(control.min, Math.min(control.max, event.target.valueAsNumber))); }}
                      className="w-16 rounded bg-white/5 px-1 text-right text-xs text-white" />
                  </div>
                  <input id={control.key} type="range" min={control.min} max={control.max} step={control.step} value={settings[control.key]}
                    onChange={event => setNumber(control.key, event.target.valueAsNumber)} className="w-full accent-violet-300" />
                </div>
              ))}
            </fieldset>
          ))}
          <div className="mt-4 flex gap-2 text-xs">
            <button type="button" onClick={() => setSettings(DEFAULTS)} className="rounded border border-white/20 px-3 py-2">Reset controls</button>
            <button type="button" onClick={copy} className="rounded border border-white/20 px-3 py-2">{copied ? "Copied" : "Copy settings"}</button>
          </div>
          <details open={exportOpen} onToggle={event => setExportOpen(event.currentTarget.open)} className="mt-3 text-xs text-white/50">
            <summary className="cursor-pointer">Settings to share</summary>
            <textarea ref={exportRef} readOnly aria-label="Animation settings to share" value={settingsExport} className="mt-2 h-40 w-full rounded bg-black p-2 font-mono text-[10px] text-white/70" />
          </details>
        </aside>
      )}
    </main>
  );
}
