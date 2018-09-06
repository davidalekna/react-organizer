export const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
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

// 1. Should be able to show offsets if required, otherwise not.
// 2. Could also hold hours for the day ?
// 3. Events should optionally exist in case user selects a year so we dont have to
// overload with data.

const EventExample = [
  {
    id: 123,
    title: 'make that soup already!',
    location: 'location address',
    starts: new Date().getTime(),
    ends: new Date().getTime(),
    allDay: true,
    overlap: true,
    color: '#b342f4',
    createdBy: 'Username',
    calendar: 'Reminders',
  },
];

const expectedFinalOutput = {
  prev: {
    name: 'August',
    month: 8,
    days: [
      { name: 'Sunday', day: 26, events: [] },
      { name: 'Monday', day: 27, events: [] },
      { name: 'Tuesday', day: 28, events: [] },
      { name: 'Wednesday', day: 29, events: [] },
      { name: 'Thursday', day: 30, events: [] },
      { name: 'Friday', day: 31, events: [] },
    ],
  },
  current: {
    name: 'September',
    month: 9,
    year: 2018,
    week: 2, // current week
    weeks: {
      1: [
        { name: 'Saturday', day: 1, events: [] },
        { name: 'Sunday', day: 2, events: [] },
      ],
      2: [
        { name: 'Monday', day: 3, events: [] },
        { name: 'Tuesday', day: 4, events: [] },
        { name: 'Wednesday', day: 5, events: [] },
        { name: 'Thursday', day: 6, events: [], today: true },
        { name: 'Friday', day: 7, events: [] },
        { name: 'Saturday', day: 8, events: [] },
        { name: 'Sunday', day: 9, events: [] },
      ],
      3: [
        { name: 'Monday', day: 10, events: [] },
        { name: 'Tuesday', day: 11, events: [] },
        { name: 'Wednesday', day: 12, events: [] },
        { name: 'Thursday', day: 13, events: [] },
        { name: 'Friday', day: 14, events: [] },
        { name: 'Saturday', day: 15, events: [] },
        { name: 'Sunday', day: 16, events: [] },
      ],
      4: [
        { name: 'Monday', day: 17, events: [] },
        { name: 'Tuesday', day: 18, events: [] },
        { name: 'Wednesday', day: 19, events: [] },
        { name: 'Thursday', day: 20, events: [] },
        { name: 'Friday', day: 21, events: [] },
        { name: 'Saturday', day: 22, events: [] },
        { name: 'Sunday', day: 23, events: [] },
      ],
      5: [
        { name: 'Monday', day: 24, events: [] },
        { name: 'Tuesday', day: 25, events: [] },
        { name: 'Wednesday', day: 26, events: [] },
        { name: 'Thursday', day: 27, events: [] },
        { name: 'Friday', day: 28, events: [] },
        { name: 'Saturday', day: 29, events: [] },
        { name: 'Sunday', day: 30, events: [] },
      ],
    },
    totalDays: 31,
    totalWeeks: 5,
  },
  next: {
    name: 'October',
    month: 10,
    days: [
      { name: 'Monday', day: 1, events: [] },
      { name: 'Tuesday', day: 2, events: [] },
      { name: 'Wednesday', day: 3, events: [] },
      { name: 'Thursday', day: 4, events: [] },
      { name: 'Friday', day: 5, events: [] },
      { name: 'Saturday', day: 6, events: [] },
    ],
  },
};
