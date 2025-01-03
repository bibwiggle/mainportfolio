"use client"

import React, { useEffect, useState, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

// Import the Lottie animation file
import DCA from '../../src/lotties/DCAsharpn_1.json';

// Easing function (ease-out cubic) //Higher the number, quicker to slow down
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 5);
}

export function Home() {
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const percentage = scrollPosition / maxScroll;
            setScrollPercentage(percentage);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (lottieRef.current) {
            // Apply easing function to the scroll percentage
            const easedPercentage = easeOutCubic(scrollPercentage);
            
            // Calculate speed based on eased scroll percentage
            // 5 at the top (0% scrolled), 1 at the bottom (100% scrolled)
            const speed = 3.5 - (2.5 * easedPercentage);
            
            lottieRef.current.setSpeed(speed);

            // Pause the animation when at the very top
            if (scrollPercentage > .999) {
                lottieRef.current.pause();
            } else {
                lottieRef.current.play();
            }
        }
    }, [scrollPercentage]);

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden">
            <Lottie 
                lottieRef={lottieRef}
                animationData={DCA} 
                loop={true}
                autoplay={false}
                renderer={'canvas' as 'svg'}
                style={{
                    width: '100%',
                    height: '100%',
                    
                }}
                rendererSettings={{
                    preserveAspectRatio: 'xMidYMid slice',
                    progressiveLoad: true, // This can help with performance
                    
                }}
            />
        </div>
    );
}

export default Home;