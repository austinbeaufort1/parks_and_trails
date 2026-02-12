// badges/checkUniqueTrailBadges.ts
import { supabase } from "../../../../connection/supabase";
import { UNIQUE_TRAIL_BADGES } from "./constants";

export async function checkUniqueTrailBadges(userId: string) {
  // 1️⃣ Count unique trails completed
  const { data: rows, error } = await supabase
    .from("user_completed_trails")
    .select("trail_id", { count: "exact", head: false })
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to count unique trails", error);
    return [];
  }

  const uniqueTrailCount = new Set(rows?.map((r) => r.trail_id)).size;

  // 2️⃣ Find highest eligible badge
  const eligibleBadge = [...UNIQUE_TRAIL_BADGES]
    .reverse()
    .find((b) => uniqueTrailCount >= b.count);

  if (!eligibleBadge) return [];

  // 3️⃣ Check if user already has it
  const { data: existing } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId)
    .eq("badge_id", eligibleBadge.id)
    .maybeSingle();

  if (existing) return [];

  // 4️⃣ Insert badge
  await supabase.from("user_badges").insert({
    user_id: userId,
    badge_id: eligibleBadge.id,
    earned_at: new Date().toISOString(),
  });

  // 5️⃣ Return badge data for UI
  const { data: badge } = await supabase
    .from("badges")
    .select("*")
    .eq("id", eligibleBadge.id)
    .single();

  return badge ? [badge] : [];
}
