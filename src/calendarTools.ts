import { useReducer } from 'react';
import { uk } from 'date-fns/locale';
import {
  days,
  months,
  getNumberOfWeeksInAMonth,
  getNumberOfDaysInAMonth,
  isDaySelected,
  initEventsForDate,
  getEventsForMonth,
  EventProps,
} from './utils';
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

// NOTE: convert days of the months to be stored in an object instead of arrays. That should
// give a boost on a performance when events assigned.

export type Day = {
  date: Date;
  formatted: string;
  name: string;
  day: number;
  events: Event[];
  status: {
    past: boolean;
    future: boolean;
    weekend: boolean;
    selected?: boolean;
    offset?: boolean;
    today?: boolean;
  };
};

export type CalendarToolsState = {
  daysNames: string[];
  monthsNames: string[];
  days: Day[];
  now: Date;
  selected: Date | null | any; // TODO: remove type `any`
  gridOf: number;
};

export type Action = { type: string; payload?: any };
export type ReducerProps<S, A> = (prevState: S, action: A) => S;
export const calendarToolsReducer: ReducerProps<CalendarToolsState, Action> = (
  state,
  action,
) => {
  switch (action.type) {
    case actionTypes.changeLanguage: {
      const { days, months } = action.payload;
      // NOTE: maybe days and months could be retrieved from date-fns locale?
      return {
        ...state,
        daysNames: days,
        monthsNames: months,
      };
    }
    case actionTypes.getPrevMonthOffset: {
      const { daysNames, monthsNames } = state;
      const { month, year, format, locale } = action.payload;

      const assignDays: Day[] = [];
      let prevMonthNumber = month - 2;
      let currentYear = year;
      if (prevMonthNumber < 0) {
        // check if previews year
        prevMonthNumber = 11;
        currentYear = currentYear - 1;
      }
      const { end, start } = getNumberOfWeeksInAMonth(
        prevMonthNumber,
        currentYear,
      ).pop();
      let totalDays = getNumberOfDaysInAMonth(prevMonthNumber, currentYear) + 1;

      for (let i = 0; i < end - start; i += 1) {
        const currentDay = (totalDays -= 1);
        const date = new Date(currentYear, prevMonthNumber, currentDay);
        const todaysDate = new Date();
        assignDays.push({
          date: toDate(date),
          formatted: format(date, format, { locale }),
          name: daysNames[date.getDay()],
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
        ...state,
        name: monthsNames[prevMonthNumber],
        month: prevMonthNumber + 1,
        year: currentYear,
        totalOffsetDays: assignDays.length,
        days: assignDays.reverse(),
      };
    }
    case actionTypes.getCurrentMonth: {
      const { daysNames, monthsNames } = state;
      const { selected, month, year, format, locale } = action.payload;

      const generatedDays: Day[] = [];
      const currentMonth = month - 1; // back to 0 index
      const totalDays = getNumberOfDaysInAMonth(currentMonth, year);
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
          formatted: format(date, format, {
            locale: locale,
          }),
          name: daysNames[date.getDay()],
          day: currentDay,
          events: [],
          status: {
            past: thisIsToday ? false : isBefore(date, todaysDate),
            future: thisIsToday ? false : isAfter(date, todaysDate),
            weekend: isWeekend(date),
            selected: isDaySelected(selected, date),
            today: thisIsToday,
          },
        });
      }

      return {
        ...state,
        name: monthsNames[currentMonth],
        month,
        year,
        totalDays,
        totalWeeks: getNumberOfWeeksInAMonth(currentMonth, year).length,
        days: generatedDays,
      };
    }
    case actionTypes.getNextMonthOffset: {
      const { daysNames, monthsNames } = state;
      const {
        gridOf,
        totalOffsetDays,
        totalDays,
        month,
        year,
        format,
        locale,
      } = action.payload;

      const assignDays: Day[] = [];
      let currentMonth = month;
      let currentYear = year;
      if (currentMonth > 11) {
        // check if next year
        currentMonth = 0;
        currentYear = currentYear + 1;
      }
      const nextMonthOffset = gridOf - totalOffsetDays - totalDays;

      for (let i = 0; i < nextMonthOffset; i += 1) {
        const currentDay = i + 1;
        const date = new Date(currentYear, currentMonth, currentDay);
        const todaysDate = new Date();
        assignDays.push({
          date: toDate(date),
          formatted: format(date, format, {
            locale: locale,
          }),
          name: daysNames[date.getDay()],
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
        ...state,
        name: monthsNames[currentMonth],
        month: currentMonth + 1,
        year: currentYear,
        totalOffsetDays: assignDays.length,
        days: assignDays,
      };
    }
    case actionTypes.getFullMonth: {
      return state;
      // const { now } = state;
      // const { m, initialEvents, events } = action.payload;
      // // month index starts from 1
      // const month = m ? m : getMonth(now) + 1;
      // const year = getYear(now);

      // // TODO: figure out how to solve following 🙇🏼‍♂️🐑
      // // I believe that getPrevMonthOffset, getCurrentMonth and getNextMonthOffset
      // // should be outside functions because they should be re-usable

      // const firstOffset = this.getPrevMonthOffset({ month, year, events });
      // const current = this.getCurrentMonth({ month, year, events });
      // const eventsForMonth = getEventsForMonth(initialEvents, month);
      // const nextOffset = this.getNextMonthOffset({
      //   month,
      //   year,
      //   events,
      //   totalOffsetDays: firstOffset.totalOffsetDays,
      //   totalDays: current.totalDays,
      // });

      // let result = [...firstOffset.days, ...current.days, ...nextOffset.days];
      // if (eventsForMonth.length && events) {
      //   // NOTE: cannot load async because it is used for render... bad architecture...
      //   // convert into for of
      //   result = result.map((day) => {
      //     return Object.assign(day, {
      //       events: initEventsForDate(eventsForMonth, day.date),
      //     });
      //   });
      // }
      // // TODO END: move off to the SW

      // return {
      //   ...state,
      //   ...current,
      //   days: result,
      // };
    }
    case actionTypes.addCalendarMonth: {
      return {
        ...state,
        now: addMonths(state.now, 1),
      };
    }
    case actionTypes.subCalendarMonth: {
      const { month } = action.payload;
      return {
        ...state,
        now: setMonth(state.now, month),
      };
    }
    case actionTypes.addCalendarYear: {
      return {
        ...state,
        now: addYears(state.now, 1),
      };
    }
    case actionTypes.subCalendarYear: {
      return {
        ...state,
        now: subYears(state.now, 1),
      };
    }
    case actionTypes.selectDate: {
      const { date } = action.payload;
      return {
        ...state,
        date,
        selected: date,
      };
    }
    case actionTypes.selectRange: {
      const { date, range } = action.payload;

      let selectionState = {};
      const selected = state.selected;
      // ability to initially select dates
      if (range && Array.isArray(range) && range.length === 2) {
        return {
          ...state,
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

      return {
        ...state,
        ...selectionState,
      };
    }
    case actionTypes.selectMonth: {
      return {
        ...state,
        now: setMonth(state.now, action.payload.month),
      };
    }
    case actionTypes.selectYear: {
      return {
        ...state,
        now: setYear(state.now, action.payload.year),
      };
    }
    default: {
      return state;
    }
  }
};

export const actionTypes = {
  getPrevMonthOffset: 'getPrevMonthOffset',
  getNextMonthOffset: 'getNextMonthOffset',
  getCurrentMonth: 'getCurrentMonth',
  getFullMonth: 'getFullMonth',
  addCalendarMonth: 'addCalendarMonth',
  subCalendarMonth: 'subCalendarMonth',
  addCalendarYear: 'addCalendarYear',
  subCalendarYear: 'subCalendarYear',
  selectDate: 'selectDate',
  selectRange: 'selectRange',
  reset: 'reset',
  selectMonth: 'selectMonth',
  selectYear: 'selectYear',
  changeLanguage: 'changeLanguage',
};

export type CalendarToolsProps = {
  now?: any;
  selected?: any;
  locale: Locale;
  format: string;
  daysNames: string[];
  monthsNames: string[];
  events: EventProps[];
  initialGridOf: number;
  initialDate: Date;
  initialSelected: Date | null;
};

export const useCalendarTools = (
  {
    locale = uk,
    format = 'dd/MM/yyyy',
    daysNames = days,
    monthsNames = months,
    events = [],
    initialGridOf = 42,
    initialDate = toDate(new Date()),
    initialSelected = null,
  }: Partial<CalendarToolsProps> = {},
  reducer = calendarToolsReducer,
) => {
  const [state, send] = useReducer(reducer, {
    daysNames,
    monthsNames,
    days: [],
    gridOf: initialGridOf,
    now: initialDate,
    selected: initialSelected,
  });

  const changeLanguage = ({ days, months }: any) => {
    send({ type: actionTypes.changeLanguage, payload: { days, months } });
  };

  const getPrevMonthOffset = ({ month, year, events }: any) => {
    send({
      type: actionTypes.getPrevMonthOffset,
      payload: { month, year, events, format, locale },
    });
  };

  const getCurrentMonth = ({ month, year, events }: any) => {
    send({
      type: actionTypes.getCurrentMonth,
      payload: { month, year, events, format, locale },
    });
  };

  const getNextMonthOffset = ({
    month,
    year,
    totalOffsetDays,
    totalDays,
    events,
  }: any) => {
    send({
      type: actionTypes.getNextMonthOffset,
      payload: {
        month,
        year,
        totalOffsetDays,
        totalDays,
        events,
        format,
        locale,
      },
    });
  };

  const getFullMonth = (m?: number, monthEvents?: Event[]) => {
    send({
      type: actionTypes.getFullMonth,
      payload: { m, initialEvents: events, events: monthEvents },
    });
  };

  const getFullYear = (events: Event[]) => {
    // ERROR: this function wont work!! Look above...
    const months: any = [];
    for (let i = 0; i < 13; i += 1) {
      months.push(getFullMonth(i, events));
    }
    months.shift();
    return months;
  };

  const addCalendarMonth = () => {
    send({ type: actionTypes.addCalendarMonth });
  };

  const subCalendarMonth = ({ month }: any) => {
    send({ type: actionTypes.subCalendarMonth, payload: { month } });
  };

  const addCalendarYear = () => {
    send({ type: actionTypes.addCalendarYear });
  };

  const subCalendarYear = () => {
    send({ type: actionTypes.subCalendarYear });
  };

  const selectDate = ({ date }: any) => {
    send({ type: actionTypes.selectDate, payload: { date } });
  };

  const selectRange = ({ date, range }: any) => {
    send({ type: actionTypes.selectRange, payload: { date, range } });
  };

  const reset = () => {
    // TODO
  };

  const selectMonth = ({ month }: any) => {
    send({ type: actionTypes.selectMonth, payload: { month } });
  };

  const selectYear = ({ year }: any) => {
    send({ type: actionTypes.selectYear, payload: { year } });
  };

  return Object.assign(state, {
    changeLanguage,
    getPrevMonthOffset,
    getNextMonthOffset,
    getCurrentMonth,
    getFullMonth,
    getFullYear,
    addCalendarMonth,
    subCalendarMonth,
    addCalendarYear,
    subCalendarYear,
    selectDate,
    selectRange,
    reset,
    selectMonth,
    selectYear,
  });
};
