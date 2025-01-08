"use client"

// import { useState, useEffect } from 'react'

// import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Home } from '@/components/lottie' 
import { ProjectGrid } from "@/components/ui/card"
// import dynamic from 'next/dynamic'

const projects = [
  {
    id: "1",
    title: "Beat Bowl",
    description: "An interactive music experience that combines rhythm and visual elements.",
    imageUrl: "/Postcard.jpg",
    gifUrl: "/Comp.gif",
    link: "#"
  },
  {
    id: "2",
    title: "Dancing 단청",
    description: "A digital art installation inspired by traditional Korean decorative techniques.",
    imageUrl: "/Postcard.jpg",
    gifUrl: "/Comp.gif",
    link: "#"
  },
  {
    id: "3",
    title: "VJ clips",
    description: "A collection of visually stunning video clips for live performances and events.",
    imageUrl: "/Postcard.jpg",
    gifUrl: "/Comp.gif",
    link: "#"
  },
  {
    id: "1",
    title: "Beat Bowl",
    description: "An interactive music experience that combines rhythm and visual elements.",
    imageUrl: "/Postcard.jpg",
    gifUrl: "/Comp.gif",
    link: "#"
  },
  {
    id: "1",
    title: "Beat Bowl",
    description: "An interactive music experience that combines rhythm and visual elements.",
    imageUrl: "/Postcard.jpg",
    gifUrl: "/Comp.gif",
    link: "#"
  },
  {
    id: "1",
    title: "Beat Bowl",
    description: "An interactive music experience that combines rhythm and visual elements.",
    imageUrl: "/Postcard.jpg",
    gifUrl: "/Comp.gif",
    link: "#"
  },
]

export default function Page() {

  return (
    
    <div className="relative min-h-screen no-scrollbar">
    <div className="inset-0 h-full">
      <Home/>
    </div>
      <div className="flex flex-col min-h-screen relative z-10">
      <header className="site-header js-site-header  js-fixed-nav sticky top-0 z-50 px-4 lg:px-6 h-14 flex items-center backdrop-blur-sm shadow">
          <nav className="mx-auto flex gap-4 sm:gap-6">
            <Link className="text-rose-300 font-normal sm:text-sm md:text-base lg:text-lg hover:underline underline-offset-4" href="#">
              Projects
            </Link>
            <Link className="text-cyan-400 font-normal sm:text-sm md:text-base lg:text-lg hover:underline underline-offset-4" href="#">
              About
            </Link>
            <Link className="text-emerald-200 font-normal sm:text-sm md:text-base lg:text-lg hover:underline underline-offset-4" href="#">
              Contact
            </Link>
          </nav>
        </header>
        <main className="flex-1">
        
        <section className="w-full items-center justify-center content-center" style={{ height: 'calc(100vh - 3.5rem)' }}>
          <div className="container px-4 md:px-5 mx-auto h-full flex flex-col justify-center items-center">
            <div className="space-y-0 text-center">
              <h1 className="text-emerald-200 text-6xl font-light tracking-widest sm:text-6xl md:text-8xl lg:text-9xl">
              Junu
              </h1>
              <p className="text-emerald-200 py-5 mx-auto max-w-[700px] md:text-xl">
              Digital Experiences | Content Creation | Art Direction
              </p>
            </div>
          </div>
        </section>{/* Welcome section end */}
  
          <section className="w-full">
          <div className="py-4 backdrop-blur-sm shadow">
              <h2 className="text-emerald-200 text-3xl font-thin tracking-normal sm:text-5xl text-center">Projects</h2>
          </div>
          <ProjectGrid projects={projects} />
          </section>
        </main>

      </div>
    </div>
  )
}

type MountainIconProps = React.SVGProps<SVGSVGElement>;

function MountainIcon(props: MountainIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}