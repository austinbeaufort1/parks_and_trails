import { angleWeight } from "./difficulty";

type LandcoverPercent = {
  type: string;
  percent: number; // 0-100
};

function surfaceMultiplier(
  surface: string,
  waterDepthFeet?: number,
  waterCurrent?: "low" | "medium" | "high"
): number {
  const lc = surface.toLowerCase();

  // Locked multipliers
  if (lc.includes("developed") || lc.includes("asphalt")) return 0.9;
  if (lc.includes("gravel")) return 1.0;
  if (lc.includes("grass")) return 1.1;
  if (lc.includes("forest")) return 1.2;
  if (lc.includes("loose dirt") || lc.includes("dirt with rocks")) return 1.4;
  if (lc.includes("mud")) return 1.4;
  if (lc.includes("sand")) return 1.5;
  if (lc.includes("rock")) return 1.5;
  if (lc.includes("scree")) return 1.6;
  if (lc.includes("snow")) return 1.5;
  if (lc.includes("ice")) return 2.0;

  // Dynamic water handling
  if (lc.includes("water")) {
    // Use depth and current if provided
    let multiplier = 1.8; // default shallow/slow
    if (waterDepthFeet !== undefined && waterCurrent !== undefined) {
      multiplier =
        waterDepthFeet < 1
          ? waterCurrent === "low"
            ? 1.8
            : waterCurrent === "medium"
            ? 2.0
            : 2.2
          : waterDepthFeet < 3
          ? waterCurrent === "low"
            ? 2.2
            : waterCurrent === "medium"
            ? 2.4
            : 2.6
          : waterCurrent === "low"
          ? 2.5
          : waterCurrent === "medium"
          ? 2.7
          : 3.0;
    }
    return multiplier;
  }

  // Default
  return 1.0;
}

export function estimateTrailTime(
  total_distance_m: number,
  avgAngle: number,
  difficultyScore: number,
  landcoverPercents: LandcoverPercent[] = [],
  baseSpeedMph = 2
): string {
  const distanceMiles = total_distance_m / 1609.34; // 1 mile ≈ 1609.34 meters

  if (distanceMiles <= 0) return "0h 0m";

  // --- Weighted surface multiplier ---
  let weightedSurfaceMult = 1.0;
  if (landcoverPercents.length > 0) {
    const totalPercent = landcoverPercents.reduce(
      (sum, lc) => sum + lc.percent,
      0
    );
    if (totalPercent > 0) {
      weightedSurfaceMult =
        landcoverPercents.reduce(
          (sum, lc) => sum + surfaceMultiplier(lc.type) * lc.percent,
          0
        ) / totalPercent;
    }
  }

  // --- Angle slowdown factor (using your angleWeight mapping) ---
  // We'll normalize angleWeight to a factor that slows speed (higher angle → slower)
  const maxWeight = 25; // same as your difficulty max slope weight
  const weight = angleWeight(avgAngle);
  const angleFactor = 1 - weight / maxWeight / 2; // never slower than 50%

  const effectiveSpeed = (baseSpeedMph * angleFactor) / weightedSurfaceMult;

  // --- Time in hours ---
  const hours = distanceMiles / Math.max(effectiveSpeed, 0.1); // never divide by zero

  // --- Add small difficulty adjustment: just a few minutes per difficulty point ---
  const adjustedHours = hours + difficultyScore * 0.05; // ~3 min per difficulty point

  const h = Math.floor(adjustedHours);
  const m = Math.round((adjustedHours - h) * 60);

  if (h > 0) {
    return `${h}h ${m}mins`;
  }
  return `${m}mins`;
}
