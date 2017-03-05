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
    this.crcValue = bigInt(this.startingValue)
    console.log('initObj.startingValue =')
    console.log(initObj.startingValue)
    console.log('this.startingValue = ')
    console.log(this.startingValue)

    console.log('CrcGeneric.constructor() finished. this =')
    console.log(this)
  }

  update = (byteOfData) => {
    console.log('CrcGeneric.update() called with byteOfData = ' + byteOfData)

    var input = byteOfData

    if (this.reflectData) {
      input = this.doMirror(input, 8)
    }

    // Convert to bigInt
    input = bigInt(input)

    if (this.crcWidthBits - this.DATA_WIDTH_BITS >= 0) {
      // CRC POLYNOMIAL WIDTH >= DATA WIDTH

      // XOR-in the next byte of data, shifting it first
      // depending on the polynomial width.
      // This trick allows us to operate on one byte of data at a time before
      // considering the next
      // this.crcValue ^= (input << (this.crcWidthBits - this.DATA_WIDTH_BITS))
      this.crcValue = this.crcValue.xor(input.shiftLeft(this.crcWidthBits - this.DATA_WIDTH_BITS))

      for (var j = 0; j < this.DATA_WIDTH_BITS; j++) {
        // Check to see if MSB is 1, if so, we need
        // to XOR with polynomial
        if (this.crcValue.and((bigInt(1).shiftLeft(this.crcWidthBits - 1))).notEquals(0)) {
          this.crcValue = ((this.crcValue.shiftLeft(1).xor(this.crcPolynomial)).and(this.mask))
        } else {
          this.crcValue = this.crcValue.shiftLeft(1).and(this.mask)
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

    console.log('update() finished. crcValue = ' + this.crcValue)
  }

  doMirror = (input, numBits) => {
    var output = bigInt(0)

    for (var i = 0; i < numBits; i++) {
      output = output.shiftLeft(1)
      output = output.or(input.and(1))
      input = input.rightShift(1)
    }

    return output
  }

  getValue = () => {
    var output
    if (this.reflectRemainder) {
      output = this.doMirror(this.crcValue, this.crcWidthBits)
    } else {
      output = this.crcValue
    }

    output = output.xor(this.finalXorValue)

    return output
  }

  getHex = () => {
    var value = bigInt(this.getValue())
    // Convert to hex
    var hex = value.toString(16)
    // Convert to upper-case (bigInt.toString() returns lower-case hex characters)
    hex = hex.toUpperCase()
    // Now pad with zero's until it is the same width as the polynomial (in hex)
    var numHexChars = Math.ceil(this.crcWidthBits / 4)
    while (hex.length < numHexChars) {
      hex = '0' + hex;
    }
    return hex
  }

}
