import '@babel/polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
  format,
  getYear,
  getMonth,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  eachDayOfInterval,
  addYears,
  subYears,
  isWeekend,
  setMonth,
  setYear,
} from 'date-fns';
import { days, months, callAll } from './utils';
import { EventExample } from './utils';

const DatesBrowserContext = React.createContext({
  days: [],
  months: [],
  date: new Date(),
  // functions
  getPrevMonthOffset: () => {},
  getNextMonthOffset: () => {},
  getCurrentMonth: () => {},
  getFullMonth: () => {},
  addCalendarMonth: () => {},
  subCalendarMonth: () => {},
  selectDate: () => {},
});

export class DatesBrowser extends React.Component {
  static propTypes = {
    children: PropTypes.func,
    initialDays: PropTypes.array,
    initialMonths: PropTypes.array,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        starts: PropTypes.instanceOf(Date).isRequired,
      }),
    ),
  };
  static defaultProps = {
    stateReducer: (state, changes) => changes,
    onStateChange: () => {},
    onReset: () => {},
    onSelectDate: () => {},
    onAddCalendarYear: () => {},
    onSubCalendarYear: () => {},
    onSubCalendarMonth: () => {},
    onAddCalendarMonth: () => {},
    onSelectMonth: () => {},
    onSelectYear: () => {},
    initialDays: days,
    initialMonths: months,
    events: [],
    initialGridBlocks: 42,
    initialDate: new Date(),
    initialSelected: null,
  };
  static stateChangeTypes = {
    addCalendarMonth: '__add_calendar_month__',
    subCalendarMonth: '__subtract_calendar_month__',
    selectDate: '__select_date__',
    reset: '__reset__',
    addCalendarYear: '__add_calendar_year__',
    subCalendarYear: '__sub_calendar_year__',
    selectMonth: '__select_month__',
    selectYear: '__select_year__',
  };
  static Consumer = DatesBrowserContext.Consumer;
  //
  changeDaysLanguage = () => [];
  changeMonthsLanguage = () => [];
  initializeEvents = forDate => {
    const getDate = d => format(d, 'dd/MM/yyyy');
    const currentDate = getDate(forDate);
    return this.props.events.filter(
      ({ starts }) => getDate(starts) === currentDate,
    );
  };
  eventInsert = () => {};
  eventUpdate = () => {};
  eventDelete = () => {};
  //
  getWeeksInAMonth = (month, year) => {
    const weeks = [];
    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);
    const numDays = lastDate.getDate();
    let start = 1;
    let end = 7 - firstDate.getDay();
    while (start <= numDays) {
      weeks.push({ start, end });
      start = end + 1;
      end = end + 7;
      if (end > numDays) end = numDays;
    }
    return weeks;
  };
  getMonthByNumber(number) {
    return this.getState().months[number];
  }
  getNumberOfDaysInAMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }
  getToday = () => new Date().getDate() - 1;
  getCurrentMonthNumber = () => new Date().getMonth();
  getCurrentYear = () => new Date().getFullYear();
  // Construct callendar
  getPrevMonthOffset = ({ month, year, events }) => {
    let prevMonthNumber = month - 2;
    let currentYear = year;
    if (prevMonthNumber < 0) {
      // check if previews year
      prevMonthNumber = 11;
      currentYear = currentYear - 1;
    }
    const { end, start } = this.getWeeksInAMonth(
      prevMonthNumber,
      currentYear,
    ).pop();
    let totalDays =
      this.getNumberOfDaysInAMonth(prevMonthNumber, currentYear) + 1;
    const assignDays = Array(end - start)
      .fill({})
      .map(() => {
        const currentDay = (totalDays -= 1);
        const date = new Date(currentYear, prevMonthNumber, currentDay);
        return {
          name: this.getState().days[date.getDay()],
          day: currentDay,
          date: date,
          offset: true,
          weekend: isWeekend(date),
          events: events && this.initializeEvents(date),
        };
      })
      .reverse();
    return {
      name: this.getMonthByNumber(prevMonthNumber),
      month: prevMonthNumber + 1,
      year: currentYear,
      totalOffsetDays: assignDays.length,
      days: assignDays,
    };
  };
  getCurrentMonth = ({ month, year, events }) => {
    const currentMonth = month - 1;
    const totalDays = this.getNumberOfDaysInAMonth(currentMonth, year);
    const today = new Date().getDate() - 1;
    const selected = this.getState().date.getDate() - 1;
    const isToday =
      isSameMonth(new Date(year, currentMonth, today), new Date()) && today;
    const isSelected = calendarDay =>
      isSameDay(this.getState().selected, calendarDay);
    return {
      name: this.getMonthByNumber(currentMonth),
      month,
      year,
      totalDays,
      totalWeeks: this.getWeeksInAMonth(currentMonth, year).length,
      days: Array(totalDays)
        .fill({})
        .map((u, day) => {
          const currentDay = day + 1;
          const date = new Date(year, currentMonth, currentDay);
          return {
            name: this.getState().days[date.getDay()],
            day: currentDay,
            date: date,
            today: isToday === day,
            weekend: isWeekend(date),
            selected: isSelected(date),
            events: events && this.initializeEvents(date),
          };
        }),
    };
  };
  getNextMonthOffset = ({
    month,
    year,
    totalOffsetDays,
    totalDays,
    events,
  }) => {
    let currentMonth = month;
    let currentYear = year;
    if (currentMonth > 11) {
      // check if next year
      currentMonth = 0;
      currentYear = currentYear + 1;
    }
    const nextMonthOffset =
      this.getState().gridBlocks - totalOffsetDays - totalDays;
    const assignDays = Array(nextMonthOffset)
      .fill({})
      .map((c, i) => {
        const currentDay = i + 1;
        const date = new Date(currentYear, currentMonth, currentDay);
        return {
          name: this.getState().days[date.getDay()],
          day: currentDay,
          date: date,
          offset: true,
          weekend: isWeekend(date),
          events: events && this.initializeEvents(date),
        };
      });
    return {
      name: this.getMonthByNumber(currentMonth),
      month: currentMonth + 1,
      year: currentYear,
      totalOffsetDays: assignDays.length,
      days: assignDays,
    };
  };
  getFullMonth = (initMonth, events) => {
    const month = initMonth ? initMonth : getMonth(this.getState().date) + 1;
    const year = getYear(this.getState().date);
    const firstOffset = this.getPrevMonthOffset({ month, year, events });
    const current = this.getCurrentMonth({ month, year, events });
    const nextOffset = this.getNextMonthOffset({
      month,
      year,
      events,
      totalOffsetDays: firstOffset.totalOffsetDays,
      totalDays: current.totalDays,
    });
    return {
      ...current,
      days: [...firstOffset.days, ...current.days, ...nextOffset.days],
    };
  };
  getFullYear = events => {
    const months = Array(13)
      .fill({})
      .map((u, month) => this.getFullMonth(month, events));
    months.shift();
    return months;
  };
  addCalendarMonth = ({
    type = DatesBrowser.stateChangeTypes.addCalendarMonth,
  }) => {
    this.internalSetState(
      state => ({
        type,
        date: addMonths(state.date, 1),
      }),
      () => this.props.onAddCalendarMonth(this.getState().date),
    );
  };
  selectMonth = ({
    type = DatesBrowser.stateChangeTypes.selectMonth,
    month,
  }) => {
    this.internalSetState(
      state => ({
        type,
        date: setMonth(state.date, month),
      }),
      () => this.props.onSelectMonth(this.getState().date),
    );
  };
  subCalendarMonth = ({
    type = DatesBrowser.stateChangeTypes.subCalendarMonth,
  }) => {
    this.internalSetState(
      state => ({
        type,
        date: subMonths(state.date, 1),
      }),
      () => this.props.onSubCalendarMonth(this.getState().date),
    );
  };
  addCalendarYear = ({
    type = DatesBrowser.stateChangeTypes.addCalendarYear,
  }) => {
    this.internalSetState(
      state => ({
        type,
        date: addYears(state.date, 1),
      }),
      () => this.props.onAddCalendarYear(this.getState().date),
    );
  };
  selectYear = ({ type = DatesBrowser.stateChangeTypes.selectYear, year }) => {
    this.internalSetState(
      state => ({
        type,
        date: setYear(state.date, year),
      }),
      () => this.props.onSelectYear(this.getState().date),
    );
  };
  subCalendarYear = ({
    type = DatesBrowser.stateChangeTypes.subCalendarYear,
  }) => {
    this.internalSetState(
      state => ({
        type,
        date: subYears(state.date, 1),
      }),
      () => this.props.onSubCalendarYear(this.getState().date),
    );
  };
  selectDate = ({ type = DatesBrowser.stateChangeTypes.selectDate, date }) => {
    this.internalSetState({ type, date, selected: date }, () => {
      return this.props.onSelectDate(this.getState().selected);
    });
  };
  reset = () => {
    this.internalSetState(
      { ...this.initialState, type: DatesBrowser.stateChangeTypes.reset },
      () => this.props.onReset(this.getState().date),
    );
  };
  //
  initialState = {
    days: this.props.initialDays,
    months: this.props.initialMonths,
    gridBlocks: this.props.initialGridBlocks,
    date: this.props.initialDate,
    selected: this.props.initialSelected,
    // functions
    getPrevMonthOffset: this.getPrevMonthOffset,
    getNextMonthOffset: this.getNextMonthOffset,
    getCurrentMonth: this.getCurrentMonth,
    getFullMonth: this.getFullMonth,
    getFullYear: this.getFullYear,
    addCalendarMonth: this.addCalendarMonth,
    subCalendarMonth: this.subCalendarMonth,
    addCalendarYear: this.addCalendarYear,
    subCalendarYear: this.subCalendarYear,
    selectDate: this.selectDate,
    reset: this.reset,
    selectMonth: this.selectMonth,
    selectYear: this.selectYear,
  };
  state = this.initialState;
  isControlledProp(key) {
    return this.props[key] !== undefined;
  }
  getState(stateToMerge = this.state) {
    return Object.keys(stateToMerge).reduce((state, key) => {
      state[key] = this.isControlledProp(key)
        ? this.props[key]
        : stateToMerge[key];
      return state;
    }, {});
  }
  internalSetState = (changes, callback = () => {}) => {
    let allChanges;
    this.setState(
      currentState => {
        const combinedState = this.getState(currentState);
        return [changes]
          .map(c => (typeof c === 'function' ? c(currentState) : c))
          .map(c => {
            allChanges = this.props.stateReducer(combinedState, c) || {};
            return allChanges;
          })
          .map(({ type: ignoredType, ...onlyChanges }) => onlyChanges)
          .map(c => {
            return Object.keys(combinedState).reduce((newChanges, stateKey) => {
              if (!this.isControlledProp(stateKey)) {
                newChanges[stateKey] = c.hasOwnProperty(stateKey)
                  ? c[stateKey]
                  : combinedState[stateKey];
              }
              return newChanges;
            }, {});
          })
          .map(c => (Object.keys(c || {}).length ? c : null))[0];
      },
      () => {
        this.props.onStateChange(allChanges, this.state);
        callback();
      },
    );
  };
  render() {
    const { children } = this.props;
    const ui = typeof children === 'function' ? children(this.state) : children;
    return (
      <DatesBrowserContext.Provider value={this.state}>
        {ui}
      </DatesBrowserContext.Provider>
    );
  }
}

export function withDatesBrowser(Component) {
  const Wrapper = React.forwardRef((props, ref) => {
    return (
      <DatesBrowser.Consumer>
        {browserUtils => (
          <Component {...props} datesBrowser={browserUtils} ref={ref} />
        )}
      </DatesBrowser.Consumer>
    );
  });
  Wrapper.displayName = `withDatesBrowser(${Component.displayName ||
    Component.name})`;
  hoistNonReactStatics(Wrapper, Component);
  return Wrapper;
}
