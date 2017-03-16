<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="calculator-container">

    <ui-collapsible title="Info" class="calc-info" style="max-width: 600px;">
      The following calculator works out either \( V_{in} \), \( R_1 \), \( R_2 \), or \( V_{out}\), given the other three parameters, using the resistive voltage divider equation:

      $$ V_{out}=\frac{R_2}{R_1+R_2}V_{in} $$

      <p style="text-align: center;">
        where:<br>
        \( V_{in} \) = input voltage<br>
        \( R_1 \) = resistance of resistor 1 (see diagram)<br>
        \( R_2 \) = resistance of resistor 2 (see diagram)<br>
        \( V_{out} \) = output voltage
      </p>

      It is assumed that the output impedance on \( V_{out} \) is significantly higher than \( R_2 \) so that it doesn't matter (for example, \( V_{out} \) is connected to an op-amp input, analogue microcontroller input or similar).
      The quiescent current through the divider, \( I_q \), is also calculated, which can be useful to know when designing power-saving circuits. The equation to find \( I_q \) is:

      $$ I_q = \frac{V_{in}}{R_1+R_2} $$
    </ui-collapsible>

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
  </div>
</template>

<script>

  //  'use strict'

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import {CalcVarNumeric, NumericValidators} from 'src/misc/CalculatorEngineV2/CalcVarNumeric'
  import {UnitMulti} from 'src/misc/CalculatorEngineV2/UnitMulti'
  import {CustomValidator} from 'src/misc/CalculatorEngineV2/CustomValidator'

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
      var vIn = new CalcVarNumeric({
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
          new UnitMulti({name: 'mV', multi: 1e-3}),
          new UnitMulti({name: 'V', multi: 1e0})
        ],
        defaultUnitName: 'V',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
          new CustomValidator({
            func: () => {
              // Read dependency variables
              var vIn = calc.getVar('vIn').getRawVal()
              var vOut = calc.getVar('vOut').getRawVal()
              return vIn > vOut
            },
            text: 'Vin must be greater than Vout. It is impossible for Vin to be less than Vout because a resistor divider can only reduce the input voltage.',
            level: 'error'
          })
        ],
        helpText: 'The input voltage to the top of the resistor divider (also equal to the voltage across the entire resistor divider).'
      })
      calc.addVar(vIn)

      // ============================================ //
      // ===================== rTop ================= //
      // ============================================ //
      var rTop = new CalcVarNumeric({
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
          new UnitMulti({name: 'mΩ', multi: 1e-3}),
          new UnitMulti({name: 'Ω', multi: 1e0}),
          new UnitMulti({name: 'kΩ', multi: 1e3}),
          new UnitMulti({name: 'MΩ', multi: 1e6}),
          new UnitMulti({name: 'GΩ', multi: 1e9})
        ],
        defaultUnitName: 'kΩ',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The resistance of the top resistor in the resistor divider.'
      })
      calc.addVar(rTop)

      // ============================================ //
      // ===================== rBot ================= //
      // ============================================ //
      var rBot = new CalcVarNumeric({
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
          new UnitMulti({name: 'mΩ', multi: 1e-3}),
          new UnitMulti({name: 'Ω', multi: 1e0}),
          new UnitMulti({name: 'kΩ', multi: 1e3}),
          new UnitMulti({name: 'MΩ', multi: 1e6}),
          new UnitMulti({name: 'GΩ', multi: 1e9})
        ],
        defaultUnitName: 'kΩ',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The resistance of the bottom resistor in the resistor divider.'
      })
      calc.addVar(rBot)

      // ============================================ //
      // ===================== vOut ================= //
      // ============================================ //
      var vOut = new CalcVarNumeric({
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
          new UnitMulti({name: 'mV', multi: 1e-3}),
          new UnitMulti({name: 'V', multi: 1e0})
        ],
        defaultUnitName: 'V',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
          new CustomValidator({
            func: () => {
              // Read dependency variables
              var vIn = calc.getVar('vIn').getRawVal()
              var vOut = calc.getVar('vOut').getRawVal()
              return vOut < vIn
            },
            text: 'Vout must be less than Vin. It is impossible for Vout to be greater than Vin because a resistor divider can only reduce the input voltage.',
            level: 'error'
          })
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
