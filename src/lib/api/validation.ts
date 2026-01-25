import { z } from "zod";

/**
 * Validation schema for WCA ID
 */
export const wcaIdSchema = z.object({
  wcaid: z.string().min(1, "WCA ID is required"),
});

/**
 * Validation schema for request info
 */
export const requestInfoSchema = z.object({
  wcaid: z.string().min(1, "WCA ID is required"),
  name: z.string().min(1, "Name is required"),
  avatarUrl: z.string().optional(),
  country: z.string().optional(),
  gender: z.string().optional(),
  role: z.string().optional(),
});

/**
 * Validation schema for user info
 */
export const userInfoSchema = z.object({
  me: z.object({
    wca_id: z.string(),
    name: z.string(),
    avatar: z.object({
      url: z.string(),
    }),
    country: z.object({
      name: z.string(),
    }),
    gender: z.string(),
  }),
});

/**
 * Parse and validate request body against a Zod schema
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>,
): Promise<{ success: true; data: T } | { success: false; error: z.ZodError }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
}
