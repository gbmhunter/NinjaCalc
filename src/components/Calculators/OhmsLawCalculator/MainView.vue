<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

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

</template>

<script>

  'use strict'

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import CalcVar from 'src/misc/CalculatorEngineV2/CalcVar'
  import PresetValidators from 'src/misc/CalculatorEngineV2/PresetValidators'

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'ohms-law-calculator',
    components: {
    },
    data: function () {
      var calc = new Calc()

      // Create new variable in class for determining what is input and output
      calc.outputVar = 'resistance'

      // ============================================ //
      // =================== voltage ================ //
      // ============================================ //
      var voltage = new CalcVar({
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
          {text: 'mV', value: 1e-3},
          {text: 'V', value: 1}
        ],
        selUnit: 1,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_POSITIVE
        ],
        helpText: 'The voltage across the resistor.'
      })
      calc.addVar(voltage)

      // ============================================ //
      // =================== current ================ //
      // ============================================ //
      var current = new CalcVar({
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
          {text: 'uA', value: 1e-6},
          {text: 'mA', value: 1e-3},
          {text: 'A', value: 1}
        ],
        selUnit: 1,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_POSITIVE
        ],
        helpText: 'The current going through the resistor.'
      })
      calc.addVar(current)

      // ============================================ //
      // ================= resistance =============== //
      // ============================================ //
      var resistance = new CalcVar({
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
          {text: 'mΩ', value: 1e-3},
          {text: 'Ω', value: 1},
          {text: 'kΩ', value: 1e3},
          {text: 'MΩ', value: 1e6}
        ],
        selUnit: 1,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_POSITIVE
        ],
        helpText: 'The resistance of the resistor (or other resistive circuit component).'
      })
      calc.addVar(resistance)

      // Configure calculator to default state now that all
      // variables have been added.
      calc.init()

      return {
        calc: calc
      }
    },
    mounted () {
      console.log('Ohm\'s Law calculator mounted.')
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
