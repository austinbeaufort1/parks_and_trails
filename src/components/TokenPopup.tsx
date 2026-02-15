// TokenPopup.tsx
import React from "react";
import styled, { keyframes } from "styled-components";
import { TokenTag } from "./ui/Tag";

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
`;

const Container = styled.div`
  background: #fff;
  padding: 24px 32px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  animation: ${fadeIn} 0.3s ease forwards;
  min-width: 280px;
  max-width: 90%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
`;

const TokenList = styled.div`
  gap: 12px;
  justify-content: center;
`;

const TokenItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const TokenIcon = styled.img`
  width: 48px;
  height: 48px;
`;

const TokenAmount = styled.div`
  margin-top: 4px;
  font-weight: bold;
  font-size: 16px;
`;

export interface EarnedToken {
  id: string;
  title: string;
  description: string;
  icon_emoji: string;
}

interface TokenPopupProps {
  tokens: EarnedToken[];
  onClose: () => void;
}

export const TokenPopup: React.FC<TokenPopupProps> = ({ tokens, onClose }) => {
  if (!tokens.length) return null;

  return (
    <Overlay>
      <Container>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h3
          style={{
            borderTop: "5px solid #45330d",
            borderBottom: "5px solid brown",
            borderLeft: "25px groove brown",
            borderRight: "25px groove brown",
            textAlign: "center",
          }}
        >
          New Tokens!
        </h3>
        <TokenList>
          {tokens.map((token) => (
            <TokenItem key={token.id}>
              <TokenTag color="#2e7d32">
                {token.icon_emoji} {token.title}
              </TokenTag>
              <div style={{ marginTop: "5px" }}>{token.description}</div>
            </TokenItem>
          ))}
        </TokenList>
      </Container>
    </Overlay>
  );
};
