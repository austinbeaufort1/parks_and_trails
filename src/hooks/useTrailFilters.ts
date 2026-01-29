import { useMemo, useState } from "react";
import { TrailCard } from "../types/trail";
import { TrailFilters } from "../types/filters";
import { getAngleDesc } from "../components/helpers/angle";
import { getDifficultyDescription } from "../components/helpers/difficulty";

const DEFAULT_FILTERS: TrailFilters = {
  states: [],
  counties: [],
  parks: [],
  difficultyDescs: [],
  angleDescs: [],
  cruxAngleDescs: [],
  distanceRange: [0, 50],
  elevationRange: [0, 10000],
  minTreeCover: undefined,
  landCoverTypes: [],
};

export function useTrailFilters(trails: TrailCard[]) {
  const [filters, setFilters] = useState<TrailFilters>(DEFAULT_FILTERS);

  const filteredTrails = useMemo(() => {
    return trails.filter((trail) => {
      // Location
      if (filters.states.length && !filters.states.includes(trail.state)) {
        return false;
      }

      if (filters.counties.length && !filters.counties.includes(trail.county)) {
        return false;
      }

      if (filters.parks.length && !filters.parks.includes(trail.park_name)) {
        return false;
      }

      // Difficulty
      if (
        filters.difficultyDescs.length &&
        !filters.difficultyDescs.includes(
          getDifficultyDescription(trail.difficulty_score)
        )
      ) {
        return false;
      }

      if (
        filters.angleDescs.length &&
        !filters.angleDescs.includes(getAngleDesc(trail.avg_angle))
      ) {
        return false;
      }

      if (filters.cruxAngleDescs.length) {
        const cruxAngle = trail.max_angle;
        const cruxDesc = getAngleDesc(cruxAngle);

        if (!filters.cruxAngleDescs.includes(cruxDesc)) {
          return false;
        }
      }

      // Distance
      const miles = trail.total_distance_m / 5280;
      if (
        miles < filters.distanceRange[0] ||
        miles > filters.distanceRange[1]
      ) {
        return false;
      }

      // Elevation
      if (
        trail.elevation_gain_m < filters.elevationRange[0] ||
        trail.elevation_gain_m > filters.elevationRange[1]
      ) {
        return false;
      }

      // Tree cover
      if (
        filters.minTreeCover !== undefined &&
        trail.avg_canopy_pct < filters.minTreeCover
      ) {
        return false;
      }

      // Land cover
      if (
        filters.landCoverTypes.length &&
        !filters.landCoverTypes.some((type) =>
          trail.landcover_percentages.some((lc) => lc.type === type)
        )
      ) {
        return false;
      }

      return true;
    });
  }, [trails, filters]);

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return {
    filters,
    setFilters,
    filteredTrails,
    resetFilters,
  };
}
