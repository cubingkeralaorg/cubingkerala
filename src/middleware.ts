import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const cookies = request.cookies;
    const user = cookies.get("userInfo");

    if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    let userData;
    try {
        userData = JSON.parse(user?.value);        
    } catch (error) {
        console.error("Error parsing userInfo cookie:", error);
        return NextResponse.redirect(new URL("/error", request.url));
    }

    if (userData.me.wca_id === "2017JOHN14") {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/error", request.url));
}

export const config = {
    matcher: ['/requests']
};
