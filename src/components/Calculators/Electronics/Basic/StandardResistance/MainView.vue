<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container" style="width: 600px; height: 600px;">

    <ui-collapsible title="Info" class="calc-info" style="max-width: 600px;">
      <h1>What Is This?</h1>

      <p>Enter your desired resistance, and this calculator will find the closest <i>preferred value</i> (purchasable resistance) in each one of the EIA <i>E series</i>, from E6 to E192. The percentage difference between your desired resistance and the preferred value is also shown for each E series.</p>

      <p>More information on the E series can be found at <a target="_blank" href="http://www.mbedded.ninja/electronics/components/resistors#the-e-series">http://www.mbedded.ninja/electronics/components/resistors#the-e-series</a>.</p>

      <h1>Accuracy</h1>

      <p>Note that although the E48 series has more values per decade than say, the E24 series, you might find a closer resistance in the E24 series due to the E6, E12 and E24 using a different number sequence to the E48, E96 and E192 series.</p>

      <p>If your desired resistance is exactly half-way (in percentage terms) between two preferred values, this calculator will choose the higher resistance.</p>
    </ui-collapsible>

    <!-- ========================================= -->
    <!-- ====== DESIRED RESISTANCE (input) ======= -->
    <!-- ========================================= -->

    <div style="display: flex; align-items: center">
      <span style="padding-right: 10px">Desired Resistance</span>
      <calc-value :calcVar="calc.getVar('desiredResistance')"></calc-value>
      <span style="padding-left: 5px;">Ω</span>
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

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import {CalcVarNumeric} from 'src/misc/CalculatorEngineV2/CalcVarNumeric'
  import {UnitMulti} from 'src/misc/CalculatorEngineV2/UnitMulti'
  import PresetValidators from 'src/misc/CalculatorEngineV2/PresetValidators'
  import { CustomValidator } from 'src/misc/CalculatorEngineV2/CustomValidator'
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
      calc.addVar(new CalcVarNumeric({
        name: 'desiredResistance',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
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
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO,
          new CustomValidator({
            func: () => {
              // Read dependency variables
              var desiredResistance = calc.getVar('desiredResistance').getRawVal()
              return (desiredResistance >= 1.0 && desiredResistance <= 10.0e6)
            },
            text: 'The desired resistance is outside the "normal" purchasable resistance range of 1Ω to 10MΩ. Some or all of the standard E-series may not have a resistor available with the desired resistance.',
            level: 'warning'
          })
        ],
        helpText: 'The resistance you actually want. The closest value to this resistance will be found in each resistor series.'
      }))
      calc.init()
      return {
        calc: calc,
        standardResistanceFinder: standardResistanceFinder
      }
    },
    mounted () {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-row {
    font-weight: bold;
  }

  .calculator-container {
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
