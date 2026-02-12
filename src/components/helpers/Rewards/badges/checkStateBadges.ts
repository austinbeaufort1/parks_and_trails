import { supabase } from "../../../../connection/supabase";
import { EarnedBadge } from "./types";
import usStates from "@svg-maps/usa";

export async function checkStateBadges(
  userId: string,
  trailId: string,
): Promise<EarnedBadge[]> {
  const earnedBadges: EarnedBadge[] = [];

  // 1️⃣ Get the trail's state
  const { data: trail, error: trailError } = await supabase
    .from("trails")
    .select("state")
    .eq("id", trailId)
    .single();

  if (trailError || !trail) {
    console.error("Error fetching trail state:", trailError);
    return earnedBadges;
  }

  const stateAbbrev = trail.state.toLowerCase();
  const stateBadgeId = `state_${stateAbbrev}`;

  // 2️⃣ Count user's earned COUNTY badges in this state
  const { data: countyBadges, error: countyError } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId)
    .like("badge_id", `%_county_${stateAbbrev}`);

  if (countyError || !countyBadges) {
    console.error("Error fetching county badges:", countyError);
    return earnedBadges;
  }

  const uniqueCountyCount = new Set(countyBadges.map((b) => b.badge_id)).size;

  // 3️⃣ Delaware exception (only 3 counties)
  const requiredCountyBadges = stateAbbrev === "de" ? 3 : 5;

  if (uniqueCountyCount < requiredCountyBadges) return earnedBadges;

  // 4️⃣ Check if state badge already exists
  const { data: existing } = await supabase
    .from("user_badges")
    .select("id")
    .eq("user_id", userId)
    .eq("badge_id", stateBadgeId)
    .maybeSingle();

  if (existing) return earnedBadges;

  // 5️⃣ Fetch badge metadata
  const { data: badge } = await supabase
    .from("badges")
    .select("*")
    .eq("id", stateBadgeId)
    .single();

  if (!badge) {
    console.warn("Missing state badge definition:", stateBadgeId);
    return earnedBadges;
  }

  // 6️⃣ Award state badge
  await supabase.from("user_badges").insert({
    user_id: userId,
    badge_id: badge.id,
    earned_at: new Date().toISOString(),
  });

  // 7️⃣ Attach SVG path
  const stateFeature = usStates.locations.find(
    (state) => state.id === stateAbbrev,
  );

  earnedBadges.push({
    id: badge.id,
    title: badge.title,
    description: badge.description,
    icon_svg: badge.icon_svg,
    svgPath: stateFeature?.path,
  });

  return earnedBadges;
}
