/**
 * "Abstract" class that represents a calculator variable.
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
      // Make sure all validators are defined
      for (var validator of initObj.validators) {
        if (!validator) {
          throw new Error('Undefined validator provided to calculator variable "' + this.name + '".')
        }
      }

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
    throw new Error('Virtual method validate() called for calculator variable "' + this.name + '".')
  }

  isStringANumber = (number) => {
    if (number === '') {
      return false
    }

    // console.log('isNumber() called with number = ' + number)
    return !isNaN(number)
  }

}
