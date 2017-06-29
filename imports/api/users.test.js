import expect from 'expect';

const add = (a,b) => a + b;

it('should add two number', function() {
  const result = add(11, 9);
  expect(result).toBe(20);  
});


