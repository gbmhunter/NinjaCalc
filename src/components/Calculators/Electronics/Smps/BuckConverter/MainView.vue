<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="calculator-container" style="display: flex; flex-direction: column;">

    <ui-collapsible title="Info" class="calc-info" style="max-width: 600px; margin: auto;">
      <p>This calculator can be used to calculate the values of the critical component values for a buck converter.</p>
    </ui-collapsible>

    <img :src="require('./diagram.png')" style="max-width: 800px; margin: auto;">

    <table class="calc-table" style="max-width: 900px; margin: auto;">
      <thead>
      <tr>
        <th>Variable Name</th>
        <th>Symbol</th>
        <th>Value</th>
        <th>Units</th>
        <th>Notes</th>
      </tr>
      </thead>
      <table-row
        variableName="Input Voltage"
        symbol="V_{in}"
        :calcVar="calc.getVar('vIn_V')"
        notes="The voltage provided to the input of the buck converter. Usually this is from a DC power supply or battery."></table-row>
      <table-row
        variableName="Output Voltage"
        symbol="V_{out}"
        :calcVar="calc.getVar('vOut_V')"
        notes="The output voltage of a buck converter must be equal to or lower than the input voltage."></table-row>
      <table-row
        variableName="Diode Voltage Drop"
        symbol="V_{D}"
        :calcVar="calc.getVar('vD_V')"
        notes="The forward voltage drop across the diode when the diode is fully conducting. The diode may be replaced with an active switching element (such as a MOSFET), to reduce power losses. A MOSFET will have a much lower voltage drop than a diode. This is sometimes called the free-wheeling diode."></table-row>
      <table-row
        variableName="Switching Element Voltage Drop"
        symbol="V_{SW}"
        :calcVar="calc.getVar('vSw_V')"
        notes="The voltage drop across the switching element when the switch is fully ON. The switching element is typically a MOSFET."></table-row>
      <table-row
        variableName="Duty Cycle"
        symbol="D"
        :calcVar="calc.getVar('dutyCycle_Ratio')"
        notes="The on/off duty cycle. It is given by the equation $$D = \frac{V_{out} - V_{D}}{V_{in} - V_{SW} - V_{D}} $$ It is typically expressed as a percentage."></table-row>
      <table-row
        variableName="Switching Frequency"
        symbol="f_{SW}"
        :calcVar="calc.getVar('fSw_Hz')"
        notes="The switching frequency of the transistor (or other switching element)."></table-row>
      <table-row
        variableName="Average Output Current"
        symbol="I_{out}"
        :calcVar="calc.getVar('iOutAvg_A')"
        notes="The average (DC) output current of the buck converter. Note that this is usually higher than the input current!"></table-row>
      <table-row
        variableName="Percentage Output Current Ripple"
        symbol="\frac{\Delta I_{out}}{I_{out}}"
        :calcVar="calc.getVar('iOutRipple_Ratio')"
        notes="The is the percentage ripple of the output current. Strictly speaking, it is the ratio between the amplitude of the output current's AC component (i.e. the ripple), and the output current's DC component (the average output current). It is recommended that this is no more than 10-20%."></table-row>
      <table-row
        variableName="Inductance"
        symbol="L"
        :calcVar="calc.getVar('ind_H')"
        notes="The inductance of the inductor \(L\) in the buck converter. It is given by the equation: $$ L = \frac{ (V_{in} - V{SW} - V_{out}) \cdot D }{ f_{SW} \cdot \Delta I_{out} } $$"></table-row>
    </table>

    <!-- SPACER -->
    <div style="height: 30px;"></div>

  </div>

</template>

<script>

  /* eslint-disable camelcase */

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import TableRow from './TableRow.vue'
  import {CalcVarNumeric, NumericValidators} from 'src/misc/CalculatorEngineV2/CalcVarNumeric'
  import {CustomValidator} from 'src/misc/CalculatorEngineV2/CustomValidator'
  import {UnitMulti} from 'src/misc/CalculatorEngineV2/UnitMulti'

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'buck-converter-calculator',
    components: {
      TableRow
    },
    data: function () {
      var calc = new Calc()

      // ============================================ //
      // =========== INPUT VOLTAGE (input) ========== //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'vIn_V',
        typeEqn: function () {
          return 'input'
        },
        eqn: function () {},
        rawVal: '',
        units: [
          new UnitMulti({name: 'V', multi: 1e0})
        ],
        defaultUnitName: 'V',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The input voltage.'
      }))

      // ============================================ //
      // =========== OUTPUT VOLTAGE (input) ========= //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'vOut_V',
        typeEqn: function () {
          return 'input'
        },
        eqn: function () {},
        rawVal: '',
        units: [
          new UnitMulti({name: 'V', multi: 1e0})
        ],
        defaultUnitName: 'V',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO,
          new CustomValidator({
            func: function () {
              // Read dependency variables
              const vIn_V = calc.getVar('vIn_V').getRawVal()
              const vOut_V = calc.getVar('vOut_V').getRawVal()

              return vOut_V <= vIn_V
            },
            text: 'Vout must be less than or equal to Vin.',
            level: 'error'
          })
        ],
        helpText: 'The output voltage.'
      }))

      // ============================================ //
      // ======== DIODE VOLTAGE DROP (input) ======== //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'vD_V',
        typeEqn: function () {
          return 'input'
        },
        eqn: function () {},
        rawVal: '',
        units: [
          new UnitMulti({name: 'mV', multi: 1e-3}),
          new UnitMulti({name: 'V', multi: 1e0})
        ],
        defaultUnitName: 'V',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO,
          new CustomValidator({
            func: function () {
              // Read dependency variables
              const vIn_V = calc.getVar('vIn_V').getRawVal()
              const vD_V = calc.getVar('vD_V').getRawVal()

              return vD_V < vIn_V
            },
            text: 'Vd must be less than Vin.',
            level: 'error'
          })
        ],
        helpText: 'The diode voltage drop.'
      }))

      // ============================================ //
      // == SWITCHING ELEMENT VOLTAGE DROP (input) == //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'vSw_V',
        typeEqn: function () {
          return 'input'
        },
        eqn: function () {},
        rawVal: '',
        units: [
          new UnitMulti({name: 'mV', multi: 1e-3}),
          new UnitMulti({name: 'V', multi: 1e0})
        ],
        defaultUnitName: 'V',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO,
          new CustomValidator({
            func: function () {
              // Read dependency variables
              const vIn_V = calc.getVar('vIn_V').getRawVal()
              const vSw_V = calc.getVar('vSw_V').getRawVal()

              return vSw_V < vIn_V
            },
            text: 'Vsw must be less than Vin.',
            level: 'error'
          })
        ],
        helpText: 'The switching element voltage drop.'
      }))

      // ============================================ //
      // ============ DUTY CYCLE (output) =========== //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'dutyCycle_Ratio',
        typeEqn: function () {
          return 'output'
        },
        eqn: function () {
          // Read dependency variables
          const vIn_V = calc.getVar('vIn_V').getRawVal()
          const vOut_V = calc.getVar('vOut_V').getRawVal()
          const vD_V = calc.getVar('vD_V').getRawVal()
          const vSw_V = calc.getVar('vSw_V').getRawVal()

          return (vOut_V - vD_V) / (vIn_V - vSw_V - vD_V)
        },
        rawVal: '',
        units: [
          new UnitMulti({name: '%', multi: 1e-2}),
          new UnitMulti({name: 'no unit', multi: 1e0})
        ],
        defaultUnitName: '%',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          new CustomValidator({
            func: function () {
              // Read dependency variables
              const dutyCycle_Ratio = calc.getVar('dutyCycle_Ratio').getRawVal()
              return (dutyCycle_Ratio >= 0.0) && (dutyCycle_Ratio <= 1.0)
            },
            text: 'The duty cycle must be between 0 and 1 (or 0 and 100%).',
            level: 'error'
          })
        ],
        helpText: 'The duty cycle.'
      }))

      // ============================================ //
      // ======== SWITCHING FREQUENCY (input) ======= //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'fSw_Hz',
        typeEqn: function () {
          return 'input'
        },
        eqn: function () {},
        rawVal: '',
        units: [
          new UnitMulti({name: 'Hz', multi: 1e0}),
          new UnitMulti({name: 'kHz', multi: 1e3}),
          new UnitMulti({name: 'MHz', multi: 1e6})
        ],
        defaultUnitName: 'kHz',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The switching frequency.'
      }))

      // ============================================ //
      // ====== AVERAGE OUTPUT CURRENT (input) ====== //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'iOutAvg_A',
        typeEqn: function () {
          return 'input'
        },
        eqn: function () {},
        rawVal: '',
        units: [
          new UnitMulti({name: 'mA', multi: 1e-3}),
          new UnitMulti({name: 'A', multi: 1e0})
        ],
        defaultUnitName: 'A',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The average output current.'
      }))

      // ============================================ //
      // = PERCENTAGE OUTPUT CURRENT RIPPLE (input) = //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'iOutRipple_Ratio',
        typeEqn: function () {
          return 'input'
        },
        eqn: function () {},
        rawVal: '0.4',    // 40% current ripple is a common design goal
        units: [
          new UnitMulti({name: '%', multi: 1e-2}),
          new UnitMulti({name: 'no unit', multi: 1e0})
        ],
        defaultUnitName: '%',
        roundTo: 3,
        validators: [
          NumericValidators.IS_NUMBER,
          new CustomValidator({
            func: function () {
              // Read dependency variables
              const iOutRipple_Ratio = calc.getVar('iOutRipple_Ratio').getRawVal()
              return (iOutRipple_Ratio >= 0.0) && (iOutRipple_Ratio <= 1.0)
            },
            text: 'The output ripple current ratio must be between 0 and 1 (or 0 and 100%).',
            level: 'error'
          }),
          new CustomValidator({
            func: function () {
              // Read dependency variables
              const iOutRipple_Ratio = calc.getVar('iOutRipple_Ratio').getRawVal()
              return iOutRipple_Ratio <= 0.5
            },
            text: 'You normally want the output current ripple to be below 50%.',
            level: 'warning'
          })
        ],
        helpText: 'The percentage output current ripple.'
      }))

      // ============================================ //
      // ============ INDUCTANCE (output) =========== //
      // ============================================ //
      calc.addVar(new CalcVarNumeric({
        name: 'ind_H',
        typeEqn: function () {
          return 'output'
        },
        eqn: function () {
          // Read dependency variables
          const vIn_V = calc.getVar('vIn_V').getRawVal()
          const vOut_V = calc.getVar('vOut_V').getRawVal()
          const vSw_V = calc.getVar('vSw_V').getRawVal()
          const dutyCycle_Ratio = calc.getVar('dutyCycle_Ratio').getRawVal()
          const fSw_Hz = calc.getVar('fSw_Hz').getRawVal()
          const iOutAvg_A = calc.getVar('iOutAvg_A').getRawVal()
          const iOutRipple_Ratio = calc.getVar('iOutRipple_Ratio').getRawVal()

          const iRipple_A = iOutAvg_A * iOutRipple_Ratio

          return ((vIn_V - vSw_V - vOut_V) * dutyCycle_Ratio) / (fSw_Hz * iRipple_A)
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'nH', multi: 1e-9}),
          new UnitMulti({name: 'uH', multi: 1e-6}),
          new UnitMulti({name: 'mH', multi: 1e-3})
        ],
        defaultUnitName: 'uH',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_THAN_ZERO
        ],
        helpText: 'The inductance.'
      }))

      return {
        calc: calc
      }
    },
    methods: {},
    mounted () {
      this.calc.init()
      if (window.MathJax) window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
