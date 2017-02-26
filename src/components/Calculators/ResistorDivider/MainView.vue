<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="diagram-container" style="position: relative; width: 600px; height: 600px;">

    <!-- Background image is centered in diagram container -->
    <img :src="require('./diagram.png')" style="left: 50px; top: 50px; width: 550px; height: 550px; z-index: 0;">

    <!-- =========================================================================================== -->
    <!-- =============================================== vIn ======================================= -->
    <!-- =========================================================================================== -->
    <div class="variable-container" style="left: 30px; top: 290px;">
      <div style="left: -10px; top: 40px; display: flex; align-items: center;" class="value-unit-container">
        <input v-model="calc.getVar('vIn').dispVal" v-on:keyup="calc.getVar('vIn').onDispValChange()"
               class="variable-value">
        <select v-model="calc.getVar('vIn').selUnit" v-on:change="calc.getVar('vIn').onUnitChange()"
                class="variable-units">
          <option v-for="option in calc.getVar('vIn').units" v-bind:value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
      <input type="radio" value="vIn" v-model="calc.outputVar">
    </div>

    <!-- =========================================================================================== -->
    <!-- ============================================= Rtop ======================================== -->
    <!-- =========================================================================================== -->
    <div class="variable-container" style="left: 330px; top: 140px;">
      <div style="left: 0px; top: 40px; display: flex; align-items: center;" class="value-unit-container">
        <input v-model="calc.getVar('rTop').dispVal" v-on:keyup="calc.getVar('rTop').onDispValChange()"
               class="variable-value">
        <select v-model="calc.getVar('rTop').selUnit" v-on:change="calc.getVar('rTop').onUnitChange()"
                class="variable-units">
          <option v-for="option in calc.getVar('rTop').units" v-bind:value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
      <input type="radio" value="rTop" v-model="calc.outputVar" style="left: 90px;">
    </div>

    <!-- =========================================================================================== -->
    <!-- ============================================= Rbot ======================================== -->
    <!-- =========================================================================================== -->
    <div class="variable-container" style="left: 330px; top: 340px;">
      <div style="left: 0px; top: 40px; display: flex; align-items: center;" class="value-unit-container">
        <input v-model="calc.getVar('rBot').dispVal" v-on:keyup="calc.getVar('rBot').onDispValChange()"
               class="variable-value">
        <select v-model="calc.getVar('rBot').selUnit" v-on:change="calc.getVar('rBot').onUnitChange()"
                class="variable-units">
          <option v-for="option in calc.getVar('rBot').units" v-bind:value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
      <input type="radio" value="rBot" v-model="calc.outputVar" style="left: 90px;">
    </div>

    <!-- =========================================================================================== -->
    <!-- ============================================= Vout ======================================== -->
    <!-- =========================================================================================== -->
    <div class="variable-container" style="left: 480px; top: 400px;">
      <div style="left: 0px; top: 40px; display: flex; align-items: center;" class="value-unit-container">
        <input v-model="calc.getVar('vOut').dispVal" v-on:keyup="calc.getVar('vOut').onDispValChange()"
               class="variable-value">
        <select v-model="calc.getVar('vOut').selUnit" v-on:change="calc.getVar('vOut').onUnitChange()"
                class="variable-units">
          <option v-for="option in calc.getVar('vOut').units" v-bind:value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
      <input type="radio" value="vOut" v-model="calc.outputVar" style="left: 120px;">
    </div>
  </div>

</template>

<script>

  'use strict'

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import CalcVar from 'src/misc/CalculatorEngineV2/CalcVar'

  var calc = new Calc()

  // Create new variable in class for determining what is input and output
  calc.outputVar = 'vOut'

  // ============================================ //
  // ===================== vIn ================== //
  // ============================================ //
  var vIn = new CalcVar(new CalcVar({
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
      {text: 'mV', value: 1e-3},
      {text: 'V', value: 1}
    ],
    selUnit: 1,
    roundTo: 4,
    calc: calc
  }))
  calc.addVar(vIn)

  // ============================================ //
  // ===================== rTop ================= //
  // ============================================ //
  var rTop = new CalcVar(new CalcVar({
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
      {text: 'mΩ', value: 1e-3},
      {text: 'Ω', value: 1},
      {text: 'kΩ', value: 1e3},
      {text: 'MΩ', value: 1e6}
    ],
    selUnit: 1,
    roundTo: 4,
    calc: calc
  }))
  calc.addVar(rTop)

  // ============================================ //
  // ===================== rBot ================= //
  // ============================================ //
  var rBot = new CalcVar(new CalcVar({
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
      {text: 'mΩ', value: 1e-3},
      {text: 'Ω', value: 1},
      {text: 'kΩ', value: 1e3},
      {text: 'MΩ', value: 1e6}
    ],
    selUnit: 1,
    roundTo: 4,
    calc: calc
  }))
  calc.addVar(rBot)

  // ============================================ //
  // ===================== vOut ================= //
  // ============================================ //
  var vOut = new CalcVar(new CalcVar({
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
      {text: 'mV', value: 1e-3},
      {text: 'V', value: 1}
    ],
    selUnit: 1,
    roundTo: 4,
    calc: calc
  }))
  calc.addVar(vOut)

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'resistor-divider-calculator',
    data: function () {
      return {
        calc: calc
      }
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

  .value-unit-container {
    position: absolute;
  }

  .variable-value {
    width: 100px;
    height: 30px;
  }

  .variable-units {
    height: 30px;

    /* Add some spacing between variable value and units */
    margin-left: 5px;
  }

  input[type="radio"] {
    transform: scale(1.5)
  }

</style>
