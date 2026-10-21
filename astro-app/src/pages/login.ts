import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

// Ported from the Next.js app's src/app/login/route.ts. `url.origin` is
// Astro's own resolution of the incoming request's scheme+host — equivalent
// to the original's manual `host`/`x-forwarded-proto` header read, just
// built in.
export const GET: APIRoute = ({ url }) => {
  const redirectUri = encodeURIComponent(`${url.origin}/api/auth/callback`);
  const authorizationUrl = `https://www.worldcubeassociation.org/oauth/authorize?client_id=${env.CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=public`;

  return new Response(null, {
    status: 302,
    headers: { Location: authorizationUrl },
  });
};
