"use client"

import React, { useEffect, useState, useRef } from 'react'
import Lottie from 'react-lottie'

// Update the import path to match your project structure
import animationData from '../../src/lotties/DCAsharpn_1.json'

export function Home() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [scrollPosition, setScrollPosition] = useState(0);
    const lottieRef = useRef<any>(null);

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
        
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('resize', updateDimensions);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (lottieRef.current) {
            const totalFrames = lottieRef.current.anim.totalFrames;
            const frame = Math.floor(scrollPosition * totalFrames);
            lottieRef.current.anim.goToAndStop(frame, true);
        }
    }, [scrollPosition]);

    const defaultOptions = {
        loop: false,
        autoplay: false,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };
    
    return (
        <>
            <div className="fixed inset-0 w-full h-full">
                <Lottie 
                    options={defaultOptions}
                    height={dimensions.height}
                    width={dimensions.width}
                    isStopped={true}
                    isPaused={true}
                    ref={lottieRef}
                />
            </div>
            <div style={{ height: '500vh' }}>
                {/* This div creates scrollable space */}
            </div>
        </>
    );
}

export default Home;