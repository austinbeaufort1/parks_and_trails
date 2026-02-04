import { supabase } from "../../../connection/supabase";
import usStates from "@svg-maps/usa";
import usCounties from "@svg-maps/usa.counties";
import { getSeasonFromDate } from "./getSeasonFromDate";

interface EarnedBadge {
  id: string;
  title: string;
  description: string;
  icon_svg: string;
  svgPath?: string;
}

export async function checkBadges(userId: string, trailId: string) {
  const earnedBadges: EarnedBadge[] = [];

  const firstSteps = await checkFirstSteps(userId);
  const stateBadges = await checkStateBadges(userId, trailId);
  const seasonBadges = await checkSeasonBadges(userId);
  const countyBadges = await checkCountyBadges(userId, trailId);
  const nationalParkBadges = await checkNationalParkBadges(userId, trailId);
  const stateParkBadges = await checkStateParkBadges(userId, trailId);
  const holidayBadges = await checkHolidayBadges(userId);

  if (firstSteps !== null) {
    earnedBadges.push(firstSteps);
  }

  if (stateBadges && stateBadges.length >= 0) {
    earnedBadges.push(...stateBadges);
  }

  if (countyBadges && countyBadges.length >= 0) {
    earnedBadges.push(...countyBadges);
  }

  if (seasonBadges && seasonBadges.length >= 0) {
    earnedBadges.push(...seasonBadges);
  }

  if (nationalParkBadges && nationalParkBadges.length >= 0) {
    earnedBadges.push(...nationalParkBadges);
  }

  if (stateParkBadges && stateParkBadges.length >= 0) {
    earnedBadges.push(...stateParkBadges);
  }

  if (holidayBadges && holidayBadges.length >= 0) {
    earnedBadges.push(...holidayBadges);
  }

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
  const badgeId = `state_${stateAbbrev}`;

  // 2️⃣ Count user's completed trails in this state
  const { count, error } = await supabase
    .from("user_completed_trails")
    .select(
      `
      id,
      trails!inner (
        state
      )
    `,
      { count: "exact", head: true },
    )
    .eq("user_id", userId)
    .eq("trails.state", stateAbbrev.toUpperCase());

  if (error) {
    console.error("Error counting state completions:", error);
    return earnedBadges;
  }

  if (!count || count < 3) return earnedBadges;

  // 3️⃣ Check if badge already exists
  const { data: existing } = await supabase
    .from("user_badges")
    .select("id")
    .eq("user_id", userId)
    .eq("badge_id", badgeId)
    .maybeSingle();

  if (existing) return earnedBadges;

  // 4️⃣ Fetch badge metadata
  const { data: badge } = await supabase
    .from("badges")
    .select("*")
    .eq("id", badgeId)
    .single();

  if (!badge) return earnedBadges;

  // 5️⃣ Award badge
  await supabase.from("user_badges").insert({
    user_id: userId,
    badge_id: badge.id,
    earned_at: new Date().toISOString(),
  });

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

// Map month number (0-11) to season
const monthToSeason: Record<number, string> = {
  11: "winter", // Dec
  0: "winter", // Jan
  1: "winter", // Feb
  2: "spring", // Mar
  3: "spring", // Apr
  4: "spring", // May
  5: "summer", // Jun
  6: "summer", // Jul
  7: "summer", // Aug
  8: "autumn", // Sep
  9: "autumn", // Oct
  10: "autumn", // Nov
};

type Season = "winter" | "spring" | "summer" | "autumn";

function getSeasonYear(season: Season, date: Date) {
  const year = date.getFullYear();

  // Winter belongs to the year it starts
  if (season === "winter" && date.getMonth() < 11) {
    // Jan–Mar winter belongs to previous year
    return year - 1;
  }

  return year;
}

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

/********************* */
/* COUNTY BADGES */
/********************* */

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

  // 3️⃣ Count user's completed trails in this county
  const { count, error } = await supabase
    .from("user_completed_trails")
    .select(
      `
      id,
      trails!inner (
        county,
        state
      )
    `,
      { count: "exact", head: true },
    )
    .eq("user_id", userId)
    .eq("trails.county", trail.county)
    .eq("trails.state", trail.state);

  if (error) {
    console.error("Error counting county completions:", error);
    return earnedBadges;
  }

  if (!count || count < 3) return earnedBadges; // must complete 3 trails in the county

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

/********************* */
/* NATIONAL PARK BADGES */
/********************* */
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

  // avoid double "_national_park"
  if (!parkIdNormalized.endsWith("_national_park")) {
    parkIdNormalized += "_national_park";
  }

  const badgeId = parkIdNormalized;

  // 4️⃣ Count user's completed trails in this national park
  const { count, error } = await supabase
    .from("user_completed_trails")
    .select(`id, trails!inner (park_name)`, { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("trails.park_name", trail.park_name);

  if (error) {
    console.error("Error counting national park completions:", error);
    return earnedBadges;
  }

  // 5️⃣ Must complete at least 3 trails to earn badge
  if (!count || count < 3) return earnedBadges;

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

/********************* */
/*  STATE PARK BADGES */
/********************* */
export async function checkStateParkBadges(
  userId: string,
  trailId: string,
): Promise<EarnedBadge[]> {
  const earnedBadges: EarnedBadge[] = [];

  // 1️⃣ Get the trail's park_name and state_code
  const { data: trail, error: trailError } = await supabase
    .from("trails")
    .select("park_name, state") // Make sure your trails table has state_code
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
    .replace(/& Preserve|& Recreation Area/i, "") // optional cleanup
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  // avoid double "_state_park"
  if (!parkIdNormalized.endsWith("_state_park")) {
    parkIdNormalized += "_state_park";
  }

  // 3a️⃣ Add state code for uniqueness
  const stateCodeNormalized = trail.state.trim().toLowerCase();
  const badgeId = parkIdNormalized.replace(
    "_state_park",
    `_${stateCodeNormalized}_state_park`,
  );

  // 4️⃣ Count user's completed trails in this state park
  const { count, error } = await supabase
    .from("user_completed_trails")
    .select(`id, trails!inner (park_name)`, { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("trails.park_name", trail.park_name);

  if (error) {
    console.error("Error counting state park completions:", error);
    return earnedBadges;
  }

  // 5️⃣ Must complete at least 3 trails to earn badge
  if (!count || count < 3) return earnedBadges;

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

/********************* */
/*  HOLIDAY BADGES */
/********************* */

const holidayDates: Record<string, (date: Date) => boolean> = {
  groundhog: (d) => d.getUTCMonth() === 1 && d.getUTCDate() === 2, // Feb 2
  valentines: (d) => d.getUTCMonth() === 1 && d.getUTCDate() === 14, // Feb 14
  pi: (d) => d.getUTCMonth() === 2 && d.getUTCDate() === 14, // Mar 14
  st_paddys: (d) => d.getUTCMonth() === 2 && d.getUTCDate() === 17, // Mar 17
  fourth_of_july: (d) => d.getUTCMonth() === 6 && d.getUTCDate() === 4, // Jul 4
  halloween: (d) => d.getUTCMonth() === 9 && d.getUTCDate() === 31, // Oct 31
  veterans: (d) => d.getUTCMonth() === 10 && d.getUTCDate() === 11, // Nov 11
  christmas: (d) => d.getUTCMonth() === 11 && d.getUTCDate() === 25, // Dec 25
  new_year: (d) =>
    d.getUTCMonth() === 0 && d.getUTCDate() >= 1 && d.getUTCDate() <= 7, // Jan 1–7
};

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

/********************* */
/*  STREAK BADGES */
/********************* */
export async function checkStreakBadges(
  userId: string,
): Promise<EarnedBadge[]> {
  const earnedBadges: EarnedBadge[] = [];

  // 1️⃣ Fetch all completed trails
  const { data: trails, error } = await supabase
    .from("user_completed_trails")
    .select("completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: true }); // oldest first

  if (error || !trails) {
    console.error("Error fetching completed trails:", error);
    return earnedBadges;
  }

  if (trails.length === 0) return earnedBadges;

  // Helper to normalize date to start of day in UTC
  const normalizeDay = (d: Date) =>
    new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

  // ===============================
  // Compute Daily Streak
  // ===============================
  let maxDailyStreak = 0;
  let currentStreak = 1;

  for (let i = 1; i < trails.length; i++) {
    const prev = normalizeDay(new Date(trails[i - 1].completed_at));
    const curr = normalizeDay(new Date(trails[i].completed_at));
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
    } else if (diffDays > 1) {
      currentStreak = 1;
    }

    if (currentStreak > maxDailyStreak) maxDailyStreak = currentStreak;
  }

  // ===============================
  // Compute Weekly Streak
  // ===============================
  let maxWeeklyStreak = 0;
  currentStreak = 1;

  const getWeek = (date: Date) => {
    const d = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
    const day = d.getUTCDay();
    const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff),
    ).getTime();
  };

  for (let i = 1; i < trails.length; i++) {
    const prevWeek = getWeek(new Date(trails[i - 1].completed_at));
    const currWeek = getWeek(new Date(trails[i].completed_at));
    const diffWeeks = (currWeek - prevWeek) / (1000 * 60 * 60 * 24 * 7);

    if (diffWeeks === 1) {
      currentStreak++;
    } else if (diffWeeks > 1) {
      currentStreak = 1;
    }

    if (currentStreak > maxWeeklyStreak) maxWeeklyStreak = currentStreak;
  }

  // ===============================
  // Compute Monthly Streak
  // ===============================
  let maxMonthlyStreak = 0;
  currentStreak = 1;

  const getMonthKey = (date: Date) =>
    `${date.getUTCFullYear()}-${date.getUTCMonth()}`;

  for (let i = 1; i < trails.length; i++) {
    const prev = new Date(trails[i - 1].completed_at);
    const curr = new Date(trails[i].completed_at);
    const diffMonths =
      (curr.getUTCFullYear() - prev.getUTCFullYear()) * 12 +
      (curr.getUTCMonth() - prev.getUTCMonth());

    if (diffMonths === 1) {
      currentStreak++;
    } else if (diffMonths > 1) {
      currentStreak = 1;
    }

    if (currentStreak > maxMonthlyStreak) maxMonthlyStreak = currentStreak;
  }

  // ===============================
  // Award badges if thresholds met
  // ===============================
  const streakTypes: { type: "daily" | "weekly" | "monthly"; value: number }[] =
    [];

  // Daily thresholds
  const dailyThresholds = [
    3, 7, 14, 30, 60, 120, 240, 365, 730, 1095, 1460, 1825, 2555, 3650,
  ];
  dailyThresholds.forEach((t) => {
    if (maxDailyStreak >= t) streakTypes.push({ type: "daily", value: t });
  });

  // Weekly thresholds
  const weeklyThresholds = [4, 8, 16, 32, 52, 104, 156, 208, 260, 364, 520];
  weeklyThresholds.forEach((t) => {
    if (maxWeeklyStreak >= t) streakTypes.push({ type: "weekly", value: t });
  });

  // Monthly thresholds
  const monthlyThresholds = [3, 6, 12, 24, 36, 48, 60, 84, 120];
  monthlyThresholds.forEach((t) => {
    if (maxMonthlyStreak >= t) streakTypes.push({ type: "monthly", value: t });
  });

  // Award badges
  for (const streak of streakTypes) {
    const badgeId = `streak_${streak.type}_${streak.value}`;

    // Skip if user already has it
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

    // Award badge
    await supabase.from("user_badges").insert({
      user_id: userId,
      badge_id: badge.id,
      earned_at: new Date().toISOString(),
    });

    earnedBadges.push({
      id: badge.id,
      title: badge.title,
      description: badge.description,
      icon_svg: badge.icon_svg,
    });
  }

  return earnedBadges;
}
