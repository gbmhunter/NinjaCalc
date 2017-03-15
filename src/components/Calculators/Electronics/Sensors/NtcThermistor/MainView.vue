<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container">

    <ui-collapsible title="Info" class="calc-info" style="width: 600px;">
      <p>This calculator allows the calculation of various thermistor properties by using the <i>Beta equation</i>. The
        Beta equation is commonly used in microcontroller code to work out the thermistor temperature after the micro's
        ADC measures the thermistors resistance.</p>

      <p>The beta equation is:</p>

      <p>$$ \frac{1}{T} = \frac{1}{T_0} + \frac{1}{\beta} ln (\frac{R}{R_0}) $$</p>

      <p style="text-align: center;">
        where:<br>
        \( \beta \) is the Beta co-efficient. This is usually specified in the thermistors datasheet.<br>
        \( T_0 \) is the temperature at the reference point, in Kelvin. This is usually \(25^{\circ}C\).<br>
        \( R_0 \) is the resistance at the reference point, in Ohms.<br>
        \( T \) is the thermistor temperature, with measured resistance \( R \), in Kelvin.<br>
        \( R \) is the thermistor resistance, measured at temperature \(T\), in Ohms.<br>
      <p>

      <p>This equation can be re-arranged to calculate any of the variables when the other 4 are known.</p>

      <p>To find \(\beta\):</p>

      <p>$$ \beta = \frac{ln(\frac{R}{R_0})}{\frac{1}{T} - \frac{1}{T_0}} $$</p>

      <p>To find \(R_0\):</p>

      <p>$$ R_0 = \frac{R}{e^{\beta (\frac{1}{T} - \frac{1}{T_0})}} $$</p>

      <p>To find \(T_0\).</p>

      <p>$$ T_0 = \frac{1}{\frac{1}{T} - \frac{1}{\beta}ln(\frac{R}{R_0})} $$</p>

      <p>To find \(R\):</p>

      <p>$$ R = R_0 e^{\beta (\frac{1}{T} - \frac{1}{T_0})} $$</p>

      <p>To find \(T\):</p>

      <p>$$ T = \frac{1}{\frac{1}{T_0} + \frac{1}{\beta}ln(\frac{R}{R_0})} $$</p>
    </ui-collapsible>

    <div style="height: 20px;"></div>

    <table style="margin: auto;">
      <tbody>
      <tr>
        <td><input type="radio" value="beta" v-model="calc.outputVar"></td>
        <td>Beta Coefficient</td>
        <td>\( \beta \)</td>
        <td>
          <calc-value :calcVar="calc.getVar('beta')"></calc-value>
        </td>
        <td><calc-units :calcVar="calc.getVar('beta')"></calc-units></td>
      </tr>
      <tr>
        <td><input type="radio" value="referenceResistance" v-model="calc.outputVar"></td>
        <td>Reference Resistance</td>
        <td>\( R_0 \)</td>
        <td>
          <calc-value :calcVar="calc.getVar('referenceResistance')"></calc-value>
        </td>
        <td><calc-units :calcVar="calc.getVar('referenceResistance')"></calc-units></td>
      </tr>
      <tr>
        <td><input type="radio" value="referenceTemperature" v-model="calc.outputVar"></td>
        <td>Reference Resistance</td>
        <td>\( T_0 \)</td>
        <td>
          <calc-value :calcVar="calc.getVar('referenceTemperature')"></calc-value>
        </td>
        <td><calc-units :calcVar="calc.getVar('referenceTemperature')"></calc-units></td>
      </tr>
      <tr>
        <td><input type="radio" value="thermistorResistance" v-model="calc.outputVar"></td>
        <td>Thermistor Resistance</td>
        <td>\( R \)</td>
        <td>
          <calc-value :calcVar="calc.getVar('thermistorResistance')"></calc-value>
        </td>
        <td><calc-units :calcVar="calc.getVar('thermistorResistance')"></calc-units></td>
      </tr>
      <tr>
        <td><input type="radio" value="thermistorTemperature" v-model="calc.outputVar"></td>
        <td>Reference Resistance</td>
        <td>\( T \)</td>
        <td>
          <calc-value :calcVar="calc.getVar('thermistorTemperature')"></calc-value>
        </td>
        <td><calc-units :calcVar="calc.getVar('thermistorTemperature')"></calc-units></td>
      </tr>
      </tbody>
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
    name: 'ntc-thermistor-calculator',
    components: {},
    data: function () {
      var calc = new Calc()

      // Create new variable in class for determining what is input and output
      calc.outputVar = 'thermistorTemperature'

      // ============================================ //
      // ================== BETA (i/o) ============== //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'beta',
        typeEqn: () => {
          if (calc.outputVar === 'beta') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          const referenceResistance_Ohms = calc.getVar('referenceResistance').getRawVal()
          const referenceTemperature_K = calc.getVar('referenceTemperature').getRawVal()
          const thermistorResistance_Ohms = calc.getVar('thermistorResistance').getRawVal()
          const thermistorTemperature_K = calc.getVar('thermistorTemperature').getRawVal()

          const beta_NoUnit = Math.log(thermistorResistance_Ohms / referenceResistance_Ohms) / (1 / thermistorTemperature_K - 1 / referenceTemperature_K)
          return beta_NoUnit
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'no unit', multi: 1e0})
        ],
        defaultUnitName: 'no unit',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The coefficient beta. This is usually specified in the thermistors datasheet.'
      }))

      // ============================================ //
      // ======== REFERENCE RESISTANCE (i/o) ======== //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'referenceResistance',
        typeEqn: () => {
          if (calc.outputVar === 'referenceResistance') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          const beta_NoUnit = calc.getVar('beta').getRawVal()
          const referenceTemperature_K = calc.getVar('referenceTemperature').getRawVal()
          const thermistorResistance_Ohms = calc.getVar('thermistorResistance').getRawVal()
          const thermistorTemperature_K = calc.getVar('thermistorTemperature').getRawVal()

          const referenceResistance_Ohms = thermistorResistance_Ohms / (Math.exp(beta_NoUnit * (1 / thermistorTemperature_K - 1 / referenceTemperature_K)))
          return referenceResistance_Ohms
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'mΩ', multi: 1e-3}),
          new UnitMulti({name: 'Ω', multi: 1e0}),
          new UnitMulti({name: 'kΩ', multi: 1e3}),
          new UnitMulti({name: 'MΩ', multi: 1e6})
        ],
        defaultUnitName: 'kΩ',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The resistance of the thermistor at the reference point. This is usually when the thermistor is at 25°C.'
      }))

      // ============================================ //
      // ======== REFERENCE TEMPERATURE (i/o) ======= //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'referenceTemperature',
        typeEqn: () => {
          if (calc.outputVar === 'referenceTemperature') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          const beta_NoUnit = calc.getVar('beta').getRawVal()
          const referenceResistance_Ohms = calc.getVar('referenceResistance').getRawVal()
          const thermistorResistance_Ohms = calc.getVar('thermistorResistance').getRawVal()
          const thermistorTemperature_K = calc.getVar('thermistorTemperature').getRawVal()

          const referenceTemperature_K = 1.0 / (1.0 / thermistorTemperature_K - (1.0 / beta_NoUnit) * Math.log(thermistorResistance_Ohms / referenceResistance_Ohms))
          return referenceTemperature_K
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'K', multi: 1e0}),
          new UnitFunc({
            name: '°C',
            toUnit: function (baseValue) {
              return baseValue - 273.15
            },
            fromUnit: function (unitValue) {
              return unitValue + 273.15
            }
          }),
          new UnitFunc({
            name: 'F',
            toUnit: function (baseValue) {
              return (baseValue - 273.15) * 1.8 + 32
            },
            fromUnit: function (unitValue) {
              return ((unitValue - 32) / 1.8) + 273.15
            }
          })
        ],
        defaultUnitName: '°C',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER
        ],
        helpText: 'The temperature of the thermistor at the reference point. This is usually 25°C.'
      }))

      // ============================================ //
      // ======== THERMISTOR RESISTANCE (i/o) ======= //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'thermistorResistance',
        typeEqn: () => {
          if (calc.outputVar === 'thermistorResistance') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          const beta_NoUnit = calc.getVar('beta').getRawVal()
          const referenceResistance_Ohms = calc.getVar('referenceResistance').getRawVal()
          const referenceTemperature_K = calc.getVar('referenceTemperature').getRawVal()
          const thermistorTemperature_K = calc.getVar('thermistorTemperature').getRawVal()

          const thermistorResistance_Ohms = referenceResistance_Ohms * Math.exp(beta_NoUnit * (1.0 / thermistorTemperature_K - 1.0 / referenceTemperature_K))
          return thermistorResistance_Ohms
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'mΩ', multi: 1e-3}),
          new UnitMulti({name: 'Ω', multi: 1e0}),
          new UnitMulti({name: 'kΩ', multi: 1e3}),
          new UnitMulti({name: 'MΩ', multi: 1e6})
        ],
        defaultUnitName: 'kΩ',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The present resistance of the thermistor, at temperature T.'
      }))

      // ============================================ //
      // ======= THERMISTOR TEMPERATURE (i/o) ======= //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'thermistorTemperature',
        typeEqn: () => {
          if (calc.outputVar === 'thermistorTemperature') {
            return 'output'
          } else {
            return 'input'
          }
        },
        eqn: () => {
          // Read dependency variables
          const beta_NoUnit = calc.getVar('beta').getRawVal()
          const referenceResistance_Ohms = calc.getVar('referenceResistance').getRawVal()
          const referenceTemperature_K = calc.getVar('referenceTemperature').getRawVal()
          const thermistorResistance_Ohms = calc.getVar('thermistorResistance').getRawVal()

          const thermistorTemperature_K = 1.0 / (1.0 / referenceTemperature_K + (1.0 / beta_NoUnit) * Math.log(thermistorResistance_Ohms / referenceResistance_Ohms))
          return thermistorTemperature_K
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'K', multi: 1e0}),
          new UnitFunc({
            name: '°C',
            toUnit: function (baseValue) {
              return baseValue - 273.15
            },
            fromUnit: function (unitValue) {
              return unitValue + 273.15
            }
          }),
          new UnitFunc({
            name: 'F',
            toUnit: function (baseValue) {
              return (baseValue - 273.15) * 1.8 + 32
            },
            fromUnit: function (unitValue) {
              return ((unitValue - 32) / 1.8) + 273.15
            }
          })
        ],
        defaultUnitName: '°C',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER
        ],
        helpText: 'The present temperature of the thermistor, at resistance R.'
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
