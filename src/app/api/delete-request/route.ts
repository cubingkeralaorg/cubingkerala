import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    const cookies = request.cookies;
    const user = cookies.get("userInfo");

    // Check for user authorization
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body to get the WCA ID
    const { wcaid } = await request.json();

    // Validate the WCA ID
    if (!wcaid) {
        return NextResponse.json({ message: 'WCA ID is empty!' }, { status: 400 });
    }

    try {
        // Attempt to delete the request from the database
        const deletedRequest = await db.requests.delete({
            where: {
                wcaid: wcaid,
            },
        });

        // Check if the request was found and deleted
        if (!deletedRequest) {
            return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        }

        // Create the response with cache control headers
        const response = NextResponse.json({ message: 'Request deleted successfully' }, { status: 200 });
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error details:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}