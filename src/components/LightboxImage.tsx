"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  imageClassName?: string;
}

export function LightboxImage({ src, alt = "", className = "", style, imageClassName = "object-cover" }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className={`relative overflow-hidden cursor-zoom-in ${className}`}
        style={style}
        onClick={() => setOpen(true)}
      >
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className={imageClassName} />
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl leading-none cursor-pointer"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
    </>
  );
}
