import { NextRequest, NextResponse } from "next/server";
import { isAdminAccount } from "@/config/admin";

/**
 * Verify if the request has a valid authentication token
 */
export function verifyAuth(request: NextRequest): {
  isAuthenticated: boolean;
  user?: { me?: { id?: number; wca_id?: string } };
} {
  const userCookie = request.cookies.get("userInfo");

  if (!userCookie) {
    return { isAuthenticated: false };
  }

  try {
    const user = JSON.parse(userCookie.value);
    return { isAuthenticated: true, user };
  } catch {
    return { isAuthenticated: false };
  }
}

/**
 * Middleware to check authentication and return 401 if not authenticated
 */
export function requireAuth(request: NextRequest): NextResponse | null {
  const { isAuthenticated } = verifyAuth(request);

  if (!isAuthenticated) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return null;
}

/** Logged-in admin only. Use on approve / update / delete member-request routes. */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const authError = requireAuth(request);
  if (authError) return authError;

  const { user } = verifyAuth(request);
  if (!isAdminAccount(user?.me)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  return null;
}
