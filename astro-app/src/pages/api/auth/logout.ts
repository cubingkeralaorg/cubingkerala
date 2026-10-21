import type { APIRoute } from "astro";
import { createSuccessResponse } from "@/lib/api/response";

export const POST: APIRoute = ({ cookies }) => {
  cookies.delete("userInfo", { path: "/" });
  return createSuccessResponse({ message: "Logged out successfully" });
};
