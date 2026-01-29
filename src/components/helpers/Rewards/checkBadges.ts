import { supabase } from "../../../connection/supabase";
import usStates from "@svg-maps/usa";

interface EarnedBadge {
  id: string;
  title: string;
  description: string;
  icon_svg: string;
  svgPath?: string;
}

export async function checkBadges(userId: string) {
  const earnedBadges: EarnedBadge[] = [];

  const firstSteps = await checkFirstSteps(userId);

  // const stateBadges = await checkStateBadges(userId);

  if (firstSteps !== null) {
    earnedBadges.push(firstSteps);
  }

  // if (stateBadges && stateBadges.length >= 0) {
  //   earnedBadges.push(...stateBadges);
  // }

  return earnedBadges;
}

async function checkFirstSteps(userId: string): Promise<EarnedBadge | null> {
  // Count total completions
  const { count } = await supabase
    .from("user_completed_trails")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // First trail badge logic
  if (count === 1) {
    const { data: badge } = await supabase
      .from("badges")
      .select("*")
      .eq("title", "First Steps")
      .single();

    if (badge) {
      // prevent duplicates
      const { data: existing } = await supabase
        .from("user_badges")
        .select("id")
        .eq("user_id", userId)
        .eq("badge_id", badge.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("user_badges").insert({
          user_id: userId,
          badge_id: badge.id,
          earned_at: new Date().toISOString(),
        });

        return {
          id: badge.id,
          title: badge.title,
          description: badge.description,
          icon_svg: badge.icon_svg,
        };
      }
    }
  }
  return null;
}

export async function checkStateBadges(userId: string) {
  const earnedBadges: EarnedBadge[] = [];

  // Get all 50 state badges from your badges table
  const { data: allStateBadges } = await supabase
    .from("badges")
    .select("*")
    .like("id", "state_%"); // state badges have id like 'state_CA'

  if (!allStateBadges) return earnedBadges;

  // Loop through each state badge
  for (const badge of allStateBadges) {
    const stateAbbrev = badge.id.split("_")[1]; // e.g. "CA"
    console.log("STATE ABBREV", stateAbbrev.toUpperCase());

    // Count trails completed in this state
    // Count how many trails a user completed in a specific state
    // 1️⃣ Get trail IDs in this state
    const { data: trailsInState, error: trailsError } = await supabase
      .from("trails")
      .select("id")
      .eq("state", stateAbbrev.toUpperCase());

    if (trailsError) {
      console.error("Error fetching trails in state:", trailsError);
      return;
    }

    const trailIds = trailsInState?.map((trail) => trail.id) ?? [];

    if (trailIds.length === 0) {
      console.log("No trails in this state");
      return;
    }

    // 2️⃣ Count completed trails for user in those IDs
    const { count, error: countError } = await supabase
      .from("user_completed_trails")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("trail_id", trailIds);

    if (countError) {
      console.error("Error counting user trails:", countError);
    } else {
      console.log(`User ${userId} completed ${count} trails in ${stateAbbrev}`);
    }

    // If 5+ trails completed and badge not yet earned
    if (count && count >= 5) {
      const { data: existing } = await supabase
        .from("user_badges")
        .select("id")
        .eq("user_id", userId)
        .eq("badge_id", badge.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("user_badges").insert({
          user_id: userId,
          badge_id: badge.id,
          earned_at: new Date().toISOString(),
        });

        // Get the SVG path from npm package
        const stateFeature = usStates.features.find(
          (f) => f.id === stateAbbrev,
        );

        earnedBadges.push({
          id: badge.id,
          title: badge.title,
          description: badge.description,
          icon_svg: "",
          svgPath: stateFeature?.path,
        });
      }
    }
  }

  return earnedBadges;
}
