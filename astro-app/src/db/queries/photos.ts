import { asc, eq } from "drizzle-orm";
import { photos } from "@/db/schema";
import type { Db } from "@/db/client";

export interface PhotoRecord {
  id: string;
  path: string;
  alt: string;
}

function toPhotoRecord(row: typeof photos.$inferSelect): PhotoRecord {
  return { id: row.id, path: row.path, alt: row.alt };
}

export async function getAllPhotos(db: Db): Promise<PhotoRecord[]> {
  const rows = await db.select().from(photos).orderBy(asc(photos.createdAt));
  return rows.map(toPhotoRecord);
}

export async function createPhoto(
  db: Db,
  data: { id: string; path: string; alt: string },
): Promise<void> {
  await db.insert(photos).values({ ...data, createdAt: new Date() });
}

/** Returns the deleted row's R2 path (so the caller can remove the object too), or null if no such photo exists. */
export async function deletePhotoById(db: Db, id: string): Promise<string | null> {
  const [row] = await db.select().from(photos).where(eq(photos.id, id)).limit(1);
  if (!row) return null;
  await db.delete(photos).where(eq(photos.id, id));
  return row.path;
}
