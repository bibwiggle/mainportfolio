"use client";

import React, { useEffect, useState, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import DCA from "../../public/lotties/3k80b.json";

export function BackgroundAnimation() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
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
        return prevPercentage + diff * 0.15;
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
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const aspectRatio = 1; // Assuming the Lottie animation is square
        let width, height;

        if (windowWidth / windowHeight > aspectRatio) {
          width = windowWidth * 1;
          height = width / aspectRatio;
        } else {
          height = windowHeight * 1;
          width = height * aspectRatio;
        }

        setContainerSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const parallaxOffset = -scrollPercentage * 4.8;

  return (
    <div
      ref={containerRef}
      className="fixed overflow-hidden"
      style={{
        width: `${containerSize.width}px`,
        height: `${containerSize.height}px`,
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
        renderer="svg"
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