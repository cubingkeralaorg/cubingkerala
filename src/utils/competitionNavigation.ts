/**
 * Navigation helpers for competition-related URLs
 */
export const openCompetitionRegistration = (competitionId: string): void => {
  window.open(
    `https://www.worldcubeassociation.org/competitions/${competitionId}/register`,
    "_blank",
  );
};

export const openCompetitionPage = (competitionId: string): void => {
  window.open(
    `https://www.worldcubeassociation.org/competitions/${competitionId}`,
    "_blank",
  );
};

export const openOrganizerProfile = (url: string | null): void => {
  if (url) {
    window.open(url, "_blank");
  }
};
