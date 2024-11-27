import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['three'],
};

export default withNextVideo(nextConfig);