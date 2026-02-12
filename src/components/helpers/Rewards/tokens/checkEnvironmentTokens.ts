import { supabase } from "../../../../connection/supabase";
import { singleEnvironmentTokens } from "./constants";
import { EarnedToken, Mode } from "./types";

export async function checkEnvironmentTokens({
  userId,
  trailId,
  environmentSelections,
  mode = "reward",
}: {
  userId: string;
  trailId: string;
  environmentSelections: string[];
  mode?: Mode;
}): Promise<EarnedToken[]> {
  if (!environmentSelections || environmentSelections.length === 0) return [];

  const earnedTokenIds = new Set<string>();

  // 1️⃣ Map environment selections → token IDs
  for (const env of environmentSelections) {
    const tokenId = singleEnvironmentTokens[env];
    if (tokenId) earnedTokenIds.add(tokenId);
  }

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // 2️⃣ Fetch token info
  const { data: tokens, error: tokenError } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (tokenError || !tokens || tokens.length === 0) return [];

  if (mode === "reward") {
    // 3️⃣ Check which tokens already earned for this trail
    const { data: existing } = await supabase
      .from("user_tokens")
      .select("token_id")
      .eq("user_id", userId)
      .eq("trail_id", trailId)
      .in("token_id", tokenIds);

    const existingIds = new Set(existing?.map((e) => e.token_id));

    const newTokens = tokens.filter((t) => !existingIds.has(t.id));

    if (newTokens.length === 0) return [];

    // 4️⃣ Insert new tokens
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

  // detect mode: return all eligible tokens
  return tokens;
}
