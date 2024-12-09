"use client"

import React, { useEffect, useState, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

// Import the Lottie animation file
import DCA from '../../src/lotties/DCAsharpn_1.json';

export function Home() {
    // Track scroll position as a percentage
    const [scrollPosition, setScrollPosition] = useState(0);

    // Ref for the Lottie animation instance (Type is LottieRefCurrentProps)
    const lottieRef = useRef<LottieRefCurrentProps>(null); // ✅ Type-safe Lottie ref

    // Track scroll position as a percentage
    useEffect(() => {
        function handleScroll() {
            const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            setScrollPosition(scrollPercentage);
        }

        window.addEventListener('scroll', handleScroll);
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Update Lottie frame on scroll
    useEffect(() => {
        if (lottieRef.current) {
            const totalFrames = lottieRef.current.getDuration(true) || 1; // Fallback to 1 if undefined
            const frame = Math.floor(scrollPosition * totalFrames);
            lottieRef.current.goToAndStop(frame, true);
        }
    }, [scrollPosition]);

    return (
        <>
            <div 
                className="fixed inset-0 w-screen h-screen overflow-hidden"
            >
                <Lottie 
                    lottieRef={lottieRef} // ✅ Correct usage of the LottieRef prop
                    animationData={DCA} 
                    style={{
                        width: '100%',
                        height: '100%',
                    }} 
                    rendererSettings={{
                        preserveAspectRatio: 'xMidYMid slice', // Use xMidYMid slice to fill
                    }}
                />
            </div>
            <div style={{ height: '500vh' }}>
                {/* Scrollable space */}
            </div>
        </>
    );
}

export default Home;
