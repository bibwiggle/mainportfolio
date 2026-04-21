"use client";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import VideoPlayer from "@/components/VideoPlayer";
import { LightboxImage } from "@/components/LightboxImage";
import { LightboxVideo } from "@/components/LightboxVideo";

const TITLE    = "Spiritual Mercury";
const SUBTITLE = "A kinetic sculpture imagining a futuristic energy artifact, where reflective fluid forms rotate within a custom hubless ring structure.";

const SECTIONS: { label: string; body: string }[] = [
  {
    label: "Concept",
    body: `Spiritual Mercury imagines what a futuristic energy artifact might look like if it arrived already ancient. Reflective, fluid forms rotate within a custom hubless ring, creating the impression of something that grew into its shape rather than was designed into it. The piece draws from digital mysticism and cybersigillism, pulling symbolic visual language into a physical, mechanical object. Through motion and reflection, it sits somewhere between machine, artifact, and presence.`,
  },
  {
    label: "Aesthetic",
    body: `The form was developed in Blender using the subdivision modifier, which pushes a simple mesh into something organic and hard to predict. The influence here is parametric design and cybersigillism, a visual language that fuses occult symbolism with digital geometry. Overlapping the forms and rotating them against each other produces an effect that is difficult to look away from. The motion is where the meaning lives.`,
  },
  {
    label: "Design",
    body: `The core challenge was spinning the gear without rotating its center. The skeleton is a repurposed metal bar from an old bed frame, running through the middle and staying fixed, strong enough to support the custom mount designed around it.\n\nThe mount holds a set of wheels that grip the track of the hubless gear, keeping it stable as it spins. The NEMA17 drives the outer ring while the center axis remains completely still, letting whatever is housed inside stay stationary relative to the rotation.`,
  },
];

const SKILLS: string[] = [
  "Fusion 360",
  "Blender",
  "3D Printing",
  "NEMA17 Stepper Motor",
  "Mechanical Design",
  "Fabrication",
];

const YOUTUBE_VIDEOS: string[] = [];
const LOCAL_VIDEOS: { src: string; label?: string }[] = [
  { src: "/spirtualm assets/proof of concept_web.mp4", label: "Proof of concept, fully mounted sculpture" },
  { src: "/spirtualm assets/led poc_web.mp4",           label: "LED test, unmounted" },
];
const IMAGES: { src: string; label?: string }[] = [
  { src: "/spirtualm assets/sm gear design.png" },
  { src: "/spirtualm assets/Hubless gear.png" },
  { src: "/spirtualm assets/hubless gear mount.png", label: "Hubless gear design" },
];

const navLinks = [
  { href: "/",          label: "Home",     colorClass: "text-white" },
  { href: "/#projects", label: "Projects", colorClass: "text-white" },
  { href: "/contact",   label: "Contact",  colorClass: "text-white" },
];

export default function SpiritualMercury() {
  return (
    <div className="bg-black text-white min-h-screen">
      <AnimatedHeader navLinks={navLinks} />

      <section className="pt-32 pb-16 px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* LEFT */}
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-6">{TITLE}</h1>

          {SUBTITLE && <p className="text-white/50 text-lg leading-relaxed">{SUBTITLE}</p>}

          {SECTIONS.map(({ label, body }) => (
            <div key={label} className="mt-8 space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-white/40">{label}</h2>
              {body.split("\n\n").map((p, i) => (
                <p key={i} className="text-white/60 text-sm leading-relaxed">{p}</p>
              ))}
            </div>
          ))}

          {SKILLS.length > 0 && (
            <div className="mt-8 space-y-3">
              <h2 className="text-xs uppercase tracking-widest text-white/40">Tools & Tech</h2>
              <div className="flex flex-wrap gap-3">
                {SKILLS.map((s) => (
                  <span key={s} className="px-4 py-2 border border-white/20 rounded-full text-sm text-white/80">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Mobile-only: render animation first after text */}
          <div className="mt-8 flex justify-center lg:hidden">
            <LightboxVideo src="/mp4/Comp_1_web2.mp4" className="w-full rounded-lg" wrapperStyle={{ width: "45%" }} />
          </div>

          {/* Screenshots under text */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {IMAGES.map(({ src, label }) => (
              <div key={src}>
                <LightboxImage
                  src={src}
                  alt={label ?? ""}
                  className="w-full rounded-lg"
                  style={{ aspectRatio: "4/3" }}
                />
                {label && <p className="mt-2 text-xs text-white/30 uppercase tracking-widest">{label}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — render animation, constrained size */}
        <div className="space-y-4">
          <div className="hidden lg:flex flex-col items-center gap-3">
            <LightboxVideo src="/mp4/Comp_1_web2.mp4" className="w-full rounded-lg" wrapperStyle={{ width: "25%" }} />

            {/* Digital artifact study Short — crop black bars */}
            <div style={{ width: "100%" }}>
              <div className="rounded-lg overflow-hidden" style={{ aspectRatio: "30/17", position: "relative" }}>
                <div style={{ position: "absolute", top: "-10%", left: 0, right: 0, bottom: "-10%" }}>
                  <VideoPlayer videoId="pAUZBQt2tmk" />
                </div>
              </div>
              <p className="mt-2 text-xs text-white/30 uppercase tracking-widest text-center">Digital artifact study</p>
            </div>
          </div>

          <div className="flex gap-4">
            {LOCAL_VIDEOS.map(({ src, label }) => (
              <div key={src} className="flex-1">
                <LightboxVideo src={src} className="w-full rounded-lg" />
                {label && <p className="mt-2 text-xs text-white/30 uppercase tracking-widest">{label}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {YOUTUBE_VIDEOS.map((id) => (
        <section key={id} className="w-full aspect-video">
          <VideoPlayer videoId={id} />
        </section>
      ))}
    </div>
  );
}
