import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BillingProvider } from "@/components/Billing";
import { RevealScript } from "@/components/Reveal";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wynback: win back your past car buyers",
  description:
    "AI-personalised emails that reach every customer a UK independent dealer has sold a car to, at the ownership milestones that bring them back.",
};

export const viewport: Viewport = {
  themeColor: "#fafafc",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={poppins.variable}>
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
