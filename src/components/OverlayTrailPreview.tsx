// src/components/OverlayTrailPreview.tsx
import React from "react";
import styled from "styled-components";
import { getDifficultyDescription } from "../components/helpers/difficulty";
import { formatDistance } from "../components/helpers/format";
import { getAngleColor, getAngleDesc } from "../components/helpers/angle";
import { TrailCard as TrailCardType } from "../types/trail";
import { useUserCompletionsMap } from "../hooks/useUserCompletionsMap";
import { useAuth } from "./AuthContext";

interface OverlayTrailPreviewProps {
  trail: TrailCardType;
  trailTime: string;
  setSidebarOpen: any;
  setDrawerView: any;
}

export const OverlayTrailPreview: React.FC<OverlayTrailPreviewProps> = ({
  trail,
  trailTime,
  setSidebarOpen,
  setDrawerView,
}) => {
  const { user } = useAuth();
  const { completionsMap, refresh: refreshCompletions } = useUserCompletionsMap(
    user?.id ?? null,
  );
  const count = completionsMap[trail.id] ?? 0;

  return (
    <OverlayPreview>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "-8px",
        }}
      >
        <h4 style={{ marginBottom: 0, marginRight: "10px" }}>
          {getDifficultyDescription(trail.difficulty_score)}
        </h4>
        <p style={{ fontSize: "14px", marginTop: "2px" }}>
          <i>
            {formatDistance(trail.total_distance_m)} · Est. {trailTime}
          </i>
        </p>
      </div>
      <div style={{ display: "flex" }}>
        <h4 style={{ marginBottom: 0 }}>{trail.title}</h4>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: "12px",
          marginTop: "3px",
        }}
      >
        <p
          style={{
            borderBottom: `2px solid ${getAngleColor(trail.avg_angle)}`,
            borderTop: `2px solid ${getAngleColor(trail.avg_angle)}`,
            paddingLeft: "2px",
            paddingRight: "2px",
            marginRight: "10px",
          }}
        >
          Avg: {getAngleDesc(trail.avg_angle)}
        </p>
        <p
          style={{
            borderBottom: `2px solid ${getAngleColor(trail.max_angle)}`,
            borderTop: `2px solid ${getAngleColor(trail.max_angle)}`,
            paddingLeft: "2px",
            paddingRight: "2px",
          }}
        >
          Max: {getAngleDesc(trail.max_angle)}
        </p>
      </div>
      <div style={{ display: "flex" }}>
        <button
          onClick={() => {
            setSidebarOpen(true);
            setDrawerView("trail");
          }}
          style={{ width: "100%", fontWeight: "bold" }}
        >
          View Details
        </button>

        {user && count > 0 && (
          <button
            onClick={() => {
              setSidebarOpen(true);
              setDrawerView("completion");
            }}
            style={{
              width: "100%",
              fontWeight: "bold",
              background: "#DCC48E",
              color: "#5D4037",
              marginLeft: "10px",
              paddingTop: "3px",
              paddingBottom: "5px",
            }}
          >
            View Memories
          </button>
        )}
      </div>
    </OverlayPreview>
  );
};

// ================= Styled Components =================
export const OverlayPreview = styled.div`
  position: absolute;
  width: 285px;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 1001; /* above map, below sidebar if needed */

  h4 {
    margin: 0 0 4px 0;
  }
  p {
    margin: 0 0 8px 0;
  }

  button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    background-color: rgb(0, 94, 12);
    color: white;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }
`;
