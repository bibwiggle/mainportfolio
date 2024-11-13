import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react'
import VideoBackground from '@/components/VideoBackground'

export default function Page() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <VideoBackground reverseSpeed={false} /> {/* updated usage */}

      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-96 md:py-24 lg:py-32 xl:py-96">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-wider sm:text-4xl md:text-5xl lg:text-6xl/none">
                Hello World YAYYY
                </h1>
                <p className="py-5 mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Digital Experiences | Content Creation | Art Direction
                </p>
              </div>
              <div className="space-x-4">
                <Button variant="destructive">Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>\        <section className="w-full py-96 md:py-24 lg:py-32 xl:py-96">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-wider sm:text-4xl md:text-5xl lg:text-6xl/none">
                Hello World YAYYY
                </h1>
                <p className="py-5 mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Digital Experiences | Content Creation | Art Direction
                </p>
              </div>
              <div className="space-x-4">
                <Button variant="destructive">Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>\        <section className="w-full py-96 md:py-24 lg:py-32 xl:py-96">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-wider sm:text-4xl md:text-5xl lg:text-6xl/none">
                Hello World YAYYY
                </h1>
                <p className="py-5 mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Digital Experiences | Content Creation | Art Direction
                </p>
              </div>
              <div className="space-x-4">
                <Button variant="destructive">Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-96 md:py-24 lg:py-32 xl:py-96">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-wider sm:text-4xl md:text-5xl lg:text-6xl/none">
                Hello World YAYYY
                </h1>
                <p className="py-5 mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Digital Experiences | Content Creation | Art Direction
                </p>
              </div>
              <div className="space-x-4">
                <Button variant="destructive">Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Repeated sections go here... */}
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Acme Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

type MountainIconProps = React.SVGProps<SVGSVGElement>;

function MountainIcon(props: MountainIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
