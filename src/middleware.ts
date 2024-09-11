import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const cookies = request.cookies;
    const user = cookies.get("userInfo");
    

    if (!user) {
        return NextResponse.redirect(new URL("/error", request.url));
    }


    return NextResponse.next();
}


export const config = {
    matcher: ['/requests']
}