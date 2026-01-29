import { getAngleColor } from "./angle";
import { SegmentPoint } from "../../types/helpers/trailSegments";

export function getColoredSegments(points: SegmentPoint[]) {
  return points.slice(1).map((p1, i) => {
    const p0 = points[i];
    return {
      positions: [
        [p0.lat, p0.lng],
        [p1.lat, p1.lng],
      ] as [number, number][],
      color: getAngleColor(p1.slope_deg),
      slope: p1.slope_deg,
    };
  });
}
