import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Checkmark as CheckmarkBase } from "../components/ui/Checkmarks";
import { ActionButton } from "./ui/Buttons";
import { EarnedToken } from "./TokenPopup";

type ActionsVariant = "card" | "sidebar";

interface CardHeaderActionsProps {
  variant?: ActionsVariant;
  count: number;
  user?: any;
  drawerView: string;
  trail: {
    id: string;
    video?: string;
  };
  setDrawerView: (view: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setCompleteModalOpen: (open: boolean) => void;
  onViewMap?: (id: string) => void;
  tokens: EarnedToken[];
  refreshTokens: () => void;
}

export const CardHeaderActions: React.FC<CardHeaderActionsProps> = ({
  variant = "card",
  drawerView,
  count,
  user,
  trail,
  setDrawerView,
  setSidebarOpen,
  setCompleteModalOpen,
  onViewMap,
  tokens,
  refreshTokens,
}) => {
  const [overflowOpen, setOverflowOpen] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        overflowRef.current &&
        !overflowRef.current.contains(e.target as Node)
      ) {
        setOverflowOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <HeaderActionsContainer>
      {/* Conditionally render checkmark */}
      {count > 0 ? <Checkmark>✔</Checkmark> : <div />}

      <OverflowMenu ref={overflowRef}>
        {variant === "sidebar" ? (
          <ActionButton
            style={{ paddingLeft: "30px", paddingRight: "30px" }}
            onClick={() => setOverflowOpen((prev) => !prev)}
          >
            Actions
            <span style={{ marginLeft: "10px" }}>
              {overflowOpen ? "▲" : "▼"}
            </span>
          </ActionButton>
        ) : (
          <OverflowButton onClick={() => setOverflowOpen((prev) => !prev)}>
            ⋯
          </OverflowButton>
        )}

        <OverflowContent className={overflowOpen ? "open" : "closed"}>
          {user && count > 0 && drawerView !== "trail" && (
            <OverflowItem
              onClick={() => {
                setDrawerView("trail");
                setSidebarOpen(true);
                setOverflowOpen(false);
              }}
            >
              View Trail Details
            </OverflowItem>
          )}
          {user && count > 0 && drawerView !== "completion" && (
            <OverflowItem
              onClick={() => {
                setDrawerView("completion");
                setSidebarOpen(true);
                setOverflowOpen(false);
              }}
            >
              View Completion Details
            </OverflowItem>
          )}
          {user && (
            <OverflowItem
              onClick={() => {
                setCompleteModalOpen(true);
                setOverflowOpen(false);
              }}
            >
              Mark as Complete
            </OverflowItem>
          )}
          {onViewMap && (
            <OverflowItem
              onClick={() => {
                onViewMap(trail.id);
                setOverflowOpen(false);
              }}
            >
              View on Map
            </OverflowItem>
          )}
          {trail.video && (
            <OverflowItem
              onClick={() => {
                window.open(trail.video, "_blank", "noopener,noreferrer");
                setOverflowOpen(false);
              }}
            >
              View Adventure
            </OverflowItem>
          )}
        </OverflowContent>
      </OverflowMenu>
    </HeaderActionsContainer>
  );
};

// ================= Styled Components =================
const OverflowMenu = styled.div`
  position: relative;
`;

const OverflowButton = styled.button<{ variant?: ActionsVariant }>`
  background: ${({ variant }) =>
    variant === "sidebar" ? "rgba(255,255,255,0.08)" : "none"};

  border: none;
  cursor: pointer;

  font-size: ${({ variant }) => (variant === "sidebar" ? "32px" : "24px")};

  width: ${({ variant }) => (variant === "sidebar" ? "48px" : "auto")};

  height: ${({ variant }) => (variant === "sidebar" ? "48px" : "auto")};

  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ variant }) => (variant === "sidebar" ? "#eee" : "#444")};

  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const OverflowContent = styled.div`
  position: absolute;
  top: 36px;
  right: 0;
  background: rgba(243, 255, 241, 0.95);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  min-width: 180px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  padding: 0.5rem;

  display: flex;
  flex-direction: column;

  transform-origin: top right;
  transform: scale(0.95);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: transform 0.15s ease, opacity 0.15s ease, visibility 0.15s;

  &.open {
    transform: scale(1);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  &.closed {
    transform: scale(0.95);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
`;

const OverflowItem = styled.div`
  padding: 10px 16px;
  margin: 5px; 5px;
  border-bottom: 2px solid brown;
  border-right: 2px solid brown;
  border-top: 1px solid brown;
  border-left: 1px solid brown;
  font-weight: bold;
  background: rgba(248, 255, 247, 0.95);
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: #d7ffbc;
    transform: translateX(3px);
  }
`;

const Checkmark = styled(CheckmarkBase)``; // use your existing styled Checkmark

const HeaderActionsContainer = styled.div`
  display: flex;
  justify-content: space-between; /* left/right placement */
  align-items: center; /* vertical center */
  width: 100%; /* fill parent width */
  position: relative; /* needed for dropdown positioning */
`;
