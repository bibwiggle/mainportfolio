"use client";
import React from "react";
import { AnimatedHeader } from "@/components/AnimatedHeader";

export default function about() {
    const aboutLinks = [
      { href: "/", label: "Home", colorClass: "text-rose-300" },
      { href: "/about", label: "About", colorClass: "text-cyan-400" },
      { href: "/contact", label: "Contact", colorClass: "text-emerald-200" },
    ];
return (
    <div className="bg-gray-900">
        <AnimatedHeader navLinks={aboutLinks} />
        {/* MAIN */}
        <main className="flex-1">
          <section className="w-full">
            <div className="container px-1 py-12 text-left">
              <h1 className="text-emerald-200 text-6xl md:text-7xl lg:text-8xl font-thin tracking-tight leading-[1]">
                My name is Junu
              </h1>
            </div>
          </section>
        </main>
      </div>
  );
}
