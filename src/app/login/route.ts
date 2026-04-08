import { NextRequest, NextResponse } from "next/server";

function getBaseUrl(req: NextRequest): string {
  // Get the host from the request headers
  const host = req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") || "http";

  return `${protocol}://${host}`;
}

export async function GET(req: NextRequest) {
  const clientId = process.env.CLIENT_ID as string;

  // Get base URL from the actual request
  const baseUrl = getBaseUrl(req);
  const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/callback`);

  const authorizationUrl = `https://www.worldcubeassociation.org/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=public`;

  return NextResponse.redirect(authorizationUrl);
}
