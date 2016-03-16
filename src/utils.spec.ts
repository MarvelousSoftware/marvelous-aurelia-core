import {Utils} from './utils';

class Test {
  foo: string;
  bar: number;
  foobar: Test;
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
  
  describe('accessor method', () => {
    it('should support nested types', () => {
      expect(Utils.accessor('test.bar')).toBe('test.bar');
      expect(Utils.accessor(function(test:any){return test.bar})).toBe('bar');
      expect(Utils.accessor<Test>(x => x.bar)).toBe('bar');    
      expect(Utils.accessor<Test>(x => x.foobar.bar)).toBe('foobar.bar');
    });
  })
})