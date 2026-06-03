import "./globals.css";
import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { TopLoader } from "@/components/TopLoader";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "RENACE",
    template: "%s · RENACE"
  },
  description: "Tu proceso de recuperación, paso a paso.",
  applicationName: "RENACE",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon-192.svg" }]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RENACE"
  },
  formatDetection: { telephone: false }
};

export const viewport: Viewport = {
  themeColor: "#0F6E56",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={manrope.className}>
      <body>
        <Suspense fallback={null}>
          <TopLoader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
