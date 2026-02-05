import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Redirect direct access to API and Auth routes
    if (pathname.startsWith('/api')) {
        const isDirectNavigation = request.headers.get('sec-fetch-dest') === 'document' || 
                                  request.headers.get('accept')?.includes('text/html');

        if (isDirectNavigation) {
            // Allow login route
            if (pathname === '/api/auth/login') {
                return NextResponse.next();
            }

            // Allow callback if it has a code
            if (pathname === '/api/auth/callback') {
                const code = request.nextUrl.searchParams.get("code");
                if (code) {
                    return NextResponse.next();
                }
            }

            // Redirect all other direct API access to home
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    const cookies = request.cookies;
    const user = cookies.get("userInfo");

    if (!user) {
        if (pathname.startsWith('/requests')) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }

    let userData;
    try {
        userData = JSON.parse(user?.value);        
    } catch (error) {
        console.error("Error parsing userInfo cookie:", error);
        return NextResponse.redirect(new URL("/error", request.url));
    }

    if (pathname.startsWith('/requests')) {
        if (userData.me.wca_id === "2017JOHN14") {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/error", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/requests', '/requests/:path*', '/api/:path*']
};
