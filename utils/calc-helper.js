
class CalcHelper {

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
      if (calcVar.type === 'output') {        
        CalcHelper.setDispValFromRawVal(calcVar)
      }
    }
  }

}

export default CalcHelper