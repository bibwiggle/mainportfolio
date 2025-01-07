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
  }
]

export default function Page() {

  return (
    
    <div className="relative min-h-screen overflow-y-scroll no-scrollbar">
    <div className="fixed inset-0 h-full">
      <Home/>
    </div>
      <div className="flex flex-col min-h-screen relative z-10">
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <Link className="flex items-center justify-center" href="#">
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Projects
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              About
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Contact
            </Link>
          </nav>
        </header>
        <main className="flex-1">
        
          <section className="w-full h-screen items-center justify-center content-center"> {/* Welcome section start */}
            <div className="container px-4 md:px-5 mx-auto" style={{ minHeight: 'calc(100vh - 42rem)'}}>
              <div className="flex flex-col items-center text-center">
                <div className="space-y-0">
                  <h1 className="text-6xl font-light tracking-widest sm:text-6xl md:text-8xl lg:text-9xl">
                  Junu
                  </h1>
                  <p className="py-5 mx-auto max-w-[700px] md:text-xl">
                    Digital Experiences | Content Creation | Art Direction
                  </p>
                </div>
              </div>
            </div>
          </section> {/* Welcome section end */}
          <section className="w-full h-screen items-center justify-center content-center"> {/* Welcome section start */}
            <div className="container px-4 md:px-5 mx-auto" style={{ minHeight: 'calc(100vh - 42rem)'}}>
              <div className="flex flex-col items-center text-center">
                <div className="space-y-0 py-10">
                  <h1 className="text-6xl font-light tracking-widest sm:text-6xl md:text-8xl lg:text-9xl">
                  Junu
                  </h1>
                  <p className="py-5 mx-auto max-w-[700px] md:text-xl">
                    Digital Experiences | Content Creation | Art Direction
                  </p>
                </div>
              </div>
            </div>
          </section> {/* Welcome section end */}
          <section className="w-full">
          <div className="py-12">
              <h2 className="text-3xl font-thin tracking-normal sm:text-5xl text-center  ">Projects</h2>
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