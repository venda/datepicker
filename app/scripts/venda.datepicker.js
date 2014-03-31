/*!
 * Venda Datepicker
 * Copyright Venda 2014.
 */
!function (global) {
  'use strict';

  function defineModule(Venda, $) {

    var Datepicker;

    Datepicker = {

      template: {
        wrapper: [
          '#{header}',
          '<div class="wrapper">',
          '<div class="datepicker">#{datepicker}</div>',
          '<div class="times">',
          '<div class="scrollbar up"><i class="fa fa-caret-up"></i></div>',
          '<div class="scrolly">#{times}</div>',
          '<div class="scrollbar down"><i class="fa fa-caret-down"></i></div>',
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
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

      options: {
        region: 'england-and-wales',
        makeBankHolidaysInactive: true,
        datepickerContainer: '.container',
        selectContainer: '.select',
        hideSelectsOnDatePicker: false,
        nextDayDelivery: true,
        nddCutoffTime: 15,
        useRange: true,
        highlightWeekends: true,
        rangeInDays: 14,
        firstDayDiff: 1,
        largeDeviceSmoothScroll: true,
        scrollSpeed: 80,
        timeSeparationInMinutes: 30,
        showTimes: true,
        startHour: 9,
        endHour: 22
      },

      init: function (options) {
        this
          .setOptions(options)
          .loadBankHolidays()
          .getNow()
          .createTimeArray()
          .createTimeList()
          .calculateDatepicker();
        return this;
      },

      loadBankHolidays: function () {
        var _this = this;
        $.getJSON('scripts/uk-bank-holidays.json', function (data) {
          var events = data[_this.options.region].events;
          for (var i = 0, l = events.length; i < l; i++) {
            _this.bankHolidays.push(events[i].date);
          }
        });
        return this;
      },

      changeDateInDatepicker: function (date) {
        $('.datepicker-day').removeClass('clicked');
        $('.datepicker-day[data-date="' + date + '"]').addClass('clicked');
        return this;
      },

      changeDateInSelect: function (date) {
        $('option[data-date="' + date + '"]').prop('selected', 'selected');
        return this;
      },

      changeTimeInDatepicker: function (time) {
        $('.datetime').removeClass('clicked');
        $('.datetime[data-time="' + time + '"]').addClass('clicked');
        return this;
      },

      changeTimeInSelect: function (time) {
        $('option[data-time="' + time + '"]').prop('selected', 'selected');
        return this;
      },

      getHeader: function (size) {
        return util.applyTemplate(this.template.header, this.getHeaderObj(size));
      },

      getDateSelect: function () {
        var option, optionTmpl, options, day, html;
        optionTmpl = this.template.optionDate.join('');
        options = [];
        for (var i = 0, l = this.selectDates.length; i < l; i++) {
          day = this.selectDates[i].split(' ')[1];
          option = optionTmpl
            .replace('#{name}', this.selectDates[i])
            .replace('#{value}', this.getShortDate(day), 'gi');
          options.push(option);
        }
        html = util.applyTemplate(this.template.selectDate, {
          options: options.join('')
        });
        this.selectDates = [];
        return html;
      },

      getTimeSelect: function () {
        var html, options, thisTime, optionTmpl, option;
        options = [];
        optionTmpl = this.template.optionTime.join('');
        for (var i = 0, l = this.timeArray.length; i < l; i++) {
          thisTime = this.timeArray[i];
          option = optionTmpl
            .replace('#{value}', thisTime.hr + ':' + thisTime.mi, 'g')
            .replace('#{time}', thisTime.hr + '' + thisTime.mi);
          options.push(option);
        }
        html = util.applyTemplate(this.template.selectTime, {
          options: options.join('')
        });
        return html;
      },

      generateOneLiner: function () {
        var header, daySelect, timeSelect, addDate;
        header = this.getHeader('small');
        daySelect = this.getDateSelect();
        timeSelect = this.getTimeSelect();
        addDate = this.template.addDate.join('');
        if (this.options.showTimes) {
          this.html.select = header + daySelect + timeSelect + addDate;
        } else {
          this.html.select = header + daySelect + addDate;
        }
        return this;
      },

      toggleDatepicker: function () {
        if (this.isVisble) {
          $(this.options.datepickerContainer).hide();
          if (this.options.hideSelectsOnDatePicker) { $('.mini').show(); }
        } else {
          $(this.options.datepickerContainer).show();
          this.initTimeBar();
          if (this.options.hideSelectsOnDatePicker) { $('.mini').hide(); }
        }
        this.isVisble = !this.isVisble;
        return this;
      },

      formatTime: function (time) {
        return time.substr(0, 2) + ':' + time.substr(2, 2);
      },

      setOptions: function (options) {
        this.options = $.extend(this.options, options);
        return this;
      },

      calculateDatepicker: function (obj) {
        this
          .clearSelectedDate()
          .getCurrent(obj)
          .getPrevious()
          .getNext()
          .doChecks()
          .generateDatepickerHTML()
          .generateOneLiner()
          .writeHTML()
          .updateElements()
          .initTimeBar();
        return this;
      },

      initTimeBar: function () {
        if (this.options.showTimes) { this.toggleScrollbarHighlight(); }
        return this;
      },

      buildDateObj: function (date) {
        return {
          date: date,
          day: date.getDate(),
          month: date.getMonth(),
          shortYear: date.getYear(),
          fullYear: date.getFullYear()
        };
      },

      getNow: function () {
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        this.dates.now = this.buildDateObj(date);
        return this;
      },

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

      getPrevious: function () {
        var date = new Date(this.dates.current.fullYear, this.dates.current.month, 1);
        date.setMonth(date.getMonth() - 1);
        this.dates.previous = this.buildDateObj(date);
        return this;
      },

      getNext: function () {
        var date = new Date(this.dates.current.fullYear, this.dates.current.month, 1);
        date.setMonth(date.getMonth() + 1);
        this.dates.next = this.buildDateObj(date);
        return this;
      },

      getDaysInMonth: function (month, year) {
        return [
          31,
          (this.isLeapYear(year) ? 29 : 28),
          31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ][month];
      },

      isLeapYear: function (year) {
        return (0 === year % 400)
          || ((0 === year % 4) && (0 !== year % 100))
          || (0 === year);
      },

      getDayLabels: function () {
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      },

      getMonthLabel: function (i) {
        return [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ][i];
      },

      rearrangeLabels: function () {
        var labels, first, second;
        labels = this.getDayLabels();
        first = labels.slice(this.options.firstDayDiff, labels.length);
        second = labels.slice(0, this.options.firstDayDiff);
        return first.concat(second);
      },

      getDays: function () {
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

      generateDatepickerHTML: function () {
        var obj, headerHTML;
        headerHTML = this.getHeader('large');
        obj = {
          header: headerHTML,
          datepicker: this.generateDatepicker()
        };
        if (this.options.showTimes) { obj.times = this.html.timeList; }
        this.html.all = util.applyTemplate(this.template.wrapper, obj);
        return this;
      },

      writeHTML: function () {
        $(this.options.selectContainer).html(this.html.select);
        $(this.options.datepickerContainer).html(this.html.all);
        return this;
      },

      updateElements: function () {
        if (this.checks.isNowMonth) {
          this.toggleHeaderButton('.previous');
        }
        if (!this.options.showTimes) {
          $('.times').remove();
          $('.datepicker').css('borderRight', '0');
          $('.monthyear.large').width('199');
          $('.direction.large').width('70');
        }
        if (this.options.useRange) {
          if (this.disableNextButton()) {
            this.toggleHeaderButton('.next');
          }
        }
        return this;
      },

      toggleHeaderButton: function (selector) {
        $('.header').find(selector).removeClass('on');
        return this;
      },

      disableNextButton: function () {
        return this.dates.current.day
          + this.options.rangeInDays <= this.getDaysInMonth(this.dates.current.month);
      },

      doChecks: function () {
        this
          .isNowYear()
          .isNowMonth();
        return this;
      },

      isNowYear: function () {
        this.checks.isNowYear = this.dates.current.fullYear === this.dates.now.fullYear;
        return this;
      },

      isNowMonth: function () {
        this.checks.isNowMonth = this.checks.isNowYear &&
          this.dates.current.month === this.dates.now.month;
        return this;
      },

      isToday: function (day) {
        return this.checks.isNowMonth && day === this.dates.now.day;
      },

      isPreviousDay: function (day) {
        return this.checks.isNowYear
          && this.checks.isNowMonth
          && day < this.dates.now.day;
      },

      hasInactiveDates: function () {
        return this.options.inactive.dates.length > 0 ? true : false;
      },

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

      getShortDate: function (day) {
        return util.applyTemplate('#{year}-#{month}-#{day}', {
          year: this.dates.current.fullYear,
          month: this.padNumber(this.dates.current.month),
          day: this.padNumber(day)
        });
      },

      getLongDate: function (day) {
        var date, dayName, month;
        date = new Date(this.dates.current.fullYear, this.dates.current.month, day);
        day = date.getDate();
        dayName = this.days[date.getDay()];
        month = this.getMonthLabel(date.getMonth());
        return dayName + ' ' + day;
      },

      collateDatesForSelect: function (day) {
        var date = this.getLongDate(day);
        this.selectDates.push(date);
        return this;
      },

      padNumber: function (x) {
        return x.toString().length === 1 ? '0' + x : x;
      },

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

      datepickerShowsCurrentMonthAndYear: function () {
        return this.dates.current.year === this.dates.now.year &&
          this.dates.current.month === this.dates.now.month;
      },

      isNextDayDeliveryPossible: function (day) {
        return (this.options.nextDayDelivery &&
          new Date().getHours() < this.options.nddCutoffTime)
          ? true
          : false;
      },

      isWeekendDay: function (firstDay, day) {
        var date = new Date(this.dates.current.fullYear, this.dates.current.month, day).getDay();
        if (firstDay.getDay() === 0 && this.options.firstDayDiff !== 0) {
          return date % 6 === 0 || date % 7 === 0 ? true : false;
        } else {
          return date === 0 || date === 6 ? true : false;
        }
      },

      getDifferenceBetweenDates: function (a, b) {
        var utc1, utc2, msPerDay;
        msPerDay = 1000 * 60 * 60 * 24;
        utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
        return Math.floor((utc2 - utc1) / msPerDay);
      },

      isLastDayInMonth: function (day) {
        return day === this.getDaysInMonth(this.dates.current.month, this.dates.current.year);
      },

      isFirstDayInMonth: function (day) {
        return day === 1;
      },

      createDate: function (year, month, day) {
        return new Date(year, month, day);
      },

      isNextDay: function (day) {
        var now, current;
        if (this.isFirstDayInMonth(day)) {
          current = this.createDate(this.dates.current.fullYear, this.dates.current.month, day);
          now = this.createDate(this.dates.now.fullYear, this.dates.now.month, this.dates.now.day);
          return current.getDay() - now.getDay() === 1;
        } else {
          return this.datepickerShowsCurrentMonthAndYear() &&
            day - this.dates.current.day === 1;
        }
      },

      isWithinRange: function (day) {
        var todayDate, nowDate, diff;
        todayDate = new Date(this.dates.current.fullYear, this.dates.current.month, day);
        nowDate = this.dates.now.date;
        diff = this.getDifferenceBetweenDates(nowDate, todayDate);
        return diff <= this.options.rangeInDays;
      },

      generateDatepicker: function () {

        var tdClass, firstDay, startingDay, monthLength, html, day,
            isDatepickerDay, week, shortdate, isInactiveDay;

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
            isDatepickerDay = (day <= monthLength && (i > 0 || j >= startingDay));
            shortdate = this.getShortDate(day);
            isInactiveDay = this.hasInactiveDates() && this.isInactive(day);

            if (isDatepickerDay) {

              if (this.isToday(day)) {
                tdClass.push('today');
              } else if (this.isPreviousDay(day)) {
                tdClass.push('pastday');
              } else if (isInactiveDay
                || (this.isNextDay(day) && !this.isNextDayDeliveryPossible(day))) {
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

              if (isInactiveDay
                || (this.isNextDay(day) && !this.isNextDayDeliveryPossible(day))
                || (this.options.makeBankHolidaysInactive && this.bankHolidays.indexOf(shortdate) > -1)
                ) {
                html.push('<td class="', tdClass.join(' '), '">', 'X', '</td>');
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

        return util.applyTemplate(this.template.datepicker, {
          daynames: this.getDays(),
          days: html.join('')
        });

      },

      toggleScrollbarHighlight: function () {
        var $wrapper, pos, scrollHeight, height, $up, $down;
        $wrapper = $('.scrolly');
        pos = $wrapper.scrollTop();
        $up = $('.scrollbar.up');
        $down = $('.scrollbar.down');
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

      scrollListContent: function (direction) {
        var pos, $wrapper, speed;
        $wrapper = $('.scrolly');
        pos = $wrapper.scrollTop();
        speed = this.options.scrollSpeed;
        $wrapper.scrollTop(direction === 'up' ? pos - speed : pos + speed);
        this.toggleScrollbarHighlight();
        return this;
      },

      scrollStart: function (direction) {
        var _this = this;
        if (['mobile', 'tablet'].contains(this.device) || !this.options.largeDeviceSmoothScroll) {
          this.scrollListContent(direction);
        } else {
          (function scroller() {
            _this.scrollListContent(direction);
            _this.scrollInterval = setTimeout(scroller, 100);
          }());
        }
        return this;
      },

      scrollStop: function () {
        if (this.options.largeDeviceSmoothScroll) {
          clearTimeout(this.scrollInterval);
        }
        return this;
      },

      updateSelection: function (type, value) {
        this.selectedDateAndTime[type] = value;
        if (!this.options.showTimes
            && this.selectedDateAndTime.date
            || this.options.showTimes
            && this.selectedDateAndTime.date
            && this.selectedDateAndTime.time) {
          this.showSelectedDate();
        }
        if (!this.options.showTimes && this.selectedDateAndTime.date) {
          this.showSelectedDate();
        }
        return this;
      },

      clearSelectedDate: function () {
        this.selectedDateAndTime = {};
        $('.message').html('');
        return this;
      },

      showSelectedDate: function () {
        var dateTime;
        if (this.options.showTimes) {
          dateTime = this.selectedDateAndTime.date + ' ' + this.selectedDateAndTime.time;
        } else {
          dateTime = this.selectedDateAndTime.date;
        }
        return this;
      },

      getSelectedDateAndTime: function () {
        return this.selectedDateAndTime;
      },

      revealAPI: function () {
        return {
          init: this.init.bind(this),
          getSelectedDateAndTime: this.getSelectedDateAndTime.bind(this)
        };
      }

    };

    $(function () {

      $('body').on('click', '.direction.on', function () {
        Datepicker.calculateDatepicker({
          month: $(this).data('month'),
          year: $(this).data('year')
        });
      });

      $(Datepicker.options.datepickerContainer).on('click', '.datepicker-day', function () {
        var date = $(this).data('date');
        Datepicker
          .changeDateInDatepicker(date)
          .updateSelection('date', date)
          .changeDateInSelect(date);
      });

      $(Datepicker.options.datepickerContainer).on('click', '.datetime', function () {
        var time = $(this).data('time');
        Datepicker
          .changeTimeInDatepicker(time)
          .updateSelection('time', time)
          .changeTimeInSelect(time);
      });

      $(Datepicker.options.datepickerContainer).on('mousedown', '.scrollbar.up', function () {
        if ($(this).hasClass('active')) {
          Datepicker.scrollStart('up');
        }
      });

      $(Datepicker.options.datepickerContainer).on('mousedown', '.scrollbar.down', function () {
        if ($(this).hasClass('active')) {
          Datepicker.scrollStart('down');
        }
      });

      $(Datepicker.options.datepickerContainer).on('mouseup', '.scrollbar.up, .scrollbar.down', function () {
        Datepicker.scrollStop();
      });

      $('.fa-calendar').click(function () {
        Datepicker.toggleDatepicker();
      });

      $('body').on('change', '.availabledates', function () {
        var date = $('.availabledates option:selected').data('date');
        Datepicker
          .updateSelection('date', date)
          .changeDateInDatepicker(date);
      });

      $('body').on('change', '.availabletimes', function () {
        var time = $('.availabletimes option:selected').data('time');
        Datepicker
          .updateSelection('time', time)
          .changeTimeInDatepicker(time);
      });

    });

    return Datepicker;// Datepicker.revealAPI();

  }

  global.Venda = global.Venda || {};
  global.Venda.Datepicker = defineModule(
    global.Venda,
    global.jQuery
  );

}(this);