"use client";

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/app/navBar";
import Footer from "@/components/app/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar /> 
        <div className="pt-16 min-h-screen flex flex-col justify-between">
          <main className="flex-grow">{children}</main> {/* Main content area */}
          <Footer /> {/* Footer will be at the bottom */}
        </div>
      </body>
    </html>
  );
}
