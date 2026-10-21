import { defineMiddleware } from "astro:middleware";
import { isAdminAccount } from "@/config/admin";

// Ported from the Next.js app's src/middleware.ts. One change: `/_next` →
// `/_astro` (Astro's own build-output path for JS/CSS, the equivalent
// internal-assets prefix).
const VALID_ROUTES = ["/competitions", "/rankings", "/members", "/learn", "/login", "/requests", "/sitemap"];

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  const isHomePage = pathname === "/";
  const isAstroInternal = pathname.startsWith("/_astro");
  const isFile = pathname.includes(".");
  const isApiRoute = pathname.startsWith("/api");
  const isValidRoute = VALID_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

  if (!isHomePage && !isAstroInternal && !isValidRoute && !isFile && !isApiRoute) {
    return context.redirect("/");
  }

  if (isApiRoute) {
    const isDirectNavigation =
      context.request.headers.get("sec-fetch-dest") === "document" ||
      context.request.headers.get("accept")?.includes("text/html");

    if (isDirectNavigation) {
      if (pathname === "/api/auth/callback" && context.url.searchParams.get("code")) {
        return next();
      }
      return context.redirect("/");
    }
  }

  const userCookie = context.cookies.get("userInfo");
  if (!userCookie) {
    if (pathname.startsWith("/requests")) {
      return context.redirect("/");
    }
    return next();
  }

  let userData: { me?: { id?: number; wca_id?: string } };
  try {
    userData = JSON.parse(userCookie.value);
  } catch (error) {
    console.error("Error parsing userInfo cookie:", error);
    return context.redirect("/");
  }

  if (pathname.startsWith("/requests")) {
    if (isAdminAccount(userData.me)) {
      return next();
    }
    return context.redirect("/");
  }

  return next();
});
