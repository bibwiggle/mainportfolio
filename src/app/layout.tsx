import type { Metadata } from "next";
import "./globals.css";
import { roboto } from "@/fonts";

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
      <body className={`${roboto.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}