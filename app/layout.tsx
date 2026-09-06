import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Newsreader } from "next/font/google";
import Nav from "../components/nav";
import Script from "next/script";


const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loquent Playground",
  description: "Interactive programming playground for Loquent, a literary-themed language. Loquent is an interpreted language built using Java, and its syntax resembles historic, purple-prose literature.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script src="https://cjrtnc.leaningtech.com/4.3/loader.js" strategy="beforeInteractive" />
        < Nav />
        {children}
      </body>
    </html>
  );
}
