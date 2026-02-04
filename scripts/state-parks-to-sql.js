/**
 * generateStateParkInserts_fixed.js
 * Node.js script to scrape Wikipedia lists of state parks
 * and generate SQL INSERT statements for your badges table.
 */

import fetch from "node-fetch";
import * as cheerio from "cheerio";
import fs from "fs";

// 50 US states and their abbreviations
const states = [
  { name: "Alabama", abbr: "AL" },
  { name: "Alaska", abbr: "AK" },
  { name: "Arizona", abbr: "AZ" },
  { name: "Arkansas", abbr: "AR" },
  { name: "California", abbr: "CA" },
  { name: "Colorado", abbr: "CO" },
  { name: "Connecticut", abbr: "CT" },
  { name: "Delaware", abbr: "DE" },
  { name: "Florida", abbr: "FL" },
  { name: "Georgia", abbr: "GA" },
  { name: "Hawaii", abbr: "HI" },
  { name: "Idaho", abbr: "ID" },
  { name: "Illinois", abbr: "IL" },
  { name: "Indiana", abbr: "IN" },
  { name: "Iowa", abbr: "IA" },
  { name: "Kansas", abbr: "KS" },
  { name: "Kentucky", abbr: "KY" },
  { name: "Louisiana", abbr: "LA" },
  { name: "Maine", abbr: "ME" },
  { name: "Maryland", abbr: "MD" },
  { name: "Massachusetts", abbr: "MA" },
  { name: "Michigan", abbr: "MI" },
  { name: "Minnesota", abbr: "MN" },
  { name: "Mississippi", abbr: "MS" },
  { name: "Missouri", abbr: "MO" },
  { name: "Montana", abbr: "MT" },
  { name: "Nebraska", abbr: "NE" },
  { name: "Nevada", abbr: "NV" },
  { name: "New Hampshire", abbr: "NH" },
  { name: "New Jersey", abbr: "NJ" },
  { name: "New Mexico", abbr: "NM" },
  { name: "New York", abbr: "NY" },
  { name: "North Carolina", abbr: "NC" },
  { name: "North Dakota", abbr: "ND" },
  { name: "Ohio", abbr: "OH" },
  { name: "Oklahoma", abbr: "OK" },
  { name: "Oregon", abbr: "OR" },
  { name: "Pennsylvania", abbr: "PA" },
  { name: "Rhode Island", abbr: "RI" },
  { name: "South Carolina", abbr: "SC" },
  { name: "South Dakota", abbr: "SD" },
  { name: "Tennessee", abbr: "TN" },
  { name: "Texas", abbr: "TX" },
  { name: "Utah", abbr: "UT" },
  { name: "Vermont", abbr: "VT" },
  { name: "Virginia", abbr: "VA" },
  { name: "Washington", abbr: "WA" },
  { name: "West Virginia", abbr: "WV" },
  { name: "Wisconsin", abbr: "WI" },
  { name: "Wyoming", abbr: "WY" },
];

// Normalize park name into a DB-safe id
function normalizeId(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

// Map states to correct Wikipedia page URLs (handles redirects/special cases)
function wikiUrlForState(name) {
  const specialCases = {
    "New Jersey": "List_of_New_Jersey_state_parks",
    "New Mexico": "List_of_New_Mexico_state_parks",
    "New York": "List_of_New_York_state_parks",
    "North Carolina": "List_of_state_parks_in_North_Carolina",
    Washington: "List_of_state_parks_in_Washington_(state)",
    "West Virginia": "List_of_state_parks_in_West_Virginia",
  };
  return `https://en.wikipedia.org/wiki/${
    specialCases[name] || "List_of_state_parks_in_" + name.replace(/\s+/g, "_")
  }`;
}

// Scrape Wikipedia tables for a given state
async function getStateParks(state) {
  const url = wikiUrlForState(state);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Failed to fetch ${state}: ${res.status}`);
      return [];
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const parks = [];

    // Loop over all wikitable tables on the page
    $("table.wikitable").each((_, table) => {
      $(table)
        .find("tbody tr")
        .each((_, tr) => {
          const firstTd = $(tr).find("td").first();
          const parkName = firstTd.text().trim();
          if (parkName && !parkName.includes("—")) parks.push(parkName);
        });
    });

    if (parks.length === 0)
      console.warn(`No parks found for ${state} at ${url}`);

    return parks;
  } catch (err) {
    console.warn(`Failed to fetch parks for ${state}:`, err);
    return [];
  }
}

// Main function
(async function main() {
  let sqlInserts =
    "INSERT INTO badges (id, title, description, icon_svg) VALUES\n";
  const allValues = [];

  for (const { name, abbr } of states) {
    console.log(`Fetching parks for ${name}...`);
    const parks = await getStateParks(name);
    for (const park of parks) {
      const id = `${normalizeId(park)}_state_park`;
      const title = park.replace(/'/g, "''"); // escape single quotes
      const description = `Hiked 3 trails at ${title}`;
      const icon_svg = abbr;

      allValues.push(`('${id}', '${title}', '${description}', '${icon_svg}')`);
    }
  }

  sqlInserts += allValues.join(",\n") + ";";

  fs.writeFileSync("state_parks_inserts.sql", sqlInserts, "utf-8");
  console.log(
    `Done! Generated ${allValues.length} state park badges in state_parks_inserts.sql`,
  );
})();
