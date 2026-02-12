import { supabase } from "../../../../connection/supabase";
import { STATE_COLLECTION_TIERS } from "./constants";
import { EarnedBadge } from "./types";

export async function checkStateCollectionBadges(
  userId: string,
): Promise<EarnedBadge[]> {
  const earnedBadges: EarnedBadge[] = [];

  // 1️⃣ Get all state badges the user has earned
  const { data: userStateBadges, error } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId)
    .like("badge_id", "state_%"); // only state badges

  if (error || !userStateBadges) {
    console.error("Error fetching user state badges:", error);
    return earnedBadges;
  }

  // 2️⃣ Count how many DISTINCT state badges
  const uniqueStatesCount = userStateBadges.length;

  // 3️⃣ Check against collection tiers
  for (const tier of STATE_COLLECTION_TIERS) {
    if (uniqueStatesCount >= tier.threshold) {
      // Check if user already has the collection badge
      const { data: existing } = await supabase
        .from("user_badges")
        .select("id")
        .eq("user_id", userId)
        .eq("badge_id", tier.id)
        .maybeSingle();

      if (!existing) {
        // Fetch badge metadata
        const { data: badge } = await supabase
          .from("badges")
          .select("*")
          .eq("id", tier.id)
          .single();

        if (badge) {
          // Award badge
          await supabase.from("user_badges").insert({
            user_id: userId,
            badge_id: badge.id,
            earned_at: new Date().toISOString(),
          });

          earnedBadges.push({
            id: badge.id,
            title: badge.title,
            description: badge.description,
            icon_svg: badge.icon_svg,
          });
        }
      }
    }
  }

  return earnedBadges;
}
