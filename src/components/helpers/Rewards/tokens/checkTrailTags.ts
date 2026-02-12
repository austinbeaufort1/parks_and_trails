import { supabase } from "../../../../connection/supabase";
import { EarnedToken } from "./types";

/**
 * New tag-based token checker (replaces checkGhostBridgeToken)
 * Awards any token matching a tag associated with this trail
 */
export async function checkTokensByTrailTags({
  userId,
  trailId,
}: {
  userId: string;
  trailId: string;
}): Promise<EarnedToken[]> {
  // 1️⃣ Fetch the trail and its tags
  const { data: trail, error: trailError } = await supabase
    .from("trails")
    .select("tags")
    .eq("id", trailId)
    .single();

  if (trailError || !trail || !trail.tags || trail.tags.length === 0) return [];

  const trailTags: string[] = trail.tags; // array of tag strings

  // 2️⃣ Fetch all tokens whose tag_id matches one of the trail's tags
  const { data: tokens, error: tokensError } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", trailTags);

  if (tokensError || !tokens || tokens.length === 0) return [];

  const tokenIds = tokens.map((t) => t.id);

  // 3️⃣ Batch check which tokens user already has for this trail
  const { data: existingTokens } = await supabase
    .from("user_tokens")
    .select("token_id")
    .eq("user_id", userId)
    .eq("trail_id", trailId)
    .in("token_id", tokenIds);

  const alreadyEarnedIds = new Set(
    existingTokens?.map((et: { token_id: string }) => et.token_id) || [],
  );

  // 4️⃣ Filter out tokens already earned
  const newTokens = tokens.filter((t) => !alreadyEarnedIds.has(t.id));

  // 5️⃣ Insert new tokens in batch
  if (newTokens.length > 0) {
    await supabase.from("user_tokens").insert(
      newTokens.map((t) => ({
        user_id: userId,
        token_id: t.id,
        trail_id: trailId,
        earned_at: new Date().toISOString(),
      })),
    );
  }

  // 6️⃣ Return the new tokens in the shape popup expects
  return newTokens.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    icon_emoji: t.icon_emoji,
  }));
}
