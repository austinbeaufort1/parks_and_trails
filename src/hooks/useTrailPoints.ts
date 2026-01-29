// src/hooks/useTrailPoints.ts
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

/* ---------------- Supabase Setup ---------------- */
const SUPABASE_URL = "https://zmzxuyikrxayylrptboz.supabase.co";
const SUPABASE_KEY = "sb_publishable_qDcVsX-gMygjhlrK-VnTVw_FpwMypZF";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export function useTrailPoints(trailId: string | null) {
  const [points, setPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!trailId) {
      setPoints([]);
      return;
    }

    async function fetchPoints() {
      setLoading(true);

      const { data, error } = await supabase
        .from("trail_points_v2")
        .select("lat, lng, slope_deg")
        .eq("trail_id", trailId) // <- updated to match UUID id
        .order("distance_m", { ascending: true });

      if (!error) setPoints(data ?? []);
      setLoading(false);
    }

    fetchPoints();
  }, [trailId]);

  return { points, loading };
}
