import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import {
  verifyAuth,
  requireAuth,
} from '@/lib/api/auth';
import {
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/api/response';
import { handleApiError } from '@/lib/api/error-handler';
import {
  wcaIdSchema,
  requestInfoSchema,
  userInfoSchema,
  validateRequestBody,
} from '@/lib/api/validation';

// Mock NextResponse
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server');
  return {
    ...actual,
    NextResponse: {
      json: vi.fn((data, options) => ({
        status: options?.status || 200,
        json: async () => data,
        headers: new Map([
          ['Cache-Control', 'no-store, no-cache, must-revalidate'],
          ['Pragma', 'no-cache'],
          ['Expires', '0'],
        ]),
      })),
    },
  };
});

describe('API Utilities', () => {
  describe('verifyAuth', () => {
    it('should return false when no userInfo cookie exists', () => {
      const request = {
        cookies: {
          get: vi.fn().mockReturnValue(undefined),
        },
      } as unknown as NextRequest;

      const result = verifyAuth(request);

      expect(result.isAuthenticated).toBe(false);
      expect(result.user).toBeUndefined();
    });

    it('should return true with user when valid cookie exists', () => {
      const userInfo = { me: { wca_id: '2020TEST01', name: 'Test User' } };
      const request = {
        cookies: {
          get: vi.fn().mockReturnValue({ value: JSON.stringify(userInfo) }),
        },
      } as unknown as NextRequest;

      const result = verifyAuth(request);

      expect(result.isAuthenticated).toBe(true);
      expect(result.user).toEqual(userInfo);
    });

    it('should return false when cookie contains invalid JSON', () => {
      const request = {
        cookies: {
          get: vi.fn().mockReturnValue({ value: 'invalid-json' }),
        },
      } as unknown as NextRequest;

      const result = verifyAuth(request);

      expect(result.isAuthenticated).toBe(false);
    });
  });

  describe('requireAuth', () => {
    it('should return null when authenticated', () => {
      const userInfo = { me: { wca_id: '2020TEST01' } };
      const request = {
        cookies: {
          get: vi.fn().mockReturnValue({ value: JSON.stringify(userInfo) }),
        },
      } as unknown as NextRequest;

      const result = requireAuth(request);

      expect(result).toBeNull();
    });

    it('should return 401 response when not authenticated', async () => {
      const request = {
        cookies: {
          get: vi.fn().mockReturnValue(undefined),
        },
      } as unknown as NextRequest;

      const result = requireAuth(request);

      expect(result).not.toBeNull();
      const data = await result?.json();
      expect(data.message).toBe('Unauthorized');
    });
  });

  describe('createSuccessResponse', () => {
    it('should create response with default status 200', () => {
      const response = createSuccessResponse({ data: 'test' });

      expect(response.status).toBe(200);
    });

    it('should create response with custom status', () => {
      const response = createSuccessResponse({ data: 'test' }, 201);

      expect(response.status).toBe(201);
    });

    it('should include no-cache headers', () => {
      const response = createSuccessResponse({ data: 'test' });

      expect(response.headers.get('Cache-Control')).toBe(
        'no-store, no-cache, must-revalidate'
      );
    });
  });

  describe('createErrorResponse', () => {
    it('should create error response with message', async () => {
      const response = createErrorResponse('Something went wrong', 400);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Something went wrong');
    });

    it('should include additional data when provided', async () => {
      const response = createErrorResponse('Validation error', 400, {
        errors: ['field is required'],
      });
      const data = await response.json();

      expect(data.errors).toEqual(['field is required']);
    });
  });

  describe('handleApiError', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should handle P2002 duplicate key error', async () => {
      const error = { code: 'P2002' };
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.message).toBe('Resource already exists');
    });

    it('should handle P2025 not found error', async () => {
      const error = { code: 'P2025' };
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe('Resource not found');
    });

    it('should handle ZodError', async () => {
      const error = {
        name: 'ZodError',
        issues: [{ path: ['field'], message: 'Required' }],
      };
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Validation failed');
    });

    it('should handle generic errors', async () => {
      const error = new Error('Unknown error');
      const response = handleApiError(error);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Internal server error');
    });
  });

  describe('Validation Schemas', () => {
    describe('wcaIdSchema', () => {
      it('should validate correct WCA ID', () => {
        const result = wcaIdSchema.safeParse({ wcaid: '2020TEST01' });
        expect(result.success).toBe(true);
      });

      it('should reject empty WCA ID', () => {
        const result = wcaIdSchema.safeParse({ wcaid: '' });
        expect(result.success).toBe(false);
      });

      it('should reject missing WCA ID', () => {
        const result = wcaIdSchema.safeParse({});
        expect(result.success).toBe(false);
      });
    });

    describe('requestInfoSchema', () => {
      it('should validate complete request info', () => {
        const result = requestInfoSchema.safeParse({
          wcaid: '2020TEST01',
          name: 'Test User',
          avatarUrl: 'https://example.com/avatar.jpg',
          country: 'India',
          gender: 'm',
          role: 'member',
        });
        expect(result.success).toBe(true);
      });

      it('should validate with only required fields', () => {
        const result = requestInfoSchema.safeParse({
          wcaid: '2020TEST01',
          name: 'Test User',
        });
        expect(result.success).toBe(true);
      });

      it('should reject missing required fields', () => {
        const result = requestInfoSchema.safeParse({
          wcaid: '2020TEST01',
        });
        expect(result.success).toBe(false);
      });
    });

    describe('userInfoSchema', () => {
      it('should validate complete user info', () => {
        const result = userInfoSchema.safeParse({
          me: {
            wca_id: '2020TEST01',
            name: 'Test User',
            avatar: { url: 'https://example.com/avatar.jpg' },
            country: { name: 'India' },
            gender: 'm',
          },
        });
        expect(result.success).toBe(true);
      });

      it('should reject incomplete user info', () => {
        const result = userInfoSchema.safeParse({
          me: {
            wca_id: '2020TEST01',
          },
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('validateRequestBody', () => {
    it('should return success for valid body', async () => {
      const mockRequest = {
        json: async () => ({ wcaid: '2020TEST01' }),
      } as Request;

      const result = await validateRequestBody(mockRequest, wcaIdSchema);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.wcaid).toBe('2020TEST01');
      }
    });

    it('should return error for invalid body', async () => {
      const mockRequest = {
        json: async () => ({ wcaid: '' }),
      } as Request;

      const result = await validateRequestBody(mockRequest, wcaIdSchema);

      expect(result.success).toBe(false);
    });

    it('should throw for non-JSON parsing errors', async () => {
      const mockRequest = {
        json: async () => {
          throw new Error('Network error');
        },
      } as unknown as Request;

      await expect(
        validateRequestBody(mockRequest, wcaIdSchema)
      ).rejects.toThrow('Network error');
    });
  });
});
