<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container">
    <div class="diagram-container" style="position: relative; width: 600px; height: 600px;">

      <!-- Background image is centered in diagram container -->
      <img :src="require('./diagram.png')" style="left: 50px; top: 50px; max-width: 500px; height: auto; z-index: 0">

      <!-- ========================================= -->
      <!-- =========== RESISTANCE (i/o) ============ -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 160px; top: 55px;">
        <calc-value-and-unit :calcVar="calc.getVar('resistance')" width="100"
                             style="left: 90px; top: 0px;"></calc-value-and-unit>
        <input type="radio" value="resistance" v-model="calc.outputVar" style="left: 0px; top: 10px">
      </div>

      <!-- ========================================= -->
      <!-- =========== CAPACITANCE (i/o) =========== -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 370px; top: 160px;">
        <calc-value-and-unit :calcVar="calc.getVar('capacitance')" width="100"
                             style="left: 0px; top: 40px;"></calc-value-and-unit>
        <input type="radio" value="capacitance" v-model="calc.outputVar" style="left: 50px; top: 0px">
      </div>

      <!-- ========================================= -->
      <!-- === FCUTOFF (cut-off frequency) (i/o) === -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 150px; top: 340px;">
        <calc-value-and-unit :calcVar="calc.getVar('fcutoff')" width="100"
                             style="left: 90px; top: 0px;"></calc-value-and-unit>
        <input type="radio" value="fcutoff" v-model="calc.outputVar" style="left: 0px; top: 10px">
      </div>

    </div>
  </div>

</template>

<script>

  //  'use strict'

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import {CalcVarNumeral} from 'src/misc/CalculatorEngineV2/CalcVarNumeral'
  import PresetValidators from 'src/misc/CalculatorEngineV2/PresetValidators'

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'low-pass-rc-calculator',
    components: {},
    data: function () {
      var calc = new Calc()

      // Create new variable in class for determining what is input and output
      calc.outputVar = 'fcutoff'

      // ============================================ //
      // ============== RESISTANCE (i/o) ============ //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'resistance',
        typeEqn: () => {
          if (calc.outputVar === 'resistance') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          var fcutoff = calc.getVar('fcutoff').getRawVal()
          var capacitance = calc.getVar('capacitance').getRawVal()

          return (1.0 / (2 * Math.PI * fcutoff * capacitance))
        },
        rawVal: '',
        units: [
          {text: 'mΩ', value: 1e-3},
          {text: 'Ω', value: 1},
          {text: 'kΩ', value: 1e3},
          {text: 'MΩ', value: 1e6}
        ],
        selUnit: 1,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The resistance of the resistor in the low-pass LC filter.'
      }))

      // ============================================ //
      // ============= CAPACITANCE (i/o) ============ //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'capacitance',
        typeEqn: () => {
          if (calc.outputVar === 'capacitance') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          var fcutoff = calc.getVar('fcutoff').getRawVal()
          var resistance = calc.getVar('resistance').getRawVal()

          return (1.0 / (2 * Math.PI * fcutoff * resistance))
        },
        rawVal: '',
        units: [
          {text: 'pF', value: 1e-12},
          {text: 'nF', value: 1e-9},
          {text: 'uF', value: 1e-6},
          {text: 'mF', value: 1e-3},
          {text: 'F', value: 1}
        ],
        selUnit: 1,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The capacitance of the capacitor in the low-pass LC filter.'
      }))

      // ============================================ //
      // =========== CUTOFF FREQUENCY (i/o) ========= //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'fcutoff',
        typeEqn: () => {
          if (calc.outputVar === 'fcutoff') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          var resistance = calc.getVar('resistance').getRawVal()
          var capacitance = calc.getVar('capacitance').getRawVal()

          return (1.0 / (2 * Math.PI * resistance * capacitance))
        },
        rawVal: '',
        units: [
          {text: 'Hz', value: 1e0},
          {text: 'kHz', value: 1e3},
          {text: 'MHz', value: 1e6},
          {text: 'GHz', value: 1e9}
        ],
        selUnit: 1,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The cut-off frequency of the low-pass RC filter. This is the point where the output signal is attenuated by -3dB (70.7%) of the input. Also known as the corner or breakpoint frequency.'
      }))

      // Configure calculator to default state now that all
      // variables have been added.
      calc.init()

      return {
        calc: calc
      }
    },
    mounted () {
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
