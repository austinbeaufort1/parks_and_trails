import React from "react";
import styled, { keyframes } from "styled-components";
import { QuestEvent } from "./helpers/Rewards/checkQuests";

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
  min-width: 320px;
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

const EventCard = styled.div`
  text-align: center;
  padding: 16px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const QuestIcon = styled.div`
  font-size: 42px;
  margin-bottom: 8px;
`;

const ProgressBarContainer = styled.div`
  background: #eee;
  border-radius: 12px;
  overflow: hidden;
  height: 14px;
  margin-top: 10px;
`;

const ProgressBarFill = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background: #4caf50;
  transition: width 0.3s ease;
`;

interface QuestPopupProps {
  events: QuestEvent[];
  onClose: () => void;
}

export const QuestPopup: React.FC<QuestPopupProps> = ({ events, onClose }) => {
  if (!events.length) return null;

  return (
    <Overlay>
      <Container>
        <CloseButton onClick={onClose}>×</CloseButton>

        {events.map((event) => (
          <EventCard key={`${event.questId}-${event.type}`}>
            <QuestIcon>📜</QuestIcon>

            {event.type === "unlocked" && (
              <>
                <h3>New Quest Unlocked!</h3>
                <h4>{event.title}</h4>
                <p>Starting at level {event.level}</p>
              </>
            )}

            {event.type === "leveled_up" && (
              <>
                <h3>Quest Level Up!</h3>
                <h4>{event.title}</h4>
                <p>Reached level {event.level}</p>
                <ProgressBarContainer>
                  <ProgressBarFill progress={event.progress} />
                </ProgressBarContainer>
              </>
            )}

            {event.type === "completed" && (
              <>
                <h3>Quest Completed! 🎉</h3>
                <h4>{event.title}</h4>
              </>
            )}
          </EventCard>
        ))}
      </Container>
    </Overlay>
  );
};
