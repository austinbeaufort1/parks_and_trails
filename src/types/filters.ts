import { AngleDesc } from "./angle";

export interface TrailFilters {
  states: string[];
  counties: string[];
  parks: string[];

  difficultyDescs: string[];
  angleDescs: AngleDesc[];
  cruxAngleDescs: AngleDesc[];

  distanceRange: [number, number]; // miles
  elevationRange: [number, number]; // feet

  minTreeCover?: number;
  landCoverTypes: string[];
}
