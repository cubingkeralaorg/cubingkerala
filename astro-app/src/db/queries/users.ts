import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import type { Db } from "@/db/client";

interface NewWcaUser {
  wcaid: string;
  name: string;
  avatarUrl: string;
  country: string;
  gender: string;
}

/**
 * Ported from the OAuth callback's inline check-then-create — creates a
 * Users row on first login, leaves it untouched on every login after (email/
 * emailConsent are only ever set via the profile endpoint, not here).
 */
export async function findOrCreateUser(db: Db, user: NewWcaUser): Promise<void> {
  const [existing] = await db.select().from(users).where(eq(users.wcaid, user.wcaid)).limit(1);
  if (existing) return;

  const now = new Date();
  await db.insert(users).values({
    wcaid: user.wcaid,
    name: user.name,
    avatarUrl: user.avatarUrl,
    country: user.country,
    gender: user.gender,
    emailConsent: false,
    createdAt: now,
    updatedAt: now,
  });
}

export interface UserProfileFields {
  email: string | null;
  emailConsent: boolean;
}

export async function getUserProfileFields(db: Db, wcaid: string): Promise<UserProfileFields | null> {
  const [row] = await db
    .select({ email: users.email, emailConsent: users.emailConsent })
    .from(users)
    .where(eq(users.wcaid, wcaid))
    .limit(1);
  return row ?? null;
}

export async function updateUserProfile(
  db: Db,
  wcaid: string,
  fields: Partial<UserProfileFields>,
): Promise<UserProfileFields | null> {
  await db.update(users).set({ ...fields, updatedAt: new Date() }).where(eq(users.wcaid, wcaid));
  return getUserProfileFields(db, wcaid);
}
