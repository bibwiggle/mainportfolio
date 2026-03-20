import type { Metadata, Viewport } from "next";
import "./globals.css";
import { geist } from "@/fonts";

export const metadata: Metadata = {
  title: "Junu Lee",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}