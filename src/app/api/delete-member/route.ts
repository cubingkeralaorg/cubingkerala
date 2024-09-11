import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(request: NextRequest) {

    const cookies = request.cookies;
    const user = cookies.get("userInfo");

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { wcaid } = await request.json();

    if (!wcaid) {
        return NextResponse.json({ message: 'WCA ID is empty!' }, { status: 400 });
    }

    try {
        const deletedMember = await db.members.delete({
            where: {
                wcaid: wcaid,
            },
        });

        if (!deletedMember) {
            return NextResponse.json({ message: 'Member not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Member deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error details:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
    
}