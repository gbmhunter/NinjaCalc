// var bigInt = require('big-integer')
import {CrcGeneric} from 'src/misc/Crc/CrcGeneric'
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
  it('Compare CRC algorithm to check value.', function () {
    console.log('to be implemented')
    for (var [key, value] of crcCatalogue.presetCrcAlgorithms) {
      console.log(key + ' = ' + value)
      // Create a CRC engine with this algorithm info
      var crcGeneric = new CrcGeneric({
        name: value.name,
        crcWidthBits: value.crcWidthBits,
        crcPolynomial: value.crcPolynomial,
        startingValue: value.startingValue,
        reflectData: value.reflectData,
        reflectRemainder: value.reflectRemainder,
        finalXorValue: value.finalXorValue,
        checkValue: value.checkValue
      })
      console.log('crcGeneric =')
      console.log(crcGeneric)
      var dataArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
      for (let data of dataArray) {
        crcGeneric.update(data.charCodeAt())
      }
      var result = crcGeneric.getValue().toJSNumber()
      console.log(result)

      expect(result).to.equal(value.checkValue.toJSNumber())
    }
  })
})
