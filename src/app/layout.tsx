import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";

import { Providers } from "@/components/providers/main-providers";
import { AppShell } from "@/components/layout/app-shell";

import "./globals.css";

const headingFont = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BetDay — Tu casa de apuestas",
  description: "Simulador de apuestas deportivas 1X2 con cuotas en tiempo real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='es'
      suppressHydrationWarning
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body className='min-h-full'>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
