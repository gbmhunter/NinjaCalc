<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container">

    <ui-collapsible title="Info" class="calc-info" style="max-width: 600px;">
      <p>This calculator takes in the provided data (as either ASCII/Unicode or hex) and calculates the resulting CRC
        value using a range of popular CRC algorithms.</p>

      <p>When the ASCII/Unicode radiobutton is selected, values entered into the CRC data textbox will be treated as
        ASCII/Unicode characters. These characters will then be converted to their corresponding Unicode integer values.
        (Unicode is a complete superset of ASCII, so all ASCII characters map to the same integer values as Unicode
        characters).</p>

    </ui-collapsible>

    <!-- =========================================================================================== -->
    <!-- ========================================= INPUT DATA ====================================== -->
    <!-- =========================================================================================== -->

    <div style="display: flex; justify-content: center;">
      <div>CRC Data</div>
      <calc-var-string :calcVar="calc.getVar('crcData')" :width=200></calc-var-string>
    </div>

    <div style="display: flex;">
      <div>Data Format</div>
      <select v-model="calc.getVar('crcDataType').val" v-on:change="calc.getVar('crcDataType').onValChange()"
              style="width: 200px; height: 30px; font-size: 20px;">
        <option v-for="option in calc.getVar('crcDataType').options" v-bind:value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <!-- =========================================================================================== -->
    <!-- =================================== COMMON CRC ALGORITHMS ================================= -->
    <!-- =========================================================================================== -->

    <div id="common-crc-algorithms">
      <table>
        <tr>
          <td>CRC Name</td>
          <td>CRC Value</td>
        </tr>
      </table>
    </div>

  </div>

</template>

<script>

  //  'use strict'

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import {CalcVarString} from 'src/misc/CalculatorEngineV2/CalcVarString'
  import {CalcVarComboBox} from 'src/misc/CalculatorEngineV2/CalcVarComboBox'
  import {CalcVarInvisible} from 'src/misc/CalculatorEngineV2/CalcVarInvisible'
  //  import PresetValidators from 'src/misc/CalculatorEngineV2/PresetValidators'

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'crc-calculator',
    components: {},
    data: function () {
      var calc = new Calc()

      // Create new variable in class for determining what is input and output
      calc.outputVar = 'resistance'

      // ============================================ //
      // ========== CRC DATA (string input) ========= //
      // ============================================ //
      calc.addVar(new CalcVarString({
        name: 'crcData',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        defaultVal: '',
        validators: [],
        helpText: 'The textual input.'
      }))

      // ============================================ //
      // ========= CRC DATA TYPE (combobox) ========= //
      // ============================================ //
      calc.addVar(new CalcVarComboBox({
        name: 'crcDataType',
        options: [
          'ASCII/Unicode',
          'Hex'
        ],
        defaultVal: 'ASCII/Unicode',
        validators: [],
        helpText: 'The type of data in the "CRC Data" textbox.'
      }))

      // ============================================ //
      // ======= CONVERTED CRC DATA (invisible) ===== //
      // ============================================ //
      calc.addVar(new CalcVarInvisible({
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
            // Note: i gets incremented each time by 2
            for (i = 0; i < crcDataString.length; i += 2) {
              var hexByte
              // Special case if string length is odd, for the last value we
              // have to extract just one character
              if (crcDataString.length() - i === 1) {
                hexByte = crcDataString.substring(i, i + 1)
              } else {
                // Extract 2-character strings from the CRC data
                hexByte = crcDataString.substring(i, i + 2)
              }

              var integerValueOfHex = parseInt(hexByte, 16)
              buffer.push(integerValueOfHex)

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
              buffer.add(integerValueOfHex)
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
      }))

      // Configure calculator to default state now that all
      // variables have been added.
      calc.init()

      return {
        calc: calc
      }
    },
    mounted () {
//      console.log('Ohm\'s Law calculator mounted.')
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .diagram-container {
    position: relative;
  }

  .diagram-container > * {
    position: absolute;
  }

  .variable-container > * {
    position: absolute;
  }

  input[type="radio"] {
    transform: scale(1.5)
  }

</style>
