<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calc-container" style="width: 600px; height: 600px;">

    <!-- ========================================= -->
    <!-- ====== DESIRED RESISTANCE (input) ======= -->
    <!-- ========================================= -->

    <div>
      <span style="padding-right: 10px">Desired Resistance</span>
      <calc-value :calcVar="calc.getVar('desiredResistance')"></calc-value>
      <span>Ω</span>
    </div>

    <div style="height: 50px"></div>

    <!-- ========================================= -->
    <!-- ===== E-SERIES RESISTANCES (outputs) ==== -->
    <!-- ========================================= -->

    <table>
      <tbody>

      <tr class="header-row">
        <td>Series</td>
        <td id="closest-resistance">Closest Resistance</td>
        <td>Percentage Error</td>
        <td>Closest Equal or Lower Resistance</td>
        <td>Percentage Error</td>
        <td>Closest Equal or Higher Resistance</td>
        <td>Percentage Error</td>
      </tr>

      <e-series-row :calc="calc" :eSeries="standardResistanceFinder.eSeriesOptions.E6"></e-series-row>
      <e-series-row :calc="calc" :eSeries="standardResistanceFinder.eSeriesOptions.E12"></e-series-row>
      <e-series-row :calc="calc" :eSeries="standardResistanceFinder.eSeriesOptions.E24"></e-series-row>
      <e-series-row :calc="calc" :eSeries="standardResistanceFinder.eSeriesOptions.E48"></e-series-row>
      <e-series-row :calc="calc" :eSeries="standardResistanceFinder.eSeriesOptions.E96"></e-series-row>
      <e-series-row :calc="calc" :eSeries="standardResistanceFinder.eSeriesOptions.E192"></e-series-row>
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
  import ESeriesRow from './ESeriesRow.vue'

  var standardResistanceFinder = new StandardResistanceFinder()

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'standard-resistance-calculator',
    components: {
      ESeriesRow
    },
    data: function () {
      console.log('data called.')
      var calc = new Calc()

      // ============================================ //
      // ======== DESIRED RESISTANCE (input) ======== //
      // ============================================ //
      var desiredResistance = new CalcVar(new CalcVar({
        name: 'desiredResistance',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
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
        ]
      }))
      calc.addVar(desiredResistance)

      // Configure calculator to default state now that all
      // variables have been added.
      calc.init()

      return {
        calc: calc,
        standardResistanceFinder: standardResistanceFinder
      }
    },
    mounted () {
      console.log('Standard Resistance calculator mounted.')
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-row {
    font-weight: bold;
  }

  .calc-container {
    display: flex;
    flex-direction: column;
    /* Center horizontally */
    align-items: center;
    /* Center vertically */
    justify-content: center;
  }

  #closest-resistance {
    width: 30px;
  }

</style>
