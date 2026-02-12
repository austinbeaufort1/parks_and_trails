// src/hooks/usePerformanceStats.ts
import { useMemo } from "react";

export type TimeframeComparison = {
  current: number; // meters
  previous: number; // meters
  changePercent: number | null;
};

export type PerformanceStats = {
  daily?: TimeframeComparison;
  weekly?: TimeframeComparison;
  monthly?: TimeframeComparison;
  yearly?: TimeframeComparison;
};

// Normalize a date to local calendar day (ignore time)
const localDate = (date: string | Date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

function calculatePercentChange(current: number, previous: number) {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function usePerformanceStats(
  completedTrails: { total_distance_m: number; completedAt: Date }[],
): PerformanceStats {
  return useMemo(() => {
    const now = new Date();

    // Sum distances for trails completed between start/end (inclusive), comparing only local calendar day
    function sumDistanceInPeriod(start: Date, end: Date) {
      const startDay = localDate(start).getTime();
      const endDay = localDate(end).getTime();

      return completedTrails
        .filter((t) => {
          const trailDay = localDate(t.completedAt).getTime();
          return trailDay >= startDay && trailDay <= endDay;
        })
        .reduce((sum, t) => sum + t.total_distance_m, 0);
    }

    function getRollingComparison(days: number): TimeframeComparison {
      const currentEnd = now;
      const currentStart = new Date();
      currentStart.setDate(currentEnd.getDate() - days + 1);

      const previousEnd = new Date(currentStart);
      previousEnd.setDate(currentStart.getDate() - 1);

      const previousStart = new Date(previousEnd);
      previousStart.setDate(previousEnd.getDate() - days + 1);

      const current = sumDistanceInPeriod(currentStart, currentEnd);
      const previous = sumDistanceInPeriod(previousStart, previousEnd);

      return {
        current,
        previous,
        changePercent: calculatePercentChange(current, previous),
      };
    }

    return {
      daily: getRollingComparison(1),
      weekly: getRollingComparison(7),
      monthly: getRollingComparison(30),
      yearly: getRollingComparison(365),
    };
  }, [completedTrails]);
}
