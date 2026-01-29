import { createGlobalStyle } from "styled-components";

export const LeafletClusterStyles = createGlobalStyle`
  /* ===============================
     Base cluster container
     =============================== */
  .marker-cluster {
    background-clip: padding-box;
    border-radius: 50%;
  }

  .marker-cluster div {
    width: 44px;
    height: 44px;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;
    font-weight: bold;
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;

    box-shadow: 0 3px 8px rgba(0,0,0,0.35);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease;
  }

  /* ===============================
     Size scaling
     =============================== */
  .marker-cluster-small div {
    transform: scale(1);
  }

  .marker-cluster-medium div {
    transform: scale(1.15);
  }

  .marker-cluster-large div {
    transform: scale(1.3);
  }

  .marker-cluster:hover div {
    transform: scale(1.4);
    box-shadow: 0 6px 14px rgba(0,0,0,0.45);
  }

  /* ===============================
     Color scale (classic Leaflet)
     =============================== */

  /* 🟢 Small: 2–9 */
  .marker-cluster-small div {
    background-color: rgba(76, 175, 80, 0.9);
    border: 3px solid #2e7d32;
  }

  /* 🟡 Medium: 10–99 */
  .marker-cluster-medium div {
    background-color: rgba(255, 193, 7, 0.9);
    border: 3px solid #ffa000;
  }

  /* 🟠 Large: 100+ */
  .marker-cluster-large div {
    background-color: rgba(255, 152, 0, 0.9);
    border: 3px solid #ef6c00;
  }

  /* ===============================
     Pulse animation (large clusters)
     =============================== */
  @keyframes clusterPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.6);
    }
    70% {
      box-shadow: 0 0 0 12px rgba(255, 152, 0, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
    }
  }

  .marker-cluster-large div {
    animation: clusterPulse 2s infinite;
  }

  /* ===============================
     Completed clusters (😊)
     =============================== */
  .marker-cluster.cluster-completed div {
    background-color: rgba(33, 150, 243, 0.9);
    border: 3px solid #1565c0;
    animation: none;
  }

  /* ===============================
     Accessibility
     =============================== */
  .marker-cluster:focus-visible div {
    outline: 3px solid white;
    outline-offset: 2px;
  }
`;
