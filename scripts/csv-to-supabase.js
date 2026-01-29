import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { createClient } from "@supabase/supabase-js";

// ---------------- CONFIG ---------------- //
const SUPABASE_URL = "https://your-project-url.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY"; 
const CSV_FOLDER = "./trails_csv";
const METADATA_FILE = "./trails_metadata.json";
const BATCH_SIZE = 500;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ---------------- HELPERS ---------------- //
function computeStats(points) {
  const totalDistance = points[points.length - 1].distance_m;
  const elevationGain = points
    .map((p, i) => (i === 0 ? 0 : Math.max(0, p.elevation_m - points[i - 1].elevation_m)))
    .reduce((a, b) => a + b, 0);
  const avgAngle = points.reduce((sum, p) => sum + p.slope_deg, 0) / points.length;
  const maxAngle = Math.max(...points.map((p) => p.slope_deg));
  const avgCanopy = points.reduce((sum, p) => sum + (p.canopy_pct || 0), 0) / points.length;

  return { totalDistance, elevationGain, avgAngle, maxAngle, avgCanopy };
}

async function importTrail(filePath, trailMeta) {
  const points = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      points.push({
        lat: parseFloat(row.Lat),
        lng: parseFloat(row.Lng),
        distance_m: parseFloat(row["Distance (meters)"]),
        elevation_m: parseInt(row["Elevation (meters)"]),
        slope_deg: parseFloat(row["Slope (degrees)"]),
        aspect_deg: parseFloat(row["Aspect (degrees)"]),
        landcover: row["Landcover"],
        canopy_pct: parseInt(row["Canopy (percent)"] || 0),
        linear_grade_pct: parseFloat(row["Linear Grade (percent)"]),
      });
    })
    .on("end", async () => {
      if (points.length === 0) return console.error("No points found");

      const stats = computeStats(points);

      // Map JSON fields to your Supabase table columns
      const trailRow = {
        title: trailMeta.title,
        park_name: trailMeta.parkName,
        county: trailMeta.county,
        state: trailMeta.state,
        description: trailMeta.description,
        video: trailMeta.video || null,
        total_distance_m: stats.totalDistance,
        elevation_gain_m: Math.round(stats.elevationGain),
        avg_angle: stats.avgAngle,
        max_angle: stats.maxAngle,
        avg_canopy_pct: stats.avgCanopy,
        start_lat: points[0].lat,
        start_lng: points[0].lng,
      };

      const { data: trailData, error: trailError } = await supabase
        .from("trails")
        .insert([trailRow])
        .select()
        .single();

      if (trailError) return console.error("Error inserting trail:", trailError);

      const trailId = trailData.id;

      // Insert points in batches
      for (let i = 0; i < points.length; i += BATCH_SIZE) {
        const batch = points.slice(i, i + BATCH_SIZE).map(p => ({ ...p, trail_id: trailId }));
        const { error } = await supabase.from("trail_points").insert(batch);
        if (error) console.error("Error inserting batch:", error);
      }

      console.log(`Imported trail '${trailMeta.title}' successfully!`);
    });
}

// ---------------- MAIN ---------------- //
const metadata = JSON.parse(fs.readFileSync(METADATA_FILE));

metadata.forEach((trail) => {
  const csvFile = path.join(CSV_FOLDER, `${trail.key}.csv`);
  if (fs.existsSync(csvFile)) {
    importTrail(csvFile, trail);
  } else {
    console.warn(`CSV for '${trail.title}' not found at ${csvFile}`);
  }
});
