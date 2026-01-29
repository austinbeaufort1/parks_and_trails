import { EarnedToken } from "../../TokenPopup";
import { supabase } from "../../../connection/supabase";
import { initialFormData } from "../../TrailsPage/TrailCard";

interface CheckTokenProps {
  userId: string;
  trailId: string; // optional if token is trail-specific
  timesCompleted: number;
  formData: typeof initialFormData;
}

export async function checkTokens({
  userId,
  trailId,
  timesCompleted,
  formData,
}: CheckTokenProps): Promise<EarnedToken[]> {
  const earnedTokens: EarnedToken[] = [];

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
    weightSelections: formData.weight,
  });

  const movementTokens = await checkMovementTokens({
    userId,
    trailId,
    movementSelections: formData.movement,
  });

  const surfaceTokens = await checkSurfaceTokens({
    userId,
    trailId,
    trailAdjacent: formData.trailAdjacent,
    surfaceRule: formData.surfaceRule,
  });

  const perceptionTokens = await checkPerceptionTokens({
    userId,
    trailId,
    perceptionSelections: formData.perception,
  });

  const environmentTokens = await checkEnvironmentTokens({
    userId,
    trailId,
    environmentSelections: formData.environment,
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
  });

  const circusTokens = await checkCircusTokens({
    userId,
    trailId,
    circusSelections: formData.circusStunts,
  });

  const sportsTokens = await checkSportsTokens({
    userId,
    trailId,
    sportsSelections: formData.sports,
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

const singleWeightTokens: Record<string, string> = {
  pack: "pack_hauler",
  front: "front_loader",
  overhead: "overhead_operator",
  vest: "vest_bound",
  uneven: "balance_tested",
  awkward: "awkward_advantage",
};

// Only valid combination tokens now
const weightCountTokens = [
  {
    min: 3,
    tokenId: "fully_loaded",
  },
  {
    min: 2,
    tokenId: "double_duty",
  },
];

export async function checkWeightTokens({
  userId,
  trailId,
  weightSelections,
}: {
  userId: string;
  trailId: string;
  weightSelections: string[];
}): Promise<EarnedToken[]> {
  if (!weightSelections || weightSelections.length === 0) return [];

  const earnedTokenIds = new Set<string>();

  const weightCount = weightSelections.length;

  // 1️⃣ Determine combo token (highest tier only)
  if (weightCount >= 3) {
    // Fully Loaded
    const fullyLoaded = weightCountTokens.find(
      (r) => r.tokenId === "fully_loaded",
    );
    if (fullyLoaded) earnedTokenIds.add(fullyLoaded.tokenId);
  } else if (weightCount === 2) {
    // Double Duty
    const doubleDuty = weightCountTokens.find(
      (r) => r.tokenId === "double_duty",
    );
    if (doubleDuty) earnedTokenIds.add(doubleDuty.tokenId);
  } else if (weightCount === 1) {
    // Single-weight tokens only if no combo
    const single = singleWeightTokens[weightSelections[0]];
    if (single) earnedTokenIds.add(single);
  }

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // 2️⃣ Fetch token data
  const { data: tokens } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (!tokens || tokens.length === 0) return [];

  // 3️⃣ Check already earned
  const { data: existing } = await supabase
    .from("user_tokens")
    .select("token_id")
    .eq("user_id", userId)
    .eq("trail_id", trailId)
    .in("token_id", tokenIds);

  const existingIds = new Set(existing?.map((e) => e.token_id));

  const newTokens = tokens.filter((t) => !existingIds.has(t.id));

  if (newTokens.length === 0) return [];

  // 4️⃣ Insert
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
}: {
  userId: string;
  trailId: string;
  movementSelections: string[];
}): Promise<EarnedToken[]> {
  console.log("movement selections", movementSelections);
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
}: {
  userId: string;
  trailId: string;
  trailAdjacent: boolean;
  surfaceRule: string | null;
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
}: {
  userId: string;
  trailId: string;
  perceptionSelections: string[];
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
}: {
  userId: string;
  trailId: string;
  environmentSelections: string[];
}): Promise<EarnedToken[]> {
  if (!environmentSelections || environmentSelections.length === 0) return [];
  console.log("ENV SELECTIONS:", environmentSelections);

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

  // 5️⃣ Return for popup
  return newTokens;
}

export async function checkWildlifeTokens({
  userId,
  trailId,
  wildlife,
}: {
  userId: string;
  trailId: string;
  wildlife: string[]; // array from form
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
  circusSelections,
}: {
  userId: string;
  trailId: string;
  circusSelections: string[]; // array from form
}): Promise<EarnedToken[]> {
  if (!circusSelections || circusSelections.length === 0) return [];

  const earnedTokenIds = new Set<string>();

  // Map selections to token IDs
  for (const c of circusSelections) {
    const token = singleCircusTokens[c];
    if (token) earnedTokenIds.add(token);
  }

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // 1️⃣ Fetch token info
  const { data: tokens, error } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (error || !tokens || tokens.length === 0) {
    console.error("Error fetching circus tokens:", error);
    return [];
  }

  // 2️⃣ Check if already earned
  const { data: existing } = await supabase
    .from("user_tokens")
    .select("token_id")
    .eq("user_id", userId)
    .eq("trail_id", trailId)
    .in("token_id", tokenIds);

  const existingIds = new Set(existing?.map((e) => e.token_id));

  const newTokens = tokens.filter((t) => !existingIds.has(t.id));

  if (newTokens.length === 0) return [];

  // 3️⃣ Insert new tokens
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

const singleSportsTokens: Record<string, string> = {
  "Soccer Dribble": "soccer_dribble",
  "Basketball Dribble": "basketball_dribble",
  "Hockey Control": "hockey_control",
  "Lacrosse Cradle": "lacrosse_cradle",
  "Paddle Ball Bounce": "paddle_ball_bounce",
  "Disc Control": "disc_control",
  "Baseball Glove Carry": "baseball_glove_carry",
};

export async function checkSportsTokens({
  userId,
  trailId,
  sportsSelections,
}: {
  userId: string;
  trailId: string;
  sportsSelections: string[]; // array from form
}): Promise<EarnedToken[]> {
  if (!sportsSelections || sportsSelections.length === 0) return [];

  const earnedTokenIds = new Set<string>();

  // Map selections to token IDs
  for (const s of sportsSelections) {
    const token = singleSportsTokens[s];
    if (token) earnedTokenIds.add(token);
  }

  if (earnedTokenIds.size === 0) return [];

  const tokenIds = Array.from(earnedTokenIds);

  // 1️⃣ Fetch token info
  const { data: tokens, error } = await supabase
    .from("tokens")
    .select("id, title, description, icon_emoji")
    .in("id", tokenIds);

  if (error || !tokens || tokens.length === 0) {
    console.error("Error fetching sports tokens:", error);
    return [];
  }

  // 2️⃣ Check if already earned
  const { data: existing } = await supabase
    .from("user_tokens")
    .select("token_id")
    .eq("user_id", userId)
    .eq("trail_id", trailId)
    .in("token_id", tokenIds);

  const existingIds = new Set(existing?.map((e) => e.token_id));

  const newTokens = tokens.filter((t) => !existingIds.has(t.id));

  if (newTokens.length === 0) return [];

  // 3️⃣ Insert new tokens
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
