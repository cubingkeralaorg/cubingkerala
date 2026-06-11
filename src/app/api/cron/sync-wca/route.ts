import { NextResponse } from "next/server";
import { syncMemberWcaData } from "@/lib/wca.sync";
import { syncCompetitions } from "@/lib/competitions.sync";
import db from "@/lib/db";

export const dynamic = "force-dynamic";
/** Vercel Pro max; full roster sync is chunked across cron runs. */
export const maxDuration = 60;

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
    
    await syncMemberWcaData(wcaIds, {
      timeBudgetMs: 50_000,
      rotateOffset: true,
    });

    console.log(`[Cron] Triggered Competitions Sync`);
    const compSyncResult = await syncCompetitions();

    return NextResponse.json({ success: true, syncedMembers: wcaIds.length, compSyncResult });
  } catch (error) {
    console.error("[Cron] Failed to sync WCA data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
