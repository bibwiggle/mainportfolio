"use client";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import VideoPlayer from "@/components/VideoPlayer";

const TITLE    = "Beat Bowl";
const SUBTITLE = "Beat Bowl is a collaborative MIDI instrument built from my love of DJing and VJing.";

const SECTIONS = [
  {
    label: "Concept",
    body: `I built it as a four-sided pyramid, so up to four people can crowd around, each with their own playful set of controls. The layout's intentionally a little chaotic—think of the sci-fi consoles you want to touch just because they look fun. Each panel lets you shape a part of a techno track: one might control the kick drum's sound, another flips up patterns or effects, and others mess with synths or arpeggiators. I even left some mystery in; part of the fun is just discovering what everything does.`,
  },
  {
    label: "Process",
    body: `Getting all the multiplexers to talk to a single Arduino Pro Micro was a small victory by itself. I had to find out the hard way that you really need to "star" all your grounds together to stop weird interference between the controls. At one point, turning a single knob would cause the others to jump around—super confusing, but also kind of hilarious if you weren't trying to demo it. It took a separate 12V power supply to make things stable enough for everyone to play at once.\n\nMapping the controls in Ableton Live and seeing the software instantly respond to each new knob or button was a genuinely magical moment.`,
  },
  {
    label: "User Experience",
    body: `Most folks had no idea what each button or knob was supposed to do, but that became part of the fun. There was a lot of laughter and experimentation, and it turned into a kind of social game. Even though it's still very much a prototype, the core idea came through: make music playful and accessible, even if you have no clue what you're doing.\n\nIf I keep developing this, I'd want to make each panel's role even clearer, but for now I'm happy it made people want to sit down and just mess with sound together.`,
  },
];

const SKILLS: string[] = [
  "Arduino Pro Micro (ATmega32U4, native USB MIDI)",
  "Electronics",
  "Soldering",
  "Ableton Live",
  "Resolume",
  "Fusion 360",
  "3D Printing",
];

const VIDEOS = [
  { videoId: "UpqdW8SwsuE", aspect: 30 / 17 },
  { videoId: "FB9Jetnj4mQ", aspect: 30 / 26 },
];

const navLinks = [
  { href: "/",          label: "Home",     colorClass: "text-white" },
  { href: "/#projects", label: "Projects", colorClass: "text-white" },
  { href: "/about",     label: "About",    colorClass: "text-white" },
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
          {VIDEOS.map(({ videoId, aspect }) => (
            <div key={videoId} className="w-full rounded-lg overflow-hidden" style={{ aspectRatio: aspect }}>
              <VideoPlayer videoId={videoId} />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
