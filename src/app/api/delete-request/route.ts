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
        const deletedRequest = await db.requests.delete({
            where: {
                wcaid: wcaid,
            },
        });

        if (!deletedRequest) {
            return NextResponse.json({ message: 'Reqeust not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Request deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error details:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
    
}