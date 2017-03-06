<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

<div id="custom-crc-algorithm" class="section-container" style="display: flex; flex-direction: column;">
  <span>Custom Algorithm</span>
  <table style="margin: auto;">
    <tr>
      <td>CRC Width (bits):</td>
      <td><calc-value :calcVar="calc.getVar('customCrcWidthBits')"></calc-value></td>
      <td>Generator Polynomial:</td>
      <td><calc-value :calcVar="calc.getVar('customCrcGeneratorPolynomial')"></calc-value></td>
    </tr>
    <tr>
      <td>Reflect Data:</td>
      <td></td>
      <td>Init Value:</td>
      <td></td>
    </tr>
    <tr>
      <td>Reflect CRC Out:</td>
      <td></td>
      <td>XOR Out:</td>
      <td></td>
    </tr>
  </table>
  <div>
    <span>CRC Value:</span>
  </div>
</div>

</template>

<script>

  //  var bigInt = require('big-integer')
  //  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import {CalcVarNumeral} from 'src/misc/CalculatorEngineV2/CalcVarNumeral'
  import {CalcVarString} from 'src/misc/CalculatorEngineV2/CalcVarString'
  import PresetValidators from 'src/misc/CalculatorEngineV2/PresetValidators'
//  import {CrcGeneric} from 'src/misc/Crc/CrcGeneric'

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'custom-crc-algorithm',
    components: {},
    props: {
      calc: {
        type: Object,
        required: true
      }
    },
    data: function () {
      // ============================================ //
      // ======== CRC WIDTH (numerical input) ======= //
      // ============================================ //
      this.calc.addVar(new CalcVarNumeral({
        name: 'customCrcWidthBits',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '',
        units: [
          {text: 'no unit', value: 1e0}
        ],
        selUnit: 1e0,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The width of the CRC generator polynomial (and resulting CRC value).'
      }))

      // ============================================ //
      // ========= POLYNOMIAL (string input) ======== //
      // ============================================ //
      this.calc.addVar(new CalcVarString({
        name: 'customCrcGeneratorPolynomial',
        typeEqn: () => {
          return 'input'
        },
        defaultVal: '',
        validators: [],
        helpText: 'The generator polynomial for the CRC, in hex. Please describe this in standard form, i.e. by excluding the MSB of the polynomial, ' +
        'and not reversing the bit order. The generator polynomial cannot have more bits than the width of the CRC.'
      }))

      return {
      }
    },
    mounted () {}
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  table td {
    text-align: left;
  }

  input {
    color: #989898 !important;
  }

</style>
