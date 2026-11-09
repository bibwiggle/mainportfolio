"use client";

import dynamic from "next/dynamic";

const Viewer = dynamic(() => import("./Viewer"), { ssr: false });

export default function ModelPreviewPage() {
  return <Viewer />;
}
