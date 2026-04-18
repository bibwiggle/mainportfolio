"use client";
import React, { useState } from "react";

interface VideoPlayerProps {
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative w-full h-full block overflow-hidden group"
      aria-label="Play video"
      style={{ padding: 0, border: "none", background: "none", cursor: "pointer" }}
    >
      {/* Thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt="Video thumbnail"
        className="w-full h-full object-cover"
      />

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-200" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
          style={{ width: 64, height: 64, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", border: "1.5px solid rgba(255,255,255,0.4)" }}
        >
          {/* Triangle */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <polygon points="8,5 19,11 8,17" fill="white" />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default VideoPlayer;
