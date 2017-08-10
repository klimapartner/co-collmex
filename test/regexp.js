var assert = require('chai').assert
var Collmex = require("../index.js")
try{
  var options = require("./options.json")
}catch(err){
  var options = require("./options.default.json")
}
var collmex = new Collmex(options)

describe('collmex.number', function() {
  it('should parse ints', function () {
      assert.equal(collmex.number.test("1"),true)
      assert.equal(collmex.number.test("12"),true)
      assert.equal(collmex.number.test("123456"),true)
  });
  it('should parse negative ints', function () {
      assert.equal(collmex.number.test("-1"),true)
      assert.equal(collmex.number.test("-12"),true)
      assert.equal(collmex.number.test("-123456"),true)
  });
  it('should parse ints with decimal points', function () {
      assert.equal(collmex.number.test("1.000"),true)
      assert.equal(collmex.number.test("1.000.000"),true)
      assert.equal(collmex.number.test("1.000.000.000"),true)
  });
  it('should parse floats', function () {
      assert.equal(collmex.number.test("0,1"),true)
      assert.equal(collmex.number.test("1,0"),true)
      assert.equal(collmex.number.test("1,000"),true)
      assert.equal(collmex.number.test("1.000,01"),true)
  });
  it('should parse negative floats', function () {
    assert.equal(collmex.number.test("-10,99"),true)
    assert.equal(collmex.number.test("-1.000,27"),true)
  });
  it('should not parse dates', function () {
      assert.equal(collmex.number.test("01.01.2016"),false)
  });
  it('should not parse amazon bestellnummern', function () {
      assert.equal(collmex.number.test("123-235235-235235"),false)
  });
  it('should not parse strings', function () {
      assert.equal(collmex.number.test("A0006235"),false)
      assert.equal(collmex.number.test("-12a"),false)
      assert.equal(collmex.number.test("0-2"),false)
      assert.equal(collmex.number.test("0.0"),false)
      assert.equal(collmex.number.test("0,-"),false)
  });

})
