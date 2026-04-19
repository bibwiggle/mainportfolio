"use client";
import { useState } from "react";

interface Props {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
}

export function LightboxVideo({ src, className = "w-full rounded-lg", style, wrapperClassName = "", wrapperStyle }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className={`cursor-pointer ${wrapperClassName}`.trim()}
        style={wrapperStyle}
        onClick={() => setOpen(true)}
      >
        <video src={src} autoPlay muted loop playsInline
          className={className} style={{ display: "block", ...style }} />
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
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
