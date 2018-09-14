import styled from 'styled-components';

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

export const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;

export const Button = styled.button`
  padding: 5px 10px;
  border-radius: 3px;
  background: #eee;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #ccc;
  }
`;
