var expect = require('chai').expect;

describe('placeholder test suite', function() {
  it('should find the sum of two numbers', function() {
    var sum = (a, b) => a + b;
    expect(sum(1, 2)).to.equal(3);
  });
});
