import { NextRequest, NextResponse } from 'next/server';
import { UserInfo } from '@/types/types';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    const cookies = request.cookies;
    const user = cookies.get("userInfo");

    // Check for user authorization
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Parse the request body to get the user info
        const userInfo: UserInfo = await request.json();

        // Validate the user info
        if (!userInfo) {
            return NextResponse.json({ message: 'User info is required' }, { status: 400 });
        }

        // Check if the request is already submitted
        const existingRequest = await db.requests.findUnique({
            where: {
                wcaid: userInfo.me.wca_id
            }
        });

        if (existingRequest) {
            return NextResponse.json({ message: 'Request already submitted' }, { status: 400 });
        }

        // Check if the user is already a member
        const existingMember = await db.members.findUnique({
            where: {
                wcaid: userInfo.me.wca_id,
            },
        });

        if (existingMember) {
            return NextResponse.json({ message: 'Already a member' }, { status: 400 });
        }

        // Create a new request in the database
        const newRequest = await db.requests.create({
            data: {
                wcaid: userInfo.me.wca_id,
                name: userInfo.me.name,
                avatarUrl: userInfo.me.avatar.url,
                country: userInfo.me.country.name,
                gender: userInfo.me.gender,
                role: 'member',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        // Revalidate the path to ensure fresh data
        revalidatePath('/');

        // Create the response with cache control headers
        const response = NextResponse.json({ message: 'Request submitted successfully', request: newRequest });
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}