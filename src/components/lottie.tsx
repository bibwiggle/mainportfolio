"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import DCA from "../../public/lotties/3k80b.json";

export function BackgroundAnimation() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const targetScrollProgressRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;


    const desktopScalor = 3;
    const mobileScalor = 1.5;
    const scalor = window.innerWidth >= 1024 ? desktopScalor : mobileScalor;
    
    const loopFactor = 3;

    // Calculate progress based on scroll position, incorporating scalor
    const progress = (scrollPosition / (windowHeight * scalor)) * loopFactor;
    targetScrollProgressRef.current = progress;
  }, []);

  const smoothScrollAnimation = useCallback(() => {
    setScrollProgress((prevProgress) => {
      const diff = targetScrollProgressRef.current - prevProgress;
      return prevProgress + diff * 0.18; // Adjust the 0.18 value to change smoothing speed
    });

    animationFrameRef.current = requestAnimationFrame(smoothScrollAnimation);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    animationFrameRef.current = requestAnimationFrame(smoothScrollAnimation);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll, smoothScrollAnimation]);

  useEffect(() => {
    if (lottieRef.current && lottieRef.current.animationItem) {
      const totalFrames = lottieRef.current.animationItem.totalFrames;
      const frame = Math.floor((scrollProgress % 1) * totalFrames);
      lottieRef.current.animationItem.goToAndStop(frame, true);
    }
  }, [scrollProgress]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const aspectRatio = 1920/1080;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const desktopScale = 1;
        const mobileScale = 1.5;
        const scale = window.innerWidth >= 1100 ? desktopScale : mobileScale;

        let width = windowWidth * scale;
        let height = windowHeight * scale;

        if (windowWidth / windowHeight > aspectRatio) {
          height = width / aspectRatio;
        } else {
          width = height * aspectRatio;
        }

        containerRef.current.style.width = `${width}px`;
        containerRef.current.style.height = `${height}px`;
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const parallaxOffset = -scrollProgress * 4.8;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        transform: `translate(-50%, -50%) translateY(${parallaxOffset}%)`,
        left: '50%',
        top: '50%',
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={DCA}
        loop={true}
        autoplay={false}
        renderer={"canvas" as "svg"}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(1.15)",
        }}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid slice",
          progressiveLoad: true,
        }}
      />
    </div>
  );
}