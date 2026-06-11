import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockDb = vi.hoisted(() => ({
  memberWcaData: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("@/lib/db", () => ({
  default: mockDb,
}));

const mockAfter = vi.hoisted(() => vi.fn());

vi.mock("next/server", () => ({
  after: mockAfter,
}));

import {
  CACHE_DURATION_MS,
  getMemberWcaData,
  getUnifiedWcaCacheForMembers,
  isWcaCacheFresh,
  syncSingleMemberWcaData,
} from "@/lib/wca.sync";

const sampleWcaData = {
  person: {
    id: "2023TEST01",
    name: "Test User",
    wca_id: "2023TEST01",
    avatar: { url: "", pending_url: "", thumb_url: "", is_default: true },
    gender: "m",
    country_iso2: "IN",
    url: "https://www.worldcubeassociation.org/persons/2023TEST01",
    country: {
      id: "India",
      name: "India",
      continentId: "_Asia",
      iso2: "IN",
    },
    delegate_status: null,
    class: "person",
    teams: [],
  },
  competition_count: 3,
  personal_records: {},
  medals: { gold: 0, silver: 0, bronze: 0, total: 0 },
  records: { national: 0, continental: 0, world: 0, total: 0 },
};

describe("wca.sync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("isWcaCacheFresh", () => {
    it("returns true when updated within cache duration", () => {
      const recent = new Date(Date.now() - CACHE_DURATION_MS / 2);
      expect(isWcaCacheFresh(recent)).toBe(true);
    });

    it("returns false when updated before cache duration", () => {
      const stale = new Date(Date.now() - CACHE_DURATION_MS - 1);
      expect(isWcaCacheFresh(stale)).toBe(false);
    });
  });

  describe("syncSingleMemberWcaData", () => {
    it("creates a new cache row when WCA returns data", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => sampleWcaData,
      } as Response);
      mockDb.memberWcaData.findUnique.mockResolvedValue(null);
      mockDb.memberWcaData.create.mockResolvedValue({});

      const result = await syncSingleMemberWcaData("2023TEST01");

      expect(result).toEqual(sampleWcaData);
      expect(mockDb.memberWcaData.create).toHaveBeenCalledWith({
        data: { wcaid: "2023TEST01", data: sampleWcaData },
      });
    });

    it("returns null when WCA request fails", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
      } as Response);

      const result = await syncSingleMemberWcaData("2023TEST01");

      expect(result).toBeNull();
      expect(mockDb.memberWcaData.create).not.toHaveBeenCalled();
    });
  });

  describe("getMemberWcaData", () => {
    it("returns cached data when still fresh", async () => {
      mockDb.memberWcaData.findUnique.mockResolvedValue({
        wcaid: "2023TEST01",
        data: sampleWcaData,
        updatedAt: new Date(),
      });

      const result = await getMemberWcaData("2023TEST01");

      expect(result).toEqual(sampleWcaData);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("refreshes stale cache from WCA", async () => {
      const updated = { ...sampleWcaData, competition_count: 5 };
      mockDb.memberWcaData.findUnique.mockResolvedValue({
        wcaid: "2023TEST01",
        data: sampleWcaData,
        updatedAt: new Date(Date.now() - CACHE_DURATION_MS - 1),
      });
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => updated,
      } as Response);
      mockDb.memberWcaData.update.mockResolvedValue({});

      const result = await getMemberWcaData("2023TEST01");

      expect(result).toEqual(updated);
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe("getUnifiedWcaCacheForMembers", () => {
    it("syncs stale members on read when the set is small", async () => {
      const staleDate = new Date(Date.now() - CACHE_DURATION_MS - 1);
      mockDb.memberWcaData.findMany.mockResolvedValue([
        {
          wcaid: "2023TEST01",
          data: sampleWcaData,
          updatedAt: staleDate,
        },
      ]);
      mockDb.memberWcaData.findUnique.mockResolvedValue({
        wcaid: "2023TEST01",
        data: sampleWcaData,
        updatedAt: staleDate,
      });
      const refreshed = { ...sampleWcaData, competition_count: 7 };
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => refreshed,
      } as Response);
      mockDb.memberWcaData.update.mockResolvedValue({});

      const cache = await getUnifiedWcaCacheForMembers(["2023TEST01"]);

      expect(cache["2023TEST01"].data.competition_count).toBe(7);
      expect(mockAfter).not.toHaveBeenCalled();
    });

    it("schedules background sync when many members are stale", async () => {
      const staleDate = new Date(Date.now() - CACHE_DURATION_MS - 1);
      const staleIds = Array.from({ length: 21 }, (_, i) => `2023TEST${i}`);
      mockDb.memberWcaData.findMany.mockResolvedValue(
        staleIds.map((wcaid) => ({
          wcaid,
          data: sampleWcaData,
          updatedAt: staleDate,
        })),
      );

      await getUnifiedWcaCacheForMembers(staleIds);

      expect(mockAfter).toHaveBeenCalledTimes(1);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});
