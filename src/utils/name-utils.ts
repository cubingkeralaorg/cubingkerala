/** Extract the display name by dropping parenthetical nicknames/countries. */
export const extractFirstName = (fullName: string): string => {
  return fullName.split("(")[0];
};
