"use client"
import { useState, useRef, useEffect, useCallback } from 'react'
import MuxPlayer from '@mux/mux-player-react';

interface VideoBackgroundProps {
  reverseSpeed?: boolean;
}

type MuxPlayerRefType = React.ElementRef<typeof MuxPlayer>;

export default function VideoBackground({ reverseSpeed = false }: VideoBackgroundProps) {
  const [playbackRate, setPlaybackRate] = useState(reverseSpeed ? 5 : 1)
  const muxPlayerRef = useRef<MuxPlayerRefType>(null)

  const updatePlaybackRate = useCallback(() => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    
    // Calculate the new playback rate based on scroll position
    const scrollProgress = Math.min(currentScrollTop / maxScroll, 1)
    const newRate = reverseSpeed
      ? 5 - (scrollProgress * 4) // 13 (max) to 1 (min) speed
      : 1 + (scrollProgress * 4) // 1 (min) to 13 (max) speed

    setPlaybackRate(newRate)
    if (muxPlayerRef.current) {
      muxPlayerRef.current.playbackRate = newRate
    }
  }, [reverseSpeed])

  useEffect(() => {
    // Set initial playback rate
    updatePlaybackRate()

    // Add scroll event listener
    window.addEventListener('scroll', updatePlaybackRate)

    return () => {
      window.removeEventListener('scroll', updatePlaybackRate)
    }
  }, [updatePlaybackRate])

  return (
    <>
      <MuxPlayer
        ref={muxPlayerRef}
        streamType="on-demand"
        playbackId="rLXKkhWN9DoE11lBg00myUuacZ02YZOjgpMxJ5puxjCDA"
        metadataVideoTitle="Placeholder (optional)"
        metadataViewerUserId="Placeholder (optional)"
        primaryColor="#FFFFFF"
        secondaryColor="#000000"
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      />
      <div className="fixed top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
        Speed: {playbackRate.toFixed(2)}x
      </div>
    </>
  )
}
