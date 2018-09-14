import React from 'react';
import Organizer from '../../../src';
import { Wrapper, Toolbar } from './styles';
import { Grid, Day, Title, Number } from './styles';
import { Button } from '../base';

export const MonthCalendar = () => (
  <Organizer>
    {({
      date,
      days,
      months,
      getFullMonth,
      subCalendarMonth,
      addCalendarMonth,
      reset,
    }) => (
      <Wrapper>
        <Toolbar>
          <div>
            {months[date.getMonth()]} {date.getFullYear()}
          </div>
          <div>
            <Button onClick={subCalendarMonth}>Sub</Button>
            <Button onClick={reset} style={{ margin: '0 10px' }}>
              Today
            </Button>
            <Button onClick={addCalendarMonth}>Add</Button>
          </div>
        </Toolbar>
        <Grid>
          {getFullMonth(null, false).days.map((day, index) => (
            <Day
              key={index}
              isOffset={day.offset}
              isToday={day.today}
              isSelected={day.selected}
            >
              <Title>{days[index] && days[index].slice(0, 3)}</Title>
              <Number isToday={day.today}>
                {day.day} {day.today && `🌞`}
              </Number>
            </Day>
          ))}
        </Grid>
      </Wrapper>
    )}
  </Organizer>
);
