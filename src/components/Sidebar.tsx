// src/components/Sidebar.tsx
import styled from "styled-components";
import { ReactNode } from "react";
import { Button } from "./ui/Buttons";

const SidebarContainer = styled.div<{ open: boolean; mapMode?: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  max-width: 500px;
  background: white;
  // box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
  transform: translateX(${(props) => (props.open ? "0%" : "100%")});
  transition: transform 0.3s ease-in-out;
  z-index: ${(props) => (props.mapMode ? 2000 : 1010)};
  padding: 16px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    width: 50%;
  }
`;

const Overlay = styled.div<{ open: boolean; mapMode?: boolean }>`
  display: ${(props) => (props.open ? "block" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);

  z-index: ${(props) => (props.mapMode ? 1900 : 1000)}; /* 👈 below sidebar */
`;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  mapMode?: boolean;
  header?: ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  children,
  title,
  mapMode = false,
  header,
}) => {
  return (
    <>
      <Overlay open={open} mapMode={mapMode} onClick={onClose} />
      <SidebarContainer open={open} mapMode={mapMode}>
        {/* Actions / header at the top */}
        {header && <SidebarTopBar>{header}</SidebarTopBar>}

        {/* Scrollable main content */}
        <SidebarContent>{children}</SidebarContent>

        {/* Close button always at bottom */}
        <SidebarCloseContainer>
          <Button onClick={onClose} style={{ width: "100%" }}>
            Close
          </Button>
        </SidebarCloseContainer>
      </SidebarContainer>
    </>
  );
};

const SidebarTopBar = styled.div`
  display: flex;
  justify-content: flex-start; /* actions on left */
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #ccc;
`;

const SidebarContent = styled.div`
  flex: 1 1 auto; /* take remaining space */
  overflow-y: auto; /* scroll if needed */
  padding: 16px 0;
`;

const SidebarCloseContainer = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: 8px 0;
  background: white; /* optional: match sidebar background */
  z-index: 10;
  display: flex;
  justify-content: center;
`;
