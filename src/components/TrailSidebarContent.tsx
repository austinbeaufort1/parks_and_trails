// src/components/TrailSidebarContent.tsx
import React from "react";
import { LabelValue } from "./LabelValue";
import { Tag } from "./ui/Tag";
import { LandCover } from "./Landcover";
import { CompletionDetailsPanel } from "./CompletionDetailsPanel/CompletionDetailsPanel";
import { getAngleDesc } from "./helpers/angle";
import { getAngleTag } from "./Table/getTagColor";
import { TrailCard } from "../types/trail";
import { brown } from "@radix-ui/colors";
import { formatDistance } from "./helpers/format";
import { EarnedToken } from "./TokenPopup";
import { useTrailTokens } from "../hooks/useTrailTokens";

interface TrailSidebarContentProps {
  drawerView: "trail" | "completion";
  trail: TrailCard;
  user?: any;
  count?: number;
  completionStyles?: string[];
  tokens: EarnedToken[];
  refreshTokens: () => void;
}

export const TrailSidebarContent: React.FC<TrailSidebarContentProps> = ({
  drawerView,
  trail,
  user,
  count = 0,
  completionStyles = [],
  tokens,
}) => {
  const cruxAngle = trail.max_angle;

  if (drawerView === "trail") {
    return (
      <>
        <h2 style={{ fontFamily: "Rock Salt", color: `${brown.brown11}` }}>
          {trail.park_name}
        </h2>
        <h2
          style={{
            fontFamily: "Permanent Marker",
            borderBottom: `5px solid ${brown.brown11}`,
          }}
        >
          {trail.title}
        </h2>

        <p style={{ fontSize: "16x !important", fontWeight: "bold" }}>
          {trail.description}
        </p>
        <LabelValue label="Where" value={trail.county + ", " + trail.state} />
        <LabelValue
          label="Distance"
          value={formatDistance(trail.total_distance_m)}
        />
        <LabelValue
          label="Elevation Gain"
          value={formatDistance(trail.elevation_gain_m)}
        />
        <LabelValue
          label="Avg Angle"
          value={
            <>
              {trail.avg_angle.toFixed(1)}°
              <Tag color={getAngleTag(getAngleDesc(trail.avg_angle))}>
                {getAngleDesc(trail.avg_angle)}
              </Tag>
            </>
          }
        />
        <LabelValue
          label="Max Angle"
          value={
            <>
              {cruxAngle.toFixed(1)}°
              <Tag color={getAngleTag(getAngleDesc(cruxAngle))}>
                {getAngleDesc(cruxAngle)}
              </Tag>
            </>
          }
        />
        <LabelValue label="Tree Coverage" value={`${trail.avg_canopy_pct}%`} />
        <LandCover landcover_percentages={trail.landcover_percentages} />
        <LabelValue
          label="Tags"
          value={trail.tags.map((tag, i) =>
            i === trail.tags.length - 1 ? tag : tag + ", "
          )}
        />
        {/* <LabelValue
          label="Trail Tokens (Your Experience on this Trail)"
          value={trail.tokens.map((tag, i) =>
            i === trail.tokens.length - 1 ? tag : tag + ", "
          )}
        /> */}
      </>
    );
  }

  if (drawerView === "completion" && user && count > 0) {
    return (
      <CompletionDetailsPanel
        count={count}
        distancePerCompletion={trail.total_distance_m}
        elevationPerCompletion={trail.elevation_gain_m}
        completionStyles={completionStyles}
        tokens={tokens}
      />
    );
  }

  return null;
};
