import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Vicky Mosafan | Fullstack Developer",
  description: "Portfolio website of Vicky Mosafan - Fullstack Developer specializing in React, Next.js, Node.js, and modern web technologies.",
  keywords: ["Fullstack Developer", "React", "Next.js", "Node.js", "Web Developer", "Portfolio"],
  authors: [{ name: "Vicky Mosafan" }],
  openGraph: {
    title: "Vicky Mosafan | Fullstack Developer",
    description: "Portfolio website of Vicky Mosafan - Fullstack Developer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
