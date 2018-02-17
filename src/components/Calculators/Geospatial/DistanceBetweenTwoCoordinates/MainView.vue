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

    <table>
      <tbody>
      <tr>
        <select v-model="selInputType" v-on:change="onUnitChange()" class="variable-units">
          <option v-for="option in inputType" v-bind:value="option.name">
            {{ option.name }}
          </option>
        </select>
      </tr>
      <tr>
        <td>Point 1</td>
        <td><calc-var-string :calcVar="calc.getVar('point1')" style="left: 0px; top: 70px;" :width=80 /></td>
      </tr>
      <tr>
        <td>Point 2</td>
        <td><calc-var-string :calcVar="calc.getVar('point2')" style="left: 0px; top: 70px;" :width=80 /></td>
      </tr>
      <tr>
        <td>Distance</td>
        <td><calc-value-and-unit :calcVar="calc.getVar('distance')" style="left: 0px; top: 70px;" :width=80 /></td>
      </tr>
      </tbody>
    </table>


  </div>
</template>

<script>

  /* eslint-disable camelcase */

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  // import {CalcVarNumeric, NumericValidators} from 'src/misc/CalculatorEngineV2/CalcVarNumeric'
  import {CalcVarString} from 'src/misc/CalculatorEngineV2/CalcVarString'
  import { UnitMulti } from 'src/misc/CalculatorEngineV2/UnitMulti'
  import { Coordinate, Geospatial } from 'src/misc/Geospatial/Geospatial'
  import { CalcVarNumeric } from 'src/misc/CalculatorEngineV2/CalcVarNumeric'

  export default {
    name: 'distance-between-two-coordinates', // This will show up in the URL
    components: {},
    data: function () {
      console.log('data() called')

      var calc = new Calc()

      // ============================================ //
      // =================== POINT 1 ================ //
      // ============================================ //

      calc.addVar(new CalcVarString({
        name: 'point1',
        typeEqn: () => {
          return 'input'
        },
        defaultVal: '',
        validators: [],
        helpText: 'The output value of the choosen CRC algorithm, using the input data given above.'
      }))

      // ============================================ //
      // =================== POINT 2 ================ //
      // ============================================ //

      calc.addVar(new CalcVarString({
        name: 'point2',
        typeEqn: () => {
          return 'input'
        },
        defaultVal: '',
        validators: [],
        helpText: 'The second point.'
      }))

      // ============================================ //
      // ================== DISTANCE ================ //
      // ============================================ //

      calc.addVar(new CalcVarNumeric({
        name: 'distance',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          console.log('Y')
          const point1 = calc.getVar('point1').getVal()
          console.log('point1 = ' + point1)
          const point2 = calc.getVar('point2').getVal()

          // Create Coordinate objects from point1,2 inputs
          var point1Coord = new Coordinate()

          try {
            point1Coord.FromString(point1)
          } catch (e) {
            return NaN
          }
          var point2Coord = new Coordinate()
          try {
            point2Coord.FromString(point2)
          } catch (e) {
            return NaN
          }

          return this.geospatial.DistanceBetweenTwoPoints_m(point1Coord, point2Coord)
        },
        units: [
          new UnitMulti({name: 'm', multi: 1e0}),
          new UnitMulti({name: 'km', multi: 1e3})
        ],
        defaultUnitName: 'km',
        roundTo: 4,
        defaultVal: '',
        validators: [],
        helpText: 'The distance.'
      }))

      return {
        calc: calc,
        geospatial: new Geospatial(),
        inputType: [
          {name: 'Lat, Lon (degrees)'},
          {name: 'Lat, Lon (radians)'}
        ],
        selInputType: 'test'
      }
    },
    methods: {
      calculate: function () {
        console.log('ZZZZ')
      },
      onUnitChange: function () {
        console.log('ABABAB')
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
<style>

</style>
