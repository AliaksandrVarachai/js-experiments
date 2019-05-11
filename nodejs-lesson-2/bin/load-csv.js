#!/usr/bin/env node

const assert = require('assert');
const path = require('path');
const csvLoader = require('../src/csv-loader');

const mockedDataDirPath = path.resolve(__dirname, '../mocked-data');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.strictEqual([1, 2, 3].indexOf(4), -1);
    });
    it('should return the first element equal to the given one', function() {
      assert.strictEqual([3, 2, 2, 1].indexOf(2), 1);
    });
    // it('should return the first element equal to the given one', () => {
    //   [3, 2, 2, 1].indexOf(2).should.equal(1);
    // })
  });
});

describe('CSV Loader', function() {
  beforeEach(() => {
    delete require.cache[require.resolve('./csv-loader')];
  });

  it('should throw when wrong file path passed as an argument', function(done) {
    const wrongPath = path.resolve('/fake-root/fake-dir', 'fake-name.ext');
    csvLoader.load(wrongPath, assert.throws(done));
  });

  it('should call callback for existing file', function(done) {
    const dataPath = path.resolve(mockedDataDirPath, '0.csv');
    csvLoader.load(dataPath, function(err, csvObjects) {
      if (err)
        return done(err);
      assert.ok(csvObjects);
      done();
    });
  })
});
