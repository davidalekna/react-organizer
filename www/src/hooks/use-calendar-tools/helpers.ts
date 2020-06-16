import {
  format,
  isSameMonth,
  isWeekend,
  isBefore,
  isAfter,
  toDate,
  isWithinInterval,
  getMonth,
  getYear,
} from 'date-fns';
import {
  getNumberOfWeeksInAMonth,
  getNumberOfDaysInAMonth,
  isDaySelected,
} from './utils';

export class DateTimeGenerator {
  _shouldIncludeEvents: boolean = true;

  daysNames: any;
  monthsNames: any;
  now: any;
  selected: any;
  gridOf: any;
  month: any;
  format: any;
  locale: any;
  events: any;

  constructor({
    daysNames,
    monthsNames,
    now,
    selected,
    gridOf,
    month,
    format,
    locale,
    events,
  }) {
    this.daysNames = daysNames;
    this.monthsNames = monthsNames;
    this.now = now;
    this.selected = selected;
    this.gridOf = gridOf;
    this.month = month;
    this.format = format;
    this.locale = locale;
    this.events = events;
  }

  _generateDays({
    currentMonth = false,
    numberOfDays,
    year,
    month,
    selected,
    currendDayCb = (day: number) => day + 1,
    offset = false,
  }: any = {}) {
    const days = new Map();
    let events = [];

    const today = new Date().getDate() - 1;
    const now =
      isSameMonth(
        new Date(year, today === 0 ? month : currentMonth, today),
        new Date(),
      ) && today;

    for (let index = 0; index < numberOfDays; index += 1) {
      const dayNumber: number = currendDayCb(index);
      const date: Date = new Date(year, month, dayNumber);
      const thisIsToday: boolean = now === index;
      const todaysDate = new Date();
      const currentDate = toDate(date);

      const dayKey = format(date, 'dd-MM-yyyy');

      // EVENTS FOR TODAY
      if (this._shouldIncludeEvents) {
        events = this.events.filter((event) => {
          if (event.end && event.start) {
            return isWithinInterval(currentDate, {
              start: event.start,
              end: event.end,
            });
          }

          return format(event.start, 'dd-MM-yyyy') === dayKey;
        });
      }

      days.set(dayKey, {
        date: currentDate,
        // formatted: format(date, dateFormat, { locale }),
        name: this.daysNames[date.getDay()],
        day: dayNumber,
        events,
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

  _getPrevMonthOffset({ month, year }) {
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

    const generatedDays = this._generateDays({
      events: this.events,
      year: currentYear,
      month: prevMonthNumber,
      daysNames: this.daysNames,
      numberOfDays: end - start,
      currendDayCb: () => (totalDays -= 1),
      offset: true,
    });

    // TODO: reverse days

    return {
      name: this.monthsNames[prevMonthNumber],
      month: prevMonthNumber + 1,
      year: currentYear,
      totalOffsetDays: generatedDays.size,
      items: generatedDays,
    };
  }

  _getCurrentMonth({ selected, month, year }) {
    const currentMonth = month; // back to 0 index
    const totalDays = getNumberOfDaysInAMonth(currentMonth, year);

    const generatedDays = this._generateDays({
      events: this.events,
      year,
      month,
      daysNames: this.daysNames,
      selected,
      numberOfDays: totalDays,
      currendDayCb: (index: number) => index + 1,
      offset: false,
    });

    return {
      name: this.monthsNames[currentMonth],
      month,
      year,
      totalDays,
      totalWeeks: getNumberOfWeeksInAMonth(currentMonth, year).length,
      items: generatedDays,
    };
  }

  _getNextMonthOffset({ gridOf, totalOffsetDays, totalDays, month, year }) {
    let followingMonth = month + 1;
    let currentYear = year;
    if (followingMonth > 11) {
      // check if next year
      followingMonth = 0;
      currentYear = currentYear + 1;
    }
    const nextMonthOffset = gridOf - totalOffsetDays - totalDays;

    const generatedDays = this._generateDays({
      events: this.events,
      year: currentYear,
      month: followingMonth,
      daysNames: this.daysNames,
      numberOfDays: nextMonthOffset,
      currendDayCb: (index: number) => index + 1,
      offset: true,
    });

    return {
      name: this.monthsNames[followingMonth],
      month: followingMonth + 1,
      year: currentYear,
      totalOffsetDays: Object.keys(generatedDays).length,
      items: generatedDays,
    };
  }

  getFullMonth({
    now,
    selected,
    gridOf,
    month: specificMonth,
    includeEvents = true,
  }) {
    this._shouldIncludeEvents = includeEvents;

    const month =
      typeof specificMonth === 'number' ? specificMonth : getMonth(now) + 1;
    const year = getYear(now);

    const firstOffset = this._getPrevMonthOffset({
      month,
      year,
    });
    const current = this._getCurrentMonth({
      month,
      year,
      selected,
    }); // (-selected)
    const nextOffset = this._getNextMonthOffset({
      month,
      year,
      totalOffsetDays: firstOffset.totalOffsetDays,
      totalDays: current.totalDays,
      gridOf,
    });

    const result = [
      ...Array.from(firstOffset.items.values()).reverse(),
      ...Array.from(current.items.values()),
      ...Array.from(nextOffset.items.values()),
    ];

    return {
      ...current,
      items: result,
    };
  }

  *getFullYear() {
    for (let month = 0; month < 13; month += 1) {
      yield this.getFullMonth({
        now: this.now,
        selected: this.selected,
        gridOf: this.gridOf,
        month,
        includeEvents: false,
      });
    }
  }
}
