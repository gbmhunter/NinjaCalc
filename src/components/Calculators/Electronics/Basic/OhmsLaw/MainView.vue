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
      <img :src="require('./diagram.png')" style="left: 50px; top: 50px; width: 500px; height: 500px; z-index: 0">

      <!-- ========================================= -->
      <!-- =============== VOLTAGE ================= -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 0px; top: 240px;">

        <calc-value-and-unit :calcVar="calc.getVar('voltage')" style="left: 0px; top: 70px;"></calc-value-and-unit>

        <!-- INPUT/OUTPUT DECIDER -->
        <input type="radio" value="voltage" v-model="calc.outputVar" style="left: 0px; top: 20px">
      </div>

      <!-- ========================================= -->
      <!-- =============== CURRENT ================= -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 440px; top: 360px;">

        <calc-value-and-unit :calcVar="calc.getVar('current')" style="left: 0px; top: 50px;"></calc-value-and-unit>

        <!-- INPUT/OUTPUT DECIDER -->
        <input type="radio" value="current" v-model="calc.outputVar" style="left: 100px; top: 0px">
      </div>

      <!-- ========================================= -->
      <!-- ============= RESISTANCE ================ -->
      <!-- ========================================= -->
      <div class="variable-container" style="left: 450px; top: 160px;">

        <calc-value-and-unit :calcVar="calc.getVar('resistance')" style="left: 0px; top: 40px;"></calc-value-and-unit>

        <!-- INPUT/OUTPUT DECIDER -->
        <input type="radio" value="resistance" v-model="calc.outputVar" style="left: 100px; top: 0px">
      </div>
    </div>
  </div>

</template>

<script>

  //  'use strict'

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import {CalcVarNumeral} from 'src/misc/CalculatorEngineV2/CalcVarNumeral'
  import {UnitMulti} from 'src/misc/CalculatorEngineV2/UnitMulti'
  import PresetValidators from 'src/misc/CalculatorEngineV2/PresetValidators'

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'ohms-law-calculator',
    components: {},
    data: function () {
      var calc = new Calc()

      // Create new variable in class for determining what is input and output
      calc.outputVar = 'resistance'

      // ============================================ //
      // =================== VOLTAGE ================ //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'voltage',
        typeEqn: () => {
          if (calc.outputVar === 'voltage') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          var current = calc.getVar('current').getRawVal()
          var resistance = calc.getVar('resistance').getRawVal()

          return (current * resistance)
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'mV', multi: 1e-3}),
          new UnitMulti({name: 'V', multi: 1})
        ],
        defaultUnitName: 'V',
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The voltage across the resistor.'
      }))

      // ============================================ //
      // =================== CURRENT ================ //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'current',
        typeEqn: () => {
          if (calc.outputVar === 'current') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          var voltage = calc.getVar('voltage').getRawVal()
          var resistance = calc.getVar('resistance').getRawVal()

          return (voltage / resistance)
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'uA', multi: 1e-6}),
          new UnitMulti({name: 'mA', multi: 1e-3}),
          new UnitMulti({name: 'A', multi: 1})
        ],
        defaultUnitName: 'A',
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The current going through the resistor.'
      }))

      // ============================================ //
      // ================= RESISTANCE =============== //
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
          var voltage = calc.getVar('voltage').getRawVal()
          var current = calc.getVar('current').getRawVal()

          return (voltage / current)
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
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The resistance of the resistor (or other resistive circuit component).'
      }))

      // Configure calculator to default state now that all
      // variables have been added.
      calc.init()

      console.log('MainView.data() finished.')

      return {
        calc: calc
      }
    },
    mounted () {
//      console.log('Ohm\'s Law calculator mounted.')
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
