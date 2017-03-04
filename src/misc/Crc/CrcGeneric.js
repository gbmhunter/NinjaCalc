export class CrcGeneric {
  constructor (initObj) {
    this.crcWidthBits = initObj.crcWidthBits
    this.crcPolynomial = initObj.crcPolynomial
    this.startingValue = initObj.startingValue
    this.finalXorValue = initObj.finalXorValue
    this.reflectData = initObj.reflectData
    this.reflectRemainder = initObj.reflectRemainder

    // Create a mask for future use in the update() method.
    // If the generator polynomial width is 8 bits, then the mask needs to be 0xFF,
    // if it is 16bits, then the mask needs to be 0xFFFF, e.t.c
    // long shiftingBit = 1;
    // for(int i = 0; i < crcWidthBits; i++) {
    //   mask |= shiftingBit;
    //   shiftingBit <<= 1;
    // }
    //
    // shiftedPolynomial = (crcPolynomial << (8 - crcWidthBits));
    //
    // // Initialise the CRC value with the starting value
    // crcValue = startingValue;
  }
}
