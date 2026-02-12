// badges/checkTotalElevationBadge.ts
import { supabase } from "../../../../connection/supabase";
import { TOTAL_ELEVATION_BADGES } from "./constants";

export async function checkTotalElevationBadge(userId: string) {
  // 1️⃣ Fetch completed trails with elevation from trails table
  const { data: rows, error } = await supabase
    .from("user_completed_trails")
    .select("trail_id, trails(elevation_gain_m)")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to fetch user completed trails:", error);
    return [];
  }

  // 2️⃣ Sum the elevation gains (in meters)
  const totalElevation =
    rows?.reduce((sum, row) => sum + (row.trails?.elevation_gain_m || 0), 0) ||
    0;

  // 3️⃣ Find highest eligible badge
  const eligibleBadge = [...TOTAL_ELEVATION_BADGES]
    .reverse()
    .find((b) => totalElevation >= b.count);

  if (!eligibleBadge) return [];

  // 4️⃣ Check if user already has this badge
  const { data: existing } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId)
    .eq("badge_id", eligibleBadge.id)
    .maybeSingle();

  if (existing) return [];

  // 5️⃣ Award the badge
  await supabase.from("user_badges").insert({
    user_id: userId,
    badge_id: eligibleBadge.id,
    earned_at: new Date().toISOString(),
  });

  // 6️⃣ Return badge info for UI
  const { data: badge } = await supabase
    .from("badges")
    .select("*")
    .eq("id", eligibleBadge.id)
    .single();

  return badge ? [badge] : [];
}
