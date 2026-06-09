import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import ChatBotWrapper from "@/components/ChatBotWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "CarbonZero — Track & Reduce Your Carbon Footprint",
  description: "AI-powered platform to understand, track, and reduce your personal carbon footprint through real-time data, personalized insights, and gamification.",
  keywords: ["carbon footprint", "sustainability", "eco", "climate", "green", "AI"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans`} style={{ background: "#0D1117" }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <ChatBotWrapper />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
