import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Footer, Navbar } from "@/components/layout";
import { EmailBanner } from "@/components/layout/email-banner";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { isAdminAccount } from "@/config/admin";

const font = Rubik({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Cubing Kerala",
  description:
    "Cubing Kerala is the official website for the Rubik's Cube community in Kerala, providing resources, event updates, and a platform for enthusiasts to connect.",
};

async function getIsAdmin() {
  const raw = (await cookies()).get("userInfo")?.value;
  if (!raw) return false;
  try {
    return isAdminAccount(JSON.parse(raw)?.me);
  } catch {
    return false;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdmin = await getIsAdmin();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${font.variable} min-h-dvh bg-background font-sans`}
        suppressHydrationWarning
      >
        <Providers>
          <Navbar isAdmin={isAdmin} />
          <EmailBanner />
          <div className="flex flex-1 flex-col">{children}</div>
          <Toaster richColors />
          <Footer isAdmin={isAdmin} />
        </Providers>
      </body>
    </html>
  );
}
