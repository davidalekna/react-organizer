import React from 'react';
import styled from 'styled-components';
import { useCalendarTools } from '../../hooks/use-calendar-tools';
import { useState } from 'react';
import { useEffect } from 'react';

const StyledGrid = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 6rem;
  border-left: 1px solid #ededed;
  border-top: 1px solid #ededed;
  user-select: none;
`;

const LoadingEvents = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
`;

const GridItem = styled.div<any>`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  align-items: center;
  border-right: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  background: ${({ isWeekend }) => (isWeekend ? '#fafafa' : 'none')};
  padding: 5px 0;
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

const DayEvent = styled.div<any>`
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

const OverlappingEvent = styled.div<any>`
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

function MonthView({ items, daysNames, events }) {
  return items.map((day, index) => {
    return (
      <StyledGrid>
        {!events.length ? (
          <LoadingEvents>Loading events...</LoadingEvents>
        ) : null}
        <GridItem key={index} isWeekend={day.weekend}>
          {daysNames[index] && (
            <DayName>{daysNames[index].slice(0, 3)}</DayName>
          )}
          <DayNumber isOffset={day.offset}>{day.day}</DayNumber>
          {day.events && day.events.length ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              {day.events.map((evt, index) => {
                if (evt.end) {
                  return (
                    <OverlappingEvent isOffset={day.offset} key={index}>
                      {evt.title}
                    </OverlappingEvent>
                  );
                }
                return (
                  <DayEvent isOffset={day.offset} key={index}>
                    {evt.title}
                  </DayEvent>
                );
              })}
            </div>
          ) : null}
        </GridItem>
      </StyledGrid>
    );
  });
}

function YearView({ items, daysNames }) {
  return items.map((month, index) => <div key={index}>{month.name}</div>);
}

const eventsFromApi = [
  { start: new Date(2020, 5, 5, 3, 24, 0), title: 'Event name' },
  { start: new Date(2020, 5, 8, 3, 24, 0), title: 'Event name' },
  { start: new Date(2020, 5, 10, 3, 24, 0), title: 'Event name' },
  { start: new Date(2020, 5, 10, 3, 24, 0), title: 'Event name' },
  { start: new Date(2020, 5, 10, 3, 24, 0), title: 'Event name' },
  { start: new Date(2020, 5, 17, 3, 24, 0), title: 'Event name' },
  { start: new Date(2020, 5, 27), end: new Date(2020, 5, 30), title: '@kobra' },
];

export const Calendar = () => {
  const [events, setEvents] = useState([]);
  const {
    items,
    daysNames,
    getCurrentMonthName,
    getCurrentYearName,
    addCalendarMonth,
    subCalendarMonth,
    reset,
    view,
  } = useCalendarTools({ events, view: 'year' });

  console.log(items);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setEvents(eventsFromApi);
  //   }, 3500);
  // }, []);

  useEffect(() => {
    fetch('https://www.gov.uk/bank-holidays.json')
      .then((response) => response.json())
      .then((data) =>
        setEvents(
          data['england-and-wales'].events
            .map((event) => ({
              start: new Date(event.date),
              ...event,
            }))
            .concat(eventsFromApi),
        ),
      );

    console.log('reloaded');
  }, []);

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
      {view === 'month' && (
        <MonthView events={events} items={items} daysNames={daysNames} />
      )}
      {view === 'year' && <YearView items={items} daysNames={daysNames} />}
    </div>
  );
};
