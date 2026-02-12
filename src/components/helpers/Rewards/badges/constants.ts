import { Season } from "./types";

export const monthToSeason: Record<number, Season> = {
  11: "winter",
  0: "winter",
  1: "winter",
  2: "spring",
  3: "spring",
  4: "spring",
  5: "summer",
  6: "summer",
  7: "summer",
  8: "autumn",
  9: "autumn",
  10: "autumn",
};

export const holidayDates: Record<string, (date: Date) => boolean> = {
  groundhog: (d) => d.getUTCMonth() === 1 && d.getUTCDate() === 2,
  valentines: (d) => d.getUTCMonth() === 1 && d.getUTCDate() === 14,
  pi: (d) => d.getUTCMonth() === 2 && d.getUTCDate() === 14,
  st_paddys: (d) => d.getUTCMonth() === 2 && d.getUTCDate() === 17,
  fourth_of_july: (d) => d.getUTCMonth() === 6 && d.getUTCDate() === 4,
  halloween: (d) => d.getUTCMonth() === 9 && d.getUTCDate() === 31,
  veterans: (d) => d.getUTCMonth() === 10 && d.getUTCDate() === 11,
  christmas: (d) => d.getUTCMonth() === 11 && d.getUTCDate() === 25,
  new_year: (d) =>
    d.getUTCMonth() === 0 && d.getUTCDate() >= 1 && d.getUTCDate() <= 7,
};

export const streakThresholds = {
  daily: [3, 7, 14, 30, 60, 120, 240, 365, 730, 1095, 1460, 1825, 2555, 3650],
  weekly: [4, 8, 16, 32, 52, 104, 156, 208, 260, 364, 520],
  monthly: [3, 6, 12, 24, 36, 48, 60, 84, 120],
};

// badges/uniqueTrailBadges.ts
export const UNIQUE_TRAIL_BADGES = [
  { count: 3, id: "unique_trails_3" },
  { count: 5, id: "unique_trails_5" },
  { count: 10, id: "unique_trails_10" },
  { count: 25, id: "unique_trails_25" },
  { count: 50, id: "unique_trails_50" },
  { count: 100, id: "unique_trails_100" },
  { count: 250, id: "unique_trails_250" },
  { count: 500, id: "unique_trails_500" },
  { count: 1000, id: "unique_trails_1000" },
  { count: 2500, id: "unique_trails_2500" },
  { count: 5000, id: "unique_trails_5000" },
  { count: 10000, id: "unique_trails_10000" },
] as const;

// badges/totalElevationBadges.ts
export const TOTAL_ELEVATION_BADGES = [
  { count: 25, id: "total_elevation_25" },
  { count: 50, id: "total_elevation_50" },
  { count: 64, id: "total_elevation_64" },
  { count: 96, id: "total_elevation_96" },
  { count: 133, id: "total_elevation_133" },
  { count: 319, id: "total_elevation_319" },
  { count: 452, id: "total_elevation_452" },
  { count: 509, id: "total_elevation_509" },
  { count: 828, id: "total_elevation_828" },
  { count: 1776, id: "total_elevation_1776" },
  { count: 3776, id: "total_elevation_3776" },
  { count: 4478, id: "total_elevation_4478" },
  { count: 5895, id: "total_elevation_5895" },
  { count: 6190, id: "total_elevation_6190" },
  { count: 8848, id: "total_elevation_8848" },
  { count: 17700, id: "total_elevation_17700" },
  { count: 35000, id: "total_elevation_35000" },
  { count: 70700, id: "total_elevation_70700" },
  { count: 100000, id: "total_elevation_100000" },
  { count: 200000, id: "total_elevation_200000" },
  { count: 500000, id: "total_elevation_500000" },
  { count: 1000000, id: "total_elevation_1000000" },
  { count: 2000000, id: "total_elevation_2000000" },
  { count: 5000000, id: "total_elevation_5000000" },
  { count: 10000000, id: "total_elevation_10000000" },
  { count: 20000000, id: "total_elevation_20000000" },
  { count: 35786000, id: "total_elevation_35786000" },
  { count: 96000000, id: "total_elevation_96000000" },
  { count: 192000000, id: "total_elevation_192000000" },
  { count: 288000000, id: "total_elevation_288000000" },
  { count: 384400000, id: "total_elevation_384400000" },
] as const;

export const TOTAL_DISTANCE_BADGES = [
  { id: "total_distance_01_neighborhood", meters: 1609 }, // 1 mile
  { id: "total_distance_02_park_run", meters: 4999 }, // 3.1 mi
  { id: "total_distance_03_city_circuit", meters: 9980 }, // 6.2 mi
  { id: "total_distance_04_half_way", meters: 21097 }, // 13.1 mi
  { id: "total_distance_05_legend", meters: 42195 }, // 26.2 mi
  { id: "total_distance_06_channel_cross", meters: 56327 }, // 35 mi
  { id: "total_distance_07_island_length", meters: 80467 }, // 50 mi
  { id: "total_distance_08_metro_link", meters: 120701 }, // 75 mi
  { id: "total_distance_09_century", meters: 160934 }, // 100 mi
  { id: "total_distance_10_coastliner", meters: 241401 }, // 150 mi
  { id: "total_distance_11_grand_canyon", meters: 360887 }, // 224 mi
  { id: "total_distance_12_state_crosser", meters: 531082 }, // 330 mi
  { id: "total_distance_13_great_north", meters: 788567 }, // 490 mi
  { id: "total_distance_14_highland", meters: 1174820 }, // 730 mi
  { id: "total_distance_15_lands_end", meters: 1609340 }, // 1000 mi
  { id: "total_distance_16_border_scout", meters: 2414010 }, // 1500 mi
  { id: "total_distance_17_oregon_trail", meters: 3498110 }, // 2170 mi
  { id: "total_distance_18_continental", meters: 4988980 }, // 3100 mi
  { id: "total_distance_19_great_wall", meters: 7402960 }, // 4600 mi
  { id: "total_distance_20_river_source", meters: 10943200 }, // 6800 mi
  { id: "total_distance_21_cloud_piercer", meters: 16093400 }, // 10000 mi
  { id: "total_distance_22_pole_to_pole", meters: 20017600 }, // 12430 mi
  { id: "total_distance_23_circumnavigator", meters: 29772200 }, // 18500 mi
  { id: "total_distance_24_world_tour", meters: 40084000 }, // 24901 mi
  { id: "total_distance_25_abyss_path", meters: 59545000 }, // 37000 mi
  { id: "total_distance_26_orbit", meters: 88513700 }, // 55000 mi
  { id: "total_distance_27_high_atmosphere", meters: 131968000 }, // 82000 mi
  { id: "total_distance_28_deep_space", meters: 193120000 }, // 120000 mi
  { id: "total_distance_29_satellite", meters: 289680000 }, // 180000 mi
  { id: "total_distance_30_lunar_landing", meters: 384400000 }, // 238855 mi
] as const;

export const STATE_COLLECTION_TIERS = [
  { threshold: 3, id: "states_3", title: "State Sampler" },
  { threshold: 10, id: "states_10", title: "State Collector" },
  { threshold: 25, id: "states_25", title: "State Explorer" },
  { threshold: 50, id: "states_50", title: "Fifty Nifty" },
];
