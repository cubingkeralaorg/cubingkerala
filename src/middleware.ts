import { NextRequest, NextResponse } from "next/server";
import { ADMIN_USER_ID } from "./config/navigation.config";

const VALID_ROUTES = [
    '/competitions',
    '/rankings',
    '/members',
    '/learn',
    '/login',
    '/requests',
    '/sitemap'
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Catch-all redirect for unknown routes
    const isHomePage = pathname === '/';
    const isNextInternal = pathname.startsWith('/_next');
    const isFile = pathname.includes('.');
    const isApiRoute = pathname.startsWith('/api');
    const isValidRoute = VALID_ROUTES.some(route => 
        pathname === route || pathname.startsWith(route + '/')
    );

    if (!isHomePage && !isNextInternal && !isValidRoute && !isFile && !isApiRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect direct access to API and Auth routes
    if (pathname.startsWith('/api')) {
        const isDirectNavigation = request.headers.get('sec-fetch-dest') === 'document' || 
                                  request.headers.get('accept')?.includes('text/html');

        if (isDirectNavigation) {
            // Allow callback if it has a code (OAuth flow)
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
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    let userData;
    try {
        userData = JSON.parse(user?.value);        
    } catch (error) {
        console.error("Error parsing userInfo cookie:", error);
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith('/requests')) {
        if (userData.me.id === ADMIN_USER_ID || userData.me.wca_id === "2017JOHN14") {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next (internal Next.js paths)
         * - favicon.ico (favicon file)
         * - common static files
         */
        '/((?!_next|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.txt$).*)',
    ],
};
