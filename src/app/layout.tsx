import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/components/layout";
import { Toaster } from "sonner";
import { Providers } from "./providers/Providers";
import { DataPrefetcher } from "@/components/providers/DataPrefetcher";
export const dynamic = "force-dynamic";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

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
      <body className={`${inter.variable} font-sans bg-neutral-950`}>
        <Providers>
          <DataPrefetcher />
          <Navbar />
          {children}
          <Toaster richColors />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
