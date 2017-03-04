var bigInt = require('big-integer')

export class CrcGeneric {
  constructor (initObj) {
    console.log('CrcGeneric.initObj() called.')

    this.crcWidthBits = initObj.crcWidthBits
    this.crcPolynomial = initObj.crcPolynomial
    this.startingValue = initObj.startingValue
    this.finalXorValue = initObj.finalXorValue
    this.reflectData = initObj.reflectData
    this.reflectRemainder = initObj.reflectRemainder

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

  update = () => {
    console.log('CrcGeneric.update() called.')
  }

}
