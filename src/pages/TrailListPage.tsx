// src/pages/TrailListPage.tsx
import React from "react";
import { TrailCard } from "../components/TrailsPage/TrailCard";
import { FiltersButton } from "../components/ui/Buttons";
import { TrailFilters } from "../types/filters";
import { TrailCard as TrailCardType } from "../types/trail";

interface TrailListPageProps {
  trails: TrailCardType[];
  filters: TrailFilters;
  filteredTrails: TrailCardType[]; // computed in App.tsx or useTrailFilters
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
}) => {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <p>Loading trails…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: "red" }}>Error loading trails: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, position: "relative" }}>
      {/* ===== FILTER BUTTON ===== */}
      <FiltersButton onClick={onOpenFilters}>Filters</FiltersButton>

      {filteredTrails.length === 0 ? (
        <p>No trails match your filters.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
          }}
        >
          {filteredTrails.map((trail) => (
            <div
              key={trail.id}
              style={{
                flex: "1 1 300px",
                maxWidth: "100%",
                boxSizing: "border-box",
                marginBottom: 16,
              }}
            >
              <TrailCard trail={trail} onViewMap={() => onViewMap(trail.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
