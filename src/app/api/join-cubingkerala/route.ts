import { NextRequest, NextResponse } from 'next/server';
import { UserInfo } from '@/types/types';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {

    const cookies = request.cookies;
    const user = cookies.get("userInfo");

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userInfo: UserInfo = await request.json();

        if (!userInfo) {
            return NextResponse.json({ message: 'User info is required' }, { status: 400 });
        }

        // Check if request is already submitted
        const existingRequest = await db.requests.findUnique({
            where: {
                wcaid: userInfo.me.wca_id
            }
        });

        if (existingRequest) {
            return NextResponse.json({ message: 'Request already submitted' }, { status: 400 });
        }

        // Check if user is already a member
        const existingMember = await db.members.findUnique({
            where: {
                wcaid: userInfo.me.wca_id,
            },
        });

        if (existingMember) {
            return NextResponse.json({ message: 'Already a member' }, { status: 400 });
        }

        // Add the userInfo to the requests table
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

        revalidatePath('/');

        return NextResponse.json({ message: 'Request submitted successfully', request: newRequest });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}