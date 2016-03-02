fnv-lite
========

[![Build Status](https://travis-ci.org/casetext/fnv-lite.svg)](https://travis-ci.org/casetext/fnv-lite)

A much smaller [FNV-1a](https://en.wikipedia.org/wiki/Fowler–Noll–Vo_hash_function#FNV-1a_hash) hash library, friendlier to browsers.

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
console.log(FNV.base64('')); // bGInLge7AUJiuCF1YpXFjQ==
console.log(FNV.base64Url('')); // bGInLge7AUJiuCF1YpXFjQ
console.log(FNV.base36('')); // 6ezv16m7wweombnkd3ldlii6l
```

## API

### FNV.hex(string)

Returns the FNV-1a hash of `string` as a hex string.

### FNV.base36(string)

Returns the FNV-1a hash of `string` as a base36-encoded string.
Base36 is a relic of the Javascript universe, in that it happens
to be the largest number base you can pass to `Number#toString()`.
This method is included because it replicates the behavior of the `str()`
serialization in `fnv-plus`.

### FNV.base64(string)

Returns the FNV-1a hash of `string` as a base64-encoded string.

### FNV.base64Url(string)

Returns the FNV-1a hash of `string` as a URL-safe base64-encoded string,
which is different from a regular base64 string in the following respects:
- "+" becomes "-".
- "/" becomes "\_".
- The trailing padding characters (==) are omitted.

### new FNV()

Create a new FNV hash object.

### FNV#update(iterable)

Add the contents of the supplied string/byte array to the hash and recompute its value.

Returns the original `FNV` object, so you can chain it.

### FNV#digest(['hex' | 'base36' | 'base64'])

Retrieve the current value of the hash in hexadecimal, base36 (a Javascript relic), or base64.
If you don't supply a digest type, fnv-lite will return the current hash
value as a "byte" array.

## Why not fnv-plus?

`fnv-plus` is an excellent library for server-side operations. Unfortunately it
requires the `jsbn` library, which adds quite a lot of girth to browser builds.

## More info

 - [FNV-1a specification](http://tools.ietf.org/html/draft-eastlake-fnv-10)
 - [A useful discussion of FNV-1a](http://www.isthe.com/chongo/tech/comp/fnv/#FNV-param)

## License
ISC.
