import type { APIRoute } from "astro";
import { createSuccessResponse } from "@/lib/api/response";

// No cache-busting needed here, on this response or the window.location.href
// navigation that follows in navbar.tsx — authenticated pages are served
// `Cache-Control: no-cache` (see worker.ts), never freely-reusable-cached
// in the first place, so there's nothing stale from the logged-in session
// for logout to leave behind. (Login needs real cache-busting, on top of
// that same no-cache rule, because the OPPOSITE direction is unsafe: pages
// cached while anonymous — with a real max-age — can get served straight
// from disk after logging in, no server round trip, no chance to notice
// the cookie changed. See callback.ts.)
export const POST: APIRoute = ({ cookies }) => {
  cookies.delete("userInfo", { path: "/" });
  return createSuccessResponse({ message: "Logged out successfully" });
};
