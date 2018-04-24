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
      crcPolynomial: bigInt('3', 16),
      startingValue: bigInt('7', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('0', 16),
      checkValue: bigInt('6', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_4_INTERLAKEN, new CrcAlgorithmInfo({
      name: 'CRC-4/INTERLAKEN',
      crcWidthBits: 4,
      crcPolynomial: bigInt('3', 16),
      startingValue: bigInt('F', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('F', 16),
      checkValue: bigInt('B', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_4_ITU, new CrcAlgorithmInfo({
      name: 'CRC-4/ITU',
      crcWidthBits: 4,
      crcPolynomial: bigInt('3', 16),
      startingValue: bigInt('0', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('0', 16),
      checkValue: bigInt('7', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_5_EPC, new CrcAlgorithmInfo({
      name: 'CRC-5/EPC',
      crcWidthBits: 5,
      crcPolynomial: bigInt('09', 16),
      startingValue: bigInt('09', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('00', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_5_ITU, new CrcAlgorithmInfo({
      name: 'CRC-5/ITU',
      crcWidthBits: 5,
      crcPolynomial: bigInt('15', 16),
      startingValue: bigInt('00', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('07', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_5_USB, new CrcAlgorithmInfo({
      name: 'CRC-5/USB',
      crcWidthBits: 5,
      crcPolynomial: bigInt('05', 16),
      startingValue: bigInt('1F', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('1F', 16),
      checkValue: bigInt('19', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_6_CDMA2000_A, new CrcAlgorithmInfo({
      name: 'CRC-6/CDMA2000-A',
      crcWidthBits: 6,
      crcPolynomial: bigInt('27', 16),
      startingValue: bigInt('3F', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('0D', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_6_CDMA2000_B, new CrcAlgorithmInfo({
      name: 'CRC-6/CDMA2000-B',
      crcWidthBits: 6,
      crcPolynomial: bigInt('07', 16),
      startingValue: bigInt('3F', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('3B', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_6_DARC, new CrcAlgorithmInfo({
      name: 'CRC-6/DARC',
      crcWidthBits: 6,
      crcPolynomial: bigInt('19', 16),
      startingValue: bigInt('00', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('26', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_6_ITU, new CrcAlgorithmInfo({
      name: 'CRC-6/ITU',
      crcWidthBits: 6,
      crcPolynomial: bigInt('03', 16),
      startingValue: bigInt('00', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('06', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_7, new CrcAlgorithmInfo({
      name: 'CRC-7',
      crcWidthBits: 7,
      crcPolynomial: bigInt('09', 16),
      startingValue: bigInt('00', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('75', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_7_ROHC, new CrcAlgorithmInfo({
      name: 'CRC-7/ROHC',
      crcWidthBits: 7,
      crcPolynomial: bigInt('4F', 16),
      startingValue: bigInt('7F', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('53', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_7_UMTS, new CrcAlgorithmInfo({
      name: 'CRC-7/UMTS',
      crcWidthBits: 7,
      crcPolynomial: bigInt('45', 16),
      startingValue: bigInt('00', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('61', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_8_CDMA2000, new CrcAlgorithmInfo({
      name: 'CRC-8/CDMA2000',
      crcWidthBits: 8,
      crcPolynomial: bigInt('9B', 16),
      startingValue: bigInt('FF', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('DA', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_8_DARC, new CrcAlgorithmInfo({
      name: 'CRC-8/DARC',
      crcWidthBits: 8,
      crcPolynomial: bigInt('39', 16),
      startingValue: bigInt('00', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('15', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_8_EBU, new CrcAlgorithmInfo({
      name: 'CRC-8/EBU, CRC-8/AES',
      crcWidthBits: 8,
      crcPolynomial: bigInt('1D', 16),
      startingValue: bigInt('FF', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('97', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_8_I_CODE, new CrcAlgorithmInfo({
      name: 'CRC-8/I-CODE',
      crcWidthBits: 8,
      crcPolynomial: bigInt('1D', 16),
      startingValue: bigInt('FD', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('7E', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_8_ITU_ATM_HEC, new CrcAlgorithmInfo({
      name: 'CRC-8/ITU, ATM HEC',
      crcWidthBits: 8,
      crcPolynomial: bigInt('07', 16),
      startingValue: bigInt('00', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('55', 16),
      checkValue: bigInt('A1', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_8_LTE, new CrcAlgorithmInfo({
      name: 'CRC-8/LTE',
      crcWidthBits: 8,
      crcPolynomial: bigInt('9B', 16),
      startingValue: bigInt('00', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('EA', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_8_MAXIM, new CrcAlgorithmInfo({
      name: 'CRC-8/MAXIM',
      crcWidthBits: 8,
      crcPolynomial: bigInt('31', 16),
      startingValue: bigInt('00', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('A1', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_8_SAE_J1850, new CrcAlgorithmInfo({
      name: 'CRC-8/SAE-J1850',
      crcWidthBits: 8,
      crcPolynomial: bigInt('1D', 16),
      startingValue: bigInt('FF', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('FF', 16),
      checkValue: bigInt('4B', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_8_SMBUS, new CrcAlgorithmInfo({
      name: 'CRC-8/SMBus',
      crcWidthBits: 8,
      crcPolynomial: bigInt('07', 16),
      startingValue: bigInt('00', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('F4', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_8_WCDMA, new CrcAlgorithmInfo({
      name: 'CRC-8/WCDMA',
      crcWidthBits: 8,
      crcPolynomial: bigInt('9B', 16),
      startingValue: bigInt('00', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('00', 16),
      checkValue: bigInt('25', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_10, new CrcAlgorithmInfo({
      name: 'CRC-10',
      crcWidthBits: 10,
      crcPolynomial: bigInt('233', 16),
      startingValue: bigInt('000', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('000', 16),
      checkValue: bigInt('199', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_15_CAN2, new CrcAlgorithmInfo({
      name: 'CRC-15, CAN2.0',
      crcWidthBits: 15,
      crcPolynomial: bigInt('4599', 16),
      startingValue: bigInt('0000', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('0000', 16),
      checkValue: bigInt('059E', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_16_ARC_IBM, new CrcAlgorithmInfo({
      name: 'CRC-16/IBM/ARC/LHA',
      crcWidthBits: 16,
      crcPolynomial: bigInt('8005', 16),
      startingValue: bigInt('0000', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('0000', 16),
      checkValue: bigInt('BB3D', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_16_CCITT_FALSE, new CrcAlgorithmInfo({
      name: 'CRC-16/CCITT-FALSE',
      crcWidthBits: 16,
      crcPolynomial: bigInt('1021', 16),
      startingValue: bigInt('FFFF', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('0000', 16),
      checkValue: bigInt('29B1', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_16_CDMA2000, new CrcAlgorithmInfo({
      name: 'CRC-16/CDMA-2000',
      crcWidthBits: 16,
      crcPolynomial: bigInt('C867', 16),
      startingValue: bigInt('FFFF', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('0000', 16),
      checkValue: bigInt('4C06', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_16_GENIBUS, new CrcAlgorithmInfo({
      name: 'CRC-16/GENIBUS',
      crcWidthBits: 16,
      crcPolynomial: bigInt('1021', 16),
      startingValue: bigInt('FFFF', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('FFFF', 16),
      checkValue: bigInt('D64E', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_16_KERMIT_CCITT_TRUE, new CrcAlgorithmInfo({
      name: 'CRC-16/KERMIT/CCITT-TRUE',
      crcWidthBits: 16,
      crcPolynomial: bigInt('1021', 16),
      startingValue: bigInt('0000', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('0000', 16),
      checkValue: bigInt('2189', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_16_MAXIM, new CrcAlgorithmInfo({
      name: 'CRC-16/MAXIM',
      crcWidthBits: 16,
      crcPolynomial: bigInt('8005', 16),
      startingValue: bigInt('0000', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('FFFF', 16),
      checkValue: bigInt('44C2', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_16_MODBUS, new CrcAlgorithmInfo({
      name: 'CRC-16/MODBUS',
      crcWidthBits: 16,
      crcPolynomial: bigInt('8005', 16),
      startingValue: bigInt('FFFF', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('0000', 16),
      checkValue: bigInt('4B37', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_16_X25_IBM_SLDC_ISO_HDLC, new CrcAlgorithmInfo({
      name: 'CRC-16/X25/IBM-SLDC/ISO-HDLC/CRC-B',
      crcWidthBits: 16,
      crcPolynomial: bigInt('1021', 16),
      startingValue: bigInt('FFFF', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('FFFF', 16),
      checkValue: bigInt('906E', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_16_XMODEM_ACORN_LTE, new CrcAlgorithmInfo({
      name: 'CRC-16/XMODEM/ACORN/LTE',
      crcWidthBits: 16,
      crcPolynomial: bigInt('1021', 16),
      startingValue: bigInt('0000', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('0000', 16),
      checkValue: bigInt('31C3', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_24_OPEN_PGP, new CrcAlgorithmInfo({
      name: 'CRC-24/OPENPGP',
      crcWidthBits: 24,
      crcPolynomial: bigInt('864CFB', 16),
      startingValue: bigInt('B704CE', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('000000', 16),
      checkValue: bigInt('21CF02', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_24_BLE, new CrcAlgorithmInfo({
      name: 'CRC-24/BLE',
      crcWidthBits: 24,
      crcPolynomial: bigInt('00065B', 16),
      startingValue: bigInt('555555', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('000000', 16),
      checkValue: bigInt('C25A56', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_32_ADCCP_PKZIP, new CrcAlgorithmInfo({
      name: 'CRC-32/ADCCP/PKZIP',
      crcWidthBits: 32,
      crcPolynomial: bigInt('04C11DB7', 16),
      startingValue: bigInt('FFFFFFFF', 16),
      reflectData: true,
      reflectRemainder: true,
      finalXorValue: bigInt('FFFFFFFF', 16),
      checkValue: bigInt('CBF43926', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_32_POSIX_CKSUM, new CrcAlgorithmInfo({
      name: 'CRC-32/POSIX/CKSUM',
      crcWidthBits: 32,
      crcPolynomial: bigInt('04C11DB7', 16),
      startingValue: bigInt('00000000', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('FFFFFFFF', 16),
      checkValue: bigInt('765E7680', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_40_GSM, new CrcAlgorithmInfo({
      name: 'CRC-40/GSM',
      crcWidthBits: 40,
      crcPolynomial: bigInt('0004820009', 16),
      startingValue: bigInt('0000000000', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('FFFFFFFFFF', 16),
      checkValue: bigInt('D4164FC646', 16)
    }))
    this.presetCrcAlgorithms.set(crcIds.CRC_64, new CrcAlgorithmInfo({
      name: 'CRC-64',
      crcWidthBits: 64,
      crcPolynomial: bigInt('42F0E1EBA9EA3693', 16),
      startingValue: bigInt('0000000000000000', 16),
      reflectData: false,
      reflectRemainder: false,
      finalXorValue: bigInt('0000000000000000', 16),
      checkValue: bigInt('6C40DF5F0B497347', 16)
    }))
  }

  get = (crcId) => {
    return this.presetCrcAlgorithms.get(crcId)
  }
}
export let crcCatalogue = new CrcCatalogue()
