import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CubingKeralaNavbar from "@/components/ck-navbar";
import CubingKeralaFooter from "@/components/ck-footer";
import {Toaster} from 'sonner'
export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cubing Kerala",
  description: "Cubing Kerala is the official website for the Rubik's Cube community in Kerala, providing resources, event updates, and a platform for enthusiasts to connect.",
  icons: {
    icon: "logoblack.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} max-w-screen-xl bg-black mx-auto flex flex-col min-h-screen justify-between`}>
        <CubingKeralaNavbar />
        {children}
        <Toaster richColors/>
        <CubingKeralaFooter />
      </body>
    </html>
  );
}
