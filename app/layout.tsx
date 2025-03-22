import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NavBar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kolb's Learning Cycle Tracker",
  description: "Track your learning experiences using Kolb's Experiential Learning Cycle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider 
      appearance={{ 
        elements: { 
          footer: "hidden" 
        } 
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={inter.className}>
          <NavBar />
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
