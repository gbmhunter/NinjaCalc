var bigInt = require('big-integer')
import {CrcGeneric} from 'src/misc/Crc/CrcGeneric'

describe('CrcGeneric tests.', function () {
  var crcGeneric = new CrcGeneric({
    name: 'CRC-8/ITU',
    crcWidthBits: 8,
    crcPolynomial: bigInt('0x07', 16),
    startingValue: bigInt('0x00', 16),
    reflectData: false,
    reflectRemainder: false,
    finalXorValue: bigInt('0x55', 16),
    checkValue: bigInt('0xA1', 16)
  })

  it('Initialisation should work correctly.', function () {
    expect(crcGeneric.name).to.equal('CRC-8/ITU')
    expect(crcGeneric.crcWidthBits).to.equal(8)
    expect(crcGeneric.crcPolynomial.toJSNumber()).to.equal(0x07)
    expect(crcGeneric.startingValue.toJSNumber()).to.equal(0x00)
    expect(crcGeneric.reflectData).to.equal(false)
    expect(crcGeneric.reflectRemainder).to.equal(false)
    expect(crcGeneric.finalXorValue.toJSNumber()).to.equal(0x55)
    expect(crcGeneric.checkValue.toJSNumber()).to.equal(0xA1)
    // The mask should be the same width as the CRC width, and be all F's
    expect(crcGeneric.mask.toJSNumber()).to.equal(0xFF)
  })

  it('update() test', function () {
    expect(crcGeneric.getValue()).to.equal(0x55)
    crcGeneric.update(0x01)
    expect(crcGeneric.getValue()).to.equal(0x52)
  })
})
