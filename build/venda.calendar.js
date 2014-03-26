/*!
 * Venda Calendar
 * Copyright Venda 2014.
 */
!function (global) {
  'use strict';

  function defineModule(Venda, $) {

    var Calendar;

    Calendar = {

      template: {
        wrapper: [
          '#{header}',
          '<div class="wrapper">',
          '<div class="calendar">#{calendar}</div>',
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
        calendar: [
          '<table class="calendar-table">',
          '<thead><tr class="daynames">#{daynames}</tr></thead>',
          '#{days}',
          '</table>'
        ],
        select: [
          '<select class="availabledates">#{options}</select><input type="button" class="go" value="Add date" />'
        ],
        option: [
          '<option data-date="#{value}" value="#{value}">#{name}</option>'
        ]
      },

      html: {},
      dates: {},
      checks: {},
      selectDates: [],
      isVisble: false,
      days: [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday'
      ],

      options: {
        container: '.container',
        nextDayDelivery: false,
        firstDayDiff: 1,
        largeDeviceSmoothScroll: true,
        scrollSpeed: 40,
        timeSeparation: 30,
        showTimes: true
      },

      init: function (options) {
        this
          .setOptions(options)
          .getNow()
          .processDisabledDates()
          .createTimeList()
          .calculateCalendar();
        return this;
      },

      changeDateInCalendar: function (date) {
        $('.calendar-day').removeClass('clicked');
        $('.calendar-day[data-date="' + date + '"]').addClass('clicked');
        return this;
      },

      changeDateInSelect: function (date) {
        $('option[data-date="' + date + '"]').prop('selected', 'selected');
        return this;
      },

      generateSelectHTML: function () {
        var option, optionTmpl, options, day, monthName, header;
        monthName = this.getMonthLabel(this.dates.current.month);
        optionTmpl = this.template.option.join('');
        options = [];
        for (var i = 0, l = this.selectDates.length; i < l; i++) {
          day = this.selectDates[i].split(' ')[1];
          option = optionTmpl
            .replace('#{name}', this.selectDates[i])
            .replace('#{value}', this.getShortDate(day), 'gi');
          options.push(option);
        }
        header = util.applyTemplate(this.template.header, this.getHeaderObj('small'));
        this.html.select = header + util.applyTemplate(this.template.select, {
          options: options.join(''),
          month: monthName
        });
        this.selectDates = [];
        return this;
      },

      toggleCalendar: function () {
        if (this.isVisble) {
          $(this.options.container).hide();
          $('.mini').show();
        } else {
          $(this.options.container).show();
          this.initTimeBar();
          $('.mini').hide();
        }
        this.isVisble = !this.isVisble;
        return this;
      },

      preselectTime: function () {
        var time;
        $(this.options.container)
          .find('.datetime[data-time="' +  this.options.preSelectedTime + '"]')
          .addClass('clicked');
        time = this.options.preSelectedTime.toString();
        this.selectedDate.time = this.formatTime(time);
        return this;
      },

      formatTime: function (time) {
        return time.substr(0, 2) + ':' + time.substr(2, 2);
      },

      setOptions: function (options) {
        this.options = $.extend(this.options, options);
        return this;
      },

      processDisabledDates: function () {
        var date, disabledDate, nowDate;
        for (var i = 0, l = this.options.inactive.dates.length; i < l; i++) {
          date = this.options.inactive.dates[i];
          if (!this.options.inactive.monthsStartAtZero) { date.month = date.month - 1; }
          disabledDate = new Date(date.year, date.month, 0).getTime();
          nowDate = new Date(this.dates.now.fullYear, this.dates.now.month, 0).getTime();
          if (disabledDate < nowDate) {
            this.options.inactive.dates.splice(i, 1);
            i--;
            l--;
          }
        }
        return this;
      },

      calculateCalendar: function (obj) {
        this
          .clearSelectedDate()
          .getCurrent(obj)
          .getPrevious()
          .getNext()
          .doChecks()
          .generateCalendarHTML()
          .generateSelectHTML()
          .writeHTML()
          .updateElements()
          .initTimeBar();
        return this;
      },

      initTimeBar: function () {
        if (this.options.showTimes) { this.toggleScrollbarHighlight(); }
        if (this.options.showTimes && this.options.usePreselectedTime) {
          this.preselectTime();
        }
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

      // Fix for when a direction button is clicked.
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
          html.push('<td class="calendar-header-day">');
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

      generateCalendarHTML: function () {
        var obj, headerHTML;
        headerHTML = util.applyTemplate(this.template.header, this.getHeaderObj('large'));
        obj = {
          header: headerHTML,
          calendar: this.generateCalendar()
        };
        if (this.options.showTimes) { obj.times = this.html.timeList; }
        this.html.all = util.applyTemplate(this.template.wrapper, obj);
        return this;
      },

      writeHTML: function () {
        $(this.options.select).html(this.html.select);
        $(this.options.container).html(this.html.all);
        return this;
      },

      updateElements: function () {
        if (this.checks.isNowMonth) {
          this.toggleHeaderButton('.previous');
        }
        if (!this.options.showTimes) {
          $('.times').remove();
          $('.calendar').css('borderRight', '0');
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

      isInactive: function (day) {
        var disabled, found, current;
        current = this.dates.current;
        found = false;
        for (var i = 0, l = this.options.inactive.dates.length; i < l; i++) {
          disabled = this.options.inactive.dates[i];
          if (day === disabled.day &&
               current.month === disabled.month &&
               current.fullYear === disabled.year) {
            found = true;
            break;
          }
        }
        return found;
      },

      getShortDate: function (day) {
        return util.applyTemplate('#{year}-#{month}-#{day}', {
          year: this.dates.current.fullYear,
          month: this.dates.current.month,
          day: day
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

      createTimeList: function () {
        var startHour, endHour, html, datetime, template, hr, mi;
        startHour = 9;
        endHour = 22;
        html = [];
        template = '<div class="datetime" data-time="#{time}">#{datetime}</div>';
        for (var h = startHour, hl = endHour; h <= hl; h++) {
          for (var m = 0, ml = 60; m < ml; m += this.options.timeSeparation) {
            hr = this.padNumber(h);
            mi = this.padNumber(m);
            datetime = template
              .replace('#{datetime}', hr + ':' + mi)
              .replace('#{time}', hr + '' + mi);
            html.push(datetime);
          }
        }
        this.html.timeList = html.join('');
        return this;
      },

      calendarShowsCurrentMonthAndYear: function () {
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

      isNextDay: function (day) {
        return this.calendarShowsCurrentMonthAndYear() &&
           day - this.dates.current.day === 1;
      },

      isWithinRange: function (day) {
        var todayDate, nowDate, diff;
        todayDate = new Date(this.dates.current.fullYear, this.dates.current.month, day);
        nowDate = this.dates.now.date;
        diff = this.getDifferenceBetweenDates(nowDate, todayDate);
        return diff <= this.options.rangeInDays;
      },

      generateCalendar: function () {

        var tdClass, firstDay, startingDay, monthLength, html, day, i, j,
            isCalendarDay, today, week;

        html = [];
        day = 1;
        week = 1;
        today = this.dates.current.date;
        firstDay = new Date(this.dates.current.fullYear, this.dates.current.month, 1);
        startingDay = firstDay.getDay() - this.options.firstDayDiff;
        if (startingDay === - 1) { startingDay = 6; }
        monthLength = this.getDaysInMonth(this.dates.current.month, this.dates.current.fullYear);

        for (i = 0; i < 9; i++) {

          for (j = 0; j <= 6; j++) {

            tdClass = [];
            isCalendarDay = (day <= monthLength && (i > 0 || j >= startingDay));

            if (isCalendarDay) {

              if (this.isToday(day)) {
                tdClass.push('today');
              } else if (this.isPreviousDay(day)) {
                tdClass.push('pastday');
              } else if (this.isInactive(day)
                || (this.isNextDay(day) && !this.isNextDayDeliveryPossible(day))) {
                tdClass.push('inactive');
              } else if (this.options.useRange && !this.isWithinRange(day)) {
                tdClass.push('outofrange');
              } else {
                tdClass.push('calendar-day');
                this.collateDatesForSelect(day);
              }

              if (this.isWeekendDay(firstDay, day)) {
                tdClass.push('weekend');
              }

              if (this.isInactive(day)
                || (this.isNextDay(day) && !this.isNextDayDeliveryPossible(day))) {
                html.push('<td class="', tdClass.join(' '), '">', 'X', '</td>');
              } else {
                tdClass.push('active');
                html.push('<td data-date="');
                html.push(this.getShortDate(day));
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

        return util.applyTemplate(this.template.calendar, {
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
        this.selectedDate[type] = value;
        if (!this.options.showTimes
            && this.selectedDate.date
            || this.options.showTimes
            && this.selectedDate.date
            && this.selectedDate.time) {
          this.showSelectedDate();
        }
        if (!this.options.showTimes && this.selectedDate.date) {
          this.showSelectedDate();
        }
        return this;
      },

      clearSelectedDate: function () {
        this.selectedDate = {};
        $('.message').html('');
        return this;
      },

      showSelectedDate: function () {
        var dateTime;
        if (this.options.showTimes) {
          dateTime = this.selectedDate.date + ' ' + this.selectedDate.time;
        } else {
          dateTime = this.selectedDate.date;
        }
        //$('.message').html(dateTime);
        return this;
      }

    };

    $(function () {

      $('body').on('click', '.direction.on', function () {
        Calendar.calculateCalendar({
          month: $(this).data('month'),
          year: $(this).data('year')
        });
      });

      $(Calendar.options.container).on('click', '.calendar-day', function () {
        var date = $(this).data('date');
        Calendar
          .changeDateInCalendar(date)
          .updateSelection('date', date)
          .changeDateInSelect(date);
      });

      $(Calendar.options.container).on('click', '.datetime', function () {
        $('.datetime').removeClass('clicked');
        $(this).addClass('clicked');
        Calendar.updateSelection('time', $(this).html());
      });

      $(Calendar.options.container).on('mousedown', '.scrollbar.up', function () {
        if ($(this).hasClass('active')) {
          Calendar.scrollStart('up');
        }
      });

      $(Calendar.options.container).on('mousedown', '.scrollbar.down', function () {
        if ($(this).hasClass('active')) {
          Calendar.scrollStart('down');
        }
      });

      $(Calendar.options.container).on('mouseup', '.scrollbar.up, .scrollbar.down', function () {
        Calendar.scrollStop();
      });

      $('.fa-calendar').click(function () {
        Calendar.toggleCalendar();
      });

      $('body').on('change', '.availabledates', function () {
        var date = $('.availabledates option:selected').data('date');
        Calendar
          .updateSelection('date', date)
          .changeDateInCalendar(date);
      });

    });

    return Calendar;

  }

  global.Venda = global.Venda || {};
  global.Venda.Calendar = defineModule(
    global.Venda,
    global.jQuery
  );

}(this);