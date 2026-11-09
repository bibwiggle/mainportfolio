import type { Metadata } from "next";
import AnimationStudio from "./Studio";

export const metadata: Metadata = {
  title: "Animation studio — Junu Lee",
  robots: { index: false, follow: false },
};

export default function AnimationPage() {
  return <AnimationStudio />;
}
