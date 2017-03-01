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
  }

  /**
   * Designed to be called by vue once this.selUnit has been changed.
   */
  onUnitChange = () => {
    // console.log('onUnitsChange() called.')

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
}
