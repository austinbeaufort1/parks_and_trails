// src/hooks/useUserCompletionsMap.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../connection/supabase";

type CompletionsMap = Record<string, number>;

export function useUserCompletionsMap(userId: string | null) {
  const [completionsMap, setCompletionsMap] = useState<CompletionsMap>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // fetch function as useCallback so we can call it later
  const fetchCompletions = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("user_completed_trails")
      .select("trail_id") // only need trail_id
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching completions:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    // Count completions per trail
    const map: CompletionsMap = {};
    data?.forEach((row: { trail_id: string }) => {
      map[row.trail_id] = (map[row.trail_id] ?? 0) + 1;
    });

    setCompletionsMap(map);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchCompletions();
  }, [fetchCompletions]);

  return { completionsMap, loading, error, refresh: fetchCompletions };
}
