<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calc-container" style="width: 600px; height: 600px;">

    <!-- ========================================= -->
    <!-- ====== DESIRED RESISTANCE (input) ======= -->
    <!-- ========================================= -->

    <calc-value :calcVar="calc.getVar('desiredResistance')"></calc-value><span>Ω</span>


    <!-- ========================================= -->
    <!-- ===== E-SERIES RESISTANCES (outputs) ==== -->
    <!-- ========================================= -->

    <table>
      <tbody>

      <tr class="header-row">
        <td>Series</td>
        <td>Closest Resistance</td>
        <td>Percentage Error</td>
        <td>Closest Equal or Lower Resistance</td>
        <td>Percentage Error</td>
        <td>Closest Equal or Higher Resistance</td>
        <td>Percentage Error</td>
      </tr>

      <tr>
        <td>E6</td>
        <td><calc-value :calcVar="calc.getVar('desiredResistance')"></calc-value><span>Ω</span></td>
      </tr>
      </tbody>
    </table>

  </div>

</template>

<script>

  'use strict'

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import CalcVar from 'src/misc/CalculatorEngineV2/CalcVar'
  import PresetValidators from 'src/misc/CalculatorEngineV2/PresetValidators'
  import StandardResistanceFinder from 'src/misc/StandardResistanceFinder/StandardResistanceFinder'

  var standardResistanceFinder = new StandardResistanceFinder()

  /**
   * Helper function to create all the necessary calculator variables for an entire
   * row in the table (a complete resistor series).
   * @param calc
   * @param seriesName
   */
  function createCalcVariablesForSeries (calc, seriesName) {
    var resistance = new CalcVar(new CalcVar({
      name: seriesName + 'Resistance',
      typeEqn: () => {
        return 'output'
      },
      eqn: () => {
        return standardResistanceFinder.find(seriesName)
      },
      rawVal: '',
      units: [
        {text: 'V', value: 1}
      ],
      selUnit: 1,
      roundTo: 4,
      validators: [
        PresetValidators.IS_NUMBER,
        PresetValidators.IS_POSITIVE
      ]
    }))
    calc.addVar(resistance)
  }

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'standard-resistance-calculator',
    components: {
    },
    data: function () {
      var calc = new Calc()

      // ============================================ //
      // ======== DESIRED RESISTANCE (input) ======== //
      // ============================================ //
      var desiredResistance = new CalcVar(new CalcVar({
        name: 'desiredResistance',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {},
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
        ]
      }))
      calc.addVar(desiredResistance)

      createCalcVariablesForSeries(calc, 'e6')

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
  .header-row {
    font-weight: bold;
  }

</style>
