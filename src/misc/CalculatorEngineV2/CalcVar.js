// 'use strict'

import PresetValidators from './PresetValidators'
import { CustomValidator } from './CustomValidator'

export default class CalcVar {

  constructor (initObj) {
    this.name = initObj.name
    this.typeEqn = initObj.typeEqn
    this.eqn = initObj.eqn

    // this.calc will be assigned when the calculator variable is added
    // to a calculator via Calc.addVar()
    this.calc = null

    this.rawVal = initObj.rawVal

    // ============================================ //
    // ================ VALIDATORS ================ //
    // ============================================ //

    this.validators = []
    if (initObj.validators) {
      this.validators = initObj.validators
    }

    // Set default validation settings
    this.validationResult = 'ok'
    this.validationMsg = ''

    // ============================================ //
    // ================= HELP TEXT ================ //
    // ============================================ //

    // Save help text. This will be presented in the tool-tip along
    // with and validator messages.
    if (!initObj.helpText) {
      throw new Error('No helpText string provided to CalcVar() for variable "' + this.name + '".')
    }
    this.helpText = initObj.helpText
  }

  getRawVal = () => {
    return this.rawVal
  }

  /**
   * Designed to be called by vue once this.dispVal has been changed.
   */
  onDispValChange = () => {
    // console.log('onDispValChange() called.')
    // console.log('this.dispVal =' + this.dispVal)

    this.rawVal = this.dispVal * this.selUnit
    // console.log('this.rawVal = ' + this.rawVal)

    this.validate()
    this.triggerReCalcOutputsAndValidate()
  }

  reCalc = () => {
    // console.log('reCalc() called for "' + this.name + '".')

    if (this.typeEqn() !== 'output') {
      throw new Error('reCalc() called for variable that was not an output.')
    }

    this.rawVal = this.eqn()

    this.calcDispValFromRawVal()
    this.validate()
  }

  triggerReCalcOutputsAndValidate = () => {
    if (!this.calc) {
      throw new Error('Calc var "' + this.name + '" has not been added to a calculator with Calc.addVar().')
    }
    this.calc.reCalcOutputsAndValidate()
  }

  validate = () => {
    // console.log('CalcVar.validate() called for "' + this.name + '".')
    // console.log('this.validators =')
    // console.log(this.validators)

    this.validationResult = 'ok'
    this.validationMsg = ''

    var self = this
    this.validators.map(function (validator) {
      // console.log('validator =')
      // console.log(validator)

      var validationResult = 'ok'
      var validationMsg = ''

      if (validator instanceof CustomValidator) {
        // console.log('validator is a instance of CustomValidator.')
        // Validator must be a custom function
        var result = validator.func()

        if (!result) {
          validationResult = validator.level
          validationMsg = validator.text
        }
      } else {
        // Validator must be a preset
        switch (validator) {
          case PresetValidators.IS_NUMBER:
            // console.log('validator === PresetValidators.IS_NUMBER')
            if (self.isStringANumber(self.dispVal)) {
              // console.log('dispVal is a valid number.')
              validationResult = 'ok'
            } else {
              // console.log('dispVal is NOT a valid number.')
              validationResult = 'error'
              validationMsg = 'Variable must be a valid number.'
            }
            break
          case PresetValidators.IS_GREATER_OR_EQUAL_TO_ZERO:
            if (self.dispVal >= 0) {
              validationResult = 'ok'
            } else {
              validationResult = 'error'
              validationMsg = 'Variable must be greater than or equal to 0.'
            }
            break
          case PresetValidators.IS_GREATER_THAN_ZERO:
            if (self.dispVal > 0) {
              validationResult = 'ok'
            } else {
              validationResult = 'error'
              validationMsg = 'Variable must be greater than 0.'
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

    // console.log('isNumber() called with number = ' + number)
    return !isNaN(number)
  }

}
