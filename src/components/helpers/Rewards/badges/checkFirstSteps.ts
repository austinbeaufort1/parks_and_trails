import { supabase } from "../../../../connection/supabase";
import { EarnedBadge } from "./types";

export async function checkFirstSteps(
  userId: string,
): Promise<EarnedBadge | null> {
  // Count total completions
  const { count } = await supabase
    .from("user_completed_trails")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // First trail badge logic
  if (count === 1) {
    const { data: badge } = await supabase
      .from("badges")
      .select("*")
      .eq("title", "First Steps")
      .single();

    if (badge) {
      // prevent duplicates
      const { data: existing } = await supabase
        .from("user_badges")
        .select("id")
        .eq("user_id", userId)
        .eq("badge_id", badge.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("user_badges").insert({
          user_id: userId,
          badge_id: badge.id,
          earned_at: new Date().toISOString(),
        });

        return {
          id: badge.id,
          title: badge.title,
          description: badge.description,
          icon_svg: badge.icon_svg,
        };
      }
    }
  }
  return null;
}
