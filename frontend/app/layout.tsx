import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import PWAInstall from "@/components/layout/PWAInstall";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EliteStay Hotel - Luxury Booking in Addis Ababa",
    template: "%s | EliteStay Hotel",
  },
  description:
    "Experience world-class luxury at EliteStay Hotel in Addis Ababa. Book premium rooms, enjoy authentic Ethiopian cuisine, and indulge in 5-star hospitality.",
  keywords: [
    "hotel",
    "luxury hotel",
    "Addis Ababa",
    "Ethiopia",
    "booking",
    "EliteStay",
    "5-star hotel",
  ],
  authors: [{ name: "EliteStay Hotel" }],
  creator: "EliteStay Hotel",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "EliteStay Hotel",
    title: "EliteStay Hotel - Luxury Booking in Addis Ababa",
    description:
      "Experience world-class luxury at EliteStay Hotel in Addis Ababa.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EliteStay Hotel",
    description:
      "Luxury hotel booking in Addis Ababa. Book now for the best rates.",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EliteStay",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-[family-name:var(--font-inter)] antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0F172A] text-gray-900 dark:text-gray-100 transition-colors duration-300">
                <Header />
                <main className="min-h-[calc(100vh-160px)]">{children}</main>
                <Footer />
                <PWAInstall />
              </div>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "var(--color-surface-dark, #1E293B)",
                    color: "#fff",
                    borderRadius: "12px",
                    padding: "12px 20px",
                  },
                  success: {
                    iconTheme: {
                      primary: "#D4A853",
                      secondary: "#fff",
                    },
                  },
                }}
              />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
