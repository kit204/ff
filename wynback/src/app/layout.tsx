import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BillingProvider } from "@/components/Billing";
import { RevealScript } from "@/components/Reveal";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wynback: win back your past car buyers",
  description:
    "AI-personalised emails that reach every customer a UK independent dealer has sold a car to, at the ownership milestones that bring them back.",
};

export const viewport: Viewport = {
  themeColor: "#0f0f0f",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={fraunces.variable}>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <BillingProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </BillingProvider>
        <RevealScript />
      </body>
    </html>
  );
}
