import type { APIRoute } from "astro";
import { createSuccessResponse } from "@/lib/api/response";

export const POST: APIRoute = ({ cookies }) => {
  cookies.delete("userInfo", { path: "/" });
  const response = createSuccessResponse({ message: "Logged out successfully" });
  // Belt-and-suspenders freshness, not a security fix (logged-in requests
  // are never cached — see worker.ts — so there's no logged-in page for
  // logout to "leave behind"). But public data can change while logged in
  // (e.g. joining as a member), and an anonymous page cached from before
  // that would otherwise keep showing the old state for up to its TTL.
  // This clears it right away instead of waiting that out.
  response.headers.set("Clear-Site-Data", '"cache"');
  return response;
};
