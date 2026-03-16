import { TrailPoint } from "../../types/trailPoint";

export function angleWeight(angle: number): number {
  if (angle < 1) return 0.5; // "#4caf50"
  if (angle < 2) return 1.0; // "#8bc34a"
  if (angle < 4) return 1.5; // "#cddc39"
  if (angle < 8) return 2.5; // "#ffeb3b"
  if (angle < 12) return 4.0; // "#ffc107"
  if (angle < 20) return 6.0; // "#ff9800"
  if (angle < 28) return 8.0; // "#f44336"
  if (angle < 35) return 10.0; // "#b71c1c"
  if (angle < 40) return 12.0; // "#ff00ff"
  if (angle < 45) return 14.0; // "#d500f9"
  if (angle < 50) return 16.0; // "#9c27b0"
  if (angle < 60) return 18.0; // "#6a1b9a"
  if (angle < 70) return 20.0; // "#4a148c"
  if (angle < 80) return 22.0; // "#1a0a4d"
  return 25.0; // "#000000" for extreme slopes
}

export function surfaceMultiplier(
  surface: string,
  waterDepthFeet?: number,
  waterCurrent?: "low" | "medium" | "high",
): number {
  const lc = surface.toLowerCase();

  // Locked multipliers
  if (lc.includes("concrete") || lc.includes("asphalt")) return 0.7;
  if (lc.includes("packed_gravel") || lc.includes("brick")) return 0.8;
  if (lc.includes("gravel")) return 0.9;
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

export function calculateDifficulty(points: TrailPoint[]) {
  let total = 0;

  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];

    const segmentFeet = p1.distFeet - p0.distFeet;
    if (segmentFeet <= 0) continue;

    const segmentMiles = segmentFeet / 5280;

    total +=
      segmentMiles * angleWeight(p1.slopeDeg) * surfaceMultiplier(p1.landcover);
  }

  // --- Detect out-and-back for fatigue bonus ---
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

  const totalMiles = points.at(-1)!.distFeet / 5280;
  const fatigueBonus = totalMiles * (isOutAndBack ? 4 : 2); // double if out-and-back

  return Math.round((total + fatigueBonus) * 10) / 10;
}

export function getDifficultyDescription(score: number) {
  if (score < 0.3) return "🐣";
  if (score < 0.7) return "🌱";
  if (score < 1.5) return "🟢";
  if (score < 2.5) return "🟢🟢";
  if (score < 3.5) return "🟢🟢🟢";
  if (score < 5) return "🟡";
  if (score < 6.5) return "🟡🟡";
  if (score < 8) return "🟡🟡🟡";
  if (score < 9.5) return "🟠";
  if (score < 11) return "🟠🟠";
  if (score < 12.5) return "🟠🟠🟠";
  if (score < 14) return "🔴";
  if (score < 15.5) return "🔴🔴";
  if (score < 17) return "🔴🔴🔴";
  if (score < 19) return "🟣";
  if (score < 21) return "🟣🟣";
  if (score < 23) return "🟣🟣🟣";
  if (score < 26) return "⚫";
  if (score < 29) return "⚫⚫";
  if (score < 32) return "⚫⚫⚫";
  if (score < 35) return "🔥";
  if (score < 38) return "🔥🔥";
  if (score < 41) return "🔥🔥🔥";
  if (score < 46) return "⚡";
  if (score < 51) return "⚡⚡";
  if (score < 56) return "⚡⚡⚡";
  if (score < 61) return "🌋";
  if (score < 66) return "🌋🌋";
  if (score < 71) return "🌋🌋🌋";
  if (score < 81) return "🎖️";
  if (score < 91) return "🎖️🎖️";
  if (score < 101) return "🎖️🎖️🎖️";
  if (score < 111) return "🏆";
  if (score < 121) return "🏆🏆";
  if (score < 131) return "🏆🏆🏆";
  if (score < 151) return "💠";
  if (score < 171) return "💠💠";
  if (score < 191) return "💠💠💠";
  if (score < 211) return "💎";
  if (score < 231) return "💎💎";
  if (score < 251) return "💎💎💎";
  if (score < 291) return "👑";
  if (score < 331) return "👑👑";
  if (score < 371) return "👑👑👑";
  if (score < 411) return "🌟";
  if (score < 451) return "🌟🌟";
  if (score < 491) return "🌟🌟🌟";
  if (score < 571) return "🪐";
  if (score < 651) return "🪐🪐";
  if (score < 731) return "🪐🪐🪐";
  if (score < 811) return "🧙";
  if (score < 891) return "🧙🧙";
  if (score < 971) return "🧙🧙🧙";
  if (score < 1131) return "🐉";
  if (score < 1291) return "🐉🐉";
  if (score < 1451) return "🐉🐉🐉";
  if (score < 1611) return "🦄";
  if (score < 1771) return "🦄🟢";
  if (score < 1931) return "🦄🟡";
  if (score < 2251) return "🦄🟠";
  if (score < 2571) return "🦄🔴";
  if (score < 2891) return "🦄🟣";
  if (score < 3211) return "🦄⚫";
  if (score < 3531) return "🦄⚡";
  if (score < 3851) return "🦄🌋";
  if (score < 4491) return "🦄🦄";
  if (score < 5131) return "🦄🦄🟢";
  if (score < 5771) return "🦄🦄🟡";
  if (score < 6411) return "🦄🦄🟠";
  if (score < 7051) return "🦄🦄🔴";
  if (score < 7691) return "🦄🦄🟣";
  if (score < 8971) return "🦄🦄⚫";
  if (score < 10251) return "🦄🦄⚡";
  if (score < 11531) return "🦄🦄🌋";
  return "🦄🦄🦄";
}

// export function getDifficultyDescription(score: number) {
//   if (score < 0.5) return "🐣";
//   if (score < 1) return "🌱";
//   if (score < 2) return "🟢";
//   if (score < 4) return "🟢🟢";
//   if (score < 5) return "🟢🟢🟢";
//   if (score < 6) return "🟡";
//   if (score < 7) return "🟡🟡";
//   if (score < 9) return "🟡🟡🟡";
//   if (score < 10) return "🟠";
//   if (score < 11) return "🟠🟠";
//   if (score < 12) return "🟠🟠🟠";
//   if (score < 13) return "🔴";
//   if (score < 14) return "🔴🔴";
//   if (score < 16) return "🔴🔴🔴";
//   if (score < 18) return "🟣";
//   if (score < 20) return "🟣🟣";
//   if (score < 22) return "🟣🟣🟣";
//   if (score < 25) return "⚫";
//   if (score < 28) return "⚫⚫";
//   if (score < 30) return "⚫⚫⚫";
//   if (score < 33) return "🔥";
//   if (score < 36) return "🔥🔥";
//   if (score < 40) return "🔥🔥🔥";
//   if (score < 45) return "🌋";
//   if (score < 50) return "🌋🌋";
//   if (score < 55) return "🌋🌋🌋";
//   if (score < 60) return "⚠️";
//   if (score < 65) return "⚠️⚠️";
//   if (score < 70) return "⚠️⚠️⚠️";
//   if (score < 80) return "☠️";
//   if (score < 90) return "☠️☠️";
//   if (score < 100) return "☠️☠️☠️";
//   return "👑";
// }
