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
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
`;
