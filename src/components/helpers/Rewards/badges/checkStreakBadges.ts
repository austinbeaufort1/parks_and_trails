import { supabase } from "../../../../connection/supabase";
import { EarnedBadge } from "./types";

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
