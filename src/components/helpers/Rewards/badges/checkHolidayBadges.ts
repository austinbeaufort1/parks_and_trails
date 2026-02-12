import { supabase } from "../../../../connection/supabase";
import { holidayDates } from "./constants";
import { EarnedBadge } from "./types";

export async function checkHolidayBadges(
  userId: string,
): Promise<EarnedBadge[]> {
  const earnedBadges: EarnedBadge[] = [];

  // 1️⃣ Fetch all completed trails
  const { data: trails, error } = await supabase
    .from("user_completed_trails")
    .select("completed_at");

  if (error || !trails) {
    console.error("Error fetching completed trails:", error);
    return earnedBadges;
  }

  // const testDates = [
  //   new Date("2026-02-14"), // Valentine's Day
  //   new Date("2026-03-17"), // St. Patrick's
  //   new Date("2026-07-04"), // 4th of July
  // ];

  // 2️⃣ Check each trail against holidays
  for (const trail of trails) {
    const date = new Date(trail.completed_at);

    for (const [holiday, isMatch] of Object.entries(holidayDates)) {
      if (!isMatch(date)) continue;

      // Determine badge year (for the badge ID)
      const year = date.getUTCFullYear();
      const badgeId = `holiday_${holiday}_${year}`;

      // 3️⃣ Skip if user already has badge
      const { data: existing } = await supabase
        .from("user_badges")
        .select("id")
        .eq("user_id", userId)
        .eq("badge_id", badgeId)
        .maybeSingle();

      if (existing) continue;

      // 4️⃣ Fetch badge metadata
      const { data: badge } = await supabase
        .from("badges")
        .select("*")
        .eq("id", badgeId)
        .single();

      if (!badge) continue;

      // 5️⃣ Award badge
      await supabase.from("user_badges").insert({
        user_id: userId,
        badge_id: badge.id,
        earned_at: new Date().toISOString(),
      });

      // 6️⃣ Push to earned array
      earnedBadges.push({
        id: badge.id,
        title: badge.title,
        description: badge.description,
        icon_svg: badge.icon_svg,
        // earned_at: new Date().toISOString(),
      });
    }
  }

  return earnedBadges;
}
