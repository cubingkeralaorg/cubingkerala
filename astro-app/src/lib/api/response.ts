const NO_CACHE_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export function createSuccessResponse(
  data: unknown,
  status: number = 200,
  additionalHeaders?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...NO_CACHE_HEADERS, ...additionalHeaders },
  });
}

export function createErrorResponse(
  message: string,
  status: number = 500,
  additionalData?: Record<string, unknown>,
): Response {
  return createSuccessResponse({ message, ...additionalData }, status);
}
