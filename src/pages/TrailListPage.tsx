// // src/pages/TrailListPage.tsx
// import React from "react";
// import { TrailCard } from "../components/TrailsPage/TrailCard";
// import { FiltersButton } from "../components/ui/Buttons";
// import { LoadSpinner } from "../components/Loader";
// import { TrailFilters } from "../types/filters";
// import { TrailCard as TrailCardType } from "../types/trail";

// interface TrailListPageProps {
//   trails: TrailCardType[];
//   filters: TrailFilters;
//   filteredTrails: TrailCardType[];
//   loading: boolean;
//   error: string | null;
//   onViewMap: (trailId: string) => void;
//   onOpenFilters: () => void;
// }

// export const TrailListPage: React.FC<TrailListPageProps> = ({
//   filteredTrails,
//   loading,
//   error,
//   onViewMap,
//   onOpenFilters,
// }) => {
//   if (loading)
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center", // horizontal centering
//           alignItems: "center", // vertical centering
//           height: "60vh", // adjust so it’s roughly centered in the viewport
//         }}
//       >
//         <LoadSpinner size={200} />
//       </div>
//     );

//   if (error) {
//     return (
//       <div style={{ padding: 20 }}>
//         <p style={{ color: "red" }}>Error loading trails: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         background: `linear-gradient(
//       to bottom,
//       rgba(25, 25, 112, 0.85) 0%,
//       rgba(72, 61, 139, 0.65) 3%,
//       rgba(123, 104, 238, 0.35) 6%,
//       rgba(123, 104, 238, 0) 9%
//     )`,
//         padding: "32px",
//         textAlign: "center",
//         borderRadius: "12px",
//         width: "90%",
//       }}
//     >
//       {/* ===== LOADING OVERLAY (for filter changes) ===== */}

//       {/* ===== FILTER BUTTON ===== */}
//       <FiltersButton onClick={onOpenFilters}>Filters</FiltersButton>

//       {filteredTrails.length === 0 && !loading ? (
//         <p>No trails match your filters.</p>
//       ) : (
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: 16,
//             justifyContent: "center",
//           }}
//         >
//           {filteredTrails.map((trail) => (
//             <div
//               key={trail.id}
//               style={{
//                 flex: "1 1 340px",
//                 maxWidth: "100%",
//                 boxSizing: "border-box",
//                 marginBottom: 16,
//               }}
//             >
//               <TrailCard trail={trail} onViewMap={() => onViewMap(trail.id)} />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// src/pages/TrailListPage.tsx
// src/pages/TrailListPage.tsx
import React, { useState, useEffect } from "react";
import { TrailCard } from "../components/TrailsPage/TrailCard";
import { FiltersButton } from "../components/ui/Buttons";
import { LoadSpinner } from "../components/Loader";
import { TrailFilters } from "../types/filters";
import { TrailCard as TrailCardType } from "../types/trail";
import { Navigate, useNavigate } from "react-router-dom";

interface TrailListPageProps {
  trails: TrailCardType[];
  filters: TrailFilters;
  filteredTrails: TrailCardType[];
  loading: boolean;
  error: string | null;
  onViewMap: (trailId: string) => void;
  onOpenFilters: () => void;
}

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
  const navigate = useNavigate();
  // inside Home component
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // count trails added in last 7 days
  const newTrailsThisWeek = trails.filter(
    (t) => new Date(t.created_at) >= sevenDaysAgo,
  ).length;

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [filteredTrails]);

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
      <FiltersButton onClick={onOpenFilters}>Filters</FiltersButton>
      {showBanner && (
        <div
          style={{
            position: "relative",
            margin: "1rem 0",
            padding: "1rem 1rem 1rem 1rem",
            backgroundColor: "rgba(34, 139, 34, 0.15)",
            borderLeft: "4px solid #228B22",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#0b3d0b",
          }}
        >
          {/* Close Button */}
          <button
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              padding: "0.2rem 0.6rem",
              border: "none",
              borderRadius: "50%",
              backgroundColor: "transparent",
              color: "#0b3d0b",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1.4rem",
              lineHeight: 1,
            }}
            onClick={() => setShowBanner(false)}
            aria-label="Close banner"
          >
            ×
          </button>

          <div>
            🌿 Trail Depth is actively evolving! <br />
            {newTrailsThisWeek} new trail
            {newTrailsThisWeek === 1 ? "" : "s"} added this week.
          </div>

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
      )}

      {filteredTrails.length === 0 ? (
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
            {filteredTrails.slice(0, visibleCount).map((trail) => (
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

          {visibleCount < filteredTrails.length && (
            <div style={{ marginTop: 24 }}>
              <button
                onClick={() =>
                  setVisibleCount((prev) =>
                    Math.min(prev + ITEMS_PER_PAGE, filteredTrails.length),
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
