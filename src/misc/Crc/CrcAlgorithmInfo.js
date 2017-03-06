export class CrcAlgorithmInfo {
  constructor (initObj) {
    this.name = initObj.name
    this.crcWidthBits = initObj.crcWidthBits
    this.crcPolynomial = initObj.crcPolynomial
    this.startingValue = initObj.startingValue
    this.reflectData = initObj.reflectData
    this.reflectRemainder = initObj.reflectRemainder
    this.finalXorValue = initObj.finalXorValue
    this.checkValue = initObj.checkValue
    // console.log('this =')
    // console.log(this)
  }
}
