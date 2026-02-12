import { supabase } from "../../../../connection/supabase";
import { EarnedBadge } from "./types";

export async function checkNationalParkBadges(
  userId: string,
  trailId: string,
): Promise<EarnedBadge[]> {
  const earnedBadges: EarnedBadge[] = [];

  // 1️⃣ Get the trail's park_name
  const { data: trail, error: trailError } = await supabase
    .from("trails")
    .select("park_name")
    .eq("id", trailId)
    .single();

  if (trailError || !trail || !trail.park_name) {
    console.error("Error fetching trail info or no park_name:", trailError);
    return earnedBadges;
  }

  // 2️⃣ Check if this is a National Park
  const parkNameRaw = trail.park_name.trim();
  const isNationalPark = parkNameRaw.toLowerCase().includes("national park");
  if (!isNationalPark) return earnedBadges;

  // 3️⃣ Normalize park name for badge ID
  let parkIdNormalized = trail.park_name
    .replace(/& Preserve|& Recreation Area/i, "") // optional cleanup
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (!parkIdNormalized.endsWith("_national_park")) {
    parkIdNormalized += "_national_park";
  }

  const badgeId = parkIdNormalized;

  // 4️⃣ Get user's completed UNIQUE trails in this national park
  const { data, error } = await supabase
    .from("user_completed_trails")
    .select(
      `
      trail_id,
      trails!inner (park_name)
    `,
    )
    .eq("user_id", userId)
    .eq("trails.park_name", trail.park_name);

  if (error || !data) {
    console.error("Error fetching national park completions:", error);
    return earnedBadges;
  }

  const uniqueTrailCount = new Set(data.map((t) => t.trail_id)).size;

  // 5️⃣ Must complete at least 3 UNIQUE trails
  if (uniqueTrailCount < 3) return earnedBadges;

  // 6️⃣ Check if badge already exists
  const { data: existing } = await supabase
    .from("user_badges")
    .select("id")
    .eq("user_id", userId)
    .eq("badge_id", badgeId)
    .maybeSingle();

  if (existing) return earnedBadges;

  // 7️⃣ Fetch badge metadata
  const { data: badge } = await supabase
    .from("badges")
    .select("*")
    .eq("id", badgeId)
    .single();

  if (!badge) return earnedBadges;

  // 8️⃣ Award badge
  await supabase.from("user_badges").insert({
    user_id: userId,
    badge_id: badge.id,
    earned_at: new Date().toISOString(),
  });

  // 9️⃣ Push earned badge
  earnedBadges.push({
    id: badge.id,
    title: badge.title,
    description: badge.description,
    icon_svg: badge.icon_svg,
  });

  return earnedBadges;
}
