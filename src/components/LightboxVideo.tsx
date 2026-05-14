"use client";
import { useState } from "react";

interface Props {
  src: string;
  autoPlay?: boolean;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
}

export function LightboxVideo({ src, autoPlay = true, poster, className = "w-full rounded-lg", style, wrapperClassName = "", wrapperStyle }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className={`cursor-pointer relative w-full h-full ${wrapperClassName}`.trim()}
        style={wrapperStyle}
        onClick={() => setOpen(true)}
      >
        {autoPlay ? (
          <video src={src} autoPlay muted loop playsInline
            className={className} style={{ display: "block", ...style }} />
        ) : (
          <div className="relative w-full h-full bg-neutral-900 flex items-center justify-center group overflow-hidden">
            {poster && <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover" />}
            <div
              className="flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
              style={{ width: 56, height: 56, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(6px)", border: "1.5px solid rgba(255,255,255,0.3)" }}
            >
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <polygon points="8,5 19,11 8,17" fill="white" />
              </svg>
            </div>
          </div>
        )}
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-16 right-6 text-white/60 hover:text-white text-3xl leading-none cursor-pointer"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          <video
            src={src}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
