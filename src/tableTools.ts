import { useReducer } from 'react';
import { uk } from 'date-fns/locale';
import { toDate } from 'date-fns';
import { days, months } from './utils';

export type CalendarToolsState = {};

export type Action = { type: string; payload?: any };
export type ReducerProps<S, A> = (prevState: S, action: A) => S;
export const calendarToolsReducer: ReducerProps<CalendarToolsState, Action> = (
  state,
  action,
) => {
  switch (action.type) {
    case '':
      return state;
    default:
      return state;
  }
};

export const actionTypes = {
  getPrevMonthOffset: 'getPrevMonthOffset',
  getNextMonthOffset: 'getNextMonthOffset',
  getCurrentMonth: 'getCurrentMonth',
  getFullMonth: 'getFullMonth',
  getFullYear: 'getFullYear',
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
  events: Event[];
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
  }: CalendarToolsProps,
  reducer = calendarToolsReducer,
) => {
  const [state, send] = useReducer(reducer, {
    days: daysNames,
    months: monthsNames,
    gridOf: initialGridOf,
    now: initialDate,
    selected: initialSelected,
  });

  const _initEventsForDate = (events: Event[], date: Date) => {
    return events.filter(({ starts }) => {
      return isSameDay(starts, date);
    });
  };
  const _getEventsForMonth = (month: number) => {
    return this.props.events.filter(
      ({ starts }) => getMonth(starts) + 1 === month,
    );
  };
  const _getNumberOfWeeksInAMonth = (month: number, year: number): Week[] => {
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
  const _getNumberOfDaysInAMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const _isDaySelected = (calendarDay: Date) => {
    const selected = this.getState().selected;
    if (selected && selected instanceof Date) {
      return isSameDay(this.getState().selected, calendarDay);
    }
    if (Array.isArray(selected)) {
      return selected.map((s) => isSameDay(s, calendarDay)).includes(true);
    }
    return false;
  };

  const changeLanguage = ({ days, months }: any) => {
    if (days.length === 7 && months.length === 12) {
      this.internalSetState(
        () => ({ days, months }),
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

  const getPrevMonthOffset = () => {};
  const getNextMonthOffset = () => {};
  const getCurrentMonth = () => {};
  const getFullMonth = () => {};
  const getFullYear = () => {};
  const addCalendarMonth = () => {};
  const subCalendarMonth = () => {};
  const addCalendarYear = () => {};
  const subCalendarYear = () => {};
  const selectDate = () => {};
  const selectRange = () => {};
  const reset = () => {};
  const selectMonth = () => {};
  const selectYear = () => {};

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
