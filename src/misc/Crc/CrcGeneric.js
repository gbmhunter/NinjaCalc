var bigInt = require('big-integer')

export class CrcGeneric {
  constructor (initObj) {
    console.log('CrcGeneric.initObj() called.')

    this.DATA_WIDTH_BITS = 8

    this.name = initObj.name
    this.crcWidthBits = initObj.crcWidthBits
    this.crcPolynomial = initObj.crcPolynomial
    this.startingValue = initObj.startingValue
    this.finalXorValue = initObj.finalXorValue
    this.reflectData = initObj.reflectData
    this.reflectRemainder = initObj.reflectRemainder
    this.checkValue = initObj.checkValue

    this.mask = bigInt('0')
    this.shiftedPolynomial = bigInt('0')

    // Create a mask for future use in the update() method.
    // If the generator polynomial width is 8 bits, then the mask needs to be 0xFF,
    // if it is 16bits, then the mask needs to be 0xFFFF, e.t.c
    var shiftingBit = bigInt('1')
    for (var i = 0; i < this.crcWidthBits; i++) {
      // mask |= shiftingBit;
      this.mask = this.mask.or(shiftingBit)
      // shiftingBit <<= 1;
      shiftingBit = shiftingBit.shiftLeft(1)
    }

    // this.shiftedPolynomial = (crcPolynomial << (8 - crcWidthBits));
    this.shiftedPolynomial = this.crcPolynomial.shiftLeft(8 - this.crcWidthBits)

    // Initialise the CRC value with the starting value
    this.crcValue = this.startingValue
  }

  update = (byteOfData) => {
    console.log('CrcGeneric.update() called.')

    var input = byteOfData

    if (this.reflectData) {
      input = this.doMirror(input, 8)
    }

    if (this.crcWidthBits - this.DATA_WIDTH_BITS >= 0) {
      // CRC POLYNOMIAL WIDTH >= DATA WIDTH

      // XOR-in the next byte of data, shifting it first
      // depending on the polynomial width.
      // This trick allows us to operate on one byte of data at a time before
      // considering the next
      this.crcValue ^= (input << (this.crcWidthBits - this.DATA_WIDTH_BITS))

      for (var j = 0; j < this.DATA_WIDTH_BITS; j++) {
        // Check to see if MSB is 1, if so, we need
        // to XOR with polynomial
        if ((this.crcValue & (1 << (this.crcWidthBits - 1))) !== 0) {
          this.crcValue = ((this.crcValue << 1) ^ this.crcPolynomial) & this.mask
        } else {
          this.crcValue = (this.crcValue << 1) & this.mask
        }
      }
    } else {
      // CRC POLYNOMIAL WIDTH < DATA WIDTH

      this.crcValue <<= this.DATA_WIDTH_BITS - this.crcWidthBits

      this.crcValue ^= input
      for (var k = 0; k < 8; k++) {
        this.crcValue = ((this.crcValue & 0x80) !== 0) ? (this.crcValue << 1) ^ this.shiftedPolynomial : this.crcValue << 1
      }

      this.crcValue &= 0xFF
      this.crcValue >>= this.DATA_WIDTH_BITS - this.crcWidthBits
    }
  }

  doMirror = (input, numBits) => {
    var output = 0

    for (var i = 0; i < numBits; i++) {
      output <<= 1
      output |= (input & 1)
      input >>= 1
    }

    return output
  }

}
