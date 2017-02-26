<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div class="diagram-container" style="position: relative; width: 600px; height: 600px;">

    <!-- Background image is centered in diagram container -->
    <img :src="require('./diagram.png')" style="left: 50px; top: 50px; width: 500px; height: 500px; z-index: 0">

    <!-- ========================================= -->
    <!-- =============== VOLTAGE ================= -->
    <!-- ========================================= -->
    <div class="variable-container" style="left: 0px; top: 240px;">

      <div style="left: 0px; top: 70px; display: flex; align-items: center;" class="value-unit-container">
        <!-- VALUE -->
        <input v-model="calc.getVar('voltage').dispVal" v-on:keyup="calc.getVar('voltage').onDispValChange()" class="variable-value">

        <!-- UNITS -->
        <select v-model="calc.getVar('voltage').selUnit" v-on:change="calc.getVar('voltage').onUnitChange()" class="variable-units">
          <option v-for="option in calc.getVar('voltage').units" v-bind:value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>

      <!-- INPUT/OUTPUT DECIDER -->
      <input type="radio" value="voltage" v-model="calc.outputVar" style="left: 0px; top: 20px">
    </div>

    <!-- ========================================= -->
    <!-- =============== CURRENT ================= -->
    <!-- ========================================= -->
    <div class="variable-container" style="left: 440px; top: 360px;">

      <div style="left: 0px; top: 50px; display: flex; align-items: center;" class="value-unit-container">

        <!-- VALUE -->
        <!--<input ref="currentInput" class="variable-value">-->
        <input v-model="calc.getVar('current').dispVal" v-on:keyup="calc.getVar('current').onDispValChange()" class="variable-value">

        <!-- UNITS -->
        <select v-model="calc.getVar('current').selUnit" v-on:change="calc.getVar('current').onUnitChange()" class="variable-units">
          <option v-for="option in calc.getVar('current').units" v-bind:value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>

      <!-- INPUT/OUTPUT DECIDER -->
      <input type="radio" value="current" v-model="calc.outputVar" style="left: 100px; top: 0px">
    </div>

    <!-- ========================================= -->
    <!-- ============= RESISTANCE ================ -->
    <!-- ========================================= -->
    <div class="variable-container" style="left: 450px; top: 160px;">

      <div style="left: 0px; top: 40px; display: flex; align-items: center;" class="value-unit-container">

        <!-- VALUE -->
        <input v-model="calc.getVar('resistance').dispVal" v-on:keyup="calc.getVar('resistance').onDispValChange()" class="variable-value">

        <!-- UNITS -->
        <select v-model="calc.getVar('resistance').selUnit" v-on:change="calc.getVar('resistance').onUnitChange()" class="variable-units">
          <option v-for="option in calc.getVar('resistance').units" v-bind:value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>

      <!-- INPUT/OUTPUT DECIDER -->
      <input type="radio" value="resistance" v-model="calc.outputVar" style="left: 100px; top: 0px">
    </div>

  </div>

</template>

<script>

  'use strict'

  import Calc from 'src/misc/CalculatorEngineV2/Calc'
  import CalcVar from 'src/misc/CalculatorEngineV2/CalcVar'

  var calc = new Calc()

  // Create new variable in class for determining what is input and output
  calc.outputVar = 'resistance'

  // ============================================ //
  // =================== voltage ================ //
  // ============================================ //
  var voltage = new CalcVar(new CalcVar({
    name: 'voltage',
    typeEqn: () => {
      if (calc.outputVar === 'voltage') {
        return 'output'
      } else {
        return 'input'
      }
    },
    eqn: () => {
      // Read dependency variables
      var current = calc.getVar('current').getRawVal()
      var resistance = calc.getVar('resistance').getRawVal()

      return (current * resistance)
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
  calc.addVar(voltage)

  // ============================================ //
  // =================== current ================ //
  // ============================================ //
  var current = new CalcVar(new CalcVar({
    name: 'current',
    typeEqn: () => {
      if (calc.outputVar === 'current') {
        return 'output'
      } else {
        return 'input'
      }
    },
    eqn: () => {
      // Read dependency variables
      var voltage = calc.getVar('voltage').getRawVal()
      var resistance = calc.getVar('resistance').getRawVal()

      return (voltage / resistance)
    },
    rawVal: '',
    units: [
      {text: 'uA', value: 1e-6},
      {text: 'mA', value: 1e-3},
      {text: 'A', value: 1}
    ],
    selUnit: 1,
    roundTo: 4,
    calc: calc
  }))
  calc.addVar(current)

  // ============================================ //
  // ================= resistance =============== //
  // ============================================ //
  var resistance = new CalcVar(new CalcVar({
    name: 'resistance',
    typeEqn: () => {
      if (calc.outputVar === 'resistance') {
        return 'output'
      } else {
        return 'input'
      }
    },
    eqn: () => {
      // Read dependency variables
      var voltage = calc.getVar('voltage').getRawVal()
      var current = calc.getVar('current').getRawVal()

      return (voltage / current)
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
  calc.addVar(resistance)

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'ohms-law-calculator',
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
    width: 150px;
    height: 40px;
  }

  .variable-units {
    height: 40px;
  }

  input[type="radio"] {
    transform: scale(1.5)
  }

</style>
