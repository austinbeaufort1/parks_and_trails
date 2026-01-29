// src/styles/LeafletMarkers.ts
import { createGlobalStyle } from "styled-components";

export const LeafletMarkerStyles = createGlobalStyle`
  .start-marker {
    background: transparent;
    border: none;
  }

  /* DEFAULT / NOT COMPLETED → GREEN */
  .start-marker-inner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #4caf50;      /* green */
    border: 2px solid #2e7d32;
    color: white;
    font-weight: bold;
    font-size: 18px;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0 2px 6px rgba(0,0,0,0.35);
  }

  /* COMPLETED → BLUE 😊 */
  .start-marker.completed .start-marker-inner {
    background-color: #2196f3;      /* blue */
    border-color: #1565c0;
  }
`;
