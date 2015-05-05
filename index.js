
'use strict';

// 1000000000000000000013b

/*
var prime = [
  0x3b,
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
  0x00,
  0x00,
  0x00,
  0x00
];*/

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
/*
  this._value = [
    0x8d,
    0xc5,
    0x95,
    0x62,
    0x75,
    0x21,
    0xb8,
    0x62,
    0x42,
    0x01,
    0xbb,
    0x07,
    0x2e,
    0x27,
    0x62,
    0x6c
  ];
*/
  this._scratch = new Array(16);

}


FNV.prototype.hash = function(item) {

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


FNV.prototype.toString = FNV.prototype.toHex = function() {

  return this._value.reduce(function(result, octet) {
    return result + ('00' + octet.toString(16)).slice(-2);
  }, '');

};


var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
FNV.prototype.toBase64 = function() {


};

FNV.hash = function(string) {
  return new FNV().hash(string).toHex();
};

module.exports = FNV;
