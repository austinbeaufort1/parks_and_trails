import { supabase } from "../../../../connection/supabase";
import { EarnedBadge } from "./types";

export async function checkStateParkBadges(
  userId: string,
  trailId: string,
): Promise<EarnedBadge[]> {
  const earnedBadges: EarnedBadge[] = [];

  // 1️⃣ Get the trail's park_name and state
  const { data: trail, error: trailError } = await supabase
    .from("trails")
    .select("park_name, state")
    .eq("id", trailId)
    .single();

  if (trailError || !trail || !trail.park_name || !trail.state) {
    console.error(
      "Error fetching trail info or missing park_name/state:",
      trailError,
    );
    return earnedBadges;
  }

  // 2️⃣ Check if this is a State Park
  const parkNameRaw = trail.park_name.trim();
  const isStatePark = parkNameRaw.toLowerCase().includes("state park");

  if (!isStatePark) return earnedBadges;

  // 3️⃣ Normalize park name for badge ID
  let parkIdNormalized = trail.park_name
    .replace(/& Preserve|& Recreation Area/i, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (!parkIdNormalized.endsWith("_state_park")) {
    parkIdNormalized += "_state_park";
  }

  // 3a️⃣ Add state code for uniqueness
  const stateCodeNormalized = trail.state.trim().toLowerCase();
  const badgeId = parkIdNormalized.replace(
    "_state_park",
    `_${stateCodeNormalized}_state_park`,
  );

  // 4️⃣ Get user's completed UNIQUE trails in this state park
  const { data, error } = await supabase
    .from("user_completed_trails")
    .select(
      `
      trail_id,
      trails!inner (
        park_name
      )
    `,
    )
    .eq("user_id", userId)
    .eq("trails.park_name", trail.park_name);

  if (error || !data) {
    console.error("Error fetching state park completions:", error);
    return earnedBadges;
  }

  const uniqueTrailCount = new Set(data.map((t) => t.trail_id)).size;

  // 5️⃣ Must complete at least 2 UNIQUE trails
  if (uniqueTrailCount < 2) return earnedBadges;

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
