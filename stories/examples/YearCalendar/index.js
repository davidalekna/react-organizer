import React from 'react';
import Organizer from '../../../src';
import { Grid, Wrapper, Toolbar } from './styles';
import { Button } from '../base';
import CalendarBase from '../base/calendarBase';

export const YearCalendar = () => (
  <Organizer>
    {({
      date,
      getFullYear,
      selectDate,
      days,
      subCalendarYear,
      addCalendarYear,
      reset,
    }) => (
      <Wrapper>
        <Toolbar>
          <div>{date.getFullYear()}</div>
          <div>
            <Button onClick={subCalendarYear}>Sub</Button>
            <Button onClick={reset} style={{ margin: '0 10px' }}>
              Today
            </Button>
            <Button onClick={addCalendarYear}>Add</Button>
          </div>
        </Toolbar>
        <Grid>
          {getFullYear().map((month, key) => (
            <CalendarBase
              {...{
                key,
                month,
                days,
                showNav: false,
                weekends: true,
                onDayClick: date => selectDate({ date }),
              }}
            />
          ))}
        </Grid>
      </Wrapper>
    )}
  </Organizer>
);
