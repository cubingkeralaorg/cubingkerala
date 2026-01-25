import { NextRequest, NextResponse } from "next/server";

/**
 * Verify if the request has a valid authentication token
 */
export function verifyAuth(request: NextRequest): {
  isAuthenticated: boolean;
  user?: any;
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
