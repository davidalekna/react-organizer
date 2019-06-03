import React from 'react';
import { FlexRow } from '../globals';
import { Day, Toolbar, Wrapper, Grid, GridItem } from './styles';

const Base = ({
  month,
  days,
  months,
  selectMonth,
  date,
  selectYear,
  onPrevClick,
  onNextClick,
  onDayClick,
  renderToolbar,
}) => {
  return (
    <Wrapper>
      <Toolbar>{renderToolbar()}</Toolbar>
      <Grid>
        {days.map((day, index) => (
          <GridItem key={index} darker>
            {day.slice(0, 1)}
          </GridItem>
        ))}
        {month.days.map((day, index) => (
          <GridItem key={index} darker={day.offset}>
            <Day
              current={day.today}
              weekend={day.weekend}
              hoverable={!day.offset}
              selected={day.selected}
              onClick={() => !day.offset && onDayClick(day.date)}
            >
              {day.day}
            </Day>
          </GridItem>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default Base;
export * from './styles';
