import type { Metadata } from "next";
import { Bebas_Neue, Barlow_Condensed, Barlow } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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
            baseTheme: dark,
            layout: {
              unsafe_disableDevelopmentModeWarnings: true,
            },
            variables: {
              colorPrimary: '#FF4500',
              colorBackground: '#1A1A1A',
              colorText: '#F5F0EB',
              colorTextOnPrimaryBackground: '#FFFFFF',
              colorTextSecondary: '#A1A1AA',
              colorInputBackground: '#2A2A2A',
              colorInputText: '#F5F0EB',
              colorDanger: '#FF4500',
              colorSuccess: '#FFB347',
              colorWarning: '#FF8C00',
            },
            elements: {
              card: "bg-char border border-smoke shadow-2xl overflow-hidden",
              headerTitle: "text-white-app font-bebas text-2xl tracking-wide",
              headerSubtitle: "text-smoke font-barlow",
              socialButtonsBlockButton: "bg-ash border border-smoke text-white-app hover:bg-smoke/20",
              socialButtonsBlockButtonText: "text-white-app font-bold",
              formButtonPrimary: "bg-ember hover:bg-flame text-white-app font-bebas text-xl tracking-widest clip-angled shadow-[0_5px_15px_rgba(255,69,0,0.3)]",
              userButtonBox: "flex-row-reverse",
              userButtonMainIdentifier: "text-white-app font-bebas mr-2",
              userButtonSecondaryIdentifier: "text-smoke font-barlow mr-2",
              userButtonPopoverCard: "bg-ash border border-smoke shadow-2xl",
              userButtonPopoverMainIdentifier: {
                color: "#F5F0EB",
                fontFamily: "var(--font-bebas)",
                fontSize: "1.125rem",
                letterSpacing: "0.025em"
              },
              userButtonPopoverSecondaryIdentifier: {
                color: "#A1A1AA",
                fontFamily: "var(--font-barlow)"
              },
              userButtonPopoverActionButton: {
                color: "#F5F0EB",
                transition: "all 0.2s ease"
              },
              userButtonPopoverActionButtonText: {
                color: "#F5F0EB",
                fontFamily: "var(--font-barlow)",
                fontWeight: "700"
              },
              userButtonPopoverActionButtonIcon: {
                color: "#FF4500"
              },
              userButtonPopoverFooter: "hidden",
              userProfilePage: "bg-char text-white-app",
              profileSectionTitleText: "text-white-app font-bebas text-xl border-b border-smoke/20 pb-2 uppercase tracking-wider",
              profileSectionSubtitleText: "text-smoke font-barlow",
              profileSectionPrimaryButton: "text-ember hover:text-white-app font-bold transition-colors",
              profileSectionContentText: "text-white-app",
              navbarButton: "text-smoke hover:text-white-app hover:bg-ember/10 font-bebas tracking-widest px-4 py-2 rounded-none transition-all",
              userPreviewMainIdentifier: { color: "#F5F0EB" },
              userPreviewSecondaryIdentifier: { color: "#A1A1AA" },
              identityPreviewText: "text-white-app font-bold",
              identityPreviewEditButtonIcon: "text-ember",
              connectedAccountsTitle: "text-white-app font-bebas",
              badge: "bg-ember/20 text-ember border-ember/30",
              formResendCodeLink: "text-ember hover:text-white-app",
              formFieldAction: "text-ember hover:text-white-app",
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
