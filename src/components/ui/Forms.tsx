import styled from "styled-components";
import { slate, red, green } from "@radix-ui/colors";

export const FormTitle = styled.h3`
  font-family: "Permanent Marker", cursive;
  font-size: clamp(1.3rem, 4vw, 1.6rem);
  margin-bottom: 1rem;
  text-align: center;
  color: ${green.green11};
`;

export const FormInput = styled.input`
  width: 91.5%;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  border: 1px solid ${slate.slate6};
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: 2px solid ${green.green9};
    outline-offset: 2px;
  }
`;

export const FormError = styled.p`
  color: ${red.red9};
  font-size: 0.9rem;
  margin: 0 0 0.75rem;
  text-align: center;
`;

export const FormButton = styled.button<{ loading?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: ${({ loading }) => (loading ? "not-allowed" : "pointer")};
  background: ${({ loading }) => (loading ? "#94a3b8" : green.green9)};
  color: white;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ loading }) => (loading ? "#94a3b8" : green.green10)};
  }
`;
