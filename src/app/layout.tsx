import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolBabes ~ Memory Game",
  description: "SolBabes ~ Memory Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/game/0.png" />
        <link rel="preload" as="image" href="/game/1.png" />
        <link rel="preload" as="image" href="/game/2.png" />
        <link rel="preload" as="image" href="/game/3.png" />
        <link rel="preload" as="image" href="/game/4.png" />
        <link rel="preload" as="image" href="/game/5.png" />
        <link rel="preload" as="image" href="/game/6.png" />
        <link rel="preload" as="image" href="/game/7.png" />
        <link rel="preload" as="image" href="/game/8.png" />
        <link rel="preload" as="image" href="/game/9.png" />
        <link rel="preload" as="image" href="/game/10.png" />
        <link rel="preload" as="image" href="/game/11.png" />
        <link rel="preload" as="image" href="/game/12.png" />
        <link rel="preload" as="image" href="/game/13.png" />
        <link rel="preload" as="image" href="/game/14.png" />
        <link rel="preload" as="image" href="/game/15.png" />
        <link rel="preload" as="image" href="/game/16.png" />
        <link rel="preload" as="image" href="/game/17.png" />
        <link rel="preload" as="image" href="/game/18.png" />
        <link rel="preload" as="image" href="/game/19.png" />
        <link rel="preload" as="image" href="/game/20.png" />
        <link rel="preload" as="image" href="/game/21.png" />
        <link rel="preload" as="image" href="/game/22.png" />
        <link rel="preload" as="image" href="/game/23.png" />
        <link rel="preload" as="image" href="/game/24.png" />
        <link rel="preload" as="image" href="/game/25.png" />
        <link rel="preload" as="image" href="/game/26.png" />
        <link rel="preload" as="image" href="/game/27.png" />
        <link rel="preload" as="image" href="/game/28.png" />
        <link rel="preload" as="image" href="/game/29.png" />
        <link rel="preload" as="image" href="/game/30.png" />
        <link rel="preload" as="image" href="/game/31.png" />
        <link rel="preload" as="image" href="/game/32.png" />
        <link rel="preload" as="image" href="/game/unfound.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
