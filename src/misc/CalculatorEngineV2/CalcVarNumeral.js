import CalcVar from './CalcVar'
import {UnitMulti} from './UnitMulti'
import {UnitFunc} from './UnitFunc'

export class CalcVarNumeral extends CalcVar {
  constructor (initObj) {
    super(initObj)

    // ============================================ //
    // =================== UNITS ================== //
    // ============================================ //

    // CalcVarNumeral is the only calculator variable type which
    // has unit support
    this.units = initObj.units

    if (!initObj.defaultUnitName) throw new Error('Please provide a default unit name via initObj.defaultUnitName to CalcVarNumeral.constructor() for variable "' + initObj.name + '".')
    this.selUnitName = initObj.defaultUnitName
    console.log('this.selUnitName = ' + this.selUnitName)
    this.selUnit = this.findUnitFromName(this.selUnitName)

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
    console.log('CalcVarNumeral.onUnitChange() called.')
    console.log('this.selUnitName = ' + this.selUnitName)

    this.selUnit = this.findUnitFromName(this.selUnitName)
    console.log('this.selUnit =')
    console.log(this.selUnit)

    if (this.typeEqn() === 'input') {
      // Recalculate raw value from displayed value
      this.calcRawValFromDispVal()
      this.validate()
    }

    this.triggerReCalcOutputsAndValidate()
  }

  calcDispValFromRawVal = () => {
    if (this.rawVal === '') {
      this.dispVal = ''
    } else {
      var unRoundedDispVal
      if (this.selUnit instanceof UnitMulti) {
        unRoundedDispVal = this.rawVal / this.selUnit.multi
      } else if (this.selUnit instanceof UnitFunc) {
        unRoundedDispVal = this.selUnit.toUnit(this.rawVal)
      } else throw new Error('The class type of this.selUnit is not recognised!')

      // This uses 'significant figure' style rounding
      var roundedDispVal = unRoundedDispVal.toPrecision(this.roundTo)
      this.dispVal = roundedDispVal
    }
  }

  calcRawValFromDispVal = () => {
    // We have to take different actions depending on the
    // type of units currently selected
    if (this.selUnit instanceof UnitMulti) {
      this.rawVal = parseFloat(this.dispVal) * parseFloat(this.selUnit.multi)
    } else if (this.selUnit instanceof UnitFunc) {
      this.rawVal = this.selUnit.fromUnit(parseFloat(this.dispVal))
    } else throw new Error('The class type of this.selUnit is not recognised!')
  }

  reCalc = () => {
    // console.log('CalcVarNumerical.reCalc() called for "' + this.name + '".')

    if (this.typeEqn() !== 'output') {
      throw new Error('reCalc() called for variable that was not an output.')
    }

    // Raw value is calculated using the provided equation.
    // Equation takes no inputs, it gets access to other calculator variables
    // through the lambda scope
    this.rawVal = this.eqn()

    this.calcDispValFromRawVal()
    this.validate()
  }

  /**
   * Designed to be called by vue once this.dispVal has been changed.
   */
  onDispValChange = () => {
    this.calcRawValFromDispVal()
    this.validate()
    this.triggerReCalcOutputsAndValidate()
  }

  findUnitFromName = (unitName) => {
    // console.log('CalcVarNumeral.findUnitFromName() called with unitName = ' + unitName)
    var foundUnit = null
    this.units.forEach(function (element) {
      // console.log(element)
      if (element.name === unitName) {
        // console.log('Unit found! unit =')
        // console.log(element)
        foundUnit = element
      }
    })

    if (foundUnit) {
      return foundUnit
    } else {
      throw new Error('Could not find unit with name "' + unitName + '" in calculator variable "' + this.name + '".')
    }
  }
}
