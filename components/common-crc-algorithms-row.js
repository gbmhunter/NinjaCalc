import React from 'react'
import { CrcGeneric } from 'utils/crc/crc-generic'

export default class CommonCrcAlgorithmsRow extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    // Get raw data, calculate CRC value
    const crcData = this.props.crcData
    const crcEnum = this.props.crcEnum

    var value = this.props.crcCatalogue.get(crcEnum)
    var crcEngine = new CrcGeneric({
      name: value.name,
      crcWidthBits: value.crcWidthBits,
      crcPolynomial: value.crcPolynomial,
      startingValue: value.startingValue,
      reflectData: value.reflectData,
      reflectRemainder: value.reflectRemainder,
      finalXorValue: value.finalXorValue,
      checkValue: value.checkValue
    })

    crcEngine.reset()
    for (var i = 0; i < crcData.length; i++) {
      crcEngine.update(crcData[i])
    }
    // Prepend '0x' at the front, as getHex() does not do this
    // for us
    const crcResult = '0x' + crcEngine.getHex()

    return (
      <tr>
        <td>{crcEngine.name}</td>
        <td><input value={crcResult} style={{ border: '0px' }} readOnly/></td>
      </tr>
    )
  }
}