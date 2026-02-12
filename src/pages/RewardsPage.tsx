import { useEffect, useState } from "react";
import { supabase } from "../connection/supabase";
import { Badge } from "../components/Badges/Badge";
import { CollectionBadge } from "../components/Badges/CollectionBadge";
import usCounties from "@svg-maps/usa.counties";
import {
  STATE_COLLECTION_TIERS,
  TOTAL_DISTANCE_BADGES,
  TOTAL_ELEVATION_BADGES,
  UNIQUE_TRAIL_BADGES,
} from "../components/helpers/Rewards/badges/constants";
import { LoadSpinner } from "../components/Loader";

interface EarnedBadge {
  id: string;
  title: string;
  description?: string;
  icon_svg?: string;
  earned_at: string;
  svgPath?: string;
}

// ------------------------
// Display Case Component
// ------------------------
const BadgeDisplayCase: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="badge-display-case">
      {/* Inset shadow */}
      <div className="inset-shadow" />

      {/* Sunlight shimmer */}
      <div className="sun-shimmer" />

      {/* Flex container */}
      <div className="badge-container">{children}</div>

      <style jsx>{`
        .badge-display-case {
          position: relative;
          border-radius: 24px;
          padding: 24px;
          overflow: hidden;
          background: linear-gradient(145deg, #2b2f27, #1c2118);
          box-shadow:
            0 25px 50px rgba(0, 0, 0, 0.35),
            0 12px 24px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .inset-shadow {
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
          pointer-events: none;
        }

        .sun-shimmer {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            135deg,
            rgba(69, 43, 10, 0.6) 0%,
            /* soften the brown edge */ rgba(255, 255, 200, 0.85) 35%,
            /* strong yellow highlight */ rgba(206, 246, 255, 0.6) 65%,
            /* soft cyan shimmer */ rgba(69, 43, 10, 0.6) 100%
          );
          pointer-events: none;
          transform: rotate(-10deg);
          filter: blur(40px); /* big blur to spread the intense colors */
          animation: sunShine 12s infinite alternate;
        }

        .badge-container {
          position: relative;
          z-index: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        @keyframes sunShine {
          0% {
            transform: rotate(-10deg) translateX(-50%);
          }
          100% {
            transform: rotate(-10deg) translateX(50%);
          }
        }
      `}</style>
    </div>
  );
};

// ------------------------
// Rewards Page Component
// ------------------------
const RewardsPage = ({ userId }: { userId: string }) => {
  const [badges, setBadges] = useState<EarnedBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCollection, setOpenCollection] = useState<string | null>(null);

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
  // Badge grouping logic
  // ------------------------
  const stateBadges = badges.filter(
    (b) => b.icon_svg && !b.icon_svg.endsWith(".svg"),
  );
  const seasonBadges = badges.filter((b) => b.id.startsWith("season_"));
  const countyBadges = badges.filter((b) => /_county_/.test(b.id));
  const nationalParkBadges = badges.filter((b) => /_national_park$/.test(b.id));
  const stateParkBadges = badges.filter((b) => /_state_park$/.test(b.id));
  const holidayBadges = badges.filter((b) => b.id.startsWith("holiday_"));
  const streakBadges = badges.filter((b) => b.id.startsWith("streak_"));

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

  // Extract and select highest badges
  const earnedUniqueTrailBadges = standaloneBadges.filter((b) =>
    UNIQUE_TRAIL_BADGES.some((badge) => badge.id === b.id),
  );
  const earnedElevationBadges = standaloneBadges.filter((b) =>
    TOTAL_ELEVATION_BADGES.some((badge) => badge.id === b.id),
  );
  const earnedDistanceBadges = standaloneBadges.filter((b) =>
    TOTAL_DISTANCE_BADGES.some((badge) => badge.id === b.id),
  );
  const earnedStateCollectionBadges = standaloneBadges.filter((b) =>
    STATE_COLLECTION_TIERS.some((badge) => badge.id === b.id),
  );

  const highestUniqueTrailBadge = (() => {
    const sorted = [...UNIQUE_TRAIL_BADGES].sort((a, b) => b.count - a.count);
    for (const badgeDef of sorted) {
      const found = earnedUniqueTrailBadges.find((b) => b.id === badgeDef.id);
      if (found) return [found];
    }
    return [];
  })();

  const highestElevationBadge = (() => {
    const sorted = [...TOTAL_ELEVATION_BADGES].sort(
      (a, b) => b.count - a.count,
    );
    for (const badgeDef of sorted) {
      const found = earnedElevationBadges.find((b) => b.id === badgeDef.id);
      if (found) return [found];
    }
    return [];
  })();

  const farthestDistanceBadge = (() => {
    if (earnedDistanceBadges.length === 0) return [];
    const farthest = earnedDistanceBadges.reduce((max, badge) =>
      badge.count > max.count ? badge : max,
    );
    return [farthest];
  })();

  const highestStateCollectionBadge = (() => {
    if (earnedStateCollectionBadges.length === 0) return [];
    const highest = earnedStateCollectionBadges.reduce((max, badge) =>
      (STATE_COLLECTION_TIERS.find((t) => t.id === badge.id)?.threshold || 0) >
      (STATE_COLLECTION_TIERS.find((t) => t.id === max.id)?.threshold || 0)
        ? badge
        : max,
    );
    return [highest];
  })();

  const filteredStandaloneBadges = [
    ...standaloneBadges.filter(
      (b) =>
        !UNIQUE_TRAIL_BADGES.some((badge) => badge.id === b.id) &&
        !TOTAL_ELEVATION_BADGES.some((badge) => badge.id === b.id) &&
        !TOTAL_DISTANCE_BADGES.some((badge) => badge.id === b.id) &&
        !STATE_COLLECTION_TIERS.some((badge) => badge.id === b.id),
    ),
    ...highestUniqueTrailBadge,
    ...highestElevationBadge,
    ...farthestDistanceBadge,
    ...highestStateCollectionBadge,
  ];

  const toggleCollection = (name: string) =>
    setOpenCollection((prev) => (prev === name ? null : name));

  const getCountySvgPath = (badgeId: string) => {
    const match = badgeId.match(/^(.+)_county_([a-z]{2})$/);
    if (!match) return undefined;
    const [_, countyPart, statePart] = match;
    const normalizedCounty = countyPart.replace(/_/g, "").toLowerCase();
    const countyFeature = usCounties.locations.find((c) => {
      const [countyId, stateId] = c.id.split("-");
      return countyId.startsWith(normalizedCounty) && stateId === statePart;
    });
    return countyFeature?.path;
  };

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
    if (match) seasonBadgesByType[match[1]].push(badge);
  });
  Object.keys(seasonBadgesByType).forEach((season) =>
    seasonBadgesByType[season].sort((a, b) => b.title.localeCompare(a.title)),
  );

  // ------------------------
  // Render
  // ------------------------
  return (
    <div
      style={{
        padding: 24,
        background: `linear-gradient(
      to bottom,
      rgba(48, 25, 52, 0.85) 0%,
      rgba(75, 0, 130, 0.65) 30%,
      rgba(138, 43, 226, 0.35) 60%,
      rgba(138, 43, 226, 0) 90%
    )`,
        borderRadius: "12px",
      }}
    >
      <h3
        style={{
          fontFamily: "Permanent Marker",
          color: "white",
          fontSize: "2rem",
        }}
      >
        Your Achievements
      </h3>

      {loading && <LoadSpinner size={200} />}
      {!loading && badges.length === 0 && <p>No badges yet — get hiking!</p>}

      {/* Collections */}
      {(stateBadges.length > 0 ||
        seasonBadges.length > 0 ||
        countyBadges.length > 0 ||
        nationalParkBadges.length > 0 ||
        stateParkBadges.length > 0) && (
        <>
          <h4
            style={{
              borderBottom: "2px solid brown",
              borderTop: "2px solid brown",
              background: "#f8ebdd",
              paddingTop: "5px",
              paddingBottom: "5px",
              paddingLeft: "10px",
            }}
          >
            Collections (tap or click to view)
          </h4>
          <div
            style={{
              display: "flex",
              gap: 10,
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
                total={3001}
                earned={countyBadges.length}
                onClick={() => toggleCollection("Counties")}
              />
            )}
            {nationalParkBadges.length > 0 && (
              <CollectionBadge
                name="National Parks"
                total={63}
                earned={nationalParkBadges.length}
                onClick={() => toggleCollection("National Parks")}
              />
            )}
            {stateParkBadges.length > 0 && (
              <CollectionBadge
                name="State Parks"
                total={2966}
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
                total={streakBadges.length}
                earned={streakBadges.length}
                onClick={() => toggleCollection("Streaks")}
              />
            )}
          </div>

          {/* Render collections */}
          {openCollection === "States" && (
            <BadgeDisplayCase>
              {stateBadges.map((badge) => (
                <Badge key={badge.id} badge={{ ...badge, color: "#4caf50" }} />
              ))}
            </BadgeDisplayCase>
          )}
          {openCollection === "Seasons" && (
            <BadgeDisplayCase>
              {seasonTypes.map((season) => {
                const badges = seasonBadgesByType[season];
                let color;
                if (season === "winter") color = "#B3E5FC";
                if (season === "spring") color = "#C8E6C9";
                if (season === "summer") color = "#FFE082";
                if (season === "autumn") color = "#FFCCBC";
                return badges.length > 0
                  ? badges.map((badge) => (
                      <Badge
                        key={badge.id}
                        badge={{ ...badge, color }}
                        textColor={season === "winter" ? "white" : undefined}
                      />
                    ))
                  : null;
              })}
            </BadgeDisplayCase>
          )}
          {openCollection === "Counties" && (
            <BadgeDisplayCase>
              {countyBadges.map((badge) => (
                <Badge
                  key={badge.id}
                  badge={{ ...badge, svgPath: getCountySvgPath(badge.id) }}
                />
              ))}
            </BadgeDisplayCase>
          )}
          {openCollection === "National Parks" && (
            <BadgeDisplayCase>
              {nationalParkBadges.map((badge) => (
                <Badge key={badge.id} badge={{ ...badge, color: "#FF9800" }} />
              ))}
            </BadgeDisplayCase>
          )}
          {openCollection === "State Parks" && (
            <BadgeDisplayCase>
              {stateParkBadges.map((badge) => (
                <Badge key={badge.id} badge={{ ...badge, color: "#f3ff8b" }} />
              ))}
            </BadgeDisplayCase>
          )}
          {openCollection === "Holidays" && (
            <BadgeDisplayCase>
              {holidayBadges.map((badge) => (
                <Badge key={badge.id} badge={{ ...badge, color: "#FF4081" }} />
              ))}
            </BadgeDisplayCase>
          )}
          {openCollection === "Streaks" && (
            <BadgeDisplayCase>
              {streakBadges.map((badge) => (
                <Badge key={badge.id} badge={{ ...badge, color: "#FFEB3B" }} />
              ))}
            </BadgeDisplayCase>
          )}
        </>
      )}

      {/* Standalone badges */}
      {filteredStandaloneBadges.length > 0 && (
        <>
          <h4
            style={{
              borderBottom: "2px solid brown",
              borderTop: "2px solid brown",
              background: "#f8ebdd",
              paddingTop: "5px",
              paddingBottom: "5px",
              paddingLeft: "10px",
              marginTop: openCollection ? "60px" : "5px",
            }}
          >
            Standalone Badges
          </h4>
          <BadgeDisplayCase>
            {filteredStandaloneBadges.map((badge) => {
              let color;
              if (badge.id === "first_steps") color = "#c1f0cf";
              if (badge.id === "super_hiker") color = "#6EC1E4";
              return <Badge key={badge.id} badge={{ ...badge, color }} />;
            })}
          </BadgeDisplayCase>
        </>
      )}
    </div>
  );
};

export default RewardsPage;
