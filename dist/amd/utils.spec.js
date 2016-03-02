System.register(['./utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils_1;
    var Test;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }],
        execute: function() {
            Test = (function () {
                function Test() {
                }
                return Test;
            }());
            describe('Utils', function () {
                describe('property method', function () {
                    it('should get property from expression', function () {
                        expect(utils_1.Utils.property(function (x) { return x.foo; })).toBe('foo');
                        expect(utils_1.Utils.property(function (x) { return x['foo']; })).toBe('foo');
                        expect(utils_1.Utils.property(function (test) { return test.bar; })).toBe('bar');
                        expect(utils_1.Utils.property(function (foo) { return foo.bar; })).toBe('bar');
                        expect(utils_1.Utils.property(function (foo) { return foo.bar; })).toBe('bar');
                        expect(utils_1.Utils.property(function (foo) { return foo['bar']; })).toBe('bar');
                        expect(utils_1.Utils.property("function(foo){return foo.bar}")).toBe('bar');
                    });
                });
            });
        }
    }
});
