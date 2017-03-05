import CalcVar from './CalcVar'
console.log(CalcVar)
/**
 * A calculator variable which accepts a generic string.
 */
export class CalcVarString extends CalcVar {
  constructor (initObj) {
    super(initObj)

    this.val = initObj.defaultVal
  }

  getVal = () => {
    console.log('CalcVarString.getVal() called.')
    return this.val
  }

  onValChange = () => {
    console.log('CalcVarString.onValChange() called. this.val = ' + this.val)
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
}
