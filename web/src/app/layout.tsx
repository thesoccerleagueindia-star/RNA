import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { eventConfig } from "@/lib/config";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: eventConfig.title,
  description:
    "Rafa Nadal Academy Clinic India Tour 2027 — organised by ATLETAS INDIAN SPORTS AND ENTERTAINMENT PVT LTD. Clinic registration ₹3,850 inclusive of GST.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>{children}</body>
    </html>
  );
}
