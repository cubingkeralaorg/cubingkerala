import type { AstroCookies } from "astro";
import { isAdminAccount } from "@/config/admin";

/** Shape of the `userInfo` cookie — the raw WCA /api/v0/me response. */
export interface SessionUser {
  me?: { id?: number; wca_id?: string };
}

export function verifyAuth(cookies: AstroCookies): {
  isAuthenticated: boolean;
  user?: SessionUser;
} {
  const userCookie = cookies.get("userInfo");
  if (!userCookie) return { isAuthenticated: false };

  try {
    const user = JSON.parse(userCookie.value) as SessionUser;
    return { isAuthenticated: true, user };
  } catch {
    return { isAuthenticated: false };
  }
}

/** Returns a 401 Response if not authenticated, otherwise null (caller proceeds). */
export function requireAuth(cookies: AstroCookies): Response | null {
  const { isAuthenticated } = verifyAuth(cookies);
  if (!isAuthenticated) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}

/** Logged-in admin only. Use on approve / update / delete member-request routes. */
export function requireAdmin(cookies: AstroCookies): Response | null {
  const authError = requireAuth(cookies);
  if (authError) return authError;

  const { user } = verifyAuth(cookies);
  if (!isAdminAccount(user?.me)) {
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}
