import { RouteType, AngleDesc } from "../../types/angle";

export function getAngleDesc(angle: number): string {
  if (angle < 1) return "Flat"; // 0.5 weight
  if (angle < 2) return "Nearly Flat"; // 1.0
  if (angle < 4) return "Gentle Slopes"; // 1.5
  if (angle < 8) return "Moderate"; // 2.5
  if (angle < 12) return "Moderately Steep"; // 4.0
  if (angle < 20) return "Steep"; // 6.0
  if (angle < 28) return "Very Steep"; // 8.0
  if (angle < 35) return "Challenging"; // 10.0
  if (angle < 40) return "Easy Technical"; // 12.0
  if (angle < 45) return "Moderate Technical"; // 14.0
  if (angle < 50) return "Hard Technical"; // 16.0
  if (angle < 60) return "Very Hard Technical"; // 18.0
  if (angle < 70) return "Near Vertical"; // 20.0
  if (angle < 80) return "Extreme"; // 22.0
  return "Vertical / Extreme"; // 25.0
}

// export function getAngleColor(angle: number, alpha = 0.5): string {
//   if (angle < 1) return `rgba(76, 175, 80, ${alpha})`; // #4caf50
//   if (angle < 2) return `rgba(139, 195, 74, ${alpha})`; // #8bc34a
//   if (angle < 4) return `rgba(205, 220, 57, ${alpha})`; // #cddc39
//   if (angle < 8) return `rgba(255, 235, 59, ${alpha})`; // #ffeb3b
//   if (angle < 12) return `rgba(255, 193, 7, ${alpha})`; // #ffc107
//   if (angle < 20) return `rgba(255, 152, 0, ${alpha})`; // #ff9800
//   if (angle < 28) return `rgba(244, 67, 54, ${alpha})`; // #f44336
//   if (angle < 35) return `rgba(183, 28, 28, ${alpha})`; // #b71c1c
//   if (angle < 40) return `rgba(255, 0, 255, ${alpha})`; // #ff00ff
//   if (angle < 45) return `rgba(213, 0, 249, ${alpha})`; // #d500f9
//   if (angle < 50) return `rgba(156, 39, 176, ${alpha})`; // #9c27b0
//   if (angle < 60) return `rgba(106, 27, 154, ${alpha})`; // #6a1b9a
//   if (angle < 70) return `rgba(74, 20, 140, ${alpha})`; // #4a148c
//   if (angle < 80) return `rgba(26, 10, 77, ${alpha})`; // #1a0a4d
//   return `rgba(0, 0, 0, ${alpha})`; // #000000
// }

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
