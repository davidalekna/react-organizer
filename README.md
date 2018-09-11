<h1 align="center">
  Organizer 📅 (beta)
</h1>
<p align="center" style="font-size: 1.2rem;">Primitive to build simple, flexible, enhanced dates, calendars, input slector React components</p>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs] 
[![Code of Conduct][coc-badge]][coc]
[![size][size-badge]][unpkg-dist] [![gzip size][gzip-badge]][unpkg-dist]

## The problem

Explain the problem

## This solution

Explain the solution

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Usage](#usage)
- [Basic Props](#basic-props)
  - [children](#children)
  - [columns](#columns)
  - [columnFlex](#columnflex)
  - [stateReducer](#statereducer)
- [Advanced Props](#advanced-props)
  - [visibleColumns](#visiblecolumns)
  - [viewType](#viewtype)
  - [selectAllCheckboxState](#selectallcheckboxstate)
  - [currentSort](#currentsort)
  - [checked](#checked)
  - [viewsAvailable](#viewsavailable)
  - [switchViewType](#switchviewtype)
  - [switchColumns](#switchcolumns)
  - [checkboxState](#checkboxstate)
  - [offsetColumns](#offsetcolumns)
  - [checkboxToggle](#checkboxtoggle)
  - [onSelection](#onselection)
  - [changeSortDirection](#changesortdirection)
  - [defaultSortMethod](#defaultsortmethod)
  - [sortData](#sortdata)
  - [onStateChange](#onstatechange)
- [stateChangeTypes](#statechangetypes)
- [Children Function](#children-function)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save react-organizer
```

> This package also depends on `react`, `hoist-non-react-statics` and `prop-types`. Please make sure you have those installed as well.

## Usage

> NOTE: DataBrowser component will not provide any styles, only the functionality. Styles used in the examples are only for better visualization for what could be achieved using this component.

> [Try it out in the browser](https://codesandbox.io/s/github/davidalekna/organizer-examples)

```jsx
import React from 'react'
import {render} from 'react-dom'
import DataBrowser from 'react-organizer'

render(
  <Organizer>
    {(props) => (
      <div />
    )}
  </Organizer>,
  document.getElementById('root'),
)
```

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://travis-ci.org/davidalekna/react-data-browser.svg?style=flat-square
[build]: https://travis-ci.org/davidalekna/react-data-browser
[coverage-badge]: https://codecov.io/gh/davidalekna/react-data-browser/branch/master/graph/badge.svg?style=flat-square
[coverage]: https://codecov.io/gh/davidalekna/react-data-browser
[license-badge]: https://img.shields.io/npm/l/downshift.svg?style=flat-square
[license]: https://github.com/davidalekna/react-data-browser/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/davidalekna/react-data-browser/blob/master/CODE_OF_CONDUCT.md
[react-badge]: https://img.shields.io/badge/%E2%9A%9B%EF%B8%8F-(p)react-00d8ff.svg?style=flat-square
[react]: https://facebook.github.io/react/
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?label=size&style=flat-square
[unpkg-dist]: https://unpkg.com/react-data-browser/dist/
[use-a-render-prop]: https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce