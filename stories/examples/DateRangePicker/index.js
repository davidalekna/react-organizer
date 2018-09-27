import React from 'react';
import Organizer from '../../../src';
import { addMonths, subMonths } from 'date-fns';
import { FlexRow } from '../globals';
import {
  Wrapper,
  SelectedDatesPreview,
  FakeInput,
  DoubleCalendar,
  CalendarWrapper,
  Toolbar,
  Grid,
  GridItem,
  Day,
  Button,
} from './styles';

export class DateRangePicker extends React.Component {
  initialState = {
    initialDate: new Date(),
    dateFrom: null,
    dateUntil: null,
  };
  state = this.initialState;
  reset = () => this.setState(this.initialState);
  // selectDate = date => {
  //   this.setState(state => {
  //     if (state.dateFrom && state.dateUntil) {
  //       return { dateFrom: null, dateUntil: null };
  //     }
  //     if (state.dateFrom) {
  //       // cannot be before start date
  //       return { dateUntil: date };
  //     } else {
  //       return { dateFrom: date };
  //     }
  //   });
  // };
  addMonth = () => {
    this.setState(state => ({
      initialDate: addMonths(state.initialDate, 1),
    }));
  };
  subMonth = () => {
    this.setState(state => ({
      initialDate: subMonths(state.initialDate, 1),
    }));
  };
  render() {
    return (
      <Wrapper>
        <SelectedDatesPreview>
          <FlexRow>
            <FakeInput>
              From:{' '}
              {(this.state.dateFrom &&
                this.state.dateFrom.toLocaleDateString()) ||
                'not select'}
            </FakeInput>
            <FakeInput>
              Until:{' '}
              {(this.state.dateUntil &&
                this.state.dateUntil.toLocaleDateString()) ||
                'not select'}
            </FakeInput>
          </FlexRow>
          <button onClick={this.reset}>RESET</button>
        </SelectedDatesPreview>
        <DoubleCalendar>
          <Organizer
            date={this.state.initialDate}
            // selected={this.state.dateFrom}
          >
            {({ days, months, date, getFullMonth, selectRange }) => (
              <CalendarWrapper>
                <Toolbar>
                  <Button left={0} onClick={this.subMonth}>
                    PREV
                  </Button>
                  {`${
                    months[this.state.initialDate.getMonth()]
                  } ${this.state.initialDate.getFullYear()}`}
                </Toolbar>
                <Grid>
                  {days.map((day, index) => (
                    <GridItem key={index} darker>
                      {day.slice(0, 1)}
                    </GridItem>
                  ))}
                  {getFullMonth().days.map((day, index) => (
                    <GridItem key={index} darker={day.offset}>
                      <Day
                        current={day.today}
                        hoverable={!day.offset}
                        selected={day.selected}
                        past={day.past}
                        onClick={() =>
                          !day.offset &&
                          !day.past &&
                          selectRange({ date: day.date })
                        }
                      >
                        {day.day}
                      </Day>
                    </GridItem>
                  ))}
                </Grid>
              </CalendarWrapper>
            )}
          </Organizer>
          <Organizer
            date={addMonths(this.state.initialDate, 1)}
            onRangeSelect={d => console.log(d)}
            // selected={this.state.dateUntil}
          >
            {({
              addCalendarMonth,
              subCalendarMonth,
              days,
              months,
              date,
              getFullMonth,
              selectRange,
            }) => (
              <CalendarWrapper>
                <Toolbar>
                  {`${
                    months[addMonths(this.state.initialDate, 1).getMonth()]
                  } ${addMonths(this.state.initialDate, 1).getFullYear()}`}
                  <Button right={0} onClick={this.addMonth}>
                    NEXT
                  </Button>
                </Toolbar>
                <Grid>
                  {days.map((day, index) => (
                    <GridItem key={index} darker>
                      {day.slice(0, 1)}
                    </GridItem>
                  ))}
                  {getFullMonth().days.map((day, index) => (
                    <GridItem key={index} darker={day.offset}>
                      <Day
                        current={day.today}
                        hoverable={!day.offset}
                        selected={day.selected}
                        past={day.past}
                        onClick={() =>
                          !day.offset &&
                          !day.past &&
                          selectRange({ date: day.date })
                        }
                      >
                        {day.day}
                      </Day>
                    </GridItem>
                  ))}
                </Grid>
              </CalendarWrapper>
            )}
          </Organizer>
        </DoubleCalendar>
      </Wrapper>
    );
  }
}
