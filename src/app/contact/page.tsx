"use client";
import { AnimatedHeader } from "@/components/AnimatedHeader";

export default function contact() {
  const contactLinks = [
    { href: "/", label: "Home", colorClass: "text-white" },
    { href: "/#projects", label: "Projects", colorClass: "text-white" },
    { href: "/about", label: "About", colorClass: "text-white" },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <AnimatedHeader navLinks={contactLinks} />
      <main className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <section>
          <h1 className="text-white text-6xl md:text-7xl lg:text-8xl font-thin tracking-tight leading-[1]">
            Contact
          </h1>
          <p className="mt-8 text-xl text-white/80 max-w-2xl">
            Interested in collaborating, chatting about a project, or just want to say hi?<br /><br />
            I'm always open to new opportunities, creative conversations, and connecting with others who are passionate about design, fabrication, or anything in between.
            <br /><br />
            Reach out anytime:
            <br />
            <span className="block font-mono text-lg mt-2 text-white">
              <a href="mailto:bibw.lab@gmail.com" className="hover:underline">bibw.lab@gmail.com</a>
            </span>
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-white mb-2">Let's connect:</h2>
          <ul className="list-disc list-inside text-white/80 space-y-1 pl-2">
            <li>
              <a href="https://www.linkedin.com/in/junu-lee/" target="_blank" rel="noopener noreferrer" className="hover:underline text-white">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/bib_wig" target="_blank" rel="noopener noreferrer" className="hover:underline text-white">
                Instagram
              </a>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
