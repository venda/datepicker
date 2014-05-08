# DatePicker

`DatePicker` has been built specifically for with the e-commerce market in mind. It has range of options that, among other things, allow the user to:

  * Use date ranges.
  * Deactivate specific dates and bank holidays based on region.
  * Select whether Next Day Delivery (NDD) is valid for the store.
  * Select a NDD cut-off time.

Make sure you check out the configuration [options](#options).

## Table Of Contents

  1. [Installation](#installation)
  1. [Usage](#usage)
  1. [Options](#options)
  1. [Output](#output)
  1. [To Do](#todo)
  1. [Version History](#versionhistory)
  1. [Animated Tour](#animatedtour)
  1. [Contributors](#contributors)
  1. [License](#license)

## <a name='installation'>Local Installation</a>

This application was developed with <a href="http://yeoman.io/">Yeoman</a>, the most useful tool of which was the auto-reload when a watched file changed.

`jQuery` is a prerequisite. It is preloaded with Yeoman.

To get the development environment running locally on your machine <a href="http://nodejs.org/">NodeJS</a> and <a href="http://gruntjs.com/getting-started">Grunt</a> are prerequisites.

  1. Clone the repo
  1. Change to the datepicker folder
  1. `npm install`
  1. `bower install`

### Run the development environment

Do `grunt server`.

### Build the datepicker JavaScript only

Do `grunt jsbuild`. Minimised versioned JavaScript and a source map file will appear in the `build` folder.

### Build the whole application

Do `grunt build`.

If it fails either do `grunt build --force`, or install Ruby and Compass as they are the most likely culprits.

The minimised application files will appear in the `dist` folder.

## <a name='usage'>Usage</a>

`DatePicker.init(options);`

For example:

```js
DatePicker.init({
  language: 'en',
  region: 'england-and-wales',
  formInputName: 'selecteddatetime',
  deactivateBankHolidays: true,
  nextDayDelivery: true
});
```

## <a name='options'>Options</a>

  1. [language](#language)
  1. [region](#region)
  1. [useBankHolidays](#usebankholidays)
  1. [hideselectsondatepicker](#hideselectsondatepicker)
  1. [formInputName](#forminputname)
  1. [nextDayDelivery](#nextdaydelivery)
  1. [nddCutoffTime](#nddcutofftime)
  1. [highlightWeekends](#highlightweekends)
  1. [useRange](#userange)
  1. [rangeInDays](#rangeindays)
  1. [firstDayDiff](#firstdaydiff)
  1. [largeDeviceSmoothScroll](#largedevicesmoothscroll)
  1. [scrollSpeed](#scrollspeed)
  1. [timeSeparation](#timeseparation)
  1. [showTimes](#showtimes)
  1. [startHour](#starthour)
  1. [endHour](#endhour)
  1. [inactive](#inactive)

### <a name='language'>language</a>

The language in which the calendar will display.

Current choices are:

* `en`: English
* `es`: Spanish
* `fr`: French
* `ge`: German
* `it`: Italian

__Note:__ all languages other than English are held in a separate JSON file. They will only be loaded if the language option is set to anything other than `en`.

Type: `string`

Default: `'en'`

Example: `language: 'en'`

### <a name='region'>region</a>

The current region. This is used to identify bank holidays. A region can be one of the following:

  * `england-and-wales`
  * `scotland`
  * `northern-ireland`

Type: `string`

Default: `england-and-wales`

Example: `region: 'england-and-wales'`

### <a name='usebankholidays'>useBankHolidays</a>

Making this option `true` will disable the calendar for the bank holidays for the specified region.

__Note:__ the bank holiday information is held in a separate JSON file and will only be loaded if this option is selected. The JSON data is from the [UK Govt. website](https://www.gov.uk/bank-holidays.json) and only goes up to the end of 2015. This data will need to be refreshed when necessary.

Type: `boolean`

Default: `true`

Example: `useBankHolidays: true`

### <a name='forminputdate'>formInputDate</a>

The name of the form input field that is to be updated with the selected date.

Type: `string`

Default: `'selecteddate'`

Example: `formInputDate: 'selecteddate'`

### <a name='forminputname'>formInputName</a>

The name of the form input field that is to be updated with the selected time.

Type: `string`

Default: `'selectedtime'`

Example: `formInputTime: 'selectedtime'`

### <a name='hideselectsondatepicker'>hideSelectsOnDatePicker</a>

Hide the select boxes if the calendar is displayed.

Type: `boolean`

Default: `false`

Example: `nextDayDelivery: true`

### <a name='nextdaydelivery'>nextDayDelivery</a>

Turn next day delivery off/on.

Type: `boolean`

Default: `true`

Example: `nextDayDelivery: true`

### <a name='nddcutofftime'>nddCutoffTime</a>

`nddCutoffTime` gives the hour that next day delivery becomes unavailable.

Type: `integer`

Default: `15`

Example: `nddCutoffTime: 15`

### <a name='highlightweekends'>highlightWeekends</a>

Whether to highlight the weekends (CSS class `weekend`).

Type: `boolean`

Default: `true`

Example: `highlightWeekends: true`

### <a name='userange'>useRange</a>

Whether a separate limiting delivery range is to be employed.

Type: `boolean`

Default: `true`

Example: `useRange: true`

### <a name='rangeindays'>rangeInDays</a>

Number of days in range.

Type: `integer`

Default: `14`

Example: `rangeInDays: 14`

### <a name='firstdaydiff'>firstDayDiff</a>

Whether Sunday falls on the first or last day of the week.

Type: `integer`, `0` or `1`

Default: `1`

Example 1: `firstDayDiff: 0` - Sunday falls on first day of week.

Example 2: `firstDayDiff: 1` - Sunday falls on last day of week.

### <a name='largedevicesmoothscroll'>largeDeviceSmoothScroll</a>

For desktop devices, allow hold-down mouse button to scroll.

Type: `boolean`

Default: `true`

Example: `largeDeviceSmoothScroll: true`

### <a name='scrollspeed'>scrollSpeed</a>

Scroll speed of the time list.

Default: `80`

Example: `scrollSpeed: 80`

### <a name='timeseparation'>timeSeparation</a>

The number of minutes by which the times in the time list are separated.

Type: `integer`

Default: `30`

Example: `timeSeparation: 30`

### <a name='showtimes'>showTimes</a>

Show the time list or not.

Type: `boolean`

Default: `true`

Example: `showTimes: true`

### <a name='starthour'>startHour</a>

The first hour in the time list

Type: `integer`

Default: `9`

Example: `startHour: 9`

### <a name='endhour'>endHour</a>

The last hour in the time list

Type: `integer`

Default: `22`

Example: `endHour: 22`

### <a name='inactive'>inactive</a>

An object that contains:

  * `monthsStartAtZero`: an identification parameter to determine whether January is the zeroth or first month in the year
  * `blockDay`: an array that allows you to block out specific columns so that, for example, "all Sundays" can be made inactive. This works off the column number (`0 to 6`) in the calendar grid. `[6]`, therefore, would block out each day that sits in the last column.
  * `dates`: an array of dates that are to be set as inactive in the calendar

Type: `object`

Default: `none`

Example:
```js
inactive: {
    monthsStartAtZero: false,
    blockDay: [6],
    dates: [
      '2014-02-30', '2014-04-11'
    ]
  }
```

#### Contains

##### monthsStartAtZero

Do the dates in the array conform to Jan = month zero, or Jan = month one?

Type: `boolean`

Default: `none`

Example: `monthsStartAtZero: true`

##### dates

An array of dates to be labelled inactive. Single digit numbers must be padded out with zeros.

Type: `array`

Default: `none`

Format: `year-month-day`

Example: `2014-08-06`

## <a name='todo'>To do</a>

* Allow half-hours under `nddCutoffTime`.
* Allow half-hours under `startTime` and `endTime`.
* Time options to be full 24hr values.
* Reset time list scroller.
* Either add new 'add' button, or close down expanded view when date is selected.

## <a name='versionhistory'>Version History</a>

### 1.0.0

Initial build.

## <a name='animatedtour'>Animated Tour</a>

This tour was initiatlised with the following options:

```js
{
  nextDayDelivery: true,
  nddCutoffTime: 15,
  useRange: true,
  rangeInDays: 14,
  firstDayDiff: 1,
  largeDeviceSmoothScroll: true,
  scrollSpeed: 60,
  timeSeparationInMinutes: 30,
  showTimes: true,
  startHour: 9,
  endHour: 22,
  inactive: {
    monthsStartAtZero: false,
    dates: [
      '2014-02-30', '2014-04-11'
    ]
  }
}
```

![Tour](https://raw.githubusercontent.com/venda/datepicker/master/docs/images/datepicker.gif)

## <a name='output'>Output</a>

The selected date is held as an object in the format `{ date: '2014-02-03', time: 1200 }`.

It can be retrieved using the DatePicker API using `DatePicker.getSelectedDateAndTime()`.

## <a name='contributors'>Contributors</a>

  1. <a href="https://github.com/andywillis">Andy Willis</a>

## <a name='license'>License</a>

The MIT License (MIT)

Copyright (c) 2014 Venda Group Limited

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.