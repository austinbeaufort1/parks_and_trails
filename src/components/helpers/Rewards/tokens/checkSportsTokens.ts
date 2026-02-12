import { supabase } from "../../../../connection/supabase";
import { singleSportsTokens } from "./constants";
import { EarnedToken, Mode } from "./types";

interface CheckSportsParams {
  userId: string;
  trailId: string;
  sportsSelections: string[];
  discGolfThrows?: number; // optional, only for Disc Golf
  trailDistanceFt?: number; // optional, only for Disc Golf
}

export async function checkSportsTokens({
  userId,
  trailId,
  sportsSelections,
  discGolfThrows,
  trailDistanceFt,
  mode = "reward",
}: CheckSportsParams & { mode?: Mode }): Promise<EarnedToken[]> {
  if (!sportsSelections || sportsSelections.length === 0) return [];

  const earnedTokenIds = new Set<string>();

  // --- Single-tier sports ---
  for (const s of sportsSelections) {
    if (s === "Disc Golf") continue; // handled separately
    const token = singleSportsTokens[s];
    if (token) earnedTokenIds.add(token);
  }

  // --- Tiered Disc Golf ---
  if (
    sportsSelections.includes("Disc Golf") &&
    discGolfThrows != null &&
    trailDistanceFt != null
  ) {
    const parThrows = Math.ceil(trailDistanceFt / 30); // 30 ft per throw
    let discGolfTier: number;

    if (discGolfThrows <= parThrows - 3) discGolfTier = 6;
    else if (discGolfThrows === parThrows - 2) discGolfTier = 5;
    else if (discGolfThrows === parThrows - 1) discGolfTier = 4;
    else if (discGolfThrows === parThrows) discGolfTier = 3;
    else if (discGolfThrows === parThrows + 1) discGolfTier = 2;
    else discGolfTier = 1;

    earnedTokenIds.add(`disc_golf_${discGolfTier}`);
  }

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // --- Fetch token info ---
  const { data: tokens, error } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (error || !tokens || tokens.length === 0) {
    console.error("Error fetching sports tokens:", error);
    return [];
  }

  if (mode === "reward") {
    // --- Check already earned ---
    const { data: existing } = await supabase
      .from("user_tokens")
      .select("token_id")
      .eq("user_id", userId)
      .eq("trail_id", trailId)
      .in("token_id", tokenIds);

    const existingIds = new Set(existing?.map((e) => e.token_id));
    const newTokens = tokens.filter((t) => !existingIds.has(t.id));

    if (newTokens.length === 0) return [];

    // --- Insert newly earned ---
    await supabase.from("user_tokens").insert(
      newTokens.map((t) => ({
        user_id: userId,
        token_id: t.id,
        trail_id: trailId,
        earned_at: new Date().toISOString(),
      })),
    );

    return newTokens;
  }

  // detect mode: just return all tokens
  return tokens;
}
