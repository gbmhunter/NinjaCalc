import Head from 'next/head'
import React from 'react'

import LayoutCalc from 'components/layout-calc'
import VarRowV2 from 'components/calc-var-row'
import { CalcHelper, Validators } from 'utils/calc-helper'
import TileImage from './tile-image.png'
import { Calc } from 'utils/calc'
import { CalcVar } from 'utils/calc-var'
import { UnitsMultiplicative } from 'utils/calc-units'
import { CrcGeneric } from 'utils/crc/crc-generic'
import { crcCatalogue, crcIds } from 'utils/crc/crc-catalogue'
import { stringManipulation } from 'utils/string-manipulation/string-manipulation'

import CommonCrcAlgorithmsRow from 'components/common-crc-algorithms-row'

export var metadata = {
  id: 'crc-calculator', // Make sure this has the same name as the directory this file is in
  name: 'CRC Calculator',
  description:
    'Calculate CRC values from either a large number of popular CRC algorithms or define one yourself.',
  categories: ['Software'], // Make sure this matches the directory structure (with lower case conversion and replacement of spaces to hyphens)
  tags: ['software', 'CRC', 'algorithm', 'polynomial'],
  image: TileImage,
}

class UI extends React.Component {
  constructor(props) {
    super(props)
    let usersAlgorithmChoiceOptions = []
    for (var prop in crcIds) {
      //        console.log('obj.' + prop, '=', obj[prop]);
      usersAlgorithmChoiceOptions.push(crcIds[prop])
    }
    this.state = {
      selectedCrcAlgorithmInfo: {
        name: '',
        crcWidthBits: '',
        crcPolynomial: '',
        startingValue: '',
      },
      crcData: [],
      calc: new Calc({
        calcVars: {
          crcData: new CalcVar({
            name: 'CRC Data',
            type: 'string',
            direction: 'input',
            value: '',
            helpText: 'Input the data you wish to calculate the CRC for here.',
          }), // crcData

          crcDataType: new CalcVar({
            name: 'crcDataType',
            type: 'select',
            options: ['ASCII/Unicode', 'Hex'],
            selOption: 'ASCII/Unicode',
            helpText: 'The type of data in the "CRC Data" textbox.',
          }),

          usersAlgorithmChoice: new CalcVar({
            name: 'usersAlgorithmChoice',
            type: 'select',
            options: usersAlgorithmChoiceOptions,
            selOption: 'CRC_32_POSIX_CKSUM',
            helpText: 'The CRC algorithm you wish to use.',
          }),

          userSelectableCrcValue: new CalcVar({
            name: 'userSelectableCrcValue',
            type: 'string',
            helpText:
              'The output value of the choosen CRC algorithm, using the input data given above.',
          }),

          customCrcWidthBits: new CalcVar({
            name: 'customCrcWidthBits',         
            type: 'string',
            helpText: '',
          }),

          customCrcPolynomial: new CalcVar({            
            name: 'customCrcPolynomial',
            type: 'string',
            helpText: '',
          }),

          customCrcReflectData: new CalcVar({
            name: 'customCrcReflectData',
            type: 'checkbox',
            helpText: '',
          }),

          customCrcReflectCrcOut: new CalcVar({
            name: 'customCrcReflectCrcOut',         
            type: 'checkbox',
            helpText: '',
          }),

          customCrcInitialValue: new CalcVar({            
            name: 'customCrcInitialValue',
            type: 'string',
            helpText: '',
          }),

          customCrcXorOut: new CalcVar({            
            name: 'customCrcXorOut',
            type: 'string',
            helpText: '',
          }),

          customCrcValue: new CalcVar({            
            name: 'customCrcValue',
            type: 'string',
            helpText: '',
          }),

        }, // calcVars
        eqFn: (calcVars) => {
          const inputCrcData = calcVars.crcData.value
          const crcDataType = calcVars.crcDataType.selOption
          // Convert input data
          const crcData = this.convertCrcInputData(inputCrcData, crcDataType)
          this.setState({
            crcData: crcData,
          })

          const usersAlgorithmChoice = calcVars.usersAlgorithmChoice.selOption
          console.log('usersAlgorithmChoice = ')
          console.log(usersAlgorithmChoice)
          // We need to create a CRC engine based on the selected algorithm
          var crcAlgorithmInfo = crcCatalogue.get(usersAlgorithmChoice)

          // UPDATE THE SELECTED CRC INFO THAT IS BOUND TO UI
          let selectedCrcAlgorithmInfo = {}
          selectedCrcAlgorithmInfo.name = crcAlgorithmInfo.name
          selectedCrcAlgorithmInfo.crcWidthBits = crcAlgorithmInfo.crcWidthBits
          selectedCrcAlgorithmInfo.crcPolynomial = stringManipulation.formatHex(
            crcAlgorithmInfo.crcPolynomial.toString(16),
            crcAlgorithmInfo.crcWidthBits
          )
          selectedCrcAlgorithmInfo.startingValue = stringManipulation.formatHex(
            crcAlgorithmInfo.startingValue.toString(16),
            crcAlgorithmInfo.crcWidthBits
          )
          selectedCrcAlgorithmInfo.reflectData = crcAlgorithmInfo.reflectData
          selectedCrcAlgorithmInfo.reflectRemainder =
            crcAlgorithmInfo.reflectRemainder
          selectedCrcAlgorithmInfo.finalXorValue = stringManipulation.formatHex(
            crcAlgorithmInfo.finalXorValue.toString(16),
            crcAlgorithmInfo.crcWidthBits
          )
          selectedCrcAlgorithmInfo.checkValue = stringManipulation.formatHex(
            crcAlgorithmInfo.checkValue.toString(16),
            crcAlgorithmInfo.crcWidthBits
          )
          this.setState({
            selectedCrcAlgorithmInfo: selectedCrcAlgorithmInfo,
          })

          // Calculate CRC value
          var crcEngine = new CrcGeneric({
            name: crcAlgorithmInfo.name,
            crcWidthBits: crcAlgorithmInfo.crcWidthBits,
            crcPolynomial: crcAlgorithmInfo.crcPolynomial,
            startingValue: crcAlgorithmInfo.startingValue,
            reflectData: crcAlgorithmInfo.reflectData,
            reflectRemainder: crcAlgorithmInfo.reflectRemainder,
            finalXorValue: crcAlgorithmInfo.finalXorValue,
          })
          for (var i = 0; i < crcData.length; i++) {
            crcEngine.update(crcData[i])
          }
          // Prepend '0x' at the front, as getHex() does not do this
          // for us
          calcVars.userSelectableCrcValue.value = '0x' + crcEngine.getHex()
        },
      }), // calc
    } // this.state
    CalcHelper.initCalc(this.state.calc)
  }

  componentDidMount() {
    // MathJax not defined during tests
    if (typeof MathJax !== 'undefined')
      MathJax.Hub.Queue(['Typeset', MathJax.Hub])

    // Hacky, this is already called in the constructor!
    CalcHelper.initCalc(this.state.calc)
  } // componentDidMount()

  convertCrcInputData(crcDataString, inputDataType) {
    // Convert this string into a list of integers
    var buffer = []
    var i
    if (inputDataType === 'ASCII/Unicode') {
      for (i = 0; i < crcDataString.length; i++) {
        var currentChar = crcDataString.charCodeAt(i)

        // Convert the character into it's equivalent Unicode integer
        // Note: Since Unicode is a complete superset of ASCII, this will
        // work for ASCII characters to
        buffer.push(currentChar)
      }
    } else if (inputDataType === 'Hex') {
      console.log('inputDataType === Hex')
      console.log(crcDataString)
      // Note: i gets incremented each time by 2
      for (i = 0; i < crcDataString.length; i += 2) {
        console.log('i = ' + i)
        var hexByte
        // Special case if string length is odd, for the last value we
        // have to extract just one character
        if (crcDataString.length - i === 1) {
          hexByte = crcDataString.substring(i, i + 1)
        } else {
          // Extract 2-character strings from the CRC data
          hexByte = crcDataString.substring(i, i + 2)
        }

        var integerValueOfHex = parseInt(hexByte, 16)

        if (isNaN(integerValueOfHex)) {
          // We will get here if the input data is not valid hex, e.g. it has
          // characters after f in the input
          //                crcDataCalcVar.validationResults.add(
          //                  new CalcValidationResult(
          //                    CalcValidationLevels.Error,
          //                    "Input data is not valid. If in \"Hex\"mode, data must contain only the numerals 0-9 and the characters A-F. Do not add \"0x\"to the start of the hex number."));
          //                crcDataCalcVar.worstValidationLevel = CalcValidationLevels.Error;
          //                crcDataCalcVar.updateUIBasedOnValidationResults();
          console.log('isNaN!')

          return []
        }
        buffer.push(integerValueOfHex)
      }
    }
    // If we make it to here, everything was o.k.
    //          crcDataCalcVar.validationResults.clear();
    //          crcDataCalcVar.worstValidationLevel = CalcValidationLevels.Ok;
    //          crcDataCalcVar.updateUIBasedOnValidationResults();
    console.log('Converted CRC data =')
    console.log(buffer)
    return buffer
  }

  valueChanged = (e) => {
    console.log('valueChanged() called.')
    let calc = this.state.calc
    CalcHelper.handleValueChanged(calc, e)
    this.setState({
      calc: calc,
    })
  }

  unitsChanged = (e) => {
    let calc = this.state.calc
    CalcHelper.handleUnitsChanged(calc, e)
    this.setState({
      calc: calc,
    })
  }

  rbChanged = (e) => {
    let calc = this.state.calc
    CalcHelper.handleRbChanged(calc, e)
    this.setState({
      calc: calc,
    })
  }

  render = () => {
    // Area of ring = pi * inner diameter * thickness
    const calcVars = this.state.calc.calcVars
    const varWidth = 100

    let crcDataTypeOptions = calcVars.crcDataType.options.map((option, idx) => {
      return <option key={idx}>{option}</option>
    })

    let usersAlgorithmChoiceOptions = calcVars.usersAlgorithmChoice.options.map(
      (option, idx) => {
        return <option key={idx}>{option}</option>
      }
    )

    const selectedCrcAlgorithmInfo = this.state.selectedCrcAlgorithmInfo

    return (
      <LayoutCalc title={metadata.name + ' Calculator'}>
        <Head>
          <title>{metadata.name}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="vbox outer-wrapper">
          <div className="calc-notes">
            <p>
              This calculator takes in the provided data (as either
              ASCII/Unicode or hex) and calculates the resulting CRC value using
              a range of popular CRC algorithms.
            </p>

            <p>
              When the ASCII/Unicode radiobutton is selected, values entered
              into the CRC data textbox will be treated as ASCII/Unicode
              characters. These characters will then be converted to their
              corresponding Unicode integer values. (Unicode is a complete
              superset of ASCII, so all ASCII characters map to the same integer
              values as Unicode characters).
            </p>
          </div>{' '}
          {/* calc-notes */}
          {/*
          ===========================================================================================
          ========================================= INPUT DATA ======================================
          ===========================================================================================
          */}
          <div
            id="input-data"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <div style={{ alignSelf: 'center' }}>CRC Data</div>
              <div style={{ width: '10px' }}></div>
              <input
                name="crcData"
                value={calcVars.crcData.value}
                onChange={this.valueChanged}
                style={{ width: '400px' }}
              />
            </div>

            <div style={{ height: '10px' }}></div>
            <div style={{ display: 'flex', margin: 'auto' }}>
              <div style={{ alignSelf: 'center' }}>Data Format</div>
              <div style={{ width: '10px' }}></div>
              <select
                temp="crcDataType"
                temp2="calc.getVar('crcDataType').onValChange()"
                style={{ width: '150px', height: '30px', fontSize: '14px' }}
              >
                {crcDataTypeOptions}
              </select>
            </div>
          </div>
          <div style={{ height: 20 }}></div>
          <div id="common-and-user-selectable-hdiv" style={{ display: 'flex' }}>
            {/*
            ===========================================================================================
            =================================== COMMON CRC ALGORITHMS =================================
            ===========================================================================================
            */}
            <div id="common-crc-algorithms" className="section-container">
              <span className="section-title">Common CRC Algorithms</span>
              <table>
                <tbody>
                  <tr className="header-row">
                    <td>CRC Name</td>
                    <td>CRC Value</td>
                  </tr>
                  <CommonCrcAlgorithmsRow
                    crcCatalogue={crcCatalogue}
                    crcData={this.state.crcData}
                    crcEnum={crcIds.CRC_8_MAXIM}
                  ></CommonCrcAlgorithmsRow>
                  <CommonCrcAlgorithmsRow
                    crcCatalogue={crcCatalogue}
                    crcData={this.state.crcData}
                    crcEnum={crcIds.CRC_8_SMBUS}
                  ></CommonCrcAlgorithmsRow>
                  <CommonCrcAlgorithmsRow
                    crcCatalogue={crcCatalogue}
                    crcData={this.state.crcData}
                    crcEnum={crcIds.CRC_16_CCITT_FALSE}
                  ></CommonCrcAlgorithmsRow>
                  <CommonCrcAlgorithmsRow
                    crcCatalogue={crcCatalogue}
                    crcData={this.state.crcData}
                    crcEnum={crcIds.CRC_16_KERMIT_CCITT_TRUE}
                  ></CommonCrcAlgorithmsRow>
                  <CommonCrcAlgorithmsRow
                    crcCatalogue={crcCatalogue}
                    crcData={this.state.crcData}
                    crcEnum={crcIds.CRC_16_MAXIM}
                  ></CommonCrcAlgorithmsRow>
                  <CommonCrcAlgorithmsRow
                    crcCatalogue={crcCatalogue}
                    crcData={this.state.crcData}
                    crcEnum={crcIds.CRC_16_MODBUS}
                  ></CommonCrcAlgorithmsRow>
                </tbody>
              </table>
            </div>
            {/*
          =========================================================================================== -->
          ================================= USER SELECTABLE ALGORITHM =============================== -->
          =========================================================================================== -->
          */}
            <div
              id="user-selectable-algorithm"
              className="section-container"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <span className="section-title">User Selectable Algorithm</span>

              <table>
                <tbody>
                  <tr>
                    <td>Algorithm</td>
                    <td>CRC Value</td>
                  </tr>
                  <tr>
                    <td>
                      <select
                        name="usersAlgorithmChoice"
                        value={calcVars.usersAlgorithmChoice.selOption}
                        onChange={this.valueChanged}
                        style={{
                          width: '200px',
                          height: '30px',
                          fontSize: '14px',
                        }}
                      >
                        {usersAlgorithmChoiceOptions}
                      </select>
                    </td>
                    <td>
                      <input
                        value={calcVars.userSelectableCrcValue.value}
                        style={{ width: '200' }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ height: '10px' }}></div>

              {/* ADDITIONAL INFORMATION TABLE */}
              <table id="additional-information-table">
                <tbody>
                  <tr>
                    <td>Name:</td>
                    <td>{selectedCrcAlgorithmInfo.name}</td>
                  </tr>
                  <tr>
                    <td>CRC Width (bits):</td>
                    <td>{selectedCrcAlgorithmInfo.crcWidthBits}</td>
                  </tr>
                  <tr>
                    <td>Generator Polynomial:</td>
                    <td>{'0x' + selectedCrcAlgorithmInfo.crcPolynomial}</td>
                  </tr>
                  <tr>
                    <td>Generator Polynomial:</td>
                    <td>{'0x' + selectedCrcAlgorithmInfo.crcPolynomial}</td>
                  </tr>
                  <tr>
                    <td>Starting Value:</td>
                    <td>{'0x' + selectedCrcAlgorithmInfo.startingValue}</td>
                  </tr>
                  <tr>
                    <td>Reflect Data:</td>
                    <td>
                      {selectedCrcAlgorithmInfo.reflectData ? 'True' : 'False'}
                    </td>
                  </tr>
                  <tr>
                    <td>Reflect CRC Out:</td>
                    <td>
                      {selectedCrcAlgorithmInfo.reflectRemainder
                        ? 'True'
                        : 'False'}
                    </td>
                  </tr>
                  <tr>
                    <td>XOR Out:</td>
                    <td>{'0x' + selectedCrcAlgorithmInfo.finalXorValue}</td>
                  </tr>
                  <tr>
                    <td>Check:</td>
                    <td>{'0x' + selectedCrcAlgorithmInfo.checkValue}</td>
                  </tr>
                </tbody>
              </table>
            </div>{' '}
            {/* user-selectable-algorithm */}
          </div>{' '}
          {/* common-and-user-selectable-hdiv */}
          {/*
          =============================================================================
          ============================= CUSTOM CRC ALGORITHM ==========================
          =============================================================================
          */}
          <div
            id="custom-crc-algorithm"
            className="section-container"
            style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="section-title">Custom Algorithm</span>
            <table style={{ margin: 'auto' }}>
              <tbody>
                <tr>
                  <td>CRC Width (bits):</td>
                  <td><input name="customCrcWidthBits" value={calcVars.customCrcWidthBits.value}/></td>
                  <td>Generator Polynomial:</td>
                  <td>0x</td>
                  <td>
                    <input
                      name="customCrcPolynomial" value={calcVars.customCrcPolynomial.value}
                      style={{ width: "200" }} />
                  </td>
                </tr>
                <tr>
                  <td>Reflect Data:</td>
                  <td>
                    <input name="customCrcReflectData" type="checkbox" value={calcVars.customCrcReflectData.value} />
                  </td>
                  <td>Init Value:</td>
                  <td>0x</td>
                  <td>
                    <input
                      name="customCrcInitialValue"
                      value={calcVars.customCrcInitialValue.value}
                      style={{ width: "200" }}/>                  
                  </td>
                </tr>
                <tr>
                  <td>Reflect CRC Out:</td>
                  <td>
                    <input name="customCrcReflectCrcOut" value={calcVars.customCrcReflectCrcOut.value}/>
                  </td>
                  <td>XOR Out:</td>
                  <td>0x</td>
                  <td>
                    <input
                      name="customCrcXorOut"
                      value={calcVars.customCrcXorOut.value}
                      style={{ width: "200" }}/>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ height: '15px' }}></div>
            <div style={{ display: 'flex', margin: 'auto' }}>
              <span style={{ alignSelf: 'center' }}>CRC Value: 0x </span>
              <input
                name="customCrcValue"
                style={{ width: "300" }}/>
            </div>
          </div>
        </div>
        <style jsx>{`
          .calc-notes {
            max-width: 700px;
          }

          #crc-calculator .section-title {
            font-weight: bold;
          }

          # {
            font-size: 0.9rem;
          }

          div.section-container {
            margin: 10px;
            padding: 10px;

            border-style: solid;
            border-color: #b9b9b9;
            border-width: 2px;
            border-radius: 5px;
          }

          .header-row {
            font-style: italic;
          }

          table td {
            text-align: left;
          }

          /* This targets the second column of the additional information table */
          #additional-information-table td:first-child + td {
            color: #989898;
            text-align: left;
          }
        `}</style>
      </LayoutCalc>
    )
  }
}

export default UI
