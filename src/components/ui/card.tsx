// Import necessary modules and components
import * as React from "react"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import Link from 'next/link'

// Define the structure of our project data
interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  gifUrl: string
  link: string
}

// Props that our ProjectCard component will accept
interface ProjectCardProps {
  project: Project
}

// The main Card component
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // Use the cn function to combine default classes with any additional classes passed as props
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

// The CardHeader component for the top section of the card
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // Apply default styles for flex layout and spacing
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// The CardTitle component for the main title of the card
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    // Apply default styles for text size, weight, and spacing
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// The CardDescription component for additional text below the title
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    // Apply default styles for text size and color
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// The CardContent component for the main content area of the card
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

// The CardFooter component for the bottom section of the card
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // Apply default styles for flex layout and padding
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// The ProjectCard component that uses the above Card components
export function ProjectCard({ project }: ProjectCardProps) {
  // State to track whether the card is being hovered over
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    // Wrap the entire card in a Link component for navigation
    <Link href={project.link} passHref>
      <Card 
        // Apply styles for width, cursor, and hover effects
        className="w-full max-w-md mx-auto cursor-pointer transition-all duration-300 hover:shadow-lg"
        // Update hover state on mouse enter/leave
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Use Next.js Image component for optimized image loading */}
          <Image
            // Switch between static image and GIF based on hover state
            src={isHovered ? project.gifUrl : project.imageUrl}
            alt={project.title}
            width={400}
            height={300}
            layout="responsive"
            className="rounded-md"
          />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">Click to view project</p>
        </CardFooter>
      </Card>
    </Link>
  )
}

// The ProjectGrid component to display multiple ProjectCards
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    // Create a responsive grid layout
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* Map through the projects array and render a ProjectCard for each */}
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

// Export all card components for use in other parts of the application
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }