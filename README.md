# Datepicker

Datepicker allows a user to select a certain date and/or time.

It has range of options that, among other things, allow the user to:

  * Use date ranges
  * Ban certain dates from being selected
  * Select whether Next Day Delivery is valid
  * Select a Next Day Delivery cut-off time

## Table Of Contents

  1. [Installation](#installation)
  1. [Options](#options)
  1. [Output](#output)
  1. [To Do](#todo)
  1. [Animated Tour](#animatedtour)
  1. [Contributors](#contributors)
  1. [License](#license)

## <a name='installation'>Local Installation</a>

This application was developed with <a href="http://yeoman.io/">Yeoman</a>, the most useful tool of which was the auto-reload when a watched file changed.

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

## <a name='options'>Options</a>

  1. [datepickerContainer](#datepickercontainer)
  1. [selectContainer](#selectcontainer)
  1. [hideSelectsOnDatePicker](#hideselectsondatepicker)
  1. [nextDayDelivery](#nextDayDelivery)
  1. [nddCutoffTime](#nddCutoffTime)
  1. [useRange](#useRange)
  1. [rangeInDays](#rangeInDays)
  1. [firstDayDiff](#firstDayDiff)
  1. [largeDeviceSmoothScroll](#largeDeviceSmoothScroll)
  1. [scrollSpeed](#scrollSpeed)
  1. [timeSeparation](#timeSeparation)
  1. [showTimes](#showTimes)
  1. [startHour](#startHour)
  1. [endHour](#endHour)
  1. [inactive](#inactive)

### <a name='datepickercontainer'>datepickerContainer</a>

The name of the element that will contain the dropdown calendar.

Type: `selector`

Default: `.container`

Example: `datepickerContainer: '.container'`

### <a name='selectcontainer'>selectcontainer</a>

The name of the element that will contain the one-line selects boxes.

Type: `selector`

Default: `.select`

Example: `selectContainer: '.select'`

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

### <a name='nddCutoffTime'>nddCutoffTime</a>

`nddCutoffTime` gives the hour that next day delivery becomes unavailable.

Type: `integer`

Default: `15`

Example: `nddCutoffTime: 15`

### <a name='useRange'>useRange</a>

Whether a separate limiting delivery range is to be employed.

Type: `boolean`

Default: `true`

Example: `useRange: true`

### <a name='rangeInDays'>rangeInDays</a>

Number of days in range.

Type: `integer`

Default: `14`

Example: `rangeInDays: 14`

### <a name='firstDayDiff'>firstDayDiff</a>

Whether Sunday falls on the first or last day of the week.

Type: `integer`, `0` or `1`

Default: `1`

Example 1: `firstDayDiff: 0` - Sunday falls on first day of week.

Example 2: `firstDayDiff: 1` - Sunday falls on last day of week.

### <a name='largeDeviceSmoothScroll'>largeDeviceSmoothScroll</a>

For desktop devices, allow hold-down mouse button to scroll.

Type: `boolean`

Default: `true`

Example: `largeDeviceSmoothScroll: true`

### <a name='scrollSpeed'>scrollSpeed</a>

Scroll speed of the time list.

Default: `80`

Example: `scrollSpeed: 80`

### <a name='timeSeparation'>timeSeparation</a>

The number of minutes by which the times in the time list are separated.

Type: `integer`

Default: `30`

Example: `timeSeparation: 30`

### <a name='showTimes'>showTimes</a>

Show the time list or not.

Type: `boolean`

Default: `true`

Example: `showTimes: true`

### <a name='startHour'>startHour</a>

The first hour in the time list

Type: `integer`

Default: `9`

Example: `startHour: 9`

### <a name='endHour'>endHour</a>

The last hour in the time list

Type: `integer`

Default: `22`

Example: `endHour: 22`

### <a name='inactive'>inactive</a>

An object that contains an array of date objects that are to be set as inactive in the calendar, and an identification parameter to determine whether January is the zeroth or first month in the year.

Type: `object`

Default: `none`

Example:
```js
inactive: {
    monthsStartAtZero: true,
    dates: [
      { year: 2014, month: 8, day: 6 },
      { year: 2014, month: 2, day: 6 },
      { year: 2014, month: 2, day: 11 },
      { year: 2014, month: 2, day: 20 },
      { year: 2014, month: 3, day: 10 },
      { year: 2014, month: 3, day: 2 },
      { year: 2014, month: 4, day: 12 }
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

An array of date objects to be labelled inactive.

Type: `array`

Default: `none`

Format: `{ year, month, day }`

Example: `{ year: 2014, month: 8, day: 6 }`

## <a name='todo'>To do</a>

* Multi-language support.
* Allow half-hours under `nddCutoffTime`.
* Allow half-hours under `startTime` and `endTime`.
* Time options to be full 24hr values.
* Reset time list scroller.
* Use floating div for expanded view.
* Configure CSS.
* Either add new 'add' button, or close down expanded view when date is selected.

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
    monthsStartAtZero: true,
    dates: [
      { year: 2014, month: 8, day: 6 },
      { year: 2014, month: 2, day: 6 },
      { year: 2014, month: 2, day: 11 },
      { year: 2014, month: 2, day: 20 },
      { year: 2014, month: 3, day: 10 },
      { year: 2014, month: 3, day: 2 },
      { year: 2014, month: 4, day: 12 }
    ]
  }
}
```

![Tour](https://raw.githubusercontent.com/andywillis/VendaSandbox/master/datepicker/docs/images/datepicker.gif?token=1903595__eyJzY29wZSI6IlJhd0Jsb2I6YW5keXdpbGxpcy9WZW5kYVNhbmRib3gvbWFzdGVyL2RhdGVwaWNrZXIvZG9jcy9pbWFnZXMvZGF0ZXBpY2tlci5naWYiLCJleHBpcmVzIjoxMzk2NDQzODM2fQ%3D%3D--7766ca4ffa18e7cb82f4df8301919c8ab3bea660)

## <a name='output'>Output</a>

The selected date is held as an object in the format `{ date: '2014-02-03', time: 1200 }`.

It can be retrieved using the Datepicker API using `Venda.Datepicker.getSelectedDateAndTime()`.

## <a name='contributors'>Contributors</a>

  1. <a href="https://github.com/andywillis">Andy Willis</a>

## <a name='license'>License</a>

Copyright (c) 2014 Venda Ltd

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