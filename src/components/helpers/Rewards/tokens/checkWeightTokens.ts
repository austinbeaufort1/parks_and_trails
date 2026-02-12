import { supabase } from "../../../../connection/supabase";
import { styleBaseTokens } from "./constants";
import { EarnedToken, Mode } from "./types";
import { getLoadClass } from "./utils";

export async function checkWeightTokens({
  userId,
  trailId,
  weightInputs,
  mode = "reward",
}: {
  userId: string;
  trailId: string;
  weightInputs: Record<string, number | undefined>;
  mode?: Mode;
}): Promise<EarnedToken[]> {
  if (!weightInputs) return [];

  // 🔧 Normalize: default missing / invalid weights to 1 lb
  const normalizedWeights: Record<string, number> = {};

  for (const [style, value] of Object.entries(weightInputs)) {
    const pounds = typeof value === "number" && value > 0 ? value : 1;

    normalizedWeights[style] = pounds;
  }

  if (Object.keys(normalizedWeights).length === 0) return [];

  const earnedTokenIds = new Set<string>();

  // 1️⃣ Single-weight tokens
  for (const [style, weight] of Object.entries(normalizedWeights)) {
    const baseToken = styleBaseTokens[style];
    if (!baseToken) continue;

    const loadClass = getLoadClass(weight);
    const tokenId = loadClass === 1 ? baseToken : `${baseToken}_${loadClass}`;

    earnedTokenIds.add(tokenId);
  }

  // 2️⃣ Combo tokens
  //   const weightCount = Object.keys(normalizedWeights).length;
  //   if (weightCount >= 3) earnedTokenIds.add("fully_loaded");
  //   else if (weightCount === 2) earnedTokenIds.add("double_duty");

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // 3️⃣ Fetch token data
  const { data: tokens } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (!tokens || tokens.length === 0) return [];

  if (mode === "reward") {
    // 4️⃣ Check already earned
    const { data: existing } = await supabase
      .from("user_tokens")
      .select("token_id")
      .eq("user_id", userId)
      .eq("trail_id", trailId)
      .in("token_id", tokenIds);

    const existingIds = new Set(existing?.map((e) => e.token_id));
    const newTokens = tokens.filter((t) => !existingIds.has(t.id));

    if (newTokens.length === 0) return [];

    // 5️⃣ Insert newly earned tokens
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

  // detect mode
  return tokens;
}
