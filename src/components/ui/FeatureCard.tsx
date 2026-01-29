import styled from "styled-components";
import { slate, blue } from "@radix-ui/colors";

export const FeatureCard = styled.div`
  background: ${slate.slate2};
  border: 1px solid ${slate.slate6};
  border-radius: 12px;

  padding: 1.25rem;
  text-align: center;

  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  }
`;

export const FeatureTitle = styled.h3`
  font-family: "Permanent Marker", cursive;
  font-weight: 400;

  margin: 0 0 0.5rem;

  font-size: clamp(1.2rem, 4vw, 1.5rem);
`;

export const FeatureDescription = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: ${slate.slate11};
`;
