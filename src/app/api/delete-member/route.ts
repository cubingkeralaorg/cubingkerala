import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  validateRequestBody,
  wcaIdSchema,
} from "@/lib/api";

export async function DELETE(request: NextRequest) {
  // Check authentication
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    // Parse and validate request body
    const validation = await validateRequestBody(request, wcaIdSchema);
    if (!validation.success) {
      return createErrorResponse("Invalid request body", 400, {
        errors: validation.error.issues,
      });
    }

    const { wcaid } = validation.data;
    // Attempt to delete the member from the database
    const deletedMember = await db.members.delete({
      where: {
        wcaid: wcaid,
      },
    });

    // Check if the member was found and deleted
    if (!deletedMember) {
      return createErrorResponse("Member not found", 404);
    }

    return createSuccessResponse({ message: "Member deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
