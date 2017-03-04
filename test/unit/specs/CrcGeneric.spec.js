var bigInt = require('big-integer')
import {CrcGeneric} from 'src/misc/Crc/CrcGeneric'

describe('CrcGeneric tests.', function () {
  it('Initialisation should work correctly.', function () {
    var crcGeneric = new CrcGeneric({
      name: 'MAXIM',
      crcWidthBits: 8,
      crcPolynomial: bigInt('0x31', 16),
      startingValue: bigInt('0x00', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('0x00', 16),
      checkValue: bigInt('0xA1', 16)
    })
    expect(crcGeneric.name).to.equal('MAXIM')
  })
})
