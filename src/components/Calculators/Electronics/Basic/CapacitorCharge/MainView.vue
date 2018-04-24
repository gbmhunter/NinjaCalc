<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container">

    <ui-collapsible title="Info" class="calc-info" style="max-width: 600px;">
      <p>The following calculator works out either charge, capacitance, or voltage given the other two parameters, using the equation:</p>

      <p>$$ Q = CV $$</p>

      <p style="text-align: center;">
        where:<br>
        \( Q \) = charge in the capacitor<br>
        \( C \) = capacitance of the capacitor<br>
        \( V \) = voltage across the capacitor<br>
      </p>
    </ui-collapsible>

    <div class="diagram-container" style="position: relative; width: 600px; height: 600px;">

      <!-- Background image is centered in diagram container -->
      <img :src="require('./diagram.png')" style="left: 0px; top: 0px; width: 600px; z-index: 0">

      <!-- ========================================= -->
      <!-- ================ CHARGE ================= -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 490px; top: 80px;">
        <span style="left: 30px; top: 0px; font-size: 40px;">\(Q\)</span>
        <input type="radio" value="charge_C" v-model="calc.outputVar" style="left: 90px; top: 10px">
        <calc-value-and-unit :calcVar="calc.getVar('charge_C')" style="left: 0px; top: 60px;" :width=80></calc-value-and-unit>
      </div>

      <!-- ========================================= -->
      <!-- ============= CAPACITANCE =============== -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 590px; top: 220px;">
        <span style="left: 30px; top: -10px; font-size: 40px;">\(C\)</span>
        <calc-value-and-unit :calcVar="calc.getVar('capacitance_F')" :width=80 style="left: 0px; top: 50px;"></calc-value-and-unit>
        <!-- INPUT/OUTPUT DECIDER -->
        <input type="radio" value="capacitance_F" v-model="calc.outputVar" style="left: 90px; top: 0px">
      </div>

      <!-- ========================================= -->
      <!-- ================ VOLTAGE ================ -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 50px; top: 220px;">
        <span style="left: 30px; top: -20px; font-size: 40px;">\(V\)</span>
        <calc-value-and-unit :calcVar="calc.getVar('voltage_V')" :width=80 style="left: 0px; top: 40px;"></calc-value-and-unit>

        <!-- INPUT/OUTPUT DECIDER -->
        <input type="radio" value="voltage_V" v-model="calc.outputVar" style="left: 80px; top: 0px">
      </div>
    </div>
  </div>

</template>

<script>

  /* eslint-disable camelcase */

  import Calc from '@/misc/CalculatorEngineV2/Calc'
  import {CalcVarNumeric, NumericValidators} from '@/misc/CalculatorEngineV2/CalcVarNumeric'
  import {UnitMulti} from '@/misc/CalculatorEngineV2/UnitMulti'

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'capacitor-charge-calculator',
    components: {},
    data: function () {
      var calc = new Calc()

      // Create new variable in class for determining what is input and output
      calc.outputVar = 'charge_C'

      // ============================================ //
      // =================== CHARGE ================= //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'charge_C',
        typeEqn: () => {
          if (calc.outputVar === 'charge_C') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          const capacitance_F = calc.getVar('capacitance_F').getRawVal()
          const voltage_V = calc.getVar('voltage_V').getRawVal()

          return (capacitance_F * voltage_V)
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'pC', multi: 1e-12}),
          new UnitMulti({name: 'nC', multi: 1e-9}),
          new UnitMulti({name: 'uC', multi: 1e-6}),
          new UnitMulti({name: 'mC', multi: 1e-3})
        ],
        defaultUnitName: 'nC',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The charge held by the capacitor.'
      }))

      // ============================================ //
      // ================= CAPACITANCE ============== //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'capacitance_F',
        typeEqn: () => {
          if (calc.outputVar === 'capacitance_F') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          const charge_C = calc.getVar('charge_C').getRawVal()
          const voltage_V = calc.getVar('voltage_V').getRawVal()

          return (charge_C / voltage_V)
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'pF', multi: 1e-12}),
          new UnitMulti({name: 'nF', multi: 1e-9}),
          new UnitMulti({name: 'uF', multi: 1e-6}),
          new UnitMulti({name: 'mF', multi: 1e-3})
        ],
        defaultUnitName: 'nF',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The capacitance of the capacitor.'
      }))

      // ============================================ //
      // ================ VOLTAGE (i/o) ============= //
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
          const charge_C = calc.getVar('charge_C').getRawVal()
          const capacitance_F = calc.getVar('capacitance_F').getRawVal()

          return (charge_C / capacitance_F)
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'mV', multi: 1e-3}),
          new UnitMulti({name: 'V', multi: 1e0}),
          new UnitMulti({name: 'kV', multi: 1e3})
        ],
        defaultUnitName: 'V',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The voltage across the capacitor.'
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
