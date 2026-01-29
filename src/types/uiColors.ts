export type AngleTagColors =
  | "#4caf50"
  | "#8bc34a"
  | "#cddc39"
  | "#ffeb3b"
  | "#ffc107"
  | "#ff9800"
  | "#f44336"
  | "#b71c1c";

export const angleTagColors: Record<string, AngleTagColors> = {
  flat: "#4caf50",
  nearlyFlat: "#8bc34a",
  gentleSlope: "#cddc39",
  moderate: "#ffeb3b",
  moderatelySteep: "#ffc107",
  steep: "#ff9800",
  verySteep: "#f44336",
  terrifying: "#b71c1c",
};

export type DifficultyTagColors = AngleTagColors | "#450000";

export const difficultyTagColors: Record<string, DifficultyTagColors> = {
  easy: "#4caf50",
  moderate: "#8bc34a",
  moderatelyStrenuous: "#cddc39",
  strenous: "#ffeb3b",
  veryStrenuous: "#ffc107",
  challenging: "#ff9800",
  bomber: "#f44336",
};

export type TableColors =
  | "#dfffe3"
  | "#eefff0"
  | "#e7f5ff"
  | "#fff5e2"
  | "#fff7ef";

export const tableColors: Record<string, TableColors> = {
  lightestGreen: "#eefff0",
  lightGreen: "#dfffe3",
  lightBlue: "#e7f5ff",
  lightBrown: "#fff5e2",
  lightestBrown: "#fff7ef",
};
