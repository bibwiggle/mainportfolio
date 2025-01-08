"use client"

import React, { useEffect, useState, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

// Import the Lottie animation file
import DCA from '../../src/lotties/90.json';

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
            
            // Allow scrolling beyond 100% (e.g., 5 times the page height)
            const extendedScrollRange = scrollRange / 4;
            const percentage = (scrollPosition / extendedScrollRange) % 1;
            
            setScrollPercentage(percentage);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (lottieRef.current && lottieRef.current.animationItem) {
            const totalFrames = lottieRef.current.animationItem.totalFrames;
            const frame = Math.floor(scrollPercentage * totalFrames);
            
            lottieRef.current.animationItem.goToAndStop(frame, true);
        }
    }, [scrollPercentage]);

    // useEffect(() => {
    //     if (!containerRef.current) return;

    //     const updateSize = () => {
    //         if (containerRef.current) {
    //             const aspectRatio = 16 / 9; // Adjust this to match your animation's aspect ratio
    //             const windowWidth = window.innerWidth;
    //             const windowHeight = window.innerHeight;
    //             const windowRatio = windowWidth / windowHeight;

    //             let width, height;

    //             if (windowRatio > aspectRatio) {
    //                 // Window is wider than the desired aspect ratio
    //                 width = windowWidth;
    //                 height = windowWidth / aspectRatio;
    //             } else {
    //                 // Window is taller than the desired aspect ratio
    //                 height = windowHeight;
    //                 width = windowHeight * aspectRatio;
    //             }

    //             // Increase size to ensure full coverage
    //             const scale = 1.2;
    //             width *= scale;
    //             height *= scale;

    //             setSize({ width: `${width}px`, height: `${height}px` });
    //         }
    //     };

    //     updateSize();
    //     window.addEventListener('resize', updateSize);

    //     return () => window.removeEventListener('resize', updateSize);
    // }, []);

    // Force Lottie to redraw when size changes
    useEffect(() => {
        if (lottieRef.current && lottieRef.current.animationItem) {
            lottieRef.current.animationItem.resize();
        }
    }, [size]);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center">
            <div 
                style={{ 
                    width: size.width, 
                    height: size.height,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    transform: 'translate(0, -27%)',
                }}
            >
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