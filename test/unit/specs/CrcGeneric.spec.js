var bigInt = require('big-integer')
import {CrcGeneric} from 'src/misc/Crc/CrcGeneric'

describe('CrcGeneric 4-bit tests.', function () {
  var crcGeneric = new CrcGeneric({
    name: 'CRC-4/ITU',
    crcWidthBits: 4,
    crcPolynomial: bigInt('0x3', 16),
    startingValue: bigInt('0x0', 16),
    reflectData: true,
    reflectRemainder: true,
    finalXorValue: bigInt('0x0', 16),
    checkValue: bigInt('0x7', 16)
  })

  it('update() test', function () {
    expect(crcGeneric.getHex()).to.equal('0')
    crcGeneric.update(0x01)
    expect(crcGeneric.getHex()).to.equal('7')
    crcGeneric.update(0x02)
    expect(crcGeneric.getHex()).to.equal('2')
    crcGeneric.update(0x03)
    expect(crcGeneric.getHex()).to.equal('7')
  })
})

describe('CrcGeneric 8-bit tests.', function () {
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
    expect(crcGeneric.getHex()).to.equal('55')
    crcGeneric.update(0x01)
    expect(crcGeneric.getHex()).to.equal('52')
    crcGeneric.update(0x02)
    expect(crcGeneric.getHex()).to.equal('4E')
    crcGeneric.update(0x03)
    expect(crcGeneric.getHex()).to.equal('1D')
  })
})

describe('CrcGeneric 16-bit tests.', function () {
  var crcGeneric = new CrcGeneric({
    name: 'CRC-16/CCITT-FALSE',
    crcWidthBits: 16,
    crcPolynomial: bigInt('0x1021', 16),
    startingValue: bigInt('0xFFFF', 16),
    reflectData: false,
    reflectRemainder: false,
    finalXorValue: bigInt('0x0000', 16),
    checkValue: bigInt('0x29B1', 16)
  })

  it('update() test', function () {
    expect(crcGeneric.getHex()).to.equal('FFFF')
    crcGeneric.update(0x01)
    expect(crcGeneric.getHex()).to.equal('F1D1')
    crcGeneric.update(0x02)
    expect(crcGeneric.getHex()).to.equal('0E7C')
    crcGeneric.update(0x03)
    expect(crcGeneric.getHex()).to.equal('ADAD')
  })
})

describe('CrcGeneric 32-bit tests.', function () {
  var crcGeneric = new CrcGeneric({
    name: 'CRC-32/POSIX',
    crcWidthBits: 32,
    crcPolynomial: bigInt('0x04C11DB7', 16),
    startingValue: bigInt('0x00000000', 16),
    reflectData: false,
    reflectRemainder: false,
    finalXorValue: bigInt('0xFFFFFFFF', 16),
    checkValue: bigInt('0x765E7680', 16)
  })

  it('update() test', function () {
    expect(crcGeneric.getHex()).to.equal('FFFFFFFF')
    crcGeneric.update(0x01)
    expect(crcGeneric.getHex()).to.equal('FB3EE248')
    crcGeneric.update(0x02)
    expect(crcGeneric.getHex()).to.equal('2464054D')
    crcGeneric.update(0x03)
    expect(crcGeneric.getHex()).to.equal('5396EBAE')
  })
})

// describe('CrcGeneric 64-bit tests.', function () {
//   var crcGeneric = new CrcGeneric({
//     name: 'CRC-64',
//     crcWidthBits: 64,
//     crcPolynomial: bigInt('0x42F0E1EBA9EA3693', 16),
//     startingValue: bigInt('0x0000000000000000', 16),
//     reflectData: false,
//     reflectRemainder: false,
//     finalXorValue: bigInt('0x0000000000000000', 16),
//     checkValue: bigInt('0x6C40DF5F0B497347', 16)
//   })
//
//   it('update() test', function () {
//     expect(crcGeneric.getHex()).to.equal('0000000000000000')
//     crcGeneric.update(0x01)
//     expect(crcGeneric.getHex()).to.equal('42F0E1EBA9EA3693')
//     crcGeneric.update(0x02)
//     expect(crcGeneric.getHex()).to.equal('2AE4E9BC005AB22F')
//     crcGeneric.update(0x03)
//     expect(crcGeneric.getHex()).to.equal('F805609ECE1ECBF3')
//   })
// })
