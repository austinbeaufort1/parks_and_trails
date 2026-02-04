// src/components/ActivityParsTooltip.tsx
import React from "react";
import { Tooltip } from "antd";
import { LabelValue } from "./LabelValue";
import { calculatePar } from "./helpers/parCalculator";
import { metersToFeet } from "./helpers/format";
import { TrailCard } from "../types/trail";

interface ActivityParsTooltipProps {
  trail: TrailCard;
}

export const ActivityParsTooltip: React.FC<ActivityParsTooltipProps> = ({
  trail,
}) => {
  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <LabelValue
        label="Disc Golf Par"
        value={`${Math.ceil(metersToFeet(trail.total_distance_m) / 30)} throws`}
      />
      <LabelValue
        label="Unicycle Dismount Par"
        value={`${calculatePar(trail, 100)} dismounts`}
      />
      <LabelValue
        label="Juggle Drops Par"
        value={`${calculatePar(trail, 150)} drops`}
      />
    </div>
  );

  return (
    <Tooltip title={content} placement="rightTop">
      <span
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          padding: "4px 8px",
          borderBottom: "1px solid black",
          borderRadius: 5,
          display: "inline-block",
        }}
      >
        Activity Pars (hover / click for details)
      </span>
    </Tooltip>
  );
};
