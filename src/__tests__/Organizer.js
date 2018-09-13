import 'react-testing-library/cleanup-after-each';
import React from 'react';
import { render } from 'react-testing-library';
import Organizer from '../';

const initialDate = { month: 8, year: 2018 };

test('should get previews month last weeks offset days', () => {
  const { getPrevMonthOffset } = setup();
  const result = getPrevMonthOffset(initialDate);
  expect(result).toMatchSnapshot();
});

test('should get current month days and events', () => {
  const { getCurrentMonth } = setup();
  const result = getCurrentMonth(initialDate);
  expect(result).toMatchSnapshot();
});

test('should get next month first weeks offset days', () => {
  const { getNextMonthOffset } = setup();
  const result = getNextMonthOffset({
    ...initialDate,
    totalOffsetDays: 5,
    totalDays: 30,
  });
  expect(result).toMatchSnapshot();
});

test('should get full month with prev offset days and next offset days', () => {
  const { getFullMonth } = setup();
  const result = getFullMonth(8, true);
  expect(result).toMatchSnapshot();
});

test('should get full calendar year', () => {
  // will fail because of moving today date 🤔
  const handleStateChange = jest.fn();
  const { getFullYear } = setup({
    onStateChange: handleStateChange,
  });
  const result = getFullYear();
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
