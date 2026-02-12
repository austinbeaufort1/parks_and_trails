import styled, { keyframes } from "styled-components";

const moveClouds = keyframes`
  0% { transform: translateX(1000px); }
  100% { transform: translateX(-1000px); }
`;

const CloudsContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 40%;
  top: 0;
  left: 0;
  pointer-events: none; /* clouds won't block clicks */
  overflow: hidden;
  background: green;
  z-index: 0; /* behind everything */
`;

const CloudBase = styled.div`
  background: #fff;
  width: 200px;
  height: 60px;
  border-radius: 200px;
  position: absolute;

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: #fff;
    border-radius: 100px;
  }

  &::before {
    width: 100px;
    height: 80px;
    top: -15px;
    left: 10px;
    transform: rotate(30deg);
  }

  &::after {
    width: 120px;
    height: 120px;
    top: -55px;
    right: 15px;
  }
`;

// Individual clouds with different sizes, speed, and positions
const Cloud = styled(CloudBase)<{
  top: number;
  scale: number;
  opacity: number;
  duration: number;
  left?: number;
}>`
  top: ${({ top }) => top}px;
  left: ${({ left }) => left || 0}px;
  transform: scale(${({ scale }) => scale});
  opacity: ${({ opacity }) => opacity};
  animation: ${moveClouds} ${({ duration }) => duration}s linear infinite;
`;

export const Clouds = () => {
  return (
    <CloudsContainer>
      <Cloud top={50} scale={1} opacity={1} duration={15} />
      <Cloud top={120} scale={0.6} opacity={0.6} duration={25} left={200} />
      <Cloud top={200} scale={0.8} opacity={0.8} duration={20} left={-250} />
      <Cloud top={250} scale={0.75} opacity={0.75} duration={18} left={470} />
      <Cloud top={150} scale={0.8} opacity={0.8} duration={20} left={-150} />
    </CloudsContainer>
  );
};
