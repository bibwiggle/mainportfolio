import type { Metadata } from "next";
import "./globals.css";
import { poppins, jersey_15 } from "@/fonts";

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
      <body className={`${poppins.className} ${jersey_15.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}