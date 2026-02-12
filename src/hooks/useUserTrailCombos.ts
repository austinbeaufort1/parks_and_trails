import { useEffect, useState, useCallback } from "react";
import { supabase } from "../connection/supabase";

export function useUserTrailCombos(
  trailId: string | null,
  userId: string | null,
) {
  const [rows, setRows] = useState<
    { completion_tokens: string[] | null; trail_title?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchCombos = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    let query = supabase
      .from("user_completed_trails")
      .select(
        `
        completion_tokens,
        trails!inner(title)
      `,
      )
      .eq("user_id", userId);

    if (trailId) {
      query = query.eq("trail_id", trailId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch user trail combos", error);
      setRows([]);
    } else {
      // Flatten the joined table to make trail_title easy to access
      const formatted = (data ?? []).map((row: any) => ({
        completion_tokens: row.completion_tokens,
        trail_title: row.trails?.title ?? null,
      }));
      setRows(formatted);
    }

    setLoading(false);
  }, [trailId, userId]);

  useEffect(() => {
    fetchCombos();
  }, [fetchCombos]);

  return {
    rows,
    loading,
    refresh: fetchCombos,
  };
}
