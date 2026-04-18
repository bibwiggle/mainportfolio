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
          className="group relative w-full h-[100vh] block overflow-hidden"
        >
          <Image
            src={project.imageUrl}
            alt={project.title}
            quality={85}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="text-white text-2xl font-bold text-center drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              {project.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
