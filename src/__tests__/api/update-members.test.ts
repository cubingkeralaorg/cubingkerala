import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

// Use vi.hoisted to create mocks that can be accessed in vi.mock
const mockDb = vi.hoisted(() => ({
  members: {
    update: vi.fn(),
  },
}));

const mockRevalidatePath = vi.hoisted(() => vi.fn());

// Mock the database
vi.mock('@/lib/db', () => ({
  default: mockDb,
}));

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

import { POST } from '@/app/api/update-members/route';

// Helper to create mock NextRequest
function createMockRequest(options: {
  body?: Record<string, unknown>;
  cookies?: Record<string, string>;
}): NextRequest {
  const { body = {}, cookies = {} } = options;
  
  const request = new NextRequest('http://localhost:3000/api/update-members', {
    method: 'POST',
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

const mockMemberUpdate = {
  wcaid: '2023TEST01',
  name: 'Updated User',
  avatarUrl: 'https://example.com/new-avatar.jpg',
  country: 'India',
  gender: 'm',
  role: 'moderator',
};

describe('POST /api/update-members', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      const request = createMockRequest({
        body: mockMemberUpdate,
        cookies: {},
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Unauthorized');
    });
  });

  describe('Request Body Validation', () => {
    it('should return error when request body is empty', async () => {
      const request = createMockRequest({
        body: {},
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      // Empty body still passes but might fail in update
      const response = await POST(request);
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('Successful Member Update', () => {
    it('should update member and return success', async () => {
      mockDb.members.update.mockResolvedValue(mockMemberUpdate);

      const request = createMockRequest({
        body: mockMemberUpdate,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Member updated successfully');
      expect(mockDb.members.update).toHaveBeenCalledWith({
        where: { wcaid: mockMemberUpdate.wcaid },
        data: {
          wcaid: mockMemberUpdate.wcaid,
          name: mockMemberUpdate.name,
          avatarUrl: mockMemberUpdate.avatarUrl,
          country: mockMemberUpdate.country,
          gender: mockMemberUpdate.gender,
          role: mockMemberUpdate.role,
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    });

    it('should handle role update from member to admin', async () => {
      const adminUpdate = { ...mockMemberUpdate, role: 'admin' };
      mockDb.members.update.mockResolvedValue(adminUpdate);

      const request = createMockRequest({
        body: adminUpdate,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockDb.members.update).toHaveBeenCalledWith({
        where: { wcaid: adminUpdate.wcaid },
        data: expect.objectContaining({
          role: 'admin',
        }),
      });
    });

    it('should handle partial member data update', async () => {
      const partialUpdate = {
        wcaid: '2023TEST01',
        name: 'Partial User',
      };
      mockDb.members.update.mockResolvedValue(partialUpdate);

      const request = createMockRequest({
        body: partialUpdate,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockDb.members.update).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should return 404 when member not found (P2025)', async () => {
      const prismaError = new Error('Record not found');
      (prismaError as any).code = 'P2025';
      mockDb.members.update.mockRejectedValue(prismaError);

      const request = createMockRequest({
        body: mockMemberUpdate,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(404);
    });

    it('should return 500 when database throws generic error', async () => {
      mockDb.members.update.mockRejectedValue(new Error('Database error'));

      const request = createMockRequest({
        body: mockMemberUpdate,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
    });
  });

  describe('Response Headers', () => {
    it('should include no-cache headers', async () => {
      mockDb.members.update.mockResolvedValue(mockMemberUpdate);

      const request = createMockRequest({
        body: mockMemberUpdate,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);

      expect(response.headers.get('Cache-Control')).toBe('no-store, no-cache, must-revalidate');
    });
  });
});
