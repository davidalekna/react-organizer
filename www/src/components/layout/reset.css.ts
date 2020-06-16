import { createGlobalStyle } from 'styled-components/macro';

const GlobalStyle = createGlobalStyle`
  * {
    border: 0;
	margin: 0;
	padding: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
	box-sizing: border-box;
	-webkit-font-smoothing: auto;
	font-weight: inherit;
	text-decoration: none;
	text-rendering: optimizeLegibility;
	-webkit-appearance: none;
	-moz-appearance: none;
  }
  body {
    margin: 0;
	font-family: 'Open Sans', sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
  }
`;

export default GlobalStyle;
