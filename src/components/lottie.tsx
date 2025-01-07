"use client"

import React, { useEffect, useState, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

// Import the Lottie animation file
import DCA from '../../src/lotties/4k90.json';

// Easing function (ease-out cubic) //Higher the number, quicker to slow down
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 1);
}

export function Home() {
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [size, setSize] = useState({ width: '100%', height: '100%' });
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const scrollRange = pageHeight - windowHeight;
            
            // Allow scrolling beyond 100% (e.g., 3 times the page height)
            const extendedScrollRange = scrollRange /10;
            const percentage = (scrollPosition / extendedScrollRange) % 1;
            
            setScrollPercentage(percentage);
            console.log(percentage)
        };

       

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (lottieRef.current && lottieRef.current.animationItem) {
            const easedPercentage = easeOutCubic(scrollPercentage);
            const totalFrames = lottieRef.current.animationItem.totalFrames;
            const frame = Math.floor(easedPercentage * totalFrames);
            
            lottieRef.current.animationItem.goToAndStop(frame, true);
        }
    }, [scrollPercentage]);

    useEffect(() => {
        if (!containerRef.current) return;

        const updateSize = () => {
            if (containerRef.current) {
                const aspectRatio = 1 / 1; // Adjust this to match your animation's aspect ratio
                const containerWidth = containerRef.current.offsetWidth;
                const containerHeight = containerRef.current.offsetHeight;
                const containerRatio = containerWidth / containerHeight;

                if (containerRatio > aspectRatio) {
                    // Container is wider than the desired aspect ratio
                    const height = containerWidth / aspectRatio;
                    setSize({ width: '100%', height: `${height}px` });
                } else {
                    // Container is taller than the desired aspect ratio
                    const width = containerHeight * aspectRatio;
                    setSize({ width: `${width}px`, height: '100%' });
                }
            }
        };

        const resizeObserver = new ResizeObserver(updateSize);
        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    // Force Lottie to redraw when size changes
    useEffect(() => {
        if (lottieRef.current && lottieRef.current.animationItem) {
            lottieRef.current.animationItem.resize();
        }
    }, [size]);

    return (
        <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center">
            <div style={{ width: size.width, height: size.height, maxWidth: '100%', maxHeight: '100%' }}>
                <Lottie 
                    lottieRef={lottieRef}
                    animationData={DCA} 
                    loop={true}
                    autoplay={false}
                    renderer={'canvas' as 'svg'}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                    rendererSettings={{
                        preserveAspectRatio: 'xMidYMid slice',
                        progressiveLoad: true,
                    }}
                />
            </div>
        </div>
    );
}

export default Home;