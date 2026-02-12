import { Season } from "./types";

export function getSeasonYear(season: Season, date: Date) {
  const year = date.getFullYear();

  // Winter belongs to the year it starts
  if (season === "winter" && date.getMonth() < 11) {
    // Jan–Mar winter belongs to previous year
    return year - 1;
  }

  return year;
}
