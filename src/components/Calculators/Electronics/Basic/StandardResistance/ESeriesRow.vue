<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <tr>
    <td>{{ eSeries.name }}</td>
    <td><calc-value :calcVar="calc.getVar(this.eSeries.name + 'ClosestResistance')" :width=120></calc-value></td>
    <td><calc-value :calcVar="calc.getVar(this.eSeries.name + 'ClosestResistanceError')" :width=80></calc-value></td>
    <td><calc-value :calcVar="calc.getVar(this.eSeries.name + 'ClosestEqualOrLowerResistance')" :width=120></calc-value></td>
    <td><calc-value :calcVar="calc.getVar(this.eSeries.name + 'ClosestEqualOrLowerResistanceError')" :width=80></calc-value></td>
    <td><calc-value :calcVar="calc.getVar(this.eSeries.name + 'ClosestEqualOrHigherResistance')" :width=120></calc-value></td>
    <td><calc-value :calcVar="calc.getVar(this.eSeries.name + 'ClosestEqualOrHigherResistanceError')" :width=80></calc-value></td>
  </tr>

</template>

<script>

//  'use strict'

  import { CalcVarNumeric } from 'src/misc/CalculatorEngineV2/CalcVarNumeric'
  import { UnitMulti } from 'src/misc/CalculatorEngineV2/UnitMulti'
  import NumericValidators from 'src/misc/CalculatorEngineV2/PresetValidators'
  import StandardResistanceFinder from 'src/misc/StandardResistanceFinder/StandardResistanceFinder'

  var standardResistanceFinder = new StandardResistanceFinder()

  // ============================================ //
  // =================== vue Object ============= //
  // ============================================ //
  export default {
    name: 'e-series-row',
    components: {},
    props: {
      calc: {
        type: Object,
        required: true
      },
      eSeries: {
        type: Object,
        required: true
      }
    },
    data: function () {
      // ============================================ //
      // ============= CLOSEST RESISTANCE =========== //
      // ============================================ //
      var closestResistance = new CalcVarNumeric({
        name: this.eSeries.name + 'ClosestResistance',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          var desiredResistance = this.calc.getVar('desiredResistance').getRawVal()
          return standardResistanceFinder.find(desiredResistance, this.eSeries, standardResistanceFinder.searchMethods.CLOSEST)
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'Ω', multi: 1e0})
        ],
        defaultUnitName: 'Ω',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The closest resistance in the ' + this.eSeries.name + ' series to your desired resistance.'
      })
      this.calc.addVar(closestResistance)

      // ============================================ //
      // ========= CLOSEST RESISTANCE ERROR ========= //
      // ============================================ //
      var closestResistanceError = new CalcVarNumeric({
        name: this.eSeries.name + 'ClosestResistanceError',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          var desiredResistanceValue = this.calc.getVar('desiredResistance').getRawVal()
          var closestResistance = this.calc.getVar(this.eSeries.name + 'ClosestResistance').getRawVal()

          // Calculate percentage difference
          var percentageDiff = (Math.abs(closestResistance - desiredResistanceValue) / desiredResistanceValue) * 100.0
          console.log('percentageDiff = ' + percentageDiff)
          return percentageDiff
        },
        rawVal: '',
        units: [
          new UnitMulti({name: '%', multi: 1e0})
        ],
        defaultUnitName: '%',
        roundTo: 2,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The percentage difference between the closest ' + this.eSeries.name + ' series resistance and your desired resistance.'
      })
      this.calc.addVar(closestResistanceError)

      // ============================================ //
      // ==== CLOSEST EQUAL OR LOWER RESISTANCE  ==== //
      // ============================================ //
      var closestEqualOrLowerResistance = new CalcVarNumeric({
        name: this.eSeries.name + 'ClosestEqualOrLowerResistance',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          var desiredResistance = this.calc.getVar('desiredResistance').getRawVal()
          return standardResistanceFinder.find(desiredResistance, this.eSeries, standardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_LOWER)
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'Ω', multi: 1e0})
        ],
        defaultUnitName: 'Ω',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The closest equal or higher resistance in the ' + this.eSeries.name + ' series to your desired resistance.'
      })
      this.calc.addVar(closestEqualOrLowerResistance)

      // ============================================ //
      // = CLOSEST EQUAL OR LOWER RESISTANCE ERROR == //
      // ============================================ //
      var closestEqualOrLowerResistanceError = new CalcVarNumeric({
        name: this.eSeries.name + 'ClosestEqualOrLowerResistanceError',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          var desiredResistanceValue = this.calc.getVar('desiredResistance').getRawVal()
          var closestEqualOrLowerResistance = this.calc.getVar(this.eSeries.name + 'ClosestEqualOrLowerResistance').getRawVal()

          // Calculate percentage difference
          var percentageDiff = (Math.abs(closestEqualOrLowerResistance - desiredResistanceValue) / desiredResistanceValue) * 100.0
          return percentageDiff
        },
        rawVal: '',
        units: [
          new UnitMulti({name: '%', multi: 1e0})
        ],
        defaultUnitName: '%',
        roundTo: 2,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The percentage difference between the closest equal or lower ' + this.eSeries.name + ' series resistance and your desired resistance.'
      })
      this.calc.addVar(closestEqualOrLowerResistanceError)

      // ============================================ //
      // ==== CLOSEST EQUAL OR HIGHER RESISTANCE  === //
      // ============================================ //
      var closestEqualOrHigherResistance = new CalcVarNumeric({
        name: this.eSeries.name + 'ClosestEqualOrHigherResistance',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          var desiredResistance = this.calc.getVar('desiredResistance').getRawVal()
          return standardResistanceFinder.find(desiredResistance, this.eSeries, standardResistanceFinder.searchMethods.CLOSEST_EQUAL_OR_HIGHER)
        },
        rawVal: '',
        units: [
          new UnitMulti({name: 'Ω', multi: 1e0})
        ],
        defaultUnitName: 'Ω',
        roundTo: 4,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The closest equal or higher resistance in the ' + this.eSeries.name + ' series to your desired resistance.'
      })
      this.calc.addVar(closestEqualOrHigherResistance)

      // ============================================ //
      // = CLOSEST EQUAL OR HIGHER RESISTANCE ERROR = //
      // ============================================ //
      var closestEqualOrHigherResistanceError = new CalcVarNumeric({
        name: this.eSeries.name + 'ClosestEqualOrHigherResistanceError',
        typeEqn: () => {
          return 'output'
        },
        eqn: () => {
          // Read dependency variables
          var desiredResistanceValue = this.calc.getVar('desiredResistance').getRawVal()
          var closestEqualOrHigherResistance = this.calc.getVar(this.eSeries.name + 'ClosestEqualOrHigherResistance').getRawVal()

          // Calculate percentage difference
          var percentageDiff = (Math.abs(closestEqualOrHigherResistance - desiredResistanceValue) / desiredResistanceValue) * 100.0
          return percentageDiff
        },
        rawVal: '',
        units: [
          new UnitMulti({name: '%', multi: 1e0})
        ],
        defaultUnitName: '%',
        roundTo: 2,
        validators: [
          NumericValidators.IS_NUMBER,
          NumericValidators.IS_GREATER_OR_EQUAL_TO_ZERO
        ],
        helpText: 'The percentage difference between the closest equal or higher ' + this.eSeries.name + ' series resistance and your desired resistance.'
      })
      this.calc.addVar(closestEqualOrHigherResistanceError)

      return {
      }
    },
    mounted () {}
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
