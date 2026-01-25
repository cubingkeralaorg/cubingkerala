import db from "@/lib/db";
import { RequestInfo } from "@/types/api";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
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
    // Parse the request body to get the updated request data
    const updatedRequest: RequestInfo = await request.json();

    // Validate the request data
    if (!updatedRequest) {
      return createErrorResponse("Request is empty!", 400);
    }

    // Update the member in the database
    const updatedMember = await db.members.update({
      where: {
        wcaid: updatedRequest.wcaid,
      },
      data: {
        wcaid: updatedRequest.wcaid,
        name: updatedRequest.name,
        avatarUrl: updatedRequest.avatarUrl,
        country: updatedRequest.country,
        gender: updatedRequest.gender,
        role: updatedRequest.role,
        updatedAt: new Date(),
      },
    });

    // Check if the member was updated successfully
    if (!updatedMember) {
      return createErrorResponse("Error updating the member", 404);
    }

    // Revalidate the path to ensure fresh data
    revalidatePath("/");

    return createSuccessResponse({ message: "Member updated successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
