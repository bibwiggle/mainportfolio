import * as React from "react"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  gifUrl: string
  link: string
}

interface ProjectCardProps {
  project: Project
}

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

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
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <Link href={project.link} passHref>
      <Card 
        className="w-full h-full cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
<div className="absolute inset-0">
  <Image
    src={isHovered ? project.gifUrl : project.imageUrl}
    alt={project.title}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover"
  />
</div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
        <div className="relative z-10 flex flex-col justify-end">
          <CardHeader className="text-white">
            <CardTitle className="text-2xl font-bold mb-2">{project.title}</CardTitle>
            <CardDescription className="text-gray-200 h-96">{project.description}</CardDescription>
          </CardHeader>
          <CardFooter className="text-white">
            <p className="text-sm hover:text-primary transition-colors duration-200">
              View Project Details
            </p>
          </CardFooter>
        </div>
      </Card>
    </Link>
  ) 
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-0 lg:grid-cols-3 lg:gap-0 m-0">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }