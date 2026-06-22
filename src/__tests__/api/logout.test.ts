import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/auth/logout/route";

describe("POST /api/auth/logout", () => {
  it("returns 200 JSON and clears auth cookies", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/logout", {
      method: "POST",
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: "Logged out successfully",
    });

    const setCookieHeaders = response.headers.getSetCookie();
    expect(setCookieHeaders.some((header) => header.startsWith("authToken="))).toBe(
      true,
    );
    expect(setCookieHeaders.some((header) => header.startsWith("userInfo="))).toBe(
      true,
    );
  });
});
