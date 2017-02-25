<template xmlns:v-on="http://www.w3.org/1999/xhtml">

  <div>
    <input v-model="calc.getVar('testIn').uiValue" v-on:keyup="calc.getVar('testIn').onUiChange()">
    <input v-model="calc.getVar('testOut').uiValue" v-on:keyup="calc.getVar('testOut').onUiChange()">
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
      console.log('getVar() called with name = ' + name)
      var variable = this.calcVars.find((element) => {
        return element.name === name
      })

      if (typeof variable === 'undefined') {
        throw new Error('Requested variable "' + name + '" does not exist in calculator.')
      }

      console.log('returning = ')
      console.log(variable)

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
      this.calc = initObj.calc

      this.uiValue = ''
    }

    onUiChange = () => {
      console.log('onUiChange() called.')
      console.log('this.uiValue =' + this.uiValue)

      this.calc.reCalcOutputs()
    }

    reCalc = () => {
      console.log('reCalc() called.')

      if (this.typeEqn() !== 'output') {
        throw new Error('reCalc() called for variable that was not an output.')
      }

      this.uiValue = this.eqn()
    }

  }

  var calc = new Calculator()
  var testIn = new CalcVar(new CalcVar({
    name: 'testIn',
    typeEqn: () => {
      return 'input'
    },
    calc: calc
  }))
  calc.addVar(testIn)
  var testOut = new CalcVar(new CalcVar({
    name: 'testOut',
    typeEqn: () => {
      return 'output'
    },
    eqn: () => {
      return calc.getVar('testIn').uiValue * 2
    },
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
