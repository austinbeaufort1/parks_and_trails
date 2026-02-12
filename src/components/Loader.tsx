// src/components/ui/LoadSpinner.tsx
import React from "react";
import styled, { keyframes } from "styled-components";

interface LoadSpinnerProps {
  size?: number; // diameter of the spinner
  lineWidth?: number; // thickness of the ripple lines
}

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

const SpinnerWrapper = styled.div<{ size: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  position: relative;
`;

const Circle = styled.div<{
  size: number;
  color: string;
  delay: string;
  lineWidth: number;
}>`
  position: absolute;
  border: ${({ lineWidth }) => lineWidth}px solid ${({ color }) => color};
  opacity: 0;
  border-radius: 50%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  animation: ${ripple} 1.2s infinite ease-out;
  animation-delay: ${({ delay }) => delay};
`;

export const LoadSpinner: React.FC<LoadSpinnerProps> = ({
  size = 80,
  lineWidth = 4,
}) => {
  const colors = ["#a0d8f1", "#2c7fb8", "#a0d8f1"]; // light blue → dark blue → light blue

  return (
    <SpinnerWrapper size={size}>
      {colors.map((color, i) => (
        <Circle
          key={i}
          size={size}
          color={color}
          delay={`${i * 0.4}s`}
          lineWidth={lineWidth}
        />
      ))}
    </SpinnerWrapper>
  );
};
