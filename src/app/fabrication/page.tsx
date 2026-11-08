import { AnimatedHeader } from "@/components/AnimatedHeader";
import { ProjectGrid } from "@/components/ui/card";
import VideoPlayer from "@/components/VideoPlayer";

const fabricationProjects = [
  {
    id: "spiritual-mercury",
    title: "Spiritual Mercury",
    description: "A kinetic sculpture with reflective forms rotating inside a custom hubless ring.",
    imageUrl: "/assets/SMthumb.png",
    lottieUrl: "",
    link: "/spiritualmercury",
  },
  {
    id: "doki-helmet",
    title: "Doki Helmet",
    description: "A mechanical helmet inspired by Korean folklore and tokusatsu design.",
    imageUrl: "/doki assets/DokiThumb.png",
    lottieUrl: "",
    link: "/dokihelmet",
  },
  {
    id: "dancing-dancheong",
    title: "Dancing Dancheong (단청)",
    description: "A kinetic sculpture reinterpreting Korean decorative painting through motion.",
    imageUrl: "/assets/DDthumb2.png",
    lottieUrl: "/lotties/DDlottie.json",
    link: "/dancingdancheong",
  },
  {
    id: "beat-bowl",
    title: "Beat Bowl",
    description: "A four-sided MIDI instrument designed for four players at once.",
    imageUrl: "/assets/DownscaleBB.jpg",
    lottieUrl: "/lotties/beatbowl.json",
    link: "/beatbowl",
  },
];

const cosplayVideos = [
  { videoId: "CrrJMFowXlE", title: "Katakuri Cosplay" },
  { videoId: "7FKx8tjO4V4", title: "Deathstroke Cosplay" },
];

const navLinks = [
  { href: "/", label: "Home", colorClass: "text-white" },
  { href: "/fabrication", label: "Fabrication", colorClass: "text-white" },
  { href: "/vjclips", label: "Visual Works", colorClass: "text-white" },
  { href: "/contact", label: "Contact", colorClass: "text-white" },
];

export default function Fabrication() {
  return (
    <div className="bg-black text-white min-h-screen">
      <AnimatedHeader navLinks={navLinks} />

      <section className="pt-32 pb-12 px-8">
        <h1 className="text-5xl font-bold tracking-tight mb-6">Fabrication</h1>
        <p className="text-white/50 text-lg leading-relaxed max-w-2xl">
          Kinetic sculpture, mechanical builds, physical computing, and cosplay.
        </p>
      </section>

      <section aria-labelledby="fabrication-projects" className="pb-16">
        <h2 id="fabrication-projects" className="px-8 pb-6 text-3xl font-bold tracking-tight">Projects</h2>
        <ProjectGrid projects={fabricationProjects} />
      </section>

      <section aria-labelledby="cosplay-videos" className="px-8 pb-20">
        <h2 id="cosplay-videos" className="pb-6 text-3xl font-bold tracking-tight">Cosplay</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl">
          {cosplayVideos.map(({ videoId, title }) => (
            <article key={videoId}>
              <div className="overflow-hidden rounded-lg bg-white/5" style={{ aspectRatio: "9 / 16" }}>
                <VideoPlayer videoId={videoId} />
              </div>
              <h3 className="mt-3 text-base font-medium">{title}</h3>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
