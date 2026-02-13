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
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 12,
        background: "#f9f9f9",
      }}
    >
      <p>
        {trail.park_name} – {trail.county}, {trail.state}
      </p>
      <h3>{trail.title}</h3>

      <p>{trail.description}</p>
      <button onClick={onViewMap}>View on Map</button>
    </div>
  );
};
