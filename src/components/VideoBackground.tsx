"use client"
import { useState, useRef, useEffect } from 'react'

interface VideoBackgroundProps {
  videoSrc: string;
}

export default function VideoBackground({ videoSrc }: VideoBackgroundProps) {
  const [playbackRate, setPlaybackRate] = useState(1) // Start at min speed
  const videoRef = useRef<HTMLVideoElement>(null)

  const updatePlaybackRate = () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    
    // Calculate the new playback rate based on scroll position
    const scrollProgress = Math.min(currentScrollTop / maxScroll, 1)
    const newRate = 1 + (scrollProgress * 12) // 1 (min) to 13 (max) speed

    setPlaybackRate(newRate)
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate
    }
  }

  useEffect(() => {
    // Set initial playback rate
    updatePlaybackRate()

    // Add scroll event listener
    window.addEventListener('scroll', updatePlaybackRate)

    return () => {
      window.removeEventListener('scroll', updatePlaybackRate)
    }
  }, [])

  return (
    <>
      <video 
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src={videoSrc}
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      />
      <div className="fixed top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
        Speed: {playbackRate.toFixed(2)}x
      </div>
    </>
  )
}