"use client";
import React from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import Image from "next/image";
import thesisv3 from "/public/thesisv3.png";
import chrome from "/public/chrome.jpg"

export default function dancingdancheong() {
  // NAVIGATION LINKS
  const navLinks = [
    { href: "/", label: "Home", colorClass: "text-rose-300" },
    { href: "/#projects", label: "Projects", colorClass: "text-fuchsia-300" },
    { href: "/about", label: "About", colorClass: "text-cyan-400" },
    { href: "/contact", label: "Contact", colorClass: "text-emerald-200" },
  ];

  // PROJECT MEDIA — swap paths to your files in /public/
  const prototype1 = { videoId: "kZeOEtuZLTU", type: "video/mp4" };
  const prototype2 = { videoId: "fNOX-ZMpEX0", type: "video/mp4" };

  // TOOL LIST
  const tools = [
    "Arduino Pro Micro",
    "Multiplexers for analog/digital expansion",
    "Custom wiring and prototyping",
    "Stepper motors/drivers",
    "Fusion 360 (mechanical/ornate design)",
    "3D Printing",
    "Spray paint/Top Coat",
    "Graphite powder",
    "Filler primer",
    "Sand Paper",
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <AnimatedHeader navLinks={navLinks} />

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {/* TITLE + SUMMARY */}
        <section>
          <h1 className="text-emerald-200 text-6xl font-thin tracking-tight">Dancing Dancheong</h1>
          <p className="mt-5 text-xl text-gray-200">
          This project started from my fascination with dancheong, those intricate, repeating patterns that cover historic 
          Korean architecture. There’s a sense of wonder in their geometry—almost like the surface is breathing. Dancing Dancheong 
          is an experiment in making that wonder kinetic: seeing what new relationships emerge when the patterns aren’t static, 
          but moving and alive.
          </p>
          <p className="mt-5 text-xl text-gray-200">
          This project was inspired by artists like William Darrell and Florian Goerlitz, whose kinetic works have a hypnotic 
          presence. I wanted to create something just as mesmerizing—something that could work as stage design for a DJ set or 
          as an art installation, but as an alternative to the usual strobe lights, spotlights, and lasers. 
          I pictured something gigantic, lit from within, moving in ways you can’t quite predict. 
          The dream was a 6-by-6-foot piece that could transform a whole room, but I didn’t quite get there…yet.
          </p>
        </section>

        {/* MEDIA: VIDEO & IMAGES */}
        <section className="flex flex-col md:flex-row gap-6 items-center justify-center">
          <div className="h-fit flex justify-center"
               style={{ aspectRatio: 17/30, maxHeight: "80vh" }}>          
            <VideoPlayer
            videoId={prototype1.videoId}
          /></div>

        <div className="flex-1 h-[80vh] flex justify-center items-center">
          <Image
            src={thesisv3}
            alt="In use"
            className="fill h-[110%] w-full max-w-full object-cover"
          />
        </div>
        </section>

        {/* PROCESS DESCRIPTION */}
        <section>
          <h2 className="text-3xl font-light text-emerald-100 mb-3">Process</h2>
          <p className="text-gray-300 leading-relaxed">
          The most intense part of Dancing Dancheong was the mechanical challenge. This was easily the most complex thing I’ve ever 
          built in Fusion 360. I designed a three-axis system using pairs of bevel gears, each connected to its own motor, 
          with three rods of different thicknesses spinning inside one another. This let me control three layers of pattern, 
          each moving independently but sharing the same axis. Figuring out gear ratios and how to actually get enough torque 
          was a whole journey. I wish I’d understood mechanical advantage from the start—it would have saved me a lot of headaches. 
          But by Prototype 3, I finally got the motion I envisioned: patterns gliding and spinning in a way that felt alive and truly 
          new.
          </p>
          <p className="text-gray-300 leading-relaxed">
          Wiring the motors and drivers was another milestone. Every prototype taught me something, especially about getting the 
          electrical side stable and organized. By the end, I felt a lot more confident wrangling both code and cables.
          </p>
        </section>

        {/* Ambition, Setbacks, and What’s Next */}
        <section>
          <h2 className="text-3xl font-light text-emerald-100 mb-3">Ambition, Setbacks, and What’s Next</h2>
          <p className="text-gray-300 leading-relaxed">
          The original plan included a chrome finish, partly because I wanted to reflect and multiply the light from the LEDs 
          I was planning to embed. I wanted the surface to feel both futuristic and sacred, something you’d want to see yourself in. 
          But the chrome finish I managed wasn’t quite what I wanted. And right before the thesis show, the whole piece fell 
          off its pedestal—not only the chrome petals, but the mechanical components were broken... the movement was gone. 
          That was probably the most frustrating part of the whole process. I never got to present it at the scale or polish I envisioned.
          </p>
          
          <p className="text-gray-300 leading-relaxed">
          Still, that unfinished prototype was a proof of concept. Seeing the layered motion and the patterns interacting just like 
          I imagined was the best moment of the whole build. I know now how I’d scale it up: more torque, sturdier rods, maybe even 
          more complex motion. I think the three-rods-one-axis design still has a ton of untapped potential. I might rebuild it one 
          day—or maybe just move on to new territory.
          </p>
          <section className="flex flex-col md:flex-row gap-6 items-center justify-center">
          <div className="h-fit flex justify-center"
               style={{ aspectRatio: 17/30, maxHeight: "80vh" }}>          
            <VideoPlayer
            videoId={prototype2.videoId}
          /></div>

        <div className="flex-1 h-[80vh] flex justify-center items-center">
          <Image
            src={chrome}
            alt="In use"
            className="fill h-[95%] w-full max-w-full object-cover"
          />
        </div>
        </section>
        </section>
        {/* REFLECTION */}
        <section>
          <h2 className="text-3xl font-light text-emerald-100 mb-3">Reflection</h2>
          <p className="text-gray-300 leading-relaxed">
          Dancing Dancheong taught me that tradition isn’t static. By breaking open the mechanics and letting patterns move, 
          I felt like I was having a direct conversation with the past—one that’s not always neat or finished, but alive and 
          full of surprises. If nothing else, I hope the piece leaves people a little mesmerized and curious—about art, about motion, 
          and about the traditions they think they already know.
          </p>
        </section>
        {/* TOOLS & TECHNOLOGIES */}
        <section>
          <h3 className="text-2xl text-emerald-100 mb-2">Tools & Technologies</h3>
          <ul className="list-disc list-inside text-gray-300">
            {tools.map((tool, i) => <li key={i}>{tool}</li>)}
          </ul>
        </section>

        {/* BACK NAVIGATION */}
        <section>
          <a
            href="/#projects"
            className="inline-block mt-8 text-emerald-300 underline hover:text-emerald-100 transition"
          >
            ← Back to Projects
          </a>
        </section>
      </main>
    </div>
  );
}
