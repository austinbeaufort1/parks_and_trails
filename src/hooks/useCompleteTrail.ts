// src/hooks/useCompleteTrail.ts
import { useState } from "react";
import { supabase } from "../connection/supabase";

export type CompleteTrailPayload = {
  duration_seconds?: number | null;
  details?: Record<string, any> | null;
};

type EarnedBadge = {
  id: string;
  title: string;
  description?: string;
};

export function useCompleteTrail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function completeTrail(
    userId: string,
    trailId: string,
    payload?: CompleteTrailPayload,
    onSuccess?: () => void
  ) {
    setLoading(true);
    setError(null);

    // 1️⃣ Insert completion
    const { error: completionError } = await supabase
      .from("user_completed_trails")
      .insert([
        {
          user_id: userId,
          trail_id: trailId,
          duration_seconds: payload?.duration_seconds ?? null,
          details: payload?.details ?? null,
        },
      ]);

    if (completionError) {
      setError(completionError.message);
      setLoading(false);
      return;
    }

    onSuccess?.();
    setLoading(false);
  }

  return {
    completeTrail,
    loading,
    error,
  };
}
