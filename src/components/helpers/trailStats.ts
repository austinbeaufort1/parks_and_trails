import { TrailPoint } from "../../types/trailPoint";

export function calculateElevationStats(points: TrailPoint[]) {
  let gain = 0;
  let loss = 0;

  for (let i = 1; i < points.length; i++) {
    const diff = points[i].ele - points[i - 1].ele;
    diff > 0 ? (gain += diff) : (loss += Math.abs(diff));
  }

  return {
    elevationGain: Math.max(gain, loss),
    maxAngle: calculateCruxAngle(points),
    avgAngle: points.reduce((sum, p) => sum + p.slopeDeg, 0) / points.length,
  };
}

export function calculateCruxAngle(points: TrailPoint[]): number {
  if (points.length === 0) return 0;
  if (points.length === 1) return points[0].slopeDeg;

  const peakIndex = points
    .map((p) => p.slopeDeg)
    .reduce((maxIdx, val, i, arr) => (val > arr[maxIdx] ? i : maxIdx), 0);

  const windowOffsets = [
    [-4, 0], // a) 4 before, peak
    [-3, 1], // b) 3 before, peak, 1 after
    [-2, 2], // c) 2 before, peak, 2 after
    [-1, 3], // d) 1 before, peak, 3 after
    [0, 4], // e) peak, 4 after
  ];

  let maxAvg = 0;

  for (const [startOffset, endOffset] of windowOffsets) {
    const start = Math.max(0, peakIndex + startOffset);
    const end = Math.min(points.length - 1, peakIndex + endOffset);

    const slice = points.slice(start, end + 1);
    const avg = slice.reduce((sum, p) => sum + p.slopeDeg, 0) / slice.length;

    if (avg > maxAvg) maxAvg = avg;
  }

  return maxAvg;
}

/* ---------- Distance (out & back detection) ---------- */
export function adjustDistanceForOutAndBack(points: TrailPoint[]) {
  if (points.length < 2) return 0;

  const start = points[0];
  const end = points.at(-1)!;

  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(end.lat - start.lat);
  const dLon = toRad(end.lon - start.lon);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(start.lat)) *
      Math.cos(toRad(end.lat)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const startEndDistMeters = R * c;

  const isOutAndBack = startEndDistMeters > 50;

  return points.at(-1)!.distFeet * (isOutAndBack ? 2 : 1);
}

/* ---------- Landcover ---------- */
export function calculateLandcoverPercentages(points: TrailPoint[]) {
  const counts: Record<string, number> = {};

  points.forEach((p) => {
    if (p.landcover) {
      counts[p.landcover] = (counts[p.landcover] || 0) + 1;
    }
  });

  const total = points.length;

  return Object.entries(counts).map(([type, count]) => ({
    type,
    percent: Math.round((count / total) * 100),
  }));
}

export function calculateAvgCanopy(points: TrailPoint[]) {
  return Math.round(
    points.reduce((sum, p) => sum + p.canopy, 0) / points.length
  );
}

export function gradeToDegrees(gradePercent: number) {
  return Math.atan(gradePercent / 100) * (180 / Math.PI);
}
