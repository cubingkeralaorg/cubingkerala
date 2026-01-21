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
        const updatedRequest: RequestInfo = await request.json();

        // Validate request data
        if (!updatedRequest || !updatedRequest.wcaid || !updatedRequest.name) {
            return NextResponse.json({ message: 'Request is required and must include wcaid and name' }, { status: 400 });
        }

        // Create or update member in the database
        const updatedMember = await db.members.create({
            data: {
                wcaid: updatedRequest.wcaid,
                name: updatedRequest.name,
                avatarUrl: updatedRequest.avatarUrl,
                country: updatedRequest.country,
                gender: updatedRequest.gender,
                role: updatedRequest.role,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        // Check if the member was created successfully
        if (!updatedMember) {
            return NextResponse.json({ message: 'Error updating the request' }, { status: 404 });
        }

        // Delete the request from the database
        await db.requests.delete({
            where: {
                wcaid: updatedRequest.wcaid,
            },
        });

        // Revalidate the path to ensure fresh data
        revalidatePath('/');

        // Create response with cache control headers
        const response = NextResponse.json({ message: 'Request updated successfully' }, { status: 200 });
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;

    } catch (error) {
        console.error('Error details:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}