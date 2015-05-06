fnv-lite
========

A much smaller FNV-1a hash library, friendlier to browsers.

fnv-lite implements the 128-bit variant of Fowler-Noll-Vo version 1a. It emits hashes in hex, base64, and as a raw array of octets.

## Usage

fnv-lite is a UMD module, so you can use it with require.js, Node, browserify,
or directly in your browser window, in which case it will export `window.FNV`.

```bash
npm install --save fnv-lite
```

```js
var FNV = require('fnv-lite');

console.log(FNV.hex('')); // 6c62272e07bb014262b821756295c58d
console.log(FNV.base64('')); // bGInLge7AUJiuCF1= 

```

## API

### FNV.hex(string)

Returns the FNV-1a hash of `string` as a hex string.

### FNV.base64(string)

Returns the FNV-1a hash of `string` as a base64-encoded string.

### new FNV()

Create a new FNV hash object.

### FNV#update(iterable)

Add the contents of the supplied string/byte array to the hash and recompute its value.

Returns the original `FNV` object, so you can chain it.

### FNV#digest(['hex' | 'base64'])

Retrieve the current value of the hash in either hexadecimal or base64.
If you don't supply a digest type, fnv-lite will return the current hash
value as a "byte" array.

## Why not fnv-plus?

`fnv-plus` is an excellent library for server-side operations. Unfortunately it
requires the `jsbn` library, which adds quite a lot of girth to browser builds.

## License
ISC.