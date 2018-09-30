import * as React from 'react'

export interface OrganizerState<Item> {
  days: Array<string>,
  months: Array<string>,
  gridBlocks: number,
  date: Date | null,
  selected: Date | null,
}

export enum StateChangeTypes {
  reset = '__reset__',
  selectDate = '__select_date__',
  selectRange = '__select_range__',
  addCalendarMonth = '__add_calendar_month__',
  subCalendarMonth = '__subtract_calendar_month__',
  addCalendarYear = '__add_calendar_year__',
  subCalendarYear = '__sub_calendar_year__',
  selectMonth = '__select_month__',
  selectYear = '__select_year__',
  changeLanguage = '__change_language__',
}

export interface OrganizerProps<Item> {
  stateReducer?: (
    state: OrganizerState<Item>,
    changes: StateChangeOptions<Item>,
  ) => Partial<StateChangeOptions<Item>>
  onStateChange?: (
    options: StateChangeOptions<Item>,
    stateAndHelpers: ControllerStateAndHelpers<Item>,
  ) => void
  // todo params
  onReset?: () => void,
  onSelectDate?: () => void,
  onSelectRange?: () => void,
  onAddCalendarYear?: () => void,
  onSubCalendarYear?: () => void,
  onSubCalendarMonth?: () => void,
  onAddCalendarMonth?: () => void,
  onSelectMonth?: () => void,
  onSelectYear?: () => void,
  onChangeLanguage?: () => void,
  initialDays: Array<string>,
  initialMonths: Array<string>,
  events: Array<Event>,
  initialGridBlocks: number,
  initialDate: Date,
  initialSelected: Date | null,
}

export interface Event {
  starts: Date
}

export interface StateChangeOptions<Item>
  extends Partial<OrganizerState<Item>> {
  type: StateChangeTypes
}

export interface Actions<Item> {
  // todo params
  getPrevMonthOffset: () => void,
  getNextMonthOffset: () => void,
  getCurrentMonth: () => void,
  getFullMonth: () => void,
  getFullYear: () => void,
  addCalendarMonth: () => void,
  subCalendarMonth: () => void,
  addCalendarYear: () => void,
  subCalendarYear: () => void,
  selectDate: () => void,
  selectRange: () => void,
  reset: () => void,
  selectMonth: () => void,
  selectYear: () => void,
  changeLanguage: () => void,
}

export type ControllerStateAndHelpers<Item> = OrganizerState<Item> & Actions<Item>

export type ChildrenFunction<Item> = (
  options: ControllerStateAndHelpers<Item>,
) => React.ReactNode

export type OrganizerInterface<Item> = React.ComponentClass<
  OrganizerProps<Item>
> & {
  stateChangeTypes: {
    reset: StateChangeTypes.reset
    selectDate: StateChangeTypes.selectDate
    selectRange: StateChangeTypes.selectRange
    addCalendarMonth: StateChangeTypes.addCalendarMonth
    subCalendarMonth: StateChangeTypes.subCalendarMonth
    addCalendarYear: StateChangeTypes.addCalendarYear
    subCalendarYear: StateChangeTypes.subCalendarYear
    selectMonth: StateChangeTypes.selectMonth
    selectYear: StateChangeTypes.selectYear
    changeLanguage: StateChangeTypes.changeLanguage
  }
}

declare const Organizer: OrganizerInterface<any>

export default Organizer
