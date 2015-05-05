var expect = require('chai').expect,
  FNV = require('./index');

describe('FNV', function() {

  describe('.hash', function() {

    it('generates FNV hashes for strings', function() {

//      expect(FNV.hash(''))
//      .to.equal('6c62272e07bb014262b821756295c58d');

      expect(FNV.hash('a'))
      .to.equal('d228cb696f1a8caf78912b704e4a8964');

      expect(FNV.hash('aa'))
      .to.equal('08809544baab1be95aa0733055b69927');

      expect(FNV.hash('hello world'))
      .to.equal('6c155799fdc8eec4b91523808e7726b7');

    });

  });

});
