import { MetricPrefixes } from '~/utils/metric-prefixes'
import { Units, UnitsMultiplicative } from '~/utils/calc-units'

export class Validators {
  /**
   * Makes sure that the input string is a number.
   * @param {string} value The input string to check.
   */
  static isNumber(value) {
    if(!isNaN(value)) {
      return [ 'ok', '']      
    } else {
      return [ 'error', 'Value must be a number.']
    }
  }

  static isPositive(value) {
    if(value >= 0) return [ 'ok', '' ]
    else return [ 'error', 'Value must be positive.' ]
  }
}

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
      if (calcVar.direction === 'input') {
        CalcHelper.setRawValFromDispVal(calcVar)
        CalcHelper.runValidation(calcVar, calc)
      }
    }

    calc.eqFn(calc.calcVars)
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

  static runValidation(calcVar, calc) {
    if (!('validation' in calcVar)) return
    // The entire calc object is provided because the validation might depend
    // on the state of other calc variables
    if (calcVar.validation.fn) {
      const validationResult = calcVar.validation.fn(calcVar.rawVal, calc)
      const validationState = validationResult[0]
      const validationMsg = validationResult[1]
      calcVar.validation.state = validationState
      calcVar.validation.msg = validationMsg
    } else if (calcVar.validation.fns) {      
      let validationResults = []
      for(const fn of calcVar.validation.fns) {
        const validationResult = fn(calcVar.rawVal, calc)
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

    }
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
    
    let calcVar = calc.calcVars[event.target.name]
    if (!calcVar.type) {
      console.log('WARNING: calcVar "' + event.target.name + '" did not provide a type, assuming numeric.')
      calcVar.type = 'numeric'
    }
    if (calcVar.type == 'numeric') {
      const value = event.target.valueAsNumber || event.target.value
      calcVar.dispVal = value
      // Recalculate raw value from displayed value
      CalcHelper.setRawValFromDispVal(calcVar)
    } else if (calcVar.type == 'select') {
      // Select has no notion of raw and disp values, just "selOption"
      calcVar.selOption = event.target.value
    }
    CalcHelper.runValidation(calcVar, calc)
    calc.eqFn(calc.calcVars)
    CalcHelper.updateDispVals(calc.calcVars)
  }

  static handleUnitsChanged(calc, event) {
    let calcVar = calc.calcVars[event.target.name]
    calcVar.selUnit = event.target.value
    if (calcVar.direction === 'input')
      CalcHelper.setRawValFromDispVal(calcVar)
    CalcHelper.runValidation(calcVar, calc)
    calc.eqFn(calc.calcVars)
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
