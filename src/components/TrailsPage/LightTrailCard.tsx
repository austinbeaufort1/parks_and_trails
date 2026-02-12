// src/components/TrailsPage/LightTrailCard.tsx
import React from "react";
import { TrailCard as TrailCardType } from "../../types/trail";
import { formatDistance } from "../helpers/format";

interface LightTrailCardProps {
  trail: TrailCardType;
  onViewMap: () => void;
}

export const LightTrailCard: React.FC<LightTrailCardProps> = ({
  trail,
  onViewMap,
}) => {
  return (
    <div
      onClick={onViewMap}
      style={{
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
        background: "#ccc",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ margin: 0 }}>{trail.title}</h3>
      <p style={{ margin: "4px 0" }}>
        Distance: {formatDistance(trail.total_distance_m)}
      </p>
      <p style={{ margin: "4px 0" }}>Difficulty: {trail.difficulty_score}</p>
    </div>
  );
};
