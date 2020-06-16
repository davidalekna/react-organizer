import React from 'react';
import { useCalendarTools } from '../../hooks/use-calendar-tools';
import { useState } from 'react';
import { useEffect } from 'react';
import {
  StyledYearGrid,
  StyledMonthGrid,
  LoadingEvents,
  GridItem,
  DayName,
  DayNumber,
  CalendarToolbar,
  ToolbarTitle,
  ToolbarNav,
  DayEvent,
  OverlappingEvent,
} from './styles';

function MonthView({ items, daysNames, events }) {
  return (
    <StyledMonthGrid>
      {!events.length ? <LoadingEvents>Loading events...</LoadingEvents> : null}
      {items.map((day, index) => {
        return (
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
        );
      })}
    </StyledMonthGrid>
  );
}

function YearView({ items, daysNames }) {
  return (
    <StyledYearGrid>
      {items.map((month, index) => (
        <div>
          {month.name}
          <MonthView
            key={index}
            items={month.items}
            daysNames={daysNames}
            events={[{}]}
          />
        </div>
      ))}
    </StyledYearGrid>
  );
}

const eventsFromApi = [
  {
    calendar: 'Personal',
    color: 'blue',
    start: new Date(2020, 5, 5, 3, 24, 0),
    title: 'Event name',
  },
  {
    calendar: 'Personal',
    color: 'blue',
    start: new Date(2020, 5, 8, 3, 24, 0),
    title: 'Event name',
  },
  {
    calendar: 'Personal',
    color: 'blue',
    start: new Date(2020, 5, 10, 3, 24, 0),
    title: 'Event name',
  },
  {
    calendar: 'Personal',
    color: 'blue',
    start: new Date(2020, 5, 10, 3, 24, 0),
    title: 'Event name',
  },
  {
    calendar: 'Personal',
    color: 'blue',
    start: new Date(2020, 5, 10, 3, 24, 0),
    title: 'Event name',
  },
  {
    calendar: 'Personal',
    color: 'blue',
    start: new Date(2020, 5, 17, 3, 24, 0),
    title: 'Event name',
  },
  {
    calendar: 'Personal',
    color: 'blue',
    start: new Date(2020, 5, 27),
    end: new Date(2020, 5, 30),
    title: '@kobra',
  },
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
  } = useCalendarTools({ events, view: 'month' });

  useEffect(() => {
    fetch('https://www.gov.uk/bank-holidays.json')
      .then((response) => response.json())
      .then((data) =>
        setEvents(
          data['england-and-wales'].events
            .map((event) => ({
              color: 'green',
              calendar: 'Holidays in the United Kingdom',
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
