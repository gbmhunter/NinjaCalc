'use strict'

import PresetValidators from './PresetValidators'

export default class CalcVar {

  constructor (initObj) {
    this.name = initObj.name
    this.typeEqn = initObj.typeEqn
    this.eqn = initObj.eqn

    this.units = initObj.units
    this.selUnit = initObj.selUnit

    // this.calc will be assigned when the calculator variable is added
    // to a calculator via Calc.addVar()
    this.calc = null

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

    // ============================================ //
    // ================ VALIDATORS ================ //
    // ============================================ //

    this.validators = []
    if (initObj.validators) {
      this.validators = initObj.validators
    }

    this.validationResult = 'ok'
    this.validationMsg = ''
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

    this.validate()
    this.reCalcOutputs()
  }

  onUnitChange = () => {
    console.log('onUnitsChange() called.')

    if (this.typeEqn() === 'input') {
      // Recalculate raw value from displayed value
      this.rawVal = this.dispVal * this.selUnit
      this.validate()
    }

    this.reCalcOutputs()
  }

  reCalc = () => {
    console.log('reCalc() called for "' + this.name + '".')

    if (this.typeEqn() !== 'output') {
      throw new Error('reCalc() called for variable that was not an output.')
    }

    this.rawVal = this.eqn()

    this.calcDispValFromRawVal()
    this.validate()
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

  reCalcOutputs = () => {
    if (!this.calc) {
      throw new Error('Calc var "' + this.name + '" has not been added to a calculator with Calc.addVar().')
    }
    this.calc.reCalcOutputs()
  }

  validate = () => {
    console.log('CalcVar.validate() called for "' + this.name + '".')
    console.log('this.validators =')
    console.log(this.validators)

    this.validationResult = 'ok'
    this.validationMsg = ''

    var self = this
    this.validators.map(function (validator) {
      console.log('validator =')
      console.log(validator)

      var validationResult = 'ok'
      var validationMsg = ''

      if (typeof validator === 'function') {
        // Validator must be a custom function
        var result = validator()

        switch (result) {
          case 'ok':
            console.log('validator returned ok.')
            validationResult = 'ok'
            break
          case 'error':
            console.log('validator returned error.')
            validationResult = 'error'
        }
      } else {
        // Validator must be a preset
        switch (validator) {
          case PresetValidators.IS_NUMBER:
            console.log('validator === PresetValidators.IS_NUMBER')
            if (self.isStringANumber(self.dispVal)) {
              console.log('dispVal is a valid number.')
              validationResult = 'ok'
            } else {
              console.log('dispVal is NOT a valid number.')
              validationResult = 'error'
              validationMsg = 'Variable must be a valid number.'
            }
            break
          case PresetValidators.IS_POSITIVE:
            console.log('validator = ' + validator)
            if (self.dispVal >= 0) {
              validationResult = 'ok'
            } else {
              validationResult = 'error'
              validationMsg = 'Variable must be positive number (or 0).'
            }
            break
          default:
            throw new Error('Preset validation type "' + validator + '" is not supported.')
        }
      }

      // Finally, compare this validation result with the one set in the variable. Only
      // overwrite IF this validation result is worse than what was already present
      switch (self.validationResult) {
        case 'ok':
          self.validationResult = validationResult
          self.validationMsg = validationMsg
          break
        case 'warning':
          if (self.validationResult === 'ok') {
            self.validationResult = validationResult
            self.validationMsg = validationMsg
          }
          break
        case 'error':
          // Do nothing
          break
      }
    })
  }

  isStringANumber = (number) => {
    if (number === '') {
      return false
    }

    console.log('isNumber() called with number = ' + number)
    return !isNaN(number)
  }

}
