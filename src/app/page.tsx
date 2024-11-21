"use client"

// import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


// function VideoBackground() {
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const [playbackRate, setPlaybackRate] = useState(1)

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollPosition = window.scrollY
  //     const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  //     const scrollPercentage = scrollPosition / maxScroll
  //     const newRate = 1 + scrollPercentage * 4 // Adjust this multiplier to change the max speed
  //     setPlaybackRate(newRate)
  //     if (videoRef.current) {
  //       videoRef.current.playbackRate = newRate
  //     }
  //   }

    // window.addEventListener('scroll', handleScroll)
    // return () => window.removeEventListener('scroll', handleScroll)
  // }, [])

  // return (
    // <div className="fixed inset-0 -z-10">
    //   <video
    //     ref={videoRef}
    //     className="w-full h-full object-cover"
    //     src="/DCAreduced.mp4" // Replace with your video file path
    //     autoPlay
    //     loop
    //     muted
    //     playsInline
    //   />
    //   <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
    //     {/* Speed: {playbackRate.toFixed(2)}x */}
    //   </div>
    // </div>
  // )
// }

export default function Page() {

  return (
    <div className="relative min-h-screen overflow-y-scroll no-scrollbar">
          <div className="fixed inset-0 -z-10">
      <video
        className="w-full h-full object-cover"
        src="/DCAsharpn.mp4" // Replace with your video file path
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
        {/* Speed: {playbackRate.toFixed(2)}x */}
      </div>
    </div>
      <div className="flex flex-col min-h-screen relative z-10">
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <Link className="flex items-center justify-center" href="#">
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Projects
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
          <section className="w-full h-screen items-center justify-center content-center"> {/* Welcome section start */}
            <div className="container px-4 md:px-6 mx-auto" style={{ minHeight: 'calc(100vh - 42rem)'}}>
              <div className="flex flex-col items-center text-center">
                <div className="space-y-0 py-10">
                  <h1 className="text-8xl font-bold tracking-widest md:text-8xl lg:text-9xl">
                  Junu Lee
                  </h1>
                  <p className="py-5 mx-auto max-w-[700px] md:text-xl">
                    Digital Experiences | Content Creation | Art Direction
                  </p>
                </div>
              </div>
            </div>
          </section> {/* Welcome section end */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 mx-auto">
              <h2 className="text-3xl font tracking-normal sm:text-5xl text-center mb-12">Projects</h2>
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                <Card>
                  <CardHeader>
                    <CardTitle>Beat Bowl</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sollicitudin magna ac neque porta, nec.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Dancing 단청</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sollicitudin magna ac neque porta, nec.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>VJ clips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sollicitudin magna ac neque porta, nec.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Humidifier sculpture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sollicitudin magna ac neque porta, nec.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Hello World</h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sollicitudin magna ac neque porta, nec.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <form className="flex space-x-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-lg flex-1"
                      placeholder="Enter your email"
                      type="email"
                    />
                    <Button type="submit">Subscribe</Button>
                  </form>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    By subscribing, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </section>
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