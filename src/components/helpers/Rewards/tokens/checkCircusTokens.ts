import { supabase } from "../../../../connection/supabase";
import { TrailCard } from "../../../../types/trail";
import { initialFormData } from "../../../TrailsPage/TrailCard";
import { calculatePar } from "../../parCalculator";
import { singleCircusTokens } from "./constants";
import { EarnedToken, Mode } from "./types";

export async function checkCircusTokens({
  userId,
  trailId,
  formData,
  trail,
  mode = "reward",
}: {
  userId: string;
  trailId: string;
  formData?: Partial<typeof initialFormData>;
  trail: TrailCard;
  mode?: Mode;
}): Promise<EarnedToken[]> {
  if (!formData) return [];

  const circusSelections = formData.circusStunts ?? [];
  if (circusSelections.length === 0) return [];

  const earnedTokenIds = new Set<string>();

  for (const c of circusSelections) {
    const baseToken = singleCircusTokens[c];
    if (!baseToken) continue;

    switch (c) {
      case "Juggling": {
        const balls = formData.jugglingBalls ?? 3;
        const drops = formData.jugglingDrops ?? 0;

        const parDrops = calculatePar(trail, 150);
        const tierThresholds = [
          Infinity,
          parDrops,
          parDrops * 0.85,
          parDrops * 0.7,
          parDrops * 0.55,
          parDrops * 0.35,
          parDrops * 0.15,
          0,
        ];

        let tier = 8;
        for (let i = 0; i < tierThresholds.length; i++) {
          if (drops > tierThresholds[i]) {
            tier = i + 1;
            break;
          }
        }

        earnedTokenIds.add(`${baseToken}_${balls}_${tier}`);
        if (tier === 8) earnedTokenIds.add(`juggling_master`);
        break;
      }

      case "Unicycling": {
        const falls = formData.unicycleFalls ?? 0;
        const estimatedParFalls = calculatePar(trail, 100);

        const tierThresholds = [
          estimatedParFalls * 2,
          estimatedParFalls,
          estimatedParFalls * 0.85,
          estimatedParFalls * 0.7,
          estimatedParFalls * 0.55,
          estimatedParFalls * 0.35,
          estimatedParFalls * 0.15,
          0,
        ];

        let tier = 8;
        for (let i = 0; i < tierThresholds.length; i++) {
          if (falls > tierThresholds[i]) {
            tier = i + 1;
            break;
          }
        }

        earnedTokenIds.add(`unicycle_${tier}`);
        if (tier === 8) earnedTokenIds.add(`unicycle_master`);
        break;
      }

      case "Handstand Walk": {
        const walked50m = formData.handstand50m ?? false;
        if (walked50m) earnedTokenIds.add(baseToken);
        break;
      }

      default:
        earnedTokenIds.add(baseToken);
        break;
    }
  }

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // --- Fetch token info ---
  const { data: tokens, error } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (error || !tokens || tokens.length === 0) {
    console.error("Error fetching circus tokens:", error);
    return [];
  }

  if (mode === "reward") {
    // --- Check already earned ---
    const { data: existing } = await supabase
      .from("user_tokens")
      .select("token_id")
      .eq("user_id", userId)
      .eq("trail_id", trailId)
      .in("token_id", tokenIds);

    const existingIds = new Set(existing?.map((e) => e.token_id));
    const newTokens = tokens.filter((t) => !existingIds.has(t.id));

    if (newTokens.length === 0) return [];

    // --- Insert newly earned ---
    await supabase.from("user_tokens").insert(
      newTokens.map((t) => ({
        user_id: userId,
        token_id: t.id,
        trail_id: trailId,
        earned_at: new Date().toISOString(),
      })),
    );

    return newTokens;
  }

  // detect mode: just return all tokens
  return tokens;
}
