// Stateless, signed unsubscribe tokens — nothing is stored in D1 for this.
// A token is just HMAC-SHA256(wcaid, EMAIL_UNSUBSCRIBE_SECRET), so verifying
// one later just means recomputing it and comparing. WCA IDs are already
// public (visible on every member's profile), so a bare `?wcaid=` link
// would let anyone unsubscribe anyone else — this is what prevents that.

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createUnsubscribeToken(wcaid: string, secret: string): Promise<string> {
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(wcaid));
  return toHex(signature);
}

export async function verifyUnsubscribeToken(wcaid: string, token: string, secret: string): Promise<boolean> {
  const expected = await createUnsubscribeToken(wcaid, secret);
  if (expected.length !== token.length) return false;
  // Constant-time comparison — this is a security token, not a UI diff.
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return mismatch === 0;
}
