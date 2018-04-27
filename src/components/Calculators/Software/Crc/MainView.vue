<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div id="crc-calculator" class="calculator-container" style="display: flex; flex-direction: column;">

    <InfoCollapsible title="Info" class="calc-info" style="max-width: 600px; margin: auto;">
      <p>This calculator takes in the provided data (as either ASCII/Unicode or hex) and calculates the resulting CRC
        value using a range of popular CRC algorithms.</p>

      <p>When the ASCII/Unicode radiobutton is selected, values entered into the CRC data textbox will be treated as
        ASCII/Unicode characters. These characters will then be converted to their corresponding Unicode integer values.
        (Unicode is a complete superset of ASCII, so all ASCII characters map to the same integer values as Unicode
        characters).</p>

    </InfoCollapsible>

    <!-- =========================================================================================== -->
    <!-- ========================================= INPUT DATA ====================================== -->
    <!-- =========================================================================================== -->

    <div id="input-data" style="display: flex; flex-direction: column; align-content: center;">
      <div style="display: flex; justify-content: center; align-content: center;">
        <div style="align-self: center;">CRC Data</div>
        <div style="width: 10px;"></div>
        <calc-var-string :calcVar="calc.getVar('crcData')" :width=400></calc-var-string>
      </div>
      <!-- SPACER -->
      <div style="height: 10px;"></div>
      <div style="display: flex; margin: auto;">
        <div style="align-self: center;">Data Format</div>
        <div style="width: 10px;"></div>
        <select v-model="calc.getVar('crcDataType').val" v-on:change="calc.getVar('crcDataType').onValChange()"
                style="width: 150px; height: 30px; font-size: 14px;">
          <option v-for="option in calc.getVar('crcDataType').options" :key="option" v-bind:value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>

    <div id="common-and-user-selectable-hdiv" style="display: flex;">
      <!-- =========================================================================================== -->
      <!-- =================================== COMMON CRC ALGORITHMS ================================= -->
      <!-- =========================================================================================== -->
      <div id="common-crc-algorithms" class="section-container">
        <span class="section-title">Common CRC Algorithms</span>
        <table>
          <tr class="header-row">
            <td>CRC Name</td>
            <td>CRC Value</td>
          </tr>
          <common-crc-algorithms-row :calc="calc" :crcCatalogue="crcCatalogue"
                                     :crcEnum="crcIds.CRC_8_MAXIM"></common-crc-algorithms-row>
          <common-crc-algorithms-row :calc="calc" :crcCatalogue="crcCatalogue"
                                     :crcEnum="crcIds.CRC_8_SMBUS"></common-crc-algorithms-row>
          <common-crc-algorithms-row :calc="calc" :crcCatalogue="crcCatalogue"
                                     :crcEnum="crcIds.CRC_16_CCITT_FALSE"></common-crc-algorithms-row>
          <common-crc-algorithms-row :calc="calc" :crcCatalogue="crcCatalogue"
                                     :crcEnum="crcIds.CRC_16_KERMIT_CCITT_TRUE"></common-crc-algorithms-row>
          <common-crc-algorithms-row :calc="calc" :crcCatalogue="crcCatalogue"
                                     :crcEnum="crcIds.CRC_16_MAXIM"></common-crc-algorithms-row>
          <common-crc-algorithms-row :calc="calc" :crcCatalogue="crcCatalogue"
                                     :crcEnum="crcIds.CRC_16_MODBUS"></common-crc-algorithms-row>
        </table>
      </div>

      <!-- =========================================================================================== -->
      <!-- ================================= USER SELECTABLE ALGORITHM =============================== -->
      <!-- =========================================================================================== -->
      <div id="user-selectable-algorithm" class="section-container" style="display: flex; flex-direction: column;">
        <span class="section-title">User Selectable Algorithm</span>

        <table>
          <tr>
            <td>Algorithm</td>
            <td>CRC Value</td>
          </tr>
          <tr>
            <td><select v-model="calc.getVar('usersAlgorithmChoice').val"
                        v-on:change="calc.getVar('usersAlgorithmChoice').onValChange()"
                        style="width: 200px; height: 30px; font-size: 14px;">
              <option v-for="option in calc.getVar('usersAlgorithmChoice').options" :key="option" v-bind:value="option">
                {{ option }}
              </option>
            </select></td>
            <td>
              <calc-var-string :calcVar="calc.getVar('userSelectableCrcValue')" :width=200></calc-var-string>
            </td>
          </tr>
        </table>

        <div style="height: 10px;"></div>

        <!-- ADDITIONAL INFORMATION TABLE -->
        <table id="additional-information-table">
          <tr>
            <td>Name:</td>
            <td>{{selectedCrcAlgorithmInfo.name}}</td>
          </tr>
          <tr>
            <td>CRC Width (bits):</td>
            <td>{{selectedCrcAlgorithmInfo.crcWidthBits}}</td>
          </tr>
          <tr>
            <td>Generator Polynomial:</td>
            <td>{{'0x' + selectedCrcAlgorithmInfo.crcPolynomial}}</td>
          </tr>
          <tr>
            <td>Generator Polynomial:</td>
            <td>{{'0x' +selectedCrcAlgorithmInfo.crcPolynomial}}</td>
          </tr>
          <tr>
            <td>Starting Value:</td>
            <td>{{'0x' + selectedCrcAlgorithmInfo.startingValue}}</td>
          </tr>
          <tr>
            <td>Reflect Data:</td>
            <td>{{selectedCrcAlgorithmInfo.reflectData}}</td>
          </tr>
          <tr>
            <td>Reflect CRC Out:</td>
            <td>{{selectedCrcAlgorithmInfo.reflectRemainder}}</td>
          </tr>
          <tr>
            <td>XOR Out:</td>
            <td>{{'0x' + selectedCrcAlgorithmInfo.finalXorValue}}</td>
          </tr>
          <tr>
            <td>Check:</td>
            <td>{{'0x' + selectedCrcAlgorithmInfo.checkValue}}</td>
          </tr>
        </table>

      </div>
    </div>
    <custom-crc-algorithm :calc="calc"></custom-crc-algorithm>

  </div>

</template>

<script>
import Calc from '@/misc/CalculatorEngineV2/Calc'
import { CalcVarString } from '@/misc/CalculatorEngineV2/CalcVarString'
import { CalcVarComboBox } from '@/misc/CalculatorEngineV2/CalcVarComboBox'
import { CalcVarInvisible } from '@/misc/CalculatorEngineV2/CalcVarInvisible'
import { CustomValidator } from '@/misc/CalculatorEngineV2/CustomValidator'

import { CrcGeneric } from '@/misc/Crc/CrcGeneric'
import { crcCatalogue, crcIds } from '@/misc/Crc/CrcCatalogue'

import { stringManipulation } from '@/misc/StringManipulation/StringManipulation'

import CommonCrcAlgorithmsRow from './CommonCrcAlgorithmsRow'
import CustomCrcAlgorithm from './CustomCrcAlgorithm'

// ============================================ //
// =================== vue Object ============= //
// ============================================ //
export default {
  name: 'crc-calculator',
  components: {
    CommonCrcAlgorithmsRow,
    CustomCrcAlgorithm
  },
  data: function () {
    var calc = new Calc()

    // Create new variable in class for determining what is input and output
    calc.outputVar = 'resistance'

    // ============================================ //
    // ========== CRC DATA (string input) ========= //
    // ============================================ //
    calc.addVar(
      new CalcVarString({
        name: 'crcData',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {},
        defaultVal: '',
        validators: [
          // This is essentially to make sure it is hex, but ONLY if the
          // data format of 'Hex' has been selected
          new CustomValidator({
            func: () => {
              // Read dependency variables
              const crcData = this.calc.getVar('crcData').getVal()
              const crcDataFormat = this.calc.getVar('crcDataType').getVal()

              // This validator is only converned with validating hex, so return if it
              // is not in hex format
              if (crcDataFormat !== 'Hex') return true

              if (stringManipulation.isHex(crcData)) {
                return true
              } else {
                return false
              }
            },
            text:
              'Value must be valid "hex" number. Only the numbers 0-9 and characters A-F are allowed (and no "0x" prefix).',
            level: 'error'
          })
        ],
        helpText: 'Input the data you wish to calculate the CRC for here.'
      })
    )

    // ============================================ //
    // ========= CRC DATA TYPE (combobox) ========= //
    // ============================================ //
    calc.addVar(
      new CalcVarComboBox({
        name: 'crcDataType',
        options: ['ASCII/Unicode', 'Hex'],
        defaultVal: 'ASCII/Unicode',
        validators: [],
        helpText: 'The type of data in the "CRC Data" textbox.'
      })
    )

    // ============================================ //
    // ======= CONVERTED CRC DATA (invisible) ===== //
    // ============================================ //
    calc.addVar(
      new CalcVarInvisible({
        name: 'convertedCrcData',
        eqn: () => {
          const crcDataString = calc.getVar('crcData').getVal()
          console.log('crcDataString = ' + crcDataString)
          const inputDataType = calc.getVar('crcDataType').getVal()

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
        },
        defaultVal: '',
        validators: []
      })
    )

    // ============================================ //
    // ==== USER SELECTABLE ALGORITHM COMBOBOX ==== //
    // ============================================ //
    var userSelectableCrcAlgorithmVar = new CalcVarComboBox({
      name: 'usersAlgorithmChoice',
      options: [],
      defaultVal: 'CRC_32_POSIX_CKSUM',
      validators: [],
      helpText: 'The CRC algorithm you wish to use.'
    })
    //      crcCatalogue.presetCrcAlgorithms.forEach(function (value, key, map) {
    //        userSelectableCrcAlgorithmVar.options.push(value.name)
    //      })
    for (var prop in crcIds) {
      //        console.log('obj.' + prop, '=', obj[prop]);
      userSelectableCrcAlgorithmVar.options.push(crcIds[prop])
    }
    calc.addVar(userSelectableCrcAlgorithmVar)

    // ============================================ //
    // ========= USER SELECTABLE CRC VALUE ======== //
    // ============================================ //
    calc.addVar(
      new CalcVarString({
        name: 'userSelectableCrcValue',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          const crcData = this.calc.getVar('convertedCrcData').getVal()
          const usersAlgorithmChoice = this.calc
            .getVar('usersAlgorithmChoice')
            .getVal()
          console.log('usersAlgorithmChoice = ')
          console.log(usersAlgorithmChoice)
          // We need to create a CRC engine based on the selected algorithm
          var crcAlgorithmInfo = crcCatalogue.get(usersAlgorithmChoice)

          // UPDATE THE SELECTED CRC INFO THAT IS BOUND TO UI
          this.selectedCrcAlgorithmInfo.name = crcAlgorithmInfo.name
          this.selectedCrcAlgorithmInfo.crcWidthBits =
            crcAlgorithmInfo.crcWidthBits
          this.selectedCrcAlgorithmInfo.crcPolynomial = stringManipulation.formatHex(
            crcAlgorithmInfo.crcPolynomial.toString(16),
            crcAlgorithmInfo.crcWidthBits
          )
          this.selectedCrcAlgorithmInfo.startingValue = stringManipulation.formatHex(
            crcAlgorithmInfo.startingValue.toString(16),
            crcAlgorithmInfo.crcWidthBits
          )
          this.selectedCrcAlgorithmInfo.reflectData =
            crcAlgorithmInfo.reflectData
          this.selectedCrcAlgorithmInfo.reflectRemainder =
            crcAlgorithmInfo.reflectRemainder
          this.selectedCrcAlgorithmInfo.finalXorValue = stringManipulation.formatHex(
            crcAlgorithmInfo.finalXorValue.toString(16),
            crcAlgorithmInfo.crcWidthBits
          )
          this.selectedCrcAlgorithmInfo.checkValue = stringManipulation.formatHex(
            crcAlgorithmInfo.checkValue.toString(16),
            crcAlgorithmInfo.crcWidthBits
          )

          var crcEngine = new CrcGeneric({
            name: crcAlgorithmInfo.name,
            crcWidthBits: crcAlgorithmInfo.crcWidthBits,
            crcPolynomial: crcAlgorithmInfo.crcPolynomial,
            startingValue: crcAlgorithmInfo.startingValue,
            reflectData: crcAlgorithmInfo.reflectData,
            reflectRemainder: crcAlgorithmInfo.reflectRemainder,
            finalXorValue: crcAlgorithmInfo.finalXorValue
          })
          for (var i = 0; i < crcData.length; i++) {
            crcEngine.update(crcData[i])
          }
          // Prepend '0x' at the front, as getHex() does not do this
          // for us
          return '0x' + crcEngine.getHex()
        },
        defaultVal: '',
        validators: [],
        helpText:
          'The output value of the choosen CRC algorithm, using the input data given above.'
      })
    )

    return {
      calc: calc,
      crcCatalogue: crcCatalogue,
      crcIds: crcIds,
      selectedCrcAlgorithmInfo: {
        name: '',
        crcWidthBits: '',
        crcPolynomial: '',
        startingValue: ''
      }
    }
  },
  mounted () {
    // calc.init() has to be done after mount, as calculator variables
    // are created by some of the UI elements (incl. <common-crc-algorithms-row>)
    this.calc.init()
  }
}
</script>

<style>
#crc-calculator .section-title {
  font-weight: bold;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
