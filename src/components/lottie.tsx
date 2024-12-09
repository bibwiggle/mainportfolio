"use client"

import React, { useEffect, useState, useRef } from 'react';
import Lottie, { useLottie, useLottieInteractivity, LottieRefCurrentProps } from 'lottie-react';

// Import the Lottie animation file
import DCA from '../../src/lotties/DCAsharpn_1.json';

export function Home() {
    // State to track window dimensions
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Scroll position (0 to 1) for the page
    const [scrollPosition, setScrollPosition] = useState(0);

    // Ref for the Lottie animation instance (Type is LottieRefCurrentProps)
    const lottieRef = useRef<LottieRefCurrentProps>(null); // ✅ Type-safe Lottie ref

    // Update dimensions on resize
    useEffect(() => {
        function updateDimensions() {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        function handleScroll() {
            const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            setScrollPosition(scrollPercentage);
        }

        // Initial call to set dimensions
        updateDimensions();

        // Attach event listeners for scroll and resize
        window.addEventListener('resize', updateDimensions);
        window.addEventListener('scroll', handleScroll);

        // Clean up listeners on component unmount
        return () => {
            window.removeEventListener('resize', updateDimensions);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Update Lottie frame on scroll
    useEffect(() => {
        if (lottieRef.current) {
            const totalFrames = lottieRef.current.getDuration(true) || 1; // Fallback to 1 if undefined
            const frame = Math.floor(scrollPosition * totalFrames);
            lottieRef.current.goToAndStop(frame, true);
        }
    }, [scrollPosition]);

    // Lottie configuration for animation
    const ani = {
        animationData: DCA,
    };

    // Use Lottie hooks to create a Lottie instance (NO REF REQUIRED HERE)
    const lottieObj = useLottie(ani); // ✅ Correct usage - no second parameter

    // Interactivity hook to link scroll with animation
    const Scroll = useLottieInteractivity({
        lottieObj,
        mode: "scroll",
        actions: [
            {
                visibility: [0, 1], // Entire page scroll
                type: "seek", 
                frames: [0, 179], // Full frame range
            },
        ],
    });

    return (
        <>
            <div>
                <Lottie 
                    lottieRef={lottieRef} // ✅ Correct usage of the LottieRef prop
                    animationData={DCA} 
                    height={dimensions.height} 
                    width={dimensions.width} 
                />
            </div>
        </>
    );
}

export default Home;
