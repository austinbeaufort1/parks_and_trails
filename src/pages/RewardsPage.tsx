import { useEffect, useState } from "react";
import { supabase } from "../connection/supabase";
import { Badge } from "../components/Badges/Badge";
import { CollectionBadge } from "../components/Badges/CollectionBadge";
import usCounties from "@svg-maps/usa.counties";

interface EarnedBadge {
  id: string;
  title: string;
  description?: string;
  icon_svg?: string;
  earned_at: string;
  svgPath?: string;
}

const RewardsPage = ({ userId }: { userId: string }) => {
  const [badges, setBadges] = useState<EarnedBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCollection, setOpenCollection] = useState<string | null>(null);

  // ------------------------
  // Fetch badges
  // ------------------------
  useEffect(() => {
    if (!userId) return;

    async function fetchBadges() {
      const { data, error } = await supabase
        .from("user_badges")
        .select(
          `
          earned_at,
          badges (
            id,
            title,
            description,
            icon_svg
          )
        `,
        )
        .eq("user_id", userId)
        .order("earned_at", { ascending: false });

      if (!error && data) {
        const formatted = data.map((row: any) => ({
          id: row.badges.id,
          title: row.badges.title,
          description: row.badges.description,
          icon_svg: row.badges.icon_svg,
          earned_at: row.earned_at,
        }));

        setBadges(formatted);
      }

      setLoading(false);
    }

    fetchBadges();
  }, [userId]);

  // ------------------------
  // Badge grouping
  // ------------------------

  // State badges (icon_svg = state abbrev)
  const stateBadges = badges.filter(
    (b) => b.icon_svg && !b.icon_svg.endsWith(".svg"),
  );

  // Season badges (id starts with season_)
  const seasonBadges = badges.filter((b) => b.id.startsWith("season_"));

  // County badges (id ends with "_county_<state>")
  const countyBadges = badges.filter((b) => /_county_/.test(b.id));

  // National Park badges (id ends with _national_park)
  const nationalParkBadges = badges.filter((b) => /_national_park$/.test(b.id));

  // State Park
  const stateParkBadges = badges.filter((b) => /_state_park$/.test(b.id));

  // Holiday badges (id starts with holiday_)
  const holidayBadges = badges.filter((b) => b.id.startsWith("holiday_"));
  // Streak badges (id starts with streak_)
  const streakBadges = badges.filter((b) => b.id.startsWith("streak_"));

  // Everything else
  const standaloneBadges = badges.filter(
    (b) =>
      !b.id.startsWith("season_") &&
      !b.id.startsWith("holiday_") &&
      !/streak/.test(b.id) &&
      !/_county_/.test(b.id) &&
      !/_national_park$/.test(b.id) &&
      !/_state_park$/.test(b.id) &&
      (!b.icon_svg || b.icon_svg.endsWith(".svg")),
  );

  // ------------------------
  // Helpers
  // ------------------------
  const toggleCollection = (name: string) => {
    setOpenCollection((prev) => (prev === name ? null : name));
  };

  const getCountySvgPath = (badgeId: string) => {
    // badgeId = "westmoreland_county_pa"
    const match = badgeId.match(/^(.+)_county_([a-z]{2})$/);
    if (!match) return undefined;

    const [_, countyPart, statePart] = match;

    const normalizedCounty = countyPart.replace(/_/g, "").toLowerCase();

    // find matching county in usCounties.locations
    const countyFeature = usCounties.locations.find((c) => {
      const [countyId, stateId] = c.id.split("-");
      return countyId.startsWith(normalizedCounty) && stateId === statePart;
    });

    return countyFeature?.path;
  };

  // ------------------------
  // Seasons grouping by season type and year
  // ------------------------
  const seasonTypes = ["winter", "spring", "summer", "autumn"];
  const seasonBadgesByType: Record<string, EarnedBadge[]> = {
    winter: [],
    spring: [],
    summer: [],
    autumn: [],
  };

  seasonBadges.forEach((badge) => {
    const match = badge.id.match(
      /^season_(winter|spring|summer|autumn)_\d{4}$/,
    );
    if (match) {
      const season = match[1];
      seasonBadgesByType[season].push(badge);
    }
  });

  // Sort badges in each season by year descending
  Object.keys(seasonBadgesByType).forEach((season) => {
    seasonBadgesByType[season].sort((a, b) => b.title.localeCompare(a.title));
  });

  // ------------------------
  // Render
  // ------------------------
  return (
    <div>
      <h3 style={{ fontFamily: "Permanent Marker" }}>
        Your Field Notes: <br></br>{" "}
        <span style={{ color: "brown" }}>Landmarks of your adventures</span>
      </h3>

      {loading && <p>Loading badges…</p>}
      {!loading && badges.length === 0 && <p>No badges yet — get hiking!</p>}

      {/* ================= Collections ================= */}
      {(stateBadges.length > 0 ||
        seasonBadges.length > 0 ||
        countyBadges.length > 0) && (
        <>
          <h4>Collections</h4>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            {stateBadges.length > 0 && (
              <CollectionBadge
                name="States"
                total={50}
                earned={stateBadges.length}
                onClick={() => toggleCollection("States")}
              />
            )}

            {seasonBadges.length > 0 && (
              <CollectionBadge
                name="Seasons"
                total={4}
                earned={
                  seasonTypes.filter((s) => seasonBadgesByType[s].length > 0)
                    .length
                }
                onClick={() => toggleCollection("Seasons")}
              />
            )}

            {countyBadges.length > 0 && (
              <CollectionBadge
                name="Counties"
                total={3001} // approximate number of US counties
                earned={countyBadges.length}
                onClick={() => toggleCollection("Counties")}
              />
            )}

            {nationalParkBadges.length > 0 && (
              <CollectionBadge
                name="National Parks"
                total={63} // total number of US national parks
                earned={nationalParkBadges.length}
                onClick={() => toggleCollection("National Parks")}
              />
            )}

            {stateParkBadges.length > 0 && (
              <CollectionBadge
                name="State Parks"
                total={2966} // total number of US state parks
                earned={stateParkBadges.length}
                onClick={() => toggleCollection("State Parks")}
              />
            )}

            {holidayBadges.length > 0 && (
              <CollectionBadge
                name="Holidays"
                total={holidayBadges.length}
                earned={holidayBadges.length}
                onClick={() => toggleCollection("Holidays")}
              />
            )}

            {streakBadges.length > 0 && (
              <CollectionBadge
                name="Streaks"
                total={streakBadges.length} // all streak badges earned are shown, total = earned
                earned={streakBadges.length}
                onClick={() => toggleCollection("Streaks")}
              />
            )}
          </div>

          {/* -------- States Collection -------- */}
          {openCollection === "States" && (
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              {stateBadges.map((badge) => (
                <Badge key={badge.id} badge={{ ...badge, color: "#4caf50" }} />
              ))}
            </div>
          )}

          {/* -------- Seasons Collection -------- */}
          {openCollection === "Seasons" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginBottom: 24,
              }}
            >
              {seasonTypes.map((season) => {
                const badges = seasonBadgesByType[season];
                let color: string | undefined;
                if (season === "winter") color = "#B3E5FC";
                if (season === "spring") color = "#C8E6C9";
                if (season === "summer") color = "#FFE082";
                if (season === "autumn") color = "#FFCCBC";

                return (
                  <div key={season}>
                    <h5 style={{ textTransform: "capitalize" }}>{season}</h5>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginBottom: 8,
                      }}
                    >
                      {badges.length > 0 ? (
                        badges.map((badge) => (
                          <Badge
                            key={badge.id}
                            badge={{ ...badge, color }}
                            textColor={
                              season === "winter" ? "white" : undefined
                            }
                          />
                        ))
                      ) : (
                        <span style={{ color: "#999" }}>
                          No badges earned yet
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* -------- Counties Collection -------- */}
          {openCollection === "Counties" && (
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              {countyBadges.map((badge) => (
                <Badge
                  key={badge.id}
                  badge={{
                    ...badge,
                    svgPath: getCountySvgPath(badge.id),
                  }}
                />
              ))}
            </div>
          )}

          {/* -------- National Parks Collection -------- */}
          {openCollection === "National Parks" && (
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              {nationalParkBadges.map((badge) => (
                <Badge key={badge.id} badge={{ ...badge, color: "#FF9800" }} />
              ))}
            </div>
          )}

          {/* -------- State Parks Collection -------- */}
          {openCollection === "State Parks" && (
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              {stateParkBadges.map((badge) => (
                <Badge key={badge.id} badge={{ ...badge, color: "#f3ff8b" }} />
              ))}
            </div>
          )}
        </>
      )}

      {/* -------- Holidays Collection -------- */}
      {openCollection === "Holidays" && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {holidayBadges.map((badge) => (
            <Badge
              key={badge.id}
              badge={{ ...badge, color: "#FF4081" }} // you can pick a holiday color
            />
          ))}
        </div>
      )}

      {/* -------- Streaks Collection -------- */}
      {openCollection === "Streaks" && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {streakBadges.map((badge) => (
            <Badge
              key={badge.id}
              badge={{ ...badge, color: "#FFEB3B" }} // yellow-ish for streaks
            />
          ))}
        </div>
      )}

      {/* ================= Standalone Badges ================= */}
      {standaloneBadges.length > 0 && (
        <>
          <h4>Standalone Badges</h4>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {standaloneBadges.map((badge) => {
              let color: string | undefined;
              if (badge.id === "first_steps") color = "#c1f0cf";
              if (badge.id === "super_hiker") color = "#6EC1E4";
              return <Badge key={badge.id} badge={{ ...badge, color }} />;
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default RewardsPage;
