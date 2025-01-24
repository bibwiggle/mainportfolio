import type { Metadata } from "next";
import "./globals.css";
import { exo } from "@/fonts";

export const metadata: Metadata = {
  title: "Junu Lee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${exo.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}