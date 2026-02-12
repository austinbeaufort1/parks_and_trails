import { BadgeData } from "../../Badges/Badge";

export function getBadgeColor(badge: BadgeData) {
  if (badge.id.startsWith("first_step")) {
    return "#e0ffea";
  }

  if (badge.id.startsWith("state_") && badge.id.length === 8) {
    return stringToColor(badge.id);
  }

  if (badge.id.includes("_county_")) {
    return stringToColor(badge.id);
  }

  if (badge.id.endsWith("_state_park")) {
    return stringToColor(badge.id);
  }

  if (badge.id.startsWith("total_elevation")) {
    return "#544b8d";
  }

  if (badge.id.startsWith("total_distance")) {
    return "rgb(155, 247, 255)";
  }

  if (badge.id.startsWith("states_")) {
    return "#003590";
  }

  if (badge.id.startsWith("unique_trails_")) {
    // const n = parseInt(badge.id.split("_").at(-1) || "0", 10);

    // if (n >= 1000) return "#14532d"; // deep emerald
    // if (n >= 100) return "#166534";
    // if (n >= 25) return "#22c55e";
    // if (n >= 10) return "#4ade80";
    return "rgb(142, 0, 155)";
  }

  if (badge.id.startsWith("season_")) {
    return "#bae6fd";
  }

  return "rgba(0,0,0,0.15)";
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 40%, 75%)`; // pastel
}
