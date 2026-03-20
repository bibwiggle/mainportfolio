"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import { createContext, useContext, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type LottieAnimationData = {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
};

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  lottieUrl: string;
  link: string;
}

interface ProjectCardProps {
  project: Project;
}

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

type ProjectCardContextType = {
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
};

const ProjectCardContext = createContext<ProjectCardContextType>({
  activeProjectId: null,
  setActiveProjectId: () => {},
});

const ProjectCardProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  return (
    <ProjectCardContext.Provider value={{ activeProjectId, setActiveProjectId }}>
      {children}
    </ProjectCardContext.Provider>
  );
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { activeProjectId, setActiveProjectId } = useContext(ProjectCardContext);
  const [animationData, setAnimationData] = React.useState<LottieAnimationData | null>(null);
  const lottieRef = React.useRef<LottieRefCurrentProps>(null);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    setIsTouchDevice(
      'ontouchstart' in window || 
      (navigator.maxTouchPoints > 0)
    );
  }, []);
  
  const isActive = activeProjectId === project.id;

  React.useEffect(() => {
    if (isActive && !animationData) {
      fetch(project.lottieUrl)
        .then((response) => response.json())
        .then((data: LottieAnimationData) => setAnimationData(data))
        .catch((error) =>
          console.error("Error loading Lottie animation:", error)
        );
    }
  }, [isActive, animationData, project.lottieUrl]);

  React.useEffect(() => {
    if (isActive && lottieRef.current) {
      lottieRef.current.play();
    } else if (!isActive && lottieRef.current) {
      lottieRef.current.stop();
    }
  }, [isActive]);

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setActiveProjectId(project.id);
    }
  };


  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setActiveProjectId(null);
    }
  };

  const handleTouchStart = () => {
    if (!isActive) {
      setActiveProjectId(project.id);
    }
  };

  return (
    <Link
      href={project.link}
      className="group w-full lg:h-[100vh] h-[100vh] block cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <div className="absolute inset-0">
        {isActive && animationData ? (
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            renderer={"canvas" as "svg"}
            loop={true}
            autoplay={true}
            className="w-full h-full object-cover"
            rendererSettings={{
              preserveAspectRatio: "xMidYMid slice",
              progressiveLoad: true,
            }}
          />
        ) : (
          <Image
            src={project.imageUrl || "/placeholder.svg"}
            alt={project.title}
            quality={100}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div
        className="absolute inset-0 
                   bg-gradient-to-b from-transparent via-black/70 to-black/90 
                   opacity-0 group-hover:opacity-100  // Fade in the gradient
                   transition-[opacity,transform] duration-500 
                   transform translate-y-[30%] group-hover:translate-y-0"
      />

      <div className="relative z-10 flex flex-col justify-center h-full">
        <CardHeader className="text-white items-center text-center">
          <CardTitle
            className="text-7xl font-bold mb-4 transform transition-all duration-500 
                       group-hover:-translate-y-20 group-hover:mb-8
                       drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
          >
            {project.title}
          </CardTitle>
          <CardDescription
            className="text-gray-200 opacity-0 group-hover:opacity-100 
            transform transition-all duration-500 group-hover:-translate-y-20
            text-lg"
          >
            {project.description}
          </CardDescription>
        </CardHeader>
      </div>
    </Link>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ProjectCardProvider>
      <div className="grid gap-0 lg:grid-cols-3 m-0">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </ProjectCardProvider>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
