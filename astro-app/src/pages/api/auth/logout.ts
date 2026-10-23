import type { APIRoute } from "astro";
import { createSuccessResponse } from "@/lib/api/response";

// This response itself doesn't need any cache-busting — it's a POST, never
// cached. The actual navigation that follows (window.location.href in
// navbar.tsx's logout handler) is what needs to avoid the browser's own
// stale "/" — handled there with the same unique-query-param approach
// callback.ts uses, not here. See worker.ts's auth-aware Cache-Control for
// why "/" can be cached (privately) while logged in in the first place.
export const POST: APIRoute = ({ cookies }) => {
  cookies.delete("userInfo", { path: "/" });
  return createSuccessResponse({ message: "Logged out successfully" });
};
