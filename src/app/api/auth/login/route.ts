import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const clientId = process.env.CLIENT_ID as string;
    // const redirectUri = encodeURIComponent('https://cubingkeralaorg.vercel.app/api/auth/callback');
    const redirectUri = encodeURIComponent('http://localhost:3000/api/auth/callback');

    const authorizationUrl = `https://www.worldcubeassociation.org/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=public`;

    return NextResponse.redirect(authorizationUrl);
}