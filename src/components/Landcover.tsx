// LandCover.js
import styled from "styled-components";
import { LabelValue } from "./LabelValue";

const LandCoverContainer = styled.p`
  margin: 0.5em 0;
  text-align: start;
`;

const LandCoverItem = styled.span`
  margin-right: 0.5em;
`;

interface LandcoverProps {
  landcover_percentages: Array<{ type: string; percent: number }>;
}

export const LandCover = ({ landcover_percentages }: LandcoverProps) => {
  if (!landcover_percentages || landcover_percentages.length === 0) {
    return <LandCoverContainer>No landcover data</LandCoverContainer>;
  }

  return (
    <LandCoverContainer>
      <strong>Land Cover:</strong>{" "}
      {landcover_percentages.map((lc, i) => (
        <LandCoverItem key={i}>
          {lc.type}: {lc.percent}%
        </LandCoverItem>
      ))}
    </LandCoverContainer>
  );
};
