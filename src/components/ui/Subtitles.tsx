import styled from "styled-components";
import { slate } from "@radix-ui/colors";

export const Subtitle = styled.p`
  margin: 0 0 1.5rem;

  /* Mobile-first */
  font-size: clamp(1rem, 4.5vw, 1.5rem);
  line-height: 1.5;

  color: ${slate.slate11};
  text-align: center;

  max-width: 42ch;
  margin-left: auto;
  margin-right: auto;
`;
