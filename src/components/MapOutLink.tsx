import styled from "styled-components";

const StyledLink = styled.a<{ $borderColor?: string }>`
  padding: 4px 8px;
  border: 2px solid ${({ $borderColor }) => $borderColor || "black"};
  border-radius: 6px;
  font-size: 0.8rem;
  text-decoration: none;
  color: black;
  display: inline-block;
  margin-right: 0.5em;

  &:hover {
    opacity: 0.85;
  }
`;

interface MapOutLinkProps {
  href: string;
  borderColor: string;
  emoji: string;
  children: React.ReactNode;
  className?: string;
}

export const MapOutLink = ({
  href,
  borderColor,
  emoji,
  children,
  className,
}: MapOutLinkProps) => (
  <StyledLink
    href={href}
    target="_blank"
    rel="noreferrer"
    $borderColor={borderColor}
    className={className}
  >
    {emoji} {children}
  </StyledLink>
);
