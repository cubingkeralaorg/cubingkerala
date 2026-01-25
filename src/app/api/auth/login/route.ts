import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.CLIENT_ID as string;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/callback`);

  const authorizationUrl = `https://www.worldcubeassociation.org/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=public`;

  return NextResponse.redirect(authorizationUrl);
}
