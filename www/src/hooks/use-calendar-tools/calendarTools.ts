import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { uk } from 'date-fns/locale';
import { days, months, EventProps } from './utils';
import { monthHelpers, getFullMonth } from './monthHelpers';
import {
  getYear,
  getMonth,
  addMonths,
  addYears,
  subYears,
  setMonth,
  setYear,
  isBefore,
  toDate,
  subMonths,
} from 'date-fns';

// NOTE: convert days of the months to be stored in an object instead of arrays. That should
// give a boost on a performance when events assigned.

export type Day = {
  date: Date;
  formatted?: string;
  name: string;
  day: number;
  events: EventProps[];
  // STATUS
  past: boolean;
  future: boolean;
  weekend: boolean;
  selected?: boolean;
  offset?: boolean;
  today?: boolean;
};

export type CalendarToolsState = {
  daysNames: string[];
  monthsNames: string[];
  days: Day[];
  now: Date;
  selected: Date | null | any; // TODO: remove type `any`
  gridOf: number;
  events: EventProps[];
};

export type Action = { type: string; payload?: any };
export type ReducerProps<S, A> = (prevState: S, action: A) => S;
export const calendarToolsReducer: ReducerProps<CalendarToolsState, Action> = (
  state,
  action,
) => {
  const helpers = monthHelpers({
    daysNames: state.daysNames,
    monthsNames: state.monthsNames,
  });

  switch (action.type) {
    case actionTypes.reset: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case actionTypes.changeLanguage: {
      const { days, months } = action.payload;
      // NOTE: maybe days and months could be retrieved from date-fns locale?
      return {
        ...state,
        daysNames: days,
        monthsNames: months,
      };
    }
    case actionTypes.getFullMonth: {
      const { now, selected, gridOf, monthsNames, daysNames } = state;
      const { month, format, locale, events } = action.payload;

      const nextState = getFullMonth({
        now,
        selected,
        gridOf,
        monthsNames,
        daysNames,
        month,
        format,
        locale,
        events,
      });

      return {
        ...state,
        ...nextState,
      };
    }
    case actionTypes.addCalendarMonth: {
      return {
        ...state,
        now: addMonths(state.now, 1),
      };
    }
    case actionTypes.subCalendarMonth: {
      return {
        ...state,
        now: subMonths(state.now, 1),
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
  const memoEvents = useMemo(() => events, [events]);

  const [state, send] = useReducer(reducer, {
    daysNames,
    monthsNames,
    days: [],
    gridOf: initialGridOf,
    now: initialDate,
    selected: initialSelected,
    events: memoEvents,
  });

  useEffect(() => {
    getFullMonth({ month: state.now.getMonth(), events: memoEvents });
  }, [state.now, memoEvents]);

  const changeLanguage = ({ days, months }: any) => {
    send({ type: actionTypes.changeLanguage, payload: { days, months } });
  };

  const getFullMonth = ({ month, events }) => {
    send({
      type: actionTypes.getFullMonth,
      payload: { month, events },
    });
  };

  const getFullYear = () => {
    // ERROR: this function wont work!! Look above...
    const months: any = [];
    for (let i = 0; i < 13; i += 1) {
      months.push(getFullMonth({ month: i, events }));
    }
    months.shift();
    return months;
  };

  const addCalendarMonth = () => {
    send({ type: actionTypes.addCalendarMonth });
  };

  const subCalendarMonth = () => {
    send({ type: actionTypes.subCalendarMonth });
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
    send({ type: actionTypes.reset, payload: { now: initialDate } });
  };

  const selectMonth = ({ month }: any) => {
    send({ type: actionTypes.selectMonth, payload: { month } });
  };

  const selectYear = ({ year }: any) => {
    send({ type: actionTypes.selectYear, payload: { year } });
  };

  const getCurrentMonthName = useCallback(() => {
    return monthsNames[state.now.getMonth()];
  }, [state.now]);

  const getCurrentYearName = useCallback(() => state.now.getFullYear(), [
    state.now,
  ]);

  return Object.assign(state, {
    changeLanguage,
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
    getCurrentMonthName,
    getCurrentYearName,
  });
};
