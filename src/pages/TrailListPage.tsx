// src/pages/TrailListPage.tsx
import React, { useState, useEffect } from "react";
import { TrailCard } from "../components/TrailsPage/TrailCard";
import { FiltersButton } from "../components/ui/Buttons";
import { LoadSpinner } from "../components/Loader";
import { TrailFilters } from "../types/filters";
import { TrailCard as TrailCardType } from "../types/trail";
import { useNavigate } from "react-router-dom";

interface TrailListPageProps {
  trails: TrailCardType[];
  filters: TrailFilters;
  filteredTrails: TrailCardType[];
  loading: boolean;
  error: string | null;
  onViewMap: (trailId: string) => void;
  onOpenFilters: () => void;
}

type SortOption =
  | "default"
  | "newest"
  | "effort_desc"
  | "distance_desc"
  | "max_angle_desc"
  | "avg_angle_desc";

export const TrailListPage: React.FC<TrailListPageProps> = ({
  filteredTrails,
  loading,
  error,
  onViewMap,
  onOpenFilters,
  trails,
}) => {
  const ITEMS_PER_PAGE = 6;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showBanner, setShowBanner] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const navigate = useNavigate();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const newTrailsThisWeek = trails.filter(
    (t) => new Date(t.created_at) >= sevenDaysAgo,
  ).length;

  // Reset pagination when filters OR sort changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [filteredTrails, sortBy]);

  // 🔥 Sorting logic (after filtering)
  const sortedTrails = [...filteredTrails].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      case "effort_desc":
        return b.difficulty_score - a.difficulty_score;

      case "distance_desc":
        return b.total_distance_m - a.total_distance_m;

      case "max_angle_desc":
        return b.max_angle - a.max_angle;

      case "avg_angle_desc":
        return b.avg_angle - a.avg_angle;

      default:
        return 0;
    }
  });

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <LoadSpinner size={200} />
      </div>
    );

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: "red" }}>Error loading trails: {error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: `linear-gradient(
          to bottom,
          rgba(25, 25, 112, 0.85) 0%,
          rgba(72, 61, 139, 0.65) 3%,
          rgba(123, 104, 238, 0.35) 6%,
          rgba(123, 104, 238, 0) 9%
        )`,
        padding: "32px",
        textAlign: "center",
        borderRadius: "12px",
        width: "90%",
      }}
    >
      {/* Filters + Sort Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <FiltersButton onClick={onOpenFilters}>Filters</FiltersButton>

        <div>
          <label style={{ marginRight: 8, fontWeight: 600 }}>Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            <option value="default">Default</option>
            <option value="newest">Newest</option>
            <option value="effort_desc">Effort (High → Low)</option>
            <option value="distance_desc">Distance (Long → Short)</option>
            <option value="max_angle_desc">Max Angle (Steepest)</option>
            <option value="avg_angle_desc">Avg Angle (Steepest)</option>
          </select>
        </div>
      </div>

      {/* Banner */}
      {showBanner && (
        <div
          style={{
            position: "relative",
            margin: "1rem 0",
            padding: "1rem",
            backgroundColor: "rgba(34, 139, 34, 0.15)",
            borderLeft: "4px solid #228B22",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#0b3d0b",
          }}
        >
          <button
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              border: "none",
              background: "transparent",
              fontSize: "1.4rem",
              cursor: "pointer",
            }}
            onClick={() => setShowBanner(false)}
          >
            ×
          </button>
          🌿 Trail Depth is actively evolving! <br />
          {newTrailsThisWeek} new trail
          {newTrailsThisWeek === 1 ? "" : "s"} added this week.
          <div>
            <button
              style={{
                marginTop: "0.5rem",
                padding: "0.4rem 0.8rem",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#228B22",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
              onClick={() => navigate("/updates")}
            >
              View Updates
            </button>
          </div>
        </div>
      )}

      {/* Trails Grid */}
      {sortedTrails.length === 0 ? (
        <p>No trails match your filters.</p>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            {sortedTrails.slice(0, visibleCount).map((trail) => (
              <div
                key={trail.id}
                style={{
                  flex: "1 1 340px",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                  marginBottom: 16,
                }}
              >
                <TrailCard
                  trail={trail}
                  onViewMap={() => onViewMap(trail.id)}
                />
              </div>
            ))}
          </div>

          {visibleCount < sortedTrails.length && (
            <div style={{ marginTop: 24 }}>
              <button
                onClick={() =>
                  setVisibleCount((prev) =>
                    Math.min(prev + ITEMS_PER_PAGE, sortedTrails.length),
                  )
                }
                style={{
                  padding: "12px 24px",
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: "#4b0082",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Load More Trails
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
