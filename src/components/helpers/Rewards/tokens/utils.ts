import { loadClasses } from "./constants";
import { EarnedToken } from "./types";

/**
 * Utility to flatten nested arrays of EarnedToken
 */
export function flattenTokenResults(
  results: (EarnedToken[] | undefined)[],
): EarnedToken[] {
  return results.flatMap((r) => r ?? []);
}

// Helper: determine load class from weight
export function getLoadClass(weight: number): number {
  const entry = loadClasses.find((lc) => weight > lc.min && weight <= lc.max);
  return entry ? entry.class : 1;
}

export function parseEstimatedMinutes(input: string): number {
  let hours = 0;
  let minutes = 0;

  // Check if the string contains hours
  const hourMatch = input.match(/(\d+)h/);
  if (hourMatch) {
    hours = parseInt(hourMatch[1], 10);
  }

  // Check for minutes
  const minMatch = input.match(/(\d+)mins/);
  if (minMatch) {
    minutes = parseInt(minMatch[1], 10);
  }

  return hours * 60 + minutes;
}
