export class Validators {
  /**
   * Makes sure that the input string is a number.
   * @param {string} value The input string to check.
   */
  static isNumber(value) {
    if(!isNaN(value)) {
      return [ 'ok', '']      
    } else {
      console.log('Validating ' + value)
      return [ 'error', 'Value must be a number.']
    }
  }

  static isInteger(value) {
    console.log('isInteger() called. value=')    
    if (Number.isInteger(value)) return [ 'ok', '' ]
    else return [ 'error', 'Number must be a number and an integer.']
  }

  static isPositive(value) {
    if(value >= 0) return [ 'ok', '' ]
    else return [ 'error', 'Value must be positive.' ]
  }

  static isGreaterThanZero(value) {
    if(value > 0) return [ 'ok', '' ]
    else return [ 'error', 'Value must be greater than 0.' ]
  }

}