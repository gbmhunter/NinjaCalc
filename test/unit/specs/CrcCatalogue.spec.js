// var bigInt = require('big-integer')
import {crcCatalogue, crcIds} from 'src/misc/Crc/CrcCatalogue'

describe('CrcCatalogue object tests.', function () {
  it('CRC algorithm name can be retrieved correctly.', function () {
    expect(crcCatalogue.get(crcIds.CRC_8_MAXIM).name).to.equal('CRC-8/MAXIM')
  })
  it('CRC polynomial can be retrieved correctly.', function () {
    expect(crcCatalogue.get(crcIds.CRC_8_MAXIM).crcPolynomial.toJSNumber()).to.equal(0x31)
  })
  it('CRC starting value can be retrieved correctly.', function () {
    expect(crcCatalogue.get(crcIds.CRC_8_MAXIM).startingValue.toJSNumber()).to.equal(0x00)
  })
  it('reflect data variable is set correctly.', function () {
    expect(crcCatalogue.get(crcIds.CRC_8_MAXIM).reflectData).to.equal(true)
  })
  it('Reflect remainder variable is set correctly.', function () {
    expect(crcCatalogue.get(crcIds.CRC_8_MAXIM).reflectRemainder).to.equal(true)
  })
  it('Final XOR value is set correctly.', function () {
    expect(crcCatalogue.get(crcIds.CRC_8_MAXIM).finalXorValue.toJSNumber()).to.equal(0x00)
  })
  it('Check value is set correctly.', function () {
    expect(crcCatalogue.get(crcIds.CRC_8_MAXIM).checkValue.toJSNumber()).to.equal(0xA1)
  })
})

describe('CrcCatalogue CRC check value tests.', function () {
  console.log('to be implemented')
  for (var [key, value] of crcCatalogue.presetCrcAlgorithms) {
    console.log(key + ' = ' + value)
    
  }
})
