export type TrailPoint = {
  lat: number;
  lng: number;
  ele: number;
  distFeet: number;
  slopeDeg: number;
  aspect: number;
  landcover: string;
  canopy: number;
  grade: number;
  waterDepthFeet?: number;
  waterCurrent?: "low" | "medium" | "high";
};
