import React from 'react';
import styled from 'styled-components';
import { useCalendarTools } from '../../hooks/use-calendar-tools';

const StyledGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 6rem;
  border-left: 1px solid #ededed;
  border-top: 1px solid #ededed;
`;

const GridItem = styled.div<any>`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  align-items: center;
  border-right: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  background: ${({ isWeekend }) => (isWeekend ? '#fafafa' : 'none')};
  padding: 5px 8px;
`;

const DayName = styled.div`
  font-size: 12px;
  line-height: 1em;
  text-transform: uppercase;
`;

const DayNumber = styled.div<any>`
  color: ${({ isOffset }) => (isOffset ? '#777' : 'black')};
  font-size: 18px;
`;

const CalendarToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 0 0 auto;
  height: 50px;
  padding: 0 5px;
`;

const ToolbarTitle = styled.div`
  font-size: 28px;
`;

const ToolbarNav = styled.div`
  font-size: 12px;
`;

const events = [
  { start: new Date(2020, 5, 5, 3, 24, 0), name: 'event name' },
  { start: new Date(2020, 5, 8, 3, 24, 0), name: 'event name' },
  { start: new Date(2020, 5, 10, 3, 24, 0), name: 'event name' },
  { start: new Date(2020, 5, 10, 3, 24, 0), name: 'event name' },
  { start: new Date(2020, 5, 10, 3, 24, 0), name: 'event name' },
  { start: new Date(2020, 5, 17, 3, 24, 0), name: 'event name' },
  { start: new Date(2020, 5, 27), end: new Date(2020, 5, 30), name: '@kobra' },
];

export const Calendar = () => {
  const {
    days,
    daysNames,
    getCurrentMonthName,
    getCurrentYearName,
    addCalendarMonth,
    subCalendarMonth,
    reset,
  } = useCalendarTools({ events });

  return (
    <div>
      <CalendarToolbar>
        <ToolbarTitle>
          {getCurrentMonthName()} {getCurrentYearName()}
        </ToolbarTitle>
        <ToolbarNav>
          <button onClick={subCalendarMonth}>prev</button>
          <button onClick={reset}>curr</button>
          <button onClick={addCalendarMonth}>next</button>
        </ToolbarNav>
      </CalendarToolbar>
      <StyledGrid>
        {days.map((day, index) => {
          return (
            <GridItem key={index} isWeekend={day.weekend}>
              {daysNames[index] && (
                <DayName>{daysNames[index].slice(0, 3)}</DayName>
              )}
              <DayNumber isOffset={day.offset}>{day.day}</DayNumber>
              {day.events && day.events.length ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {day.events.map((evt, index) => (
                    <div key={index}>{evt.name}</div>
                  ))}
                </div>
              ) : null}
            </GridItem>
          );
        })}
      </StyledGrid>
    </div>
  );
};