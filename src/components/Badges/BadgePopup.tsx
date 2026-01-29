import styled from "styled-components";

export interface BadgePopupData {
  id: string;
  title: string;
  description?: string;
  icon_svg?: string;
  svgPath?: string; // NEW: path from state map
}

export const BadgePopup = ({
  badge,
  size = 160,
}: {
  badge: BadgePopupData;
  size?: number;
}) => {
  return (
    <PopupWrapper>
      <BadgeCircle size={size}>
        {badge.svgPath && (
          <svg
            viewBox="0 0 100 100"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              fill: "#4caf50",
            }}
          >
            <path d={badge.svgPath} />
          </svg>
        )}
        {badge.icon_svg && !badge.svgPath && (
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

const PopupWrapper = styled.div`
  text-align: center;
  color: white;
`;

const BadgeCircle = styled.div<{ size: number }>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.15); // inner fill behind SVG
  position: relative;
  margin: 0 auto;
  box-shadow:
    0 0 0 6px rgba(255, 255, 255, 0.15),
    0 12px 24px rgba(0, 0, 0, 0.6);
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
