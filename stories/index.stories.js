import './reset.css';
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import {
  Basic,
  MonthCalendar,
  YearCalendar,
  DatePicker,
  DateRangePicker,
} from './examples';

storiesOf('Calendar', module)
  .add('Month', () => <MonthCalendar />)
  .add('Year', () => <YearCalendar />);

storiesOf('Events', module).add('to Storybook', () => <Basic />);

storiesOf('Date Picker', module).add('by month', () => (
  <DatePicker
    onSelectDate={action('onSelectDate')}
    onReset={action('onReset')}
  />
));

storiesOf('Range Picker', module).add('Date Range Picker', () => (
  <DateRangePicker />
));
