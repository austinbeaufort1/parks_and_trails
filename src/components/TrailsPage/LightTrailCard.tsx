// src/components/TrailsPage/LightTrailCard.tsx
import React from "react";
import { TrailCard as TrailCardType } from "../../types/trail";
import { formatDistance } from "../helpers/format";

interface LightTrailCardProps {
  trail: TrailCardType;
  onViewMap: () => void;
}

// src/components/TrailsPage/LightTrailCard.tsx
import React from "react";
import { TrailCard as TrailCardType } from "../../types/trail";

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
      <h3>{trail.name}</h3>
      <p>
        {trail.parkName} – {trail.state}, {trail.county}
      </p>
      <p>{trail.details}</p>
      <button onClick={onViewMap}>View on Map</button>
    </div>
  );
};
