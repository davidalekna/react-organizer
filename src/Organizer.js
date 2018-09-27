import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { days, months } from './utils';
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
  isBefore,
  getDate,
} from 'date-fns';

const OrganizerContext = React.createContext({
  days: [],
  months: [],
  date: new Date(),
  selected: null,
  // functions
  getPrevMonthOffset: () => {},
  getNextMonthOffset: () => {},
  getCurrentMonth: () => {},
  getFullMonth: () => {},
  getFullYear: () => {},
  addCalendarMonth: () => {},
  subCalendarMonth: () => {},
  addCalendarYear: () => {},
  subCalendarYear: () => {},
  selectDate: () => {},
  reset: () => {},
  selectMonth: () => {},
  selectYear: () => {},
  changeLanguage: () => {},
});

export class Organizer extends React.Component {
  static propTypes = {
    children: PropTypes.func,
    initialDays: PropTypes.array,
    initialMonths: PropTypes.array,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        starts: PropTypes.instanceOf(Date).isRequired,
      }),
    ),
    initialGridBlocks: PropTypes.number,
    initialDate: PropTypes.instanceOf(Date),
    initialSelected: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    ]),
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
    onChangeLanguage: () => {},
    initialDays: days,
    initialMonths: months,
    events: [],
    initialGridBlocks: 42,
    initialDate: new Date(),
    initialSelected: null,
  };
  static stateChangeTypes = {
    reset: '__reset__',
    selectDate: '__select_date__',
    addCalendarMonth: '__add_calendar_month__',
    subCalendarMonth: '__subtract_calendar_month__',
    addCalendarYear: '__add_calendar_year__',
    subCalendarYear: '__sub_calendar_year__',
    selectMonth: '__select_month__',
    selectYear: '__select_year__',
    changeLanguage: '__change_language__',
  };
  static Consumer = OrganizerContext.Consumer;
  //
  _eventsForMonth = month => {
    return this.props.events.filter(
      ({ starts }) => getMonth(starts) + 1 === month,
    );
  };
  _initializeEvents = (events, date) => {
    return events.filter(({ starts }) => {
      return isSameDay(starts, date);
    });
  };
  _getWeeksInAMonth = (month, year) => {
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
  _getNumberOfDaysInAMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }
  changeLanguage = ({
    type = Organizer.stateChangeTypes.changeLanguage,
    days,
    months,
  }) => {
    if (days.length === 7 && months.length === 12) {
      this.internalSetState({ type, days, months }, () =>
        this.props.onChangeLanguage({
          days: this.getState().days,
          months: this.getState().months,
        }),
      );
    } else {
      throw new Error(
        `changeLanguage: Not enough days ${days.length} or months ${
          months.length
        }`,
      );
    }
  };
  getPrevMonthOffset = ({ month, year }) => {
    const assignDays = [];
    let prevMonthNumber = month - 2;
    let currentYear = year;
    if (prevMonthNumber < 0) {
      // check if previews year
      prevMonthNumber = 11;
      currentYear = currentYear - 1;
    }
    const { end, start } = this._getWeeksInAMonth(
      prevMonthNumber,
      currentYear,
    ).pop();
    let totalDays =
      this._getNumberOfDaysInAMonth(prevMonthNumber, currentYear) + 1;

    for (let i = 0; i < end - start; i += 1) {
      const currentDay = (totalDays -= 1);
      const date = new Date(currentYear, prevMonthNumber, currentDay);
      assignDays.push({
        name: this.getState().days[date.getDay()],
        day: currentDay,
        date: date,
        offset: true,
        past: true,
        events: [],
        weekend: isWeekend(date),
      });
    }

    return {
      name: this.getState().months[prevMonthNumber],
      month: prevMonthNumber + 1,
      year: currentYear,
      totalOffsetDays: assignDays.length,
      days: assignDays.reverse(),
    };
  };
  getSelectedDays = () => {
    const selected = this.getState().selected;
    if (Array.isArray(selected)) {
    }
  };
  getCurrentMonth = ({ month, year }) => {
    const generatedDays = [];
    const currentMonth = month - 1;
    const totalDays = this._getNumberOfDaysInAMonth(currentMonth, year);
    const today = new Date().getDate() - 1;
    const isToday =
      isSameMonth(new Date(year, currentMonth, today), new Date()) && today;
    const isSelected = calendarDay =>
      isSameDay(this.getState().selected, calendarDay);

    for (let i = 0; i < totalDays; i += 1) {
      const currentDay = i + 1;
      const date = new Date(year, currentMonth, currentDay);
      const today = isToday === i;
      generatedDays.push({
        name: this.getState().days[date.getDay()],
        day: currentDay,
        date: date,
        today,
        past: today ? false : isBefore(date, new Date()),
        events: [],
        weekend: isWeekend(date),
        selected: isSelected(date),
      });
    }

    return {
      name: this.getState().months[currentMonth],
      month,
      year,
      totalDays,
      totalWeeks: this._getWeeksInAMonth(currentMonth, year).length,
      days: generatedDays,
    };
  };
  getNextMonthOffset = ({ month, year, totalOffsetDays, totalDays }) => {
    const assignDays = [];
    let currentMonth = month;
    let currentYear = year;
    if (currentMonth > 11) {
      // check if next year
      currentMonth = 0;
      currentYear = currentYear + 1;
    }
    const nextMonthOffset =
      this.getState().gridBlocks - totalOffsetDays - totalDays;

    for (let i = 0; i < nextMonthOffset; i += 1) {
      const currentDay = i + 1;
      const date = new Date(currentYear, currentMonth, currentDay);
      assignDays.push({
        name: this.getState().days[date.getDay()],
        day: currentDay,
        date: date,
        offset: true,
        past: false,
        events: [],
        weekend: isWeekend(date),
      });
    }

    return {
      name: this.getState().months[currentMonth],
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
    const eventsForMonth = this._eventsForMonth(month);
    const nextOffset = this.getNextMonthOffset({
      month,
      year,
      events,
      totalOffsetDays: firstOffset.totalOffsetDays,
      totalDays: current.totalDays,
    });

    let result = [...firstOffset.days, ...current.days, ...nextOffset.days];
    if (eventsForMonth.length && events) {
      // convert into for of
      result = result.map(day => {
        return Object.assign(day, {
          events: this._initializeEvents(eventsForMonth, day.date),
        });
      });
    }

    return {
      ...current,
      days: result,
    };
  };
  getFullYear = events => {
    const months = [];
    for (let i = 0; i < 13; i += 1) {
      months.push(this.getFullMonth(i, events));
    }
    months.shift();
    return months;
  };
  addCalendarMonth = ({
    type = Organizer.stateChangeTypes.addCalendarMonth,
  } = {}) => {
    this.internalSetState(
      state => ({
        type,
        date: addMonths(state.date, 1),
      }),
      () => this.props.onAddCalendarMonth(this.getState().date),
    );
  };
  selectMonth = ({ type = Organizer.stateChangeTypes.selectMonth, month }) => {
    this.internalSetState(
      state => ({
        type,
        date: setMonth(state.date, month),
      }),
      () => this.props.onSelectMonth(this.getState().date),
    );
  };
  subCalendarMonth = ({
    type = Organizer.stateChangeTypes.subCalendarMonth,
  } = {}) => {
    this.internalSetState(
      state => ({
        type,
        date: subMonths(state.date, 1),
      }),
      () => this.props.onSubCalendarMonth(this.getState().date),
    );
  };
  addCalendarYear = ({
    type = Organizer.stateChangeTypes.addCalendarYear,
  } = {}) => {
    this.internalSetState(
      state => ({
        type,
        date: addYears(state.date, 1),
      }),
      () => this.props.onAddCalendarYear(this.getState().date),
    );
  };
  selectYear = ({ type = Organizer.stateChangeTypes.selectYear, year }) => {
    this.internalSetState(
      state => ({
        type,
        date: setYear(state.date, year),
      }),
      () => this.props.onSelectYear(this.getState().date),
    );
  };
  subCalendarYear = ({
    type = Organizer.stateChangeTypes.subCalendarYear,
  } = {}) => {
    this.internalSetState(
      state => ({
        type,
        date: subYears(state.date, 1),
      }),
      () => this.props.onSubCalendarYear(this.getState().date),
    );
  };
  selectDate = ({ type = Organizer.stateChangeTypes.selectDate, date }) => {
    // SELECTED WILL HOLD ARRAY or Date String from now.
    this.internalSetState({ type, date, selected: date }, () => {
      return this.props.onSelectDate(this.getState().selected);
    });
  };
  reset = () => {
    this.internalSetState(
      { ...this.initialState, type: Organizer.stateChangeTypes.reset },
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
    // fns
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
    changeLanguage: this.changeLanguage,
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
      <OrganizerContext.Provider value={this.state}>
        {ui}
      </OrganizerContext.Provider>
    );
  }
}

export function withOrganizer(Component) {
  const Wrapper = React.forwardRef((props, ref) => {
    return (
      <Organizer.Consumer>
        {browserUtils => (
          <Component {...props} organizer={browserUtils} ref={ref} />
        )}
      </Organizer.Consumer>
    );
  });
  Wrapper.displayName = `withOrganizer(${Component.displayName ||
    Component.name})`;
  hoistNonReactStatics(Wrapper, Component);
  return Wrapper;
}
