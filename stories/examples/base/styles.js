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

// calendarBase

export const Wrapper = styled(FlexCol)`
  padding: 20px;
  cursor: default;
  user-select: none;
`;

export const Toolbar = styled(FlexRow)`
  justify-content: space-between;
  padding: 0 0 ${({ big }) => (big ? '10px' : '5px')} 10px;
  text-transform: capitalize;
`;

export const Grid = styled.div`
  display: grid;
  height: 100%;
  grid-template-rows: repeat(7, auto);
  grid-template-columns: repeat(7, auto);
`;

export const GridItem = styled(FlexRow)`
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: ${({ darker }) => (darker && '#777') || '#333'};
`;

export const Day = styled(FlexRow)`
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  cursor: ${({ hoverable }) => hoverable && 'pointer'};
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ current, selected }) =>
    (current && '#4286f4') || (selected && '#777')};
  color: ${({ current, weekend }) =>
    (current && 'white') || (weekend && '#777')};
  color: ${({ selected }) => selected && 'white'};
  &:hover {
    background: ${({ current, hoverable }) => hoverable && !current && '#eee'};
  }
`;
