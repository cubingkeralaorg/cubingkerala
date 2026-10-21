import { z } from "zod";

export const wcaIdSchema = z.object({
  wcaid: z.string().min(1, "WCA ID is required"),
});

export const requestInfoSchema = z.object({
  wcaid: z.string().min(1, "WCA ID is required"),
  name: z.string().min(1, "Name is required"),
  avatarUrl: z.string().optional(),
  country: z.string().optional(),
  gender: z.string().optional(),
  role: z.string().optional(),
});

export const userProfileUpdateSchema = z.object({
  // null clears the email (e.g. "remove email" in the footer's email
  // control) — undefined/omitted leaves it unchanged, a valid email string
  // sets it. Empty string isn't accepted; use null to clear.
  email: z.string().email().nullable().optional(),
  emailConsent: z.boolean().optional(),
});

/** Official WCA person IDs: 4-digit year + 4 letters + 2-digit suffix (e.g. 2023TEST01). */
export const adminAddMemberSchema = z.object({
  wcaid: z.string().regex(/^[0-9]{4}[A-Z]{4}[0-9]{2}$/, "Must be a valid WCA ID (e.g. 2023TEST01)"),
  role: z.enum(["member", "organiser", "co-founder"]).default("member"),
});

/** Validates just the alt-text field from a multipart photo upload — the file itself is checked separately (type/size), since zod doesn't validate File objects. */
export const photoUploadMetaSchema = z.object({
  alt: z.string().trim().min(1, "Alt text is required").max(200),
});

export const photoDeleteSchema = z.object({
  id: z.string().min(1, "Photo id is required"),
});

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
