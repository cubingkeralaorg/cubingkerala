import { NextResponse } from "next/server";

/**
 * Standard cache headers for no-cache responses
 */
const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

/**
 * Create a success response with no-cache headers
 */
export function createSuccessResponse(
  data: any,
  status: number = 200,
  additionalHeaders?: Record<string, string>,
): NextResponse {
  const response = NextResponse.json(data, { status });

  Object.entries(NO_CACHE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  if (additionalHeaders) {
    Object.entries(additionalHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

/**
 * Create an error response with no-cache headers
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  additionalData?: Record<string, any>,
): NextResponse {
  return createSuccessResponse({ message, ...additionalData }, status);
}
