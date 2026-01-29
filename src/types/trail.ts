import { AngleDesc, DistanceElevation, Crux } from "./angle";
import { DifficultyDesc } from "./difficulty";
import { TrailPoint } from "./trailPoint";

export type Route = "loop" | "out & back" | "loop / out & back";

export interface CalculatedFields extends DistanceElevation {
  distance: number;
  elevationGain: number;
  difficultyDesc: DifficultyDesc;
  angleDesc: AngleDesc;
}

export interface Row extends CalculatedFields {
  key: string;
  state: string;
  county: string;
  parkName: string;
  trailName: string;
  route: Route;
  videos: string[][];
  extras: {
    description: string;
    crux: Crux;
  };
}

export type TrailView = {
  key: string;
  points: TrailPoint[];
  latlngs: [number, number][];
  difficultyScore: number;
  difficultyDescription: string;
  distanceFeet: number;
  elevationGain: number;
  avgAngle: number;
  maxAngle: number;
  avgCanopy: number;
  meta?: {
    state: string;
    county: string;
    parkName: string;
    title: string;
    description: string;
    video?: string;
  };
};

export type TrailCard = {
  id: string;
  title: string;
  park_name: string;
  county: string;
  state: string;
  total_distance_m: number;
  elevation_gain_m: number;
  start_lat: number;
  start_lng: number;
  description: string;
  avg_angle: number;
  max_angle: number;
  avg_canopy_pct: number;
  difficulty_score: number;
  video?: string | null;
  landcover_percentages: any;
};
