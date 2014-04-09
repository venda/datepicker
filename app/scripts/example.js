DatePicker.init({
  language: 'en',
  region: 'england-and-wales',
  formInputName: 'selecteddatetime',
  useBankHolidays: true,
  nextDayDelivery: true,
  hideSelectsOnDatePicker: false,
  nddCutoffTime: 13,
  useRange: false,
  rangeInDays: 2,
  highlightWeekends: true,
  firstDayDiff: 1,
  largeDeviceSmoothScroll: true,
  scrollSpeed: 60,
  timeSeparationInMinutes: 30,
  showTimes: true,
  startHour: 9,
  endHour: 22,
  inactive: {
    monthsStartAtZero: false,
    blockDay: [6],
    dates: [
      '2014-02-30', '2014-04-11'
    ]
  }
});