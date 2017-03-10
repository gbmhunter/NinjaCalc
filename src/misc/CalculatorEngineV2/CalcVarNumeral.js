import CalcVar from './CalcVar'

export class CalcVarNumeral extends CalcVar {
  constructor (initObj) {
    super(initObj)
    this.units = initObj.units
    this.selUnit = initObj.selUnit

    // ============================================ //
    // ================= ROUNDING ================= //
    // ============================================ //
    if (typeof initObj.roundTo === 'undefined' || initObj.roundTo === null) {
      throw new Error('roundTo parameter was not provided to CalcVar() for variable "' + this.name + '".')
    }
    this.roundTo = initObj.roundTo

    // We can now work out the initial displayed value
    this.calcDispValFromRawVal()

    // ============================================ //
    // ================= HELP TEXT ================ //
    // ============================================ //
    if (!initObj.helpText) {
      throw new Error('Please provide help text via initObj.helpText to the CalcVarString.constructor() for variable "' + initObj.name + '".')
    }
    this.helpText = initObj.helpText
  }

  /**
   * Designed to be called by vue once this.selUnit has been changed.
   */
  onUnitChange = () => {
    if (this.typeEqn() === 'input') {
      // Recalculate raw value from displayed value
      this.rawVal = this.dispVal * this.selUnit
      this.validate()
    }

    this.triggerReCalcOutputsAndValidate()
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

  reCalc = () => {
    // console.log('CalcVarNumerical.reCalc() called for "' + this.name + '".')

    if (this.typeEqn() !== 'output') {
      throw new Error('reCalc() called for variable that was not an output.')
    }

    this.rawVal = this.eqn()

    this.calcDispValFromRawVal()
    this.validate()
  }

  /**
   * Designed to be called by vue once this.dispVal has been changed.
   */
  onDispValChange = () => {
    this.rawVal = parseFloat(this.dispVal) * parseFloat(this.selUnit)
    // console.log('this.rawVal = ' + this.rawVal)

    this.validate()
    this.triggerReCalcOutputsAndValidate()
  }
}
