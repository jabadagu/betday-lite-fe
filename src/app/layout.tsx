import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";

import { ENV } from "@betday/config/env";
import { AppShell } from "@betday/components/layout";

import "./globals.css";
import { LayoutProviders } from "@betday/providers";

const headingFont = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const appUrl = new URL(ENV.NEXT_PUBLIC_APP_URL);

export const metadata: Metadata = {
  metadataBase: appUrl,
  title: "BetDay — Tu casa de apuestas",
  description: "Casa de apuestas deportivas 1X2 con cuotas en tiempo real",
  applicationName: "BetDay",
  authors: [{ name: "BetDay" }],
  creator: "BetDay",
  publisher: "BetDay",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: appUrl,
    siteName: "BetDay",
    title: "BetDay — Tu casa de apuestas",
    description: "Casa de apuestas deportivas 1X2 con cuotas en tiempo real",
    images: [
      {
        url: "/google-512x512.png",
        width: 512,
        height: 512,
        alt: "BetDay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BetDay — Tu casa de apuestas",
    description: "Casa de apuestas deportivas 1X2 con cuotas en tiempo real",
    images: ["/google-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/logo-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <LayoutProviders>
          <AppShell>{children}</AppShell>
        </LayoutProviders>
      </body>
    </html>
  );
}
