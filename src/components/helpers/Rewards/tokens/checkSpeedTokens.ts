import { supabase } from "../../../../connection/supabase";
import { EarnedToken, Mode } from "./types";

interface CheckSpeedParams {
  userId: string;
  trailId: string;
  estimatedMinutes: number;
  actualMinutes: number;
}

interface SpeedToken {
  id: string;
  title: string;
  multiplier: number;
}

export async function checkSpeedTokens({
  userId,
  trailId,
  estimatedMinutes,
  actualMinutes,
  mode = "reward",
}: CheckSpeedParams & { mode?: Mode }): Promise<EarnedToken[]> {
  if (!actualMinutes || !estimatedMinutes || actualMinutes <= 0) return [];

  const speedFactor = estimatedMinutes / actualMinutes;

  const speedTokens: SpeedToken[] = [
    { id: "swiftfoot_1", title: "Swiftfoot", multiplier: 1.0 },
    { id: "swiftfoot_2", title: "Swiftfoot – Quick", multiplier: 1.5 },
    { id: "swiftfoot_3", title: "Swiftfoot – Fleet", multiplier: 2.5 },
    { id: "swiftfoot_4", title: "Swiftfoot – Wind", multiplier: 4.0 },
    { id: "swiftfoot_5", title: "Swiftfoot – Ghost", multiplier: 6.0 },
    { id: "swiftfoot_6", title: "Swiftfoot – Phantom", multiplier: 8.0 },
  ];

  // --- Determine highest tier earned ---
  const earnedToken = [...speedTokens]
    .reverse()
    .find((t) => speedFactor >= t.multiplier);

  if (!earnedToken) return []; // didn't beat estimate

  // --- Fetch token info ---
  const { data: tokenData, error: tokenError } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .eq("id", earnedToken.id)
    .single();

  if (tokenError || !tokenData) {
    console.error("Could not fetch speed token:", tokenError);
    return [];
  }

  if (mode === "detect") {
    // In detect mode, just return the token
    return [tokenData];
  }

  // --- Reward mode: check if already earned ---
  const { data: existing } = await supabase
    .from("user_tokens")
    .select("token_id")
    .eq("user_id", userId)
    .eq("trail_id", trailId)
    .eq("token_id", earnedToken.id);

  if (existing && existing.length > 0) return [];

  // --- Insert new token ---
  const { data: newToken, error } = await supabase
    .from("user_tokens")
    .insert([
      {
        user_id: userId,
        token_id: earnedToken.id,
        trail_id: trailId,
        earned_at: new Date().toISOString(),
        metadata: { speedFactor: parseFloat(speedFactor.toFixed(2)) },
      },
    ])
    .select()
    .single();

  if (error || !newToken) {
    console.error("Error saving speed token:", error);
    return [];
  }

  // --- Merge token info for full object ---
  const fullToken = {
    ...newToken,
    ...tokenData,
  };

  return [fullToken];
}
