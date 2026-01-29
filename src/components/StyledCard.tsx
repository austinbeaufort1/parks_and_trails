import styled from "styled-components";

export const StyledCard = styled.div`
  width: 100%;
  max-width: 480px;
  min-width: 0;
  margin-bottom: 16px;
  border: 2px solid rgb(0, 94, 12);
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  background-color: white;
  box-sizing: border-box;
  padding: 16px;
  position: relative;

  /* Optional: hover effect */
  &:hover {
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
  }
`;
