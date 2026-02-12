import { css } from "styled-components";
import styled from "styled-components";
import { green } from "@radix-ui/colors";

export const Button = styled.button`
  font-family: "Rock Salt", cursive;

  /* Mobile-first */
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;

  border-radius: 10px;
  border: none;
  cursor: pointer;

  background: ${green.green9};
  color: white;

  transition:
    background 0.15s ease,
    transform 0.05s ease;

  &:hover {
    background: ${green.green10};
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid ${green.green11};
    outline-offset: 2px;
  }

  /* Tablet and up */
  @media (min-width: 640px) {
    width: auto;
    padding: 12px 24px;
    font-size: 1.05rem;
  }
`;

export const FiltersButton = styled.button`
  position: fixed;
  top: 10px;
  opacity: 0.8;
  right: 36px;
  background-color: #005e0c;
  color: white;
  border: none;
  padding: 8px 16px;
  font-family: "Permanent Marker";
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  z-index: 100;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #004a09;
  }
`;

export const FiltersButton1100 = styled.button`
  position: fixed;
  top: 10px;
  opacity: 0.8;
  right: 36px;
  background-color: #005e0c;
  color: white;
  border: none;
  padding: 8px 16px;
  font-family: "Permanent Marker";
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1100;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #004a09;
  }
`;

// src/ui/ActionButton.tsx

type Variant = "forest" | "leaf" | "olive" | "sand" | "moss";

interface ActionButtonProps {
  variant?: Variant;
}

const variantStyles: Record<
  Variant,
  {
    bg: string;
    color: string;
    border: string;
    shadow: string;
    hoverBg?: string;
    hoverBorder?: string;
    hoverShadow?: string;
  }
> = {
  forest: {
    bg: "#2E7D32",
    color: "#FFFFFF",
    border: "#1B5E20",
    shadow: "2px 2px 4px rgba(27, 94, 32, 0.4)",
    hoverBg: "#388E3C",
    hoverBorder: "#1B5E20",
    hoverShadow: "6px 6px 6px rgba(27, 94, 32, 0.4)",
  },
  leaf: {
    bg: "#81C784",
    color: "#1B5E20",
    border: "#388E3C",
    shadow: "2px 2px 4px rgba(56, 142, 60, 0.4)",
    hoverBg: "#66BB6A",
    hoverBorder: "#1B5E20",
    hoverShadow: "6px 6px 6px rgba(56, 142, 60, 0.4)",
  },
  olive: {
    bg: "#A1887F",
    color: "#3E2723",
    border: "#5D4037",
    shadow: "2px 2px 4px rgba(93, 64, 55, 0.35)",
    hoverBg: "#8D6E63",
    hoverBorder: "#3E2723",
    hoverShadow: "6px 6px 6px rgba(93, 64, 55, 0.35)",
  },
  sand: {
    bg: "#DCC48E",
    color: "#5D4037",
    border: "#8D6E63",
    shadow: "2px 2px 4px rgba(141, 110, 99, 0.35)",
    hoverBg: "#D4B659",
    hoverBorder: "#5D4037",
    hoverShadow: "6px 6px 6px rgba(141, 110, 99, 0.35)",
  },
  moss: {
    bg: "#7CB342",
    color: "#1B5E20",
    border: "#558B2F",
    shadow: "2px 2px 4px rgba(85, 139, 47, 0.35)",
    hoverBg: "#689F38",
    hoverBorder: "#1B5E20",
    hoverShadow: "6px 6px 6px rgba(85, 139, 47, 0.35)",
  },
};

export const ActionButton = styled.button<ActionButtonProps>`
  width: 90%;
  max-width: 260px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  border-radius: 30px 0 30px 0;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;

  ${({ variant = "forest" }) => {
    const v = variantStyles[variant];
    return css`
      background-color: ${v.bg};
      color: ${v.color};
      border: 2px solid ${v.border};
      box-shadow: ${v.shadow};

      &:hover {
        background-color: ${v.hoverBg || v.bg};
        border: ${v.hoverBorder
          ? `3px solid ${v.hoverBorder}`
          : `2px solid ${v.border}`};
        box-shadow: ${v.hoverShadow || v.shadow};
      }

      &:active {
        transform: scale(0.97);
      }
    `;
  }}

  /* Mobile friendly: make full width on small screens */
  @media (max-width: 480px) {
    width: 100%;
    font-size: 13px;
    padding: 10px 14px;
  }
`;

export const CloudButton = styled.button`
  font-family: "Rock Salt", cursive;
  cursor: pointer;
  border: none;
  color: #333;
  background: rgba(38, 154, 242, 0.8); /* semi-transparent blue */

  padding: 16px 36px;
  font-size: 1.2rem;
  position: relative;
  display: inline-block;
  text-align: center;

  /* Main cloud pill shape */
  border-radius: 50px;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.1),
    inset 0 -4px 6px rgba(255, 255, 255, 0.4);

  /* Hover / active effects */
  transition:
    transform 0.1s ease,
    background 0.2s ease;
  &:hover {
    transform: translateY(-3px);
    background: #1f81d6;
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid #87cefa;
    outline-offset: 2px;
  }

  /* Mobile adjustment */
  @media (max-width: 640px) {
    font-size: 1rem;
    padding: 12px 28px;
  }
`;
