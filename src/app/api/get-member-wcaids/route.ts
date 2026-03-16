import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const members = await db.members.findMany({
      select: {
        wcaid: true,
        name: true,
      },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching member WCA IDs:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
