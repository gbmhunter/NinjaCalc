<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container">

    <ui-collapsible title="Info" class="calc-info" style="max-width: 600px;">
      <p>This calculator takes in the provided data (as either ASCII/Unicode or hex) and calculates the resulting CRC value using a range of popular CRC algorithms.</p>

      <p>When the ASCII/Unicode radiobutton is selected, values entered into the CRC data textbox will be treated as ASCII/Unicode characters. These characters will then be converted to their corresponding Unicode integer values. (Unicode is a complete superset of ASCII, so all ASCII characters map to the same integer values as Unicode characters).</p>

    </ui-collapsible>

    <!-- ========================================= -->
    <!-- =============== VOLTAGE ================= -->
    <!-- ========================================= -->

    <calc-value :calcVar="calc.getVar('crcData')"></calc-value>

  </div>
  </div>

</template>

<script>

  //  'use strict'

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import {CalcVarString} from 'src/misc/CalculatorEngineV2/CalcVarString'
  import {CalcVarComboBox} from 'src/misc/CalculatorEngineV2/CalcVarComboBox'
  import {CalcVarInvisible} from 'src/misc/CalculatorEngineV2/CalcVarInvisible'
  //  import PresetValidators from 'src/misc/CalculatorEngineV2/PresetValidators'

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'crc-calculator',
    components: {},
    data: function () {
      var calc = new Calc()

      // Create new variable in class for determining what is input and output
      calc.outputVar = 'resistance'

      // ============================================ //
      // =================== CRC DATA =============== //
      // ============================================ //
      calc.addVar(new CalcVarString({
        name: 'crcData',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        defaultVal: '',
        validators: [],
        helpText: 'The textual input.'
      }))

      // ============================================ //
      // ================ CRC DATA TYPE ============= //
      // ============================================ //
      calc.addVar(new CalcVarComboBox({
        name: 'crcDataType',
        options: [
          'ASCII/Unicode',
          'Hex'
        ],
        defaultVal: 'ASCII/Unicode',
        validators: [],
        helpText: 'The type of data in the "CRC Data" textbox.'
      }))

      // ============================================ //
      // ============== CRC VAR INVISIBLE =========== //
      // ============================================ //
      calc.addVar(new CalcVarInvisible({
        name: 'convertedCrcData',
        eqn: () => {
          return '1'
        },
        defaultVal: '',
        validators: []
      }))

      // Configure calculator to default state now that all
      // variables have been added.
      calc.init()

      return {
        calc: calc
      }
    },
    mounted () {
//      console.log('Ohm\'s Law calculator mounted.')
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
