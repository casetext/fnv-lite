
(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.FNV = factory();
  }

}(this, function() {

  'use strict';

  // 1000000000000000000013b
  var prime = [
    0x00,
    0x00,
    0x00,
    0x00,
    0x01,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x01,
    0x3b
  ];


  function FNV() {

    //6c62272e07bb014262b821756295c58d
    this._value = [
      0x6c,
      0x62,
      0x27,
      0x2e,
      0x07,
      0xbb,
      0x01,
      0x42,
      0x62,
      0xb8,
      0x21,
      0x75,
      0x62,
      0x95,
      0xc5,
      0x8d
    ];

    this._scratch = new Array(16);

  }


  FNV.prototype.update = function(item) {

    var i;

    if (typeof item === 'string') {

      // convert string into byte array
      var str = item.replace(/\r\n/g, '\n');
      var out = [], p = 0;
      for (i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c < 128) {
          out[p++] = c;
        } else if (c < 2048) {
          out[p++] = (c >> 6) | 192;
          out[p++] = (c & 63) | 128;
        } else {
          out[p++] = (c >> 12) | 224;
          out[p++] = ((c >> 6) & 63) | 128;
          out[p++] = (c & 63) | 128;
        }

      }

      item = out;

    }

    for (i = 0; i < item.length; i++) {
      this._value[15] ^= item[i];
      this._primeMultiply();
    }

    return this;

  };

  FNV.prototype._primeMultiply = function() {

    var product, x;

    // initialize scratch
    for (x = 0; x < 16; x++) {
      this._scratch[x] = 0;
    }

    for (x = 0; x < 16; x++) {

      for (var y = 0; y < 16-x; y++) {

        product = this._value[15-x] * prime[15-y] + (this._scratch[15-(x+y)] || 0);

        if ( product > 255 ) {

          if (x+y+1 < 16) {
            this._scratch[15-(x+y+1)] += (product >>> 8);
          }
          product -= (product >>> 8) << 8;

        }

        this._scratch[15-(x+y)] = product;

      }

    }

    var newValue = this._scratch;
    this._scratch = this._value;
    this._value = newValue;

  };

  FNV.prototype.digest = function(encoding) {

    switch(encoding) {
    case 'base64Url':
      return this._b64(true);
    case 'base64':
      return this._b64();
    case 'base36':
      return this._b36();
    case 'hex':
      return this._value.reduce(function(result, octet) {
        return result + ('00' + octet.toString(16)).slice(-2);
      }, '');
    default:
      return this._value.slice(0);
    }

  };

  var BASE64_LOOKUP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  FNV.prototype._b64 = function() {

    var result = '';

    for (var i = 0; i < 15; i += 3) {

      var unit = (this._value[i] << 16) + (this._value[i+1] << 8) + this._value[i+2];

      result += BASE64_LOOKUP[(unit >> 18) & 0x3f] +
        BASE64_LOOKUP[(unit >> 12) & 0x3f] +
        BASE64_LOOKUP[(unit >> 6) & 0x3f] +
        BASE64_LOOKUP[unit & 0x3f];

    }

    var lastUnit = this._value[15] << 16;

    return result + BASE64_LOOKUP[(lastUnit >> 18) & 0x3f] +
      BASE64_LOOKUP[(lastUnit >> 12) & 0x3f] +
      '==';

  };

  var BASE64_LOOKUP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var BASE64_SAFE_LOOKUP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  FNV.prototype._b64 = function(safe) {

    var result = '';

    var lookup,
      trailer;

    if (safe) {
      lookup = BASE64_SAFE_LOOKUP;
      trailer = '';
    } else {
      lookup = BASE64_LOOKUP;
      trailer = '==';
    }

    for (var i = 0; i < 15; i += 3) {

      var unit = (this._value[i] << 16) + (this._value[i+1] << 8) + this._value[i+2];

      result += lookup[(unit >> 18) & 0x3f] +
        lookup[(unit >> 12) & 0x3f] +
        lookup[(unit >> 6) & 0x3f] +
        lookup[unit & 0x3f];

    }

    var lastUnit = this._value[15] << 16;

    return result + lookup[(lastUnit >> 18) & 0x3f] +
      lookup[(lastUnit >> 12) & 0x3f] +
      trailer;

  };

  function longDivide36(longNum) {

    var remainder = 0,
      operand = [],
      operandValue = 0;

    for (var i = 0; i < 16; i++) {

      operand.push(longNum[i]);

      operandValue = 0;
      for (var j = 0; j < operand.length; j++) {
        operandValue += operand[j] * Math.pow(256, operand.length-(j+1));
      }

      longNum[i] = Math.floor(operandValue / 36);
      remainder = operandValue % 36;

      if (longNum[i] > 0) {
        operand = [remainder];
      }

    }

    return remainder;

  }

  function isZero(array) {

    for (var i = 0; i < array.length; i++) {
      if (array[i] !== 0) {
        return false;
      }
    }
    return true;

  }

  var BASE36_LOOKUP = '0123456789abcdefghijklmnopqrstuvwxyz';
  FNV.prototype._b36 = function() {

    // initialize scratch
    for (var x = 0; x < 16; x++) {
      this._scratch[x] = this._value[x];
    }

    var resultString = '';

    while(!isZero(this._scratch)) {
      resultString = BASE36_LOOKUP.charAt(longDivide36(this._scratch)) + resultString;
    }

    return resultString;

  };

  FNV.hex = function(string) {
    return new FNV().update(string).digest('hex');
  };

  FNV.base36 = function(string) {
    return new FNV().update(string).digest('base36');
  };

  FNV.base64 = function(string) {
    return new FNV().update(string).digest('base64');
  };

  FNV.base64Url = function(string) {
    return new FNV().update(string).digest('base64Url');
  };

  return FNV;

}));
