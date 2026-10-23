import { Newsreader, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { clinic, siteUrl } from "@/config/clinic";

const display = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${clinic.name} | ${clinic.tagline}`, template: `%s | ${clinic.name}` },
  description: "Modern, patient-focused family healthcare in Patna with simple online appointment booking. Demo website.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen">
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
