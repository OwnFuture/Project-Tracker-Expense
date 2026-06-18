import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Student Expense Tracker",
  description: "Manage your money wisely",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <head>
        {/* Load public/style.css */}
        <link rel="stylesheet" href="/style.css" />
      </head>

      <body className="antialiased bg-background text-foreground">
        {children}

        {/* Load public/script.js safely */}
        <Script src="/script.js" strategy="afterInteractive" />

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
