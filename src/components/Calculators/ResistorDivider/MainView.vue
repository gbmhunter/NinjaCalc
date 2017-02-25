<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div>

    <div>
      <input v-model="calc.getVar('testIn').dispVal" v-on:keyup="calc.getVar('testIn').onDispValChange()">
      <select v-model="calc.getVar('testIn').selUnit" v-on:change="calc.getVar('testIn').onUnitChange()">
        <option v-for="option in calc.getVar('testIn').units" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>

    <div>
      <input v-model="calc.getVar('testOut').dispVal" v-on:keyup="calc.getVar('testOut').onDispValChange()">
      <select v-model="calc.getVar('testOut').selUnit" v-on:change="calc.getVar('testOut').onUnitChange()">
        <option v-for="option in calc.getVar('testOut').units" v-bind:value="option.value">
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

//      console.log('returning = ')
//      console.log(variable)

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
  var testIn = new CalcVar(new CalcVar({
    name: 'testIn',
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
  calc.addVar(testIn)
  var testOut = new CalcVar(new CalcVar({
    name: 'testOut',
    typeEqn: () => {
      return 'output'
    },
    eqn: () => {
      return calc.getVar('testIn').rawVal * 2
    },
    rawVal: '',
    units: [
      {text: 'mV', value: 1e-3},
      {text: 'V', value: 1}
    ],
    selUnit: 1,
    calc: calc
  }))
  calc.addVar(testOut)

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
      test () {
        console.log('test() called.')
      },
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
