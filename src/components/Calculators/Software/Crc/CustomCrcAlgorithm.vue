<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

<div id="custom-crc-algorithm" class="section-container" style="display: flex; flex-direction: column;">
  <span class="section-title">Custom Algorithm</span>
  <table style="margin: auto;">
    <tr>
      <td>CRC Width (bits):</td>
      <td><calc-value :calcVar="calc.getVar('customCrcWidthBits')"></calc-value></td>
      <td>Generator Polynomial:</td>
      <td>0x</td>
      <td><calc-var-string :calcVar="calc.getVar('customCrcPolynomial')" :width=200></calc-var-string></td>
    </tr>
    <tr>
      <td>Reflect Data:</td>
      <td><calc-var-checkbox :calcVar="calc.getVar('customCrcReflectData')"></calc-var-checkbox></td>
      <td>Init Value:</td>
      <td>0x</td>
      <td><calc-var-string :calcVar="calc.getVar('customCrcInitialValue')" :width=200></calc-var-string></td>
    </tr>
    <tr>
      <td>Reflect CRC Out:</td>
      <td><calc-var-checkbox :calcVar="calc.getVar('customCrcReflectCrcOut')"></calc-var-checkbox></td>
      <td>XOR Out:</td>
      <td>0x</td>
      <td><calc-var-string :calcVar="calc.getVar('customCrcXorOut')" :width=200></calc-var-string></td>
    </tr>
  </table>
  <div style="height: 15px;"></div>
  <div style="display: flex; margin: auto;">
    <span style="align-self: center">CRC Value: 0x </span>
    <calc-var-string :calcVar="calc.getVar('customCrcValue')" :width=300></calc-var-string>
  </div>
</div>

</template>

<script>

//  import Calc from '@/misc/CalculatorEngineV2/Calc'
import {CalcVarNumeric, NumericValidators} from '@/misc/CalculatorEngineV2/CalcVarNumeric'
import {CalcVarString, CalcVarStringPresetValidators} from '@/misc/CalculatorEngineV2/CalcVarString'
import {CalcVarCheckbox} from '@/misc/CalculatorEngineV2/CalcVarCheckbox'
import {UnitMulti} from '@/misc/CalculatorEngineV2/UnitMulti'
import {CustomValidator} from '@/misc/CalculatorEngineV2/CustomValidator'
import {CrcGeneric} from '@/misc/Crc/CrcGeneric'
var bigInt = require('big-integer')

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
    this.calc.addVar(new CalcVarNumeric({
      name: 'customCrcWidthBits',
      typeEqn: () => {
        return 'input'
      },
      eqn: () => {
      },
      rawVal: '',
      units: [
        new UnitMulti({name: 'no unit', multi: 1e0})
      ],
      defaultUnitName: 'no unit',
      roundTo: 4,
      validators: [
        NumericValidators.IS_NUMBER,
        NumericValidators.IS_GREATER_THAN_ZERO
      ],
      helpText: 'The width of the CRC generator polynomial (and resulting CRC value).'
    }))

    // ============================================ //
    // ========= POLYNOMIAL (string input) ======== //
    // ============================================ //
    this.calc.addVar(new CalcVarString({
      name: 'customCrcPolynomial',
      typeEqn: () => {
        return 'input'
      },
      defaultVal: '',
      validators: [
        CalcVarStringPresetValidators.IS_HEX,
        // ===== MAKE SURE VALUE IS NOT LARGER (IN BITS) THAN THE CRC WIDTH ===== //
        new CustomValidator({
          func: () => {
            // Read dependency variables
            const customCrcWidthBits = this.calc.getVar('customCrcWidthBits').getRawVal()
            const customCrcPolynomial = this.calc.getVar('customCrcPolynomial').getVal()
            // Convert both into big ints
            const customCrcWidthBitsAsBigInt = bigInt(customCrcWidthBits)
            const customCrcPolynomialAsBigInt = bigInt(customCrcPolynomial, 16)
            // Compare
            if (bigInt(2).pow(customCrcWidthBitsAsBigInt).greater(customCrcPolynomialAsBigInt)) {
              return true
            } else {
              return false
            }
          },
          text: 'Generator polynomial cannot have more bits that the width of the CRC.',
          level: 'error'
        })
      ],
      helpText: 'The generator polynomial for the CRC, in hex. Please describe this in standard form, i.e. by excluding the MSB of the polynomial, ' +
      'and not reversing the bit order. The generator polynomial cannot have more bits than the width of the CRC.'
    }))

    // ============================================ //
    // ====== REFLECT DATA (checkbox input) ======= //
    // ============================================ //
    this.calc.addVar(new CalcVarCheckbox({
      name: 'customCrcReflectData',
      defaultVal: '',
      validators: [],
      helpText: 'Determines whether the input data is reflected (the bits reversed) before the rest of the CRC calculations take place. This occurs with some popular CRC algorithms.'
    }))

    // ============================================ //
    // ========= INIT VALUE (string input) ======== //
    // ============================================ //
    this.calc.addVar(new CalcVarString({
      name: 'customCrcInitialValue',
      typeEqn: () => {
        return 'input'
      },
      defaultVal: '',
      validators: [
        CalcVarStringPresetValidators.IS_HEX,
        // ===== MAKE SURE VALUE IS NOT LARGER (IN BITS) THAN THE CRC WIDTH ===== //
        new CustomValidator({
          func: () => {
            // Read dependency variables
            const customCrcWidthBits = this.calc.getVar('customCrcWidthBits').getRawVal()
            const customCrcInitialValue = this.calc.getVar('customCrcInitialValue').getVal()
            // Convert both into big ints
            const customCrcWidthBitsAsBigInt = bigInt(customCrcWidthBits)
            const customCrcInitialValueAsBigInt = bigInt(customCrcInitialValue, 16)
            // Compare
            if (bigInt(2).pow(customCrcWidthBitsAsBigInt).greater(customCrcInitialValueAsBigInt)) {
              return true
            } else {
              return false
            }
          },
          text: 'Initial value cannot have more bits that the width of the CRC.',
          level: 'error'
        })
      ],
      helpText: 'The initial value for the CRC, in hex. This cannot have more bits than the width CRC.'
    }))

    // ============================================ //
    // ====== REFLECT OUT (checkbox input) ======= //
    // ============================================ //
    this.calc.addVar(new CalcVarCheckbox({
      name: 'customCrcReflectCrcOut',
      defaultVal: '',
      validators: [],
      helpText: 'Determines whether the output data is reflected (the bits reversed) before the final CRC value is found. This occurs with some popular CRC algorithms.'
    }))

    // ============================================ //
    // =========== XOR OUT (string input) ========= //
    // ============================================ //
    this.calc.addVar(new CalcVarString({
      name: 'customCrcXorOut',
      typeEqn: () => {
        return 'input'
      },
      defaultVal: '',
      validators: [
        CalcVarStringPresetValidators.IS_HEX,
        // ===== MAKE SURE VALUE IS NOT LARGER (IN BITS) THAN THE CRC WIDTH ===== //
        new CustomValidator({
          func: () => {
            // Read dependency variables
            const customCrcWidthBits = this.calc.getVar('customCrcWidthBits').getRawVal()
            const customCrcXorOut = this.calc.getVar('customCrcXorOut').getVal()
            // Convert both into big ints
            const customCrcWidthBitsAsBigInt = bigInt(customCrcWidthBits)
            const customCrcXorOutAsBigInt = bigInt(customCrcXorOut, 16)
            // Compare
            if (bigInt(2).pow(customCrcWidthBitsAsBigInt).greater(customCrcXorOutAsBigInt)) {
              return true
            } else {
              return false
            }
          },
          text: 'XOR out value cannot have more bits that the width of the CRC.',
          level: 'error'
        })
      ],
      helpText: 'The XOR out value for the CRC.'
    }))

    // ============================================ //
    // ========= CRC VALUE (string output) ======== //
    // ============================================ //
    this.calc.addVar(new CalcVarString({
      name: 'customCrcValue',
      typeEqn: () => {
        return 'output'
      },
      eqn: () => {
        // Read dependencies
        const crcData = this.calc.getVar('convertedCrcData').getVal()
        const crcWidth = this.calc.getVar('customCrcWidthBits').getRawVal()
        const crcGeneratorPolynomial = this.calc.getVar('customCrcPolynomial').getVal()
        const crcInitialValue = this.calc.getVar('customCrcInitialValue').getVal()
        const reflectDataIn = this.calc.getVar('customCrcReflectData').getVal()
        const reflectCrcOut = this.calc.getVar('customCrcReflectCrcOut').getVal()
        const crcXorOut = this.calc.getVar('customCrcXorOut').getVal()

        // Check all inputs are valid
        if (this.calc.getVar('convertedCrcData').validationResult !== 'ok') return ''
        if (this.calc.getVar('customCrcWidthBits').validationResult !== 'ok') return ''
        if (this.calc.getVar('customCrcPolynomial').validationResult !== 'ok') return ''
        if (this.calc.getVar('customCrcInitialValue').validationResult !== 'ok') return ''
        if (this.calc.getVar('customCrcReflectData').validationResult !== 'ok') return ''
        if (this.calc.getVar('customCrcReflectCrcOut').validationResult !== 'ok') return ''
        if (this.calc.getVar('customCrcXorOut').validationResult !== 'ok') return ''

        // Convert dependencies as necessary
        const generatorPolynomialAsBigInt = bigInt(crcGeneratorPolynomial, 16)
        const initialValueAsBigInt = bigInt(crcInitialValue, 16)
        const xorOutAsLong = bigInt(crcXorOut, 16)

        var initObj = {
          name: 'Custom Algorithm',
          crcWidthBits: crcWidth,
          crcPolynomial: generatorPolynomialAsBigInt,
          startingValue: initialValueAsBigInt,
          reflectData: reflectDataIn,
          reflectRemainder: reflectCrcOut,
          finalXorValue: xorOutAsLong
        }
        console.log(initObj)

        // Generate a CRC engine from the information we have obtained
        var crcEngine = new CrcGeneric(initObj)

        for (var i = 0; i < crcData.length; i++) {
          crcEngine.update(crcData[i])
        }
        return crcEngine.getHex()
      },
      defaultVal: '',
      validators: [
        CalcVarStringPresetValidators.IS_HEX
      ],
      helpText: 'The calculated CRC value with the provided custom algorithm used on the given input data.'
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
