import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

// Use vi.hoisted to create mocks that can be accessed in vi.mock
const mockDb = vi.hoisted(() => ({
  requests: {
    delete: vi.fn(),
  },
  members: {
    create: vi.fn(),
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

import { POST } from '@/app/api/approve-requests/route';

// Helper to create mock NextRequest
function createMockRequest(options: {
  body?: Record<string, unknown>;
  cookies?: Record<string, string>;
}): NextRequest {
  const { body = {}, cookies = {} } = options;
  
  const request = new NextRequest('http://localhost:3000/api/approve-requests', {
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

const mockRequestInfo = {
  wcaid: '2023TEST01',
  name: 'Test User',
  avatarUrl: 'https://example.com/avatar.jpg',
  country: 'India',
  gender: 'm',
  role: 'member',
};

describe('POST /api/approve-requests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      const request = createMockRequest({
        body: mockRequestInfo,
        cookies: {},
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Unauthorized');
    });
  });

  describe('Request Body Validation', () => {
    it('should return 400 when request body is missing wcaid', async () => {
      const request = createMockRequest({
        body: {
          name: 'Test User',
          // wcaid missing
        },
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Request is required and must include wcaid and name');
    });

    it('should return 400 when request body is missing name', async () => {
      const request = createMockRequest({
        body: {
          wcaid: '2023TEST01',
          // name missing
        },
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Request is required and must include wcaid and name');
    });
  });

  describe('Successful Request Approval', () => {
    it('should create member and delete request when approving', async () => {
      mockDb.members.create.mockResolvedValue({
        wcaid: mockRequestInfo.wcaid,
        name: mockRequestInfo.name,
        avatarUrl: mockRequestInfo.avatarUrl,
        country: mockRequestInfo.country,
        gender: mockRequestInfo.gender,
        role: mockRequestInfo.role,
      });
      mockDb.requests.delete.mockResolvedValue({});

      const request = createMockRequest({
        body: mockRequestInfo,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Request updated successfully');
      expect(mockDb.members.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          wcaid: mockRequestInfo.wcaid,
          name: mockRequestInfo.name,
          avatarUrl: mockRequestInfo.avatarUrl,
          country: mockRequestInfo.country,
          gender: mockRequestInfo.gender,
          role: mockRequestInfo.role,
        }),
      });
      expect(mockDb.requests.delete).toHaveBeenCalledWith({
        where: { wcaid: mockRequestInfo.wcaid },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    });

    it('should handle different roles correctly', async () => {
      const modRequestInfo = { ...mockRequestInfo, role: 'moderator' };
      mockDb.members.create.mockResolvedValue(modRequestInfo);
      mockDb.requests.delete.mockResolvedValue({});

      const request = createMockRequest({
        body: modRequestInfo,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockDb.members.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          role: 'moderator',
        }),
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 500 when database create fails', async () => {
      mockDb.members.create.mockRejectedValue(new Error('Database error'));

      const request = createMockRequest({
        body: mockRequestInfo,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
    });

    it('should handle Prisma unique constraint violation (P2002)', async () => {
      const prismaError = new Error('Unique constraint failed');
      (prismaError as any).code = 'P2002';
      mockDb.members.create.mockRejectedValue(prismaError);

      const request = createMockRequest({
        body: mockRequestInfo,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(409);
    });

    it('should return 500 when request delete fails after member creation', async () => {
      mockDb.members.create.mockResolvedValue(mockRequestInfo);
      mockDb.requests.delete.mockRejectedValue(new Error('Delete failed'));

      const request = createMockRequest({
        body: mockRequestInfo,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
    });
  });
});
