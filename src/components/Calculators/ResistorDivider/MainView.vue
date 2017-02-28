<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div id="resistor-divider-calculator" class="diagram-container"
       style="position: relative; width: 600px; height: 600px;">

    <!-- Background image is centered in diagram container -->
    <img :src="require('./diagram.png')" style="left: 50px; top: 50px; width: 550px; height: 550px; z-index: 0;">

    <!-- =========================================================================================== -->
    <!-- =============================================== vIn ======================================= -->
    <!-- =========================================================================================== -->
    <div class="variable-container" style="left: 30px; top: 290px;">
      <calc-value-and-unit :calcVar="calc.getVar('vIn')" style="left: -10px; top: 40px;"></calc-value-and-unit>
      <input type="radio" value="vIn" v-model="calc.outputVar">
    </div>

    <!-- =========================================================================================== -->
    <!-- ============================================= Rtop ======================================== -->
    <!-- =========================================================================================== -->
    <div class="variable-container" style="left: 330px; top: 140px;">
      <calc-value-and-unit :calcVar="calc.getVar('rTop')" style="left: 0px; top: 40px;"></calc-value-and-unit>
      <input type="radio" value="rTop" v-model="calc.outputVar" style="left: 90px;">
    </div>

    <!-- =========================================================================================== -->
    <!-- ============================================= Rbot ======================================== -->
    <!-- =========================================================================================== -->
    <div class="variable-container" style="left: 330px; top: 340px;">
      <calc-value-and-unit :calcVar="calc.getVar('rBot')" style="left: 0px; top: 40px;"></calc-value-and-unit>
      <input type="radio" value="rBot" v-model="calc.outputVar" style="left: 90px;">
    </div>

    <!-- =========================================================================================== -->
    <!-- ============================================= Vout ======================================== -->
    <!-- =========================================================================================== -->
    <div class="variable-container" style="left: 480px; top: 400px;">
      <calc-value-and-unit :calcVar="calc.getVar('vOut')" style="left: 0px; top: 40px;"></calc-value-and-unit>
      <input type="radio" value="vOut" v-model="calc.outputVar" style="left: 120px;">
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
    name: 'resistor-divider-calculator',
    data: function () {
      var calc = new Calc()

      // Create new variable in class for determining what is input and output
      calc.outputVar = 'vOut'

      // ============================================ //
      // ===================== vIn ================== //
      // ============================================ //
      var vIn = new CalcVar({
        name: 'vIn',
        typeEqn: () => {
          if (calc.outputVar === 'vIn') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          var vOut = calc.getVar('vOut').getRawVal()
          var rTop = calc.getVar('rTop').getRawVal()
          var rBot = calc.getVar('rBot').getRawVal()

          return ((vOut * (rTop + rBot)) / rBot)
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
        helpText: 'The input voltage to the top of the resistor divider (also equal to the voltage across the entire resistor divider).'
      })
      calc.addVar(vIn)

      // ============================================ //
      // ===================== rTop ================= //
      // ============================================ //
      var rTop = new CalcVar({
        name: 'rTop',
        typeEqn: () => {
          if (calc.outputVar === 'rTop') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          var vIn = calc.getVar('vIn').getRawVal()
          var rBot = calc.getVar('rBot').getRawVal()
          var vOut = calc.getVar('vOut').getRawVal()

          return ((rBot * (vIn - vOut)) / vOut)
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
        helpText: 'The resistance of the top resistor in the resistor divider.'
      })
      calc.addVar(rTop)

      // ============================================ //
      // ===================== rBot ================= //
      // ============================================ //
      var rBot = new CalcVar({
        name: 'rBot',
        typeEqn: () => {
          if (calc.outputVar === 'rBot') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          var vIn = calc.getVar('vIn').getRawVal()
          var rTop = calc.getVar('rTop').getRawVal()
          var vOut = calc.getVar('vOut').getRawVal()

          return ((rTop * vOut) / (vIn - vOut))
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
        helpText: 'The resistance of the bottom resistor in the resistor divider.'
      })
      calc.addVar(rBot)

      // ============================================ //
      // ===================== vOut ================= //
      // ============================================ //
      var vOut = new CalcVar({
        name: 'vOut',
        typeEqn: () => {
          if (calc.outputVar === 'vOut') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          var vIn = calc.getVar('vIn').getRawVal()
          var rTop = calc.getVar('rTop').getRawVal()
          var rBot = calc.getVar('rBot').getRawVal()

          return ((vIn * rBot) / (rTop + rBot))
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
        helpText: 'The resistor divider output voltage. The is also equal to the voltage across the bottom resistor.' +
        ' Note that this is only accurate as long as the circuit connected to the output voltage has a much higher resistance than the bottom resistor.'
      })
      calc.addVar(vOut)

      // Configure calculator to default state now that all
      // variables have been added.
      calc.init()

      return {
        calc: calc
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

<style>

  /* WARNING
  Make sure to apply the #resistor-divider-calculator selector to all styles in here,
  otherwise you run the risk of modifying other parts of the app.
   */

  #resistor-divider-calculator .variable-value {
    width: 100px !important;
    height: 30px !important;
  }

  #resistor-divider-calculator .variable-units {
    height: 30px !important;
  }

</style>
