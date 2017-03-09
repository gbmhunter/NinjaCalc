<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container">

    <ui-collapsible title="Info" class="calc-info" style="max-width: 800px; margin: auto;">
      <p>Use this calculator to find the maximum current that a PCB via can handle (a.k.a. as it's <i>ampacity</i>). This calculator uses equations formed from the data presented in the IPC-2221A standard. This equation takes into account the via diameter, via plating thickness and permissible temperature rise.</p>

      <p>The equation used to calculate the maximum via current is:</p>

      <p>$$ I = \Delta T^b \cdot A^c $$</p>
      <p style="text-align: center;">
        where:<br>
        \( I \) = the max. current allowed through the via, in Amps.<br>
        \( \Delta T \) = the maximum permissible temperature rise of the via above ambient, in \(^{\circ}C\). \(20\) to \(40^{\circ}C\) is a common value for this.<br>
        \( b \) = A co-efficient from the IPC-2221A standard.<br>
        \( A \) = the cross-sectional area of the via (the area of the via as looking top down onto it), in \(mills^2\) (imperial).<br>
        \( c \) = A co-efficient from the IPC-2221A standard.
      <p>

      <p>This calculator, when given the via length and plated copper resistivity (default value provided, only change if necessary), will also find approximate values for the electrical and thermal resistance of the via.</p>

      <p>The via's resistance is calculated with the equation:</p>

      <p>$$ R = \frac{\rho l}{A} $$</p>
      <p style="text-align: center;">
        where:<br>
        \( R \) is the resistance of the via, as measured from it's top surface to it's bottom surface, in \(\Omega\).<br>
        \( \rho \) is the resistivity of plated copper, in \( \Omega \cdot m \). A default value of \(19e^{-9}\Omega m\) is provided for this variable.<br>
        \( l \) is the length of the via (a.k.a. it's height), in \(m\).<br>
        \( A \) is the cross-sectional area of the via (the area of the via as looking top down onto it), in \(m^2\).
      <p>

      <p>The thermal resistance is calculated with the equation:</p>

      <p>$$ R_{\theta} = \frac{l}{k \cdot A} $$</p>
      <p style="text-align: center;">
        where:<br>
        \( R_{\theta} \) is the thermal resistance of the via, in \(K/W\).<br>
        \( l \) is the length of the via (a.k.a. it's height), in \(m\).<br>
        \( k \) is the specific thermal conductivity of plated copper, in \( W/Km \). A default value of \(401.8W/K \cdot m \) is provided for this variable.<br>
        \( A \) is the cross-sectional area of the via (the area of the via as looking top down onto it), in \(m^2\).
      <p>

      <p>Remember this calculator does not take into account other nearby heat sources.</p>
    </ui-collapsible>

    <!-- This div can be treated like a HBox -->
    <div style="display: flex;">
    <div class="diagram-container" style="position: relative; width: 530px; height: 500px; margin: auto;">

      <!-- Background image is centered in diagram container -->
      <img :src="require('./via-with-dimensions.png')" style="left: 50px; top: 50px; max-width: 300px; z-index: 0">

      <!-- ========================================= -->
      <!-- ===== FINISHED HOLE DIAMETER (input)===== -->
      <!-- ========================================= -->
      <calc-value-and-unit :calcVar="calc.getVar('finishedHoleDiameter_M')" :width=80
                           style="left: 290px; top: 60px;"></calc-value-and-unit>

      <!-- PLATING THICKNESS (input) -->
      <calc-value-and-unit :calcVar="calc.getVar('platingThickness_M')" :width=80
                           style="left: 320px; top: 130px;"></calc-value-and-unit>

      <!-- VIA LENGTH (input) -->
      <calc-value-and-unit :calcVar="calc.getVar('viaLength_M')" :width=80
                           style="left: 350px; top: 280px;"></calc-value-and-unit>

    </div>

    <!-- This table contains the calculator variables which do not belong on the diagram -->
    <table style="margin: auto;">
      <tbody>
      <tr>
        <td>Temperature Rise</td>
        <td><calc-value :calcVar="calc.getVar('temperatureRise_DegC')"></calc-value></td>
        <td><calc-units :calcVar="calc.getVar('temperatureRise_DegC')"></calc-units></td>
      </tr>
      <tr>
        <td>Plated Copper Resistivity</td>
        <td><calc-value :calcVar="calc.getVar('platedCopperResistivity_OhmM')"></calc-value></td>
        <td><calc-units :calcVar="calc.getVar('platedCopperResistivity_OhmM')"></calc-units></td>
      </tr>
      <tr>
        <td>Specific Thermal Conductivity<br>(of plated copper)</td>
        <td><calc-value :calcVar="calc.getVar('specificThermalConductivity_WpKm')"></calc-value></td>
        <td><calc-units :calcVar="calc.getVar('specificThermalConductivity_WpKm')"></calc-units></td>
      </tr>
      <tr>
        <td>Via Cross-Sectional Area</td>
        <td><calc-value :calcVar="calc.getVar('viaCrossSectionalArea_M2')"></calc-value></td>
        <td><calc-units :calcVar="calc.getVar('viaCrossSectionalArea_M2')"></calc-units></td>
      </tr>
      <tr>
        <td>Via Resistance</td>
        <td><calc-value :calcVar="calc.getVar('viaResistance_Ohms')"></calc-value></td>
        <td><calc-units :calcVar="calc.getVar('viaResistance_Ohms')"></calc-units></td>
      </tr>
      <tr>
        <td>Thermal Resistance</td>
        <td><calc-value :calcVar="calc.getVar('thermalResistance_DegCpWatt')"></calc-value></td>
        <td><calc-units :calcVar="calc.getVar('thermalResistance_DegCpWatt')"></calc-units></td>
      </tr>
      <tr style="font-weight: bold;">
        <td>Current Limit</td>
        <td><calc-value :calcVar="calc.getVar('currentLimit_A')"></calc-value></td>
        <td><calc-units :calcVar="calc.getVar('currentLimit_A')"></calc-units></td>
      </tr>
      </tbody>
    </table>
    </div>
  </div>

</template>

<script>

  //  'use strict'

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import {CalcVarNumeral} from 'src/misc/CalculatorEngineV2/CalcVarNumeral'
  import PresetValidators from 'src/misc/CalculatorEngineV2/PresetValidators'
  import {UnitConversionConstants} from 'src/misc/UnitConversionConstants/UnitConversionConstants'

  /* eslint-disable camelcase */

  const ipc2221ACoefficientK = 0.048
  const ipc2221ACoefficientb = 0.44
  const ipc2221ACoefficientc = 0.725

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'via-current-ipc-2221a-calculator',
    components: {},
    data: function () {
      var calc = new Calc()

      // ============================================ //
      // ====== FINISHED HOLE DIAMETER (input) ====== //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'finishedHoleDiameter_M',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '',
        units: [
          {text: 'um', value: 1e-6},
          {text: 'mm', value: 1e-3}
        ],
        selUnit: 1e-3,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The finished hole diameter of the via. This is not the same as the drilled hole diameter, as the via is then plated.'
      }))

      // ============================================ //
      // ========= PLATING THICKNESS (input) ======== //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'platingThickness_M',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '',
        units: [
          {text: 'um', value: 1e-6},
          {text: 'oz', value: UnitConversionConstants.COPPER_THICKNESS_M_PER_OZ},
          {text: 'mils', value: UnitConversionConstants.METERS_PER_MILS}
        ],
        selUnit: 1e-6,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The plating thickness of the via walls. This is usually the same as the thickness of the start and end copper layers that the via connects to.'
      }))

      // ============================================ //
      // ============= VIA LENGTH (input) =========== //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'viaLength_M',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '',
        units: [
          {text: 'um', value: 1e-6},
          {text: 'mm', value: 1e-3},
          {text: 'mils', value: UnitConversionConstants.METERS_PER_MILS}
        ],
        selUnit: 1e-3,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The length of the via. This is equal to the distance between the copper planes the via starts and ends on.' +
        ' For a simple 2-layer 1.6mm thick PCB, the via height is also 1.6mm. This could also be called the height of the via.'
      }))

      // ============================================ //
      // ========== TEMPERATURE RISE (input) ======== //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'temperatureRise_DegC',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '20.0',
        units: [
          {text: '°C', value: 1e0}
        ],
        selUnit: 1e0,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The maximum temperature rise above ambient you are allowing for the via. A rule-of-thumb for this value is between 10-40°C.'
      }))

      // ============================================ //
      // ===== PLATED COPPER RESISTIVITY (input) ==== //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'platedCopperResistivity_OhmM',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '19e-9',
        units: [
          {text: 'Ω⋅m', value: 1e0}
        ],
        selUnit: 1e0,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The resistivity of the plated copper which the via is made from.'
      }))

      // ============================================ //
      // == SPECIFIC THERMAL CONDUCTIVITY (input) === //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'specificThermalConductivity_WpKm',
        typeEqn: () => {
          return 'input'
        },
        eqn: () => {
        },
        rawVal: '401.8',
        units: [
          {text: 'W/K⋅m', value: 1e0}
        ],
        selUnit: 1e0,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The specific thermal conductivity, k, of the plated copper which the via is made from.'
      }))

      // ============================================ //
      // ===== VIA CROSS-SECTIONAL AREA (output) ==== //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'viaCrossSectionalArea_M2',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependencies
          const finishedHoleDiameter_M = calc.getVar('finishedHoleDiameter_M').getRawVal()
          const platingThickness_M = calc.getVar('platingThickness_M').getRawVal()

          return Math.PI * (finishedHoleDiameter_M + platingThickness_M) * platingThickness_M
        },
        rawVal: '',
        units: [
          {text: 'm2', value: 1e0}
        ],
        selUnit: 1e0,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The cross-sectional area of the via (the area of the via as viewed from the top down).'
      }))

      // ============================================ //
      // ============ VIA RESISTANCE (output) ======= //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'viaResistance_Ohms',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependencies
          const platedCopperResistivity_OhmM = calc.getVar('platedCopperResistivity_OhmM').getRawVal()
          const viaLength_M = calc.getVar('viaLength_M').getRawVal()
          const viaCrossSectionalArea_M2 = calc.getVar('viaCrossSectionalArea_M2').getRawVal()

          return (platedCopperResistivity_OhmM * viaLength_M) / viaCrossSectionalArea_M2
        },
        rawVal: '',
        units: [
          {text: 'mΩ', value: 1e-3}
        ],
        selUnit: 1e-3,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The resistance of the via. This is the resistance as measured from the top to the bottom of the via.'
      }))

      // ============================================ //
      // ========== THERMAL RESISTANCE (output) ===== //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'thermalResistance_DegCpWatt',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependencies
          const viaLength_M = calc.getVar('viaLength_M').getRawVal()
          const specificThermalConductivity_WpKm = calc.getVar('specificThermalConductivity_WpKm').getRawVal()
          const viaCrossSectionalArea_M2 = calc.getVar('viaCrossSectionalArea_M2').getRawVal()

          return viaLength_M / (specificThermalConductivity_WpKm * viaCrossSectionalArea_M2)
        },
        rawVal: '',
        units: [
          {text: '°C/W', value: 1e0}
        ],
        selUnit: 1e0,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The thermal resistance of the via.'
      }))

      // ============================================ //
      // ========== CURRENT LIMIT (output) ========== //
      // ============================================ //
      calc.addVar(new CalcVarNumeral({
        name: 'currentLimit_A',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependencies
          const temperatureRise_DegC = calc.getVar('temperatureRise_DegC').getRawVal()
          const viaCrossSectionalArea_M2 = calc.getVar('viaCrossSectionalArea_M2').getRawVal()

          // Perform unit conversions for IPC-2221A equation
          const viaCrossSectionalArea_Mills2 = viaCrossSectionalArea_M2 * Math.pow((1000.0 / 25.4) * 1000.0, 2)

          // Use the IPC-2221A equation
          return ipc2221ACoefficientK * Math.pow(temperatureRise_DegC, ipc2221ACoefficientb) * Math.pow(viaCrossSectionalArea_Mills2, ipc2221ACoefficientc)
        },
        rawVal: '',
        units: [
          {text: 'A', value: 1e0}
        ],
        selUnit: 1e0,
        roundTo: 4,
        validators: [
          PresetValidators.IS_NUMBER,
          PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The maximum current the via can take before it rises to the specified temperature above ambient.'
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
