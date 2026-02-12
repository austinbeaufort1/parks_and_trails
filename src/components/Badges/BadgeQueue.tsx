// BadgeQueue.tsx
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { BadgePopup } from "./BadgePopup";

const pop = keyframes`
  0% { transform: scale(0); }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); }
`;

const BadgeOverlay = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? "flex" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1300;
  pointer-events: none;
`;

const BadgeContainer = styled.div<{ visible: boolean }>`
  padding: 24px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.8); // darker and more opaque
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: scale(${(props) => (props.visible ? 1 : 0)});
  animation: ${pop} 0.6s ease forwards;
`;

export interface EarnedBadge {
  id: string;
  title: string;
  description?: string;
  icon_svg?: string;
}

interface BadgeQueueProps {
  badges: EarnedBadge[];
  onFinish?: () => void; // optional callback when all badges have shown
}

export const BadgeQueue: React.FC<BadgeQueueProps> = ({ badges, onFinish }) => {
  const [queue, setQueue] = useState<EarnedBadge[]>([]);
  const [current, setCurrent] = useState<EarnedBadge | null>(null);
  const [visible, setVisible] = useState(false);

  // Add new badges to the queue whenever `badges` prop changes
  useEffect(() => {
    if (badges.length) {
      setQueue((prev) => [...prev, ...badges]);
    }
  }, [badges]);

  // Show next badge in queue
  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((prev) => prev.slice(1));
      setVisible(true);
    }
  }, [queue, current]);

  // Auto-hide current badge after 3s and move to next
  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(null);
        if (queue.length === 0 && onFinish) onFinish();
      }, 600); // match animation duration
    }, 3000);
    return () => clearTimeout(timer);
  }, [current, queue, onFinish]);

  if (!current) return null;

  return (
    <BadgeOverlay visible={visible}>
      <BadgeContainer visible={visible}>
        <BadgePopup badge={current} size={160} />
      </BadgeContainer>
    </BadgeOverlay>
  );
};
