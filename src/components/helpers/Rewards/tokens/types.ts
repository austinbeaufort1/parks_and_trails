// tokens/types.ts

export type Mode = "reward" | "detect";

export interface EarnedToken {
  id: string;
  title: string;
  description: string;
  icon_emoji: string;
}

export interface TokenCheckResult {
  earned: EarnedToken[];
  skipped?: string[]; // optional: for logging skipped tokens
}

// You can add other shared types if needed later
