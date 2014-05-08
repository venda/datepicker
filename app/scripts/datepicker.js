/*!
 * E-commerce datepicker
 * Copyright Venda 2014.
 */
!function (global) {
  'use strict';

  function defineModule($) {

    var DatePicker;

    DatePicker = {

      template: {
        main: [
          '<div class="mini inline">',
          '<i class="icon-calendar"></i>',
          '<div class="select"></div></div>',
          '<div class="container"></div>'
        ],
        wrapper: [
          '#{header}',
          '<div class="wrapper">',
          '<div class="datepicker">#{datepicker}</div>',
          '<div class="times">',
          '<div class="scrollbar up"><i class="icon-sort-up"></i></i></div>',
          '<div class="scrolly">#{times}</div>',
          '<div class="scrollbar down"><i class="icon-sort-down"></i></div>',
          '</div>',
          '</div>'
        ],
        header: [
          '<div class="header inline">',
          '<div class="inline previous direction on #{size}" data-month="#{monthprevious}"',
          ' data-year="#{yearprevious}">&lt;&lt;</div>',
          '<div class="inline monthyear #{size}">#{month}&nbsp;#{year}</div>',
          '<div class="inline next direction on #{size}" data-month="#{monthnext}"',
          ' data-year="#{yearnext}">&gt;&gt;</div>',
          '</div>'
        ],
        datepicker: [
          '<table class="datepicker-table">',
          '<thead><tr class="daynames">#{daynames}</tr></thead>',
          '#{days}',
          '</table>'
        ],
        selectDate: [
          '<select class="availabledates">#{options}</select>'
        ],
        selectTime: [
          '<select class="availabletimes">#{options}</select>'
        ],
        addDate: [
          '<input type="button" class="adddate" value="Add date" />'
        ],
        optionDate: [
          '<option data-date="#{value}" value="#{value}">#{name}</option>'
        ],
        optionTime: [
          '<option data-time="#{time}" value="#{value}">#{value}</option>'
        ]
      },

      html: {},
      dates: {},
      checks: {},
      selectDates: [],
      bankHolidays: [],
      isVisble: false,
      container: '#dp-container',
      gridContainer: '.container',
      selectContainer: '.select',
      lang: {
        en: {
          days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
          fullDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
          fullMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          sep: '-',
          format: 'YYYY-MM-DD hh:mm'
        }
      },

      /**
       * Default options that will be overwritten with whatever options are
       * supplied to the application.
       * @type {Object}
       */
      defaultOptions: {
        language: 'en',
        region: 'england-and-wales',
        useBankHolidays: true,
        formInputDate: 'selecteddate',
        formInputTime: 'selectedtime',
        nextDayDelivery: true,
        hideSelectsOnDatePicker: false,
        nddCutoffTime: 15,
        useRange: false,
        rangeInDays: 14,
        highlightWeekends: true,
        firstDayDiff: 1,
        largeDeviceSmoothScroll: true,
        scrollSpeed: 80,
        timeSeparationInMinutes: 30,
        showTimes: true,
        startHour: 9,
        endHour: 22,
        inactive: {
          monthsStartAtZero: false,
          blockDay: [],
          dates: []
        }
      },

      /**
       * Initialise module.
       * @param  {object} options Options object
       */
      init: function (options) {
        var _this = this;
        this
          .setOptions(options)
          .setApplicationNode()
          .clearInputs()
          .getNow()
          .loadDependancies(function () {
            _this
              .addMainTemplate()
              .createTimeArray()
              .createTimeList()
              .calculateDatePicker();
          });
        return this;
      },

      /**
       * Convert JS type to something more easily understood.
       * e.g. An array is 'array' rather than 'object'.
       * @param  {type} x Options object
       */
      toType: function (x) {
        return ({}).toString.call(x).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
      },

      /**
       * Apply an object to a string/array template.
       * @param  {string/array} template A template
       * @param  {object} obj      Data object
       * @return {string}          HTML
       */
      applyTemplate: function (template, obj) {
        var p, prop, param, html;
        html = this.toType(template) === 'array' ? template.join('') : template;
        for (p in obj) {
          if (obj.hasOwnProperty(p)) {
            prop = obj[p];
            param = '#{param}'.replace('param', p);
            html = this.replaceAll(html, param, prop);
          }
        }
        return html;
      },

      /**
       * Used in conjunction with `applyTemplate`. Takes a string
       * and does a global replace on one string with another
       * @param  {string} str     Body text
       * @param  {string} find    String to search for
       * @param  {string} replace Replacement string
       * @return {string}         Updated string
       */
      replaceAll: function (str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
      },

      /**
       * jQuery allows a context to be specified for a DOM selection. A
       * search for DOM nodes will be carried out within that context and not
       * the whole document. `applicationNode` describes that context. This
       * method sets it.
       */
      setApplicationNode: function () {
        this.applicationNode = $(this.container);
        return this;
      },

      /**
       * Convenience method for using context for jQuery DOM selection.
       * @param  {string} selector        DOM selection string e.g. '.active'
       * @param  {boolean} searchGlobal   If true or undefined the search will
       *                                  expand outside of the context.
       * @return {jQuery object}          jQuery DOM selection
       */
      getNode: function (selector, searchGlobal) {
        if (!!searchGlobal) {
          return $(selector);
        } else {
          return this.applicationNode.find(selector);
        }
      },

      /**
       * Adds HTML to the DOM
       */
      addMainTemplate: function () {
        $(this.container).html(this.template.main.join(''));
        return this;
      },

      /**
       * Wait for promises to complete then load the rest of the app (see `init`).
       * @param  {Function} callback Function that completes the app load
       */
      loadDependancies: function (callback) {
        $.when(this.loadBankHolidays(), this.loadMultiLang()).then(callback);
        return this;
      },

      /**
       * Uses a deferred function that returns once the bank holiday data is
       * loaded into the application. `useBankHolidays` must be true.
       * @return {deferred} Deferred function
       */
      loadBankHolidays: function () {
        var _this, deferred;
        _this = this;
        deferred = new $.Deferred();
        if (this.options.useBankHolidays) {
          $.getJSON('scripts/uk-bank-holidays.json', function (data) {
            var events = data[_this.options.region].events;
            for (var i = 0, l = events.length; i < l; i++) {
              _this.bankHolidays.push(events[i].date);
            }
            _this.convertDatesToZeroMonthFormat(_this.bankHolidays);
            deferred.resolve();
          });
        } else {
          deferred.resolve();
        }
        return deferred.promise();
      },

      /**
       * If selected language is not 'en' load the multilanguage file into the
       * app with a deferred function.
       * @return {deferred} Deferred object
       */
      loadMultiLang: function () {
        var _this, deferred;
        _this = this;
        deferred = new $.Deferred();
        if (this.options.language !== 'en') {
          $.getJSON('scripts/multiLang.json', function (data) {
            _this.lang = data;
            deferred.resolve();
          });
        } else {
          deferred.resolve();
        }
        return deferred.promise();
      },

      /**
       * Converts gov.uk bank holiday dates to zero month format to work with
       * the application.
       * e.g. 24/12/14 to 24/11/14
       * @param  {array} array Array of non-zero month formatted dates.
       */
      convertDatesToZeroMonthFormat: function (array) {
        var date, dateArr, currentDate, dateObj;
        currentDate = this.dates.now.date;
        for (var i = 0, l = array.length; i < l; i++) {
          date = array[i];
          dateObj = new Date(date);
          if (dateObj < currentDate) {
            array.splice(i, 1);
            i--;
            l--;
          } else {
            dateArr = date.split('-');
            dateArr[1] = this.padNumber(parseInt(dateArr[1], 10) - 1);
            array[i] = dateArr.join('-');
          }
        }
      },

      /**
       * Change date in date picker if there is a change in the date dropdown
       * @param  {string} date Date string
       */
      changeDateInDatePicker: function (date) {
        this.getNode('.datepicker-day').removeClass('clicked');
        this.getNode('.datepicker-day[data-date="' + date + '"]').addClass('clicked');
        if (!this.options.showTimes || this.options.showTimes && this.selectedDateAndTime.time) {
          this
            .toggleAddButton('enable')
            .toggleDatePicker();
        }
        return this;
      },

      /**
       * Change date in date dropdown if there is a change in the datepicker
       * @param  {string} date Date string
       */
      changeDateInSelect: function (date) {
        this.getNode('option[data-date="' + date + '"]').prop('selected', 'selected');
        return this;
      },

      /**
       * Change time in date picker if there is a change in the time dropdown
       * @param  {string} time Time string
       */
      changeTimeInDatePicker: function (time) {
        this.getNode('.datetime').removeClass('clicked');
        this.getNode('.datetime[data-time="' + time + '"]').addClass('clicked');
        if (this.options.showTimes && this.selectedDateAndTime.date) {
          this
            .toggleAddButton('enable')
            .toggleDatePicker();
        }
        return this;
      },

      /**
       * Change time in time dropdown if there is a change in the datepicker time
       * @param  {string} time Time string
       */
      changeTimeInSelect: function (time) {
        this.getNode('option[data-time="' + time + '"]').prop('selected', 'selected');
        return this;
      },

      /** Returns header HTML */
      getHeader: function (size) {
        return this.applyTemplate(this.template.header, this.getHeaderObj(size));
      },

      /**
       * Builds the HTML for the date dropdown.
       * @return {string} Complete HTML
       */
      getDateSelectHTML: function () {
        var option, optionTmpl, options, day, html;
        if (!this.isLastDayInMonth(this.dates.current.day)) {
          optionTmpl = this.template.optionDate.join('');
          options = [];
          for (var i = 0, l = this.selectDates.length; i < l; i++) {
            day = this.selectDates[i].split(' ')[1];
            option = optionTmpl
              .replace('#{name}', this.selectDates[i])
              .replace('#{value}', this.getShortDate(day), 'gi');
            options.push(option);
          }
          html = this.applyTemplate(this.template.selectDate, {
            options: options.join('')
          });
          this.selectDates = [];
          return html;
        } else {
          return '';
        }
      },

      /**
       * Builds the HTML for the time dropdown.
       * @return {string} Complete HTML
       */
      getTimeSelectHTML: function () {
        var html, options, thisTime, optionTmpl, option;
        if (!this.isLastDayInMonth(this.dates.current.day)) {
          options = [];
          optionTmpl = this.template.optionTime.join('');
          for (var i = 0, l = this.timeArray.length; i < l; i++) {
            thisTime = this.timeArray[i];
            option = optionTmpl
              .replace(/#{value}/g, thisTime.hr + ':' + thisTime.mi)
              .replace('#{time}', thisTime.hr + '' + thisTime.mi);
            options.push(option);
          }
          html = this.applyTemplate(this.template.selectTime, {
            options: options.join('')
          });
          return html;
        } else {
          return '';
        }
      },

      /**
       * Generates the dropdown one-line header
       * @return {[type]} [description]
       */
      generateDropdownHTML: function () {
        var header, daySelect, timeSelect, addDate;
        header = this.getHeader('small');
        daySelect = this.getDateSelectHTML();
        timeSelect = this.getTimeSelectHTML();
        addDate = this.template.addDate.join('');
        if (this.options.showTimes) {
          this.html.select = header + daySelect + timeSelect + addDate;
        } else {
          this.html.select = header + daySelect + addDate;
        }
        return this;
      },

      /**
       * Open/close the datepicker
       */
      toggleDatePicker: function () {
        if (this.isVisble) {
          $(this.gridContainer).hide();
          if (this.options.hideSelectsOnDatePicker) { this.getNode('.mini').show(); }
        } else {
          $(this.gridContainer).show();
          this
            .clearUserSelection()
            .initTimeBar();
          if (this.options.hideSelectsOnDatePicker) { this.getNode('.mini').hide(); }
        }
        this.isVisble = !this.isVisble;
        return this;
      },

      /**
       * Enable/disable the add button
       * @param  {string} type Disable/enable
       */
      toggleAddButton: function (type) {
        type = type || 'enable';
        if (type === 'disable') { this.getNode('.adddate').prop('disabled', true); }
        if (type === 'enable') { this.getNode('.adddate').prop('disabled', false); }
        return this;
      },

      /**
       * Clears user selection
       */
      clearUserSelection: function () {
        this
          .clearSelectedDate()
          .clearInputs()
          .generateDatePickerHTML()
          .writeHTML()
          .toggleAddButton('disable');
        return this;
      },

      /** Adds a separator to the time parameter passed into it */
      formatTime: function (time) {
        return time.substr(0, 2) + ':' + time.substr(2, 2);
      },

      /**
       * Extend the default options with the user options (user options
       * overwrite the default options where specified).
       * @param {[type]} options [description]
       */
      setOptions: function (options) {
        this.options = $.extend(this.defaultOptions, options);
        return this;
      },

      /**
       * Creates a brand new datepicker
       * @param  {object} obj Optional object containing date information
       */
      calculateDatePicker: function (obj) {
        this
          .clearSelectedDate()
          .getCurrent(obj)
          .getPrevious()
          .getNext()
          .doChecks()
          .generateDatePickerHTML()
          .generateDropdownHTML()
          .writeHTML()
          .toggleAddButton('disable')
          .updateElements()
          .initTimeBar();
        return this;
      },

      /**
       * Toggles the datepicker time column if option `showtimes` is true.
       * @return {[type]} [description]
       */
      initTimeBar: function () {
        if (this.options.showTimes) { this.toggleScrollbarHighlight(); }
        return this;
      },

      /**
       * Returns a datepicker date object based on a date object
       * @param  {date} date JS date object
       * @return {obj}      Date object
       */
      buildDateObj: function (date) {
        return {
          date: date,
          day: date.getDate(),
          month: date.getMonth(),
          shortYear: date.getYear(),
          fullYear: date.getFullYear()
        };
      },

      /**
       * Sets the app present date
       * @return {[type]} [description]
       */
      getNow: function () {
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        this.dates.now = this.buildDateObj(date);
        return this;
      },

      /**
       * Sets the app current date
       * @return {[type]} [description]
       */
      getCurrent: function (obj) {
        var date, thisDate;
        thisDate = new Date();
        if (!obj || obj && thisDate.getMonth() === obj.month && thisDate.getFullYear() === obj.year) {
          date = new Date();
        } else {
          date = new Date(obj.year, obj.month, 1);
        }
        date.setHours(0, 0, 0, 0);
        this.dates.current = this.buildDateObj(date);
        return this;
      },

      /**
       * Sets the app previous date
       * @return {[type]} [description]
       */
      getPrevious: function () {
        var date = new Date(this.dates.current.fullYear, this.dates.current.month, 1);
        date.setMonth(date.getMonth() - 1);
        this.dates.previous = this.buildDateObj(date);
        return this;
      },

      /**
       * Sets the app future date
       * @return {[type]} [description]
       */
      getNext: function () {
        var date = new Date(this.dates.current.fullYear, this.dates.current.month, 1);
        date.setMonth(date.getMonth() + 1);
        this.dates.next = this.buildDateObj(date);
        return this;
      },

      /**
       * Return the day count for the supplied month/year
       * @param  {integer} month Month
       * @param  {integer} year  Year
       * @return {integer}      Number of days
       */
      getDaysInMonth: function (month, year) {
        return [
          31,
          (this.isLeapYear(year) ? 29 : 28),
          31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ][month];
      },

      /**
       * Is the supplied year a leap year
       * @param  {integer}  year year
       * @return {boolean}       Yes/no
       */
      isLeapYear: function (year) {
        return (0 === year % 400)
          || ((0 === year % 4) && (0 !== year % 100))
          || (0 === year);
      },

      /**
       * Return day labels according to language chosen
       * @return {array} Array of day labels
       */
      getDayLabels: function () {
        return this.lang[this.options.language].days;
      },

      /**
       * Return month label according to language chosen
       * @param  {integer} month Month
       * @return {string}        Month name
       */
      getMonthLabel: function (month) {
        return this.lang[this.options.language].fullMonths[month];
      },

      /**
       * Rebuilds the day labels depending on whether option `firstDayDiff`
       * has been set to 0 or 1.
       * @return {array} Rebuilt array of day names
       */
      rearrangeLabels: function () {
        var labels, first, second;
        labels = this.getDayLabels();
        first = labels.slice(this.options.firstDayDiff, labels.length);
        second = labels.slice(0, this.options.firstDayDiff);
        return first.concat(second);
      },

      /**
       * Returns the datepicker days of the week HTML
       * @return {string} Days of the week
       */
      getDaysHTML: function () {
        var html, labels;
        html = [];
        if (this.options.firstDayDiff !== 0) {
          labels = this.rearrangeLabels();
        } else {
          labels = this.getDayLabels();
        }
        for (var i = 0; i <= 6; i++) {
          html.push('<td class="datepicker-header-day">');
          html.push(labels[i]);
          html.push('</td>');
        }
        return html.join('');
      },

      /**
       * Returns an object for use with the header template
       * @param  {string} size Large/small
       * @return {object}      JS object
       */
      getHeaderObj: function (size) {
        return {
          month: this.getMonthLabel(this.dates.current.month),
          year: this.dates.current.fullYear,
          monthprevious: this.dates.previous.month,
          yearprevious: this.dates.previous.fullYear,
          monthnext: this.dates.next.month,
          yearnext: this.dates.next.fullYear,
          size: size
        };
      },

      /**
       * Generates the datepicker HTML and adds it to the app HTML container.
       */
      generateDatePickerHTML: function () {
        var obj, headerHTML;
        headerHTML = this.getHeader('large');
        obj = {
          header: headerHTML,
          datepicker: this.generateDatePicker()
        };
        if (this.options.showTimes) { obj.times = this.html.timeList; }
        this.html.all = this.applyTemplate(this.template.wrapper, obj);
        return this;
      },

      /**
       * Write the datepicker HTML to the DOM
       */
      writeHTML: function () {
        this.getNode(this.selectContainer).html(this.html.select);
        this.getNode(this.gridContainer).html(this.html.all);
        return this;
      },

      /**
       * Updates DOM after the datepicker HTML has been written
       */
      updateElements: function () {
        if (this.checks.isNowMonth) {
          this.disableHeaderButton('.previous');
        }
        if (!this.options.showTimes) {
          this.getNode('.times').remove();
          this.getNode('.datepicker').css('borderRight', '0');
          this.getNode('.monthyear.large').width('199');
          this.getNode('.direction.large').width('70');
        }
        if (this.options.useRange) {
          if (this.isRangeLessThanMonthEnd()) {
            this.disableHeaderButton('.next');
          }
        }
        return this;
      },

      /**
       * Disable 'previous' button
       */
      disableHeaderButton: function (selector) {
        this.getNode('.header').find(selector).removeClass('on');
        return this;
      },

      /**
       * If `useRange` is tru, determines if the range is less than month end.
       */
      isRangeLessThanMonthEnd: function () {
        return this.dates.current.day
          + this.options.rangeInDays <= this.getDaysInMonth(this.dates.current.month);
      },

      /**
       * Checks month/year
       */
      doChecks: function () {
        this
          .isNowYear()
          .isNowMonth();
        return this;
      },

      /**
       * Is this year shown on the datapicker the 'month' year
       * @return {boolean} true/false
       */
      isNowYear: function () {
        this.checks.isNowYear = this.dates.current.fullYear === this.dates.now.fullYear;
        return this;
      },

      /**
       * Is this month shown on the datapicker the 'now' month
       * @return {boolean} true/false
       */
      isNowMonth: function () {
        this.checks.isNowMonth = this.checks.isNowYear &&
          this.dates.current.month === this.dates.now.month;
        return this;
      },

      /**
       * Is the supplied day the 'now' day
       * @param  {integer}  day Day number
       * @return {boolean}     true/false
       */
      isToday: function (day) {
        return this.checks.isNowMonth && day === this.dates.now.day;
      },

      /**
       * Is the supplied day the previous day to 'now'
       * @param  {integer}  day Day number
       * @return {boolean}      true/false
       */
      isPreviousDay: function (day) {
        return this.checks.isNowYear
          && this.checks.isNowMonth
          && day < this.dates.now.day;
      },

      /**
       * Has the user supplied a list of inactive dates for processing?
       * @return {boolean} true/false
       */
      hasInactiveDates: function () {
        return this.options.inactive.dates.length > 0 ? true : false;
      },

      /**
       * Is the supplied day in the list of inactive dates in the options?
       * @param  {integer}  day Day number
       * @return {boolean}      true/false
       */
      isInactive: function (day) {
        var current, date;
        current = this.dates.current;
        if (this.options.inactive.monthsStartAtZero) {
          date = current.fullYear + '-' + this.padNumber(current.month) + '-' + this.padNumber(day);
        } else {
          date = current.fullYear + '-' + this.padNumber(current.month + 1) + '-' + this.padNumber(day);
        }
        if (this.options.inactive.dates.indexOf(date) > -1) {
          return true;
        }
        return false;
      },

      /**
       * Returns a short date in the format 'year-month-day'
       * @param  {[type]} day [description]
       * @return {string}     Formatted date
       */
      getShortDate: function (day) {
        return this.applyTemplate('#{year}-#{month}-#{day}', {
          year: this.dates.current.fullYear,
          month: this.padNumber(this.dates.current.month),
          day: this.padNumber(day)
        });
      },

      /**
       * Return 'long' date in the format 'Dayname 12' e.g. 'Friday 12'
       * @param  {integer} day Day name
       * @return {string}      Formatted date
       */
      getLongDate: function (day) {
        var date, dayName, month;
        date = new Date(this.dates.current.fullYear, this.dates.current.month, day);
        day = date.getDate();
        dayName = this.lang[this.options.language].fullDays[date.getDay()];
        month = this.getMonthLabel(date.getMonth());
        return dayName + ' ' + day;
      },

      /**
       * Adds the supplied date to the date dropdown container
       * @param  {integer} day Day number
       */
      collateDatesForSelect: function (day) {
        var date = this.getLongDate(day);
        this.selectDates.push(date);
        return this;
      },

      /**
       * Pads a number with an extra zero if it is less than one character.
       * @param  {integer} number Number
       * @return {string}         Formatted number as string.
       */
      padNumber: function (number) {
        return number.toString().length === 1 ? '0' + number : number;
      },

      /**
       * Creates a list of times for use in the time scroller/dropdown
       */
      createTimeArray: function () {
        var hr, mi;
        this.timeArray = [];
        for (var h = this.options.startHour, hl = this.options.endHour; h <= hl; h++) {
          for (var m = 0, ml = 60; m < ml; m += this.options.timeSeparationInMinutes) {
            hr = this.padNumber(h);
            mi = this.padNumber(m);
            this.timeArray.push({ hr: hr, mi: mi });
          }
        }
        return this;
      },

      /**
       * Creates the list of times as HTML based off the numbers created
       * with `createTimeArray`
       */
      createTimeList: function () {
        var html, datetime, template, thisTime;
        html = [];
        template = '<div class="datetime" data-time="#{time}">#{datetime}</div>';
        for (var i = 0, l = this.timeArray.length; i < l; i++) {
          thisTime = this.timeArray[i];
          datetime = template
            .replace('#{datetime}', thisTime.hr + ':' + thisTime.mi)
            .replace('#{time}', thisTime.hr + '' + thisTime.mi);
          html.push(datetime);
        }
        this.html.timeList = html.join('');
        return this;
      },

      /**
       * Does the datepicker show the 'now' month and year
       * @return {boolean} true/false
       */
      datepickerShowsCurrentMonthAndYear: function () {
        return this.dates.current.year === this.dates.now.year &&
          this.dates.current.month === this.dates.now.month;
      },

      /**
       * Is next day delivery possible?
       * @param  {integer}  day Day number
       * @return {boolean}      true/false
       */
      isNextDayDeliveryPossible: function (day) {
        return (this.options.nextDayDelivery &&
          new Date().getHours() < this.options.nddCutoffTime)
          ? true
          : false;
      },

      /**
       * Is the supplied day on the weekend
       * @param  {date}  firstDay Date object for the first day of the current month
       * @param  {integer}  day   Day number
       * @return {boolean}        true/false
       */
      isWeekendDay: function (firstDay, day) {
        var date = new Date(this.dates.current.fullYear, this.dates.current.month, day).getDay();
        if (firstDay.getDay() === 0 && this.options.firstDayDiff !== 0) {
          return date % 6 === 0 || date % 7 === 0 ? true : false;
        } else {
          return date === 0 || date === 6 ? true : false;
        }
      },

      /**
       * Returns the difference in days between two date objects
       * @param  {date} a First date object
       * @param  {date} b Second date object
       * @return {integer}   Days difference between a and b.
       */
      getDifferenceBetweenDates: function (a, b) {
        var utc1, utc2, msPerDay;
        msPerDay = 1000 * 60 * 60 * 24;
        utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
        return Math.floor((utc2 - utc1) / msPerDay);
      },

      /**
       * Is the supplied day the last in the month?
       * @param  {integer}  day Day number
       * @return {boolean}      true/false
       */
      isLastDayInMonth: function (day) {
        return day === this.getDaysInMonth(this.dates.current.month, this.dates.current.year);
      },

      /**
       * Checks to see if supplied date is the first in the month
       * @param  {integer}  day Day number
       * @return {boolean}      true/false
       */
      isFirstDayInMonth: function (day) {
        return day === 1;
      },

      /**
       * Creates a brand new date with supplied day, month and year.
       * @param  {integer} year  Year
       * @param  {integer} month Month
       * @param  {integer} day   Day
       * @return {date}          new Date() object
       */
      createDate: function (year, month, day) {
        return new Date(year, month, day);
      },

      /**
       * For use with the next day delivery option, this works out whether the
       * supplied day is the day after 'now'.
       * @param  {[type]}  day [description]
       * @return {Boolean}     [description]
       */
      isNextDay: function (day) {
        var now, current, n, c;
        c = this.dates.current;
        n = this.dates.now;
        if (this.isFirstDayInMonth(day)) {
          current = this.createDate(c.fullYear, c.month, day);
          now = this.createDate(n.fullYear, n.month, n.day);
          return this.getDifferenceBetweenDates(now, current) === 1;
        } else {
          return this.datepickerShowsCurrentMonthAndYear() &&
            day - this.dates.current.day === 1;
        }
      },

      /**
       * Checks to see if the supplied day is a blocked day as specified in
       * the list of inactive dates supplied by the user
       * @param  {integer}  day Day number
       * @return {boolean}      true/false
       */
      isBlockedDay: function (day) {
        return this.options.inactive.blockDay.indexOf(day) >= 0;
      },

      /**
       * Checks to see if the supplied day is within range
       * @param  {integer}  day Day number
       * @return {boolean}      true/false
       */
      isWithinRange: function (day) {
        var todayDate, nowDate, diff;
        todayDate = new Date(this.dates.current.fullYear, this.dates.current.month, day);
        nowDate = this.dates.now.date;
        diff = this.getDifferenceBetweenDates(nowDate, todayDate);
        return diff <= this.options.rangeInDays;
      },

      /**
       * Builds the date picker HTML
       * @return {string} HTML
       */
      generateDatePicker: function () {

        var tdClass, firstDay, startingDay, monthLength, html, day,
            isDatePickerDay, week, shortdate, isInactiveDay, isBankHoliday,
            isBlockDay;

        html = [];
        day = 1;
        week = 1;
        firstDay = new Date(this.dates.current.fullYear, this.dates.current.month, 1);
        startingDay = firstDay.getDay() - this.options.firstDayDiff;
        if (startingDay === - 1) { startingDay = 6; }
        monthLength = this.getDaysInMonth(this.dates.current.month, this.dates.current.fullYear);

        for (var i = 0; i < 9; i++) {

          for (var j = 0; j <= 6; j++) {

            tdClass = [];
            isDatePickerDay = (day <= monthLength && (i > 0 || j >= startingDay));
            shortdate = this.getShortDate(day);
            isInactiveDay = this.hasInactiveDates() && this.isInactive(day);
            isBankHoliday = this.options.deactivateBankHolidays
              && this.bankHolidays.length > 0
              && this.isBankHoliday(shortdate) > -1;
            isBlockDay = this.isBlockedDay(j);

            if (isDatePickerDay) {

              if (this.isToday(day)) {
                tdClass.push('today');
              } else if (this.isPreviousDay(day)) {
                tdClass.push('pastday');
              } else if (isInactiveDay || isBankHoliday || isBlockDay
                || (this.isNextDay(day) && !this.isNextDayDeliveryPossible(day))
                ) {
                tdClass.push('inactive');
              } else if (this.options.useRange && !this.isWithinRange(day)) {
                tdClass.push('outofrange');
              } else {
                tdClass.push('datepicker-day');
                this.collateDatesForSelect(day);
              }

              if (this.options.highlightWeekends && this.isWeekendDay(firstDay, day)) {
                tdClass.push('weekend');
              }

              if (isInactiveDay || isBlockDay || isBankHoliday
                || (this.isNextDay(day) && !this.isNextDayDeliveryPossible(day))) {
                html.push('<td class="', tdClass.join(' '), '">', '', '</td>');
              } else {
                tdClass.push('active');
                html.push('<td data-date="');
                html.push(shortdate);
                html.push('" class="');
                html.push(tdClass.join(' '));
                html.push('">');
                html.push(day);
                html.push('</td>');
              }

              day++;

            } else {
              html.push('<td class="empty">&nbsp;</td>');
            }

          }

          if (day > monthLength && week >= 6) {
            break;
          } else {
            html.push('</tr><tr>');
            week++;
          }

        }

        html.push('</tr>');

        return this.applyTemplate(this.template.datepicker, {
          daynames: this.getDaysHTML(),
          days: html.join('')
        });

      },

      /**
       * Is this supplied date a bank holiday?
       * @param  {string}  date Date string
       * @return {boolean}      true/false
       */
      isBankHoliday: function (date) {
        return this.bankHolidays.indexOf(date);
      },

      /**
       * Works out whether a scrollbar button should be active or not
       * depending on the list position
       */
      toggleScrollbarHighlight: function () {
        var $wrapper, pos, scrollHeight, height, $up, $down;
        $wrapper = this.getNode('.scrolly');
        pos = $wrapper.scrollTop();
        $up = this.getNode('.scrollbar.up');
        $down = this.getNode('.scrollbar.down');
        scrollHeight = $wrapper[0].scrollHeight;
        height = $wrapper.outerHeight();
        if (pos < scrollHeight - height) { $down.addClass('active'); }
        if (pos > 0) { $up.addClass('active'); }
        if (pos <= 0) { $up.removeClass('active'); this.scrollStop(); }
        if (pos >= scrollHeight - height) {
          $down.removeClass('active');
          this.scrollStop();
        }
        return this;
      },

      /**
       * Scroll function used in the looping setTimeout
       * @param  {string} direction up/down
       */
      scrollListContent: function (direction) {
        var pos, $wrapper, speed;
        $wrapper = this.getNode('.scrolly');
        pos = $wrapper.scrollTop();
        speed = this.options.scrollSpeed;
        $wrapper.scrollTop(direction === 'up' ? pos - speed : pos + speed);
        this.toggleScrollbarHighlight();
        return this;
      },

      /**
       * Start the scroll loop
       * @param  {string} direction up/down
       */
      scrollStart: function (direction) {
        var _this = this;
        if (['mobile', 'tablet'].indexOf(this.device) > 0 || !this.options.largeDeviceSmoothScroll) {
          this.scrollListContent(direction);
        } else {
          (function scroller() {
            _this.scrollListContent(direction);
            _this.scrollInterval = setTimeout(scroller, 100);
          }());
        }
        return this;
      },

      /**
       * Clear the scroll loop
       */
      scrollStop: function () {
        if (this.options.largeDeviceSmoothScroll) {
          clearTimeout(this.scrollInterval);
        }
        return this;
      },

      /**
       * Save the selected date/time
       * @param  {string} type  Date or time
       * @param  {string} value Date or time value
       */
      updateSelection: function (type, value) {
        this.selectedDateAndTime[type] = value;
        return this;
      },

      /**
       * Reset the selected data and time
       */
      clearSelectedDate: function () {
        this.selectedDateAndTime = {};
        return this;
      },

      /**
       * Return the user's selected date and time
       * @return {objecty} Object containing date and time information
       */
      getSelectedDateAndTime: function () {
        return this.selectedDateAndTime;
      },

      /**
       * Clear the form inputs
       */
      clearInputs: function () {
        var date, time;
        date = this.getNode('input[name="' + this.options.formInputDate + '"]', true);
        time = this.getNode('input[name="' + this.options.formInputTime + '"]', true);
        date.val('');
        time.val('');
        return this;
      },

      /**
       * Add the chosen date to the form input fields.
       */
      addDateToInputField: function () {
        var date, time, datetime;
        datetime = this.getSelectedDateAndTime();
        date = this.getNode('input[name="' + this.options.formInputDate + '"]', true);
        time = this.getNode('input[name="' + this.options.formInputTime + '"]', true);
        if (datetime.date) {
          date.val(datetime.date);
        } else {
          date.val('');
        }
        if (datetime.time) {
          time.val(datetime.time);
        } else {
          time.val('');
        }
        return this;
      },

      /**
       * This is a revealing module and as such we can limit its API to
       * whatever methods we choose.
       * @return {object} API methods
       */
      revealAPI: function () {
        return {
          init: this.init.bind(this),
          getSelectedDateAndTime: this.getSelectedDateAndTime.bind(this)
        };
      }

    };

    $(function () {

      /**
       * All DOM work is confined to the application node context
       */
      DatePicker.applicationNode

        .on('click', '.direction.on', function () {
          DatePicker.calculateDatePicker({
            month: $(this).data('month'),
            year: $(this).data('year')
          });
        })

        .on('click', '.datepicker-day', function () {
          var date = $(this).data('date');
          DatePicker
            .changeDateInDatePicker(date)
            .updateSelection('date', date)
            .changeDateInSelect(date);
        })

        .on('click', '.datetime', function () {
          var time = $(this).data('time');
          DatePicker
            .changeTimeInDatePicker(time)
            .updateSelection('time', time)
            .changeTimeInSelect(time);
        })

        .on('mousedown', '.scrollbar.up', function () {
          if ($(this).hasClass('active')) {
            DatePicker.scrollStart('up');
          }
        })

        .on('mousedown', '.scrollbar.down', function () {
          if ($(this).hasClass('active')) {
            DatePicker.scrollStart('down');
          }
        })

        .on('mouseup', '.scrollbar.up, .scrollbar.down', function () {
          DatePicker.scrollStop();
        })

        .on('click', '.icon-calendar', function () {
          DatePicker.toggleDatePicker();
        })

        .on('change', '.availabledates', function () {
          var date = DatePicker.getNode('.availabledates option:selected').data('date');
          DatePicker
            .updateSelection('date', date)
            .changeDateInDatePicker(date);
        })

        .on('change', '.availabletimes', function () {
          var time = DatePicker.getNode('.availabletimes option:selected').data('time');
          DatePicker
            .updateSelection('time', time)
            .changeTimeInDatePicker(time);
        })

        .on('click', '.adddate', function () {
          DatePicker.addDateToInputField();
        });

    });

    return DatePicker.revealAPI();

  }

  /**
   * Exports for browserify, requireJS and as a namespaced module.
   * @type {[type]}
   */
  if (typeof exports === 'object') {
    module.exports = defineModule(global.jQuery);
  } else if (typeof define === 'function' && define.amd) {
    define([global.jQuery], defineModule);
  } else {
    global.DatePicker = defineModule(global.jQuery);
  }

}(this);
