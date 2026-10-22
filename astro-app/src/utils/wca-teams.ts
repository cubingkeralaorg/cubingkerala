/**
 * Maps WCA team "friendly_id"s to their full names, same pattern as
 * event-names.ts. Not exhaustive — WCA has more committees than this, but
 * these are the ones a working delegate/organizer is realistically on.
 * Falls back to an uppercased friendly_id for anything not listed, so an
 * unmapped team still shows something reasonable rather than nothing.
 */
const WCA_TEAM_NAMES: Record<string, string> = {
  wrt: "WCA Regulations Team",
  wst: "WCA Software Team",
  wfc: "WCA Finance Committee",
  wmt: "WCA Marketing Team",
  wat: "WCA Advisory Team" /* also called the Advisory Council */,
  wdc: "WCA Disciplinary Committee",
  weat: "WCA Ethics Team",
  wqac: "WCA Quality Assurance Committee",
  wapc: "WCA Appeals Committee",
  wsot: "WCA Sports Team",
  wct: "WCA Communication Team",
  seniors: "WCA Seniors Committee",
};

export function getTeamName(friendlyId: string): string {
  return WCA_TEAM_NAMES[friendlyId] ?? friendlyId.toUpperCase();
}

/** "junior_delegate" -> "Junior Delegate". Works for any snake_case value WCA returns, not just known ones. */
export function formatDelegateStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
