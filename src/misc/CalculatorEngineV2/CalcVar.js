'use strict'

export default class CalcVar {

  constructor (initObj) {
    this.name = initObj.name
    this.typeEqn = initObj.typeEqn
    this.eqn = initObj.eqn

    this.units = initObj.units
    this.selUnit = initObj.selUnit

    this.calc = initObj.calc

    this.rawVal = initObj.rawVal

    // ============================================ //
    // ================= ROUNDING ================= //
    // ============================================ //
    if (typeof initObj.roundTo === 'undefined' || initObj.roundTo === null) {
      throw new Error('roundTo parameter was not provided to CalcVar() for variable "' + this.name + '".')
    }
    this.roundTo = initObj.roundTo

    // We can now work out the initial displayed value
    this.calcDispValFromRawVal()

    console.log('calcVar =')
    console.log(this)
  }

  getRawVal = () => {
    return this.rawVal
  }

  /**
   * Designed to be called by vue once this.dispVal has been changed.
   */
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
    console.log('reCalc() called for "' + this.name + '".')

    if (this.typeEqn() !== 'output') {
      throw new Error('reCalc() called for variable that was not an output.')
    }

    this.rawVal = this.eqn()

    this.calcDispValFromRawVal()
  }

  calcDispValFromRawVal = () => {
    if (this.rawVal === '') {
      this.dispVal = ''
    } else {
      var unRoundedDispVal = this.rawVal / this.selUnit

      // This uses 'significant figure' style rounding
      var roundedDispVal = unRoundedDispVal.toPrecision(this.roundTo)
      this.dispVal = roundedDispVal
    }
  }
}
