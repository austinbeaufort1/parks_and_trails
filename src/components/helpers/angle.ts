import { RouteType, AngleDesc } from "../../types/angle";

export function getAngleDesc(
  angle: number,
  type: RouteType = "hike"
): AngleDesc {
  if (type === "hike") {
    if (angle < 1) return "Flat";
    if (angle < 2) return "Nearly Flat";
    if (angle < 4) return "Gentle Slopes";
    if (angle < 8) return "Moderate";
    if (angle < 12) return "Moderately Steep";
    if (angle < 20) return "Steep";
    if (angle < 28) return "Very Steep";
    return "Terrifying";
  }

  if (type === "scramble") {
    if (angle < 35) return "Easy Scramble";
    if (angle < 40) return "Moderate Scramble";
    if (angle < 50) return "Hard Scramble";
    return "Very Hard Scramble";
  }

  if (type === "climb") {
    if (angle < 60) return "Easy Climb";
    if (angle < 70) return "Moderate Climb";
    if (angle < 80) return "Hard Climb";
    return "Very Hard Climb";
  }

  return "Unknown";
}

export function getAngleColor(angle: number): string {
  if (angle < 1) return "#4caf50";
  if (angle < 2) return "#8bc34a";
  if (angle < 4) return "#cddc39";
  if (angle < 8) return "#ffeb3b";
  if (angle < 12) return "#ffc107";
  if (angle < 20) return "#ff9800";
  if (angle < 28) return "#f44336";
  if (angle < 35) return "#b71c1c";
  if (angle < 40) return "#ff00ff";
  if (angle < 45) return "#d500f9";
  if (angle < 50) return "#9c27b0";
  if (angle < 60) return "#6a1b9a";
  if (angle < 70) return "#4a148c";
  if (angle < 80) return "#1a0a4d";
  return "#000000";
}
