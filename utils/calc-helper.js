
class CalcHelper {

  static initCalc(calc) {
    for (let calcVarName in calc.calcVars) {
      let calcVar = calc.calcVars[calcVarName]
      if (calcVar.direction === 'input') {
        CalcHelper.setRawValFromDispVal(calcVar)
        CalcHelper.runValidation(calcVar)
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
      return unit[0] == calcVar.selUnit
    })[0]
    const rawVal = calcVar.dispVal * unit[1]
    calcVar.rawVal = rawVal
  }

  static setDispValFromRawVal(calcVar) {    
    const unit = calcVar.units.filter(unit => {
      return unit[0] == calcVar.selUnit
    })[0]
    const dispValNumeric = calcVar.rawVal / unit[1]
    // Convert to string, rounding using sigFig
    if (!('sigFig' in calcVar)) {
      console.log('WARNING: calcVar "' + calcVar.name + '" does not have sigFig set.')
    }
    const dispVal = dispValNumeric.toPrecision(calcVar.sigFig)
    calcVar.dispVal = dispVal
  }

  static runValidation(calcVar) {
    if (!('validation' in calcVar)) return
    const validationResult = calcVar.validation.fn(calcVar.rawVal)
    const validationState = validationResult[0]
    const validationMsg = validationResult[1]
    calcVar.validation.state = validationState
    calcVar.validation.msg = validationMsg
  }

  static updateDispVals(calcVars) {
    // Sync all output raw vals to disp vals
    for (let calcVarName in calcVars) {
      let calcVar = calcVars[calcVarName]
      if (calcVar.direction === 'output') {        
        CalcHelper.setDispValFromRawVal(calcVar)
      }
    }
  }

  static handleValueChanged(calc, event) {
    const value = event.target.valueAsNumber || event.target.value
    let calcVar = calc.calcVars[event.target.name]
    calcVar.dispVal = value
    // Recalculate raw value from displayed value
    CalcHelper.setRawValFromDispVal(calcVar)
    CalcHelper.runValidation(calcVar)
    calc.eqFn(calc.calcVars)
    CalcHelper.updateDispVals(calc.calcVars)
  }

  static handleUnitsChanged(calc, event) {
    let calcVar = calc.calcVars[event.target.name]
    calcVar.selUnit = event.target.value
    if (calcVar.direction === 'input')
      CalcHelper.setRawValFromDispVal(calcVar)
    CalcHelper.runValidation(calcVar)
    calc.eqFn(calc.calcVars)
    CalcHelper.updateDispVals(calc.calcVars)
  }

}

export default CalcHelper