Venda.Datepicker.init({

  datepickerContainer: '.container',
  selectContainer: '.select',
  nextDayDelivery: true,
  hideSelectsOnDatePicker: false,

  // 24 hr.
  nddCutoffTime: 15,

  useRange: true,
  rangeInDays: 14,

  // 0 or 1
  firstDayDiff: 1,
  largeDeviceSmoothScroll: true,
  scrollSpeed: 60,
  timeSeparationInMinutes: 30,
  showTimes: true,
  startHour: 10,
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

});