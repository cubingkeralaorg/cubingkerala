import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const response = NextResponse.redirect(new URL('/', req.url));

    // Clear the authToken cookie
    response.cookies.set('authToken', '', { path: '/', maxAge: -1 });

    // Clear the userInfo cookie
    response.cookies.set('userInfo', '', { path: '/', maxAge: -1 });

    return response;
}
