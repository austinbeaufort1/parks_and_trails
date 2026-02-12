// components/Badges/BadgePopup.tsx
import styled from "styled-components";
import { Badge, BadgeData } from "./Badge";

export const BadgePopup = ({
  badge,
  size = 160,
}: {
  badge: BadgeData;
  size?: number;
}) => {
  return (
    <PopupWrapper>
      <BadgeWrapper>
        <Badge
          badge={badge}
          size={size}
          showTitle={false}
          textColor={badge.textColor}
        />
      </BadgeWrapper>

      <Title>{badge.title}</Title>

      {badge.description && <Description>{badge.description}</Description>}
    </PopupWrapper>
  );
};

// ---------- Styled Components ----------
const PopupWrapper = styled.div`
  text-align: center;
  color: white;
`;

const BadgeWrapper = styled.div`
  display: flex;
  justify-content: center;
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
