import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Basic } from './examples';

storiesOf('Calendar', module).add('to Storybook', () => <Basic />);

storiesOf('Date Picker', module).add('to Storybook', () => <Basic />);

storiesOf('Range Picker', module).add('to Storybook', () => <Basic />);
