import { env } from "cloudflare:workers";

export type AdminIdentity = {
  id?: number;
  wca_id?: string;
};

/** Server-only. Set ADMIN_WCA_ID and/or ADMIN_USER_ID as Worker secrets — never PUBLIC_*. */
export function isAdminAccount(user: AdminIdentity | null | undefined): boolean {
  if (!user) return false;

  if (env.ADMIN_WCA_ID && user.wca_id === env.ADMIN_WCA_ID) {
    return true;
  }

  if (env.ADMIN_USER_ID && user.id === Number(env.ADMIN_USER_ID)) {
    return true;
  }

  return false;
}
