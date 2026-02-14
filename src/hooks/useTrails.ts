// src/hooks/useTrails.ts
import { useEffect, useState, useMemo } from "react";
import { TrailCard } from "../types/trail";
import { createClient } from "@supabase/supabase-js";

/* ---------------- Supabase Setup ---------------- */
const SUPABASE_URL = "https://zmzxuyikrxayylrptboz.supabase.co";
const SUPABASE_KEY = "sb_publishable_qDcVsX-gMygjhlrK-VnTVw_FpwMypZF";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ---------------- Hook ---------------- */
export function useTrails() {
  const [trails, setTrails] = useState<TrailCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrails() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.from("trails").select(
        `
          id,
          title,
          park_name,
          county,
          state,
          total_distance_m,
          elevation_gain_m,
          start_lat,
          start_lng,
          description,
          avg_angle,
          max_angle,
          avg_canopy_pct,
          difficulty_score,
          video,
          created_at,
          landcover_percentages,
          tags
        `,
      );

      if (error) {
        setError(error.message);
        console.error("Error fetching trails:", error);
        setLoading(false);
        return;
      }

      setTrails(data);
      setLoading(false);
    }

    fetchTrails();
  }, []);

  return useMemo(() => ({ trails, loading, error }), [trails, loading, error]);
}

// // src/hooks/useTrails.ts
// import { useEffect, useMemo, useState } from "react";
// import { TrailPoint } from "../types/trailPoint";
// import Papa from "papaparse";
// import trailMetadata from "../trail-data/trails.json";
// import {
//   calculateAvgCanopy,
//   calculateCruxAngle,
//   calculateElevationStats,
//   calculateLandcoverPercentages,
//   gradeToDegrees,
//   adjustDistanceForOutAndBack,
// } from "../components/helpers/trailStats";
// import {
//   calculateDifficulty,
//   getDifficultyDescription,
// } from "../components/helpers/difficulty";

// /* --------------------------------------------------
//    CSV loader
// -------------------------------------------------- */
// const csvFiles = import.meta.glob("../trail-data/*.csv", { as: "raw" });

// /* --------------------------------------------------
//    Types
// -------------------------------------------------- */
// type CsvRow = {
//   Lat: string;
//   Lng: string;
//   "Distance (feet)": string;
//   "Elevation (feet)": string;
//   "Slope (degrees)": string;
//   "Aspect (degrees)": string;
//   Landcover: string;
//   "Canopy (percent)": string;
//   "Linear Grade (percent)": string;
// };

// type RawTrail = {
//   key: string;
//   points: TrailPoint[];
// };

// /* --------------------------------------------------
//    Hook
// -------------------------------------------------- */
// export function useTrails() {
//   const [rawTrails, setRawTrails] = useState<RawTrail[]>([]);

//   useEffect(() => {
//     async function load() {
//       const loaded: RawTrail[] = [];

//       for (const path in csvFiles) {
//         const text = await csvFiles[path]();

//         const parsed = Papa.parse<CsvRow>(text, {
//           header: true,
//           skipEmptyLines: true,
//         });

//         const points = parsed.data
//           .map((row) => {
//             const lat = Number(row.Lat);
//             const lon = Number(row.Lng);
//             const ele = Number(row["Elevation (feet)"]);
//             const distFeet = Number(row["Distance (feet)"]);
//             const grade = Number(row["Linear Grade (percent)"]) || 0;
//             const absGrade = Math.abs(grade);

//             if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

//             return {
//               lat,
//               lon,
//               ele,
//               distFeet,
//               grade: absGrade,
//               slopeDeg: gradeToDegrees(absGrade),
//               aspect: Number(row["Aspect (degrees)"]) || 0,
//               landcover: row.Landcover ?? "",
//               canopy: Number(row["Canopy (percent)"]) || 0,
//             };
//           })
//           .filter(Boolean) as TrailPoint[];

//         if (points.length < 2) continue;

//         const key = path.split("/").pop()!.replace(".csv", "");
//         loaded.push({ key, points });
//       }

//       setRawTrails(loaded);
//     }

//     load();
//   }, []);

//   return useMemo(() => {
//     return rawTrails.map((trail) => {
//       const { elevationGain, avgAngle, maxAngle } = calculateElevationStats(
//         trail.points
//       );

//       const distanceFeet = adjustDistanceForOutAndBack(trail.points);
//       const distanceMeters = distanceFeet * 0.3048;
//       const difficultyScore = calculateDifficulty(trail.points);
//       const difficultyDescription = getDifficultyDescription(difficultyScore);
//       const cruxAngle = calculateCruxAngle(trail.points);

//       return {
//         ...trail,
//         meta: trailMetadata.find((m) => m.key === trail.key),
//         elevationGain,
//         avgAngle,
//         maxAngle: cruxAngle,
//         distanceFeet,
//         distanceMeters,
//         difficultyScore,
//         difficultyDescription,
//         avgCanopy: calculateAvgCanopy(trail.points),
//         landcoverPercentages: calculateLandcoverPercentages(trail.points),
//         latlngs: trail.points.map((p) => [p.lat, p.lon] as [number, number]),
//       };
//     });
//   }, [rawTrails]);
// }
