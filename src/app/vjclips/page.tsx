"use client";
import React from "react";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";

// 1. Define the interface
interface Clip {
  id: number;
  title: string;
  description: string;
  videoId: string;
  aspectRatio: string;
}

// 2. Your data is typed as Clip[]
const clips: Clip[] = [
  { id: 1, title: "Clip Title 1", description: "Description 1", videoId: "J2KjAoztyIA", aspectRatio: "17/30" },
  { id: 2, title: "Clip Title 2", description: "Description 2", videoId: "J2KjAoztyIA", aspectRatio: "17/30" },
  // ... etc
];

// 3. Generic chunk function
function chunkArray<T>(items: T[], numberOfColumns: number): T[][] {
  const columnsArray: T[][] = Array.from({ length: numberOfColumns }, () => []);
  items.forEach((item, index) => {
    columnsArray[index % numberOfColumns].push(item);
  });
  return columnsArray;
}

export default function VJClips() {
  // 4. Distribute the clips into 4 columns
  const columns = chunkArray<Clip>(clips, 4);

  return (
    <div className="relative min-h-screen no-scrollbar bg-gray-900">
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* HEADER */}
        <header className="sticky top-0 z-50 px-4 lg:px-6 h-14 flex items-center backdrop-blur-sm shadow">
          <nav className="mx-auto flex gap-4 sm:gap-6">
            <Link className="text-rose-300 hover:underline" href="/">Home</Link>
            <Link className="text-cyan-400 hover:underline" href="/about">About</Link>
            <Link className="text-emerald-200 hover:underline" href="/contact">Contact</Link>
          </nav>
        </header>

        {/* MAIN */}
        <main className="flex-1">
          <section className="w-full py-10">
            <div className="container px-1 text-left">
              <h1 className="text-emerald-200 text-8xl font-thin tracking-tight leading-[0.8]">
                Explore my collection of real time visuals using resolume
              </h1>
            </div>
          </section>

          {/* 4-column dynamic layout */}
          <section className="w-full py-10">
            <div className="container mx-auto px-4">
              <div className="flex flex-row gap-6">
                {columns.map((column, columnIndex) => (
                  <div key={columnIndex} className="flex flex-col space-y-6 w-1/4">
                    {column.map((clip) => (
                      <div key={clip.id} className="bg-gray-800 rounded-lg p-2">
                        <div
                          className="w-full relative"
                          style={{ aspectRatio: clip.aspectRatio }}
                        >
                          <VideoPlayer videoId={clip.videoId} />
                        </div>
                        <h3 className="text-white font-medium mt-2 text-sm">{clip.title}</h3>
                        <p className="text-gray-400 text-xs text-center">
                          {clip.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
