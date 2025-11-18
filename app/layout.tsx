import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
/* Font Imports */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
/* Mono Font Import */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
/* Metadata for the App */
export const metadata: Metadata = {
  title: 'Interactive CAPTCHA App - MELDCX',
  description:
    'An interactive CAPTCHA application built with Next.js and React.',
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
        {children}
      </body>
    </html>
  );
}
