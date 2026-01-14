import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claude en Pañales",
  description: "Comparte tu equipo Claude",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Claude en Pañales",
    description: "Comparte tu equipo Claude",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Claude en Pañales",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude en Pañales",
    description: "Comparte tu equipo Claude",
    images: ["/og-twitter.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
