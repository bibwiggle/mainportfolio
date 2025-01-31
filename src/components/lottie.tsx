"use client";

import React, { useEffect, useState, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

// Import the Lottie animation file
import DCA from "../../public/lotties/3k80b.json";

export function BackgroundAnimation() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [size, setSize] = useState({ width: "100%", height: "100%" });
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const targetScrollPercentageRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = Math.max(0, window.scrollY);
      const pageHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollRange = pageHeight - windowHeight;

      const desktopScalor = 3;
      const mobileScalor = 8;
      const scalor = window.innerWidth >= 1024 ? desktopScalor : mobileScalor;

      const extendedScrollRange = scrollRange / scalor;
      const percentage = scrollPosition / extendedScrollRange;

      targetScrollPercentageRef.current = percentage;
    };

    const smoothScrollAnimation = () => {
      setScrollPercentage((prevPercentage) => {
        const diff = targetScrollPercentageRef.current - prevPercentage;
        return prevPercentage + diff * 0.15; // Adjust the 0.1 value to change smoothing speed
      });

      animationFrameRef.current = requestAnimationFrame(smoothScrollAnimation);
    };

    window.addEventListener("scroll", handleScroll);
    animationFrameRef.current = requestAnimationFrame(smoothScrollAnimation);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (lottieRef.current && lottieRef.current.animationItem) {
      const totalFrames = lottieRef.current.animationItem.totalFrames;
      const frame = Math.floor((scrollPercentage % 1) * totalFrames);
      lottieRef.current.animationItem.goToAndStop(frame, true);
    }
  }, [scrollPercentage]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const aspectRatio = 1 / 1; // Adjust this to match your animation's aspect ratio
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const windowRatio = windowWidth / windowHeight;

        let width, height;

        if (windowRatio > aspectRatio) {
          // Window is wider than the desired aspect ratio
          width = windowWidth;
          height = windowWidth / aspectRatio;
        } else {
          // Window is taller than the desired aspect ratio
          height = windowHeight;
          width = windowHeight * aspectRatio;
        }

        setSize({ width: `${width}px`, height: `${height}px` });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Force Lottie to redraw when size changes
  useEffect(() => {
    if (lottieRef.current && lottieRef.current.animationItem) {
      lottieRef.current.animationItem.resize();
    }
  }, [size]);

  const parallaxOffset = -scrollPercentage * 4.8;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-[150vh] overflow-hidden"
      style={{
        transform: `translate(-100%, -82.5%) translateY(${parallaxOffset}%)`,
        left: '100%',
        top: '100%',
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