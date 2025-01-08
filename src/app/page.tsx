"use client"

// import { useState, useEffect } from 'react'

// import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Home } from '@/components/lottie' 
import { ProjectGrid } from "@/components/ui/card"
import NameAnimation from '@/components/NameAnimation'
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
    id: "4",
    title: "Beat Bowl",
    description: "An interactive music experience that combines rhythm and visual elements.",
    imageUrl: "/Postcard.jpg",
    gifUrl: "/Comp.gif",
    link: "#"
  },
  {
    id: "5",
    title: "Beat Bowl",
    description: "An interactive music experience that combines rhythm and visual elements.",
    imageUrl: "/Postcard.jpg",
    gifUrl: "/Comp.gif",
    link: "#"
  },
  {
    id: "6",
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
      <div className="relative z-10 min-h-screen flex flex-col">
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
        <div className="absolute inset-0 z-0">
        <Home />
      </div>
        <section className="w-full items-center justify-center content-center" style={{ height: 'calc(100vh - 3.5rem)' }}>
          <div className="container px-4 md:px-5 mx-auto h-full flex flex-col justify-center items-center">
            <div className="space-y-0 text-center">
            <div className="relative inline-block">
              <NameAnimation />
</div>
              <p className="text-white mix-blend-difference py-5 mx-auto max-w-[700px] md:text-xl">
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