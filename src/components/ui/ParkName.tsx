import styled from "styled-components";
import { brown } from "@radix-ui/colors";

export const ParkName = styled.div`
  font-family: "Rock Salt", cursive;
  color: ${brown.brown11};
  font-size: clamp(1rem, 3vw, 1.25rem);
  margin-top: 0.25rem; /* 4px */
  word-break: break-word;
`;
