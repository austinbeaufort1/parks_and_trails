// src/hooks/useCompleteTrail.ts
import { useState } from "react";
import { supabase } from "../connection/supabase";
import { EarnedToken } from "../components/TokenPopup";

export type CompleteTrailPayload = {
  duration_seconds?: number | null;
  details?: Record<string, any> | null;
};

type EarnedBadge = {
  id: string;
  title: string;
  description?: string;
};

function filterTokens(tokens: EarnedToken[] | undefined): EarnedToken[] {
  if (!tokens || tokens.length === 0) return [];

  const blockedIds = [
    "art",
    "campground",
    "dirt_scramble",
    "ghost_bridge",
    "glass_bridge",
    "historic",
    "lake_loop",
    "overlook",
    "rail_trail",
    "river_adjacent",
    "university",
    "wildlife_witness",
  ];

  return tokens.filter(
    (token) =>
      !token.title.startsWith("Familiar - ") && !blockedIds.includes(token.id),
  );
}

export function useCompleteTrail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function completeTrail(
    userId: string,
    trailId: string,
    payload?: CompleteTrailPayload,
    onSuccess?: () => void,
    tokens?: EarnedToken[],
  ) {
    setLoading(true);
    setError(null);
    const filteredTokens = filterTokens(tokens);
    const tokenTitles = filteredTokens.map((token) => token.title);

    // 1️⃣ Insert completion
    const { error: completionError } = await supabase
      .from("user_completed_trails")
      .insert([
        {
          user_id: userId,
          trail_id: trailId,
          duration_seconds: payload?.duration_seconds ?? null,
          details: payload?.details ?? null,
          completion_tokens: tokenTitles,
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
