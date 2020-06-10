import { isSameDay, getMonth } from 'date-fns';

export const callAll = (...fns: Function[]) => (...args: Function[]) =>
  fns.forEach((fn) => fn && fn(...args));

export const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export type Week = {
  start: number;
  end: number;
};

export const getNumberOfWeeksInAMonth = (
  month: number,
  year: number,
): Week[] => {
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

export const getNumberOfDaysInAMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const isDaySelected = (isSelected: Date, calendarDay: Date) => {
  const selected = isSelected;
  if (selected && selected instanceof Date) {
    return isSameDay(isSelected, calendarDay);
  }
  if (Array.isArray(selected)) {
    return selected.map((s) => isSameDay(s, calendarDay)).includes(true);
  }
  return false;
};

export type EventProps = {
  starts: Date;
  ends?: Date;
  [key: string]: any;
};

export const initEventsForDate = (events: EventProps[], date: Date) => {
  return events.filter(({ starts }) => {
    return isSameDay(starts, date);
  });
};

export const getEventsForMonth = (events: EventProps[], month: number) => {
  return events.filter(({ starts }) => getMonth(starts) + 1 === month);
};
