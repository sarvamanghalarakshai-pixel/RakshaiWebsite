import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sarvamanghala Rakshai | Divine Protection & Murugan's Blessings",
  description: "Experience divine protection with Sarvamanghala Rakshai. Blessed through sacred Lord Murugan prayers and rituals. Every order includes a personalized Astro Card based on your birth details.",
  keywords: ["Sarvamanghala Rakshai", "Sacred Herbal Paste", "Murugan Prayers", "Astro Card", "Devotional Products", "Spiritual Protection"],
  metadataBase: new URL("https://sarvamanghalarakshai.com"),
  openGraph: {
    title: "Sarvamanghala Rakshai | Divine Protection & Murugan's Blessings",
    description: "Receive divine protection, positivity, and spiritual guidance. Blessed sacred herbal paste + free personalized Astro Card.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-white text-charcoal-dark font-sans-outfit">
        {children}
      </body>
    </html>
  );
}

