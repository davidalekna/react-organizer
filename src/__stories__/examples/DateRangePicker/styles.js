import styled from 'styled-components';
import { FlexCol, FlexRow } from '../globals';

export const Wrapper = styled(FlexCol)`
  margin: 10px;
`;

export const SelectedDatesPreview = styled(FlexRow)`
  margin-bottom: 10px;
  justify-content: space-between;
`;

export const FakeInput = styled.div`
  padding: 10px;
  border: 1px solid #eee;
  margin-right: 10px;
`;

export const DoubleCalendar = styled(FlexRow)`
  cursor: default;
  user-select: none;
  border: 1px solid #ccc;
`;

export const CalendarWrapper = styled(FlexCol)`
  padding: 0 10px 10px 10px;
`;

export const Toolbar = styled(FlexRow)`
  align-items: center;
  font-size: 20px;
  justify-content: center;
  padding: 10px;
  position: relative;
`;

export const Button = styled.button.attrs({
  type: 'button',
})`
  position: absolute;
  left: ${({ left }) => left && left};
  right: ${({ right }) => right && right};
  cursor: pointer;
`;

export const Grid = styled.div`
  display: grid;
  height: 100%;
  grid-template-rows: repeat(7, auto);
  grid-template-columns: repeat(7, auto);
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
`;

export const GridItem = styled(FlexRow)`
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: ${({ darker }) => (darker && '#777') || '#333'};
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;

  &:nth-child(-n + 7) {
    padding: 5px;
    color: black;
  }
`;

export const Day = styled(FlexRow)`
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  cursor: ${({ hoverable, past }) => !past && hoverable && 'pointer'};
  width: 40px;
  height: 40px;
  background: ${({ current, selected }) =>
    (current && '#4286f4') || (selected && '#777')};
  color: ${({ current, past }) => (current && 'white') || (past && '#ccc')};
  color: ${({ selected }) => selected && 'white'};
  &:hover {
    background: ${({ current, past, hoverable }) =>
      !past && hoverable && !current && '#eee'};
  }
`;
