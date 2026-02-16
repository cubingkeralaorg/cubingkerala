import { NextRequest } from "next/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { UserInfo } from "@/types/api";
import {
  requireAuth,
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
} from "@/lib/api";

export async function POST(request: NextRequest) {
  // Check authentication
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    // Parse the request body to get the user info
    const userInfo: UserInfo = await request.json();

    // Validate the user info
    if (!userInfo) {
      return createErrorResponse("User info is required", 400);
    }

    // Check if the request is already submitted
    const existingRequest = await db.requests.findUnique({
      where: {
        wcaid: userInfo.me.wca_id,
      },
    });

    if (existingRequest) {
      return createErrorResponse("Request already submitted", 400);
    }

    // Check if the user is already a member
    const existingMember = await db.members.findUnique({
      where: {
        wcaid: userInfo.me.wca_id,
      },
    });

    if (existingMember) {
      return createErrorResponse("Already a member", 400);
    }

    // Create a new request in the database
    const newRequest = await db.requests.create({
      data: {
        wcaid: userInfo.me.wca_id,
        name: userInfo.me.name,
        avatarUrl: userInfo.me.avatar.url,
        country: userInfo.me.country.name,
        gender: userInfo.me.gender,
        role: "member",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Revalidate the path to ensure fresh data
    revalidatePath("/");

    return createSuccessResponse({
      message: "Request submitted successfully",
      request: newRequest,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
