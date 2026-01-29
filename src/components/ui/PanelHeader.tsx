import styled from "styled-components";

export const PanelHeader = styled.div<{ open?: boolean }>`
  font-family: "Permanent Marker", cursive;
  font-weight: ${({ open }) => (open ? 700 : 600)};
  color: ${({ open }) => (open ? "#276749" : "#1a202c")};
`;
