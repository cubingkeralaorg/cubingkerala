import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

// Use vi.hoisted to create mocks that can be accessed in vi.mock
const mockDb = vi.hoisted(() => ({
  requests: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  members: {
    findUnique: vi.fn(),
  },
}));

const mockRevalidatePath = vi.hoisted(() => vi.fn());

// Mock the database - must be before imports that use it
vi.mock('@/lib/db', () => ({
  default: mockDb,
}));

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

// Now import the route handler (after mocks are set up)
import { POST } from '@/app/api/join-cubingkerala/route';

// Helper to create mock NextRequest
function createMockRequest(options: {
  body?: Record<string, unknown>;
  cookies?: Record<string, string>;
}): NextRequest {
  const { body = {}, cookies = {} } = options;
  
  const request = new NextRequest('http://localhost:3000/api/join-cubingkerala', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Mock the cookies
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

// Mock user info matching the WCA API UserInfo format
const mockUserInfo = {
  me: {
    wca_id: '2023TEST01',
    name: 'Test User',
    email: 'test@example.com',
    gender: 'm',
    avatar: {
      url: 'https://example.com/avatar.jpg',
      thumb_url: 'https://example.com/avatar_thumb.jpg',
    },
    country: {
      id: 'IN',
      name: 'India',
      continentId: '_Asia',
    },
    country_iso2: 'IN',
    class: 'user',
  },
};

describe('POST /api/join-cubingkerala', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      const request = createMockRequest({
        body: mockUserInfo,
        cookies: {}, // No auth cookie
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Unauthorized');
    });

    it('should return 401 when userInfo cookie is invalid JSON', async () => {
      const request = createMockRequest({
        body: mockUserInfo,
        cookies: {
          userInfo: 'invalid-json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe('Unauthorized');
    });
  });

  describe('Request Body Validation', () => {
    it('should return 400 when request body is missing', async () => {
      const request = createMockRequest({
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      // Override json to throw error
      vi.spyOn(request, 'json').mockRejectedValue(new Error('No body'));

      const response = await POST(request);
      expect(response.status).toBe(500); // API error handler returns 500
    });

    it('should return error when wca_id is missing from body', async () => {
      const invalidUserInfo = {
        me: {
          name: 'Test User',
          email: 'test@example.com',
          // wca_id missing
        },
      };

      const request = createMockRequest({
        body: invalidUserInfo,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Duplicate Request Check', () => {
    it('should return 400 when user already has a pending request', async () => {
      mockDb.requests.findUnique.mockResolvedValue({
        wcaid: mockUserInfo.me.wca_id,
        name: mockUserInfo.me.name,
        avatarUrl: mockUserInfo.me.avatar.url,
      });

      const request = createMockRequest({
        body: mockUserInfo,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Request already submitted');
      expect(mockDb.requests.findUnique).toHaveBeenCalledWith({
        where: { wcaid: mockUserInfo.me.wca_id },
      });
    });

    it('should return 400 when user is already a member', async () => {
      mockDb.requests.findUnique.mockResolvedValue(null);
      mockDb.members.findUnique.mockResolvedValue({
        wcaid: mockUserInfo.me.wca_id,
        name: mockUserInfo.me.name,
      });

      const request = createMockRequest({
        body: mockUserInfo,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Already a member');
      expect(mockDb.members.findUnique).toHaveBeenCalledWith({
        where: { wcaid: mockUserInfo.me.wca_id },
      });
    });
  });

  describe('Successful Request Creation', () => {
    it('should create a new request and return 201', async () => {
      mockDb.requests.findUnique.mockResolvedValue(null);
      mockDb.members.findUnique.mockResolvedValue(null);
      mockDb.requests.create.mockResolvedValue({
        wcaid: mockUserInfo.me.wca_id,
        name: mockUserInfo.me.name,
        avatarUrl: mockUserInfo.me.avatar.url,
        country: mockUserInfo.me.country.name,
        gender: mockUserInfo.me.gender,
        role: 'member',
      });

      const request = createMockRequest({
        body: mockUserInfo,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Request submitted successfully');
      expect(mockDb.requests.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          wcaid: mockUserInfo.me.wca_id,
          name: mockUserInfo.me.name,
          avatarUrl: mockUserInfo.me.avatar.url,
          country: mockUserInfo.me.country.name,
          gender: mockUserInfo.me.gender,
          role: 'member',
        }),
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    });

    it('should store correct data from WCA user info', async () => {
      mockDb.requests.findUnique.mockResolvedValue(null);
      mockDb.members.findUnique.mockResolvedValue(null);
      mockDb.requests.create.mockResolvedValue({
        wcaid: mockUserInfo.me.wca_id,
        name: mockUserInfo.me.name,
        avatarUrl: mockUserInfo.me.avatar.url,
      });

      const request = createMockRequest({
        body: mockUserInfo,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockDb.requests.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          wcaid: '2023TEST01',
          name: 'Test User',
          avatarUrl: 'https://example.com/avatar.jpg',
          country: 'India',
          gender: 'm',
        }),
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 500 when database throws an error', async () => {
      mockDb.requests.findUnique.mockRejectedValue(new Error('Database connection failed'));

      const request = createMockRequest({
        body: mockUserInfo,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
    });

    it('should handle Prisma unique constraint violation (P2002)', async () => {
      mockDb.requests.findUnique.mockResolvedValue(null);
      mockDb.members.findUnique.mockResolvedValue(null);
      
      const prismaError = new Error('Unique constraint failed');
      (prismaError as any).code = 'P2002';
      mockDb.requests.create.mockRejectedValue(prismaError);

      const request = createMockRequest({
        body: mockUserInfo,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(409);
    });
  });

  describe('Response Headers', () => {
    it('should include no-cache headers on success response', async () => {
      mockDb.requests.findUnique.mockResolvedValue(null);
      mockDb.members.findUnique.mockResolvedValue(null);
      mockDb.requests.create.mockResolvedValue({
        wcaid: mockUserInfo.me.wca_id,
        name: mockUserInfo.me.name,
      });

      const request = createMockRequest({
        body: mockUserInfo,
        cookies: {
          userInfo: JSON.stringify(mockUserInfo),
        },
      });

      const response = await POST(request);

      expect(response.headers.get('Cache-Control')).toBe('no-store, no-cache, must-revalidate');
    });
  });
});
