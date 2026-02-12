import styled from "styled-components";

export const Tag = styled.span<{ color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.25em 0.6em;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 12px;
  color: white;
  background-color: ${({ color }) => color || "#6b7280"};
  white-space: nowrap;
`;

export const TokenTag = styled.span<{ color?: string }>`
  display: inline-block;
  padding: 0.25em 0.6em;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 12px;
  color: white;
  background-color: ${({ color }) => color || "#ccc"};

  /* subtle shadow for tapability */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  transition:
    box-shadow 0.2s,
    transform 0.1s;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
`;
