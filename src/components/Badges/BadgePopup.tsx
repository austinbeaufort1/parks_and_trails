// components/Badges/BadgePopup.tsx
import styled from "styled-components";
import { BadgeData } from "./Badge"; // import the shared type if needed
import {
  getBadgeColor,
  getPathBoundingBox,
} from "../helpers/Rewards/badgeHelpers"; // reuse helpers
import { getBrowserBBox } from "../helpers/Rewards/svgBBox";

export interface BadgePopupData {
  id: string;
  title: string;
  description?: string;
  icon_svg?: string; // filename or state abbreviation
  svgPath?: string; // path for state SVG
  color?: string; // optional background for non-state badges
}

export const BadgePopup = ({
  badge,
  size = 160,
}: {
  badge: BadgePopupData & { color?: string };
  size?: number;
}) => {
  const isFileIcon = badge.icon_svg?.endsWith(".svg");
  let inlineSvg: string | null = null;

  // ----------- Determine background color ----------
  const backgroundColor = getBadgeColor(badge);

  // ----------- Prepare inline SVG if state -----------
  if (badge.svgPath) {
    const isCounty = badge.id.includes("_county");

    let viewBox: string;

    if (isCounty) {
      const bbox = getBrowserBBox(badge.svgPath);
      const padding = 5;

      viewBox = `
      ${bbox.x - padding}
      ${bbox.y - padding}
      ${bbox.width + padding * 2}
      ${bbox.height + padding * 2}
    `;
    } else {
      const bbox = getPathBoundingBox(badge.svgPath);
      const padding = 5;

      viewBox = `
      ${bbox.minX - padding}
      ${bbox.minY - padding}
      ${bbox.maxX - bbox.minX + padding * 2}
      ${bbox.maxY - bbox.minY + padding * 2}
    `;
    }

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
    stroke-width="${isCounty ? 0.5 : 1}"
  />
  <path d="${badge.svgPath}" fill="white" />
</svg>
`;
  }

  // ---------- Render ----------
  return (
    <PopupWrapper>
      <BadgeCircle size={size} $bgColor={backgroundColor}>
        {inlineSvg && (
          <SvgWrapper dangerouslySetInnerHTML={{ __html: inlineSvg }} />
        )}
        {!inlineSvg && isFileIcon && badge.icon_svg && (
          <img
            src={`/badges/${badge.icon_svg}`}
            alt={badge.title}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        )}
      </BadgeCircle>

      {badge.title && <Title>{badge.title}</Title>}
      {badge.description && <Description>{badge.description}</Description>}
    </PopupWrapper>
  );
};

// ---------- Styled Components ----------
const PopupWrapper = styled.div`
  text-align: center;
  color: white;
`;

const BadgeCircle = styled.div<{ size: number; $bgColor?: string }>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border-radius: 50%;
  background-color: ${(p) => p.$bgColor || "rgba(0,0,0,0.15)"};
  position: relative;
  margin: 0 auto;

  /* 3D token shadow */
  box-shadow:
    0 6px 12px rgba(0, 0, 0, 0.35),
    inset 0 -4px 8px rgba(0, 0, 0, 0.15);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: rgba(255, 255, 255, 0.15); /* highlight top */
    z-index: 0;
  }
`;

const SvgWrapper = styled.div`
  position: absolute;
  inset: 12%;
  z-index: 1;

  svg {
    width: 100%;
    height: 100%;
    fill: white;
  }
`;

const Title = styled.div`
  margin-top: 14px;
  font-family: "Permanent Marker";
  font-size: 26px;
`;

const Description = styled.div`
  margin-top: 8px;
  font-size: 16px;
  opacity: 0.9;
`;
