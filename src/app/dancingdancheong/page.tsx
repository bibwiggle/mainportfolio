"use client";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import VideoPlayer from "@/components/VideoPlayer";
import { LightboxImage } from "@/components/LightboxImage";
import { LightboxVideo } from "@/components/LightboxVideo";

const TITLE    = "Dancing Dancheong";
const SUBTITLE = "A kinetic sculpture that reinterprets traditional Korean decorative painting through motion and contemporary technology.";

const SECTIONS = [
  {
    label: "Concept",
    body: `Dancing Dancheong reinterprets traditional Korean decorative painting through motion and contemporary technology. Inspired by the structured patterns of dancheong found across historic Korean architecture, the work translates these historically static designs into a dynamic, multi-axis mechanical form. By animating cultural ornamentation through robotics and digital fabrication, the piece explores how traditional visual languages can evolve and exist within contemporary technological systems.`,
  },
  {
    label: "Process",
    body: `The mechanical design was the hardest thing I had built at that point. A three-axis system with pairs of bevel gears, each connected to its own motor, with rods of different thicknesses nested inside one another. Getting the gear ratios right and finding enough torque was a long journey. I wish I had understood mechanical advantage from the start. But by Prototype 3, the motion was finally what I had imagined: layers of pattern gliding and spinning in a way that felt alive.\n\nWiring the motors and drivers was its own education. Every prototype taught me something new about keeping the electrical side stable. By the end, I felt much more confident managing both the code and the cables.`,
  },
];

const SKILLS: string[] = [
  "Arduino Pro Micro",
  "Electronics & Wiring",
  "Stepper Motors & Drivers",
  "Fusion 360",
  "3D Printing",
  "Spray Paint & Top Coat",
];

const navLinks = [
  { href: "/",          label: "Home",     colorClass: "text-white" },
  { href: "/#projects", label: "Projects", colorClass: "text-white" },
  { href: "/contact",   label: "Contact",  colorClass: "text-white" },
];

export default function DancingDancheong() {
  return (
    <div className="bg-black text-white min-h-screen">
      <AnimatedHeader navLinks={navLinks} />

      <section className="pt-32 pb-16 px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* LEFT */}
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-2">{TITLE}</h1>
          <p className="text-white/30 text-lg mb-6">단청</p>

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

          {/* Mobile-only: render animation first after text */}
          <LightboxVideo src="/mp4/Lottie_web.mp4" className="w-full rounded-lg" wrapperClassName="mt-8 lg:hidden" />

          {/* Second video + chrome image */}
          <div className="mt-8 flex gap-4">
            <div className="flex-1 rounded-lg overflow-hidden" style={{ aspectRatio: "17/30" }}>
              <VideoPlayer videoId="fNOX-ZMpEX0" />
            </div>
            <LightboxImage
              src="/assets/chrome.jpg"
              alt="Chrome finish"
              className="flex-1 rounded-lg"
              style={{ aspectRatio: "17/30" }}
            />
          </div>
        </div>

        {/* RIGHT — blender render + first video + DDthumb */}
        <div className="space-y-4">
          <LightboxVideo src="/mp4/Lottie_web.mp4" className="w-full rounded-lg" wrapperClassName="hidden lg:block" />
          <div className="flex gap-4">
            <div className="flex-1 rounded-lg overflow-hidden" style={{ aspectRatio: "17/30" }}>
              <VideoPlayer videoId="kZeOEtuZLTU" />
            </div>
            <LightboxImage
              src="/assets/DDthumb2.png"
              alt="Dancing Dancheong"
              className="flex-1 rounded-lg"
              style={{ aspectRatio: "17/30" }}
            />
          </div>
        </div>
      </section>

    </div>
  );
}
