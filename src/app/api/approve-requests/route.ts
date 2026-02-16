import db from "@/lib/db";
import { RequestInfo } from "@/types/api";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
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
    const updatedRequest: RequestInfo = await request.json();

    // Validate request data
    if (!updatedRequest || !updatedRequest.wcaid || !updatedRequest.name) {
      return createErrorResponse(
        "Request is required and must include wcaid and name",
        400,
      );
    }

    // Create or update member in the database
    const updatedMember = await db.members.create({
      data: {
        wcaid: updatedRequest.wcaid,
        name: updatedRequest.name,
        avatarUrl: updatedRequest.avatarUrl,
        country: updatedRequest.country,
        gender: updatedRequest.gender,
        role: updatedRequest.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Check if the member was created successfully
    if (!updatedMember) {
      return createErrorResponse("Error updating the request", 404);
    }

    // Delete the request from the database
    await db.requests.delete({
      where: {
        wcaid: updatedRequest.wcaid,
      },
    });

    // Revalidate the path to ensure fresh data
    revalidatePath("/");

    return createSuccessResponse({ message: "Request updated successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
