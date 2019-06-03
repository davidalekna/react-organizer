import styled from 'styled-components';
import { FlexRow, FlexCol } from '../globals';

export const Wrapper = styled(FlexCol)`
  flex: 1 1 auto;
  width: 100vw;
  height: 100vh;
`;

export const Toolbar = styled(FlexRow)`
  flex: 0 0 auto;
  padding: 0 20px;
  height: 60px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
`;

export const Grid = styled.div`
  display: grid;
  height: 100%;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(7, 1fr);
  cursor: default;
`;

export const Day = styled.div`
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  padding: 5px;

  background: ${({ isOffset, isToday, isSelected }) => {
    if (isOffset) return `#eee`;
    if (isToday) return `#bfffc8`;
    if (isSelected) return `orange`;
  }};
`;

export const Title = styled.div``;

export const Number = styled.div``;
