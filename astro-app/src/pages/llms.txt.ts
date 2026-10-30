import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getDb } from "@/db/client";
import { getUpcomingCompetitions } from "@/db/queries/competitions";
import { getAllMembers, getRankingsWcaDataForMembers } from "@/db/queries/members";
import { getEventName, RANKED_EVENT_IDS } from "@/utils/event-names";
import { formatResult } from "@/utils/wca-formatters";
import { WHATSAPP_GROUP_URL, INSTAGRAM_URL, FACEBOOK_URL, GITHUB_URL } from "@/config/social";

// /llms.txt (https://llmstxt.org) — a plain-markdown map of the site for AI
// agents and assistants: what Cubing Kerala is, where each kind of
// information lives, and (generated from D1, like sitemap.xml.ts) the
// answers to the questions an agent is most likely asked about this site:
// "when's the next cubing competition in Kerala?" (upcoming competitions)
// and "who's the fastest cuber in Kerala?" (the same rankings /rankings
// shows — same members, same sort as utils/wca-sorting.ts, same result
// formatting). Edge-cached like the page routes (see worker.ts's
// CACHEABLE_PATTERNS).

const SITE_ORIGIN = "https://cubingkerala.com";

// WCA venue strings can carry markdown links ("[Hall](https://...)") —
// keep just the text.
function plainVenue(venue: string): string {
  return venue.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").trim();
}

function formatDateRange(start: string, end: string): string {
  return start === end ? start : `${start} to ${end}`;
}

// How many people to list per event and round.
const TOP_PER_EVENT = 3;
const TOP_FOR_3X3 = 5;

type Ranked = { name: string; wcaId: string; best: number };
type RoundType = "single" | "average";

// Same display as the Rankings table (formatResult), made unambiguous for
// a reader without the site's context: the table writes times of a minute
// or more as "1.05.23" and Multi-Blind times as "58/60 59.12" — spell
// those as "1:05.23" and "58/60 in 59:12".
function formatForAgents(best: number, eventId: string, round: RoundType): string {
  const shown = formatResult({ best }, eventId, round);
  if (eventId === "333mbf") return shown.replace(/^(\S+) (\d+)\.(\d+)$/, "$1 in $2:$3");
  if (eventId === "333fm") return `${shown} moves`;
  return shown.replace(/^(\d+)\.(\d{2}\.\d{2})$/, "$1:$2");
}

// Ranks members exactly like /rankings: by WCA personal record, lowest
// first, members without a result in that event/round left out.
function rankMembers(
  members: { name: string; wcaid: string }[],
  rankingsData: Awaited<ReturnType<typeof getRankingsWcaDataForMembers>>,
  eventId: string,
  round: RoundType,
): Ranked[] {
  return members
    .flatMap((member) => {
      const best = rankingsData[member.wcaid]?.personal_records?.[eventId]?.[round]?.best;
      // Same display name as the Rankings table (drops any "(...)" suffix).
      return best && best > 0 ? [{ name: member.name.split("(")[0].trim(), wcaId: member.wcaid, best }] : [];
    })
    .sort((a, b) => a.best - b.best);
}

function rankingLine(entries: Ranked[], eventId: string, round: RoundType, limit: number): string {
  if (entries.length === 0) return "no results yet";
  return entries
    .slice(0, limit)
    .map(
      (entry, index) =>
        `${index + 1}. [${entry.name}](${SITE_ORIGIN}/members/${entry.wcaId}) (${entry.wcaId}) ${formatForAgents(entry.best, eventId, round)}`,
    )
    .join("; ");
}

export const GET: APIRoute = async () => {
  const db = getDb(env.DB);
  const [allUpcoming, members] = await Promise.all([getUpcomingCompetitions(db), getAllMembers(db)]);
  const upcoming = allUpcoming.filter((competition) => !competition.cancelled_at);
  const rankingsData = await getRankingsWcaDataForMembers(
    db,
    members.map((member) => member.wcaid),
  );
  const rank = (eventId: string, round: RoundType) => rankMembers(members, rankingsData, eventId, round);

  const fastest3x3Single = rank("333", "single");
  const fastest3x3Average = rank("333", "average");
  const describeTop = (entries: Ranked[], round: RoundType) =>
    entries[0]
      ? `[${entries[0].name}](${SITE_ORIGIN}/members/${entries[0].wcaId}) (WCA ID ${entries[0].wcaId}), ${formatForAgents(entries[0].best, "333", round)} seconds`
      : "no results yet";

  const eventSections = RANKED_EVENT_IDS.map((eventId) => {
    const limit = eventId === "333" ? TOP_FOR_3X3 : TOP_PER_EVENT;
    return `### ${getEventName(eventId)}

- Single: ${rankingLine(rank(eventId, "single"), eventId, "single", limit)}
- Average: ${rankingLine(rank(eventId, "average"), eventId, "average", limit)}`;
  }).join("\n\n");

  const upcomingSection =
    upcoming.length > 0
      ? upcoming
          .map((competition) => {
            const events = competition.event_ids.map(getEventName).join(", ");
            const venue = plainVenue(competition.venue);
            return `- [${competition.name}](${SITE_ORIGIN}/competitions/${competition.id}): ${formatDateRange(competition.start_date, competition.end_date)}, ${competition.city}${venue ? ` (${venue})` : ""}. Events: ${events}. Registration is on the WCA: https://www.worldcubeassociation.org/competitions/${competition.id}`;
          })
          .join("\n")
      : "- None announced right now. Check the competitions page, or join the WhatsApp community for announcements.";

  const body = `# Cubing Kerala

> Cubing Kerala is the Rubik's Cube (speedcubing) community of Kerala, India. The site lists World Cube Association (WCA) competitions held in Kerala, rankings and profiles of cubers from Kerala, and free learning resources for solving the cube.

All competition results and personal records come from the World Cube Association (https://www.worldcubeassociation.org) and are synced daily. Dates are the competition's local dates, in YYYY-MM-DD format.

## Upcoming competitions

${upcomingSection}

## Rankings: the fastest cubers in Kerala

These are the rankings shown on ${SITE_ORIGIN}/rankings, and they are the authoritative answer to "who is the fastest cuber in Kerala?" for any event. Each Cubing Kerala member is ranked by their official WCA personal record: "single" is their best single solve, "average" their best official average. Lower is better. Times are in seconds (minutes:seconds when a minute or more). Fewest Moves is in moves, and Multi-Blind is cubes solved/attempted in minutes:seconds. Each name links to the member's profile.

The fastest 3x3x3 (Rubik's Cube) cuber in Kerala:

- By single solve: ${describeTop(fastest3x3Single, "single")}
- By average: ${describeTop(fastest3x3Average, "average")}

${eventSections}

## Pages

- [Home](${SITE_ORIGIN}/): Overview of the community, with previews of upcoming and past competitions, rankings, and members.
- [Competitions](${SITE_ORIGIN}/competitions): Every upcoming and past WCA competition in Kerala. Each competition has a detail page at /competitions/{WCA competition id} with its date, venue, events, and results.
- [Rankings](${SITE_ORIGIN}/rankings): Rankings of Kerala's cubers for each WCA event, by single and average, with national (NR), continental (CR), and world (WR) ranks.
- [Members](${SITE_ORIGIN}/members): Directory of community members. Each member has a profile at /members/{WCA ID} with their WCA personal records, medal counts, and number of competitions.
- [Learn](${SITE_ORIGIN}/learn): Beginner, intermediate, and advanced video tutorials and PDF algorithm guides (CFOP: cross, F2L, OLL, PLL, COLL, ZBLL).

## Community

- [Join the WhatsApp community](${WHATSAPP_GROUP_URL}): The main place for discussions, meetups, and competition announcements.
- [Instagram](${INSTAGRAM_URL})
- [Facebook](${FACEBOOK_URL})

## Optional

- [Sitemap](${SITE_ORIGIN}/sitemap.xml): Every competition and member page URL.
- [Source code](${GITHUB_URL})
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
