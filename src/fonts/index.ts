import localFont from "next/font/local";

// Bundled fonts keep production builds independent of Google Fonts downloads.
export const nabla = localFont({
  src: "./nabla-latin.woff2",
  display: "swap",
  weight: "400",
});

export const geist = localFont({
  src: "./geist-latin.woff2",
  display: "swap",
  weight: "100 900",
});
