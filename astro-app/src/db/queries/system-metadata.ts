import { eq } from "drizzle-orm";
import { systemMetadata } from "@/db/schema";
import type { Db } from "@/db/client";

export async function getSystemMetadataValue(db: Db, key: string): Promise<string | null> {
  const [row] = await db.select().from(systemMetadata).where(eq(systemMetadata.key, key)).limit(1);
  return row?.value ?? null;
}

/** Upsert — create the row if the key doesn't exist yet, otherwise update its value. */
export async function setSystemMetadataValue(db: Db, key: string, value: string): Promise<void> {
  const existing = await getSystemMetadataValue(db, key);
  const now = new Date();
  if (existing === null) {
    await db.insert(systemMetadata).values({ key, value, updatedAt: now });
  } else {
    await db.update(systemMetadata).set({ value, updatedAt: now }).where(eq(systemMetadata.key, key));
  }
}
