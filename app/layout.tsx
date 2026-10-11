import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OilTrade India | B2B raw materials",
  description: "Verified industrial procurement for India’s oil supply chain."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
