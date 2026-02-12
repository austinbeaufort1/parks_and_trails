// src/components/TrailsPage/LightTrailCard.tsx
import React from "react";
import { TrailCard as TrailCardType } from "../../types/trail";
import { formatDistance, formatElevation } from "../helpers/format";
import { getDifficultyDescription } from "../helpers/difficulty";
import styled from "styled-components";

interface LightTrailCardProps {
  trail: TrailCardType;
  onViewMap: () => void;
  onViewDetails?: () => void; // optional callback for "View Details"
}

export const LightTrailCard: React.FC<LightTrailCardProps> = ({
  trail,
  onViewMap,
  onViewDetails,
}) => {
  return (
    <Card>
      <Header>
        <ParkName>{trail.park_name}</ParkName>
        <TrailLocation>
          {trail.county}, {trail.state}
        </TrailLocation>
      </Header>

      <TrailTitle>{trail.title}</TrailTitle>

      <TrailDetails>
        <DetailLine>
          <strong>Effort:</strong>{" "}
          {getDifficultyDescription(trail.difficulty_score)} (
          {trail.difficulty_score})
        </DetailLine>
        <DetailLine>
          <strong>Distance:</strong> {formatDistance(trail.total_distance_m)}
        </DetailLine>
        <DetailLine>
          <strong>Elevation:</strong> {formatElevation(trail.elevation_gain_m)}
        </DetailLine>
        {trail.description && <DetailLine>{trail.description}</DetailLine>}
      </TrailDetails>

      <ButtonRow>
        <ActionButton onClick={onViewMap}>View on Map</ActionButton>
        {onViewDetails && (
          <ActionButton onClick={onViewDetails}>View Details</ActionButton>
        )}
      </ButtonRow>
    </Card>
  );
};

// --- Styled Components ---
const Card = styled.div`
  width: 100%;
  max-width: 480px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
`;

const ParkName = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const TrailLocation = styled.div`
  font-size: 14px;
  color: #555;
`;

const TrailTitle = styled.h3`
  margin: 4px 0;
  font-size: 18px;
`;

const TrailDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: #333;
`;

const DetailLine = styled.div`
  line-height: 1.4;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #4b6cb7;
  color: #fff;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #3a55a0;
  }
`;
