import {Utils} from './utils';

class Test {
  foo: string;
  bar: number;
}

describe('Utils', () => {
  describe('property method', () => {
    
    it('should get property from expression', () => {    
      expect(Utils.property<Test>(x => x.foo)).toBe('foo');
      expect(Utils.property<Test>(x => x['foo'])).toBe('foo');
      expect(Utils.property<Test>(test => test.bar)).toBe('bar');
      expect(Utils.property<Test>(function(foo){return foo.bar})).toBe('bar');
      expect(Utils.property<Test>(function (foo) { return foo.bar; })).toBe('bar');
      expect(Utils.property<Test>(function(foo){return foo['bar']})).toBe('bar');
      expect(Utils.property<Test>("function(foo){return foo.bar}")).toBe('bar');
    });
    
  });
})