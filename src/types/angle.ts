export type RouteType = "hike" | "scramble" | "climb";

export type AngleDesc =
  | "Flat"
  | "Nearly Flat"
  | "Gentle Slopes"
  | "Moderate"
  | "Moderately Steep"
  | "Steep"
  | "Very Steep"
  | "Terrifying"
  | "Easy Scramble"
  | "Moderate Scramble"
  | "Hard Scramble"
  | "Very Hard Scramble"
  | "Easy Climb"
  | "Moderate Climb"
  | "Hard Climb"
  | "Very Hard Climb"
  | "Unknown";

export interface DistanceElevation {
  difficulty: number;
  angle: number;
}

export interface Crux {
  distance: number;
  angle: number;
  angleDesc: AngleDesc;
}
