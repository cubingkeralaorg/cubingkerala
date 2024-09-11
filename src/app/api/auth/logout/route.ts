import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // Create a response object that redirects to the home page
    const response = NextResponse.redirect(new URL('/', req.url));

    // Clear the authToken cookie with the correct delete method signature
    response.cookies.set('authToken', '', { path: '/', maxAge: -1 });

    //clear the userInfo cookie 
    response.cookies.set('userInfo', '', { path: '/', maxAge: -1 })

    return response;
}
