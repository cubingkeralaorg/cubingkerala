import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createSuccessResponse } from "@/lib/api";

export async function POST(_req: NextRequest) {
  const response = createSuccessResponse({ message: "Logged out successfully" });

  response.cookies.set("authToken", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  response.cookies.set("userInfo", "", {
    path: "/",
    maxAge: 0,
    httpOnly: false,
  });

  revalidatePath("/");
  return response;
}
