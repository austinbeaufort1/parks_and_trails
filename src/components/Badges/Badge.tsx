// components/Badges/Badge.tsx
import styled from "styled-components";

export interface BadgeData {
  id: string;
  title: string;
  description?: string;
  icon_svg?: string;
}

export const Badge = ({
  badge,
  size = 120,
  showTitle = true,
}: {
  badge: BadgeData;
  size?: number;
  showTitle?: boolean;
}) => {
  return (
    <div style={{ textAlign: "center" }}>
      <BadgeCard icon={badge.icon_svg} size={size}>
        <BadgeContent>{showTitle && <h3>{badge.title}</h3>}</BadgeContent>
      </BadgeCard>

      {badge.description && showTitle && (
        <p style={{ marginTop: 8, fontSize: 12 }}>{badge.description}</p>
      )}
    </div>
  );
};

const BadgeCard = styled.div<{ icon?: string; size: number }>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border-radius: 50%;
  background: ${(p) => (p.icon ? `url(/badges/${p.icon})` : "#4caf50")};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.35);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: rgba(196, 255, 197, 0.35);
    z-index: 0;
  }
`;

const BadgeContent = styled.div`
  z-index: 1;
  text-align: center;

  h3 {
    margin: 0;
    font-size: 16px;
    font-family: "Permanent Marker";
  }
`;
