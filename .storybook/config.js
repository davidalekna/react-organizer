import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './reset.css';
import theme from './theme';

const req = require.context(
  '../stories/',
  true,
  /.*\.(stories|story)\.(js|ts|tsx)?$/,
);

const loadStories = () => {
  req.keys().forEach(filename => req(filename));
};

addDecorator(story => (
  <ThemeProvider theme={theme}>
    <>
      <GlobalStyle />
      {story()}
    </>
  </ThemeProvider>
));

configure(loadStories, module);
