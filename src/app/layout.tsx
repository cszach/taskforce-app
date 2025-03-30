import type { Metadata } from "next";
import { Inter, Funnel_Display } from "next/font/google";
import "@fontsource-variable/funnel-display";
import "@fontsource-variable/inter";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taskforce",
  description: "AI agents for getting things done.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${funnelDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
