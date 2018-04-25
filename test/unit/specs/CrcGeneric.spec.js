var bigInt = require('big-integer')
import { CrcGeneric } from '@/misc/Crc/CrcGeneric'

describe('CrcGeneric 4-bit tests.', function () {
  var crcGeneric = new CrcGeneric({
    name: 'CRC-4/ITU',
    crcWidthBits: 4,
    crcPolynomial: bigInt('3', 16),
    startingValue: bigInt('0', 16),
    reflectData: true,
    reflectRemainder: true,
    finalXorValue: bigInt('0', 16),
    checkValue: bigInt('7', 16)
  })

  it('update() test', function () {
    expect(crcGeneric.getHex()).toEqual('0')
    crcGeneric.update(0x01)
    expect(crcGeneric.getHex()).toEqual('7')
    crcGeneric.update(0x02)
    expect(crcGeneric.getHex()).toEqual('2')
    crcGeneric.update(0x03)
    expect(crcGeneric.getHex()).toEqual('7')
  })
})

describe('CrcGeneric 8-bit tests.', function () {
  var crcGeneric = new CrcGeneric({
    name: 'CRC-8/ITU',
    crcWidthBits: 8,
    crcPolynomial: bigInt('07', 16),
    startingValue: bigInt('00', 16),
    reflectData: false,
    reflectRemainder: false,
    finalXorValue: bigInt('55', 16),
    checkValue: bigInt('A1', 16)
  })

  it('Initialisation should work correctly.', function () {
    expect(crcGeneric.name).toEqual('CRC-8/ITU')
    expect(crcGeneric.crcWidthBits).toEqual(8)
    expect(crcGeneric.crcPolynomial.toJSNumber()).toEqual(0x07)
    expect(crcGeneric.startingValue.toJSNumber()).toEqual(0x00)
    expect(crcGeneric.reflectData).toEqual(false)
    expect(crcGeneric.reflectRemainder).toEqual(false)
    expect(crcGeneric.finalXorValue.toJSNumber()).toEqual(0x55)
    expect(crcGeneric.checkValue.toJSNumber()).toEqual(0xA1)
    // The mask should be the same width as the CRC width, and be all F's
    expect(crcGeneric.mask.toJSNumber()).toEqual(0xFF)
  })

  it('update() test', function () {
    expect(crcGeneric.getHex()).toEqual('55')
    crcGeneric.update(0x01)
    expect(crcGeneric.getHex()).toEqual('52')
    crcGeneric.update(0x02)
    expect(crcGeneric.getHex()).toEqual('4E')
    crcGeneric.update(0x03)
    expect(crcGeneric.getHex()).toEqual('1D')
  })
})

describe('CrcGeneric 16-bit tests.', function () {
  var crcGeneric = new CrcGeneric({
    name: 'CRC-16/CCITT-FALSE',
    crcWidthBits: 16,
    crcPolynomial: bigInt('1021', 16),
    startingValue: bigInt('FFFF', 16),
    reflectData: false,
    reflectRemainder: false,
    finalXorValue: bigInt('0000', 16),
    checkValue: bigInt('29B1', 16)
  })

  it('update() test', function () {
    expect(crcGeneric.getHex()).toEqual('FFFF')
    crcGeneric.update(0x01)
    expect(crcGeneric.getHex()).toEqual('F1D1')
    crcGeneric.update(0x02)
    expect(crcGeneric.getHex()).toEqual('0E7C')
    crcGeneric.update(0x03)
    expect(crcGeneric.getHex()).toEqual('ADAD')
  })
})

describe('CrcGeneric 32-bit tests.', function () {
  var crcGeneric = new CrcGeneric({
    name: 'CRC-32/POSIX',
    crcWidthBits: 32,
    crcPolynomial: bigInt('04C11DB7', 16),
    startingValue: bigInt('00000000', 16),
    reflectData: false,
    reflectRemainder: false,
    finalXorValue: bigInt('FFFFFFFF', 16),
    checkValue: bigInt('765E7680', 16)
  })

  it('update() test', function () {
    expect(crcGeneric.getHex()).toEqual('FFFFFFFF')
    crcGeneric.update(0x01)
    expect(crcGeneric.getHex()).toEqual('FB3EE248')
    crcGeneric.update(0x02)
    expect(crcGeneric.getHex()).toEqual('2464054D')
    crcGeneric.update(0x03)
    expect(crcGeneric.getHex()).toEqual('5396EBAE')
  })
})
