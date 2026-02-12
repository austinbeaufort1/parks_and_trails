import { supabase } from "../../../../connection/supabase";
import { monthToSeason } from "./constants";
import { getSeasonYear } from "./helpers";
import { EarnedBadge } from "./types";

export async function checkSeasonBadges(
  userId: string,
): Promise<EarnedBadge[]> {
  const earnedBadges: EarnedBadge[] = [];

  // 1️⃣ Fetch all completed trails for this user
  const { data: trails, error } = await supabase
    .from("user_completed_trails")
    .select("completed_at")
    .eq("user_id", userId);

  if (error || !trails) {
    console.error("Error fetching completed trails:", error);
    return earnedBadges;
  }

  // 2️⃣ Group completed trails by season (use UTC to avoid timezone issues)
  const seasonCounts: Record<string, number> = {
    winter: 0,
    spring: 0,
    summer: 0,
    autumn: 0,
  };

  trails.forEach((trail: any) => {
    const date = new Date(trail.completed_at);
    const month = date.getUTCMonth(); // use UTC month
    const season = monthToSeason[month];
    seasonCounts[season] = (seasonCounts[season] || 0) + 1;
  });

  // 3️⃣ Award badges if user completed 5+ hikes in a season
  for (const season of Object.keys(seasonCounts)) {
    const count = seasonCounts[season];
    if (count >= 5) {
      const now = new Date();

      const seasonYear = getSeasonYear(season, now);

      const badgeId = `season_${season}_${seasonYear}`;

      // Check if badge already exists
      const { data: existing } = await supabase
        .from("user_badges")
        .select("id")
        .eq("user_id", userId)
        .eq("badge_id", badgeId)
        .maybeSingle();

      if (existing) continue;

      // Fetch badge metadata
      const { data: badge } = await supabase
        .from("badges")
        .select("*")
        .eq("id", badgeId)
        .single();

      if (!badge) continue;

      // Award the badge (use current date as earned_at)
      await supabase.from("user_badges").insert({
        user_id: userId,
        badge_id: badge.id,
        earned_at: new Date().toISOString(),
      });

      // Push to returned array
      earnedBadges.push({
        id: badge.id,
        title: badge.title,
        description: badge.description,
        icon_svg: badge.icon_svg,
      });
    }
  }

  return earnedBadges;
}
