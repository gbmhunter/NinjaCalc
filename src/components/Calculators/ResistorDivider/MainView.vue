<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div>

    <div>
      <input v-model="calc.getVar('vIn').dispVal" v-on:keyup="calc.getVar('vIn').onDispValChange()">
      <select v-model="calc.getVar('vIn').selUnit" v-on:change="calc.getVar('vIn').onUnitChange()">
        <option v-for="option in calc.getVar('vIn').units" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>

    <div>
      <input v-model="calc.getVar('rTop').dispVal" v-on:keyup="calc.getVar('rTop').onDispValChange()">
      <select v-model="calc.getVar('rTop').selUnit" v-on:change="calc.getVar('rTop').onUnitChange()">
        <option v-for="option in calc.getVar('rTop').units" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>

    <div>
      <input v-model="calc.getVar('rBot').dispVal" v-on:keyup="calc.getVar('rBot').onDispValChange()">
      <select v-model="calc.getVar('rBot').selUnit" v-on:change="calc.getVar('rBot').onUnitChange()">
        <option v-for="option in calc.getVar('rBot').units" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>

    <div>
      <input v-model="calc.getVar('vOut').dispVal" v-on:keyup="calc.getVar('vOut').onDispValChange()">
      <select v-model="calc.getVar('vOut').selUnit" v-on:change="calc.getVar('vOut').onUnitChange()">
        <option v-for="option in calc.getVar('vOut').units" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
  </div>

</template>

<script>

  class Calculator {

    constructor () {
      this.calcVars = []
    }

    addVar = (calcVar) => {
      this.calcVars.push(calcVar)
    }

    getVar = (name) => {
//      console.log('getVar() called with name = ' + name)
      var variable = this.calcVars.find((element) => {
        return element.name === name
      })

      if (typeof variable === 'undefined') {
        throw new Error('Requested variable "' + name + '" does not exist in calculator.')
      }

      return variable
    }

    reCalcOutputs = () => {
      console.log('reCalcOutputs() called.')
      console.log(this)
      for (let calcVar of this.calcVars) {
        console.log(calcVar)
        if (calcVar.typeEqn() === 'output') {
          console.log('Recalculating "' + calcVar.name + '".')
          calcVar.reCalc()
        }
      }
    }
  }

  class CalcVar {

    constructor (initObj) {
      this.name = initObj.name
      this.typeEqn = initObj.typeEqn
      this.eqn = initObj.eqn

      this.units = initObj.units
      this.selUnit = initObj.selUnit

      this.calc = initObj.calc

      this.rawVal = initObj.rawVal

      // We can now work out the initial displayed value
      if (this.rawVal === '') {
        this.dispVal = ''
      } else {
        this.dispVal = this.rawVal / this.selUnit.value
      }

      console.log('calcVar =')
      console.log(this)
    }

    onDispValChange = () => {
      console.log('onDispValChange() called.')
      console.log('this.dispVal =' + this.dispVal)

      this.rawVal = this.dispVal * this.selUnit
      console.log('this.rawVal = ' + this.rawVal)

      this.calc.reCalcOutputs()
    }

    onUnitChange = () => {
      console.log('onUnitsChange() called.')

      if (this.typeEqn() === 'input') {
        // Recalculate raw value from displayed value
        this.rawVal = this.dispVal * this.selUnit
      }

      this.calc.reCalcOutputs()
    }

    reCalc = () => {
      console.log('reCalc() called.')

      if (this.typeEqn() !== 'output') {
        throw new Error('reCalc() called for variable that was not an output.')
      }

      this.rawVal = this.eqn()
      this.dispVal = this.rawVal / this.selUnit
    }

  }

  var calc = new Calculator()

  // ============================================ //
  // ===================== vIn ================== //
  // ============================================ //
  var vIn = new CalcVar(new CalcVar({
    name: 'vIn',
    typeEqn: () => {
      return 'input'
    },
    eqn: () => {
      throw new Error('eqn() called on input!')
    },
    rawVal: '',
    units: [
      {text: 'mV', value: 1e-3},
      {text: 'V', value: 1}
    ],
    selUnit: 1,
    calc: calc
  }))
  calc.addVar(vIn)

  // ============================================ //
  // ===================== rTop ================= //
  // ============================================ //
  var rTop = new CalcVar(new CalcVar({
    name: 'rTop',
    typeEqn: () => {
      return 'input'
    },
    eqn: () => {
      return calc.getVar('testIn').rawVal * 2
    },
    rawVal: '',
    units: [
      {text: 'mΩ', value: 1e-3},
      {text: 'Ω', value: 1},
      {text: 'kΩ', value: 1e3},
      {text: 'MΩ', value: 1e6}
    ],
    selUnit: 1,
    calc: calc
  }))
  calc.addVar(rTop)

  // ============================================ //
  // ===================== rTop ================= //
  // ============================================ //
  var rBot = new CalcVar(new CalcVar({
    name: 'rBot',
    typeEqn: () => {
      return 'input'
    },
    eqn: () => {
      return calc.getVar('testIn').rawVal * 2
    },
    rawVal: '',
    units: [
      {text: 'mΩ', value: 1e-3},
      {text: 'Ω', value: 1},
      {text: 'kΩ', value: 1e3},
      {text: 'MΩ', value: 1e6}
    ],
    selUnit: 1,
    calc: calc
  }))
  calc.addVar(rBot)

  // ============================================ //
  // ===================== vOut ================== //
  // ============================================ //
  var vOut = new CalcVar(new CalcVar({
    name: 'vOut',
    typeEqn: () => {
      return 'output'
    },
    eqn: () => {
      // Read dependency variables
      var vIn = calc.getVar('vIn').rawVal
      var rTop = calc.getVar('rTop').rawVal
      var rBot = calc.getVar('rBot').rawVal

      return ((vIn * rBot) / (rTop + rBot))
    },
    rawVal: '',
    units: [
      {text: 'mV', value: 1e-3},
      {text: 'V', value: 1}
    ],
    selUnit: 1,
    calc: calc
  }))
  calc.addVar(vOut)

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  var temp = {
    name: 'resistor-divider-calculator',
    props: {},
    data: function () {
      return {
        calc: calc
      }
    },
    components: {},
    computed: {},
    watch: {},
    methods: {
      mounted () {
        console.log('ResistorDivider.mounted() called.')
      }
    }
  }

  export default temp

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
