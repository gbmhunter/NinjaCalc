<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container">

    <ui-collapsible title="Info" class="calc-info" style="max-width: 600px;">
      <p>The following calculator works out either voltage, current or resistance, given the other two parameters, using the equation:</p>

      <p>$$ V = IR $$</p>

      <p style="text-align: center;">
        where:<br>
        \( V \) = voltage across the resistor<br>
        \( I \) = current through the resistor<br>
        \( R \) = resistance of the resistor<br>
      </p>
    </ui-collapsible>

    <div class="diagram-container" style="position: relative; width: 600px; height: 600px;">

      <!-- Background image is centered in diagram container -->
      <img :src="require('./diagram.png')" style="left: 50px; top: 50px; width: 500px; height: 500px; z-index: 0;">

      <!-- ========================================= -->
      <!-- =============== VOLTAGE ================= -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 0px; top: 240px;">

        <calc-value-and-unit :calcVar="calc.getVar('voltage_V')" style="left: 0px; top: 70px;" :width=80></calc-value-and-unit>

        <!-- INPUT/OUTPUT DECIDER -->
        <input type="radio" value="voltage_V" v-model="calc.outputVar" style="left: 0px; top: 20px">
      </div>

      <!-- ========================================= -->
      <!-- =============== CURRENT ================= -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 440px; top: 360px;">

        <calc-value-and-unit :calcVar="calc.getVar('current_A')" style="left: 0px; top: 50px;"></calc-value-and-unit>

        <!-- INPUT/OUTPUT DECIDER -->
        <input type="radio" value="current_A" v-model="calc.outputVar" style="left: 100px; top: 0px">
      </div>

      <!-- ========================================= -->
      <!-- ============= RESISTANCE ================ -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 450px; top: 160px;">

        <calc-value-and-unit :calcVar="calc.getVar('resistance_Ohms')" style="left: 0px; top: 40px;"></calc-value-and-unit>

        <!-- INPUT/OUTPUT DECIDER -->
        <input type="radio" value="resistance_Ohms" v-model="calc.outputVar" style="left: 100px; top: 0px">
      </div>
    </div>
  </div>

</template>

<script>

  /* eslint-disable camelcase */

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import {CalcVarNumeric, NumericValidators} from 'src/misc/CalculatorEngineV2/CalcVarNumeric'
  import {UnitMulti} from 'src/misc/CalculatorEngineV2/UnitMulti'

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'ohms-law-calculator', // This will show up in URL
    components: {},
    data: function () {
      console.log('data() called')
      console.log(NumericValidators.IS_NUMBER)
      var calc = new Calc()

      // Create new variable in class for determining what is input and output
      calc.outputVar = 'resistance_Ohms'

      // ============================================ //
      // =================== VOLTAGE ================ //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'voltage_V',
        typeEqn: () => {
          if (calc.outputVar === 'voltage_V') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          const current_A = calc.getVar('current_A').getRawVal()
          const resistance_Ohms = calc.getVar('resistance_Ohms').getRawVal()

          return (current_A * resistance_Ohms)
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'mV', multi: 1e-3}),
          new UnitMulti({name: 'V', multi: 1e0})
        ],
        defaultUnitName: 'V',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The voltage across the resistor.'
      }))

      // ============================================ //
      // =================== CURRENT ================ //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'current_A',
        typeEqn: () => {
          if (calc.outputVar === 'current_A') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          const voltage_V = calc.getVar('voltage_V').getRawVal()
          const resistance_Ohms = calc.getVar('resistance_Ohms').getRawVal()

          return (voltage_V / resistance_Ohms)
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'uA', multi: 1e-6}),
          new UnitMulti({name: 'mA', multi: 1e-3}),
          new UnitMulti({name: 'A', multi: 1e0})
        ],
        defaultUnitName: 'A',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The current going through the resistor.'
      }))

      // ============================================ //
      // ================= RESISTANCE =============== //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'resistance_Ohms',
        typeEqn: () => {
          if (calc.outputVar === 'resistance_Ohms') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          const voltage_V = calc.getVar('voltage_V').getRawVal()
          const current_A = calc.getVar('current_A').getRawVal()

          return (voltage_V / current_A)
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'mΩ', multi: 1e-3}),
          new UnitMulti({name: 'Ω', multi: 1e0}),
          new UnitMulti({name: 'kΩ', multi: 1e3}),
          new UnitMulti({name: 'MΩ', multi: 1e6}),
          new UnitMulti({name: 'GΩ', multi: 1e9})
        ],
        defaultUnitName: 'Ω',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The resistance of the resistor (or other resistive circuit component).'
      }))

      return {
        calc: calc
      }
    },
    mounted () {
      // Configure calculator to default state now that
      // UI has been created
      this.calc.init()

      if (window.MathJax) {
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
      }
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
