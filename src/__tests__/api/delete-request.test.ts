import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

// Use vi.hoisted to create mocks that can be accessed in vi.mock
const mockDb = vi.hoisted(() => ({
  requests: {
    delete: vi.fn(),
  },
}));

// Mock the database
vi.mock('@/lib/db', () => ({
  default: mockDb,
}));

import { DELETE } from '@/app/api/delete-request/route';

// Helper to create mock NextRequest
function createMockRequest(options: {
  body?: Record<string, unknown>;
  cookies?: Record<string, string>;
}): NextRequest {
  const { body = {}, cookies = {} } = options;
  
  const request = new NextRequest('http://localhost:3000/api/delete-request', {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const cookieStore = new Map(Object.entries(cookies));
  Object.defineProperty(request, 'cookies', {
    value: {
      get: (name: string) => {
        const value = cookieStore.get(name);
        return value ? { name, value } : undefined;
      },
      getAll: () => Array.from(cookieStore.entries()).map(([name, value]) => ({ name, value })),
      has: (name: string) => cookieStore.has(name),
    },
    writable: false,
  });

  return request;
}

const mockUserInfo = {
  me: {
    wca_id: '2020ADMIN01',
    name: 'Admin User',
  },
};

describe('DELETE /api/delete-request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      const request = createMockRequest({
        body: { wcaid: '2023TEST01' },
        cookies: {},
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Unauthorized');
    });
  });

  describe('Request Body Validation', () => {
    it('should return 400 when wcaid is missing', async () => {
      const request = createMockRequest({
        body: {},
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid request body');
    });

    it('should return 400 when wcaid is empty string', async () => {
      const request = createMockRequest({
        body: { wcaid: '' },
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await DELETE(request);

      expect(response.status).toBe(400);
    });
  });

  describe('Successful Request Deletion', () => {
    it('should delete request and return success', async () => {
      mockDb.requests.delete.mockResolvedValue({
        wcaid: '2023TEST01',
        name: 'Test User',
      });

      const request = createMockRequest({
        body: { wcaid: '2023TEST01' },
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Request deleted successfully');
      expect(mockDb.requests.delete).toHaveBeenCalledWith({
        where: { wcaid: '2023TEST01' },
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 when request not found (P2025)', async () => {
      const prismaError = new Error('Record not found');
      (prismaError as any).code = 'P2025';
      mockDb.requests.delete.mockRejectedValue(prismaError);

      const request = createMockRequest({
        body: { wcaid: '2023NOEXIST' },
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await DELETE(request);

      expect(response.status).toBe(404);
    });

    it('should return 500 when database throws generic error', async () => {
      mockDb.requests.delete.mockRejectedValue(new Error('Database error'));

      const request = createMockRequest({
        body: { wcaid: '2023TEST01' },
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await DELETE(request);

      expect(response.status).toBe(500);
    });
  });

  describe('Response Headers', () => {
    it('should include no-cache headers', async () => {
      mockDb.requests.delete.mockResolvedValue({
        wcaid: '2023TEST01',
        name: 'Test User',
      });

      const request = createMockRequest({
        body: { wcaid: '2023TEST01' },
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await DELETE(request);

      expect(response.headers.get('Cache-Control')).toBe('no-store, no-cache, must-revalidate');
    });
  });
});
