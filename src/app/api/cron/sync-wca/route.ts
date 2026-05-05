import { NextResponse } from "next/server";
import { syncMemberWcaData } from "@/lib/wca.sync";
import { syncCompetitions } from "@/lib/competitions.sync";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Security check: Verify Vercel Cron Secret if hosted on Vercel
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const members = await db.members.findMany({ select: { wcaid: true } });
    const wcaIds = members.map((m) => m.wcaid).filter(Boolean) as string[];

    console.log(`[Cron] Triggered WCA Sync for ${wcaIds.length} members`);
    
    // We await this so Vercel doesn't kill the function early.
    // maxDuration is 300s (5 minutes), which should be enough for a few hundred members at 500ms delay.
    await syncMemberWcaData(wcaIds);

    console.log(`[Cron] Triggered Competitions Sync`);
    const compSyncResult = await syncCompetitions();

    return NextResponse.json({ success: true, syncedMembers: wcaIds.length, compSyncResult });
  } catch (error) {
    console.error("[Cron] Failed to sync WCA data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
