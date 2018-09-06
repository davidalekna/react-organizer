import 'react-testing-library/cleanup-after-each';
import React from 'react';
import { render } from 'react-testing-library';
import DatesBrowser from '../';

test('should get previews month last weeks offset days', () => {
  const handleStateChange = jest.fn();
  const { getPrevMonthOffset } = setup({
    onStateChange: handleStateChange,
  });
  const result = getPrevMonthOffset({ month: 9, year: 2018 });
  expect(result).toMatchSnapshot();
});

test('should get current month weeks with days and events', () => {
  const handleStateChange = jest.fn();
  const { getCurrentMonth } = setup({
    onStateChange: handleStateChange,
  });
  const result = getCurrentMonth({ month: 9, year: 2018 });
  console.log(result);
});

function setup({ render: renderFn = () => <div />, ...props } = {}) {
  let renderArg;
  const childrenSpy = jest.fn(controllerArg => {
    renderArg = controllerArg;
    return renderFn(controllerArg);
  });
  const utils = render(<DatesBrowser {...props}>{childrenSpy}</DatesBrowser>);
  return { childrenSpy, ...utils, ...renderArg };
}
