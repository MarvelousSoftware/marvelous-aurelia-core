System.register(['aurelia-dependency-injection', 'aurelia-pal-browser', './optionsReader'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var aurelia_dependency_injection_1, aurelia_pal_browser_1, optionsReader_1;
    return {
        setters:[
            function (aurelia_dependency_injection_1_1) {
                aurelia_dependency_injection_1 = aurelia_dependency_injection_1_1;
            },
            function (aurelia_pal_browser_1_1) {
                aurelia_pal_browser_1 = aurelia_pal_browser_1_1;
            },
            function (optionsReader_1_1) {
                optionsReader_1 = optionsReader_1_1;
            }],
        execute: function() {
            describe('DOMSettingsReader', function () {
                var factory;
                beforeEach(function () {
                    aurelia_pal_browser_1.initialize();
                    new aurelia_dependency_injection_1.Container().makeGlobal();
                    factory = aurelia_dependency_injection_1.Container.instance.get(optionsReader_1.OptionsReaderFactory);
                });
                function getHTMLElement(html) {
                    var wrapper = document.createElement('div');
                    wrapper.innerHTML = html;
                    return wrapper.firstElementChild;
                }
                describe('get method', function () {
                    it('should be able to evaluate', function () {
                        var reader = factory.create({}, getHTMLElement('<m-component><components><pagination size="20"></pagination></components></m-component>'));
                        expect(reader.get('components pagination').get('size').evaluate()).toBe('20');
                    });
                    it('should point to proper element', function () {
                        var html = getHTMLElement('<m-component><components><pagination size="20"></pagination></components></m-component>');
                        var reader = factory.create({}, html);
                        expect(reader.get('components').element).toBe(html.querySelector('components'));
                    });
                    it('should use dom based options if code based are not available', function () {
                        var codeBased = { dataSource: { mode: 'serverSide' } };
                        var domBased = getHTMLElement('<m-component><columns><column name="foo"></column></columns></m-component>');
                        var reader = factory.create({}, domBased);
                        var columns = reader.getAll('columns column');
                        expect(columns.length).toBe(1);
                        expect(columns[0].get('name').evaluate()).toBe('foo');
                    });
                    it('should allow to be nested', function () {
                        var reader = factory.create({}, getHTMLElement('<m-component><components><pagination size="20"></pagination></components></m-component>'));
                        expect(reader.get('components').get('pagination').get('size').evaluate()).toBe('20');
                    });
                    it('should allow to evaluate attribute directly', function () {
                        var reader = factory.create({}, getHTMLElement('<m-component><components><pagination size="20"></pagination></components></m-component>'));
                        expect(reader.get('components pagination size').evaluate()).toBe('20');
                    });
                    it('should evaluate to undefined if element in provided path is not defined', function () {
                        var reader = factory.create({}, getHTMLElement('<m-component><components><pagination></pagination></components></m-component>'));
                        expect(reader.get('components pagination').get('size').evaluate()).toBeUndefined();
                        reader = factory.create({}, getHTMLElement('<m-component><components></components></m-component>'));
                        expect(reader.get('components pagination').evaluate()).toBeUndefined();
                        reader = factory.create({}, getHTMLElement('<m-component></m-component>'));
                        expect(reader.get('components').evaluate()).toBeUndefined();
                        reader = factory.create({}, getHTMLElement('<m-component></m-component>'));
                        expect(reader.get('components').get('pagination').evaluate()).toBeUndefined();
                    });
                    it('should be able to work with aurelia binding', function () {
                        var reader = factory.create({ value: 30 }, getHTMLElement('<m-component><pagination size.bind="value"></pagination></m-component>'));
                        expect(reader.get('pagination').get('size').evaluate()).toBe(30);
                        reader = factory.create({ value: 10 }, getHTMLElement('<m-component><pagination size.one-time="value"></pagination></m-component>'));
                        expect(reader.get('pagination').get('size').evaluate()).toBe(10);
                    });
                    it('should support empty attributes', function () {
                        var reader = factory.create({}, getHTMLElement('<m-component><pagination enabled></pagination></m-component>'));
                        expect(reader.get('pagination').get('enabled').evaluate()).toBe(true);
                    });
                    it('should evaluate code based options', function () {
                        var codeBased = { size: 20 };
                        var reader = factory.create({}, getHTMLElement('<m-component></m-component>'), codeBased);
                        expect(reader.get('size').evaluate()).toBe(20);
                    });
                    it('should evaluate nested code based options', function () {
                        var codeBased = { pagination: { size: 20 } };
                        var reader = factory.create({}, getHTMLElement('<m-component></m-component>'), codeBased);
                        expect(reader.get('pagination').get('size').evaluate()).toBe(20);
                        expect(reader.get('pagination size').evaluate()).toBe(20);
                    });
                    it('should have higher priority for code based options', function () {
                        var codeBased = { pagination: { size: 20 } };
                        var reader = factory.create({ value: 30 }, getHTMLElement('<m-component><pagination size.bind="value"></pagination></m-component>'), codeBased);
                        expect(reader.get('pagination').get('size').evaluate()).toBe(20);
                        expect(reader.get('pagination size').evaluate()).toBe(20);
                    });
                    it('should allow to travel from code based to dom based', function () {
                        var codeBased = { pagination: {} };
                        var reader = factory.create({ value: 30 }, getHTMLElement('<m-component><pagination size.bind="value"></pagination></m-component>'), codeBased);
                        expect(reader.get('pagination').get('size').evaluate()).toBe(30);
                    });
                    it('should throw on one-way and two-way bindings', function () {
                        expect(function () {
                            factory.create({}, getHTMLElement('<m-component><pagination size.one-way="value"></pagination></m-component>'))
                                .get('pagination size');
                        }).toThrowError('one-way and two-way bindings are not allowed in the options definition.');
                        expect(function () {
                            factory.create({}, getHTMLElement('<m-component><pagination size.two-way="value"></pagination></m-component>'))
                                .get('pagination size');
                        }).toThrowError('one-way and two-way bindings are not allowed in the options definition.');
                    });
                    it('should throw on node evaluation', function () {
                        expect(function () {
                            factory.create({}, getHTMLElement('<m-component><pagination></pagination></m-component>'))
                                .get('pagination').evaluate();
                        }).toThrowError("PAGINATION cannot be evaluated, because it is a node. Only attributes are evaluable.");
                    });
                    it('should allow to use dash-case notation in dom based options', function () {
                        var reader = factory.create({}, getHTMLElement('<m-component><foo-bar some-value="10"></foo-bar></m-component>'));
                        expect(reader.get('foo-bar some-value').evaluate()).toBe('10');
                    });
                    it('should allow to use dash-case notation in code based options', function () {
                        var codeBased = { fooBar: { someValue: 20 } };
                        var reader = factory.create({}, getHTMLElement('<m-component></m-component>'), codeBased);
                        expect(reader.get('foo-bar').get('some-value').evaluate()).toBe(20);
                        expect(reader.get('foo-bar some-value').evaluate()).toBe(20);
                    });
                });
                describe('defined property', function () {
                    it('should be true in case of existing nodes', function () {
                        var reader = factory.create({}, getHTMLElement('<m-component><components><pagination size="20"></pagination></components></m-component>'));
                        expect(reader.get('components').defined).toBe(true);
                        expect(reader.get('components pagination').defined).toBe(true);
                    });
                    it('should be false in case of non existing nodes and attributes', function () {
                        var reader = factory.create({}, getHTMLElement('<m-component><components></components></m-component>'));
                        expect(reader.get('foo').defined).toBe(false);
                        expect(reader.get('components foo').defined).toBe(false);
                    });
                    it('should throw in case of empty selector', function () {
                        var reader = factory.create({}, getHTMLElement('<m-component><foo></foo></m-component>'));
                        expect(function () { reader.get(''); }).toThrowError("Empty selector for M-COMPONENT element.");
                        expect(function () { reader.get('foo').get(''); }).toThrowError("Empty selector for FOO element.");
                    });
                });
                describe('getAll method', function () {
                    it('should resolve all elements', function () {
                        var reader = factory.create({}, getHTMLElement('<m-component><foo><bar value="1"></bar><bar value="2"></bar><bar value="3"></bar></foo></m-component>'));
                        var options = reader.getAll('foo bar');
                        expect(options.length).toBe(3);
                        expect(options[0].get('value').evaluate()).toBe('1');
                        expect(options[1].get('value').evaluate()).toBe('2');
                        expect(options[2].get('value').evaluate()).toBe('3');
                    });
                    it('should allow nesting', function () {
                        var reader = factory.create({}, getHTMLElement('<m-component><foo><bar value="1"></bar><bar value="2"></bar><bar value="3"></bar></foo></m-component>'));
                        var options = reader.get('foo').getAll('bar');
                        expect(options.length).toBe(3);
                        expect(options[0].get('value').evaluate()).toBe('1');
                        expect(options[1].get('value').evaluate()).toBe('2');
                        expect(options[2].get('value').evaluate()).toBe('3');
                    });
                    it('should work with binding', function () {
                        var reader = factory.create({ first: 10, second: 20, third: 30 }, getHTMLElement('<m-component><foo><bar value.bind="first"></bar><bar value.bind="second"></bar><bar value.one-time="third"></bar></foo></m-component>'));
                        var options = reader.get('foo').getAll('bar');
                        expect(options.length).toBe(3);
                        expect(options[0].get('value').evaluate()).toBe(10);
                        expect(options[1].get('value').evaluate()).toBe(20);
                        expect(options[2].get('value').evaluate()).toBe(30);
                    });
                    it('should support code based options', function () {
                        var codeBased = { foo: [{ value: 40 }, { value: 50 }] };
                        var reader = factory.create({ first: 10, second: 20, third: 30 }, getHTMLElement('<m-component></m-component>'), codeBased);
                        var options = reader.get('foo').getAll('bar');
                        expect(options.length).toBe(2);
                        expect(options[0].get('value').evaluate()).toBe(40);
                        expect(options[1].get('value').evaluate()).toBe(50);
                        options = reader.getAll('foo bar');
                        expect(options.length).toBe(2);
                        expect(options[0].get('value').evaluate()).toBe(40);
                        expect(options[1].get('value').evaluate()).toBe(50);
                    });
                    it('should have higher priority for code based options', function () {
                        var codeBased = { foo: [{ value: 40 }, { value: 50 }] };
                        var reader = factory.create({ first: 10, second: 20, third: 30 }, getHTMLElement('<m-component><foo><bar value.bind="first"></bar><bar value.bind="second"></bar><bar value.one-time="third"></bar></foo></m-component>'), codeBased);
                        var options = reader.get('foo').getAll('bar');
                        expect(options.length).toBe(2);
                        expect(options[0].get('value').evaluate()).toBe(40);
                        expect(options[1].get('value').evaluate()).toBe(50);
                    });
                    it('should throw in case of array item evaluation', function () {
                        var codeBased = { foo: [{ value: 40 }, { value: 50 }] };
                        var reader = factory.create({}, getHTMLElement('<m-component></m-component>'), codeBased);
                        var options = reader.get('foo').getAll('bar');
                        expect(function () { return options[0].evaluate(); }).toThrowError("Array item cannot be evaluated. Only properties are evaluable.");
                    });
                    it('should throw in case of attribute', function () {
                        var reader = factory.create({}, getHTMLElement('<m-component><foo value="10"></foo></m-component>'));
                        expect(function () { reader.get('foo value').getAll('bar'); }).toThrowError("Attribute cannot have any nested options.");
                    });
                    it('should throw in case of empty selector', function () {
                        var reader = factory.create({}, getHTMLElement('<m-component><foo></foo></m-component>'));
                        expect(function () { reader.getAll(''); }).toThrowError("Empty selector for M-COMPONENT element.");
                        expect(function () { reader.get('foo').getAll(''); }).toThrowError("Empty selector for FOO element.");
                    });
                });
                describe('getAllProperties method', function () {
                    it('should allow to get properties from node', function () {
                        var reader = factory.create({ first: 10 }, getHTMLElement('<m-component><bar><foo value.bind="first" other="20"></foo></bar></m-component>'));
                        var props = reader.get('bar').get('foo').getAllProperties();
                        expect(props.length).toBe(2);
                        expect(props[0].evaluate()).toBe(10);
                        expect(props[0].name).toBe('value');
                        expect(props[1].evaluate()).toBe('20');
                        expect(props[1].name).toBe('other');
                    });
                    it('should allow to get properties from node even when code based are defined', function () {
                        var codeBased = { test: 1 };
                        var reader = factory.create({ first: 10 }, getHTMLElement('<m-component><bar><foo value.bind="first" other="20"></foo></bar></m-component>'), codeBased);
                        var props = reader.get('bar').get('foo').getAllProperties();
                        expect(props.length).toBe(2);
                        expect(props[0].evaluate()).toBe(10);
                        expect(props[0].name).toBe('value');
                        expect(props[1].evaluate()).toBe('20');
                        expect(props[1].name).toBe('other');
                    });
                    it('should allow to get properties from node even when code based are defined and getAll is used', function () {
                        var codeBased = { test: 1 };
                        var reader = factory.create({ first: 10 }, getHTMLElement('<m-component><bar><foo value.bind="first" other="20"></foo></bar></m-component>'), codeBased);
                        var props = reader.getAll('bar foo').map(function (x) { return x.getAllProperties(); });
                        expect(props.length).toBe(1);
                        expect(props[0].length).toBe(2);
                        expect(props[0][0].evaluate()).toBe(10);
                        expect(props[0][0].name).toBe('value');
                        expect(props[0][1].evaluate()).toBe('20');
                        expect(props[0][1].name).toBe('other');
                    });
                    it('should allow to get properties from code based option', function () {
                        var codeBased = { bar: { foo: { value: 10, other: 20 } } };
                        var reader = factory.create({}, getHTMLElement('<m-component></m-component>'), codeBased);
                        var props = reader.get('bar').get('foo').getAllProperties();
                        expect(props.length).toBe(2);
                        expect(props[0].evaluate()).toBe(10);
                        expect(props[0].name).toBe('value');
                        expect(props[1].evaluate()).toBe(20);
                        expect(props[1].name).toBe('other');
                    });
                    it('should return empty in case of undefined option', function () {
                        var codeBased = {};
                        var reader = factory.create({}, getHTMLElement('<m-component></m-component>'), codeBased);
                        var props = reader.get('foo').getAllProperties();
                        expect(props).toEqual([]);
                    });
                    it('should throw when invoked on attribute', function () {
                        var reader = factory.create({}, getHTMLElement('<m-component><bar foo="1"></bar></m-component>'));
                        expect(function () { return reader.get('bar').get('foo').getAllProperties(); }).toThrowError('Attribute cannot have any property.');
                    });
                });
            });
        }
    }
});
