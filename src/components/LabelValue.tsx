// LabelValue.js
import styled from "styled-components";

const Container = styled.p`
  margin: 0.25em 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* good for small screens */
  gap: 0.25em;
`;

const Label = styled.strong`
  margin-right: 0.25em;
`;

interface LabelValueProps {
  label: string;
  value: React.ReactNode;
}

export const LabelValue = ({ label, value }: LabelValueProps) => (
  <Container>
    <Label>{label}:</Label>
    {value}
  </Container>
);
