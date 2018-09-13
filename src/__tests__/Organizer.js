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
  expect(result.totalOffsetDays).toEqual(6);
  expect(result.days.length).toEqual(6);
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
  expect(result.days.length).toEqual(6 + 30 + 6 - 1);
  expect(offsetDays.length).toEqual(6 + 6 - 1);
});

test('should get full calendar year', () => {
  const handleStateChange = jest.fn();
  const { getFullYear } = setup({
    onStateChange: handleStateChange,
  });
  const result = getFullYear();
  expect(result.length).toEqual(12);
});

function setup({ render: renderFn = () => <div />, ...props } = {}) {
  let renderArg;
  const childrenSpy = jest.fn(controllerArg => {
    renderArg = controllerArg;
    return renderFn(controllerArg);
  });
  const utils = render(<Organizer {...props}>{childrenSpy}</Organizer>);
  return { childrenSpy, ...utils, ...renderArg };
}
