// src/components/FullLoadSpinner.tsx
import styled from "styled-components";
import { LoadSpinner } from "./Loader";

interface Props {
  size?: number;
}

export const FullLoadSpinner: React.FC<Props> = ({ size = 100 }) => {
  return (
    <Overlay>
      <LoadSpinner size={size} />
    </Overlay>
  );
};

// ===== STYLED COMPONENTS =====
const Overlay = styled.div`
  position: fixed; // stays on screen
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  pointer-events: all; // ensures it catches clicks if needed
`;
