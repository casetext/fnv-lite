
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

  //
  // FNV Interface

  // 1000000000000000000013b
  FNV.PRIME = [ 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x3b ];

  FNV.BASE64_LOOKUP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  FNV.BASE64_SAFE_LOOKUP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  FNV.BASE36_LOOKUP = '0123456789abcdefghijklmnopqrstuvwxyz';

  // public class methods.
  FNV.hex = hex;
  FNV.base36 = base36;
  FNV.base64 = base64;
  FNV.base64Url = base64Url;

  // Public instance methods.
  FNV.prototype.update = update;
  FNV.prototype.digest = digest;

  // "Private" instance methods.
  FNV.prototype._b36 = _b36;
  FNV.prototype._b64 = _b64;
  FNV.prototype._primeMultiply = _primeMultiply;
 
  return FNV;

  //
  // FNV Implementation

  function FNV() {

    //6c62272e07bb014262b821756295c58d
    this._value = [ 0x6c, 0x62, 0x27, 0x2e, 0x07, 0xbb, 0x01, 0x42, 0x62, 0xb8, 0x21, 0x75, 0x62, 0x95, 0xc5, 0x8d ];
    this._scratch = new Array(16);

  }

  // Class method implementations.
  function hex(string) {
    return new FNV().update(string).digest('hex');
  }

  function base36(string) {
    return new FNV().update(string).digest('base36');
  }

  function base64(string) {
    return new FNV().update(string).digest('base64');
  }

  function base64Url(string) {
    return new FNV().update(string).digest('base64Url');
  }

  // Public instance method impleentations.
  function update(item) {

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

  }

  function digest(encoding) {

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

  }

  // Private instance method implementations.
  function _primeMultiply() {

    var product, x;

    // initialize scratch
    for (x = 0; x < 16; x++) {
      this._scratch[x] = 0;
    }

    for (x = 0; x < 16; x++) {

      for (var y = 0; y < 16-x; y++) {

        product = this._value[15-x] * FNV.PRIME[15-y] + (this._scratch[15-(x+y)] || 0);

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

  }
 
  function _b36() {

    // initialize scratch
    for (var x = 0; x < 16; x++) {
      this._scratch[x] = this._value[x];
    }

    var resultString = '';

    while(!isZero(this._scratch)) {
      resultString = FNV.BASE36_LOOKUP.charAt(longDivide36(this._scratch)) + resultString;
    }

    return resultString;

  }

  function _b64(safe) {

    var result = '';

    var lookup,
      trailer;

    if (safe) {
      lookup = FNV.BASE64_SAFE_LOOKUP;
      trailer = '';
    } else {
      lookup = FNV.BASE64_LOOKUP;
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

  }

  // Inner functions.
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

}));
