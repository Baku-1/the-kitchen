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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
  ? (process.env.NEXT_PUBLIC_SITE_URL.startsWith('http') ? process.env.NEXT_PUBLIC_SITE_URL : `https://${process.env.NEXT_PUBLIC_SITE_URL}`)
  : "https://the-kitchen-one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "The Kitchen | Rap Battle Platform",
    template: "%s | The Kitchen",
  },
  description: "If you can't take the heat, get out of the kitchen. Live, scheduled, peer-to-peer rap battle platform.",
  keywords: ["rap battle", "freestyle", "hip hop", "live stream", "clout", "music competition"],
  authors: [{ name: "The Kitchen Team" }],
  creator: "The Kitchen",
  publisher: "The Kitchen",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "The Kitchen",
    title: "The Kitchen | Rap Battle Platform",
    description: "The premium peer-to-peer rap battle platform. Live battles, real clout.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Kitchen - Rap Battle Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Kitchen | Rap Battle Platform",
    description: "The premium peer-to-peer rap battle platform. Live battles, real clout.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
              headerTitle: { color: "#F5F0EB", fontFamily: "var(--font-bebas-neue)", fontSize: "1.5rem", letterSpacing: "0.05em" },
              headerSubtitle: { color: "#A1A1AA", fontFamily: "var(--font-barlow)" },
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
              rootBox: { color: "#F5F0EB" },
              pageScrollBox: { backgroundColor: "#1A1A1A" },
              page: { backgroundColor: "#1A1A1A", color: "#F5F0EB" },
              userProfilePage: "bg-char text-white-app",
              profilePage: { backgroundColor: "#1A1A1A", color: "#F5F0EB" },
              profileSectionTitleText: "text-white-app font-bebas text-xl border-b border-smoke/20 pb-2 uppercase tracking-wider",
              profileSectionSubtitleText: "text-smoke font-barlow",
              profileSectionPrimaryButton: "text-ember hover:text-white-app font-bold transition-colors",
              profileSectionContentText: "text-white-app",
              profileSectionContent: { color: "#F5F0EB" },
              formFieldLabel: { color: "#F5F0EB", fontWeight: "600" },
              formFieldInput: { backgroundColor: "#2A2A2A", color: "#F5F0EB", borderColor: "#3A3A3A" },
              formFieldHintText: { color: "#A1A1AA" },
              formFieldSuccessText: { color: "#FFB347" },
              formFieldErrorText: { color: "#FF4500" },
              formFieldWarningText: { color: "#FF8C00" },
              menuButton: { color: "#F5F0EB" },
              menuItem: { color: "#F5F0EB" },
              menuList: { backgroundColor: "#2A2A2A", borderColor: "#3A3A3A" },
              modalContent: { backgroundColor: "#1A1A1A", color: "#F5F0EB" },
              modalBackdrop: { backgroundColor: "rgba(0,0,0,0.8)" },
              navbarButton: "text-smoke hover:text-white-app hover:bg-ember/10 font-bebas tracking-widest px-4 py-2 rounded-none transition-all",
              navbarMobileMenuButton: { color: "#F5F0EB" },
              navbar: { backgroundColor: "#1A1A1A", borderColor: "#3A3A3A" },

              userPreviewMainIdentifier: { color: "#F5F0EB" },
              userPreviewSecondaryIdentifier: { color: "#A1A1AA" },
              identityPreviewText: "text-white-app font-bold",
              identityPreviewEditButtonIcon: "text-ember",
              accordionTriggerButton: { color: "#F5F0EB" },
              accordionContent: { color: "#F5F0EB", backgroundColor: "#1A1A1A" },
              connectedAccountsTitle: "text-white-app font-bebas",
              badge: "bg-ember/20 text-ember border-ember/30",
              formResendCodeLink: "text-ember hover:text-white-app",
              formFieldAction: "text-ember hover:text-white-app",
              footerAction: { color: "#A1A1AA" },
              footerActionLink: { color: "#FF4500" },
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
