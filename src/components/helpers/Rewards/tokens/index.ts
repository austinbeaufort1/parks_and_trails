// tokens/index.ts
import { EarnedToken, Mode } from "./types";

// Import your check modules here
import { checkRepeatHikeToken } from "./checkRepeatHikeToken";
import { checkTokensByTrailTags } from "./checkTrailTags";
import { checkWeightTokens } from "./checkWeightTokens";
import { checkMovementTokens } from "./checkMovementTokens";
import { checkSurfaceTokens } from "./checkSurfaceTokens";
import { checkPerceptionTokens } from "./checkPerceptionTokens";
import { checkEnvironmentTokens } from "./checkEnvironmentTokens";
import { checkWildlifeTokens } from "./checkWildlifeTokens";
import { checkCircusTokens } from "./checkCircusTokens";
import { checkSportsTokens } from "./checkSportsTokens";
import { checkSpeedTokens } from "./checkSpeedTokens";
import { initialFormData } from "../../../TrailsPage/TrailCard";
import { metersToFeet } from "../../format";
import { flattenTokenResults } from "./utils";

// Define input type for checkTokens
export interface CheckTokensParams {
  userId: string;
  trailId?: string;
  timesCompleted?: number;
  formData?: Record<string, any>;
  trailDistance?: number;
  estimatedTimeMins?: number;
  trail?: any;
  mode: Mode;
}

export async function checkTokens({
  userId,
  trailId = "",
  timesCompleted = 0,
  formData = JSON.parse(JSON.stringify(initialFormData)),
  trailDistance,
  estimatedTimeMins,
  trail,
  mode,
}: CheckTokensParams): Promise<EarnedToken[]> {
  formData = {
    ...JSON.parse(JSON.stringify(initialFormData)),
    ...formData,
  };

  const actualMinutes = formData.durationMinutes + formData.durationHours * 60;

  // --- Normalize weight inputs: default to 1 lb if style selected ---
  if (Array.isArray(formData.weight) && formData.weight.length > 0) {
    formData.weightInputs ??= {};

    for (const w of formData.weight) {
      if (formData.weightInputs[w] == null) {
        formData.weightInputs[w] = 1;
      }
    }
  }

  // Call all token checks in parallel, passing the full params object
  const results = await Promise.all([
    checkRepeatHikeToken({ userId, timesCompleted, trailId }),
    checkTokensByTrailTags({ userId, trailId }),
    checkWeightTokens({
      userId,
      trailId,
      weightInputs: formData.weightInputs,
      mode,
    }),
    checkMovementTokens({
      userId,
      trailId,
      movementSelections: formData.movement,
      mode,
    }),
    checkSurfaceTokens({
      userId,
      trailId,
      trailAdjacent: formData.trail_adjacent,
      surfaceRule: formData.surfaceRule,
      mode,
    }),
    checkPerceptionTokens({
      userId,
      trailId,
      perceptionSelections: formData.perception,
      mode,
    }),
    checkEnvironmentTokens({
      userId,
      trailId,
      environmentSelections: formData.environment,
      mode,
    }),
    checkWildlifeTokens({ userId, trailId, wildlife: formData.wildlife, mode }),
    checkCircusTokens({ userId, trailId, formData, trail, mode }),
    checkSportsTokens({
      userId,
      trailId,
      sportsSelections: formData.sports,
      discGolfThrows: formData.discGolfThrows,
      trailDistanceFt: metersToFeet(trail.total_distance_m),
      mode,
    }),
    checkSpeedTokens({
      userId,
      trailId,
      estimatedMinutes: estimatedTimeMins ?? 10000000,
      actualMinutes: actualMinutes,
      mode,
    }),
  ]);

  // Flatten all results into a single array of EarnedToken
  return flattenTokenResults(results);
}
