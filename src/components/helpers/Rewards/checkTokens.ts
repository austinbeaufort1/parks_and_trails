import { EarnedToken } from "../../TokenPopup";
import { supabase } from "../../../connection/supabase";
import { initialFormData } from "../../TrailsPage/TrailCard";
import { metersToFeet } from "../format";
import { calculatePar } from "../parCalculator";
import { TrailCard } from "../../../types/trail";

export type Mode = "reward" | "detect";

interface CheckTokenProps {
  userId: string;
  trailId: string; // optional if token is trail-specific
  timesCompleted: number;
  formData: typeof initialFormData;
  trailDistance: number;
  estimatedTime: number;
  trail: TrailCard;
  mode: Mode;
}

export async function checkTokens({
  userId,
  trailId,
  timesCompleted,
  formData,
  trailDistance,
  estimatedTime,
  trail,
  mode,
}: CheckTokenProps): Promise<EarnedToken[]> {
  const earnedTokens: EarnedToken[] = [];
  console.log("FORM DATA", formData);

  const totalMinutes =
    (formData.durationHours ?? 0) * 60 + (formData.durationMinutes ?? 0);

  const repeatHikeToken = await checkRepeatHikeToken({
    userId,
    timesCompleted,
    trailId,
  });

  const tagBasedTokens = await checkTokensByTrailTags({
    userId,
    trailId,
  });

  const weightTokens = await checkWeightTokens({
    userId,
    trailId,
    weightInputs: formData.weightInputs,
    mode,
  });

  const movementTokens = await checkMovementTokens({
    userId,
    trailId,
    movementSelections: formData.movement,
    mode,
  });

  const surfaceTokens = await checkSurfaceTokens({
    userId,
    trailId,
    trailAdjacent: formData.trailAdjacent,
    surfaceRule: formData.surfaceRule,
    mode,
  });

  const perceptionTokens = await checkPerceptionTokens({
    userId,
    trailId,
    perceptionSelections: formData.perception,
    mode,
  });

  const environmentTokens = await checkEnvironmentTokens({
    userId,
    trailId,
    environmentSelections: formData.environment,
    mode,
  });

  const wildlifeTokens = await checkWildlifeTokens({
    userId,
    trailId,
    wildlife: formData.otherWildlife
      ? formData.otherWildlife
          .split(",")
          .map((w) => w.trim())
          .filter(Boolean)
      : [],
    mode,
  });

  const circusTokens = await checkCircusTokens({
    userId,
    trailId,
    formData,
    trailDistanceFt: metersToFeet(trailDistance),
    trail,
    mode,
  });

  const sportsTokens = await checkSportsTokens({
    userId,
    trailId,
    sportsSelections: formData.sports,
    discGolfThrows: formData.discGolfThrows,
    trailDistanceFt: metersToFeet(trailDistance),
    mode,
  });

  const speedTokens = await checkSpeedTokens({
    userId,
    trailId,
    actualMinutes: totalMinutes,
    estimatedMinutes: estimatedTime,
    mode,
  });

  if (repeatHikeToken) {
    earnedTokens.push(repeatHikeToken);
  }

  if (tagBasedTokens.length > 0) {
    earnedTokens.push(...tagBasedTokens);
  }

  if (weightTokens.length > 0) {
    earnedTokens.push(...weightTokens);
  }

  if (movementTokens.length > 0) {
    earnedTokens.push(...movementTokens);
  }

  if (surfaceTokens.length > 0) {
    earnedTokens.push(...surfaceTokens);
  }

  if (perceptionTokens.length > 0) {
    earnedTokens.push(...perceptionTokens);
  }

  if (environmentTokens.length > 0) {
    earnedTokens.push(...environmentTokens);
  }

  if (wildlifeTokens.length > 0) {
    earnedTokens.push(...wildlifeTokens);
  }

  if (circusTokens.length > 0) {
    earnedTokens.push(...circusTokens);
  }

  if (sportsTokens.length > 0) {
    earnedTokens.push(...sportsTokens);
  }

  if (speedTokens.length > 0) {
    earnedTokens.push(...speedTokens);
  }

  return earnedTokens;
}

async function checkRepeatHikeToken({
  userId,
  timesCompleted,
  trailId,
}: {
  userId: string;
  timesCompleted: number;
  trailId: string;
}): Promise<EarnedToken | null> {
  const repeatTokens: Record<number, string> = {
    2: "path_replay",
    5: "high_five",
    10: "trail_veteran",
    25: "seasoned_pathwalker",
    50: "keeper_of_the_way",
    100: "legendary_wanderer",
  };

  const tokenId = repeatTokens[timesCompleted];
  if (!tokenId) return null;

  // Fetch token info
  const { data: token, error } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .eq("id", tokenId)
    .single();

  if (error || !token) {
    console.error("Error fetching token:", error);
    return null;
  }

  // Check if user already earned this token for this trail
  const { data: existing } = await supabase
    .from("user_tokens")
    .select("id")
    .eq("user_id", userId)
    .eq("token_id", token.id)
    .eq("trail_id", trailId)
    .maybeSingle();

  if (existing) return null;

  // Award token
  await supabase.from("user_tokens").insert({
    user_id: userId,
    token_id: token.id,
    trail_id: trailId,
    earned_at: new Date().toISOString(),
  });

  return {
    id: token.id,
    title: token.title,
    description: token.description,
    icon_emoji: token.icon_emoji,
  };
}

/**
 * New tag-based token checker (replaces checkGhostBridgeToken)
 * Awards any token matching a tag associated with this trail
 */
async function checkTokensByTrailTags({
  userId,
  trailId,
}: {
  userId: string;
  trailId: string;
}): Promise<EarnedToken[]> {
  // 1️⃣ Fetch the trail and its tags
  const { data: trail, error: trailError } = await supabase
    .from("trails")
    .select("tags")
    .eq("id", trailId)
    .single();

  if (trailError || !trail || !trail.tags || trail.tags.length === 0) return [];

  const trailTags: string[] = trail.tags; // array of tag strings

  // 2️⃣ Fetch all tokens whose tag_id matches one of the trail's tags
  const { data: tokens, error: tokensError } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", trailTags);

  if (tokensError || !tokens || tokens.length === 0) return [];

  const tokenIds = tokens.map((t) => t.id);

  // 3️⃣ Batch check which tokens user already has for this trail
  const { data: existingTokens } = await supabase
    .from("user_tokens")
    .select("token_id")
    .eq("user_id", userId)
    .eq("trail_id", trailId)
    .in("token_id", tokenIds);

  const alreadyEarnedIds = new Set(
    existingTokens?.map((et: { token_id: string }) => et.token_id) || [],
  );

  // 4️⃣ Filter out tokens already earned
  const newTokens = tokens.filter((t) => !alreadyEarnedIds.has(t.id));

  // 5️⃣ Insert new tokens in batch
  if (newTokens.length > 0) {
    await supabase.from("user_tokens").insert(
      newTokens.map((t) => ({
        user_id: userId,
        token_id: t.id,
        trail_id: trailId,
        earned_at: new Date().toISOString(),
      })),
    );
  }

  // 6️⃣ Return the new tokens in the shape popup expects
  return newTokens.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    icon_emoji: t.icon_emoji,
  }));
}

// Define load classes
const loadClasses = [
  { min: 0, max: 10, class: 1 },
  { min: 10, max: 25, class: 2 },
  { min: 25, max: 50, class: 3 },
  { min: 50, max: 80, class: 4 },
  { min: 80, max: 120, class: 5 },
  { min: 120, max: Infinity, class: 6 },
];

// Map weight style to base token id
const styleBaseTokens: Record<string, string> = {
  pack: "pack_hauler",
  front: "front_loader",
  overhead: "overhead_operator",
  vest: "vest_bound",
  uneven: "balance_tested",
  awkward: "awkward_advantage",
};

// Combo tokens
const weightCountTokens = [
  { min: 3, tokenId: "fully_loaded" },
  { min: 2, tokenId: "double_duty" },
];

// Helper: determine load class from weight
function getLoadClass(weight: number): number {
  const entry = loadClasses.find((lc) => weight > lc.min && weight <= lc.max);
  return entry ? entry.class : 1;
}

// Refactored checkWeightTokens
export async function checkWeightTokens({
  userId,
  trailId,
  weightInputs, // now { pack: 45, vest: 20 } etc.
  mode = "reward", // default keeps old behavior
}: {
  userId: string;
  trailId: string;
  weightInputs: Record<string, number>;
  mode?: Mode;
}): Promise<EarnedToken[]> {
  if (!weightInputs || Object.keys(weightInputs).length === 0) return [];
  console.log("WEIGHT INPUTS", weightInputs);

  const earnedTokenIds = new Set<string>();

  // 1️⃣ Determine single-weight tokens for correct load class
  for (const [style, weight] of Object.entries(weightInputs)) {
    const loadClass = getLoadClass(weight);
    const baseToken = styleBaseTokens[style];
    if (!baseToken) continue;

    const tokenId = loadClass === 1 ? baseToken : `${baseToken}_${loadClass}`;
    console.log("TOKEN ID", tokenId);
    earnedTokenIds.add(tokenId);
  }

  // 2️⃣ Determine combo token (highest tier only)
  const weightCount = Object.keys(weightInputs).length;
  if (weightCount >= 3) earnedTokenIds.add("fully_loaded");
  else if (weightCount === 2) earnedTokenIds.add("double_duty");

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // 3️⃣ Fetch token data
  const { data: tokens } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (!tokens || tokens.length === 0) return [];

  if (mode === "reward") {
    // 4️⃣ Check already earned
    const { data: existing } = await supabase
      .from("user_tokens")
      .select("token_id")
      .eq("user_id", userId)
      .eq("trail_id", trailId)
      .in("token_id", tokenIds);

    const existingIds = new Set(existing?.map((e) => e.token_id));
    const newTokens = tokens.filter((t) => !existingIds.has(t.id));

    if (newTokens.length === 0) return [];

    // 5️⃣ Insert newly earned tokens
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

  // detect mode: return full token objects
  return tokens;
}

const singleMovementTokens: Record<string, string> = {
  "One-footed": "one_footed",
  "Army crawl": "low_crawl",
  Backwards: "backwards",
  Hopping: "hopping",
  "Duck walk": "duck_walk",
  "Silly walk": "silly_walk",
};

export async function checkMovementTokens({
  userId,
  trailId,
  movementSelections,
  mode = "reward",
}: {
  userId: string;
  trailId: string;
  movementSelections: string[];
  mode?: Mode;
}): Promise<EarnedToken[]> {
  if (!movementSelections || movementSelections.length === 0) return [];

  const earnedTokenIds = new Set<string>();

  // 1️⃣ Award token for each movement selection
  for (const m of movementSelections) {
    const token = singleMovementTokens[m];
    if (token) earnedTokenIds.add(token);
  }

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // 2️⃣ Fetch token info from Supabase
  const { data: tokens } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (!tokens || tokens.length === 0) return [];

  if (mode === "reward") {
    // 3️⃣ Check which tokens the user has already earned for this trail
    const { data: existing } = await supabase
      .from("user_tokens")
      .select("token_id")
      .eq("user_id", userId)
      .eq("trail_id", trailId)
      .in("token_id", tokenIds);

    const existingIds = new Set(existing?.map((e) => e.token_id));

    const newTokens = tokens.filter((t) => !existingIds.has(t.id));

    if (newTokens.length === 0) return [];

    // 4️⃣ Insert newly earned tokens
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

  // detect mode: return all tokens without checking existing
  return tokens;
}

const surfaceTokens: Record<string, string> = {
  "Rock only": "rock_only",
  "Wood only": "wood_only",
  "No bare ground": "no_bare_ground",
};

export async function checkSurfaceTokens({
  userId,
  trailId,
  trailAdjacent,
  surfaceRule,
  mode = "reward",
}: {
  userId: string;
  trailId: string;
  trailAdjacent: boolean;
  surfaceRule: string | null;
  mode?: Mode;
}): Promise<EarnedToken[]> {
  const earnedTokenIds = new Set<string>();

  // 1️⃣ Trail-adjacent token
  if (trailAdjacent) {
    earnedTokenIds.add("trail_adjacent");
  }

  // 2️⃣ Surface rule token
  if (surfaceRule) {
    const surfaceToken = surfaceTokens[surfaceRule];
    if (surfaceToken) {
      earnedTokenIds.add(surfaceToken);
    }
  }

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // 3️⃣ Fetch token data
  const { data: tokens } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (!tokens || tokens.length === 0) return [];

  if (mode === "reward") {
    // 4️⃣ Check already earned for this trail
    const { data: existing } = await supabase
      .from("user_tokens")
      .select("token_id")
      .eq("user_id", userId)
      .eq("trail_id", trailId)
      .in("token_id", tokenIds);

    const existingIds = new Set(existing?.map((e) => e.token_id));

    const newTokens = tokens.filter((t) => !existingIds.has(t.id));

    if (newTokens.length === 0) return [];

    // 5️⃣ Insert new tokens
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

  // detect mode: return all eligible tokens
  return tokens;
}

const perceptionTokens: Record<string, string> = {
  Dusk: "dusk_walker",
  Dawn: "early_riser",
  Night: "night_hiker",
  "After midnight": "after_midnight",
};

export async function checkPerceptionTokens({
  userId,
  trailId,
  perceptionSelections,
  mode = "reward",
}: {
  userId: string;
  trailId: string;
  perceptionSelections: string[];
  mode?: Mode;
}): Promise<EarnedToken[]> {
  if (!perceptionSelections || perceptionSelections.length === 0) return [];

  const earnedTokenIds = new Set<string>();

  // 1️⃣ Award token for each perception selection
  for (const p of perceptionSelections) {
    const token = perceptionTokens[p];
    if (token) earnedTokenIds.add(token);
  }

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // 2️⃣ Fetch token info
  const { data: tokens } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (!tokens || tokens.length === 0) return [];

  if (mode === "reward") {
    // 3️⃣ Check already earned for this trail
    const { data: existing } = await supabase
      .from("user_tokens")
      .select("token_id")
      .eq("user_id", userId)
      .eq("trail_id", trailId)
      .in("token_id", tokenIds);

    const existingIds = new Set(existing?.map((e) => e.token_id));

    const newTokens = tokens.filter((t) => !existingIds.has(t.id));

    if (newTokens.length === 0) return [];

    // 4️⃣ Insert new tokens
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

  // detect mode: return all eligible tokens without checking existing
  return tokens;
}

const singleEnvironmentTokens: Record<string, string> = {
  "Rained whole time": "rain_soaked",
  "Snowed whole time": "snowbound",
  "Snow on trail": "snow_tracker",
  "High wind": "wind_runner",
  "Extreme heat": "heat_hardened",
  "Extreme cold": "cold_blooded",
};

export async function checkEnvironmentTokens({
  userId,
  trailId,
  environmentSelections,
  mode = "reward",
}: {
  userId: string;
  trailId: string;
  environmentSelections: string[];
  mode?: Mode;
}): Promise<EarnedToken[]> {
  if (!environmentSelections || environmentSelections.length === 0) return [];

  const earnedTokenIds = new Set<string>();

  // 1️⃣ Map environment selections → token IDs
  for (const env of environmentSelections) {
    const tokenId = singleEnvironmentTokens[env];
    if (tokenId) earnedTokenIds.add(tokenId);
  }

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // 2️⃣ Fetch token info
  const { data: tokens, error: tokenError } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (tokenError || !tokens || tokens.length === 0) return [];

  if (mode === "reward") {
    // 3️⃣ Check which tokens already earned for this trail
    const { data: existing } = await supabase
      .from("user_tokens")
      .select("token_id")
      .eq("user_id", userId)
      .eq("trail_id", trailId)
      .in("token_id", tokenIds);

    const existingIds = new Set(existing?.map((e) => e.token_id));

    const newTokens = tokens.filter((t) => !existingIds.has(t.id));

    if (newTokens.length === 0) return [];

    // 4️⃣ Insert new tokens
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

  // detect mode: return all eligible tokens
  return tokens;
}

export async function checkWildlifeTokens({
  userId,
  trailId,
  wildlife,
  mode = "reward",
}: {
  userId: string;
  trailId: string;
  wildlife: string[];
  mode?: Mode;
}): Promise<EarnedToken[]> {
  // No wildlife logged → no token
  if (!wildlife || wildlife.length === 0) return [];

  const tokenId = "wildlife_witness";

  // 1️⃣ Fetch token info
  const { data: token, error } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .eq("id", tokenId)
    .single();

  if (error || !token) {
    console.error("Error fetching wildlife token:", error);
    return [];
  }

  if (mode === "reward") {
    // 2️⃣ Check if already earned for this trail
    const { data: existing } = await supabase
      .from("user_tokens")
      .select("id")
      .eq("user_id", userId)
      .eq("token_id", token.id)
      .eq("trail_id", trailId)
      .maybeSingle();

    if (existing) return [];

    // 3️⃣ Award token
    await supabase.from("user_tokens").insert({
      user_id: userId,
      token_id: token.id,
      trail_id: trailId,
      earned_at: new Date().toISOString(),
    });
  }

  // return full token in both reward and detect mode
  return [
    {
      id: token.id,
      title: token.title,
      description: token.description,
      icon_emoji: token.icon_emoji,
    },
  ];
}

const singleCircusTokens: Record<string, string> = {
  Juggling: "juggling",
  Unicycling: "unicycling",
  "Stilt Walking": "stilts",
  "Handstand Walk": "handstand",
  "Poi Spinning": "poi_spinning",
  "Staff Spinning": "staff_spinning",
  "Hula Hooping": "hula_hooping",
  Slacklining: "slacklining",
};

export async function checkCircusTokens({
  userId,
  trailId,
  formData,
  trailDistanceFt,
  trail,
  mode = "reward",
}: {
  userId: string;
  trailId: string;
  formData?: Partial<typeof initialFormData>;
  trailDistanceFt: number;
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

const singleSportsTokens: Record<string, string> = {
  "Soccer Dribble": "soccer_dribble",
  "Basketball Dribble": "basketball_dribble",
  "Hockey Control": "hockey_control",
  "Lacrosse Cradle": "lacrosse_cradle",
  "Paddle Ball Bounce": "paddle_ball_bounce",
  "Baseball Glove Carry": "baseball_glove_carry",
};

interface CheckSportsParams {
  userId: string;
  trailId: string;
  sportsSelections: string[];
  discGolfThrows?: number; // optional, only for Disc Golf
  trailDistanceFt?: number; // optional, only for Disc Golf
}

export async function checkSportsTokens({
  userId,
  trailId,
  sportsSelections,
  discGolfThrows,
  trailDistanceFt,
  mode = "reward",
}: CheckSportsParams & { mode?: Mode }): Promise<EarnedToken[]> {
  if (!sportsSelections || sportsSelections.length === 0) return [];

  const earnedTokenIds = new Set<string>();

  // --- Single-tier sports ---
  for (const s of sportsSelections) {
    if (s === "Disc Golf") continue; // handled separately
    const token = singleSportsTokens[s];
    if (token) earnedTokenIds.add(token);
  }

  // --- Tiered Disc Golf ---
  if (
    sportsSelections.includes("Disc Golf") &&
    discGolfThrows != null &&
    trailDistanceFt != null
  ) {
    const parThrows = Math.ceil(trailDistanceFt / 30); // 30 ft per throw
    let discGolfTier: number;

    if (discGolfThrows <= parThrows - 3) discGolfTier = 6;
    else if (discGolfThrows === parThrows - 2) discGolfTier = 5;
    else if (discGolfThrows === parThrows - 1) discGolfTier = 4;
    else if (discGolfThrows === parThrows) discGolfTier = 3;
    else if (discGolfThrows === parThrows + 1) discGolfTier = 2;
    else discGolfTier = 1;

    earnedTokenIds.add(`disc_golf_${discGolfTier}`);
  }

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // --- Fetch token info ---
  const { data: tokens, error } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (error || !tokens || tokens.length === 0) {
    console.error("Error fetching sports tokens:", error);
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

/*******************/
/* SPEED TOKENS */
/*******************/
interface CheckSpeedParams {
  userId: string;
  trailId: string;
  estimatedMinutes: string;
  actualMinutes: number;
}

interface SpeedToken {
  id: string;
  title: string;
  multiplier: number;
}

function parseEstimatedMinutes(input: string): number {
  let hours = 0;
  let minutes = 0;

  // Check if the string contains hours
  const hourMatch = input.match(/(\d+)h/);
  if (hourMatch) {
    hours = parseInt(hourMatch[1], 10);
  }

  // Check for minutes
  const minMatch = input.match(/(\d+)mins/);
  if (minMatch) {
    minutes = parseInt(minMatch[1], 10);
  }

  return hours * 60 + minutes;
}

export async function checkSpeedTokens({
  userId,
  trailId,
  estimatedMinutes,
  actualMinutes,
  mode = "reward",
}: CheckSpeedParams & { mode?: Mode }): Promise<EarnedToken[]> {
  if (!actualMinutes || !estimatedMinutes || actualMinutes <= 0) return [];

  const estimatedMinsNum = parseEstimatedMinutes(estimatedMinutes);
  const speedFactor = estimatedMinsNum / actualMinutes;

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
