"use client";
import React from "react";
import { AnimatedHeader } from "@/components/AnimatedHeader";

export default function About() {
  const aboutLinks = [
    { href: "/", label: "Home", colorClass: "text-rose-300" },
    { href: "/#projects", label: "Projects", colorClass: "text-fuchsia-300" },
    { href: "/contact", label: "Contact", colorClass: "text-emerald-200" },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <AnimatedHeader navLinks={aboutLinks} />
      <main className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <section>
          <h1 className="text-emerald-200 text-6xl md:text-7xl lg:text-8xl font-thin tracking-tight leading-[1]">
            My name is Junu
          </h1>
          <p className="mt-8 text-xl text-gray-200 max-w-3xl">
          I’m a designer, artist, and recent Parsons School of Design graduate, based in New York. My work sits at the intersection of fabrication, technology, and playful experimentation—from interactive installations and kinetic sculpture to hands-on 3D prototyping and digital design.
            <br />
            <br />
            Driven by curiosity and a love of process, I’m always seeking that sense of discovery when an idea materializes—whether I’m sketching concepts in Fusion 360, soldering the first circuit, or refining mechanical movement. With a background that blends computer science, digital fabrication, and visual storytelling, I gravitate toward projects that move, react, and invite a sense of wonder.
            <br />
            <br />
            I’m drawn to collaboration and learning from others who push boundaries across disciplines. My goal is to create work that sparks curiosity, invites interaction, and offers a moment of surprise—sometimes even for myself.
            <br />
            <br />
            Whether in the studio or beyond, I’m motivated by a desire to make the familiar feel new, and to build experiences that engage both mind and senses.  
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-emerald-100 mb-2">Currently Into:</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1 pl-2">
            <li>Physical computing & kinetic sculpture</li>
            <li>3D printing & hands-on prototyping</li>
            <li>Generative visuals & live VJing</li>
            <li>Trying new recipes & sharing meals</li>
            <li>Good techno</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
