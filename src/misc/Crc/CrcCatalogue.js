import bigInt from 'big-integer'
import {CrcAlgorithmInfo} from './CrcAlgorithmInfo'

export var crcIds = {
  CRC_3_ROHC: 'CRC_3_ROHC',
  CRC_4_INTERLAKEN: 'CRC_4_INTERLAKEN',
  CRC_4_ITU: 'CRC_4_ITU',
  CRC_5_EPC: 'CRC_5_EPC',
  CRC_5_ITU: 'CRC_5_ITU',
  CRC_5_USB: 'CRC_5_USB',
  CRC_6_CDMA2000_A: 'CRC_6_CDMA2000_A',
  CRC_6_CDMA2000_B: 'CRC_6_CDMA2000_B',
  CRC_6_DARC: 'CRC_6_DARC',
  CRC_6_ITU: 'CRC_6_ITU',
  CRC_7: 'CRC_7',
  CRC_7_ROHC: 'CRC_7_ROHC',
  CRC_7_UMTS: 'CRC_7_UMTS',
  CRC_8_CDMA2000: 'CRC_8_CDMA2000',
  CRC_8_DARC: 'CRC_8_DARC',
  CRC_8_EBU: 'CRC_8_EBU',
  CRC_8_I_CODE: 'CRC_8_I_CODE',
  CRC_8_ITU_ATM_HEC: 'CRC_8_ITU_ATM_HEC',
  CRC_8_LTE: 'CRC_8_LTE',
  CRC_8_MAXIM: 'CRC_8_MAXIM',
  CRC_8_SAE_J1850: 'CRC_8_SAE_J1850',
  CRC_8_SMBUS: 'CRC_8_SMBUS',
  CRC_8_WCDMA: 'CRC_8_WCDMA',
  CRC_10: 'CRC_10',
  CRC_15_CAN2: 'CRC_15_CAN2',
  CRC_16_ARC_IBM: 'CRC_16_ARC_IBM',
  CRC_16_CCITT_FALSE: 'CRC_16_CCITT_FALSE',
  CRC_16_CDMA2000: 'CRC_16_CDMA2000',
  CRC_16_GENIBUS: 'CRC_16_GENIBUS',
  CRC_16_KERMIT_CCITT_TRUE: 'CRC_16_KERMIT_CCITT_TRUE',
  CRC_16_MAXIM: 'CRC_16_MAXIM',
  CRC_16_MODBUS: 'CRC_16_MODBUS',
  CRC_16_X25_IBM_SLDC_ISO_HDLC: 'CRC_16_X25_IBM_SLDC_ISO_HDLC',
  CRC_16_XMODEM_ACORN_LTE: 'CRC_16_XMODEM_ACORN_LTE',
  CRC_24_OPEN_PGP: 'CRC_24_OPEN_PGP',
  CRC_24_BLE: 'CRC_24_BLE',
  CRC_32_ADCCP_PKZIP: 'CRC_32_ADCCP_PKZIP',
  CRC_32_POSIX_CKSUM: 'CRC_32_POSIX_CKSUM',
  CRC_40_GSM: 'CRC_40_GSM',
  CRC_64: 'CRC_64'
}

class CrcCatalogue {
  constructor () {
    this.presetCrcAlgorithms = new Map()
    this.presetCrcAlgorithms.set(crcIds.CRC_3_ROHC, new CrcAlgorithmInfo({
      name: 'CRC-3/ROHC',
      crcWidthBits: 3,
      crcPolynomial: bigInt('0x3', 16),
      startingValue: bigInt('0x7', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('0x0', 16),
      checkValue: bigInt('0x6', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_4_INTERLAKEN, new CrcAlgorithmInfo({
      name: 'CRC-4/INTERLAKEN',
      crcWidthBits: 4,
      crcPolynomial: bigInt('0x3', 16),
      startingValue: bigInt('0xF', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('0xF', 16),
      checkValue: bigInt('0xB', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_4_ITU, new CrcAlgorithmInfo({
      name: 'CRC-4/ITU',
      crcWidthBits: 4,
      crcPolynomial: bigInt('0x3', 16),
      startingValue: bigInt('0x0', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('0x0', 16),
      checkValue: bigInt('0x7', 16)
    }))
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
