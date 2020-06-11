import {
  format,
  isSameMonth,
  isWeekend,
  isBefore,
  isAfter,
  toDate,
  isWithinInterval,
} from 'date-fns';
import {
  getNumberOfWeeksInAMonth,
  getNumberOfDaysInAMonth,
  isDaySelected,
} from './utils';

function generateDays({
  events,
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
  const days = new Map();

  const today = new Date().getDate() - 1;
  const now =
    isSameMonth(
      new Date(year, today === 0 ? month : currentMonth, today),
      new Date(),
    ) && today;

  for (let i = 0; i < loopOnNumber; i += 1) {
    const dayNumber: number = currendDayCb(i);
    const date: Date = new Date(year, month, dayNumber);
    const thisIsToday: boolean = now === i;
    const todaysDate = new Date();
    const currentDate = toDate(date);

    const dayKey = format(date, 'dd-MM-yyyy');

    // EVENTS FOR TODAY

    const evts = events.filter((event) => {
      if (event.end && event.start) {
        return isWithinInterval(currentDate, {
          start: event.start,
          end: event.end,
        });
      }

      return format(event.start, 'dd-MM-yyyy') === dayKey;
    });

    // EVENTS FOR TODAY

    days.set(dayKey, {
      date: currentDate,
      // formatted: format(date, dateFormat, { locale }),
      name: daysNames[date.getDay()],
      day: dayNumber,
      events: evts,
      // status
      past: thisIsToday ? false : isBefore(date, todaysDate),
      future: thisIsToday ? false : isAfter(date, todaysDate),
      weekend: isWeekend(date),
      selected: isDaySelected(selected, date),
      today: thisIsToday,
      offset,
    });
  }

  return days;
}

export const monthHelpers = ({ daysNames, monthsNames, events }) => {
  return {
    getPrevMonthOffset({ month, year, format, locale }) {
      // DO THE PROCESSING
      let prevMonthNumber = month - 1;
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
        events,
        year: currentYear,
        month: prevMonthNumber,
        format,
        locale,
        daysNames,
        loopOnNumber: end - start,
        currendDayCb: () => (totalDays -= 1),
        offset: true,
      });

      // TODO: reverse days

      return {
        name: monthsNames[prevMonthNumber],
        month: prevMonthNumber + 1,
        year: currentYear,
        totalOffsetDays: generatedDays.size,
        // days: generatedDays.reverse(),
        days: generatedDays,
      };
    },
    getCurrentMonth({ selected, month, year, format, locale }) {
      const currentMonth = month; // back to 0 index
      const totalDays = getNumberOfDaysInAMonth(currentMonth, year);

      const generatedDays = generateDays({
        events,
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
      let followingMonth = month + 1;
      let currentYear = year;
      if (followingMonth > 11) {
        // check if next year
        followingMonth = 0;
        currentYear = currentYear + 1;
      }
      const nextMonthOffset = gridOf - totalOffsetDays - totalDays;

      const generatedDays = generateDays({
        events,
        year: currentYear,
        month: followingMonth,
        format,
        locale,
        daysNames,
        loopOnNumber: nextMonthOffset,
        currendDayCb: (index: number) => index + 1,
        offset: true,
      });

      return {
        name: monthsNames[followingMonth],
        month: followingMonth + 1,
        year: currentYear,
        totalOffsetDays: Object.keys(generatedDays).length,
        days: generatedDays,
      };
    },
  };
};
