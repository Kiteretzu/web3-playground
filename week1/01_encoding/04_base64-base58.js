// ## Base64

// `1 character = 6 bits`

// Base64 encoding uses 64 different characters (`A-Z`, `a-z`, `0-9`, `+`, `/`), which means each character can represent one of 64 possible values.

const uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
const base64Encoded = Buffer.from(uint8Array).toString("base64");
console.log(base64Encoded);


// ## Base58
// Base58 uses 58 different characters:

// - Uppercase letters: `A-Z` (excluding `I` and `O`)
// - Lowercase letters: `a-z` (excluding `l`)
// - Numbers: `1-9` (excluding `0`)
// - `+` , `/`


// encode 

const bs58 = require('bs58');

function uint8ArrayToBase58(uint8Array) {
  return bs58.encode(uint8Array);
}

// Example usage:
const byteArray = new Uint8Array([72, 101, 108, 108, 111]); // Corresponds to "Hello"
const base58String = uint8ArrayToBase58(byteArray);
console.log(base58String); // Output: Base58 encoded string


// decode

const bs58 = require('bs58');

function base58ToUint8Array(base58String) {
  return bs58.decode(base58String);
}

// Example usage:
const base58 = base58String; // Use the previously encoded Base58 string
const byteArrayFromBase58 = base58ToUint8Array(base58);
console.log(byteArrayFromBase58); // Output: Uint8Array(5) [72, 101, 108, 108, 111]