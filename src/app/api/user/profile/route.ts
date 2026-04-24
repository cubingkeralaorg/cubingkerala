import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAuth, requireAuth } from "@/lib/api";

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  const { user } = verifyAuth(request);
  const wcaid = user?.me?.wca_id;

  if (!wcaid) {
    return NextResponse.json({ message: "Invalid user data" }, { status: 400 });
  }

  try {
    const isMember = await db.members.findUnique({
      where: { wcaid },
    });

    const dbUser = await db.users.findUnique({
      where: { wcaid },
      select: {
        email: true,
        emailConsent: true,
      }
    });

    return NextResponse.json({
      isMember: !!isMember,
      email: dbUser?.email || null,
      emailConsent: dbUser?.emailConsent || false,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  const { user } = verifyAuth(request);
  const wcaid = user?.me?.wca_id;

  if (!wcaid) {
    return NextResponse.json({ message: "Invalid user data" }, { status: 400 });
  }

  try {
    const body = await request.json();
    
    const updateData: any = {};
    if (body.email !== undefined) updateData.email = body.email;
    if (body.emailConsent !== undefined) updateData.emailConsent = body.emailConsent;

    const updatedUser = await db.users.update({
      where: { wcaid },
      data: updateData,
      select: {
        email: true,
        emailConsent: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
