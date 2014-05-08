/*global describe, it */
'use strict';
(function () {

  describe('DatePicker', function () {

    describe('toType', function () {

      var spy = sinon.spy(DatePicker, 'toType');

      DatePicker.toType({});
      DatePicker.toType([]);
      DatePicker.toType('test');
      DatePicker.toType(10);
      DatePicker.toType(undefined);

      it('should accept an object and output "object"', function () {
        var call = spy.getCall(0);
        var args = call.args[0];
        var out = call.returnValue;
        expect(args).to.be.an('object');
        expect(out).to.equal('object');
      });

      it('should accept an array and output "array"', function () {
        var call = spy.getCall(1);
        var args = call.args[0];
        var out = call.returnValue;
        expect(args).to.be.an('array');
        expect(out).to.equal('array');
      });

      it('should accept a string and output "string"', function () {
        var call = spy.getCall(2);
        var args = call.args[0];
        var out = call.returnValue;
        expect(args).to.be.a('string');
        expect(out).to.equal('string');
      });

      it('should accept a number and output "number"', function () {
        var call = spy.getCall(3);
        var args = call.args[0];
        var out = call.returnValue;
        expect(args).to.be.a('number');
        expect(out).to.equal('number');
      });

      // domwindow is required in this test due to a perculiarity of phantomJS
      // http://lfhck.com/question/294934/why-are-null-and-undefined-of-the-type-domwindow
      it('should accept undefined || domwindow and output "undefined"', function () {
        var call = spy.getCall(4);
        var args = call.args[0];
        var out = call.returnValue;
        expect(args).to.be.a('undefined');
        expect(out).to.equal('undefined');
      });


    });

  });

})();
