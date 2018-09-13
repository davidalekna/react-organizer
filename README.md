<h1 align="center">
  Organizer 📅 (beta)
</h1>
<p align="center" style="font-size: 1.2rem;">Primitive to build simple, flexible, enhanced dates, calendars, input slector, events manager React components</p>

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
- [Props](#props)
  - [days](#days)
  - [months](#months)
  - [date,](#date)
  - [selected,](#selected)
  - [getPrevMonthOffset](#getprevmonthoffset)
  - [getNextMonthOffset](#getnextmonthoffset)
  - [getCurrentMonth](#getcurrentmonth)
  - [getFullMonth](#getfullmonth)
  - [getFullYear](#getfullyear)
  - [addCalendarMonth](#addcalendarmonth)
  - [subCalendarMonth](#subcalendarmonth)
  - [addCalendarYear](#addcalendaryear)
  - [subCalendarYear](#subcalendaryear)
  - [selectDate](#selectdate)
  - [reset](#reset)
  - [selectMonth](#selectmonth)
  - [selectYear](#selectyear)
  - [changeLanguage](#changelanguage)
  - [children](#children)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save react-organizer
```

> This package also depends on `react` and `prop-types`. Please make sure you have those installed as well.

## Usage

> NOTE: Organizer component will not provide any styles or jsx, only the functionality. Styles used in the examples are only for better visualization for what could be achieved using this component.

> [Try it out in the browser](https://codesandbox.io/s/github/davidalekna/organizer-examples)

```jsx
import React from 'react'
import {render} from 'react-dom'
import Organizer from 'react-organizer'

render(
  <Organizer>
    {(props) => (
      <div />
    )}
  </Organizer>,
  document.getElementById('root'),
)
```

## Props

This is the list of props that you should know about. 

### days

> `array` | optional

array of week day names in prefered language. Defaults to english.

### months

> `array` | optional

array of month names in prefered language. Defaults to english.

### date,

> `date` | optional

calendar date state

### selected,

> `date` | optional

selected date state

### getPrevMonthOffset

> `function({month: number, year: number, events: boolean})` 

generates previews month offset

### getNextMonthOffset

> `function({month: number, year: number, events: boolean, totalOffsetDays: number, totalDays: number})`

generates next month offset depending on how many grid items you want to display, defaults to 42

### getCurrentMonth

> `function({month: number, year: number, events: boolean})` 

generates current month

### getFullMonth

> `function(initMonth: number, events: boolean)` 

generates full month with previews and next months offset days

### getFullYear

> `function(events: boolean)` 

generates full year with months with previews and next months offset days

### addCalendarMonth

> `function()` 

### subCalendarMonth

> `function()`  

### addCalendarYear

> `function()` 

### subCalendarYear

> `function()` 

### selectDate

> `function({date: object})` 

selects date and adds a flag of selected on day object

### reset

> `function()` 

resets calendar to initial state

### selectMonth

> `function({month: number})` 

### selectYear

> `function({year: number})` 

### changeLanguage

> `function({days: array, months: array})` 

change language state

### children

> `function({})` | _required_

This is called with an object. 

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://travis-ci.org/davidalekna/react-organizer.svg?style=flat-square
[build]: https://travis-ci.org/davidalekna/react-organizer
[coverage-badge]: https://codecov.io/gh/davidalekna/react-organizer/branch/master/graph/badge.svg?style=flat-square
[coverage]: https://codecov.io/gh/davidalekna/react-organizer
[license-badge]: https://img.shields.io/npm/l/downshift.svg?style=flat-square
[license]: https://github.com/davidalekna/react-organizer/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/davidalekna/react-organizer/blob/master/CODE_OF_CONDUCT.md
[react-badge]: https://img.shields.io/badge/%E2%9A%9B%EF%B8%8F-(p)react-00d8ff.svg?style=flat-square
[react]: https://facebook.github.io/react/
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?label=size&style=flat-square
[unpkg-dist]: https://unpkg.com/react-organizer/dist/
[use-a-render-prop]: https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce