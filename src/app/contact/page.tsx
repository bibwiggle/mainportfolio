"use client";
import React from "react";
import { AnimatedHeader } from "@/components/AnimatedHeader";

export default function contact() {
    const contactLinks = [
      { href: "/", label: "Home", colorClass: "text-rose-300" },
      { href: "/#projects", label: "Projects", colorClass: "text-fuchsia-300" },
      { href: "/about", label: "About", colorClass: "text-cyan-400" },
    ];
return (
    <div className="bg-gray-900">
        <AnimatedHeader navLinks={contactLinks} />
        {/* MAIN */}a
        <main className="max-w-4xl mx-auto px-4 py-16 space-y-16">
  <section>
    <h1 className="text-emerald-200 text-6xl md:text-7xl lg:text-8xl font-thin tracking-tight leading-[1]">
      Contact
    </h1>
    <p className="mt-8 text-xl text-gray-200 max-w-2xl">
      Interested in collaborating, chatting about a project, or just want to say hi?<br /><br />
      I’m always open to new opportunities, creative conversations, and connecting with others who are passionate about design, fabrication, or anything in between.  
      <br /><br />
      Reach out anytime:
      <br />
      <span className="block font-mono text-lg mt-2 text-emerald-200">
        <a href="mailto:bibw.lab@gmail.com" className="hover:underline">bibw.lab@gmail.com</a>
      </span>
    </p>
  </section>
  <section>
    <h2 className="text-2xl text-emerald-100 mb-2">Let’s connect:</h2>
    <ul className="list-disc list-inside text-gray-300 space-y-1 pl-2">
      {/* Replace or add your socials below */}
      <li>
        <a href="https://www.linkedin.com/in/junu-lee/" target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-200">
          LinkedIn
        </a>
      </li>
      <li>
        <a href="https://www.instagram.com/bib_wig" target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-200">
          Instagram
        </a>
      </li>
      {/* ... add more if you want */}
    </ul>
  </section>
</main>
      </div>
  );
}
