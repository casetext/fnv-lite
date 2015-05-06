var expect = require('chai').expect,
  FNV = require('./index');

var allGoodMen = 'Now is the time for all good men to come to the aid of the country.';

describe('FNV', function() {

  describe('.hex', function() {

    it('generates FNV hashes for strings', function() {

      expect(FNV.hex(''))
      .to.equal('6c62272e07bb014262b821756295c58d');

      expect(FNV.hex('a'))
      .to.equal('d228cb696f1a8caf78912b704e4a8964');

      expect(FNV.hex('aa'))
      .to.equal('08809544baab1be95aa0733055b69927');

      expect(FNV.hex('hello world'))
      .to.equal('6c155799fdc8eec4b91523808e7726b7');

      expect(FNV.hex(allGoodMen))
      .to.equal('51b38e5a1cb756b30e89c2424df530f3');

    });

  });

  describe('.base64', function() {

    it('generates FNV hashes for strings', function() {

      expect(FNV.base64(''))
      .to.equal('bGInLge7AUJiuCF1YpXFjQ==');

      expect(FNV.base64('a'))
      .to.equal('0ijLaW8ajK94kStwTkqJZA==');

      expect(FNV.base64('aa'))
      .to.equal('CICVRLqrG+laoHMwVbaZJw==');

      expect(FNV.base64('hello world'))
      .to.equal('bBVXmf3I7sS5FSOAjncmtw==');

      expect(FNV.base64(allGoodMen))
      .to.equal('UbOOWhy3VrMOicJCTfUw8w==');

    });

  });

});
