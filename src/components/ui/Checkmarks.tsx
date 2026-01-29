import styled from "styled-components";
import { green, slate } from "@radix-ui/colors";

export const Checkmark = styled.div<{ size?: number }>`
  background-color: ${green.green9};
  color: white;
  border-radius: 50%;
  width: ${({ size }) => size ?? 24}px;
  height: ${({ size }) => size ?? 24}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: ${({ size }) => (size ? size * 0.66 : 16)}px;
  box-shadow: 0 0 3px ${slate.slate9};
  cursor: default;
`;
