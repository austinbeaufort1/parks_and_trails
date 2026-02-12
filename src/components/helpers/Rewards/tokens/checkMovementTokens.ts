import { supabase } from "../../../../connection/supabase";
import { singleMovementTokens } from "./constants";
import { EarnedToken, Mode } from "./types";

export async function checkMovementTokens({
  userId,
  trailId,
  movementSelections,
  mode = "reward",
}: {
  userId: string;
  trailId: string;
  movementSelections: string[];
  mode?: Mode;
}): Promise<EarnedToken[]> {
  if (!movementSelections || movementSelections.length === 0) return [];

  const earnedTokenIds = new Set<string>();

  // 1️⃣ Award token for each movement selection
  for (const m of movementSelections) {
    const token = singleMovementTokens[m];
    if (token) earnedTokenIds.add(token);
  }

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // 2️⃣ Fetch token info from Supabase
  const { data: tokens } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (!tokens || tokens.length === 0) return [];

  if (mode === "reward") {
    // 3️⃣ Check which tokens the user has already earned for this trail
    const { data: existing } = await supabase
      .from("user_tokens")
      .select("token_id")
      .eq("user_id", userId)
      .eq("trail_id", trailId)
      .in("token_id", tokenIds);

    const existingIds = new Set(existing?.map((e) => e.token_id));

    const newTokens = tokens.filter((t) => !existingIds.has(t.id));

    if (newTokens.length === 0) return [];

    // 4️⃣ Insert newly earned tokens
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

  // detect mode: return all tokens without checking existing
  return tokens;
}
