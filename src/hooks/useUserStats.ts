// src/hooks/useUserStats.ts
import { useState, useEffect } from "react";
import { supabase } from "../connection/supabase";
import { TrailCard } from "../types/trail";

export type UserStats = {
  totalDistance: number;
  totalElevation: number;
  totalCompleted: number;
  steepestTrail: {
    title: string;
    maxAngle: number;
    park_name: string;
  } | null;
  longestTrail: {
    title: string;
    distance: number;
    park_name: string;
  } | null;
  recentMomentum?: {
    trailsCompleted: number;
    distance: number;
    elevation: number;
    activeDays: number;
  };
  consistency?: {
    longestStreak: number;
    currentStreak: number;
    avgTrailsPerWeek: number;
    mostActiveWeekday: string;
  };
  firstsAndBests?: {
    firstTrail?: { title: string; park_name: string; date: string };
    firstPark?: { park_name: string; date: string };
    highestElevationDay?: { date: string; elevation: number };
    longestDay?: { date: string; distance: number };
  };
  style?: {
    averageSteepness: number; // degrees
    averageElevationPerMile: number; // meters per mile (or convert)
    typicalTrailLength: number; // meters or miles
    favoritePark?: string;
  };
};

export type CompletedTrail = {
  total_distance_m: number;
  elevation_gain_m: number;
  completed_at: string; // from supabase
};

export function useUserStats(userId: string | null) {
  const [stats, setStats] = useState<UserStats>({
    totalDistance: 0,
    totalElevation: 0,
    totalCompleted: 0,
    steepestTrail: null,
    longestTrail: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedTrails, setCompletedTrails] = useState<TrailCard[]>([]);

  const fetchStats = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("user_completed_trails")
      .select(
        `completed_at,
       trail_id,
       trails!fk_trail(
         title,
         park_name,
         total_distance_m,
         elevation_gain_m,
         max_angle
       )`,
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user stats:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setStats({
        totalDistance: 0,
        totalElevation: 0,
        totalCompleted: 0,
        steepestTrail: null,
        longestTrail: null,
        recentMomentum: {
          trailsCompleted: 0,
          distance: 0,
          elevation: 0,
          activeDays: 0,
        },
      });
      setLoading(false);
      return;
    }

    const trails = data.map((row) => {
      return {
        ...row.trails,
        completedAt: new Date(row.completed_at),
      };
    });
    setCompletedTrails(trails);

    // Total stats
    const totalDistance = trails.reduce(
      (sum, t) => sum + (t.total_distance_m ?? 0),
      0,
    );
    const totalElevation = trails.reduce(
      (sum, t) => sum + (t.elevation_gain_m ?? 0),
      0,
    );

    const steepestTrail = trails.reduce(
      (acc, t) =>
        t.max_angle > (acc?.maxAngle ?? 0)
          ? { maxAngle: t.max_angle, title: t.title, park_name: t.park_name }
          : acc,
      null as { maxAngle: number; title: string; park_name: string } | null,
    );

    const longestTrail = trails.reduce(
      (acc, t) =>
        t.total_distance_m > (acc?.distance ?? 0)
          ? {
              distance: t.total_distance_m,
              title: t.title,
              park_name: t.park_name,
            }
          : acc,
      null as { distance: number; title: string; park_name: string } | null,
    );

    // Recent Momentum (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const recentTrails = trails.filter((t) => t.completedAt >= thirtyDaysAgo);

    const recentMomentum = {
      trailsCompleted: recentTrails.length,
      distance: recentTrails.reduce(
        (sum, t) => sum + (t.total_distance_m ?? 0),
        0,
      ),
      elevation: recentTrails.reduce(
        (sum, t) => sum + (t.elevation_gain_m ?? 0),
        0,
      ),
      activeDays: new Set(recentTrails.map((t) => t.completedAt.toDateString()))
        .size,
    };

    // Prepare dates for streaks
    const trailDates = trails
      .map((t) => t.completedAt.toDateString()) // normalize to date string
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const uniqueDates = Array.from(new Set(trailDates));

    // Longest streak calculation
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i - 1]);
      const curr = new Date(uniqueDates[i]);
      const diffDays =
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        tempStreak += 1;
      } else {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;

    // Current streak (ending today)
    currentStreak = 0;
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const day = new Date(uniqueDates[i]);
      const diff = (now.getTime() - day.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= currentStreak) {
        currentStreak++;
      } else if (diff === currentStreak + 1) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Average trails per week
    const firstDate = new Date(uniqueDates[0]);
    const weeks = Math.max(
      (now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7),
      1,
    );
    const avgTrailsPerWeek = trails.length / weeks;

    // Most active weekday
    const weekdayCount: Record<number, number> = {};
    trails.forEach((t) => {
      const day = t.completedAt.getDay(); // 0 = Sunday
      weekdayCount[day] = (weekdayCount[day] || 0) + 1;
    });
    const mostActiveWeekdayIndex = Object.entries(weekdayCount).reduce(
      (max, [day, count]) => (count > max.count ? { day: +day, count } : max),
      { day: 0, count: 0 },
    ).day;
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const mostActiveWeekday = weekdays[mostActiveWeekdayIndex];

    // Sort trails by completedAt ascending
    const sortedByDate = [...trails].sort(
      (a, b) => a.completedAt.getTime() - b.completedAt.getTime(),
    );

    // First trail
    const firstTrailEntry = sortedByDate[0];
    const firstTrail = firstTrailEntry
      ? {
          title: firstTrailEntry.title,
          park_name: firstTrailEntry.park_name,
          date: firstTrailEntry.completedAt.toDateString(),
        }
      : undefined;

    // First park
    const seenParks = new Set<string>();
    let firstPark;
    for (const t of sortedByDate) {
      if (!seenParks.has(t.park_name)) {
        seenParks.add(t.park_name);
        firstPark = {
          park_name: t.park_name,
          date: t.completedAt.toDateString(),
        };
        break;
      }
    }

    // Highest elevation day
    // Group trails by day and sum elevation per day
    const elevationByDay: Record<string, number> = {};
    const distanceByDay: Record<string, number> = {};
    trails.forEach((t) => {
      const day = t.completedAt.toDateString();
      elevationByDay[day] =
        (elevationByDay[day] || 0) + (t.elevation_gain_m ?? 0);
      distanceByDay[day] =
        (distanceByDay[day] || 0) + (t.total_distance_m ?? 0);
    });

    const highestElevationDayEntry = Object.entries(elevationByDay).reduce(
      (max, [day, elev]) =>
        elev > max.elevation ? { date: day, elevation: elev } : max,
      { date: "", elevation: 0 },
    );

    const longestDayEntry = Object.entries(distanceByDay).reduce(
      (max, [day, dist]) =>
        dist > max.distance ? { date: day, distance: dist } : max,
      { date: "", distance: 0 },
    );

    // Average steepness
    const averageSteepness =
      trails.reduce((sum, t) => sum + (t.max_angle ?? 0), 0) /
      (trails.length || 1);

    // Average elevation per mile
    const totalDistanceMiles =
      trails.reduce((sum, t) => sum + (t.total_distance_m ?? 0), 0) / 1609.34; // meters → miles
    const averageElevationPerMile =
      totalDistanceMiles > 0
        ? trails.reduce((sum, t) => sum + (t.elevation_gain_m ?? 0), 0) /
          totalDistanceMiles
        : 0;

    // Typical trail length
    const typicalTrailLength =
      trails.reduce((sum, t) => sum + (t.total_distance_m ?? 0), 0) /
      (trails.length || 1);

    // Favorite park (most visited)
    const parkCounts: Record<string, number> = {};
    trails.forEach((t) => {
      parkCounts[t.park_name] = (parkCounts[t.park_name] || 0) + 1;
    });
    const favoritePark = Object.entries(parkCounts).reduce(
      (max, [park, count]) => (count > max.count ? { park, count } : max),
      { park: "", count: 0 },
    ).park;

    setStats({
      totalDistance,
      totalElevation,
      totalCompleted: data.length,
      steepestTrail,
      longestTrail,
      recentMomentum,
      consistency: {
        longestStreak,
        currentStreak,
        avgTrailsPerWeek: parseFloat(avgTrailsPerWeek.toFixed(2)),
        mostActiveWeekday,
      },
      firstsAndBests: {
        firstTrail,
        firstPark,
        highestElevationDay:
          highestElevationDayEntry.elevation > 0
            ? highestElevationDayEntry
            : undefined,
        longestDay: longestDayEntry.distance > 0 ? longestDayEntry : undefined,
      },
      style: {
        averageSteepness: parseFloat(averageSteepness.toFixed(1)),
        averageElevationPerMile: parseFloat(averageElevationPerMile.toFixed(1)),
        typicalTrailLength: parseFloat(typicalTrailLength.toFixed(1)),
        favoritePark: favoritePark || undefined,
      },
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [userId]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats, // 👈 THIS is what you were missing
    completedTrails,
  };
}
