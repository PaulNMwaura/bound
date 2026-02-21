import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./Provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon:[{
      url: "/images/favicon.ico",
      href: "/images/favicon.ico",
    }]
  },
  title: "PROCKLIST",
  description: "Procklist is a dynamic platform for independent service providers looking to create and grow their online presence. Whether you're building a side hustle or a full-time career, Procklist helps freelancers market their services effectively and gain visibility on the web. Helping you do what you do, but do it precisely.",
};

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
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* <Analytics/> */}
      </body>
    </html>
  );
}
