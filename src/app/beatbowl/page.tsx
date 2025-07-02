"use client";
import React from "react";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import DownscaleBB from "@/public/DownscaleBB.jpg";
import VideoPlayer from "@/components/VideoPlayer";

export default function BeatBowl() {
  // NAVIGATION LINKS
  const navLinks = [
    { href: "/", label: "Home", colorClass: "text-rose-300" },
    { href: "/#projects", label: "Projects", colorClass: "text-fuchsia-300" },
    { href: "/about", label: "About", colorClass: "text-cyan-400" },
    { href: "/contact", label: "Contact", colorClass: "text-emerald-200" },
  ];

  // PROJECT MEDIA — swap paths to your files in /public/
  const images = [
    { src: DownscaleBB, alt: "In use" },
  ];
  const video = { videoId: "UpqdW8SwsuE", type: "video/mp4" };
  const test = { videoId: "FB9Jetnj4mQ", type: "video/mp4"};

  // TOOL LIST
  const tools = [
    "Arduino Pro Micro (ATmega32U4, native USB MIDI)",
    "Multiplexers for analog/digital expansion",
    "Custom wiring and prototyping",
    "Ableton Live MIDI mapping",
    "Fusion 360 (enclosure design)",
    "3D Printing",
    "Ultrasonic distance sensor",
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <AnimatedHeader navLinks={navLinks} />

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {/* TITLE + SUMMARY */}
        <section>
          <h1 className="text-emerald-200 text-6xl font-thin tracking-tight">Beat Bowl</h1>
          <p className="mt-5 text-xl text-gray-200">
          Beat Bowl is a collaborative MIDI instrument built from my love of DJing and VJing—the simple, 
          tactile joy of twisting knobs and sliding faders. I wanted to create something anyone could play, 
          no music background required: just turn a dial or push a button and hear the track change.
          </p>
          <p className="mt-5 text-xl text-gray-200">
          I built it as a four-sided pyramid, so up to four people can crowd around, each with their own 
          playful set of controls. The layout’s intentionally a little chaotic—think of the sci-fi consoles 
          you want to touch just because they look fun. Each panel lets you shape a part of a techno track: 
          one might control the kick drum’s sound, another flips up patterns or effects, and others mess with 
          synths or arpeggiators. I even left some mystery in; part of the fun is just discovering what everything does.
          </p>
        </section>

        {/* MEDIA: VIDEO & IMAGES */}
        <section className="space-y-7">
        <div className="h-fit flex justify-center"
               style={{ aspectRatio: 30/17, maxHeight: "80vh" }}>     
          <VideoPlayer
            videoId={video.videoId}
          />
          </div>
        </section>

        {/* PROCESS DESCRIPTION */}
        <section>
          <h2 className="text-3xl font-light text-emerald-100 mb-3">Process</h2>
          <p className="text-gray-300 leading-relaxed">
          Getting all the multiplexers to talk to a single Arduino Pro Micro was a small 
          victory by itself. I had to find out the hard way that you really need to “star” 
          all your grounds together to stop weird interference between the controls. 
          At one point, turning a single knob would cause the others to jump around—super confusing, 
          but also kind of hilarious if you weren’t trying to demo it. It took a separate 
          12V power supply to make things stable enough for everyone to play at once.
          </p>
          <p className="text-gray-300 leading-relaxed">
          Mapping the controls in Ableton Live and seeing the software instantly 
          respond to each new knob or button was a genuinely magical moment. 
          </p>
        </section>
        <section className="space-y-7">
        <div className="h-fit flex justify-center"
               style={{ aspectRatio: 30/26, maxHeight: "80vh" }}>     
          <VideoPlayer
            videoId={test.videoId}
          />
          </div>
        </section>

        {/* USER EXPERIENCE */}
        <section>
          <h2 className="text-3xl font-light text-emerald-100 mb-3">User Experience</h2>
          <p className="text-gray-300 leading-relaxed">
          Most folks had no idea what each button or knob was supposed to do, but that became part of the fun. 
          There was a lot of laughter and experimentation, and it turned into a kind of social game. Even though 
          it’s still very much a prototype, the core idea came through: make music playful and accessible, 
          even if you have no clue what you’re doing.
          </p>
          <p className="text-gray-300 leading-relaxed">
          If I keep developing this, I’d want to make each panel’s role even clearer, but for now I’m happy 
          it made people want to sit down and just mess with sound together.
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
