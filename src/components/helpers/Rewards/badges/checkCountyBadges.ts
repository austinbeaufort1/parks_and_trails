import { supabase } from "../../../../connection/supabase";
import { EarnedBadge } from "./types";
import usCounties from "@svg-maps/usa.counties";

export async function checkCountyBadges(
  userId: string,
  trailId: string,
): Promise<EarnedBadge[]> {
  const earnedBadges: EarnedBadge[] = [];

  // 1️⃣ Get the trail's county and state
  const { data: trail, error: trailError } = await supabase
    .from("trails")
    .select("state, county")
    .eq("id", trailId)
    .single();

  if (trailError || !trail) {
    console.error("Error fetching trail info:", trailError);
    return earnedBadges;
  }

  // 2️⃣ Build badge ID
  const countyId = trail.county.toLowerCase().replace(/\s+/g, "_"); // normalize
  const stateId = trail.state.toLowerCase();
  const badgeId = `${countyId}_county_${stateId}`; // must match your badges table

  // 3️⃣ Get user's completed UNIQUE trails in this county
  const { data, error } = await supabase
    .from("user_completed_trails")
    .select(
      `
    trail_id,
    trails!inner (
      county,
      state
    )
  `,
    )
    .eq("user_id", userId)
    .eq("trails.county", trail.county)
    .eq("trails.state", trail.state);

  if (error || !data) {
    console.error("Error fetching county completions:", error);
    return earnedBadges;
  }

  const uniqueTrailCount = new Set(data.map((t) => t.trail_id)).size;

  if (uniqueTrailCount < 3) return earnedBadges;

  // 4️⃣ Check if badge already exists
  const { data: existing } = await supabase
    .from("user_badges")
    .select("id")
    .eq("user_id", userId)
    .eq("badge_id", badgeId)
    .maybeSingle();

  if (existing) return earnedBadges;

  // 5️⃣ Fetch badge metadata
  const { data: badge } = await supabase
    .from("badges")
    .select("*")
    .eq("id", badgeId)
    .single();

  if (!badge) return earnedBadges;

  // 6️⃣ Award badge
  await supabase.from("user_badges").insert({
    user_id: userId,
    badge_id: badge.id,
    earned_at: new Date().toISOString(),
  });

  // 7️⃣ Get county SVG path from usCounties.locations
  const countyFeature = usCounties.locations.find((c) => {
    // split location id like "westmoreland-pa"
    const [countyPart, statePart] = c.id.split("-");

    // normalize trail county and state
    const trailCountyNorm = trail.county.toLowerCase().replace(/[\s']/g, "");
    const trailStateNorm = trail.state.toLowerCase();

    // match county start and state abbreviation
    return (
      countyPart.startsWith(trailCountyNorm) && statePart === trailStateNorm
    );
  });

  // 8️⃣ Push earned badge with optional SVG
  earnedBadges.push({
    id: badge.id,
    title: badge.title,
    description: badge.description,
    icon_svg: badge.icon_svg,
    svgPath: countyFeature?.path, // safe now
  });

  return earnedBadges;
}
