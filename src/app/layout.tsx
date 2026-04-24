import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout";
import { ConditionalFooter } from "@/components/layout/conditionalFooter";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { Toaster } from "sonner";
import { Providers } from "./providers/Providers";
import { DataPrefetcher } from "@/components/providers/DataPrefetcher";
export const dynamic = "force-dynamic";

const font = Rubik({ 
  subsets: ["latin"],
  variable: '--font-sans',
});

import { EmailBanner } from "@/components/layout/EmailBanner";

export const metadata: Metadata = {
  title: "Cubing Kerala",
  description:
    "Cubing Kerala is the official website for the Rubik's Cube community in Kerala, providing resources, event updates, and a platform for enthusiasts to connect.",
  icons: {
    icon: "logoblack.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.variable} font-sans bg-background`}>
        <Providers>
          <DataPrefetcher />
          <SplashScreen>
            <Navbar />
            <EmailBanner />
            {children}
            <Toaster richColors />
            <ConditionalFooter />
          </SplashScreen>
        </Providers>
      </body>
    </html>
  );
}

