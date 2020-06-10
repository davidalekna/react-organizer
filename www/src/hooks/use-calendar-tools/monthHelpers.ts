import {
  format,
  isSameMonth,
  isWeekend,
  isBefore,
  isAfter,
  toDate,
} from 'date-fns';
import { Day } from './tableTools';
import {
  getNumberOfWeeksInAMonth,
  getNumberOfDaysInAMonth,
  isDaySelected,
} from './utils';

export type Days = {
  [key: number]: Day;
};

function generateDays({
  currentMonth = false,
  loopOnNumber,
  year,
  month,
  format: dateFormat,
  locale,
  daysNames,
  selected,
  currendDayCb = (index) => index + 1,
  offset = false,
}: any = {}) {
  let days: Days = [];

  const today = new Date().getDate() - 1;
  const now =
    isSameMonth(
      new Date(year, today === 0 ? month : currentMonth, today),
      new Date(),
    ) && today;

  for (let i = 0; i < loopOnNumber; i += 1) {
    const currentDay = currendDayCb(i);
    const date = new Date(year, month, currentDay);
    const thisIsToday = now === i;
    const todaysDate = new Date();

    days[i] = {
      date: toDate(date),
      // formatted: format(date, dateFormat, { locale }),
      name: daysNames[date.getDay()],
      day: currentDay,
      events: [],
      // status
      past: thisIsToday ? false : isBefore(date, todaysDate),
      future: thisIsToday ? false : isAfter(date, todaysDate),
      weekend: isWeekend(date),
      selected: isDaySelected(selected, date),
      today: thisIsToday,
      offset,
    };
  }

  return days;
}

export const monthHelpers = ({ daysNames, monthsNames }) => {
  return {
    getPrevMonthOffset({ month, year, format, locale }) {
      // DO THE PROCESSING
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

      const generatedDays = generateDays({
        year: currentYear,
        month: prevMonthNumber,
        format,
        locale,
        daysNames,
        loopOnNumber: end - start,
        currendDayCb: () => (totalDays -= 1),
        offset: true,
      });

      return {
        name: monthsNames[prevMonthNumber],
        month: prevMonthNumber + 1,
        year: currentYear,
        totalOffsetDays: Object.keys(generatedDays).length,
        // days: generatedDays.reverse(),
        days: generatedDays,
      };
    },
    getCurrentMonth({ selected, month, year, format, locale }) {
      const currentMonth = month - 1; // back to 0 index
      const totalDays = getNumberOfDaysInAMonth(currentMonth, year);

      const generatedDays = generateDays({
        year,
        month,
        format,
        locale,
        daysNames,
        selected,
        loopOnNumber: totalDays,
        currendDayCb: (index: number) => index + 1,
        offset: false,
      });

      return {
        name: monthsNames[currentMonth],
        month,
        year,
        totalDays,
        totalWeeks: getNumberOfWeeksInAMonth(currentMonth, year).length,
        days: generatedDays,
      };
    },
    getNextMonthOffset({
      gridOf,
      totalOffsetDays,
      totalDays,
      month,
      year,
      format,
      locale,
    }) {
      let currentMonth = month;
      let currentYear = year;
      if (currentMonth > 11) {
        // check if next year
        currentMonth = 0;
        currentYear = currentYear + 1;
      }
      const nextMonthOffset = gridOf - totalOffsetDays - totalDays;

      const generatedDays = generateDays({
        year: currentYear,
        month: currentMonth,
        format,
        locale,
        daysNames,
        loopOnNumber: nextMonthOffset,
        currendDayCb: (index: number) => index + 1,
        offset: true,
      });

      return {
        name: monthsNames[currentMonth],
        month: currentMonth + 1,
        year: currentYear,
        totalOffsetDays: Object.keys(generatedDays).length,
        days: generatedDays,
      };
    },
  };
};
