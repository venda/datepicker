Venda.Datepicker.init({

  language: 'es',
  region: 'england-and-wales',
  deactivateBankHolidays: true,

  datepickerContainer: '.container',
  selectContainer: '.select',
  nextDayDelivery: true,
  hideSelectsOnDatePicker: false,

  nddCutoffTime: 13,

  useRange: false,
  rangeInDays: 2,
  highlightWeekends: false,

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

});