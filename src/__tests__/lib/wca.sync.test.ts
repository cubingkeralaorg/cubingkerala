import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockDb = vi.hoisted(() => ({
  memberWcaData: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
  systemMetadata: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
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
  isLiveWcaSyncEnabled,
  isWcaCacheFresh,
  syncMemberWcaData,
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
    vi.unstubAllEnvs();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
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

  describe("isLiveWcaSyncEnabled", () => {
    it("is disabled when SKIP_WCA_LIVE_SYNC is set", () => {
      vi.stubEnv("SKIP_WCA_LIVE_SYNC", "true");
      expect(isLiveWcaSyncEnabled()).toBe(false);
    });

    it("is enabled by default", () => {
      expect(isLiveWcaSyncEnabled()).toBe(true);
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

    it("does not call WCA when live sync is skipped", async () => {
      vi.stubEnv("SKIP_WCA_LIVE_SYNC", "true");
      mockDb.memberWcaData.findUnique.mockResolvedValue({
        wcaid: "2023TEST01",
        data: sampleWcaData,
      });

      const result = await syncSingleMemberWcaData("2023TEST01");

      expect(result).toEqual(sampleWcaData);
      expect(global.fetch).not.toHaveBeenCalled();
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

    it("returns cached stale data when live sync is skipped", async () => {
      vi.stubEnv("SKIP_WCA_LIVE_SYNC", "true");
      mockDb.memberWcaData.findUnique.mockResolvedValue({
        wcaid: "2023TEST01",
        data: sampleWcaData,
        updatedAt: new Date(Date.now() - CACHE_DURATION_MS - 1),
      });

      const result = await getMemberWcaData("2023TEST01");

      expect(result).toEqual(sampleWcaData);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe("getUnifiedWcaCacheForMembers", () => {
    it("schedules background sync for stale members", async () => {
      const staleDate = new Date(Date.now() - CACHE_DURATION_MS - 1);
      mockDb.memberWcaData.findMany.mockResolvedValue([
        {
          wcaid: "2023TEST01",
          data: sampleWcaData,
          updatedAt: staleDate,
        },
      ]);

      const cache = await getUnifiedWcaCacheForMembers(["2023TEST01"]);

      expect(cache["2023TEST01"].data).toEqual(sampleWcaData);
      expect(mockAfter).toHaveBeenCalledTimes(1);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("does not schedule background sync when live sync is skipped", async () => {
      vi.stubEnv("SKIP_WCA_LIVE_SYNC", "true");
      const staleDate = new Date(Date.now() - CACHE_DURATION_MS - 1);
      mockDb.memberWcaData.findMany.mockResolvedValue([
        {
          wcaid: "2023TEST01",
          data: sampleWcaData,
          updatedAt: staleDate,
        },
      ]);

      await getUnifiedWcaCacheForMembers(["2023TEST01"]);

      expect(mockAfter).not.toHaveBeenCalled();
    });
  });

  describe("syncMemberWcaData", () => {
    it("stores rotated offset when rotateOffset is enabled", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => sampleWcaData,
      } as Response);
      mockDb.memberWcaData.findUnique.mockResolvedValue(null);
      mockDb.memberWcaData.create.mockResolvedValue({});
      mockDb.systemMetadata.findUnique.mockResolvedValue({ value: "0" });
      mockDb.systemMetadata.upsert.mockResolvedValue({});

      await syncMemberWcaData(["2023TEST02", "2023TEST01"], {
        rotateOffset: true,
      });

      expect(mockDb.systemMetadata.upsert).toHaveBeenCalledWith({
        where: { key: "wca_sync_offset" },
        create: { key: "wca_sync_offset", value: "0" },
        update: { value: "0" },
      });
    });

    it("no-ops when live sync is skipped", async () => {
      vi.stubEnv("SKIP_WCA_LIVE_SYNC", "true");

      await syncMemberWcaData(["2023TEST01"]);

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});
