import db from "@/lib/db";
import { NextRequest } from "next/server";
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
    // Attempt to delete the request from the database
    const deletedRequest = await db.requests.delete({
      where: {
        wcaid: wcaid,
      },
    });

    // Check if the request was found and deleted
    if (!deletedRequest) {
      return createErrorResponse("Request not found", 404);
    }

    return createSuccessResponse({ message: "Request deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
