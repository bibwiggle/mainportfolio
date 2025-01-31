"use client";

import React, { useEffect, useState, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import DCA from "../../public/lotties/3k80b.json";

export function BackgroundAnimation() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [dimensions, setDimensions] = useState({ vh: 1000, vw: 1000 }); // Initial large values
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const targetScrollPercentageRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Dynamic viewport height management
  useEffect(() => {
    const setVhDimensions = () => {
      const vh = window.innerHeight * 0.01;
      const vw = window.innerWidth * 0.01;
      setDimensions({
        vh: window.innerHeight,
        vw: window.innerWidth
      });
      
      // Set CSS custom properties
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.setProperty('--vw', `${vw}px`);
    };

    setVhDimensions();
    window.addEventListener('resize', setVhDimensions);
    window.addEventListener('orientationchange', setVhDimensions);
    return () => {
      window.removeEventListener('resize', setVhDimensions);
      window.removeEventListener('orientationchange', setVhDimensions);
    };
  }, []);

  // Modified scroll handler with viewport locking
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = Math.max(0, window.scrollY);
      const pageHeight = document.documentElement.scrollHeight;
      const windowHeight = dimensions.vh; // Use dynamic height
      
      const scrollRange = pageHeight - windowHeight;
      const scalor = dimensions.vw >= 1024 ? 3 : 8;
      const extendedScrollRange = scrollRange / scalor;
      const percentage = scrollPosition / extendedScrollRange;

      targetScrollPercentageRef.current = Math.min(percentage, 1);
    };

    const smoothScrollAnimation = () => {
      setScrollPercentage(prev => {
        const diff = targetScrollPercentageRef.current - prev;
        return prev + diff * 0.15;
      });
      animationFrameRef.current = requestAnimationFrame(smoothScrollAnimation);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    animationFrameRef.current = requestAnimationFrame(smoothScrollAnimation);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      animationFrameRef.current && cancelAnimationFrame(animationFrameRef.current);
    };
  }, [dimensions]);

  // Lottie animation control
  useEffect(() => {
    if (lottieRef.current?.animationItem) {
      const totalFrames = lottieRef.current.animationItem.totalFrames;
      const frame = Math.floor((scrollPercentage % 1) * totalFrames);
      lottieRef.current.animationItem.goToAndStop(frame, true);
    }
  }, [scrollPercentage]);

  // Container size calculation
  useEffect(() => {
    if (!containerRef.current) return;

    const aspectRatio = 1;
    let width, height;

    if (dimensions.vw / dimensions.vh > aspectRatio) {
      width = dimensions.vw;
      height = dimensions.vw / aspectRatio;
    } else {
      height = dimensions.vh;
      width = dimensions.vh * aspectRatio;
    }

    containerRef.current.style.width = `${width}px`;
    containerRef.current.style.height = `${height * 1.5}px`; // 150vh equivalent
    
    lottieRef.current?.animationItem?.resize();
  }, [dimensions]);

  const parallaxOffset = -scrollPercentage * 4.8;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full overflow-hidden"
      style={{
        transform: `translate(-100%, -82.5%) translateY(${parallaxOffset}%)`,
        left: '100%',
        top: '100%',
        height: `${dimensions.vh * 1.5}px` // Direct CSS height control
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={DCA}
        loop={true}
        autoplay={false}
        renderer= {"canvas" as "svg"}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(1.15)',
        }}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice',
          progressiveLoad: true,
        }}
      />
    </div>
  );
}