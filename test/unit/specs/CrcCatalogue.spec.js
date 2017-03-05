// var bigInt = require('big-integer')
import {crcCatalogue, crcIds} from 'src/misc/Crc/CrcCatalogue'

describe('CrcCatalogue object tests.', function () {
  it('CRC algorithm name can be retrieved correctly.', function () {
    expect(crcCatalogue.get(crcIds.CRC_8_MAXIM).name).to.equal('CRC-8/MAXIM')
  })
})
