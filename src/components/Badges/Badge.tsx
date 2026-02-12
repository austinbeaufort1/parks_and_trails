// components/Badges/Badge.tsx
import styled from "styled-components";
import usStates from "@svg-maps/usa";
import { getPathBoundingBox } from "../helpers/Rewards/badgeHelpers"; // NEW: helpers file
import { Tooltip } from "antd";
import { getBrowserBBox } from "../helpers/Rewards/svgBBox";
import { getBadgeColor } from "../helpers/Rewards/getBadgeColor";

export interface BadgeData {
  id: string;
  title: string;
  description?: string;
  icon_svg?: string; // filename (first_steps.svg) or state abbreviation
  svgPath?: string; // inline SVG markup (states)
  color?: string; // optional background color for non-state badges
  textColor?: string;
}

export const Badge = ({
  badge,
  size = 120,
  showTitle = true,
  textColor,
}: {
  badge: BadgeData;
  size?: number;
  showTitle?: boolean;
  textColor?: string;
}) => {
  if (badge.id.includes("_county")) {
    const splitId = badge.id.split("_");
    badge.title = splitId[0] + ", " + splitId[2];
  }
  const isFileIcon = badge.icon_svg?.endsWith(".svg");
  let inlineSvg: string | null = null;

  // ----------- Determine background color ----------
  const backgroundColor = getBadgeColor(badge);

  // ----------- Prepare inline SVG if state -----------
  if (badge.icon_svg && !isFileIcon) {
    const stateAbbrev = badge.icon_svg.toLowerCase();
    const stateFeature = usStates.locations.find((f) => f.id === stateAbbrev);

    if (stateFeature) {
      const bbox = getPathBoundingBox(stateFeature.path);
      const padding = 5;
      const width = bbox.maxX - bbox.minX + padding * 2;
      const height = bbox.maxY - bbox.minY + padding * 2;
      const viewBox = `${bbox.minX - padding} ${bbox.minY - padding} ${width} ${height}`;

      inlineSvg = `
<svg 
  viewBox="${viewBox}" 
  width="100%" 
  height="100%" 
  xmlns="http://www.w3.org/2000/svg" 
  preserveAspectRatio="xMidYMid meet"
>
    <path
  d="${stateFeature.path}"
  fill="none"
  stroke="#633c1c"
  stroke-width="1"
/>
  <path d="${stateFeature.path}" fill="white" />
</svg>
      `;
    }
  }
  // ----------- Prepare inline SVG if county ----------
  if (badge.svgPath) {
    const bbox = getBrowserBBox(badge.svgPath);
    const padding = 5;

    const viewBox = `
    ${bbox.x - padding}
    ${bbox.y - padding}
    ${bbox.width + padding * 2}
    ${bbox.height + padding * 2}
  `;

    inlineSvg = `
<svg
  viewBox="${viewBox}"
  width="100%"
  height="100%"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
>
  <path
  d="${badge.svgPath}"
  fill="none"
  stroke="#633c1c"
  stroke-width="0.4"
/>
  <path d="${badge.svgPath}" fill="#ffffff" />
</svg>
`;
  }

  return (
    <Tooltip
      overlayInnerStyle={{
        background: "rgba(20,20,20,0.95)",
        borderRadius: 8,
      }}
      trigger="hover"
      color="rgba(20,20,20,0.95)"
      title={
        badge.description ? (
          <div style={{ maxWidth: 220 }}>
            <div
              style={{
                fontFamily: "Permanent Marker",
                fontSize: 14,
                marginBottom: 4,
              }}
            >
              {badge.title}
            </div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>
              {badge.description}
            </div>
          </div>
        ) : null
      }
      placement="top"
    >
      <div style={{ textAlign: "center", cursor: "pointer" }}>
        <BadgeCard
          $icon={isFileIcon ? badge.icon_svg : undefined}
          $bgColor={backgroundColor}
          size={size}
        >
          {inlineSvg && (
            <SvgWrapper dangerouslySetInnerHTML={{ __html: inlineSvg }} />
          )}

          {!inlineSvg && isFileIcon && badge.icon_svg && (
            <IconImg src={`/badges/${badge.icon_svg}`} alt={badge.title} />
          )}

          {showTitle && (
            <BadgeTitle
              $isWinter={badge.id === "season_winter"}
              $textColor={textColor}
            >
              {badge.title}
            </BadgeTitle>
          )}
        </BadgeCard>
      </div>
    </Tooltip>
  );
};

// ------------------------
// Styled Components
// ------------------------
const BadgeCard = styled.div<{
  $icon?: string;
  $bgColor?: string;
  size: number;
}>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border-radius: 50%;
  border: 8px solid brown;
  border-style: outset;
  background-color: ${(p) => p.$bgColor || "rgba(0,0,0,0.15)"};
  position: relative;

  box-shadow:
    0 6px 12px rgba(0, 0, 0, 0.35),
    inset 0 -4px 8px rgba(0, 0, 0, 0.15);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: rgba(255, 255, 255, 0.15);
    z-index: 0;
  }
`;

const SvgWrapper = styled.div`
  position: absolute;
  inset: 0; // fill entire badge
  z-index: 1;

  svg {
    width: 100%;
    height: 100%;
    display: block;
    fill: white; // or use badge.color if you want
    transform: translate(0, 0); // optional reset
  }
`;

// const SvgWrapper = styled.div`
//   position: absolute;
//   inset: 8%;
//   z-index: 1;
//   object-fit: contain; /* scales SVG proportionally */

//   svg {
//     width: 100%;
//     height: 100%;
//     fill: white;
//   }
// `;

const IconImg = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 70%; /* adjust to taste */
  height: 70%; /* adjust to taste */
  transform: translate(-50%, -50%);
  object-fit: contain;
  z-index: 1;
`;

const BadgeTitle = styled.div<{ $textColor?: string; $isWinter?: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;

  font-family: "Permanent Marker";
  font-size: 18px;
  font-weight: bold;
  text-align: center;

  /* color override */
  color: ${(p) => (p.$isWinter ? "white" : p.$textColor || "#000000")};

  /* text shadow: halo for winter, subtle for others */
  text-shadow: ${(p) =>
    p.$isWinter
      ? `
        2px 2px 4px rgba(0,0,0,0.6),
        -2px -2px 4px rgba(0,0,0,0.6),
        2px -2px 4px rgba(0,0,0,0.6),
        -2px 2px 4px rgba(0,0,0,0.6)
      `
      : `
        2px 2px 4px rgba(255, 255, 255, 0.6),
        -2px -2px 4px rgba(255, 255, 255, 0.6),
        2px -2px 4px rgba(255, 255, 255, 0.6),
        -2px 2px 4px rgba(255, 255, 255, 0.6)
      `};
`;
