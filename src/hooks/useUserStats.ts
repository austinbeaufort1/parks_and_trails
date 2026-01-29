// src/hooks/useUserStats.ts
import { useState, useEffect } from "react";
import { supabase } from "../connection/supabase";

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

  const fetchStats = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("user_completed_trails")
      .select(
        `
    trail_id,
    trails!fk_trail(
      title,
      park_name,
      total_distance_m,
      elevation_gain_m,
      max_angle
    )
  `,
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
      });
      setLoading(false);
      return;
    }

    const completedTrails = data.map((row) => row.trails);

    const totalDistance = completedTrails.reduce(
      (sum, t) => sum + (t.total_distance_m ?? 0),
      0,
    );

    const totalElevation = completedTrails.reduce(
      (sum, t) => sum + (t.elevation_gain_m ?? 0),
      0,
    );

    const steepestTrail = completedTrails.reduce(
      (acc, t) =>
        t.max_angle > (acc?.maxAngle ?? 0)
          ? {
              maxAngle: t.max_angle,
              title: t.title,
              park_name: t.park_name,
            }
          : acc,
      null as { maxAngle: number; title: string; park_name: string } | null,
    );

    const longestTrail = completedTrails.reduce(
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

    setStats({
      totalDistance,
      totalElevation,
      totalCompleted: data.length,
      steepestTrail,
      longestTrail,
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
  };
}
