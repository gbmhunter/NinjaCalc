import {CrcAlgorithmInfo} from './CrcAlgorithmInfo'

export var crcIds = {
  CRC_8_MAXIM: 'CRC_8_MAXIM'
}

class CrcCatalogue {
  constructor () {
    this.presetCrcAlgorithms = new Map()
    this.presetCrcAlgorithms.set(crcIds.CRC_8_MAXIM, new CrcAlgorithmInfo({
      name: 'CRC-8/MAXIM'
    }))
  }

  get = (crcId) => {
    return this.presetCrcAlgorithms.get(crcId)
  }
}
export let crcCatalogue = new CrcCatalogue()
