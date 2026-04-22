import Image from "next/image";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  lottieUrl: string;
  link: string;
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-0 lg:grid-cols-3 m-0">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={project.link}
          className="group relative w-full h-[85vh] block overflow-hidden"
        >
          <Image
            src={project.imageUrl}
            alt={project.title}
            quality={85}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400 px-8">
            <h3 className="text-white text-2xl font-bold text-center drop-shadow-lg">
              {project.title}
            </h3>
            {project.description && (
              <p className="text-white/85 text-sm text-center max-w-xs leading-relaxed">
                {project.description}
              </p>
            )}
            <span className="mt-1 text-xs tracking-widest uppercase text-white/60">
              click to see more
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
