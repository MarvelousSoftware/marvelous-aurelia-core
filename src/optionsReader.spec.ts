import {Container} from 'aurelia-dependency-injection';
import {BindingEngine} from 'aurelia-binding';
import {initialize} from 'aurelia-pal-browser';
import {OptionsReaderFactory} from './optionsReader';

describe('DOMSettingsReader', () => {
  let factory: OptionsReaderFactory;
  beforeEach(() => {
    initialize();
    new Container().makeGlobal();
    factory = Container.instance.get(OptionsReaderFactory);
  });

  function getHTMLElement(html: string) {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return <HTMLElement>wrapper.firstElementChild;
  }

  describe('get method', () => {
    it('should be able to evaluate', () => {
      let reader = factory.create({}, getHTMLElement('<m-component><components><pagination size="20"></pagination></components></m-component>'));

      expect(reader.get('components pagination').get('size').evaluate()).toBe('20');
    });

    it('should point to proper element', () => {
      let html = getHTMLElement('<m-component><components><pagination size="20"></pagination></components></m-component>');
      let reader = factory.create({}, html);
      
      expect(reader.get('components').element).toBe(html.querySelector('components'));
    });

    it('should use dom based options if code based are not available', () => {
      let codeBased = { dataSource: { mode: 'serverSide' } };
      let domBased = getHTMLElement('<m-component><columns><column name="foo"></column></columns></m-component>');
      let reader = factory.create({}, domBased);
      
      let columns = reader.getAll('columns column');
      
      expect(columns.length).toBe(1);
      expect(columns[0].get('name').evaluate()).toBe('foo');
    });

    it('should allow to be nested', () => {
      let reader = factory.create({}, getHTMLElement('<m-component><components><pagination size="20"></pagination></components></m-component>'));
      expect(reader.get('components').get('pagination').get('size').evaluate()).toBe('20');
    });

    it('should allow to evaluate attribute directly', () => {
      let reader = factory.create({}, getHTMLElement('<m-component><components><pagination size="20"></pagination></components></m-component>'));
      expect(reader.get('components pagination size').evaluate()).toBe('20');
    });

    it('should evaluate to undefined if element in provided path is not defined', () => {
      let reader = factory.create({}, getHTMLElement('<m-component><components><pagination></pagination></components></m-component>'));
      expect(reader.get('components pagination').get('size').evaluate()).toBeUndefined();

      reader = factory.create({}, getHTMLElement('<m-component><components></components></m-component>'));
      expect(reader.get('components pagination').evaluate()).toBeUndefined();

      reader = factory.create({}, getHTMLElement('<m-component></m-component>'));
      expect(reader.get('components').evaluate()).toBeUndefined();

      reader = factory.create({}, getHTMLElement('<m-component></m-component>'));
      expect(reader.get('components').get('pagination').evaluate()).toBeUndefined();
    });

    it('should be able to work with aurelia binding', () => {
      let reader = factory.create({ value: 30 }, getHTMLElement('<m-component><pagination size.bind="value"></pagination></m-component>'));
      expect(reader.get('pagination').get('size').evaluate()).toBe(30);

      reader = factory.create({ value: 10 }, getHTMLElement('<m-component><pagination size.one-time="value"></pagination></m-component>'));
      expect(reader.get('pagination').get('size').evaluate()).toBe(10);
    });

    it('should support empty attributes', () => {
      let reader = factory.create({}, getHTMLElement('<m-component><pagination enabled></pagination></m-component>'));
      expect(reader.get('pagination').get('enabled').evaluate()).toBe(true);
    });

    it('should evaluate code based options', () => {
      let codeBased = { size: 20 };
      let reader = factory.create({}, getHTMLElement('<m-component></m-component>'), codeBased);
      expect(reader.get('size').evaluate()).toBe(20);
    });

    it('should evaluate nested code based options', () => {
      let codeBased = { pagination: { size: 20 } };
      let reader = factory.create({}, getHTMLElement('<m-component></m-component>'), codeBased);
      expect(reader.get('pagination').get('size').evaluate()).toBe(20);
      expect(reader.get('pagination size').evaluate()).toBe(20);
    });

    it('should have higher priority for code based options', () => {
      let codeBased = { pagination: { size: 20 } };
      let reader = factory.create({ value: 30 }, getHTMLElement('<m-component><pagination size.bind="value"></pagination></m-component>'), codeBased);
      expect(reader.get('pagination').get('size').evaluate()).toBe(20);
      expect(reader.get('pagination size').evaluate()).toBe(20);
    });

    it('should allow to travel from code based to dom based', () => {
      let codeBased = { pagination: {} };
      let reader = factory.create({ value: 30 }, getHTMLElement('<m-component><pagination size.bind="value"></pagination></m-component>'), codeBased);
      expect(reader.get('pagination').get('size').evaluate()).toBe(30);
    });

    it('should throw on one-way and two-way bindings', () => {
      expect(() => {
        factory.create({}, getHTMLElement('<m-component><pagination size.one-way="value"></pagination></m-component>'))
          .get('pagination size');
      }).toThrowError('one-way and two-way bindings are not allowed in the options definition.');

      expect(() => {
        factory.create({}, getHTMLElement('<m-component><pagination size.two-way="value"></pagination></m-component>'))
          .get('pagination size');
      }).toThrowError('one-way and two-way bindings are not allowed in the options definition.');
    });

    it('should throw on node evaluation', () => {
      expect(() => {
        factory.create({}, getHTMLElement('<m-component><pagination></pagination></m-component>'))
          .get('pagination').evaluate();
      }).toThrowError(`PAGINATION cannot be evaluated, because it is a node. Only attributes are evaluable.`);
    });

    it('should allow to use dash-case notation in dom based options', () => {
      let reader = factory.create({}, getHTMLElement('<m-component><foo-bar some-value="10"></foo-bar></m-component>'));
      expect(reader.get('foo-bar some-value').evaluate()).toBe('10');
    });

    it('should allow to use dash-case notation in code based options', () => {
      let codeBased = { fooBar: { someValue: 20 } }
      let reader = factory.create({}, getHTMLElement('<m-component></m-component>'), codeBased);
      expect(reader.get('foo-bar').get('some-value').evaluate()).toBe(20);
      expect(reader.get('foo-bar some-value').evaluate()).toBe(20);
    });
  });

  describe('defined property', () => {
    it('should be true in case of existing nodes', () => {
      let reader = factory.create({}, getHTMLElement('<m-component><components><pagination size="20"></pagination></components></m-component>'));

      expect(reader.get('components').defined).toBe(true);
      expect(reader.get('components pagination').defined).toBe(true);
    });

    it('should be false in case of non existing nodes and attributes', () => {
      let reader = factory.create({}, getHTMLElement('<m-component><components></components></m-component>'));

      expect(reader.get('foo').defined).toBe(false);
      expect(reader.get('components foo').defined).toBe(false);
    });

    it('should throw in case of empty selector', () => {
      let reader = factory.create({}, getHTMLElement('<m-component><foo></foo></m-component>'));

      expect(() => { reader.get('') }).toThrowError(`Empty selector for M-COMPONENT element.`);
      expect(() => { reader.get('foo').get('') }).toThrowError(`Empty selector for FOO element.`);
    });
  });

  describe('getAll method', () => {
    it('should resolve all elements', () => {
      let reader = factory.create({}, getHTMLElement(
        '<m-component><foo><bar value="1"></bar><bar value="2"></bar><bar value="3"></bar></foo></m-component>'));

      let options = reader.getAll('foo bar');

      expect(options.length).toBe(3);
      expect(options[0].get('value').evaluate()).toBe('1');
      expect(options[1].get('value').evaluate()).toBe('2');
      expect(options[2].get('value').evaluate()).toBe('3');
    });

    it('should allow nesting', () => {
      let reader = factory.create({}, getHTMLElement(
        '<m-component><foo><bar value="1"></bar><bar value="2"></bar><bar value="3"></bar></foo></m-component>'));

      let options = reader.get('foo').getAll('bar');

      expect(options.length).toBe(3);
      expect(options[0].get('value').evaluate()).toBe('1');
      expect(options[1].get('value').evaluate()).toBe('2');
      expect(options[2].get('value').evaluate()).toBe('3');
    });

    it('should work with binding', () => {
      let reader = factory.create({ first: 10, second: 20, third: 30 }, getHTMLElement(
        '<m-component><foo><bar value.bind="first"></bar><bar value.bind="second"></bar><bar value.one-time="third"></bar></foo></m-component>'));

      let options = reader.get('foo').getAll('bar');

      expect(options.length).toBe(3);
      expect(options[0].get('value').evaluate()).toBe(10);
      expect(options[1].get('value').evaluate()).toBe(20);
      expect(options[2].get('value').evaluate()).toBe(30);
    });

    it('should support code based options', () => {
      let codeBased = { foo: [{ value: 40 }, { value: 50 }] };
      let reader = factory.create({ first: 10, second: 20, third: 30 }, getHTMLElement('<m-component></m-component>'), codeBased);

      let options = reader.get('foo').getAll('bar');

      expect(options.length).toBe(2);
      expect(options[0].get('value').evaluate()).toBe(40);
      expect(options[1].get('value').evaluate()).toBe(50);

      options = reader.getAll('foo bar');

      expect(options.length).toBe(2);
      expect(options[0].get('value').evaluate()).toBe(40);
      expect(options[1].get('value').evaluate()).toBe(50);
    });

    it('should have higher priority for code based options', () => {
      let codeBased = { foo: [{ value: 40 }, { value: 50 }] };
      let reader = factory.create({ first: 10, second: 20, third: 30 }, getHTMLElement(
        '<m-component><foo><bar value.bind="first"></bar><bar value.bind="second"></bar><bar value.one-time="third"></bar></foo></m-component>'),
        codeBased);

      let options = reader.get('foo').getAll('bar');

      expect(options.length).toBe(2);
      expect(options[0].get('value').evaluate()).toBe(40);
      expect(options[1].get('value').evaluate()).toBe(50);
    });

    it('should throw in case of array item evaluation', () => {
      let codeBased = { foo: [{ value: 40 }, { value: 50 }] };
      let reader = factory.create({}, getHTMLElement('<m-component></m-component>'), codeBased);

      let options = reader.get('foo').getAll('bar');

      expect(() => options[0].evaluate()).toThrowError(`Array item cannot be evaluated. Only properties are evaluable.`);
    });

    it('should throw in case of attribute', () => {
      let reader = factory.create({}, getHTMLElement(
        '<m-component><foo value="10"></foo></m-component>'));

      expect(() => { reader.get('foo value').getAll('bar') }).toThrowError(`Attribute cannot have any nested options.`);
    });

    it('should throw in case of empty selector', () => {
      let reader = factory.create({}, getHTMLElement('<m-component><foo></foo></m-component>'));

      expect(() => { reader.getAll('') }).toThrowError(`Empty selector for M-COMPONENT element.`);
      expect(() => { reader.get('foo').getAll('') }).toThrowError(`Empty selector for FOO element.`);
    });
  });

  describe('getAllProperties method', () => {
    it('should allow to get properties from node', () => {
      let reader = factory.create({ first: 10 }, getHTMLElement(
        '<m-component><bar><foo value.bind="first" other="20"></foo></bar></m-component>'));

      let props = reader.get('bar').get('foo').getAllProperties();

      expect(props.length).toBe(2);
      expect(props[0].evaluate()).toBe(10);
      expect(props[0].name).toBe('value');
      expect(props[1].evaluate()).toBe('20');
      expect(props[1].name).toBe('other');
    });
    
    it('should allow to get properties from node even when code based are defined', () => {
      let codeBased = { test: 1 };
      let reader = factory.create({ first: 10 }, getHTMLElement(
        '<m-component><bar><foo value.bind="first" other="20"></foo></bar></m-component>'),
        codeBased);

      let props = reader.get('bar').get('foo').getAllProperties();

      expect(props.length).toBe(2);
      expect(props[0].evaluate()).toBe(10);
      expect(props[0].name).toBe('value');
      expect(props[1].evaluate()).toBe('20');
      expect(props[1].name).toBe('other');
    });
    
    it('should allow to get properties from node even when code based are defined and getAll is used', () => {
      let codeBased = { test: 1 };
      let reader = factory.create({ first: 10 }, getHTMLElement(
        '<m-component><bar><foo value.bind="first" other="20"></foo></bar></m-component>'),
        codeBased);

      let props = reader.getAll('bar foo').map(x => x.getAllProperties());

      expect(props.length).toBe(1);
      expect(props[0].length).toBe(2);
      expect(props[0][0].evaluate()).toBe(10);
      expect(props[0][0].name).toBe('value');
      expect(props[0][1].evaluate()).toBe('20');
      expect(props[0][1].name).toBe('other');
    });

    it('should allow to get properties from code based option', () => {
      let codeBased = { bar: { foo: { value: 10, other: 20 } } };
      let reader = factory.create({}, getHTMLElement('<m-component></m-component>'), codeBased);

      let props = reader.get('bar').get('foo').getAllProperties();

      expect(props.length).toBe(2);
      expect(props[0].evaluate()).toBe(10);
      expect(props[0].name).toBe('value');
      expect(props[1].evaluate()).toBe(20);
      expect(props[1].name).toBe('other');
    });

    it('should return empty in case of undefined option', () => {
      let codeBased = {};
      let reader = factory.create({}, getHTMLElement('<m-component></m-component>'), codeBased);

      let props = reader.get('foo').getAllProperties();

      expect(props).toEqual([]);
    });

    it('should throw when invoked on attribute', () => {
      let reader = factory.create({}, getHTMLElement('<m-component><bar foo="1"></bar></m-component>'));
      expect(() => reader.get('bar').get('foo').getAllProperties()).toThrowError('Attribute cannot have any property.');
    });
  });
});