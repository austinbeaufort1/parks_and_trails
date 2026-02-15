import { supabase } from "../../../../connection/supabase";
import { EarnedToken, Mode } from "./types";

export async function checkWildlifeTokens({
  userId,
  trailId,
  wildlife,
  mode = "reward",
}: {
  userId: string;
  trailId: string;
  wildlife: string[];
  mode?: Mode;
}): Promise<EarnedToken[]> {
  // No wildlife logged → no token
  if (!wildlife || wildlife.length === 0) return [];
  console.log("IN WILDLIFE TOKENS", wildlife);

  const tokenId = "wildlife_witness";

  // 1️⃣ Fetch token info
  const { data: token, error } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .eq("id", tokenId)
    .single();

  if (error || !token) {
    console.error("Error fetching wildlife token:", error);
    return [];
  }

  if (mode === "reward") {
    // 2️⃣ Check if already earned for this trail
    const { data: existing } = await supabase
      .from("user_tokens")
      .select("id")
      .eq("user_id", userId)
      .eq("token_id", token.id)
      .eq("trail_id", trailId)
      .maybeSingle();

    if (existing) return [];

    // 3️⃣ Award token
    await supabase.from("user_tokens").insert({
      user_id: userId,
      token_id: token.id,
      trail_id: trailId,
      earned_at: new Date().toISOString(),
    });
  }

  // return full token in both reward and detect mode
  return [
    {
      id: token.id,
      title: token.title,
      description: token.description,
      icon_emoji: token.icon_emoji,
    },
  ];
}
