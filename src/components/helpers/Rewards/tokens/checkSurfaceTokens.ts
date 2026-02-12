import { supabase } from "../../../../connection/supabase";
import { surfaceTokens } from "./constants";
import { EarnedToken, Mode } from "./types";

export async function checkSurfaceTokens({
  userId,
  trailId,
  trailAdjacent,
  surfaceRule,
  mode = "reward",
}: {
  userId: string;
  trailId: string;
  trailAdjacent: boolean;
  surfaceRule: string | null;
  mode?: Mode;
}): Promise<EarnedToken[]> {
  const earnedTokenIds = new Set<string>();

  // 1️⃣ Trail-adjacent token
  if (trailAdjacent) {
    earnedTokenIds.add("trail_adjacent");
  }

  // 2️⃣ Surface rule token
  if (surfaceRule) {
    const surfaceToken = surfaceTokens[surfaceRule];
    if (surfaceToken) {
      earnedTokenIds.add(surfaceToken);
    }
  }

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // 3️⃣ Fetch token data
  const { data: tokens } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (!tokens || tokens.length === 0) return [];

  if (mode === "reward") {
    // 4️⃣ Check already earned for this trail
    const { data: existing } = await supabase
      .from("user_tokens")
      .select("token_id")
      .eq("user_id", userId)
      .eq("trail_id", trailId)
      .in("token_id", tokenIds);

    const existingIds = new Set(existing?.map((e) => e.token_id));

    const newTokens = tokens.filter((t) => !existingIds.has(t.id));

    if (newTokens.length === 0) return [];

    // 5️⃣ Insert new tokens
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
