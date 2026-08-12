import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HACKER गोवा HOUSE — Builder Social Card Generator",
    template: "%s | HACKER गोवा HOUSE",
  },
  description:
    "GENERATE YOUR goa गोवा PASS. The official Builder Social Card Generator for HACKER गोवा HOUSE.",
  keywords: [
    "HACKER goa HOUSE",
    "Builder Social Card",
    "Goa Pass",
    "ID card generator",
    "QR verification",
  ],
  openGraph: {
    title: "HACKER गोवा HOUSE — Builder Social Card Generator",
    description:
      "GENERATE YOUR goa गोवा PASS. The official Builder Social Card Generator for HACKER गोवा HOUSE.",
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-canvas">
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
