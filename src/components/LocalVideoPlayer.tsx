"use client";
import React, { useState } from "react";

interface Props {
  src: string;
  poster?: string;
  autoplay?: boolean;
}

const LocalVideoPlayer: React.FC<Props> = ({ src, poster, autoplay }) => {
  const [playing, setPlaying] = useState(false);

  if (autoplay) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />
    );
  }

  if (playing) {
    return (
      <video
        src={src}
        autoPlay
        controls
        playsInline
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative w-full h-full block overflow-hidden group"
    >
      {poster
        ? <img src={poster} alt="" className="w-full h-full object-cover" />
        : <video src={src} preload="metadata" muted playsInline className="w-full h-full object-cover" />
      }
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-200" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
          style={{
            width: 64,
            height: 64,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(6px)",
            border: "1.5px solid rgba(255,255,255,0.4)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <polygon points="8,5 19,11 8,17" fill="white" />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default LocalVideoPlayer;
