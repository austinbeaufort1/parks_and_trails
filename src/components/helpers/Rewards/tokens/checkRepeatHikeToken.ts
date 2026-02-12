import { supabase } from "../../../../connection/supabase";
import { EarnedToken } from "./types";

export async function checkRepeatHikeToken({
  userId,
  timesCompleted,
  trailId,
}: {
  userId: string;
  timesCompleted: number;
  trailId: string;
}): Promise<EarnedToken | null> {
  const repeatTokens: Record<number, string> = {
    2: "path_replay",
    5: "high_five",
    10: "trail_veteran",
    25: "seasoned_pathwalker",
    50: "keeper_of_the_way",
    100: "legendary_wanderer",
  };

  const tokenId = repeatTokens[timesCompleted];
  if (!tokenId) return null;

  // Fetch token info
  const { data: token, error } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .eq("id", tokenId)
    .single();

  if (error || !token) {
    console.error("Error fetching token:", error);
    return null;
  }

  // Check if user already earned this token for this trail
  const { data: existing } = await supabase
    .from("user_tokens")
    .select("id")
    .eq("user_id", userId)
    .eq("token_id", token.id)
    .eq("trail_id", trailId)
    .maybeSingle();

  if (existing) return null;

  // Award token
  await supabase.from("user_tokens").insert({
    user_id: userId,
    token_id: token.id,
    trail_id: trailId,
    earned_at: new Date().toISOString(),
  });

  return {
    id: token.id,
    title: token.title,
    description: token.description,
    icon_emoji: token.icon_emoji,
  };
}
