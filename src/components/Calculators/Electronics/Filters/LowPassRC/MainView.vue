<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container">

    <ui-collapsible title="Info" class="calc-info" style="max-width: 600px;">
      <p>The following calculator helps you works out the component values to design a low-pass, single-stage, passive RC filter. The cut-off frequency, \( f_c \), is given by:</p>

      <p>$$ f_c = \frac{1}{2\pi RC} $$</p>

      <p style="text-align: center;">
        where:<br>
        \( f_c \) = the cutoff frequency of the low-pass RC filter (a.k.a knee frequency, -3dB point)<br>
        \( R \) = resistance of the resistor<br>
        \( C \) = capacitance of the capacitor<br>
      </p>
    </ui-collapsible>

    <div class="diagram-container" style="position: relative; width: 600px; height: 600px;">

      <!-- Background image is centered in diagram container -->
      <img :src="require('./diagram.png')" style="left: 50px; top: 50px; max-width: 500px; height: auto; z-index: 0">

      <!-- ========================================= -->
      <!-- =========== RESISTANCE (i/o) ============ -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 160px; top: 55px;">
        <calc-value-and-unit :calcVar="calc.getVar('resistance')" :width=100
                             style="left: 90px; top: 0px;"></calc-value-and-unit>
        <input type="radio" value="resistance" v-model="calc.outputVar" style="left: 0px; top: 10px">
      </div>

      <!-- ========================================= -->
      <!-- =========== CAPACITANCE (i/o) =========== -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 370px; top: 160px;">
        <calc-value-and-unit :calcVar="calc.getVar('capacitance')" :width=100
                             style="left: 0px; top: 40px;"></calc-value-and-unit>
        <input type="radio" value="capacitance" v-model="calc.outputVar" style="left: 50px; top: 0px">
      </div>

      <!-- ========================================= -->
      <!-- === FCUTOFF (cut-off frequency) (i/o) === -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 150px; top: 340px;">
        <calc-value-and-unit :calcVar="calc.getVar('fcutoff')" :width=100
                             style="left: 90px; top: 0px;"></calc-value-and-unit>
        <input type="radio" value="fcutoff" v-model="calc.outputVar" style="left: 0px; top: 10px">
      </div>

    </div>
  </div>

</template>

<script>

  import Calc from '@/misc/CalculatorEngineV2/Calc'
  import {CalcVarNumeric, NumericValidators} from '@/misc/CalculatorEngineV2/CalcVarNumeric'
  import {UnitMulti} from '@/misc/CalculatorEngineV2/UnitMulti'

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
      calc.addVar(new CalcVarNumeric({
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
          new UnitMulti({name: 'mΩ', multi: 1e-3}),
          new UnitMulti({name: 'Ω', multi: 1e0}),
          new UnitMulti({name: 'kΩ', multi: 1e3}),
          new UnitMulti({name: 'MΩ', multi: 1e6})
        ],
        defaultUnitName: 'kΩ',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The resistance of the resistor in the low-pass LC filter.'
      }))

      // ============================================ //
      // ============= CAPACITANCE (i/o) ============ //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
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
          new UnitMulti({name: 'pF', multi: 1e-12}),
          new UnitMulti({name: 'nF', multi: 1e-9}),
          new UnitMulti({name: 'uF', multi: 1e-6}),
          new UnitMulti({name: 'mF', multi: 1e-3}),
          new UnitMulti({name: 'F', multi: 1e0})
        ],
        defaultUnitName: 'uF',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The capacitance of the capacitor in the low-pass LC filter.'
      }))

      // ============================================ //
      // =========== CUTOFF FREQUENCY (i/o) ========= //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
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
          new UnitMulti({name: 'Hz', multi: 1e0}),
          new UnitMulti({name: 'kHz', multi: 1e0}),
          new UnitMulti({name: 'MHz', multi: 1e0}),
          new UnitMulti({name: 'GHz', multi: 1e0})
        ],
        defaultUnitName: 'kHz',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
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
