<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container">

    <ui-collapsible title="Info" class="calc-info" style="width: 600px;">
      <p>This calculator uses the <i>August-Roche-Magnus equation</i> (also known just as <i>Magnus equation</i>) to allow the calculation of either air temperature, relative humidity, or the dew point (as a temperature, also known as the <i>dew point temperature</i>), when you know the other two values.</p>

      <p>The dew point is given as:</p>

      <p>$$ T_{dp} = \frac{c*(ln(RH) + \frac{b \cdot T_{air}}{c \cdot T_{air}})}{b - ln(RH) - \frac{b \cdot T_{air}}{c \cdot T_{air}}} $$</p>

      <p style="text-align: center;">
        where:<br>
        \( T_{dp} \) = the dew point temperature, in degrees Celcius<br>
        \( RH \) = The relative humidity, as a number between 0-1 (i.e. percentage divided by 100)<br>
        \( b \) = A Magnus equation coefficient, which has no unit<br>
        \( c \) = A Magnus equation coefficient, in degrees Celcius<br>
      <p>

      <p>The exact values for the Magnus equation coefficients \(b\) and \(c\) depend on the exact literature that you the equation from. Common values for both are:</p>

      <p style="text-align: center;">
        \( b = 17.625 \)<br>
        \( c = 243.03^{\circ}C \)
      </p>
    </ui-collapsible>

    <table style="margin: auto; border-spacing: 20px;">
      <tbody>
      <tr>
        <td><input type="radio" value="airTemperature" v-model="calc.outputVar"></td>
        <td><img :src="require('./hot-temperature-guage.png')" style="max-width: 30px;"></td>
        <td>Air Temperature</td>
        <td><calc-value-and-unit :calcVar="calc.getVar('airTemperature')"></calc-value-and-unit></td>
      </tr>
      <tr>
        <td><input type="radio" value="relativeHumidity" v-model="calc.outputVar"></td>
        <td><img :src="require('./water-drop-and-percentage-icon.png')" style="max-width: 30px;"></td>
        <td>Relative Humidity</td>
        <td><calc-value-and-unit :calcVar="calc.getVar('relativeHumidity')"></calc-value-and-unit></td>
      </tr>
      <tr>
        <td><input type="radio" value="dewPoint" v-model="calc.outputVar"></td>
        <td><img :src="require('./cold-temperature-guage.png')" style="max-width: 30px;"></td>
        <td>Dew Point</td>
        <td><calc-value-and-unit :calcVar="calc.getVar('dewPoint')"></calc-value-and-unit></td>
      </tr>
      </tbody>
    </table>

    <div style="height: 20px;"></div>

    <span style="font-weight: bold;">Co-efficients</span>
    <table style="margin: auto; border-spacing: 10px;">
      <tr>
        <td>b</td>
        <td><calc-value :calcVar="calc.getVar('bCoefficient')"></calc-value></td>
        <td>no unit</td>
      </tr>
      <tr>
        <td>c</td>
        <td><calc-value :calcVar="calc.getVar('cCoefficient')"></calc-value></td>
        <td>°C</td>
      </tr>
    </table>

  </div>

</template>

<script>

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import {CalcVarNumeric, NumericValidators} from 'src/misc/CalculatorEngineV2/CalcVarNumeric'
  import {UnitMulti} from 'src/misc/CalculatorEngineV2/UnitMulti'
  import {UnitFunc} from 'src/misc/CalculatorEngineV2/UnitFunc'

  /* eslint-disable camelcase */

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'dew-point-magnus-calculator',
    components: {},
    data: function () {
      var calc = new Calc()

      // Create new variable in class for determining what is input and output
      calc.outputVar = 'dewPoint'

      // ============================================ //
      // =========== AIR TEMPERATURE (i/o) ========== //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'airTemperature',
        typeEqn: () => {
          if (calc.outputVar === 'airTemperature') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          const relativeHumidity = calc.getVar('relativeHumidity').getRawVal()
          const dewPoint = calc.getVar('dewPoint').getRawVal()
          const bCoefficient = calc.getVar('bCoefficient').getRawVal()
          const cCoefficient = calc.getVar('cCoefficient').getRawVal()

          return cCoefficient * (((bCoefficient * dewPoint) / (cCoefficient + dewPoint)) - Math.log(relativeHumidity / 100.0)) /
            (bCoefficient + Math.log(relativeHumidity / 100.0) - ((bCoefficient * dewPoint) / (cCoefficient + dewPoint)))
        },
        rawVal: '',
        units: [
          new UnitMulti({ name: '°C', multi: 1e0 }),
          new UnitFunc({
            name: 'F',
            toUnit: function (baseValue) {
              return baseValue * 1.8 + 32
            },
            fromUnit: function (unitValue) {
              return (unitValue - 32) / 1.8
            }
          })
        ],
        defaultUnitName: '°C',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER
        ],
        helpText: 'The temperature of the air. This must be the same temperature at which the relative humidity was measured at.'
      }))

      // ============================================ //
      // ========== RELATIVE HUMIDITY (i/o) ========= //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'relativeHumidity',
        typeEqn: () => {
          if (calc.outputVar === 'relativeHumidity') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          const airTemperature_DegC = calc.getVar('airTemperature').getRawVal()
          const dewPoint_DegC = calc.getVar('dewPoint').getRawVal()
          const bCoefficient = calc.getVar('bCoefficient').getRawVal()
          const cCoefficient = calc.getVar('cCoefficient').getRawVal()

          return 100.0 * (Math.exp((bCoefficient * dewPoint_DegC) / (cCoefficient + dewPoint_DegC)) /
            Math.exp((bCoefficient * airTemperature_DegC) / (cCoefficient + airTemperature_DegC)))
        },
        rawVal: '',
        units: [
          new UnitMulti({ name: '%', multi: 1e0 })
        ],
        defaultUnitName: '%',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The relative humidity the the air, expressed as a percentage of the total amount of water the air could hold at the current temperature.'
      }))

      // ============================================ //
      // =============== DEW POINT (i/o) ============ //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'dewPoint',
        typeEqn: () => {
          if (calc.outputVar === 'dewPoint') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          const airTemperature_DegC = calc.getVar('airTemperature').getRawVal()
          const relativeHumidity_Perc = calc.getVar('relativeHumidity').getRawVal()
          const bCoefficient = calc.getVar('bCoefficient').getRawVal()
          const cCoefficient = calc.getVar('cCoefficient').getRawVal()

          const dewPointNumerator = cCoefficient * (Math.log(relativeHumidity_Perc / 100.0) + ((bCoefficient * airTemperature_DegC) / (airTemperature_DegC + cCoefficient)))
          const dewPointDenominator = bCoefficient - Math.log(relativeHumidity_Perc / 100.0) - ((bCoefficient * airTemperature_DegC) / (airTemperature_DegC + cCoefficient))
          const dewPoint_DegC = dewPointNumerator / dewPointDenominator
          return dewPoint_DegC
        },
        rawVal: '',
        units: [
          new UnitMulti({ name: '°C', multi: 1e0 }),
          new UnitFunc({
            name: 'F',
            toUnit: function (baseValue) {
              return baseValue * 1.8 + 32
            },
            fromUnit: function (unitValue) {
              return (unitValue - 32) / 1.8
            }
          })
        ],
        defaultUnitName: '°C',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER
        ],
        helpText: 'If the air is cooled to the dew point temperature, then dew (condensation) will start to form. This value is allowed to be below the freezing point of water.'
      }))

      // ============================================ //
      // ============ B COEFFICIENT (input) ========= //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'bCoefficient',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {},
        rawVal: '17.625',
        units: [
          new UnitMulti({ name: 'no unit', multi: 1e0 })
        ],
        defaultUnitName: 'no unit',
        roundTo: 5,
        validators: [
          NumericValidators.IS_NUMBER
        ],
        helpText: 'The b coefficient of the Magnus equation.'
      }))

      // ============================================ //
      // ============ C COEFFICIENT (input) ========= //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'cCoefficient',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {},
        rawVal: '243.04',
        units: [
          new UnitMulti({ name: '°C', multi: 1e0 }),
          new UnitFunc({
            name: 'F',
            toUnit: function (baseValue) {
              return baseValue * 1.8 + 32
            },
            fromUnit: function (unitValue) {
              return (unitValue - 32) / 1.8
            }
          })
        ],
        defaultUnitName: '°C',
        roundTo: 5,
        validators: [
          NumericValidators.IS_NUMBER
        ],
        helpText: 'The c coefficient of the Magnus equation.'
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
