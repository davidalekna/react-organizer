import { Locale } from 'date-fns';

export type Event = {
  starts: Date;
  ends?: Date;
  [key: string]: any;
};

export type Week = {
  start: number;
  end: number;
};

export type Day = {
  date: Date;
  formatted: string;
  name: string;
  day: number;
  events: Event[];
  status: {
    past: boolean;
    future: boolean;
    weekend: boolean;
    selected?: boolean;
    offset?: boolean;
    today?: boolean;
  };
};

export type Days = Day[];

export type MonthFnProps = {
  month: number;
  year: number;
  events: Event[];
};

export type Props = {
  now?: any;
  selected?: any;
  locale: Locale;
  format: string;
  daysNames: string[];
  monthsNames: string[];
  events: Event[];
  initialGridOf: number;
  initialDate: Date;
  initialSelected: Date | null;
  //
  stateReducer: (state: State, changes: unknown) => any;
  onStateChange: (changes: unknown, state: State) => void;
  onReset: (args: Date) => void;
  onSelectDate: (args: Date | Date[]) => void;
  onSelectRange: (args: Date[]) => void;
  onAddCalendarYear: (args: Date) => void;
  onSubCalendarYear: (args: Date) => void;
  onSubCalendarMonth: (args: Date) => void;
  onAddCalendarMonth: (args: Date) => void;
  onSelectMonth: (args: Date) => void;
  onSelectYear: (args: Date) => void;
  onChangeLanguage: (args: { days: string[]; months: string[] }) => void;
};

export type State = {
  days: string[];
  months: string[];
  now: Date;
  selected: Date | null;
  gridOf: number;
  type?: any; // this is for passing a ref on an updated item
  //
  getPrevMonthOffset: Function;
  getNextMonthOffset: Function;
  getCurrentMonth: Function;
  getFullMonth: Function;
  getFullYear: Function;
  addCalendarMonth: Function;
  subCalendarMonth: Function;
  addCalendarYear: Function;
  subCalendarYear: Function;
  selectDate: Function;
  selectRange: Function;
  reset: Function;
  selectMonth: Function;
  selectYear: Function;
  changeLanguage: Function;
};
