import styled from 'styled-components';

export const StyledYearGrid = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, auto);
`;

export const StyledMonthGrid = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 2.5rem;
  border-left: 1px solid #ededed;
  border-top: 1px solid #ededed;
  user-select: none;
`;

export const LoadingEvents = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
`;

export const GridItem = styled.div<any>`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  align-items: center;
  border-right: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  background: ${({ isWeekend }) => (isWeekend ? '#fafafa' : 'none')};
  padding: 5px 0;
`;

export const DayName = styled.div`
  font-size: 12px;
  line-height: 1em;
  text-transform: uppercase;
`;

export const DayNumber = styled.div<any>`
  color: ${({ isOffset }) => (isOffset ? '#777' : 'black')};
  font-size: 18px;
`;

export const CalendarToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 0 0 auto;
  height: 50px;
  padding: 0 5px;
`;

export const ToolbarTitle = styled.div`
  font-size: 28px;
`;

export const ToolbarNav = styled.div`
  font-size: 12px;
`;

export const DayEvent = styled.div<any>`
  position: relative;
  display: flex;
  flex: 0 0 auto;
  text-align: left;
  width: 100%;
  font-size: 12px;
  line-height: 1em;
  padding: 2px 10px;
  margin-bottom: 3px;
  color: ${({ isOffset }) => (isOffset ? '#777' : '#000')};

  &:before {
    content: ' ';
    position: absolute;
    left: 2px;
    top: 0;
    bottom: 0;
    margin: auto 0;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${({ isOffset }) => (isOffset ? '#a671c9' : '#7d31b0')};
  }
`;

export const OverlappingEvent = styled.div<any>`
  display: flex;
  flex: 0 0 auto;
  text-align: left;
  width: 100%;
  font-size: 12px;
  line-height: 1em;
  padding: 2px 5px;
  margin-bottom: 3px;
  color: #fff;
  background: #7d31b0;
`;
