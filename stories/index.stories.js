import './reset.css';
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Basic, MonthCalendar, YearCalendar, DatePicker } from './examples';

storiesOf('Calendar', module)
  .add('Month', () => <MonthCalendar />)
  .add('Year', () => <YearCalendar />);

storiesOf('Date Picker', module).add('by month', () => <DatePicker />);

storiesOf('Range Picker', module).add('to Storybook', () => <Basic />);
