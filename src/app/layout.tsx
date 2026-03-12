import type { Metadata } from "next";
import { Bebas_Neue, Barlow_Condensed, Barlow } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
});

const barlow = Barlow({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "The Kitchen | Rap Battle Platform",
  description: "If you can't take the heat, get out of the kitchen. Live, scheduled, peer-to-peer rap battle platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bebasNeue.variable} ${barlowCondensed.variable} ${barlow.variable} antialiased min-h-screen flex flex-col`}>
        <ClerkProvider
          appearance={{
            layout: {
              unsafe_disableDevelopmentModeWarnings: true,
            },
            variables: {
              colorPrimary: '#FF4500',
              colorBackground: '#1A1A1A',
              colorText: '#F5F0EB',
              colorInputBackground: '#2A2A2A',
            }
          }}
        >
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
