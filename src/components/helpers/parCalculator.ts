import { TrailCard } from "../../types/trail";
import { metersToFeet } from "./format";

export function calculatePar(trail: TrailCard, divisionFactor: number) {
  let estimatedParFalls = metersToFeet(trail.total_distance_m); // base: 1 fall per 150ft

  // --- Adjust par based on average trail angle ---
  // Higher angle → more falls allowed
  const avgAngle = trail.avg_angle;
  const angleFactor = 1 + avgAngle / 10; // e.g., 10° = +100% falls
  estimatedParFalls = Math.ceil(
    (estimatedParFalls * angleFactor) / divisionFactor,
  );
  return estimatedParFalls;
}
