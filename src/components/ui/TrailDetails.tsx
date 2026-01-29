import styled from "styled-components";
import { slate } from "@radix-ui/colors";

export const TrailDetails = styled.div`
  font-size: 1rem; /* 14px */
  font-weight: bold;
  color: black;
  margin-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap; /* allow items to wrap on small screens */
  gap: 0.5rem; /* space between items */

  span {
    display: flex;
    align-items: center;
  }

  @media (min-width: 640px) {
    gap: 1rem;
  }
`;
