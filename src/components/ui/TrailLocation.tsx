import styled from "styled-components";
import { slate } from "@radix-ui/colors";

export const TrailLocation = styled.div`
  padding-top: 0.625rem; /* 10px */
  font-family: "Permanent Marker", cursive;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  color: ${slate.slate11};
`;
