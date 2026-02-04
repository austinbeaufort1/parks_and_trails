// src/hooks/useTrailTokens.ts
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../connection/supabase";
import { EarnedToken } from "../components/TokenPopup";

export function useTrailTokens(userId?: string, trailId?: string) {
  const [tokens, setTokens] = useState<EarnedToken[]>([]);
  const [loading, setLoading] = useState(false);

  // Move fetchTokens out of useEffect
  const fetchTokens = useCallback(async () => {
    if (!userId || !trailId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("user_tokens")
      .select(
        `
        token:tokens (
          id,
          title,
          description,
          icon_emoji
        )
      `,
      )
      .eq("user_id", userId)
      .eq("trail_id", trailId);

    if (error) {
      console.error("Error fetching trail tokens:", error);
      setLoading(false);
      return;
    }

    const earned = data.map((row: any) => ({
      id: row.token.id,
      title: row.token.title,
      description: row.token.description,
      icon_emoji: row.token.icon_emoji,
    }));

    setTokens(earned);
    setLoading(false);
  }, [userId, trailId]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return { tokens, loading, refresh: fetchTokens };
}
