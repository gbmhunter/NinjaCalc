const PresetCrcAlgorithms = {
  CRC_8_MAXIM,
}

class CrcCatalogue {
  constructor () {
    this.presetCrcAlgorithms = new Map()
  }
}
export let crcCatalogue = new CrcCatalogue();
