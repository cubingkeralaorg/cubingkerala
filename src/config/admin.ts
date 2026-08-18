export type AdminIdentity = {
  id?: number;
  wca_id?: string;
};

/** Server-only. Set ADMIN_WCA_ID and/or ADMIN_USER_ID in env — never NEXT_PUBLIC_*. */
export function isAdminAccount(
  user: AdminIdentity | null | undefined,
): boolean {
  if (!user) return false;

  const adminWcaId = process.env.ADMIN_WCA_ID;
  if (adminWcaId && user.wca_id === adminWcaId) {
    return true;
  }

  const adminUserId = process.env.ADMIN_USER_ID;
  if (adminUserId && user.id === Number(adminUserId)) {
    return true;
  }

  return false;
}
