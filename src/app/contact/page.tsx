"use client";
import { AnimatedHeader } from "@/components/AnimatedHeader";

const navLinks = [
  { href: "/",          label: "Home",     colorClass: "text-white" },
  { href: "/#projects", label: "Projects", colorClass: "text-white" },
  { href: "/contact",   label: "Contact",  colorClass: "text-white" },
];

export default function Contact() {
  return (
    <div className="bg-black text-white min-h-screen">
      <AnimatedHeader navLinks={navLinks} />

      <section className="pt-32 pb-16 px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* LEFT — bio */}
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-8">My name is Junu</h1>
          <p className="text-white/50 text-lg leading-relaxed">
            I'm a designer and recent Parsons School of Design graduate based in New York. My work sits at the intersection of fabrication, technology, and creative experimentation: from kinetic sculpture and interactive installations to custom electronics and digital design.
          </p>
          <p className="mt-6 text-white/50 text-lg leading-relaxed">
            With a background spanning computer science, digital fabrication, and visual storytelling, I gravitate toward projects that move, react, and invite curiosity. I'm drawn to the moment an idea becomes physical, whether that's a mechanism finally turning the way it should, or a room full of people discovering something together for the first time.
          </p>

          <div className="mt-10 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-white/40">Currently Into</h2>
            <ul className="space-y-1 text-white/60 text-sm">
              <li>Physical computing & kinetic sculpture</li>
              <li>3D printing & hands-on prototyping</li>
              <li>Generative visuals & live VJing</li>
              <li>Trying new recipes & sharing meals</li>
              <li>Good techno</li>
            </ul>
          </div>
        </div>

        {/* RIGHT — contact */}
        <div>
          <h2 className="text-5xl font-bold tracking-tight mb-8">Get in touch</h2>
          <p className="text-white/50 text-lg leading-relaxed">
            Interested in collaborating, chatting about a project, or just want to say hi? I'm always open to new opportunities, creative conversations, and connecting with others who are passionate about design, fabrication, or anything in between.
          </p>

          <div className="mt-10 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-white/40">Email</h2>
            <a href="mailto:bibw.lab@gmail.com" className="text-white text-lg hover:text-white/60 transition-colors">
              bibw.lab@gmail.com
            </a>
          </div>

          <div className="mt-8 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-white/40">Links</h2>
            <div className="flex flex-col gap-2">
              <a href="https://www.linkedin.com/in/junu-lee/" target="_blank" rel="noopener noreferrer"
                className="text-white/60 text-sm hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="https://www.instagram.com/bib_wig" target="_blank" rel="noopener noreferrer"
                className="text-white/60 text-sm hover:text-white transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
