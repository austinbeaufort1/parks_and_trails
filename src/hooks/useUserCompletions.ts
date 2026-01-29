import { useState, useEffect } from "react";
import { supabase } from "../connection/supabase";

export function useUserCompletions(
  trailId: string | null,
  userId: string | null
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trailId || !userId) return; // bail if no trail or no user

    const fetchCompletions = async () => {
      const { count: total, error } = await supabase
        .from("user_completed_trails")
        .select("*", { count: "exact", head: true })
        .eq("trail_id", trailId)
        .eq("user_id", userId);

      if (!error) setCount(total ?? 0);
    };

    fetchCompletions();
  }, [trailId, userId]);

  return count;
}
