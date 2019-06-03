import styled from 'styled-components';
import { FlexCol, FlexRow } from '../globals';

export const Wrapper = styled(FlexCol)`
  margin: 20px;
  border-radius: 3px;
  padding: 15px;
  flex: 0 0 auto;
  width: 250px;
  height: 300px;
  border: 1px solid #999;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`;

export const Toolbar = styled(FlexRow)`
  flex: 1 1 auto;
  width: 100%;
  font-size: 14px;
  justify-content: space-between;
  align-items: flex-start;
  flex: 0 0 auto;
  height: 25px;
`;
