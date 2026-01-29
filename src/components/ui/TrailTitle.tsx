import styled from "styled-components";
import { brown } from "@radix-ui/colors";

export const TrailTitle = styled.div`
  border-bottom: 1px solid ${brown.brown9};
  width: 100%;
  font-family: "Permanent Marker", cursive;
  margin-bottom: 0.25rem; /* 4px */
  word-break: break-word;
  font-size: clamp(1rem, 3vw, 1.25rem);
`;
