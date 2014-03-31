Venda.Datepicker.init({

  region: 'scotland',
  makeBankHolidaysInactive: true,

  datepickerContainer: '.container',
  selectContainer: '.select',
  nextDayDelivery: false,
  hideSelectsOnDatePicker: false,

  // 24 hr.
  nddCutoffTime: 15,

  useRange: true,
  rangeInDays: 14,
  highlightWeekends: false,

  // 0 or 1
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