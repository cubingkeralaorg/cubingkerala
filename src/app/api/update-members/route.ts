import db from "@/lib/db";
import { RequestInfo } from "@/types/api";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const cookies = request.cookies;
    const user = cookies.get("userInfo");

    // Check for user authorization
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Parse the request body to get the updated request data
        const updatedRequest: RequestInfo = await request.json();

        // Validate the request data
        if (!updatedRequest) {
            return NextResponse.json({ message: 'Request is empty!' }, { status: 400 });
        }

        // Update the member in the database
        const updatedMember = await db.members.update({
            where: {
                wcaid: updatedRequest.wcaid,
            },
            data: {
                wcaid: updatedRequest.wcaid,
                name: updatedRequest.name,
                avatarUrl: updatedRequest.avatarUrl,
                country: updatedRequest.country,
                gender: updatedRequest.gender,
                role: updatedRequest.role,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });

        // Check if the member was updated successfully
        if (!updatedMember) {
            return NextResponse.json({ message: 'Error updating the member' }, { status: 404 });
        }

        // Revalidate the path to ensure fresh data
        revalidatePath('/');

        // Create the response with cache control headers
        const response = NextResponse.json({ message: 'Member updated successfully' }, { status: 200 });
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error details:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}