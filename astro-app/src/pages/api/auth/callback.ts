import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getDb } from "@/db/client";
import { findOrCreateUser } from "@/db/queries/users";
import { createErrorResponse } from "@/lib/api/response";

// Ported from src/app/api/auth/callback/route.ts, with two deliberate
// changes: the old app also set an `authToken` httpOnly cookie (the raw WCA
// bearer token) alongside `userInfo` — grep confirmed it was never read
// back anywhere in that codebase, so it's dropped here rather than carried
// forward as dead weight. And `userInfo` is now httpOnly itself (the old
// app's version, and this one's until now, wasn't) — every real auth check
// (middleware.ts, requireAuth/requireAdmin) already reads it server-side
// only, and the one client-side reader (useAuth, in Navbar) has been
// replaced with a server-computed isLoggedIn prop from Layout.astro, so
// nothing actually needed JS access to this cookie's contents.
export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get("code");
  if (!code) return redirect("/");

  try {
    const redirectUri = `${url.origin}/api/auth/callback`;

    const tokenResponse = await fetch("https://www.worldcubeassociation.org/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: env.CLIENT_ID,
        client_secret: env.CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code,
      }),
    });
    if (!tokenResponse.ok) {
      return createErrorResponse("Failed to exchange code for token", 500);
    }
    const { access_token, token_type, expires_in } = (await tokenResponse.json()) as {
      access_token: string;
      token_type: string;
      expires_in: number;
    };

    const userInfoResponse = await fetch("https://www.worldcubeassociation.org/api/v0/me", {
      headers: { Authorization: `${token_type} ${access_token}` },
    });
    if (!userInfoResponse.ok) {
      return createErrorResponse("Failed to fetch WCA profile", 500);
    }
    const userInfo = (await userInfoResponse.json()) as {
      me: { wca_id: string; name: string; avatar: { url: string }; country: { name: string }; gender: string };
    };

    const db = getDb(env.DB);
    await findOrCreateUser(db, {
      wcaid: userInfo.me.wca_id,
      name: userInfo.me.name,
      avatarUrl: userInfo.me.avatar.url,
      country: userInfo.me.country.name,
      gender: userInfo.me.gender,
    });

    const expires = new Date(Date.now() + expires_in * 1000);
    cookies.set("userInfo", JSON.stringify(userInfo), {
      path: "/",
      expires,
      httpOnly: true,
      sameSite: "lax", // must survive the top-level redirect back from WCA's OAuth server
      secure: url.protocol === "https:",
    });

    // Anonymous pages are cached in the browser's own HTTP cache for a
    // real TTL (see worker.ts) — without something here, ANY page the
    // browser cached while still logged out (not just "/" — everywhere
    // the visitor clicked before logging in) could keep showing the
    // logged-out navbar/missing-admin-link state after this redirect,
    // since the browser has no way to know the cookie just changed and
    // would serve those cached pages straight from disk, no server round
    // trip at all. That's exactly what a narrower fix (just cache-busting
    // this one redirect's URL) missed: it covered the page landed on
    // right after login, not whatever pages the visitor clicked to next.
    // Clear-Site-Data wipes all of them at once; the unique query param
    // on top is a cheap, redundant guarantee specifically for the one
    // page this redirect lands on, independent of Clear-Site-Data's own
    // timing. Layout.astro strips that param from the address bar right
    // after load either way.
    const response = redirect(`/?__fresh=${Date.now()}`);
    response.headers.set("Clear-Site-Data", '"cache"');
    return response;
  } catch (error) {
    console.error("Auth callback error:", error);
    return createErrorResponse("Failed to exchange code for token", 500);
  }
};
