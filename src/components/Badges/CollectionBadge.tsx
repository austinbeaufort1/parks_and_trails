import styled from "styled-components";

interface CollectionBadgeProps {
  name: string;
  total: number; // total badges in collection
  earned: number; // badges earned
  onClick: () => void;
}

export const CollectionBadge = ({
  name,
  total,
  earned,
  onClick,
}: CollectionBadgeProps) => {
  return (
    <Tag onClick={onClick} title={`View ${name} badges`}>
      <Name>{name}</Name>
      <Count>
        {earned}/{total}
      </Count>
    </Tag>
  );
};

// ---------------- Styled Components ----------------

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px; // pill shape
  background: linear-gradient(135deg, #4badd7, #322100);
  color: white;
  font-family: "Permanent Marker";
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.15s;

  &:hover {
    transform: scale(1.05);
  }
`;

const Name = styled.span`
  margin-right: 8px;
`;

const Count = styled.span`
  font-weight: bold;
  opacity: 0.9;
`;
