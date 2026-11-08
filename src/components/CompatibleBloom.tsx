"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";

interface CompatibleBloomProps {
  sourceRef: RefObject<HTMLDivElement>;
  videoRef: RefObject<HTMLVideoElement>;
  mode: "svg" | "video";
  active: boolean;
  amount: number;
  threshold: number;
  size: number;
}

interface SvgSource {
  viewBox: string;
  width: number;
  height: number;
  preserveAspectRatio: string;
}

const DEFAULT_VIEW_BOX = [0, 0, 800, 2778];

export function CompatibleBloom({ sourceRef, videoRef, mode, active, amount, threshold, size }: CompatibleBloomProps) {
  const sourceId = `compatible-bloom-${useId().replace(/:/g, "")}`;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [svgSource, setSvgSource] = useState<SvgSource | null>(null);
  const [hidden, setHidden] = useState(false);
  const enabled = active && !hidden && amount > 0;

  useEffect(() => {
    const updateVisibility = () => setHidden(document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (mode !== "svg") return;
    const source = sourceRef.current;
    if (!source) return;
    let root: SVGSVGElement | null = null;
    let originalId: string | null = null;
    let observer: MutationObserver | null = null;

    const restoreSourceId = () => {
      if (root?.id === sourceId) {
        if (originalId === null) root.removeAttribute("id");
        else root.id = originalId;
      }
    };

    const findSource = () => {
      const svg = source.querySelector<SVGSVGElement>("svg");
      if (!svg || svg === root) return;
      restoreSourceId();
      root = svg;
      originalId = svg.getAttribute("id");
      svg.id = sourceId;
      const parsed = (svg.getAttribute("viewBox") || "").trim().split(/[\s,]+/).map(Number);
      const box = parsed.length === 4 && parsed.every(Number.isFinite) && parsed[2] > 0 && parsed[3] > 0
        ? parsed : DEFAULT_VIEW_BOX;
      setSvgSource({
        viewBox: box.join(" "),
        width: box[2],
        height: box[3],
        preserveAspectRatio: svg.getAttribute("preserveAspectRatio") || "xMidYMid meet",
      });
    };

    observer = new MutationObserver(findSource);
    observer.observe(source, { childList: true, subtree: true });
    findSource();
    return () => {
      observer?.disconnect();
      restoreSourceId();
    };
  }, [mode, sourceRef, sourceId]);

  useEffect(() => {
    if (mode !== "video" || !enabled) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const source = sourceRef.current;
    if (!video || !canvas || !source) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    let stopped = false;
    let animationFrame: number | null = null;
    let videoFrame: number | null = null;
    let lastPaint = -Infinity;
    let lastVideoTime = -1;

    const paint = (now: number, force = false) => {
      if (stopped || document.hidden || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;
      if (!force && (now - lastPaint < 1000 / 30 || video.currentTime === lastVideoTime)) return;
      // Use layout dimensions: transformed bounds would swap/scale the axes.
      const width = source.clientWidth;
      const height = source.clientHeight;
      if (width <= 0 || height <= 0) return;
      const resolution = Math.min(1, 512 / Math.max(width, height));
      const targetWidth = Math.max(1, Math.round(width * resolution));
      const targetHeight = Math.max(1, Math.round(height * resolution));
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
      const fit = Math.min(targetWidth / video.videoWidth, targetHeight / video.videoHeight);
      const drawWidth = video.videoWidth * fit;
      const drawHeight = video.videoHeight * fit;
      context.clearRect(0, 0, targetWidth, targetHeight);
      try {
        context.drawImage(video, (targetWidth - drawWidth) / 2, (targetHeight - drawHeight) / 2, drawWidth, drawHeight);
        lastPaint = now;
        lastVideoTime = video.currentTime;
      } catch {
        // A media readiness change can invalidate a frame between the checks.
      }
    };

    const onVideoFrame: VideoFrameRequestCallback = now => {
      videoFrame = null;
      if (stopped || document.hidden) return;
      paint(now);
      videoFrame = video.requestVideoFrameCallback(onVideoFrame);
    };
    const onAnimationFrame = (now: number) => {
      animationFrame = null;
      if (stopped || document.hidden) return;
      paint(now);
      animationFrame = requestAnimationFrame(onAnimationFrame);
    };
    const repaint = () => paint(performance.now(), true);
    const observer = new ResizeObserver(repaint);
    observer.observe(source);
    video.addEventListener("loadeddata", repaint);
    video.addEventListener("seeked", repaint);
    repaint();
    if (typeof video.requestVideoFrameCallback === "function") {
      videoFrame = video.requestVideoFrameCallback(onVideoFrame);
    } else {
      animationFrame = requestAnimationFrame(onAnimationFrame);
    }

    return () => {
      stopped = true;
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      if (videoFrame !== null && typeof video.cancelVideoFrameCallback === "function") {
        video.cancelVideoFrameCallback(videoFrame);
      }
      observer.disconnect();
      video.removeEventListener("loadeddata", repaint);
      video.removeEventListener("seeked", repaint);
    };
  }, [mode, enabled, sourceRef, videoRef]);

  const cutoff = Math.min(0.99, Math.max(0, threshold));
  const gain = Math.max(0, amount);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
      mixBlendMode: "screen",
      opacity: Math.min(1, gain),
      filter: `brightness(${1 / (1 + cutoff)}) contrast(${(1 + cutoff) / (1 - cutoff)}) blur(${Math.max(0, size)}px) brightness(${Math.max(1, gain)})`,
    }}>
      {mode === "svg" && svgSource && (
        <svg width="100%" height="100%" viewBox={svgSource.viewBox} preserveAspectRatio={svgSource.preserveAspectRatio} focusable="false" style={{ display: "block", overflow: "visible" }}>
          <use href={`#${sourceId}`} width={svgSource.width} height={svgSource.height} />
        </svg>
      )}
      {mode === "video" && <canvas ref={canvasRef} className="block h-full w-full" />}
    </div>
  );
}
