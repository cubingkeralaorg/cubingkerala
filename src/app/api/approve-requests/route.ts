import db from "@/lib/db";
import { RequestInfo } from "@/types/types";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const cookies = request.cookies;
    const user = cookies.get("userInfo");

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const updatedRequest: RequestInfo = await request.json();

        if (!updatedRequest || !updatedRequest.wcaid || !updatedRequest.name) {
            return NextResponse.json({ message: 'Request is required and must include wcaid and name' }, { status: 400 });
        }

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


        if (!updatedMember) {
            return NextResponse.json({ message: 'Error updating the request' }, { status: 404 });
        }

        await db.requests.delete({
            where: {
                wcaid: updatedRequest.wcaid,
            },
        });

        revalidatePath('/');
        return NextResponse.json({ message: 'Request updated successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error details:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}