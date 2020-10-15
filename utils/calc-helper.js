import { MetricPrefixes } from '~/utils/metric-prefixes'
import { Units, UnitsMultiplicative } from '~/utils/calc-units'

/**
 * Makes sure the input string is a number, with no additional alphabetical
 * characters after a valid number (which isNaN() won't pick up on!).
 * 
 * @param {string} s String to test if numeric.
 */
function isNumeric(s) {
  return !isNaN(s - parseFloat(s));
}

export class CalcHelper {

  // validators = Validators()

  static initCalc(calc) {
    for (let calcVarName in calc.calcVars) {
      let calcVar = calc.calcVars[calcVarName]
      if (calcVar.direction === 'input' && calcVar.type === 'numeric') {
        CalcHelper.setRawValFromDispVal(calcVar)      
      }      
    }

    calc.eqFn(calc.calcVars)
    for (let calcVarKey in calc.calcVars) {
      CalcHelper.runValidation(calc.calcVars[calcVarKey], calc)
    }
    CalcHelper.updateDispVals(calc.calcVars)
  }

  /**
   * Scales a raw value by the selected unit for this value, typically
   * resulting in a value in SI units. 
   * 
   * @param calcVar The calculator variable to get units of.
   * @returns The scaled value.
   */
  static setRawValFromDispVal(calcVar) {    
    const unit = calcVar.units.filter(unit => {
      if (Array.isArray(unit)) {
        console.log('WARNING: Using deprecated array-style units "' + unit + '".')
        return unit[0] == calcVar.selUnit
      } else if(unit instanceof Units) {
        return unit.name == calcVar.selUnit
      } else {
        throw Error('Unit type not supported.')
      }
    })[0]
    if(!unit) throw Error('"' + calcVar.selUnit + '" units not found for calcVar="' + calcVar.name + '". Available units=' + calcVar.units)

    let num = null
    // Support metric prefixes if allowed
    if (calcVar.metricPrefixes) {
      num = MetricPrefixes.stringToNum(calcVar.dispVal)
    } else {
      if (isNumeric(calcVar.dispVal))
        num = parseFloat(calcVar.dispVal)
      else
        num = NaN
    }

    // Convert to base units
    let rawVal = null
    if(Array.isArray(unit)) {
      rawVal = num * unit[1]
    } else if(unit instanceof UnitsMultiplicative) { 
      rawVal = num * unit.multiplier
    } else {
      throw Error('Type of unit ' + unit + ' not supported.')
    }    

    calcVar.rawVal = rawVal
  }

  static setDispValFromRawVal(calcVar) {    
    const unit = calcVar.units.filter(unit => {
      if (Array.isArray(unit)) {
        return unit[0] == calcVar.selUnit
      } else if(unit instanceof Units) {
        return unit.name == calcVar.selUnit
      } else {
        throw Error('Unit type not supported.')
      }
    })[0]
    if(!unit) throw Error('"' + calcVar.selUnit + '" units not found for calcVar="' + calcVar.name + '". Available units=' + calcVar.units)

    // Convert from base units
    let num = null
    if(Array.isArray(unit)) {
      num = calcVar.rawVal / unit[1]
    } else if(unit instanceof UnitsMultiplicative) { 
      num = calcVar.rawVal / unit.multiplier
    } else {
      throw Error('Type of unit ' + unit + ' not supported.')
    }    
  
    // Convert to string, rounding using sigFig
    // Support metric prefixes if allowed
    let numStr = null
    if (calcVar.metricPrefixes) {
      numStr = MetricPrefixes.numToString(num, calcVar.sigFig)
    } else {
      if (calcVar.sigFig) {        
        numStr = num.toPrecision(calcVar.sigFig)
      } else if (calcVar.format) {        
        numStr = calcVar.format(calcVar.rawVal)
      } else {
        throw Error('sigFig nor format set for calcVar "' + calcVar.name + "'.")
      }
    }

    calcVar.dispVal = numStr
  }

  /**
   * Performs validation of the provided calculator variable. Runs the validation
   * functions and sets calcVar.validation.state and calcVar.validation.msg.
   * 
   * @param {*} calcVar The calculator variable to you want to run validation on.
   * @param {*} calc The entire calculator (in case the variables validation depends
   *    on other variable states).
   * @returns Nothing.
   */
  static runValidation(calcVar, calc) {    
    if (typeof calcVar.validation === 'undefined')
      return
    // The entire calc object is provided because the validation might depend
    // on the state of other calc variables
    if (calcVar.validation.fn) {
      console.log('WARNING: Using deprecated "fn" property inside the validation object, Used "fns" array instead.')
      const validationResult = calcVar.validation.fn(calcVar.rawVal, calc)
      const validationState = validationResult[0]
      const validationMsg = validationResult[1]
      calcVar.validation.state = validationState
      calcVar.validation.msg = validationMsg
    } else if (calcVar.validation.fns) {      
      let validationResults = []
      for(const fn of calcVar.validation.fns) {
        let valueToValidate = null
        if (calcVar.type == 'numeric') {          
          console.log('true')
          valueToValidate = calcVar.rawVal
        } else {
          console.log('else')
          valueToValidate = calcVar.value
        }
        console.log('Validating the calc var')
        console.log(calcVar)
        console.log('calcVar.rawVal=' + calcVar.rawVal)
        console.log(valueToValidate)
        const validationResult = fn(valueToValidate, calc)
        validationResults.push(validationResult)
      }      
      // The following function sorts all the validation results so that the errors will be first,
      // warnings second, then 'oks'.
      validationResults.sort(function(x, y) {
        if (x[0] == 'error') {
          if (y[0] == 'error') {
            return 0
          } else {
            return -1
          }
        } else if (x[0] == 'warning') {
          if (y[0] == 'error') {
            return 1
          } else if (y[0] == 'warning') {
            return 0
          } else {
            return -1
          }
        } else if (x[0] == 'ok') {
          if (y[0] == 'ok') {
            return 0
          } else {
            return 1
          }
        }
      })            
      if (validationResults.length >= 1){
        const validationResult = validationResults[0]
        const validationState = validationResult[0]
        const validationMsg = validationResult[1]
        calcVar.validation.state = validationState
        calcVar.validation.msg = validationMsg
      } else {
        calcVar.validation.state = 'ok'
        calcVar.validation.msg = ''
      }
      console.log('Validation finished. calcVar=')
      console.log(calcVar)
    }
  }

  static isValid(calcVar) {
    if (calcVar.validation.state === 'ok') {
      return true
    } else {      
      return false
    }
  }

  static isValidMany(calcVars) {
    for (const calcVar of calcVars) {
      if (!this.isValid(calcVar)) {
        console.log('Variable invalid! calcVar.name=' + calcVar.name)
        console.log(calcVar)
        return false
      }
    }
    return true
  }

  static updateDispVals(calcVars) {
    // Sync all output raw vals to disp vals
    for (let calcVarName in calcVars) {
      let calcVar = calcVars[calcVarName]
      if (!calcVar.type) {
        console.log('WARNING: calcVar "' + calcVarName + '" did not provide a type, assuming numeric.')
        calcVar.type = 'numeric'
      }
      if (calcVar.direction === 'output' && calcVar.type == 'numeric') {        
        CalcHelper.setDispValFromRawVal(calcVar)
      }
    }
  }

  static handleValueChanged(calc, event) {
    console.log('handleValueChanged() called.')
    if (!calc) throw Error('Calc must be provided')
    if (!event) throw Error('Event must be provided')
    let calcVar = calc.calcVars[event.target.name]
    if (!calcVar) throw Error('Calculator variable with name "' + event.target.name + '" was not found.')
    if (!calcVar.type) {
      console.log('WARNING: calcVar "' + event.target.name + '" did not provide a type, assuming numeric.')
      calcVar.type = 'numeric'
    }

    if (calcVar.type == 'checkbox') {
      calcVar.value = event.target.checked
    } else if (calcVar.type == 'numeric') {
      const value = event.target.valueAsNumber || event.target.value
      calcVar.dispVal = value
      // Recalculate raw value from displayed value
      CalcHelper.setRawValFromDispVal(calcVar)
    } else if (calcVar.type == 'select') {
      // Select has no notion of raw and disp values, just "selOption"
      calcVar.selOption = event.target.value
    } else if (calcVar.type == 'string') {
      // Strings are easy, just set the value
      calcVar.value = event.target.value
    } else {
      throw Error('Variable type "' + calcVar.type + '" for variable "' + event.target.name + '" not supported.')
    }
    
    calc.eqFn(calc.calcVars)
    for (let calcVarKey in calc.calcVars) {
      CalcHelper.runValidation(calc.calcVars[calcVarKey], calc)
    }
    CalcHelper.updateDispVals(calc.calcVars)
  }

  static handleUnitsChanged(calc, event) {
    let calcVar = calc.calcVars[event.target.name]
    calcVar.selUnit = event.target.value
    if (calcVar.direction === 'input')
      CalcHelper.setRawValFromDispVal(calcVar)    
    calc.eqFn(calc.calcVars)
    for (let calcVarKey in calc.calcVars) {
      CalcHelper.runValidation(calc.calcVars[calcVarKey], calc)
    }
    CalcHelper.updateDispVals(calc.calcVars)
  }

  /**
   * Call this when a input/output radio button is changed. Updates the calculator state
   * based on the new variable directions.
   * 
   * @param {*} calc 
   * @param {*} event 
   */
  static handleRbChanged(calc, event) {
    for (let calcVarId in calc.calcVars) {      
      if (calcVarId == e.target.value) {        
        calc.calcVars[calcVarId].direction = "output"
      } else {        
        calc.calcVars[calcVarId].direction = "input"
      }
    }
  }

}

export default CalcHelper
