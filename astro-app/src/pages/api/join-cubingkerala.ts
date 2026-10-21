import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getDb } from "@/db/client";
import { getMemberByWcaid } from "@/db/queries/members";
import { getRequestByWcaid, createRequest } from "@/db/queries/requests";
import { requireAuth, verifyAuth } from "@/lib/api/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/api/response";

// Deliberate contract change from the old Next.js route: that one took the
// user's info as a client-POSTed body, trusting the client to accurately
// describe itself (requireAuth only checked that *some* valid session
// existed, not that the posted body matched it). This reads identity from
// the already-verified `userInfo` cookie instead — no body needed, and a
// user can only ever request membership as themselves.
export const POST: APIRoute = async ({ cookies }) => {
  const authError = requireAuth(cookies);
  if (authError) return authError;

  const { user } = verifyAuth(cookies);
  const wcaid = user?.me?.wca_id;
  if (!wcaid) {
    return createErrorResponse("Invalid session", 400);
  }

  try {
    const db = getDb(env.DB);

    const existingRequest = await getRequestByWcaid(db, wcaid);
    if (existingRequest) {
      return createErrorResponse("Request already submitted", 400);
    }

    const existingMember = await getMemberByWcaid(db, wcaid);
    if (existingMember) {
      return createErrorResponse("Already a member", 400);
    }

    // Re-read the full cookie to get name/avatar/country/gender — verifyAuth
    // only types the admin-check-relevant subset.
    const fullUser = JSON.parse(cookies.get("userInfo")!.value) as {
      me: { wca_id: string; name: string; avatar: { url: string }; country: { name: string }; gender: string };
    };

    await createRequest(db, {
      wcaid,
      name: fullUser.me.name,
      avatarUrl: fullUser.me.avatar.url,
      country: fullUser.me.country.name,
      gender: fullUser.me.gender,
      role: "member",
    });

    return createSuccessResponse({ message: "Request submitted successfully" });
  } catch (error) {
    console.error("join-cubingkerala error:", error);
    return createErrorResponse("Internal server error", 500);
  }
};
