"use client";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import VideoPlayer from "@/components/VideoPlayer";
import Image from "next/image";

const TITLE    = "Dancing Dancheong";
const SUBTITLE = "A kinetic sculpture inspired by traditional Korean decorative techniques, reimagined through motion and contemporary technology.";

const SECTIONS = [
  {
    label: "Concept",
    body: `Dancing Dancheong is a kinetic sculpture that reinterprets traditional Korean decorative painting through motion and contemporary technology. Inspired by the structured patterns and symbolic color systems of dancheong, the work translates these historically static designs into a dynamic, multi-axis mechanical form. By animating cultural ornamentation through robotics and digital fabrication, the piece explores how traditional visual languages can evolve and exist within contemporary technological systems.`,
  },
  {
    label: "Process",
    body: `The most intense part of Dancing Dancheong was the mechanical challenge. This was easily the most complex thing I've ever built in Fusion 360. I designed a three-axis system using pairs of bevel gears, each connected to its own motor, with three rods of different thicknesses spinning inside one another. This let me control three layers of pattern, each moving independently but sharing the same axis. Figuring out gear ratios and how to actually get enough torque was a whole journey. I wish I'd understood mechanical advantage from the start—it would have saved me a lot of headaches. But by Prototype 3, I finally got the motion I envisioned: patterns gliding and spinning in a way that felt alive and truly new.\n\nWiring the motors and drivers was another milestone. Every prototype taught me something, especially about getting the electrical side stable and organized. By the end, I felt a lot more confident wrangling both code and cables.`,
  },
];

const SKILLS: string[] = [
  "Arduino Pro Micro",
  "Multiplexers",
  "Stepper Motors & Drivers",
  "Fusion 360",
  "3D Printing",
  "Spray Paint & Top Coat",
  "Graphite Powder",
  "Filler Primer",
];

const navLinks = [
  { href: "/",          label: "Home",     colorClass: "text-white" },
  { href: "/#projects", label: "Projects", colorClass: "text-white" },
  { href: "/about",     label: "About",    colorClass: "text-white" },
  { href: "/contact",   label: "Contact",  colorClass: "text-white" },
];

export default function DancingDancheong() {
  return (
    <div className="bg-black text-white min-h-screen">
      <AnimatedHeader navLinks={navLinks} />

      <section className="pt-32 pb-16 px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* LEFT */}
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-6">{TITLE}</h1>
          <p className="text-white/50 text-lg leading-relaxed">{SUBTITLE}</p>

          {SECTIONS.map(({ label, body }) => (
            <div key={label} className="mt-8 space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-white/40">{label}</h2>
              {body.split("\n\n").map((p, i) => (
                <p key={i} className="text-white/60 text-sm leading-relaxed">{p}</p>
              ))}
            </div>
          ))}

          <div className="mt-8 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-white/40">Tools & Tech</h2>
            <div className="flex flex-wrap gap-3">
              {SKILLS.map((s) => (
                <span key={s} className="px-4 py-2 border border-white/20 rounded-full text-sm text-white/80">{s}</span>
              ))}
            </div>
          </div>

          {/* Second video + chrome image under text */}
          <div className="mt-8 flex gap-4">
            <div className="flex-1 rounded-lg overflow-hidden" style={{ aspectRatio: "17/30" }}>
              <VideoPlayer videoId="fNOX-ZMpEX0" />
            </div>
            <div className="flex-1 relative rounded-lg overflow-hidden" style={{ aspectRatio: "17/30" }}>
              <Image src="/assets/chrome.jpg" alt="Chrome finish" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* RIGHT — first video + DDthumb side by side, smaller */}
        <div className="flex gap-4">
          <div className="flex-1 rounded-lg overflow-hidden" style={{ aspectRatio: "17/30" }}>
            <VideoPlayer videoId="kZeOEtuZLTU" />
          </div>
          <div className="flex-1 relative rounded-lg overflow-hidden" style={{ aspectRatio: "17/30" }}>
            <Image src="/assets/DDthumb2.png" alt="Dancing Dancheong" fill className="object-cover" />
          </div>
        </div>
      </section>

    </div>
  );
}
