export const loadClasses = [
  { min: 0, max: 10, class: 1 },
  { min: 10, max: 25, class: 2 },
  { min: 25, max: 50, class: 3 },
  { min: 50, max: 80, class: 4 },
  { min: 80, max: 120, class: 5 },
  { min: 120, max: Infinity, class: 6 },
];

// Map weight style to base token id
export const styleBaseTokens: Record<string, string> = {
  pack: "pack_hauler",
  front: "front_loader",
  overhead: "overhead_operator",
  vest: "vest_bound",
  uneven: "balance_tested",
  awkward: "awkward_advantage",
};

// Combo tokens
export const weightCountTokens = [
  { min: 3, tokenId: "fully_loaded" },
  { min: 2, tokenId: "double_duty" },
];

export const singleMovementTokens: Record<string, string> = {
  "One-Footed": "one_footed",
  "Low Crawl": "low_crawl",
  Backwards: "backwards",
  Hopping: "hopping",
  "Duck Walk": "duck_walk",
  "Silly Walk": "silly_walk",
};

export const surfaceTokens: Record<string, string> = {
  "Rock Only": "rock_only",
  "Wood Only": "wood_only",
  "No Bare Ground": "no_bare_ground",
};

export const perceptionTokens: Record<string, string> = {
  Dusk: "dusk_walker",
  Dawn: "early_riser",
  Night: "night_hiker",
  "After Midnight": "after_midnight",
};

export const singleEnvironmentTokens: Record<string, string> = {
  "Rained whole time": "rain_soaked",
  "Snowed whole time": "snowbound",
  "Snow on trail": "snow_tracker",
  "High wind": "wind_runner",
  "Extreme heat": "heat_hardened",
  "Extreme cold": "cold_blooded",
};

export const singleCircusTokens: Record<string, string> = {
  Juggling: "juggling",
  Unicycling: "unicycling",
  "Stilt Walking": "stilts",
  "Handstand Walk": "handstand",
  "Poi Spinning": "poi_spinning",
  "Staff Spinning": "staff_spinning",
  "Hula Hooping": "hula_hooping",
  Slacklining: "slacklining",
};

export const singleSportsTokens: Record<string, string> = {
  "Soccer Dribble": "soccer_dribble",
  "Basketball Dribble": "basketball_dribble",
  "Hockey Control": "hockey_control",
  "Lacrosse Cradle": "lacrosse_cradle",
  "Paddle Ball Bounce": "paddle_ball_bounce",
  "Baseball Glove Carry": "baseball_glove_carry",
};
