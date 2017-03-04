'use strict'

import PresetValidators from './PresetValidators'
import {CustomValidator} from './CustomValidator'

/**
 * "Abtract" class that represents a calculator variable.
 */
export default class CalcVar {

  constructor (initObj) {
    // This is an "abstract" class, prevent user from instantiating one directly
    if (this.constructor === CalcVar) {
      throw new TypeError('Abstract class "CalcVar" cannot be instantiated directly.')
    }

    if (!initObj) {
      throw new Error('An initObj must be provided to CalcVar.constructor().')
    }

    if (!initObj.name) {
      throw new Error('Please provide a unique calculator variable name via initObj.name.')
    }
    this.name = initObj.name
    this.typeEqn = initObj.typeEqn
    this.eqn = initObj.eqn

    // this.calc will be assigned when the calculator variable is added
    // to a calculator via Calc.addVar()
    this.calc = null

    if (initObj.rawVal === '') {
      this.rawVal = ''
    } else {
      this.rawVal = parseFloat(initObj.rawVal)
    }

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
    // if ((!initObj.helpText)) {
    //   throw new Error('No helpText string provided to CalcVar() for variable "' + this.name + '".')
    // }
    // this.helpText = initObj.helpText
  }

  getRawVal = () => {
    return this.rawVal
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
