import bigInt from 'big-integer'
import {CrcAlgorithmInfo} from './CrcAlgorithmInfo'

export var crcIds = {
  CRC_8_MAXIM: 'CRC_8_MAXIM'
}

class CrcCatalogue {
  constructor () {
    this.presetCrcAlgorithms = new Map()
    this.presetCrcAlgorithms.set(crcIds.CRC_8_MAXIM, new CrcAlgorithmInfo({
      name: 'CRC-8/MAXIM',
      crcWidthBits: 8,
      crcPolynomial: bigInt('0x31', 16),
      startingValue: bigInt('0x00', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('0x00', 16),
      checkValue: bigInt('0xA1', 16)
    }))
  }

  get = (crcId) => {
    return this.presetCrcAlgorithms.get(crcId)
  }
}
export let crcCatalogue = new CrcCatalogue()
