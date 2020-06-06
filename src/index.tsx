import React, { createContext, Component, useContext, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { days, months } from './utils';
import { Props, State, Week, Event, Days, MonthFnProps } from './types';
import { uk } from 'date-fns/locale';
import {
  getYear,
  getMonth,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  addYears,
  subYears,
  isWeekend,
  setMonth,
  setYear,
  isBefore,
  isAfter,
  toDate,
  format,
} from 'date-fns';

export const OrganizerContext = createContext<State>({
  days: [],
  months: [],
  now: toDate(new Date()),
  selected: null,
  gridOf: 0,
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
  selectRange: () => {},
  reset: () => {},
  selectMonth: () => {},
  selectYear: () => {},
  changeLanguage: () => {},
});

export default class Organizer extends Component<Props, State> {
  static Consumer = OrganizerContext.Consumer;
  static propTypes = {
    children: PropTypes.func,
    locale: PropTypes.object,
    format: PropTypes.string,
    daysNames: PropTypes.array,
    monthsNames: PropTypes.array,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        starts: PropTypes.instanceOf(Date).isRequired,
      }),
    ),
    initialGridOf: PropTypes.number,
    initialDate: PropTypes.instanceOf(Date),
    selected: PropTypes.any,
    now: PropTypes.instanceOf(Date),
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
    onSelectRange: () => {},
    onAddCalendarYear: () => {},
    onSubCalendarYear: () => {},
    onSubCalendarMonth: () => {},
    onAddCalendarMonth: () => {},
    onSelectMonth: () => {},
    onSelectYear: () => {},
    onChangeLanguage: () => {},
    locale: uk,
    format: 'dd/MM/yyyy',
    daysNames: days,
    monthsNames: months,
    events: [],
    initialGridOf: 42,
    initialDate: toDate(new Date()),
    initialSelected: null,
  };
  static stateChangeTypes = {
    reset: '__reset__',
    selectDate: '__select_date__',
    selectRange: '__select_range__',
    addCalendarMonth: '__add_calendar_month__',
    subCalendarMonth: '__subtract_calendar_month__',
    addCalendarYear: '__add_calendar_year__',
    subCalendarYear: '__sub_calendar_year__',
    selectMonth: '__select_month__',
    selectYear: '__select_year__',
    changeLanguage: '__change_language__',
  };
  //
  private _initEventsForDate = (events: Event[], date: Date) => {
    return events.filter(({ starts }) => {
      return isSameDay(starts, date);
    });
  };
  private _getEventsForMonth = (month: number) => {
    return this.props.events.filter(
      ({ starts }) => getMonth(starts) + 1 === month,
    );
  };
  private _getNumberOfWeeksInAMonth = (month: number, year: number): Week[] => {
    const weeks: Week[] = [];
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
  private _getNumberOfDaysInAMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
  }
  private _isDaySelected = (calendarDay: Date) => {
    const selected = this.getState().selected;
    if (selected && selected instanceof Date) {
      return isSameDay(this.getState().selected, calendarDay);
    }
    if (Array.isArray(selected)) {
      return selected.map(s => isSameDay(s, calendarDay)).includes(true);
    }
    return false;
  };
  changeLanguage = ({
    type = Organizer.stateChangeTypes.changeLanguage,
    days,
    months,
  }: {
    type: string;
    days: string[];
    months: string[];
  }) => {
    if (days.length === 7 && months.length === 12) {
      this.internalSetState(
        () => ({ type, days, months }),
        () =>
          this.props.onChangeLanguage({
            days: this.getState().days,
            months: this.getState().months,
          }),
      );
    } else {
      throw new Error(
        `changeLanguage: Not enough days ${days.length} or months ${months.length}`,
      );
    }
  };
  getPrevMonthOffset = ({ month, year, events }: MonthFnProps) => {
    const assignDays: Days = [];
    let prevMonthNumber = month - 2;
    let currentYear = year;
    if (prevMonthNumber < 0) {
      // check if previews year
      prevMonthNumber = 11;
      currentYear = currentYear - 1;
    }
    const { end, start } = this._getNumberOfWeeksInAMonth(
      prevMonthNumber,
      currentYear,
    ).pop();
    let totalDays =
      this._getNumberOfDaysInAMonth(prevMonthNumber, currentYear) + 1;

    for (let i = 0; i < end - start; i += 1) {
      const currentDay = (totalDays -= 1);
      const date = new Date(currentYear, prevMonthNumber, currentDay);
      const todaysDate = new Date();
      assignDays.push({
        date: toDate(date),
        formatted: format(date, this.props.format, {
          locale: this.props.locale,
        }),
        name: this.getState().days[date.getDay()],
        day: currentDay,
        events: [],
        status: {
          past: isBefore(date, todaysDate),
          future: isAfter(date, todaysDate),
          offset: true,
          weekend: isWeekend(date),
        },
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
  getCurrentMonth = ({ month, year, events }: MonthFnProps) => {
    const generatedDays: Days = [];
    const currentMonth = month - 1; // back to 0 index
    const totalDays = this._getNumberOfDaysInAMonth(currentMonth, year);
    const today = new Date().getDate() - 1;
    // ERROR: the problem happens when it's the 1st day of the month, then
    // it thinks that it's one month forward from current month.
    const now =
      isSameMonth(
        new Date(year, today === 0 ? month : currentMonth, today),
        new Date(),
      ) && today;

    for (let i = 0; i < totalDays; i += 1) {
      const currentDay = i + 1;
      const date = new Date(year, currentMonth, currentDay);
      const thisIsToday = now === i;
      const todaysDate = new Date();
      generatedDays.push({
        date: toDate(date),
        formatted: format(date, this.props.format, {
          locale: this.props.locale,
        }),
        name: this.getState().days[date.getDay()],
        day: currentDay,
        events: [],
        status: {
          past: thisIsToday ? false : isBefore(date, todaysDate),
          future: thisIsToday ? false : isAfter(date, todaysDate),
          weekend: isWeekend(date),
          selected: this._isDaySelected(date),
          today: thisIsToday,
        },
      });
    }

    return {
      name: this.getState().months[currentMonth],
      month,
      year,
      totalDays,
      totalWeeks: this._getNumberOfWeeksInAMonth(currentMonth, year).length,
      days: generatedDays,
    };
  };
  getNextMonthOffset = ({
    month,
    year,
    totalOffsetDays,
    totalDays,
    events,
  }: {
    month: number;
    year: number;
    totalOffsetDays: number;
    totalDays: number;
    events: Event[];
  }) => {
    const assignDays: Days = [];
    let currentMonth = month;
    let currentYear = year;
    if (currentMonth > 11) {
      // check if next year
      currentMonth = 0;
      currentYear = currentYear + 1;
    }
    const nextMonthOffset =
      this.getState().gridOf - totalOffsetDays - totalDays;

    for (let i = 0; i < nextMonthOffset; i += 1) {
      const currentDay = i + 1;
      const date = new Date(currentYear, currentMonth, currentDay);
      const todaysDate = new Date();
      assignDays.push({
        date: toDate(date),
        formatted: format(date, this.props.format, {
          locale: this.props.locale,
        }),
        name: this.getState().days[date.getDay()],
        day: currentDay,
        events: [],
        status: {
          past: isBefore(date, todaysDate),
          future: isAfter(date, todaysDate),
          weekend: isWeekend(date),
          offset: true,
        },
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
  getFullMonth = (m?: number, events?: Event[]) => {
    // month index starts from 1
    const month = m ? m : getMonth(this.getState().now) + 1;
    const year = getYear(this.getState().now);
    // TODO START: move off to the SW
    const firstOffset = this.getPrevMonthOffset({ month, year, events });
    const current = this.getCurrentMonth({ month, year, events });
    const eventsForMonth = this._getEventsForMonth(month);
    const nextOffset = this.getNextMonthOffset({
      month,
      year,
      events,
      totalOffsetDays: firstOffset.totalOffsetDays,
      totalDays: current.totalDays,
    });

    let result = [...firstOffset.days, ...current.days, ...nextOffset.days];
    if (eventsForMonth.length && events) {
      // NOTE: cannot load async because it is used for render... bad architecture...
      // convert into for of
      result = result.map(day => {
        return Object.assign(day, {
          events: this._initEventsForDate(eventsForMonth, day.date),
        });
      });
    }
    // TODO END: move off to the SW

    return {
      ...current,
      days: result,
    };
  };
  getFullYear = (events: Event[]) => {
    const months: any = [];
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
        now: addMonths(state.now, 1),
      }),
      () => this.props.onAddCalendarMonth(this.getState().now),
    );
  };
  selectMonth = ({ type = Organizer.stateChangeTypes.selectMonth, month }) => {
    this.internalSetState(
      state => ({
        type,
        now: setMonth(state.now, month),
      }),
      () => this.props.onSelectMonth(this.getState().now),
    );
  };
  subCalendarMonth = ({
    type = Organizer.stateChangeTypes.subCalendarMonth,
  } = {}) => {
    this.internalSetState(
      state => ({
        type,
        now: subMonths(state.now, 1),
      }),
      () => this.props.onSubCalendarMonth(this.getState().now),
    );
  };
  addCalendarYear = ({
    type = Organizer.stateChangeTypes.addCalendarYear,
  } = {}) => {
    this.internalSetState(
      state => ({
        type,
        now: addYears(state.now, 1),
      }),
      () => this.props.onAddCalendarYear(this.getState().now),
    );
  };
  selectYear = ({ type = Organizer.stateChangeTypes.selectYear, year }) => {
    this.internalSetState(
      state => ({
        type,
        now: setYear(state.now, year),
      }),
      () => this.props.onSelectYear(this.getState().now),
    );
  };
  subCalendarYear = ({
    type = Organizer.stateChangeTypes.subCalendarYear,
  } = {}) => {
    this.internalSetState(
      state => ({
        type,
        now: subYears(state.now, 1),
      }),
      () => this.props.onSubCalendarYear(this.getState().now),
    );
  };
  selectDate = ({ type = Organizer.stateChangeTypes.selectDate, date }) => {
    this.internalSetState(
      () => ({ type, now: date, selected: date }),
      () => {
        return this.props.onSelectDate(this.getState().selected);
      },
    );
  };
  selectRange = ({
    type = Organizer.stateChangeTypes.selectRange,
    date,
    range,
  }) => {
    this.internalSetState(
      state => {
        let selectionState = {};
        const selected = state.selected;
        // ability to initially select dates
        if (range && Array.isArray(range) && range.length === 2) {
          return {
            selected: range,
          };
        }
        // ability to select dates one by one
        if (Array.isArray(selected) && selected.length < 2) {
          // if second date selected is before the first it will become first.
          if (isBefore(date, selected[0])) {
            Object.assign(selectionState, {
              selected: [date],
            });
          } else {
            Object.assign(selectionState, {
              selected: [...selected, date],
            });
          }
        } else {
          Object.assign(selectionState, {
            selected: [date],
          });
        }

        return Object.assign(selectionState, { type });
      },
      () => {
        return this.props.onSelectRange(this.getState().selected);
      },
    );
  };
  reset = () => {
    this.internalSetState(
      () => ({ ...this.initialState, type: Organizer.stateChangeTypes.reset }),
      () => this.props.onReset(this.getState().now),
    );
  };
  //
  initialState = {
    days: this.props.daysNames,
    months: this.props.monthsNames,
    gridOf: this.props.initialGridOf,
    now: this.props.initialDate,
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
    selectRange: this.selectRange,
    reset: this.reset,
    selectMonth: this.selectMonth,
    selectYear: this.selectYear,
    changeLanguage: this.changeLanguage,
  };
  state = this.initialState;
  isControlledProp(key: string) {
    return this.props[key] !== undefined;
  }
  getState(stateToMerge: State = this.state): any {
    return Object.keys(stateToMerge).reduce((state, key) => {
      state[key] = this.isControlledProp(key)
        ? this.props[key]
        : stateToMerge[key];
      return state;
    }, {});
  }
  internalSetState = (
    changes: (state: State) => void | object, // return of an object doesn't work 🤔
    callback = () => {},
  ): void => {
    let allChanges: unknown;
    this.setState(
      currentState => {
        const combinedState: Readonly<State> = this.getState(currentState);
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
  const Wrapper = forwardRef((props, ref) => {
    return (
      <Organizer.Consumer>
        {organizerUtils => (
          <Component {...props} organizer={organizerUtils} ref={ref} />
        )}
      </Organizer.Consumer>
    );
  });
  Wrapper.displayName = `withOrganizer(${Component.displayName ||
    Component.name})`;
  return Wrapper;
}

export function useOrganizer() {
  const organizerUtils = useContext(OrganizerContext);
  return organizerUtils;
}
