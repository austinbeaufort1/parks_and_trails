export type DifficultyDesc =
  | "Easy"
  | "Moderate"
  | "Moderately Strenuous"
  | "Strenuous"
  | "Very Strenuous"
  | "Challenging"
  | "Bomber";

export type HighestPoint = "middle" | "end";

export interface CalcGrade {
  distance: number;
  elevationGain: number;
  highestPoint: HighestPoint;
}
