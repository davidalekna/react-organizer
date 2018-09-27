import 'react-testing-library/cleanup-after-each';
import React from 'react';
import { render } from 'react-testing-library';
import Organizer from '../';

const initialDate = { month: 9, year: 2018 };

test('should get previews month last weeks offset days', () => {
  const { getPrevMonthOffset } = setup();
  const result = getPrevMonthOffset(initialDate);
  const offsetDay = result.days[0];

  expect(result.name).toEqual('August');
  expect(result.month).toEqual(8);
  expect(result.year).toEqual(2018);
  expect(result.totalOffsetDays).toEqual(5);
  expect(result.days.length).toEqual(5);
});

test('should get current month days and events', () => {
  const { getCurrentMonth } = setup();
  const result = getCurrentMonth(initialDate);
  const offsetDay = result.days[0];

  expect(result.name).toEqual('September');
  expect(result.month).toEqual(9);
  expect(result.year).toEqual(2018);
  expect(result.totalDays).toEqual(30);
  expect(result.totalWeeks).toEqual(6);
  expect(result.days.length).toEqual(30);
});

test('should get next month first weeks offset days', () => {
  const { getNextMonthOffset } = setup();
  const result = getNextMonthOffset({
    ...initialDate,
    totalOffsetDays: 5,
    totalDays: 30,
  });
  const offsetDay = result.days[0];
  expect(result.name).toEqual('October');
  expect(result.month).toEqual(10);
  expect(result.year).toEqual(2018);
  expect(result.totalOffsetDays).toEqual(7);
  expect(result.days.length).toEqual(7);
});

test('should get full month with prev offset days and next offset days', () => {
  const { getFullMonth } = setup();
  const result = getFullMonth(9, true);
  const offsetDays = result.days.filter(day => day.offset);
  expect(result.name).toEqual('September');
  expect(result.month).toEqual(9);
  expect(result.year).toEqual(2018);
  expect(result.totalDays).toEqual(30);
  expect(result.totalWeeks).toEqual(6);
  expect(result.days.length).toEqual(6 + 30 + 6);
  expect(offsetDays.length).toEqual(6 + 6);
});

test('should get full calendar year', () => {
  const { getFullYear } = setup();
  const result = getFullYear();
  expect(result.length).toEqual(12);
});

test('should add calendar month', () => {
  const handleStateChange = jest.fn();
  const { addCalendarMonth } = setup({
    initialDate: new Date('2018', '09', '17'),
    onStateChange: handleStateChange,
  });
  addCalendarMonth();
  const changes = {
    type: Organizer.stateChangeTypes.addCalendarMonth,
    date: new Date('2018', '10', '17'),
  };

  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({ date: new Date('2018', '10', '17') }),
  );
});

test('should subtract calendar month', () => {
  const handleStateChange = jest.fn();
  const { subCalendarMonth } = setup({
    initialDate: new Date('2018', '09', '17'),
    onStateChange: handleStateChange,
  });
  subCalendarMonth();
  const changes = {
    type: Organizer.stateChangeTypes.subCalendarMonth,
    date: new Date('2018', '08', '17'),
  };

  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({ date: new Date('2018', '08', '17') }),
  );
});

test('should add calendar year', () => {
  const handleStateChange = jest.fn();
  const { addCalendarYear } = setup({
    initialDate: new Date('2018', '09', '17'),
    onStateChange: handleStateChange,
  });
  addCalendarYear();
  const changes = {
    type: Organizer.stateChangeTypes.addCalendarYear,
    date: new Date('2019', '09', '17'),
  };

  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({ date: new Date('2019', '09', '17') }),
  );
});

test('should subtract calendar year', () => {
  const handleStateChange = jest.fn();
  const { subCalendarYear } = setup({
    initialDate: new Date('2018', '09', '17'),
    onStateChange: handleStateChange,
  });
  subCalendarYear();
  const changes = {
    type: Organizer.stateChangeTypes.subCalendarYear,
    date: new Date('2017', '09', '17'),
  };

  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({ date: new Date('2017', '09', '17') }),
  );
});

test('should select requested date', () => {
  const handleStateChange = jest.fn();
  const { selectDate } = setup({
    onStateChange: handleStateChange,
  });
  selectDate({ date: new Date('2022', '09', '17') });
  const changes = {
    type: Organizer.stateChangeTypes.selectDate,
    date: new Date('2022', '09', '17'),
    selected: new Date('2022', '09', '17'),
  };

  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({
      date: new Date('2022', '09', '17'),
      selected: new Date('2022', '09', '17'),
    }),
  );
});

test('selectRange should select range', () => {
  const handleStateChange = jest.fn();
  const { selectRange } = setup({
    onStateChange: handleStateChange,
  });
  selectRange({ date: new Date('2022', '09', '17') });
  selectRange({ date: new Date('2022', '09', '22') });
  const changes = {
    type: Organizer.stateChangeTypes.selectRange,
    date: new Date('2022', '09', '22'),
    selected: [new Date('2022', '09', '17'), new Date('2022', '09', '22')],
  };

  expect(handleStateChange).toHaveBeenCalledTimes(2);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({
      date: new Date('2022', '09', '22'),
      selected: [new Date('2022', '09', '17'), new Date('2022', '09', '22')],
    }),
  );
});

test('should select requested month', () => {
  const handleStateChange = jest.fn();
  const { selectMonth } = setup({
    initialDate: new Date('2018', '09', '17'),
    onStateChange: handleStateChange,
  });
  selectMonth({ month: 11 });
  const changes = {
    type: Organizer.stateChangeTypes.selectMonth,
    date: new Date('2018', '11', '17'),
  };

  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({ date: new Date('2018', '11', '17') }),
  );
});

test('should select requested year', () => {
  const handleStateChange = jest.fn();
  const { selectYear } = setup({
    initialDate: new Date('2018', '09', '17'),
    onStateChange: handleStateChange,
  });
  selectYear({ year: 1989 });
  const changes = {
    type: Organizer.stateChangeTypes.selectYear,
    date: new Date('1989', '09', '17'),
  };

  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({ date: new Date('1989', '09', '17') }),
  );
});

test('should change language', () => {
  const handleStateChange = jest.fn();
  const { changeLanguage } = setup({
    initialDate: new Date('2018', '09', '17'),
    onStateChange: handleStateChange,
  });
  const days = [
    'понедельник',
    'вторник',
    'среда',
    'четверг',
    'пятница',
    'суббота',
    'воскресенье',
  ];
  const months = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
  ];
  changeLanguage({ days, months });
  const changes = {
    type: Organizer.stateChangeTypes.changeLanguage,
    days,
    months,
  };

  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({ days, months }),
  );
});

// test('should reset the state', () => {
//   const handleStateChange = jest.fn();
//   const { reset } = setup({
//     onStateChange: handleStateChange,
//   });
//   reset();
//   const changes = Organizer.initialState;

//   expect(handleStateChange).toHaveBeenCalledTimes(1);
//   expect(handleStateChange).toHaveBeenLastCalledWith(
//     changes,
//     expect.objectContaining(Organizer.initialState),
//   );
// });

function setup({ render: renderFn = () => <div />, ...props } = {}) {
  let renderArg;
  const childrenSpy = jest.fn(controllerArg => {
    renderArg = controllerArg;
    return renderFn(controllerArg);
  });
  const utils = render(<Organizer {...props}>{childrenSpy}</Organizer>);
  return { childrenSpy, ...utils, ...renderArg };
}
