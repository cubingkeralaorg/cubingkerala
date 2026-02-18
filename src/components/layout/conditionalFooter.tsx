"use client";

import { usePathname } from "next/navigation";
import CubingKeralaFooter from "./footer";

const HIDE_FOOTER_ROUTES: string[] = [];

export function ConditionalFooter() {
  const pathname = usePathname();
  
  if (HIDE_FOOTER_ROUTES.includes(pathname)) {
    return null;
  }
  
  return <CubingKeralaFooter />;
}
