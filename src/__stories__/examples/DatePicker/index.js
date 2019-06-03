import React from 'react';
import Organizer from '../../..';
import CalendarBase from '../base';
import { FlexRow } from '../globals';
import { Wrapper, Toolbar } from './styles';

export const DatePicker = ({ onSelectDate, onReset }) => (
  <Organizer onSelectDate={onSelectDate} onReset={onReset}>
    {({
      addCalendarMonth,
      subCalendarMonth,
      addCalendarYear,
      subCalendarYear,
      days,
      months,
      date,
      getFullMonth,
      selectDate,
      selectMonth,
      selectYear,
      reset,
    }) => (
      <Wrapper>
        <CalendarBase
          {...{
            days,
            months,
            selectMonth,
            selectYear,
            date,
            month: getFullMonth(),
            onDayClick: date => selectDate({ date }),
            renderToolbar: () => (
              <Toolbar>
                <div>
                  <button onClick={subCalendarYear}>{`<<|`}</button>
                  &nbsp;
                  <button onClick={subCalendarMonth}>{`<`}</button>
                </div>
                <FlexRow onClick={reset}>{`${
                  months[date.getMonth()]
                } ${date.getFullYear()}`}</FlexRow>
                <div>
                  <button onClick={addCalendarMonth}>{`>`}</button>
                  &nbsp;
                  <button onClick={addCalendarYear}>{`|>>`}</button>
                </div>
              </Toolbar>
            ),
          }}
        />
      </Wrapper>
    )}
  </Organizer>
);
