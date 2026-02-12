// badges/checkTotalDistanceBadges.ts
import { supabase } from "../../../../connection/supabase";
import { TOTAL_DISTANCE_BADGES } from "./constants";

export async function checkTotalDistanceBadges(userId: string) {
  // 1️⃣ Fetch user's completed trails including distance
  const { data: rows, error } = await supabase
    .from("user_completed_trails")
    .select("trail_id, trails!inner(total_distance_m)")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to fetch user completed trails with distance", error);
    return [];
  }

  // 2️⃣ Sum total distance in meters
  const totalDistanceMeters =
    rows?.reduce((sum, row) => sum + (row.trails.total_distance_m || 0), 0) ??
    0;

  // 3️⃣ Find highest eligible badge
  const eligibleBadge = [...TOTAL_DISTANCE_BADGES]
    .reverse()
    .find((b) => totalDistanceMeters >= b.meters);

  if (!eligibleBadge) return [];

  // 4️⃣ Check if user already has it
  const { data: existing } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId)
    .eq("badge_id", eligibleBadge.id)
    .maybeSingle();

  if (existing) return [];

  // 5️⃣ Insert badge
  await supabase.from("user_badges").insert({
    user_id: userId,
    badge_id: eligibleBadge.id,
    earned_at: new Date().toISOString(),
  });

  // 6️⃣ Return badge data for UI
  const { data: badge } = await supabase
    .from("badges")
    .select("*")
    .eq("id", eligibleBadge.id)
    .single();

  return badge ? [badge] : [];
}
