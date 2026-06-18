import db from "./db";

const competitionSelect = {
  id: true,
  name: true,
  city: true,
  start_date: true,
  end_date: true,
  event_ids: true,
  venue: true,
  country_iso2: true,
  has_results: true,
  cancelled_at: true,
} as const;

function getTodayIsoDate(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().slice(0, 10);
}

export async function fetchCompetitionsFromDb() {
  const todayIso = getTodayIsoDate();

  const [upcomingCompetitions, pastCompetitions, syncMeta] = await Promise.all([
    db.competitions.findMany({
      where: { start_date: { gte: todayIso } },
      orderBy: { start_date: "asc" },
      select: competitionSelect,
    }),
    db.competitions.findMany({
      where: { start_date: { lt: todayIso } },
      orderBy: { start_date: "desc" },
      take: 50,
      select: competitionSelect,
    }),
    db.systemMetadata.findUnique({
      where: { key: "last_competition_sync" },
    }),
  ]);

  let initialLastUpdated = "";
  if (syncMeta?.value) {
    initialLastUpdated = new Date(syncMeta.value).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return { upcomingCompetitions, pastCompetitions, initialLastUpdated };
}
