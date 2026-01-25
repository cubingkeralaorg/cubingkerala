import { NextResponse } from "next/server";
import { createErrorResponse } from "./response";

/**
 * Handle API errors consistently
 */
export function handleApiError(error: any): NextResponse {
  console.error("API Error:", error);

  // Database errors
  if (error.code === "P2002") {
    return createErrorResponse("Resource already exists", 409);
  }

  if (error.code === "P2025") {
    return createErrorResponse("Resource not found", 404);
  }

  // Validation errors
  if (error.name === "ZodError") {
    return createErrorResponse("Validation failed", 400, {
      errors: error.issues,
    });
  }

  // Default error
  return createErrorResponse(
    "Internal server error",
    500,
    process.env.NODE_ENV === "development"
      ? { details: error.message }
      : undefined,
  );
}
