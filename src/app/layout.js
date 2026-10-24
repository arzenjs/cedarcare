import { Newsreader, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MotionProvider } from "@/components/ui/Reveal";
import { clinic, siteUrl } from "@/config/clinic";

const display = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${clinic.name} | ${clinic.tagline}`, template: `%s | ${clinic.name}` },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }], apple: "/apple-touch-icon.png" },
  description: "Modern, patient-focused family healthcare in Patna with simple online appointment booking. Demo website.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        {/* Scroll/entrance animations start hidden; with JavaScript off, show everything. */}
        <noscript><style>{".reveal{opacity:1!important;transform:none!important}"}</style></noscript>
      </head>
      <body className="min-h-screen">
        <MotionProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
