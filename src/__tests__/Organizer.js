import 'react-testing-library/cleanup-after-each';
import React from 'react';
import { render } from 'react-testing-library';
import Organizer from '../';

test('should get previews month last weeks offset days', () => {
  const handleStateChange = jest.fn();
  const { getPrevMonthOffset } = setup({
    onStateChange: handleStateChange,
  });
  const result = getPrevMonthOffset({ month: 9, year: 2018 });
  expect(result).toMatchSnapshot();
});

test('should get current month days and events', () => {
  const handleStateChange = jest.fn();
  const { getCurrentMonth } = setup({
    onStateChange: handleStateChange,
  });
  const result = getCurrentMonth({ month: 9, year: 2018 });
  expect(result).toMatchSnapshot();
});

test('should get next month first weeks offset days', () => {
  const handleStateChange = jest.fn();
  const { getNextMonthOffset } = setup({
    onStateChange: handleStateChange,
  });
  const result = getNextMonthOffset({
    month: 9,
    year: 2018,
    totalOffsetDays: 5,
    totalDays: 30,
  });
  expect(result).toMatchSnapshot();
});

test('should get full month with prev offset days and next offset days', () => {
  const handleStateChange = jest.fn();
  const { getFullMonth } = setup({
    onStateChange: handleStateChange,
  });
  const result = getFullMonth({ month: 9, year: 2018 });
  expect(result).toMatchSnapshot();
});

test('should get full calendar year', () => {
  const handleStateChange = jest.fn();
  const { getFullCalendarYear } = setup({
    onStateChange: handleStateChange,
  });
  const result = getFullCalendarYear({ year: 2018 });
  expect(result).toMatchSnapshot();
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
