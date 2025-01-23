import type { Metadata } from "next";
import "./globals.css";
import { roboto, montserrat } from "@/fonts";

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
      <body className={`${montserrat.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}