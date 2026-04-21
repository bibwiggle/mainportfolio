"use client";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import VideoPlayer from "@/components/VideoPlayer";

const TITLE    = "Beat Bowl";
const SUBTITLE = "A four-sided MIDI instrument designed for four players at once, built out of an obsession with knobs, faders, and what happens when you hand a stranger something they have never touched before.";

const SECTIONS = [
  {
    label: "Concept",
    body: `The shape came first: a pyramid with one face per player. The idea was to give each person a panel that controlled a section of a live techno track, without requiring any musical background. Some panels handled the kick, others ran effects or arpeggiators. A few controls were left deliberately ambiguous. Part of the experience was just figuring out what everything did.\n\nThe layout was intentionally a little chaotic, closer to a sci-fi console you want to touch than an instrument you know how to play.`,
  },
  {
    label: "Process",
    body: `Getting all the multiplexers talking to a single Arduino Pro Micro was a victory by itself. The hard lesson was that every component needs its own dedicated ground wire running back to a single common point. Merging multiple ground wires into one lets current from one component bleed into another, which is why turning one knob was sending the others jumping. A separate 12V power supply solved the other half of it, giving everything stable voltage instead of pulling from the Arduino's onboard power.\n\nThe moment the controls mapped cleanly in Ableton and every knob responded in real time was genuinely satisfying. That was when it stopped being a wiring project and started being an instrument.`,
  },
  {
    label: "User Experience",
    body: `Nobody knew what anything did, and that became the whole point. People crowded around, experimented, and occasionally made something genuinely good by accident. There was a lot of laughter. The best moments were the ones nobody planned for.\n\nThe core idea held up: music can be playful and accessible without needing explanation. I'd want to make each panel's role clearer in the next version, but for now I'm glad it made people want to sit down and mess with sound together.`,
  },
];

const SKILLS: string[] = [
  "Arduino Pro Micro (ATmega32U4, native USB MIDI)",
  "Electronics & Wiring",
  "Soldering",
  "Ableton Live",
  "Resolume",
  "Fusion 360",
  "3D Printing",
];

const VIDEOS = [
  { videoId: "RQUgp40epTk", aspect: 17 / 30, width: "50%" },
  { videoId: "UpqdW8SwsuE", aspect: 30 / 17 },
  { videoId: "FB9Jetnj4mQ", aspect: 30 / 26 },
];

const navLinks = [
  { href: "/",          label: "Home",     colorClass: "text-white" },
  { href: "/#projects", label: "Projects", colorClass: "text-white" },
  { href: "/contact",   label: "Contact",  colorClass: "text-white" },
];

export default function BeatBowl() {
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
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {VIDEOS.map(({ videoId, aspect, width }) => (
            <div key={videoId} className="flex justify-center">
              <div className="rounded-lg overflow-hidden" style={{ width: width ?? "100%", aspectRatio: aspect }}>
                <VideoPlayer videoId={videoId} />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
