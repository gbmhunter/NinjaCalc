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
    expect(crcGeneric.crcWidthBits).to.equal(8)
    expect(crcGeneric.crcPolynomial.toJSNumber()).to.equal(0x31)
    expect(crcGeneric.startingValue.toJSNumber()).to.equal(0x00)
    expect(crcGeneric.reflectData).to.equal(false)
    expect(crcGeneric.reflectRemainder).to.equal(false)
    expect(crcGeneric.finalXorValue.toJSNumber()).to.equal(0x00)
    expect(crcGeneric.checkValue.toJSNumber()).to.equal(0xA1)
  })
})
