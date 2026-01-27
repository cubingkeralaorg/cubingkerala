import { NextRequest, NextResponse } from "next/server";

function getBaseUrl(): string {
  // Use localhost in development
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // Use NEXT_PUBLIC_BASE_URL from .env if available
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Fallback to localhost for development
  return "http://localhost:3000";
}

export async function GET(req: NextRequest) {
  const clientId = process.env.CLIENT_ID as string;
  // Dynamically detect base URL from request
  const baseUrl = getBaseUrl();
  const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/callback`);

  const authorizationUrl = `https://www.worldcubeassociation.org/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=public`;

  return NextResponse.redirect(authorizationUrl);
}
