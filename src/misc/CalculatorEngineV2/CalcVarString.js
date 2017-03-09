import {stringManipulation} from 'src/misc/StringManipulation/StringManipulation'

import CalcVar from './CalcVar'
import {CustomValidator} from './CustomValidator'

/**
 * This variable enumerates the preset validators available to the CalcVarString class.
 * @type {{IS_HEX: string}}
 */
export var CalcVarStringPresetValidators = {
  IS_HEX: 'IS_HEX'
}

/**
 * A calculator variable which accepts a generic string.
 */
export class CalcVarString extends CalcVar {
  constructor (initObj) {
    // Check initObj
    if (!(initObj.validators instanceof Array)) {
      throw new Error('Please provide an array to initObj.validators to the CalcVarString.constructor() for variable "' + initObj.name + '".')
    }
    if (!initObj.helpText) {
      throw new Error('Please provide help text via initObj.helpText to the CalcVarString.constructor() for variable "' + initObj.name + '".')
    }

    super(initObj)

    this.val = initObj.defaultVal
    this.helpText = initObj.helpText
  }

  getVal = () => {
    return this.val
  }

  /**
   * Designed to be called by vue.
   */
  onValChange = () => {
    this.validate()
    this.triggerReCalcOutputsAndValidate()
  }

  reCalc = () => {
    if (this.typeEqn() !== 'output') {
      throw new Error('reCalc() called for variable that was not an output.')
    }
    this.val = this.eqn()
    this.validate()
  }

  /**
   * Provide validate() function.
   */
  validate = () => {
    // Reset current validation result
    this.validationResult = 'ok'
    this.validationMsg = ''
    var self = this
    this.validators.map(function (validator) {
      var validationResult = 'ok'
      var validationMsg = ''
      if (validator instanceof CustomValidator) {
        // Validator must be a custom function
        var result = validator.func()
        if (!result) {
          validationResult = validator.level
          validationMsg = validator.text
        }
      } else {
        // Validator must be a preset
        switch (validator) {
          case CalcVarStringPresetValidators.IS_HEX:
            if (!stringManipulation.isHex(self.val)) {
              validationResult = 'error'
              validationMsg = 'Value must be valid "hex" number. Only the numbers 0-9 and characters A-F are allowed (and no "0x" prefix).'
            }
            break
          default:
            throw new Error('Validator was not recognised!')
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
}
