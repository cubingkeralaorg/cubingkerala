import { eq } from "drizzle-orm";
import { requests } from "@/db/schema";
import type { Db } from "@/db/client";
import type { RequestInfo } from "@/types/member";

interface NewRequest {
  wcaid: string;
  name: string;
  avatarUrl: string;
  country: string;
  gender: string;
  role: string;
}

function toRequestInfo(row: typeof requests.$inferSelect): RequestInfo {
  return {
    wcaid: row.wcaid,
    name: row.name,
    avatarUrl: row.avatarUrl,
    country: row.country ?? "",
    gender: row.gender ?? "",
    role: row.role ?? "",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getAllRequests(db: Db): Promise<RequestInfo[]> {
  const rows = await db.select().from(requests);
  return rows.map(toRequestInfo);
}

export async function getRequestByWcaid(db: Db, wcaid: string) {
  const [row] = await db.select().from(requests).where(eq(requests.wcaid, wcaid)).limit(1);
  return row ?? null;
}

export async function createRequest(db: Db, data: NewRequest): Promise<void> {
  const now = new Date();
  await db.insert(requests).values({ ...data, createdAt: now, updatedAt: now });
}

/** Returns true if a row existed and was deleted. */
export async function deleteRequestByWcaid(db: Db, wcaid: string): Promise<boolean> {
  const existing = await getRequestByWcaid(db, wcaid);
  if (!existing) return false;
  await db.delete(requests).where(eq(requests.wcaid, wcaid));
  return true;
}
